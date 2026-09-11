/* ══════════════════════════════════════════════════════════════
   main.js — State, init, lang picker, settings, swap,
             copy/download, modal
   Yükleme sırası (index.html):
     i18n.js → editor.js → runners.js → translate.js → main.js
══════════════════════════════════════════════════════════════ */

/* ── Dil listesi ─────────────────────────────────────────── */
const LANGUAGES = [
  { id:'python',     name:'Python',     ext:'py',    logo:`<img src="assets/logo/python.png"     width="28" height="28"/>` },
  { id:'javascript', name:'JavaScript', ext:'js',    logo:`<img src="assets/logo/javascript.png" width="28" height="28"/>` },
  { id:'typescript', name:'TypeScript', ext:'ts',    logo:`<img src="assets/logo/typescript.png" width="28" height="28"/>` },
  { id:'rust',       name:'Rust',       ext:'rs',    logo:`<img src="assets/logo/rust.png"       width="28" height="28"/>` },
  { id:'go',         name:'Go',         ext:'go',    logo:`<img src="assets/logo/go.png"         width="28" height="28"/>` },
  { id:'cpp',        name:'C++',        ext:'cpp',   logo:`<img src="assets/logo/c++.png"        width="28" height="28"/>` },
  { id:'c',          name:'C',          ext:'c',     logo:`<img src="assets/logo/c.png"          width="28" height="28"/>` },
  { id:'java',       name:'Java',       ext:'java',  logo:`<img src="assets/logo/java.png"       width="28" height="28"/>` },
  { id:'swift',      name:'Swift',      ext:'swift', logo:`<img src="assets/logo/swift.png"      width="28" height="28"/>` },
  { id:'kotlin',     name:'Kotlin',     ext:'kt',    logo:`<img src="assets/logo/kotlin.png"     width="28" height="28"/>` },
  { id:'csharp',     name:'C#',         ext:'cs',    logo:`<img src="assets/logo/csharp.png"     width="28" height="28"/>` },
  { id:'ruby',       name:'Ruby',       ext:'rb',    logo:`<img src="assets/logo/ruby.png"       width="28" height="28"/>` },
  { id:'php',        name:'PHP',        ext:'php',   logo:`<img src="assets/logo/php.png"        width="28" height="28"/>` },
  { id:'lua',        name:'Lua',        ext:'lua',   logo:`<img src="assets/logo/lua.png"        width="28" height="28"/>` },
  { id:'dart',       name:'Dart',       ext:'dart',  logo:`<img src="assets/logo/Dart.png"       width="28" height="28"/>` },
  { id:'scala',      name:'Scala',      ext:'scala', logo:`<img src="assets/logo/Scala.png"      width="28" height="28"/>` },
  { id:'haskell',    name:'Haskell',    ext:'hs',    logo:`<img src="assets/logo/haskell.png"    width="28" height="28"/>` },
];

/* ── Global state ────────────────────────────────────────── */
let currentPicker      = 'source';
let pendingSelection   = null;
let srcLang            = LANGUAGES[0];   // Python
let tgtLang            = LANGUAGES[3];   // Rust
let tabSz              = 4;
let lineNumsVisible    = true;
let currentLang        = localStorage.getItem('glydnLang') || 'en';
let intelliSenseEnabled = true;

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderLangBtn('src', srcLang);
  renderLangBtn('tgt', tgtLang);
  updateLineNums('src');
  updateLineNums('tgt');

  const src = document.getElementById('srcCode');
  src.addEventListener('input',   () => { updateLineNums('src'); updateMeta('src'); });
  src.addEventListener('scroll',  () => syncScroll('src'));
  src.addEventListener('keydown', handleKeyDown);

  const tgt = document.getElementById('tgtCode');
  tgt.addEventListener('scroll', () => syncScroll('tgt'));

  document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);

  const togAuto = document.getElementById('togAutoIndent');
  if (togAuto) togAuto.classList.add('on');

  document.querySelectorAll('.line-nums').forEach(ln => ln.classList.add('visible'));

  // Kayıtlı dili uygula ve select'i eşitle
  const savedLang = localStorage.getItem('glydnLang') || 'en';
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = savedLang;
  changeUILanguage(savedLang);
});

/* ── Dil butonu render ───────────────────────────────────── */
function renderLangBtn(side, lang) {
  document.getElementById(side + 'Logo').innerHTML = lang.logo;
  document.getElementById(side + 'LangName').textContent = lang.name;
}

