/* ══════════════════════════════════════════════════════════════
   editor.js — Editör: IntelliSense, klavye, satır numaraları,
               scroll sync, dosya yükleme
   Bağımlılık: tabSz, intelliSenseEnabled, srcLang (main.js'te)
══════════════════════════════════════════════════════════════ */

/* ── Snippet setleri ─────────────────────────────────────── */
const LANG_SNIPPETS = {
  python: {
    'pr':    () => `print()`,
    'prf':   () => `print(f"")`,
    'def':   () => `def name():\n    pass`,
    'cl':    () => `class Name:\n    def __init__(self):\n        pass`,
    'imp':   () => `import `,
    'from':  () => `from  import `,
    'for':   () => `for i in range(10):\n    pass`,
    'fore':  () => `for item in items:\n    pass`,
    'if':    () => `if condition:\n    pass`,
    'ife':   () => `if condition:\n    pass\nelse:\n    pass`,
    'elif':  () => `elif condition:\n    pass`,
    'while': () => `while condition:\n    pass`,
    'try':   () => `try:\n    pass\nexcept Exception as e:\n    print(e)`,
    'with':  () => `with open("file") as f:\n    pass`,
    'lam':   () => `lambda x: x`,
    'ret':   () => `return `,
    'main':  () => `if __name__ == "__main__":\n    main()`,
  },
  javascript: {
    'pr':    () => `console.log()`,
    'prw':   () => `console.warn()`,
    'pre':   () => `console.error()`,
    'fn':    () => `function name() {\n    \n}`,
    'afn':   () => `async function name() {\n    \n}`,
    'arr':   () => `const name = () => {\n    \n}`,
    'cl':    () => `class Name {\n    constructor() {\n        \n    }\n}`,
    'imp':   () => `import  from ''`,
    'exp':   () => `export default `,
    'for':   () => `for (let i = 0; i < arr.length; i++) {\n    \n}`,
    'fore':  () => `for (const item of items) {\n    \n}`,
    'if':    () => `if (condition) {\n    \n}`,
    'ife':   () => `if (condition) {\n    \n} else {\n    \n}`,
    'try':   () => `try {\n    \n} catch (e) {\n    console.error(e);\n}`,
    'prom':  () => `new Promise((resolve, reject) => {\n    \n})`,
    'aw':    () => `await `,
    'ret':   () => `return `,
    'con':   () => `const  = `,
    'let':   () => `let  = `,
  },
  typescript: {
    'pr':    () => `console.log()`,
    'fn':    () => `function name(): void {\n    \n}`,
    'afn':   () => `async function name(): Promise<void> {\n    \n}`,
    'cl':    () => `class Name {\n    constructor() {\n        \n    }\n}`,
    'int':   () => `interface Name {\n    \n}`,
    'type':  () => `type Name = `,
    'imp':   () => `import  from ''`,
    'if':    () => `if (condition) {\n    \n}`,
    'try':   () => `try {\n    \n} catch (e: unknown) {\n    console.error(e);\n}`,
    'ret':   () => `return `,
    'con':   () => `const : Type = `,
  },
  rust: {
    'pr':    () => `println!("")`,
    'prf':   () => `println!("{}", )`,
    'fn':    () => `fn name() {\n    \n}`,
    'pfn':   () => `pub fn name() {\n    \n}`,
    'str':   () => `struct Name {\n    \n}`,
    'en':    () => `enum Name {\n    \n}`,
    'imp':   () => `impl Name {\n    \n}`,
    'tr':    () => `trait Name {\n    \n}`,
    'if':    () => `if condition {\n    \n}`,
    'for':   () => `for i in 0..10 {\n    \n}`,
    'mat':   () => `match value {\n    _ => {}\n}`,
    'let':   () => `let  = `,
    'letm':  () => `let mut  = `,
    'ret':   () => `return `,
    'use':   () => `use `,
  },
  go: {
    'pr':    () => `fmt.Println()`,
    'prf':   () => `fmt.Printf("")`,
    'fn':    () => `func name() {\n    \n}`,
    'if':    () => `if condition {\n    \n}`,
    'for':   () => `for i := 0; i < 10; i++ {\n    \n}`,
    'fore':  () => `for _, v := range items {\n    \n}`,
    'str':   () => `type Name struct {\n    \n}`,
    'imp':   () => `import (\n    \n)`,
    'ret':   () => `return `,
    'err':   () => `if err != nil {\n    return err\n}`,
  },
  java: {
    'pr':    () => `System.out.println()`,
    'sout':  () => `System.out.println()`,
    'fn':    () => `public void name() {\n    \n}`,
    'pfn':   () => `public static void name() {\n    \n}`,
    'cl':    () => `public class Name {\n    \n}`,
    'if':    () => `if (condition) {\n    \n}`,
    'for':   () => `for (int i = 0; i < 10; i++) {\n    \n}`,
    'fore':  () => `for (Type item : items) {\n    \n}`,
    'try':   () => `try {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}`,
    'ret':   () => `return `,
    'imp':   () => `import `,
    'main':  () => `public class Main {\n    public static void main(String[] args) {\n        \n    }\n}`,
  },
  cpp: {
    'pr':    () => `std::cout << "" << std::endl;`,
    'fn':    () => `void name() {\n    \n}`,
    'cl':    () => `class Name {\npublic:\n    \n};`,
    'if':    () => `if (condition) {\n    \n}`,
    'for':   () => `for (int i = 0; i < 10; i++) {\n    \n}`,
    'fore':  () => `for (auto& item : items) {\n    \n}`,
    'inc':   () => `#include <`,
    'ns':    () => `namespace Name {\n    \n}`,
    'ret':   () => `return `,
  },
  c: {
    'pr':    () => `printf("")`,
    'prf':   () => `printf("%d\\n", )`,
    'fn':    () => `void name() {\n    \n}`,
    'if':    () => `if (condition) {\n    \n}`,
    'for':   () => `for (int i = 0; i < 10; i++) {\n    \n}`,
    'inc':   () => `#include <stdio.h>`,
    'def':   () => `#define NAME value`,
    'ret':   () => `return `,
    'main':  () => `int main() {\n    \n    return 0;\n}`,
  },
  _default: {
    'pr':  () => `print()`,
    'fn':  () => `function name() {}`,
    'cl':  () => `class Name {}`,
    'if':  () => `if condition {}`,
    'for': () => `for i in range {}`,
    'ret': () => `return `,
    'imp': () => `import `,
  }
};

