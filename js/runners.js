/* ══════════════════════════════════════════════════════════════
   runners.js — Kod çalıştırma motorları
   • Python  → Pyodide (WASM)
   • Lua     → Fengari (WASM)
   • JS / TS → new Function() sandbox
   • Diğerleri → Judge0 CE (ce.judge0.com)
   Bağımlılık: addDebugLog, escapeHtml, translations, currentLang,
               srcLang, tgtLang (main.js & i18n.js'te)
══════════════════════════════════════════════════════════════ */

/* ── Yardımcılar ─────────────────────────────────────────── */
function getTimestamp() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
}

const logIcons = { info:'ℹ', warning:'⚠', error:'✗', success:'✓', debug:'🔍' };

function addDebugLog(outEl, level, message) {
  const icon = logIcons[level] || '•';
  const logDiv = document.createElement('div');
  logDiv.className = `log-line ${level}`;
  logDiv.innerHTML = `
    <span class="log-time">${getTimestamp()}</span>
    <span class="log-icon">${icon}</span>
    <span class="log-message">${escapeHtml(message)}</span>
  `;
  outEl.appendChild(logDiv);
  logDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Terminal panel ──────────────────────────────────────── */
function toggleRun(side) {
  const wrap  = document.getElementById('runPanelWrap');
  const badge = document.getElementById('runLangBadge');
  const lang  = side === 'src' ? srcLang : tgtLang;
  badge.textContent = lang.name;
  wrap.classList.add('open');
  simulateRun(side);
  document.querySelectorAll('.run-btn').forEach(b => b.classList.remove('run-active'));
  const btn = document.getElementById(side + 'RunBtn');
  if (btn) btn.classList.add('run-active');
}

function closeRun() {
  document.getElementById('runPanelWrap').classList.remove('open');
  document.querySelectorAll('.run-btn').forEach(b => b.classList.remove('run-active'));
}

/* ── Ana çalıştırma yönlendirici ─────────────────────────── */
function simulateRun(side) {
  const code  = document.getElementById(side + 'Code').value;
  const outEl = document.getElementById('runOutput');
  const lang  = side === 'src' ? srcLang : tgtLang;
  const t     = translations[currentLang];

  outEl.innerHTML = '';
  addDebugLog(outEl, 'info', t.running(lang.name));

  if (!code || code.trim() === '') {
    setTimeout(() => addDebugLog(outEl, 'error', t.noCode), 400);
    return;
  }

  const lines = code.split('\n').length;
  addDebugLog(outEl, 'debug', `${t.lines(lines)} • ${t.chars(code.length)}`);

  // ── TypeScript ──────────────────────────────────────────
  if (lang.id === 'typescript') {
    addDebugLog(outEl, 'info', translations[currentLang]?.runningTS || 'TypeScript → JavaScript...');
    setTimeout(() => {
      try {
        const jsCode = transpileTypeScript(code);
        addDebugLog(outEl, 'debug', 'Dönüştürülen kod: ' + jsCode.substring(0, 100) + (jsCode.length > 100 ? '...' : ''));
        const logs = [];
        const fakeConsole = {
          log:   (...a) => logs.push({ level: 'success', msg: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
          error: (...a) => logs.push({ level: 'error',   msg: a.join(' ') }),
          warn:  (...a) => logs.push({ level: 'warning', msg: a.join(' ') }),
          info:  (...a) => logs.push({ level: 'info',    msg: a.join(' ') }),
        };
        new Function('console', jsCode)(fakeConsole);
        if (logs.length === 0) addDebugLog(outEl, 'success', translations[currentLang]?.noOutput || 'Code executed (no output)');
        else logs.forEach(log => addDebugLog(outEl, log.level, log.msg));
      } catch (e) {
        addDebugLog(outEl, 'error', `${translations[currentLang]?.jsError || 'Error'}: ${e.message}`);
      }
    }, 300);
    return;
  }

  // ── Lua (Fengari WASM) ──────────────────────────────────
  if (lang.id === 'lua') {
    addDebugLog(outEl, 'info', translations[currentLang]?.runningLua || '🌙 Running Lua (Fengari)...');
    setTimeout(async () => {
      const result = await runLua(code);
      if (result.success) {
        if (result.output.length === 0) addDebugLog(outEl, 'success', translations[currentLang]?.noOutput || 'Code executed (no output)');
        else result.output.forEach(line => addDebugLog(outEl, 'success', line));
      } else {
        addDebugLog(outEl, 'error', `${translations[currentLang]?.jsError || 'Error'}: ${result.error}`);
      }
    }, 300);
    return;
  }

  // ── JavaScript ──────────────────────────────────────────
  if (lang.id === 'javascript') {
    addDebugLog(outEl, 'info', translations[currentLang]?.runningJS || 'Running JavaScript...');
    setTimeout(() => {
      const logs = [];
      const fakeConsole = {
        log:   (...a) => logs.push({ level: 'success', msg: a.map(x => typeof x === 'object' ? JSON.stringify(x, null, 2) : String(x)).join(' ') }),
        error: (...a) => logs.push({ level: 'error',   msg: a.join(' ') }),
        warn:  (...a) => logs.push({ level: 'warning', msg: a.join(' ') }),
        info:  (...a) => logs.push({ level: 'info',    msg: a.join(' ') }),
      };
      try {
        new Function('console', code)(fakeConsole);
        if (logs.length === 0) addDebugLog(outEl, 'success', translations[currentLang]?.noOutput || 'Code executed (no output)');
        else logs.forEach(log => addDebugLog(outEl, log.level, log.msg));
      } catch (e) {
        addDebugLog(outEl, 'error', `${translations[currentLang]?.jsError || 'Error'}: ${e.message}`);
      }
    }, 300);
    return;
  }

  // ── Python (Pyodide WASM) ───────────────────────────────
  if (lang.id === 'python') {
    addDebugLog(outEl, 'info', translations[currentLang]?.runningPython || '🐍 Running Python (Pyodide)...');
    setTimeout(async () => {
      const result = await runPython(code);
      if (result.success) {
        if (result.output.length === 0 || (result.output.length === 1 && result.output[0] === '(çıktı yok)'))
          addDebugLog(outEl, 'success', translations[currentLang]?.noOutput || 'Code executed (no output)');
        else
          result.output.forEach(line => { if (line.trim()) addDebugLog(outEl, 'success', line); });
      } else {
        addDebugLog(outEl, 'error', `${translations[currentLang]?.jsError || 'Error'}: ${result.error}`);
      }
    }, 500);
    return;
  }

  // ── Diğer diller → Judge0 CE ────────────────────────────
  addDebugLog(outEl, 'info', `⚙️ ${lang.name} ${translations[currentLang]?.runningGeneric || 'running...'}`);
  setTimeout(async () => {
    const result = await runWithJudge0(lang, code);
    if (result.success) {
      if (!result.output || result.output.trim() === '')
        addDebugLog(outEl, 'success', `${lang.name} ${translations[currentLang]?.noOutput || 'executed (no output)'}`);
      else
        result.output.split('\n').forEach(line => { if (line.trim()) addDebugLog(outEl, 'success', line); });
      if (result.stderr && result.stderr.trim())
        result.stderr.split('\n').forEach(line => { if (line.trim()) addDebugLog(outEl, 'warning', line); });
    } else {
      result.error.split('\n').forEach(line => { if (line.trim()) addDebugLog(outEl, 'error', line); });
    }
  }, 300);
}

/* ── TypeScript transpiler ───────────────────────────────── */
function transpileTypeScript(code) {
  let js = code;
  js = js.replace(/:\s*[a-zA-Z][\w<>[\]|&?]*/g, '');
  js = js.replace(/interface\s+\w+\s*{[^}]*}/g, '');
  js = js.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  js = js.replace(/as\s+[a-zA-Z][\w<>[\]|&?]*/g, '');
  js = js.replace(/<[a-zA-Z][\w<>[\]|&?]*>/g, '');
  js = js.replace(/!\./g, '.');
  js = js.replace(/abstract\s+/g, '');
  js = js.replace(/readonly\s+/g, '');
  js = js.replace(/private\s+|public\s+|protected\s+/g, '');
  js = js.replace(/const\s+enum/g, 'const');
  js = js.replace(/namespace\s+\w+\s*{[^}]*}/g, '');
  js = js.replace(/declare\s+/g, '');
  js = js.replace(/export\s*=\s*([^;]+);/g, 'module.exports = $1;');
  return js;
}

/* ── Python Runner (Pyodide) ─────────────────────────────── */
let pyodide = null;
let pyodideLoading = false;

async function initPyodide() {
  if (pyodide) return pyodide;
  if (pyodideLoading) {
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (pyodide || !pyodideLoading) { clearInterval(check); resolve(); }
      }, 100);
    });
    return pyodide;
  }
  pyodideLoading = true;
  try {
    // 🔧 DÜZELTME: translations ve currentLang'i doğrudan kullan
    const lang = currentLang;
    const terminalMsg = translations[currentLang]?.pythonLoading || '🐍 Loading Python runtime...';
    addDebugLog(document.getElementById('runOutput'), 'info', terminalMsg);
    
    pyodide = await loadPyodide();
    
    const readyMsg = translations[lang]?.terminal?.pythonReady || translations[currentLang]?.pythonReady || '✅ Python runtime ready!';
    addDebugLog(document.getElementById('runOutput'), 'success', readyMsg);
    
    await pyodide.loadPackage(['micropip']);
  } catch (err) {
    const lang = currentLang;
    const errorMsg = translations[currentLang]?.pythonFailed || '❌ Python runtime failed:';
    addDebugLog(document.getElementById('runOutput'), 'error', `${errorMsg} ${err.message}`);
    pyodide = null;
  } finally {
    pyodideLoading = false;
  }
  return pyodide;
}

