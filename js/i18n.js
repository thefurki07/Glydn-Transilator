/* ══════════════════════════════════════════════════════════════
   i18n.js — Arayüz dili çevirileri (TR / EN / DE)
══════════════════════════════════════════════════════════════ */

const translations = {
  tr: {
    sourceLang: 'Kaynak Dil', targetLang: 'Hedef Dil',
    source: 'kaynak', target: 'hedef',
    output: 'Çıktı',
    runHint: 'Çalıştırmak için ▶ butonuna basın...',
    running: (name) => `${name} çalıştırılıyor...`,
    noCode: 'Çalıştırılacak kod yok.',
    jsSuccess: 'Kod başarıyla çalıştı (çıktı yok)', jsError: 'Hata',
    pyNoPrint: 'Kod başarıyla analiz edildi (print ifadesi bulunamadı)',
    pySyntaxError: 'Python sentaks hatası',
    otherSim: (name) => `${name} kodu derlendi (simülasyon)`,
    otherNeed: (name) => `Gerçek çalıştırma için ${name} ortamı gerekir.`,
    debugInfo: 'Bilgi', debugWarning: 'Uyarı', debugError: 'Hata', debugSuccess: 'Başarılı',
    chars: (n) => `${n} karakter`, lines: (n) => `${n} satır`,
    lineNums: 'Satır Numaraları', intelliSense: 'IntelliSense',
    wordWrap: 'Sözcük Kaydırma', uiLang: 'Arayüz Dili',
    settingsTitle: 'Görünüm & Editör', settingsToggle: 'Ayarlar',
    logoSub: 'Translator',
    pickerEyebrow: 'Programlama Dili',
    pickerSrcTitle: 'Kaynak Dil Seç', pickerTgtTitle: 'Hedef Dil Seç',
    pickerSearch: 'Dil ara...', pickerSelected: 'Seçili:', pickerConfirm: 'Onayla',
    fontSize: 'Yazı Boyutu', editorTheme: 'Editör Teması', tabSize: 'Sekme Genişliği',
    tab2: '2 Boşluk', tab4: '4 Boşluk', tab8: '8 Boşluk',
    themeGlydnDark: 'Glydn Dark', themeGlydnLight: 'Glydn Light',
    themeMidnight: 'Midnight', themeForest: 'Deep Forest', themeEmber: 'Ember',
    uploadTitle: 'Dosya Yükle', runTitle: 'Kodu Çalıştır',
    clearTitle: 'Temizle', copyTitle: 'Kopyala', downloadTitle: 'İndir',
    swapTitle: 'Dilleri Değiştir', translateTitle: 'Çevir (Ctrl+Enter)',
    badgeOk: 'Kod satırı başarılı',
    badgeWarn: 'Kod satırına kontrol önerilir',
    badgeErr: 'Kod satırı yeniden uygun biçimde yazılmalıdır',
    translationWarning: '⚠️ AI çeviriler %100 doğru olmayabilir. Önemli kodları kontrol edin. Çok hata alırsanız tekrar deneyin.',
    placeholderSrc: '# Kodunuzu buraya yazın veya yapıştırın...',
    placeholderTgt: '// Çevrilmiş kod burada görünecek...',
    modalTitle: 'Dikkat!',
    modalMessage: 'Kaynak kodunu temizlemek istediğinize emin misiniz?',
    modalCancel: 'İptal', modalConfirm: 'Evet, Temizle',
    runningTS: 'TypeScript → JavaScript dönüştürülüyor...',
    runningLua: '🌙 Lua çalıştırılıyor (Fengari)...',
    runningJS: '🟡 JavaScript çalıştırılıyor...',
    runningPython: '🐍 Python çalıştırılıyor (Pyodide)...',
    runningGeneric: 'çalıştırılıyor...',
    noOutput: 'Kod başarıyla çalıştı (çıktı yok)',
    pythonLoading: '🐍 Python runtime yükleniyor (ilk seferde biraz zaman alabilir)...',
    pythonReady: '✅ Python runtime hazır!',
    pythonFailed: '❌ Python runtime yüklenemedi:',
    testingCode: '⚙️ {lang} test ediliyor (Judge0)...',
    testFailed: '❌ Test başarısız:',
    translating: '// Çeviriliyor...',
    translateEmpty: '// Çeviri sonucu boş geldi.',
    translateError: 'Çeviri hatası',
  },
  en: {
    sourceLang: 'Source Language', targetLang: 'Target Language',
    source: 'source', target: 'target',
    output: 'Output',
    runHint: 'Press ▶ button to run...',
    running: (name) => `Running ${name}...`,
    noCode: 'No code to run.',
    jsSuccess: 'Code executed successfully (no output)', jsError: 'Error',
    pyNoPrint: 'Code analyzed (no print statement found)',
    pySyntaxError: 'Python syntax error',
    otherSim: (name) => `${name} code compiled (simulation)`,
    otherNeed: (name) => `Real execution requires ${name} environment`,
    debugInfo: 'Info', debugWarning: 'Warning', debugError: 'Error', debugSuccess: 'Success',
    chars: (n) => `${n} characters`, lines: (n) => `${n} lines`,
    lineNums: 'Line Numbers', intelliSense: 'IntelliSense',
    wordWrap: 'Word Wrap', uiLang: 'UI Language',
    settingsTitle: 'Appearance & Editor', settingsToggle: 'Settings',
    logoSub: 'Translator',
    pickerEyebrow: 'Programming Language',
    pickerSrcTitle: 'Select Source Language', pickerTgtTitle: 'Select Target Language',
    pickerSearch: 'Search language...', pickerSelected: 'Selected:', pickerConfirm: 'Confirm',
    fontSize: 'Font Size', editorTheme: 'Editor Theme', tabSize: 'Tab Size',
    tab2: '2 Spaces', tab4: '4 Spaces', tab8: '8 Spaces',
    themeGlydnDark: 'Glydn Dark', themeGlydnLight: 'Glydn Light',
    themeMidnight: 'Midnight', themeForest: 'Deep Forest', themeEmber: 'Ember',
    uploadTitle: 'Upload File', runTitle: 'Run Code',
    clearTitle: 'Clear', copyTitle: 'Copy', downloadTitle: 'Download',
    swapTitle: 'Swap Languages', translateTitle: 'Translate (Ctrl+Enter)',
    badgeOk: 'Line is correct',
    badgeWarn: 'Line review recommended',
    badgeErr: 'Line needs to be rewritten',
    translationWarning: '⚠️ AI translations may not be 100% accurate. Review important code. If you get many errors, try again.',
    placeholderSrc: '# Write or paste your code here...',
    placeholderTgt: '// Translated code will appear here...',
    modalTitle: 'Warning!',
    modalMessage: 'Are you sure you want to clear the source code?',
    modalCancel: 'Cancel', modalConfirm: 'Yes, Clear',
    runningTS: 'TypeScript → JavaScript transpiling...',
    runningLua: '🌙 Running Lua (Fengari)...',
    runningJS: '🟡 Running JavaScript...',
    runningPython: '🐍 Running Python (Pyodide)...',
    runningGeneric: 'running...',
    noOutput: 'Code executed successfully (no output)',
    pythonLoading: '🐍 Loading Python runtime (may take a moment)...',
    pythonReady: '✅ Python runtime ready!',
    pythonFailed: '❌ Python runtime failed:',
    testingCode: '⚙️ Testing {lang} (Judge0)...',
    testFailed: '❌ Test failed:',
    translating: '// Translating...',
    translateEmpty: '// Translation result was empty.',
    translateError: 'Translation error',
  },
  de: {
    sourceLang: 'Quellsprache', targetLang: 'Zielsprache',
    source: 'Quelle', target: 'Ziel',
    output: 'Ausgabe',
    runHint: 'Drücke ▶ zum Ausführen...',
    running: (name) => `${name} wird ausgeführt...`,
    noCode: 'Kein Code zum Ausführen.',
    jsSuccess: 'Code erfolgreich ausgeführt (keine Ausgabe)', jsError: 'Fehler',
    pyNoPrint: 'Code analysiert (keine print-Anweisung gefunden)',
    pySyntaxError: 'Python-Syntaxfehler',
    otherSim: (name) => `${name} Code kompiliert (Simulation)`,
    otherNeed: (name) => `Echte Ausführung erfordert ${name} Umgebung`,
    debugInfo: 'Info', debugWarning: 'Warnung', debugError: 'Fehler', debugSuccess: 'Erfolg',
    chars: (n) => `${n} Zeichen`, lines: (n) => `${n} Zeilen`,
    lineNums: 'Zeilennummern', intelliSense: 'IntelliSense',
    wordWrap: 'Zeilenumbruch', uiLang: 'Sprache',
    settingsTitle: 'Darstellung & Editor', settingsToggle: 'Einstellungen',
    logoSub: 'Übersetzer',
    pickerEyebrow: 'Programmiersprache',
    pickerSrcTitle: 'Quellsprache wählen', pickerTgtTitle: 'Zielsprache wählen',
    pickerSearch: 'Sprache suchen...', pickerSelected: 'Gewählt:', pickerConfirm: 'Bestätigen',
    fontSize: 'Schriftgröße', editorTheme: 'Editor-Thema', tabSize: 'Tab-Breite',
    tab2: '2 Leerzeichen', tab4: '4 Leerzeichen', tab8: '8 Leerzeichen',
    themeGlydnDark: 'Glydn Dunkel', themeGlydnLight: 'Glydn Hell',
    themeMidnight: 'Mitternacht', themeForest: 'Tiefer Wald', themeEmber: 'Glut',
    uploadTitle: 'Datei hochladen', runTitle: 'Code ausführen',
    clearTitle: 'Löschen', copyTitle: 'Kopieren', downloadTitle: 'Herunterladen',
    swapTitle: 'Sprachen tauschen', translateTitle: 'Übersetzen (Ctrl+Enter)',
    badgeOk: 'Zeile ist korrekt',
    badgeWarn: 'Zeilenüberprüfung empfohlen',
    badgeErr: 'Zeile muss neu geschrieben werden',
    translationWarning: '⚠️ KI-Übersetzungen sind möglicherweise nicht 100% korrekt. Wichtigen Code überprüfen. Bei vielen Fehlern erneut versuchen.',
    placeholderSrc: '# Code hier eingeben oder einfügen...',
    placeholderTgt: '// Übersetzter Code erscheint hier...',
    modalTitle: 'Achtung!',
    modalMessage: 'Möchten Sie den Quellcode wirklich löschen?',
    modalCancel: 'Abbrechen', modalConfirm: 'Ja, Löschen',
    runningTS: 'TypeScript → JavaScript wird kompiliert...',
    runningLua: '🌙 Lua wird ausgeführt (Fengari)...',
    runningJS: '🟡 JavaScript wird ausgeführt...',
    runningPython: '🐍 Python wird ausgeführt (Pyodide)...',
    runningGeneric: 'wird ausgeführt...',
    noOutput: 'Code erfolgreich ausgeführt (keine Ausgabe)',
    pythonLoading: '🐍 Python-Runtime wird geladen...',
    pythonReady: '✅ Python-Runtime bereit!',
    pythonFailed: '❌ Python-Runtime fehlgeschlagen:',
    testingCode: '⚙️ {lang} wird getestet (Judge0)...',
    testFailed: '❌ Test fehlgeschlagen:',
    translating: '// Wird übersetzt...',
    translateEmpty: '// Übersetzungsergebnis war leer.',
    translateError: 'Übersetzungsfehler',
  }
};