/* ── Dil seçici (picker) ─────────────────────────────────── */
function openPicker(side) {
  currentPicker = side;
  pendingSelection = side === 'source' ? srcLang : tgtLang;
  const t = translations[currentLang];
  document.getElementById('pickerEyebrow').textContent  = t.pickerEyebrow;
  document.getElementById('pickerTitle').textContent    = side === 'source' ? t.pickerSrcTitle : t.pickerTgtTitle;
  document.getElementById('pickerSearch').value         = '';
  document.getElementById('pickerSearch').placeholder  = t.pickerSearch;
  document.getElementById('pickerSelectedName').textContent = pendingSelection.name;
  document.getElementById('pickerConfirm').disabled    = false;
  renderPickerGrid(LANGUAGES);
  document.getElementById('pickerOverlay').classList.add('active');
  setTimeout(() => document.getElementById('pickerSearch').focus(), 100);
}

function closePicker() {
  document.getElementById('pickerOverlay').classList.remove('active');
  pendingSelection = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('pickerOverlay')) closePicker();
}

function renderPickerGrid(langs) {
  const active = pendingSelection || (currentPicker === 'source' ? srcLang : tgtLang);
  document.getElementById('pickerGrid').innerHTML = langs.map(l => `
    <div class="lang-card ${l.id === active.id ? 'selected' : ''}" onclick="selectPickerLang('${l.id}')">
      <div class="lang-card-check">
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M1.5 5l2.5 2.5 5-5"/></svg>
      </div>
      <div class="lang-card-logo">${l.logo}</div>
      <div class="lang-card-name">${l.name}</div>
    </div>`).join('');
}

function selectPickerLang(id) {
  const lang = LANGUAGES.find(l => l.id === id);
  if (!lang) return;
  if (pendingSelection && pendingSelection.id === id) {
    pendingSelection = null;
    document.getElementById('pickerSelectedName').textContent = '—';
    document.getElementById('pickerConfirm').disabled = true;
  } else {
    pendingSelection = lang;
    document.getElementById('pickerSelectedName').textContent = lang.name;
    document.getElementById('pickerConfirm').disabled = false;
  }
  const q = document.getElementById('pickerSearch').value.toLowerCase();
  renderPickerGrid(q ? LANGUAGES.filter(l => l.name.toLowerCase().includes(q)) : LANGUAGES);
}

function confirmSelection() {
  if (!pendingSelection) return;
  if (currentPicker === 'source') { srcLang = pendingSelection; renderLangBtn('src', srcLang); }
  else                            { tgtLang = pendingSelection; renderLangBtn('tgt', tgtLang); }
  closePicker();
}

function filterPickerLangs() {
  const q = document.getElementById('pickerSearch').value.toLowerCase();
  renderPickerGrid(q ? LANGUAGES.filter(l => l.name.toLowerCase().includes(q)) : LANGUAGES);
}

/* ── Swap ────────────────────────────────────────────────── */
function swapLanguages() {
  [srcLang, tgtLang] = [tgtLang, srcLang];
  renderLangBtn('src', srcLang);
  renderLangBtn('tgt', tgtLang);
  const sv = document.getElementById('srcCode').value;
  const tv = document.getElementById('tgtCode').value;
  document.getElementById('srcCode').value = tv;
  const tgtEl = document.getElementById('tgtCode');
  tgtEl.removeAttribute('readonly');
  tgtEl.value = sv;
  tgtEl.setAttribute('readonly', '');
  updateLineNums('src');
  updateLineNums('tgt');
  updateMeta('src');
}

/* ── Copy / Download ─────────────────────────────────────── */
function copyOutput() {
  const v = document.getElementById('tgtCode').value;
  if (!v) return;
  navigator.clipboard.writeText(v).then(() => {
    document.querySelectorAll('.panel-target .action-btn').forEach(b => {
      if (b.title === translations[currentLang].copyTitle) {
        b.style.color = 'var(--accent-teal)';
        setTimeout(() => b.style.color = '', 1400);
      }
    });
  });
}

function downloadOutput() {
  const v = document.getElementById('tgtCode').value;
  if (!v) return;
  const a = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([v], { type: 'text/plain' }));
  a.download = 'output.' + tgtLang.ext;
  a.click();
}