function getSnippets() {
  return LANG_SNIPPETS[srcLang.id] || LANG_SNIPPETS._default;
}

/* ── Klavye handler ──────────────────────────────────────── */
function handleKeyDown(e) {
  const ta = e.target;

  if (!intelliSenseEnabled) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      const spaces = ' '.repeat(tabSz);
      ta.value = ta.value.substring(0, start) + spaces + ta.value.substring(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = start + tabSz;
      updateLineNums('src'); updateMeta('src');
    }
    return;
  }

  // Tab — snippet dene, yoksa girinti
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const currentLine = text.substring(lineStart, start);
    const word = currentLine.trim();
    const snippets = getSnippets();
    if (snippets[word]) {
      const expansion = snippets[word]();
      ta.value = text.substring(0, lineStart) + expansion + text.substring(start);
      ta.selectionStart = ta.selectionEnd = lineStart + expansion.length;
    } else {
      const spaces = ' '.repeat(tabSz);
      ta.value = text.substring(0, start) + spaces + text.substring(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = start + tabSz;
    }
    updateLineNums('src');
    updateMeta('src');
    return;
  }

  // Enter — otomatik girinti
  if (e.key === 'Enter') {
    e.preventDefault();
    const start = ta.selectionStart;
    const text = ta.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const line = text.substring(lineStart, start);
    const indent = line.match(/^(\s*)/)[1];
    const extra = /[{(\[:]$/.test(line.trim()) ? ' '.repeat(tabSz) : '';
    const ins = '\n' + indent + extra;
    ta.value = text.substring(0, start) + ins + text.substring(ta.selectionEnd);
    ta.selectionStart = ta.selectionEnd = start + ins.length;
    updateLineNums('src');
    updateMeta('src');
    return;
  }

  // Otomatik kapama parantezler
  const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
  if (pairs[e.key]) {
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const text  = ta.value;
    if (start !== end) {
      e.preventDefault();
      const selected = text.substring(start, end);
      const wrapped = e.key + selected + pairs[e.key];
      ta.value = text.substring(0, start) + wrapped + text.substring(end);
      ta.selectionStart = start + 1;
      ta.selectionEnd   = end + 1;
      updateLineNums('src'); updateMeta('src');
    }
  }
}

/* ── Satır numaraları & scroll ───────────────────────────── */

// Hedef panel satır analizi { lineNumber: '✅'|'⚠️'|'❌' }
let lineAnalysis = {};

function updateLineNums(side) {
  const ta = document.getElementById(side + 'Code');
  const ln = document.getElementById(side + 'LineNums');
  if (!lineNumsVisible) { ln.classList.remove('visible'); return; }
  ln.classList.add('visible');

  const lines = ta.value ? ta.value.split('\n').length : 1;
  ln.innerHTML = '';

  for (let i = 1; i <= lines; i++) {
    const row = document.createElement('div');
    row.className = 'line-num-row';

    const numSpan = document.createElement('span');
    numSpan.className = 'line-num-digit';
    numSpan.textContent = i;
    row.appendChild(numSpan);

    // Sadece hedef panelde ve analiz varsa badge ekle
    if (side === 'tgt' && Object.keys(lineAnalysis).length > 0) {
      const badge = document.createElement('span');
      const emoji = lineAnalysis[i];
      const t = translations[currentLang];
      if (emoji === '✅') {
        badge.className = 'line-badge badge-ok';
        badge.textContent = '✅';
        badge.setAttribute('data-tooltip', t.badgeOk);
      } else if (emoji === '⚠️') {
        badge.className = 'line-badge badge-warn';
        badge.textContent = '⚠️';
        badge.setAttribute('data-tooltip', t.badgeWarn);
      } else if (emoji === '❌') {
        badge.className = 'line-badge badge-err';
        badge.textContent = '❌';
        badge.setAttribute('data-tooltip', t.badgeErr);
      } else {
        badge.className = 'line-badge badge-empty';
      }
      // Tooltip pozisyonunu mouse'a göre ayarla
      badge.addEventListener('mouseenter', (e) => showBadgeTooltip(e, badge));
      badge.addEventListener('mouseleave', hideBadgeTooltip);
      row.appendChild(badge);
    }

    ln.appendChild(row);
  }
}

function clearLineAnalysis() {
  lineAnalysis = {};
  updateLineNums('tgt');
}

function syncScroll(side) {
  const ta = document.getElementById(side + 'Code');
  const ln = document.getElementById(side + 'LineNums');
  ln.scrollTop = ta.scrollTop;
}

function updateMeta(side) {
  const val   = document.getElementById(side + 'Code').value;
  const lines = val ? val.split('\n').length : 0;
  const t     = translations[currentLang];

  const linesEl = document.getElementById(side + 'Lines');
  if (linesEl) {
    linesEl.dataset.count   = lines;
    linesEl.textContent     = t ? t.lines(lines) : lines + ' satır';
  }
  if (side === 'src') {
    const charsEl = document.getElementById('srcChars');
    if (charsEl) {
      charsEl.dataset.count = val.length;
      charsEl.textContent   = t ? t.chars(val.length) : val.length + ' kar.';
    }
  }
}

/* ── Dosya yükleme ───────────────────────────────────────── */
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('srcCode').value = ev.target.result;
    updateLineNums('src');
    updateMeta('src');
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ── Badge Tooltip (JS kontrollü) ───────────────────────── */
let tooltipEl = null;

function showBadgeTooltip(e, badge) {
  const text = badge.getAttribute('data-tooltip');
  if (!text) return;

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'badge-tooltip-popup';
    document.body.appendChild(tooltipEl);
  }

  tooltipEl.textContent = text;
  tooltipEl.style.display = 'block';

  const rect = badge.getBoundingClientRect();
  tooltipEl.style.left = (rect.right + 8) + 'px';
  tooltipEl.style.top  = (rect.top + rect.height / 2) + 'px';
  tooltipEl.style.transform = 'translateY(-50%)';
}

function hideBadgeTooltip() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}

/* ── IntelliSense toggle ─────────────────────────────────── */
function toggleIntelliSense(el) {
  el.classList.toggle('on');
  intelliSenseEnabled = el.classList.contains('on');
}

function toggleLineNums(el) {
  el.classList.toggle('on');
  lineNumsVisible = el.classList.contains('on');
  updateLineNums('src');
  updateLineNums('tgt');
}

function toggleWordWrap(el) {
  el.classList.toggle('on');
  const wrap = el.classList.contains('on') ? 'soft' : 'off';
  document.querySelectorAll('.code-area').forEach(e => e.wrap = wrap);
}
