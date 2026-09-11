/* ══════════════════════════════════════════════════════════════
   translate.js — Çeviri + Judge0 ile otomatik analiz
   1. Groq → saf kod çevirisi
   2. Judge0 → otomatik çalıştır, sonuca göre badge ver
   Bağımlılık: srcLang, tgtLang, updateLineNums, runWithJudge0,
               addDebugLog, translations, currentLang
══════════════════════════════════════════════════════════════ */

const GROQ_MODEL = 'openai/gpt-oss-120b';

// Yerel test için geçici Groq API Key (Localhost dışındaki canlı ortamda proxy kullanılır)
const LOCAL_GROQ_API_KEY = '';

async function groqRequest(messages) {
  // Çalışılan ortamı tespit et (Localhost/Dosya mı yoksa Canlı Sunucu mu?)
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.protocol === 'file:'
  );

  let response;

  if (isLocalhost) {
    // ── YEREL ORTAM (Doğrudan Groq API) ──────────────────────────
    response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 4096,
      })
    });
  } else {
    // ── NETLIFY CANLI ORTAM (Netlify Function Proxy) ───────────
    response = await fetch('/.netlify/functions/api-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'groq',
        payload: {
          model: GROQ_MODEL,
          messages,
          temperature: 0.3,
          max_tokens: 4096,
        }
      })
    });
  }

  // 1. Yanıtı ham metin olarak al (Empty JSON hatasını önlemek için)
  const textResponse = await response.text();

  // 2. Eğer yanıt gövdesi boşsa fırlat
  if (!textResponse || !textResponse.trim()) {
    throw new Error('Sunucudan boş yanıt döndü (Netlify Function zaman aşımına uğramış veya local istek başarısız olmuş olabilir).');
  }

  // 3. Güvenli şekilde JSON parse et
  let data;
  try {
    data = JSON.parse(textResponse);
  } catch (e) {
    throw new Error(`Geçersiz yanıt biçimi alındı: ${textResponse.substring(0, 80)}...`);
  }

  // 4. HTTP hata kontrolü
  if (!response.ok) {
    throw new Error(data.error?.message || `HTTP ${response.status}`);
  }

  return data.choices[0]?.message?.content || '';
}

async function runTranslation() {
  const code = document.getElementById('srcCode').value.trim();
  if (!code) {
    document.getElementById('tgtCode').value = translations[currentLang]?.placeholderTgt || '// Please enter source code...';
    return;
  }

  const btn = document.getElementById('translateBtn');
  const tgt = document.getElementById('tgtCode');
  btn.classList.add('loading');
  tgt.value = translations[currentLang]?.translating || '// Translating...';
  clearLineAnalysis();
  hideTranslationWarning();

  try {
    // ── AŞAMA 1: Groq ile saf kod çevirisi ─────────────────
    const wrapperNotes = {
      rust:    'IMPORTANT: Always wrap code in fn main() { } if not already present.',
      java:    'IMPORTANT: Always wrap code in public class Main { public static void main(String[] args) { } }',
      c:       'IMPORTANT: Always wrap code in int main() { ... return 0; } and include necessary headers.',
      cpp:     'IMPORTANT: Always wrap code in int main() { ... return 0; } and include necessary headers.',
      kotlin:  'IMPORTANT: Always wrap code in fun main() { } if not already present.',
      swift:   'IMPORTANT: Ensure code is runnable as a Swift script or wrapped in a proper entry point.',
      scala:   'IMPORTANT: Always wrap code in object Main extends App { }',
      haskell: 'IMPORTANT: Always include main :: IO () and main = do if not present.',
      csharp:  'IMPORTANT: Always wrap in class Main { static void Main(string[] args) { } }',
    };
    const wrapperNote = wrapperNotes[tgtLang.id] || '';

    const translatedCode = await groqRequest([
      {
        role: 'system',
        content: `You are a code translator. Output ONLY the translated code. No explanations, no markdown backticks, no comments about the translation. ${wrapperNote}`,
      },
      {
        role: 'user',
        content: `Convert this ${srcLang.name} code to ${tgtLang.name}. Return ONLY the complete, runnable code:\n\n${code}`,
      },
    ]);

    const cleanCode = translatedCode.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
    tgt.value = cleanCode || (translations[currentLang]?.translateEmpty || '// Translation result was empty.');
    updateLineNums('tgt');
    document.getElementById('tgtLines').textContent = cleanCode.split('\n').length + ' satır';

    // ── AŞAMA 2: Judge0 ile otomatik test & badge ───────────
    showTestButton();
    showTranslationWarning();
    await autoAnalyzeWithJudge0(cleanCode);

  } catch (err) {
    tgt.value = `// ${translations[currentLang]?.translateError || 'Translation error'}: ${err.message}`;
  }

  btn.classList.remove('loading');
}

