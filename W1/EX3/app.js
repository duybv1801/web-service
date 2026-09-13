/* Lumen lưu dữ liệu cục bộ bằng IndexedDB, còn ghi chú và giao diện dùng LocalStorage. */
const DB_NAME = 'lumen-vocabulary';
const DB_VERSION = 1;
const STORE = 'words';
let words = [];
let practiceWords = [];
let currentCardIndex = 0;
let editingId = null;
let sessionReviewed = 0;
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function dbRequest(mode, action) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = action(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
const getAllWords = () => dbRequest('readonly', (store) => store.getAll());
const saveToDb = (word) => dbRequest('readwrite', (store) => store.put(word));
const removeFromDb = (id) => dbRequest('readwrite', (store) => store.delete(id));

function bindPracticeShortcuts() {
  document.addEventListener('keydown', (event) => {
    if (!$('#view-practice').classList.contains('active') || event.target.matches('input, textarea')) return;
    if (event.code === 'Space') { event.preventDefault(); $('#flashcard').click(); }
    const qualityByKey = { Digit1: 0, Digit2: 3, Digit3: 5 };
    if (Object.prototype.hasOwnProperty.call(qualityByKey, event.code) && practiceWords.length) reviewWord(qualityByKey[event.code]);
  });
}
function bindContextFeedback() {
  $('#check-context').addEventListener('click', () => {
    const input = $('#context-input');
    const isCorrect = input.value.trim().toLowerCase() === ($('#context-modal').dataset.answer || '').toLowerCase();
    input.classList.remove('success-state', 'error-state');
    void input.offsetWidth;
    input.classList.add(isCorrect ? 'success-state' : 'error-state');
    window.setTimeout(() => input.classList.remove('success-state', 'error-state'), 600);
  });
}

function todayStart() { const date = new Date(); date.setHours(0, 0, 0, 0); return date.getTime(); }
function formatDate(timestamp) { return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(timestamp)); }
function makeWord(english, meaning, example) { return { id: crypto.randomUUID(), english, meaning, example, pronunciation: '', dueDate: todayStart(), interval: 0, ease: 2.5, repetitions: 0, lapses: 0, reviews: 0, correct: 0, createdAt: Date.now(), history: [] }; }
function seedWords() { return [makeWord('resilient', 'kiên cường', 'She stayed resilient through every challenge.'), makeWord('serendipity', 'sự tình cờ may mắn', 'Meeting my best friend was pure serendipity.'), makeWord('nuance', 'sắc thái tinh tế', 'The translation misses the nuance of the original phrase.')]; }