/* ── Temizle (modal ile) ─────────────────────────────────── */
async function clearSrc() {
  const code = document.getElementById('srcCode').value;
  const t    = translations[currentLang];
  if (!code.trim()) {
    addDebugLog(document.getElementById('runOutput'), 'warning', t.noCode || 'Zaten boş.');
    return;
  }
  const confirmed = await showGlydnModal({
    title:       currentLang === 'tr' ? 'Kodu Temizle'          : currentLang === 'en' ? 'Clear Code'   : 'Code Löschen',
    message:     currentLang === 'tr' ? 'Kaynak kodunu tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
                                      : currentLang === 'en' ? 'Are you sure you want to clear the source code? This action cannot be undone.'
                                      : 'Sind Sie sicher, dass Sie den Quellcode löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    confirmText: currentLang === 'tr' ? 'Evet, Temizle'         : currentLang === 'en' ? 'Yes, Clear'   : 'Ja, Löschen',
    cancelText:  currentLang === 'tr' ? 'İptal'                 : currentLang === 'en' ? 'Cancel'       : 'Abbrechen',
  });
  if (!confirmed) return;
  document.getElementById('srcCode').value = '';
  updateLineNums('src');
  updateMeta('src');
  addDebugLog(document.getElementById('runOutput'), 'success',
    currentLang === 'tr' ? 'Kaynak kodu temizlendi.' : currentLang === 'en' ? 'Source code cleared.' : 'Quellcode gelöscht.');
}

/* ── Modal ───────────────────────────────────────────────── */
function showGlydnModal(options) {
  return new Promise((resolve) => {
    const modal      = document.getElementById('confirmModal');
    const titleEl    = document.getElementById('modalTitle');
    const messageEl  = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn  = document.getElementById('modalCancelBtn');

    titleEl.textContent    = options.title       || 'Dikkat!';
    messageEl.textContent  = options.message     || 'Bu işlemi onaylıyor musunuz?';
    confirmBtn.textContent = options.confirmText || 'Evet, Devam Et';
    cancelBtn.textContent  = options.cancelText  || 'İptal';
    modal.classList.add('active');

    const cleanUp = () => {
      modal.classList.remove('active');
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
    };
    const handleConfirm = () => { cleanUp(); resolve(true); };
    const handleCancel  = () => { cleanUp(); resolve(false); };
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    const overlay = modal.querySelector('.modal-overlay');
    const onOverlay = () => { cleanUp(); resolve(false); overlay.removeEventListener('click', onOverlay); };
    overlay.addEventListener('click', onOverlay);

    const onEsc = (e) => { if (e.key === 'Escape') { cleanUp(); resolve(false); document.removeEventListener('keydown', onEsc); } };
    document.addEventListener('keydown', onEsc);
  });
}

/* ── Settings ────────────────────────────────────────────── */
document.getElementById('settingsToggle').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('settingsPanel').classList.toggle('active');
});

document.addEventListener('click', e => {
  const sp = document.getElementById('settingsPanel');
  if (!sp.contains(e.target) && e.target.id !== 'settingsToggle')
    sp.classList.remove('active');
});

function applyFontSize(v) {
  document.getElementById('fontSzVal').textContent = v + 'px';
  document.querySelectorAll('.code-area').forEach(el => el.style.fontSize = v + 'px');
  document.querySelectorAll('.line-nums').forEach(el => {
    el.style.fontSize   = v + 'px';
    el.style.lineHeight = (parseFloat(v) * 1.75) + 'px';
  });
}

const COLOR_THEMES = {
  dark:     { void:'#070709', panel:'#13131a', src:'#c9c5ff', tgt:'#7ee8cc' },
  light:    null,
  midnight: { void:'#060812', panel:'#0d1018', src:'#93c5fd', tgt:'#6ee7b7' },
  forest:   { void:'#060d0a', panel:'#0a1510', src:'#86efac', tgt:'#67e8f9' },
  ember:    { void:'#100908', panel:'#180f0e', src:'#fca5a5', tgt:'#fcd34d' },
};

function applyColorTheme(theme) {
  const savedLang = currentLang;
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.removeAttribute('style');
    document.getElementById('srcCode').style.color = '';
    document.getElementById('tgtCode').style.color = '';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    const th = COLOR_THEMES[theme] || COLOR_THEMES.dark;
    document.documentElement.style.setProperty('--bg-void',  th.void);
    document.documentElement.style.setProperty('--bg-panel', th.panel);
    document.getElementById('srcCode').style.color = th.src;
    document.getElementById('tgtCode').style.color = th.tgt;
  }
  currentLang = savedLang;
  updateUILanguage();
}

function applyTabSize(v) { tabSz = parseInt(v); }

/* ── Global kısayollar ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePicker(); closeRun(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runTranslation();
});