/* ── Judge0 ile otomatik analiz ──────────────────────────── */
async function autoAnalyzeWithJudge0(code) {
  // JS, TS, Python, Lua browser'da çalışıyor — Judge0 analizi gerekmez
  const browserLangs = ['javascript', 'typescript', 'python', 'lua'];
  if (browserLangs.includes(tgtLang.id)) {
    // Browser dilleri için tüm satırlar ✅ (gerçek test terminalde yapılır)
    applyBadgesToAllLines('✅');
    return;
  }

  const JUDGE0_LANGS = {
    rust: 73, go: 60, cpp: 54, c: 50, java: 62,
    csharp: 51, swift: 83, kotlin: 78, ruby: 72,
    php: 68, dart: 90, scala: 81, haskell: 61,
  };

  const langId = JUDGE0_LANGS[tgtLang.id];
  if (!langId) return;

  try {
    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id:     langId,
        source_code:     b64Encode(code),
        stdin:           b64Encode(''),
        cpu_time_limit:  10,
        memory_limit:    256000,
        wall_time_limit: 15,
      })
    });

    if (!response.ok) return;

    const data = await response.json();
    const statusId      = data.status?.id ?? 0;
    const stderr        = b64Decode(data.stderr  || '');
    const compileOutput = b64Decode(data.compile_output || '');
    const errorText     = (compileOutput + '\n' + stderr).trim();

    if (statusId === 3) {
      // Başarılı — tüm satırlar ✅
      applyBadgesToAllLines('✅');

    } else if (statusId === 6) {
      // Derleme hatası — hatalı satırları bul, gerisine ⚠️
      applyBadgesFromError(code, errorText, 'compile');

    } else if (statusId >= 7 && statusId <= 14) {
      // Runtime hatası — tüm satırlar ⚠️ (derlendi ama çalışmadı)
      applyBadgesToAllLines('⚠️');

    } else {
      // Bilinmeyen durum — ⚠️
      applyBadgesToAllLines('⚠️');
    }

  } catch (err) {
    // Bağlantı hatası — badge verme, sessiz geç
    console.warn('Judge0 analiz hatası:', err.message);
  }
}

/* ── Badge yardımcıları ──────────────────────────────────── */
function applyBadgesToAllLines(emoji) {
  const code = document.getElementById('tgtCode').value;
  const lineCount = code.split('\n').length;
  for (let i = 1; i <= lineCount; i++) {
    lineAnalysis[i] = emoji;
  }
  updateLineNums('tgt');
}

function applyBadgesFromError(code, errorText, type) {
  const lines = code.split('\n');
  const totalLines = lines.length;

  // Hata satırlarını parse et (örn: "main.rs:5:3", "Main.java:3:", ":5:")
  const errorLines = new Set();
  const patterns = [
    /[:\s](\d+):\d+/g,   // dosya:satır:kolon
    /[:\s](\d+):/g,       // dosya:satır:
    /line\s+(\d+)/gi,     // line 5
    /\[(\d+)\]/g,         // [5]
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(errorText)) !== null) {
      const lineNum = parseInt(match[1]);
      if (lineNum >= 1 && lineNum <= totalLines) {
        errorLines.add(lineNum);
      }
    }
  });

  for (let i = 1; i <= totalLines; i++) {
    if (errorLines.has(i)) {
      lineAnalysis[i] = '❌';
    } else if (lines[i-1].trim() === '' || lines[i-1].trim().startsWith('//') || lines[i-1].trim().startsWith('#')) {
      lineAnalysis[i] = '✅'; // boş satır veya yorum
    } else {
      lineAnalysis[i] = '⚠️'; // hatalı değil ama emin değiliz
    }
  }
  updateLineNums('tgt');
}