/* ── UI güncelle ─────────────────────────────────────────── */
function updateUILanguage() {
  const t = translations[currentLang];
  if (!t) return;

  // Lang labels
  const srcLabel = document.getElementById('srcLangLabel');
  const tgtLabel = document.getElementById('tgtLangLabel');
  if (srcLabel) srcLabel.textContent = t.sourceLang;
  if (tgtLabel) tgtLabel.textContent = t.targetLang;

  // Footer
  const srcFooter = document.querySelector('.source-footer');
  const tgtFooter = document.querySelector('.target-footer');
  if (srcFooter) srcFooter.textContent = t.source;
  if (tgtFooter) tgtFooter.textContent = t.target;

  // Terminal
  const runLabelEl = document.getElementById('runLabel');
  if (runLabelEl) runLabelEl.textContent = t.output;
  const hintEl = document.getElementById('runHintText');
  if (hintEl) hintEl.textContent = t.runHint;

  // Logo sub
  const logoSub = document.getElementById('logoSubText');
  if (logoSub) logoSub.textContent = t.logoSub;

  // Settings title & toggle
  const settTitle = document.getElementById('settingsTitleText');
  if (settTitle) settTitle.textContent = t.settingsTitle;
  const settToggle = document.getElementById('settingsToggle');
  if (settToggle) settToggle.title = t.settingsToggle;

  // Placeholders
  const srcCode = document.getElementById('srcCode');
  const tgtCode = document.getElementById('tgtCode');
  if (srcCode) srcCode.placeholder = t.placeholderSrc;
  if (tgtCode) tgtCode.placeholder = t.placeholderTgt;

  // Footer meta (data-count ile)
  const srcLinesEl = document.getElementById('srcLines');
  const srcCharsEl = document.getElementById('srcChars');
  const tgtLinesEl = document.getElementById('tgtLines');
  if (srcLinesEl) srcLinesEl.textContent = t.lines(srcLinesEl.dataset.count || 0);
  if (srcCharsEl) srcCharsEl.textContent = t.chars(srcCharsEl.dataset.count || 0);
  if (tgtLinesEl) tgtLinesEl.textContent = t.lines(tgtLinesEl.dataset.count || 0);

  // Toggle labels
  const lineNumsLabel = document.getElementById('lineNumsLabel');
  const intelliLabel  = document.getElementById('intelliSenseLabel');
  const wrapLabel     = document.getElementById('wordWrapLabel');
  const uiLangLabel   = document.getElementById('uiLangLabel');
  if (lineNumsLabel) lineNumsLabel.textContent = t.lineNums;
  if (intelliLabel)  intelliLabel.textContent  = t.intelliSense;
  if (wrapLabel)     wrapLabel.textContent     = t.wordWrap;
  if (uiLangLabel)   uiLangLabel.textContent   = t.uiLang;

  // Settings labels
  const editorThemeLabel = document.getElementById('editorThemeLabel');
  const tabSizeLabel     = document.getElementById('tabSizeLabel');
  if (editorThemeLabel) editorThemeLabel.textContent = t.editorTheme;
  if (tabSizeLabel)     tabSizeLabel.textContent     = t.tabSize;

  // Font size label
  const allSettingLabels = document.querySelectorAll('.setting-label');
  if (allSettingLabels[0]) {
    const firstChild = allSettingLabels[0].childNodes[0];
    if (firstChild) firstChild.textContent = t.fontSize + ' ';
  }

  // Theme select options
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    const map = ['themeGlydnDark','themeGlydnLight','themeMidnight','themeForest','themeEmber'];
    Array.from(themeSelect.options).forEach((opt, i) => { if (map[i]) opt.text = t[map[i]]; });
  }

  // Tab size options
  const tabSel = document.getElementById('tabSizeSelect');
  if (tabSel) {
    tabSel.options[0].text = t.tab2;
    tabSel.options[1].text = t.tab4;
    tabSel.options[2].text = t.tab8;
  }

  // Picker
  const eyebrow = document.getElementById('pickerEyebrow');
  if (eyebrow) eyebrow.textContent = t.pickerEyebrow;
  const pickerSearch = document.getElementById('pickerSearch');
  if (pickerSearch) pickerSearch.placeholder = t.pickerSearch;
  const pickerSelInfo = document.querySelector('.picker-selected-info');
  if (pickerSelInfo) {
    const strong = pickerSelInfo.querySelector('strong');
    const name = strong ? strong.textContent : '—';
    pickerSelInfo.innerHTML = `${t.pickerSelected} <strong id="pickerSelectedName">${name}</strong>`;
  }
  const pickerConfirmText = document.getElementById('pickerConfirmText');
  if (pickerConfirmText) pickerConfirmText.textContent = t.pickerConfirm;

  // Buton title'ları — class'a göre bul, title'a göre değil
  const uploadBtn    = document.getElementById('uploadBtn');
  const srcRunBtn    = document.getElementById('srcRunBtn');
  const tgtRunBtn    = document.getElementById('tgtRunBtn');
  const translateBtn = document.getElementById('translateBtn');
  const swapBtn      = document.querySelector('.swap-btn');
  if (uploadBtn)    uploadBtn.title    = t.uploadTitle;
  if (srcRunBtn)    srcRunBtn.title    = t.runTitle;
  if (tgtRunBtn)    tgtRunBtn.title    = t.runTitle;
  if (translateBtn) translateBtn.title = t.translateTitle;
  if (swapBtn)      swapBtn.title      = t.swapTitle;

  // Temizle / Kopyala / İndir — ID ile bul
  const clearBtn    = document.querySelector('#srcPanel .action-btn:nth-child(3)');
  const copyBtn     = document.querySelector('#tgtPanel .action-btn:nth-child(2)');
  const downloadBtn = document.querySelector('#tgtPanel .action-btn:nth-child(3)');
  if (clearBtn)    clearBtn.title    = t.clearTitle;
  if (copyBtn)     copyBtn.title     = t.copyTitle;
  if (downloadBtn) downloadBtn.title = t.downloadTitle;

  // Modal
  const modalTitleEl   = document.getElementById('modalTitle');
  const modalMsgEl     = document.getElementById('modalMessage');
  const modalCancelEl  = document.getElementById('modalCancelBtn');
  const modalConfirmEl = document.getElementById('modalConfirmBtn');
  if (modalTitleEl)   modalTitleEl.textContent  = t.modalTitle;
  if (modalMsgEl)     modalMsgEl.textContent    = t.modalMessage;
  if (modalCancelEl)  modalCancelEl.textContent = t.modalCancel;
  if (modalConfirmEl) modalConfirmEl.textContent= t.modalConfirm;

  // Çeviri uyarısı
  const warnEl = document.getElementById('translationWarning');
  if (warnEl) warnEl.textContent = t.translationWarning;

  // Sayfa title
  document.title = `Glydn — ${t.logoSub}`;
}

function changeUILanguage(lang) {
  currentLang = lang;
  localStorage.setItem('glydnLang', lang);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
  updateUILanguage();
  // Terminal hint güncelle
  const outEl = document.getElementById('runOutput');
  if (outEl && outEl.children.length === 1) {
    const msg = outEl.children[0]?.querySelector('.log-message');
    if (msg) msg.textContent = translations[currentLang].runHint;
  }
}