async function runPython(code) {
  try {
    const python = await initPyodide();
    if (!python) return { success: false, output: [], error: 'Python runtime yüklenemedi.' };

    python.runPython(`
import sys
from io import StringIO
class CaptureOutput:
    def __init__(self): self.buffer = StringIO()
    def write(self, text): self.buffer.write(text)
    def get_output(self): return self.buffer.getvalue()
capture = CaptureOutput()
sys.stdout = capture
sys.stderr = capture
    `);

    let output = [], errorOutput = [];
    try {
      python.runPython(code);
      const captured = python.runPython(`capture.get_output()`);
      output = (captured && captured.trim()) ? captured.trim().split('\n') : ['(çıktı yok)'];
    } catch (e) {
      errorOutput.push(e.toString());
    }

    python.runPython(`sys.stdout = sys.__stdout__\nsys.stderr = sys.__stderr__`);

    if (errorOutput.length > 0) return { success: false, output: [], error: errorOutput.join('\n') };
    return { success: true, output, error: null };
  } catch (err) {
    return { success: false, output: [], error: err.message };
  }
}

/* ── Lua Runner (Fengari) ────────────────────────────────── */
async function runLua(code) {
  return new Promise((resolve) => {
    if (typeof fengari === 'undefined') {
      resolve({ success: false, output: [], error: 'Lua runtime (Fengari) yüklenemedi. Sayfayı yenileyin.' });
      return;
    }
    const output = [];
    try {
      const wrappedCode = `
local _out = {}
local _orig_print = print
print = function(...)
  local parts = {}
  local n = select('#', ...)
  for i = 1, n do parts[i] = tostring(select(i, ...)) end
  _out[#_out + 1] = table.concat(parts, "\\t")
  _orig_print(...)
end
do
${code}
end
return table.concat(_out, "\\n")
`;
      const fn = fengari.load(wrappedCode);
      if (typeof fn !== 'function') { resolve({ success: false, output: [], error: 'Lua derleme hatası.' }); return; }
      const result = fn();
      if (typeof result === 'string' && result.trim() !== '')
        result.split('\n').forEach(line => { if (line !== '') output.push(line); });
      resolve({ success: true, output, error: null });
    } catch (err) {
      let msg = (err && err.message) ? err.message : String(err);
      msg = msg.replace(/\[string "[^"]*"\]:(\d+):/g, 'satır $1:');
      resolve({ success: false, output: [], error: msg });
    }
  });
}

/* ── Judge0 CE Runner ────────────────────────────────────── */
const JUDGE0_CE_API = 'https://ce.judge0.com/submissions?base64_encoded=true&wait=true';

const JUDGE0_LANGS = {
  rust:    73,
  go:      60,
  cpp:     54,
  c:       50,
  java:    62,
  csharp:  51,
  swift:   83,
  kotlin:  78,
  ruby:    72,
  php:     68,
  dart:    90,
  scala:   81,
  haskell: 61,
};

function b64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function b64Decode(str) {
  if (!str) return '';
  try { return decodeURIComponent(escape(atob(str))); }
  catch (e) { return atob(str); }
}

async function runWithJudge0(lang, code) {
  const langId = JUDGE0_LANGS[lang.id];
  if (!langId) {
    // Browser'da çalışan diller Judge0'a gelmemeli
    const browserLangs = ['javascript', 'typescript', 'python', 'lua'];
    if (browserLangs.includes(lang.id)) {
      return { success: false, output: '', stderr: '', error: `${lang.name} browser'da çalışır, ▶ butonunu kullanın.` };
    }
    return { success: false, output: '', stderr: '', error: `${lang.name} için Judge0 ID tanımlı değil.` };
  }

  try {
    const response = await fetch(JUDGE0_CE_API, {
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

    if (!response.ok) {
      const txt = await response.text();
      return { success: false, output: '', stderr: '', error: `Judge0 API hatası (HTTP ${response.status}): ${txt}` };
    }

    const data = await response.json();
    const stdout        = b64Decode(data.stdout);
    const stderr        = b64Decode(data.stderr);
    const compileOutput = b64Decode(data.compile_output);
    const statusId      = data.status?.id ?? 0;
    const statusDesc    = data.status?.description || '';

    if (statusId === 6) return { success: false, output: stdout, stderr: '', error: compileOutput || 'Derleme hatası' };
    if (statusId >= 7 && statusId <= 14) return { success: false, output: stdout, stderr: '', error: stderr || compileOutput || statusDesc };

    return { success: true, output: stdout, stderr, error: null };
  } catch (err) {
    return { success: false, output: '', stderr: '', error: `Bağlantı hatası: ${err.message}` };
  }
}