/* ── Uyarı notu ──────────────────────────────────────────── */
function showTranslationWarning() {
  let warn = document.getElementById('translationWarning');
  if (!warn) {
    warn = document.createElement('div');
    warn.id = 'translationWarning';
    warn.className = 'translation-warning';
    const codeWrap = document.querySelector('.panel-target .code-wrap');
    if (codeWrap) codeWrap.insertAdjacentElement('afterend', warn);
  }
  const t = translations[currentLang];
  warn.textContent = t.translationWarning || '⚠️ AI çeviriler %100 doğru olmayabilir. Önemli kodları kontrol edin. Çok hata alırsanız tekrar deneyin.';
  warn.style.display = 'block';
}

function hideTranslationWarning() {
  const warn = document.getElementById('translationWarning');
  if (warn) warn.style.display = 'none';
}

/* ── Test Et butonu ──────────────────────────────────────── */
function showTestButton() {
  let testBtn = document.getElementById('testCodeBtn');
  if (!testBtn) {
    testBtn = document.createElement('button');
    testBtn.id        = 'testCodeBtn';
    testBtn.className = 'action-btn test-btn';
    testBtn.title     = 'Judge0 ile Test Et';
    testBtn.innerHTML = `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M3 2.5l8 4.5-8 4.5z" stroke-width="1.5" fill="currentColor" stroke="none"/>
    </svg>`;
    testBtn.onclick = testTranslatedCode;
    document.querySelector('.panel-target .panel-actions').appendChild(testBtn);
  }
  testBtn.style.display = '';
}

async function testTranslatedCode() {
  const rawCode = document.getElementById('tgtCode').value.trim();
  if (!rawCode) return;

  // Browser'da çalışan diller için toggleRun kullan
  const browserLangs = ['javascript', 'typescript', 'python', 'lua'];
  if (browserLangs.includes(tgtLang.id)) {
    toggleRun('tgt');
    return;
  }

  const outEl = document.getElementById('runOutput');
  outEl.innerHTML = '';
  addDebugLog(outEl, 'info', translations[currentLang]?.testingCode?.replace('{lang}', tgtLang.name) || `⚙️ Testing ${tgtLang.name} (Judge0)...`);
  document.getElementById('runPanelWrap').classList.add('open');
  document.getElementById('runLangBadge').textContent = tgtLang.name;

  setTimeout(async () => {
    const result = await runWithJudge0(tgtLang, rawCode);
    if (result.success) {
      if (!result.output || result.output.trim() === '') {
        addDebugLog(outEl, 'success', translations[currentLang]?.noOutput?.replace('{lang}', tgtLang.name) || `✅ ${tgtLang.name} executed (no output)`);
      } else {
        result.output.split('\n').forEach(line => {
          if (line.trim()) addDebugLog(outEl, 'success', line);
        });
      }
      if (result.stderr && result.stderr.trim()) {
        result.stderr.split('\n').forEach(line => {
          if (line.trim()) addDebugLog(outEl, 'warning', line);
        });
      }
    } else {
      addDebugLog(outEl, 'error', translations[currentLang]?.testFailed || '❌ Test failed:');
      result.error.split('\n').forEach(line => {
        if (line.trim()) addDebugLog(outEl, 'error', line);
      });
    }
  }, 300);
}

/* ── b64 yardımcıları (runners.js'te de var, burada lokal) ── */
function b64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function b64Decode(str) {
  if (!str) return '';
  try { return decodeURIComponent(escape(atob(str))); }
  catch (e) { return atob(str); }
}