async function init() {
  words = await getAllWords();
  if (!words.length) { words = seedWords(); await Promise.all(words.map(saveToDb)); }
  $('#notes').value = localStorage.getItem('lumen-notes') || '';
  const savedTheme = localStorage.getItem('lumen-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  bindEvents();
  bindPracticeShortcuts();
  bindContextFeedback();
  renderAll();
}
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }
function renderAll() { renderToday(); renderWords(); renderPractice(); renderProgress(); }
function dueWords() { return words.filter((word) => word.dueDate <= todayStart()); }
function renderToday() {
  const due = dueWords();
  const newWords = words.filter((word) => word.repetitions === 0);
  const streak = Number(localStorage.getItem('lumen-streak') || 0);
  $('#due-count').textContent = due.length; $('#new-count').textContent = newWords.length; $('#streak-count').textContent = `${streak} ngày`; $('#week-streak').textContent = streak; $('#total-words').textContent = words.length; $('#sidebar-streak').textContent = `${streak} ngày`;
  $('#week-dots').innerHTML = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => `<span class="${index > 3 ? 'done' : ''} ${index === 5 ? 'today' : ''}">${day}</span>`).join('');
}
function renderWords() {
  const query = ($('#search-input')?.value || '').trim().toLowerCase();
  const filtered = words.filter((word) => `${word.english} ${word.meaning}`.toLowerCase().includes(query));
  $('#word-list').innerHTML = filtered.length ? filtered.map((word) => `<article class="word-row"><div class="word-main"><strong>${escapeHtml(word.english)}</strong><small>${word.repetitions ? `Ôn lại ${formatDate(word.dueDate)}` : 'Từ mới'}</small></div><div class="word-meaning">${escapeHtml(word.meaning)}</div><div class="word-example">${escapeHtml(word.example)}</div><div class="row-actions"><button class="mini-button" data-speak="${word.id}" title="Nghe phát âm" aria-label="Nghe phát âm">🔊</button><button class="mini-button" data-edit="${word.id}" title="Sửa" aria-label="Sửa">✎</button><button class="mini-button" data-delete="${word.id}" title="Xoá" aria-label="Xoá">×</button></div></article>`).join('') : '<div class="empty-state">Chưa tìm thấy từ phù hợp.<button class="button button-primary" onclick="document.getElementById(\'add-word\').click()">＋ Thêm từ mới</button></div>';
}
function renderPractice() {
  practiceWords = dueWords();
  if (!practiceWords.length) { $('#flash-word').textContent = 'Tất cả đã xong'; $('#flash-pronunciation').textContent = 'Không còn từ đến hạn hôm nay'; $('#flash-meaning').textContent = 'Bạn đã hoàn thành buổi học'; $('#flash-example').textContent = 'Mỗi ngày một chút, tiến bộ sẽ đến.'; $('#practice-progress').textContent = '0 / 0'; $('#practice-subtitle').textContent = 'Không có thẻ đến hạn.'; $('#review-actions').style.visibility = 'hidden'; $('#next-card').textContent = '＋ Thêm từ mới'; $('#next-card').dataset.action = 'add-word'; return; }
  if (currentCardIndex >= practiceWords.length) currentCardIndex = 0;
    const word = practiceWords[currentCardIndex]; $('.flashcard-wrap').classList.add('is-switching'); window.setTimeout(() => $('.flashcard-wrap').classList.remove('is-switching'), 150); $('#flash-word').textContent = word.english; $('#flash-pronunciation').textContent = word.pronunciation || `/${word.english}/`; $('#flash-meaning').textContent = word.meaning; $('#flash-example').textContent = word.example; $('#practice-progress').textContent = `${currentCardIndex + 1} / ${practiceWords.length}`; $('#practice-due-label').textContent = `${practiceWords.length} từ đến hạn`; $('#practice-subtitle').textContent = 'Lật thẻ, nhớ lâu hơn.'; $('#review-actions').style.visibility = 'visible'; $('#next-card').textContent = 'Tiếp theo →'; delete $('#next-card').dataset.action; $('#flashcard').classList.remove('flipped'); updateSessionProgress();
}
function renderProgress() {
  const mastered = words.filter((word) => word.interval >= 21).length; const reviews = words.reduce((sum, word) => sum + (word.reviews || 0), 0); const correct = words.reduce((sum, word) => sum + (word.correct || 0), 0);
  $('#mastered-count').textContent = mastered; $('#total-reviews').textContent = reviews; $('#accuracy-rate').textContent = reviews ? `${Math.round(correct / reviews * 100)}%` : '0%';
  const values = Array.from({ length: 30 }, (_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (29 - index)); const day = date.toISOString().slice(0, 10); return words.filter((word) => (word.history || []).some((item) => item.date === day && item.quality >= 3)).length; }); const max = Math.max(...values, 1);
  $('#progress-chart').innerHTML = values.map((value, index) => `<div class="bar-wrap"><span class="bar" style="height:${Math.max(6, value / max * 100)}%" title="${value} từ"></span><small>${index % 5 === 0 ? index + 1 : ''}</small></div>`).join('');
  const mistakes = [...words].sort((a, b) => (b.lapses || 0) - (a.lapses || 0)).slice(0, 5); $('#mistakes-list').innerHTML = mistakes.length ? mistakes.map((word) => `<div class="mistake-row"><strong>${escapeHtml(word.english)}</strong><span>${word.lapses || 0} lần quên</span></div>`).join('') : '<div class="empty-state">Chưa có dữ liệu sai. Cứ tiếp tục học nhé!</div>';
}
function updateSessionProgress() { const total = practiceWords.length; const percent = total ? Math.round(sessionReviewed / total * 100) : 0; const safePercent = Math.min(percent, 100); $('#session-count').textContent = `${safePercent}%`; $('#session-bar').style.width = `${safePercent}%`; $('#review-progress-bar').style.transform = `scaleX(${total ? Math.min(sessionReviewed / total, 1) : 0})`; }
function escapeHtml(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
function speak(text) { if (!('speechSynthesis' in window)) { showToast('Trình duyệt chưa hỗ trợ phát âm.'); return; } window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.rate = .86; window.speechSynthesis.speak(utterance); }
function openWordModal(word = null) { editingId = word?.id || null; $('#modal-title').textContent = word ? 'Sửa từ' : 'Thêm từ mới'; $('#english-input').value = word?.english || ''; $('#meaning-input').value = word?.meaning || ''; $('#example-input').value = word?.example || ''; $('#word-modal').showModal(); $('#english-input').focus(); }
async function saveWord(event) { event.preventDefault(); const english = $('#english-input').value.trim(); const meaning = $('#meaning-input').value.trim(); const example = $('#example-input').value.trim(); if (!english || !meaning || !example) return; const current = words.find((word) => word.id === editingId); const word = current ? { ...current, english, meaning, example } : makeWord(english, meaning, example); await saveToDb(word); words = current ? words.map((item) => item.id === word.id ? word : item) : [...words, word]; $('#word-modal').close(); renderAll(); showToast(current ? 'Đã cập nhật từ.' : 'Đã thêm từ mới.'); }
async function reviewWord(quality) { const word = practiceWords[currentCardIndex]; if (!word) return; const now = new Date(); const date = now.toISOString().slice(0, 10); word.reviews = (word.reviews || 0) + 1; word.history = [...(word.history || []), { date, quality }]; if (quality < 3) { word.lapses = (word.lapses || 0) + 1; word.repetitions = 0; word.interval = 1; } else { word.correct = (word.correct || 0) + 1; if (word.repetitions === 0) word.interval = 1; else if (word.repetitions === 1) word.interval = 6; else word.interval = Math.round(word.interval * word.ease); word.repetitions += 1; word.ease = Math.max(1.3, word.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))); } word.dueDate = todayStart() + word.interval * 86400000; await saveToDb(word); words = words.map((item) => item.id === word.id ? word : item); sessionReviewed += 1; currentCardIndex = (currentCardIndex + 1) % Math.max(practiceWords.length, 1); localStorage.setItem('lumen-streak', String(Math.max(Number(localStorage.getItem('lumen-streak') || 0), 1))); renderAll(); showToast(`Đã ghi nhận. Ôn lại vào ${formatDate(word.dueDate)}.`); }

function showView(name) { $$('.view').forEach((view) => view.classList.toggle('active', view.dataset.section === name)); $$('.nav-link').forEach((button) => button.classList.toggle('active', button.dataset.view === name)); history.replaceState(null, '', `#${name}`); if (name === 'practice') renderPractice(); }
function openContext() { const available = words.filter((word) => word.example.toLowerCase().includes(word.english.toLowerCase())); if (!available.length) { showToast('Hãy thêm câu ví dụ có chứa từ tiếng Anh.'); return; } const word = available[Math.floor(Math.random() * available.length)]; $('#context-modal').dataset.answer = word.english; $('#context-sentence').textContent = word.example.replace(new RegExp(word.english, 'i'), '_____'); $('#context-input').value = ''; $('#context-result').textContent = ''; $('#context-modal').showModal(); }
function openDictation() { const word = words[Math.floor(Math.random() * words.length)]; if (!word) return; $('#dictation-modal').dataset.sentence = word.example; $('#dictation-example').textContent = '••• Câu đã sẵn sàng •••'; $('#dictation-input').value = ''; $('#dictation-result').innerHTML = ''; $('#dictation-modal').showModal(); speak(word.example); }
function compareDictation() { const target = $('#dictation-modal').dataset.sentence || ''; const actual = $('#dictation-input').value.trim(); const targetWords = target.split(/(\s+)/); const actualWords = actual.split(/(\s+)/); $('#dictation-result').innerHTML = targetWords.map((word, index) => word.trim() && word.toLowerCase() !== (actualWords[index] || '').toLowerCase() ? `<span class="wrong">${escapeHtml(word)}</span>` : escapeHtml(word)).join(' ') + `<br><small class="${actual.toLowerCase() === target.toLowerCase() ? 'right' : 'wrong'}">${actual.toLowerCase() === target.toLowerCase() ? 'Chính xác, rất tốt!' : 'Những từ gạch chân cần được nghe lại.'}</small>`; }
function bindEvents() {
  $$('.nav-link').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view))); $('#start-learning').addEventListener('click', () => showView('practice')); $('#hero-practice').addEventListener('click', () => showView('practice')); $('#add-word').addEventListener('click', () => openWordModal()); $('#word-form').addEventListener('submit', saveWord); $('#search-input').addEventListener('input', renderWords); $('#flashcard').addEventListener('click', () => $('#flashcard').classList.toggle('flipped')); $('#next-card').addEventListener('click', () => { currentCardIndex = (currentCardIndex + 1) % Math.max(practiceWords.length, 1); renderPractice(); }); $$('.review-button').forEach((button) => button.addEventListener('click', () => reviewWord(Number(button.dataset.quality)))); $('#notes').addEventListener('input', (event) => localStorage.setItem('lumen-notes', event.target.value)); $('#theme-toggle').addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; localStorage.setItem('lumen-theme', theme); }); $('#import-button').addEventListener('click', () => $('#import-input').click()); $('#import-input').addEventListener('change', importData); $('#export-button').addEventListener('click', exportData); $('#dictation-button').addEventListener('click', openDictation); $('#close-dictation').addEventListener('click', () => $('#dictation-modal').close()); $('#play-dictation').addEventListener('click', () => speak($('#dictation-modal').dataset.sentence)); $('#check-dictation').addEventListener('click', compareDictation); $('#context-button').addEventListener('click', openContext); $('#close-context').addEventListener('click', () => $('#context-modal').close()); $('#check-context').addEventListener('click', () => { const answer = $('#context-input').value.trim().toLowerCase(); const expected = $('#context-modal').dataset.answer.toLowerCase(); $('#context-result').textContent = answer === expected ? '✓ Chính xác! Bạn đã dùng đúng từ trong ngữ cảnh.' : `Chưa đúng. Đáp án là “${expected}”.`; $('#context-result').className = `feedback ${answer === expected ? 'success' : 'error'}`; }); $('#word-list').addEventListener('click', async (event) => { const button = event.target.closest('button'); if (!button) return; const word = words.find((item) => item.id === (button.dataset.edit || button.dataset.delete || button.dataset.speak)); if (button.dataset.speak) speak(word.english); if (button.dataset.edit) openWordModal(word); if (button.dataset.delete && word && confirm(`Xoá từ “${word.english}”?`)) { await removeFromDb(word.id); words = words.filter((item) => item.id !== word.id); renderAll(); showToast('Đã xoá từ.'); } }); }
function exportData() { const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), words }, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `lumen-vocabulary-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href); showToast('Đã xuất dữ liệu JSON.'); }
async function importData(event) { const file = event.target.files[0]; if (!file) return; try { const data = JSON.parse(await file.text()); const imported = Array.isArray(data) ? data : data.words; if (!Array.isArray(imported)) throw new Error('invalid'); const existing = new Set(words.map((word) => word.english.toLowerCase())); const additions = imported.filter((word) => word.english && !existing.has(word.english.toLowerCase())).map((word) => ({ ...makeWord(word.english, word.meaning || '', word.example || ''), ...word, id: word.id || crypto.randomUUID() })); await Promise.all(additions.map(saveToDb)); words = [...words, ...additions]; renderAll(); showToast(`Đã nhập ${additions.length} từ mới.`); } catch { showToast('File JSON không hợp lệ.'); } event.target.value = ''; }
init().catch(() => showToast('Không thể mở kho dữ liệu offline.'));
