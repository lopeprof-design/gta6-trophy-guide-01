// Leonida Trophy Guide: a checklist of GTA VI's 55 trophies with a cited guide for each,
// a platinum roadmap, a missable warning, and progress saved in the browser (localStorage).
// Everything it loads is a file under app/; it makes no network request at run time.
const EARNED_KEY = 'leonida-trophy-guide-earned-v1';
const SPOILER_KEY = 'leonida-trophy-guide-spoilers-v1';
const OPEN_GUIDE_KEY = 'leonida-trophy-guide-open-v1';

const listEl = document.getElementById('trophy-list');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const notEarnedEl = document.getElementById('not-earned');
const spoilersEl = document.getElementById('spoilers');
const emptyNoteEl = document.getElementById('empty-note');
const saveNoteEl = document.getElementById('save-note');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set(readStoredArray(EARNED_KEY));
let openGuides = new Set(readStoredArray(OPEN_GUIDE_KEY));
let activeKind = 'all';
let spoilersOn = localStorage.getItem(SPOILER_KEY) !== 'off';
spoilersEl.checked = spoilersOn;

const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  side: 'Side strand',
  collectible: 'Collectible',
  activity: 'Activity',
  robbery: 'Robbery',
  online: 'Online',
};

// The Activities filter covers the hands-on kinds: activities, side strands and robberies.
function kindMatchesFilter(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return trophy.kind === 'online';
  if (kind === 'activity') return ['activity', 'side', 'robbery'].includes(trophy.kind);
  return trophy.kind === kind;
}

function readStoredArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort()));
  localStorage.setItem(OPEN_GUIDE_KEY, JSON.stringify([...openGuides]));
  saveNoteEl.textContent = 'Progress saved in this browser.';
}

function isSpoilerHidden(trophy) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

function guideBody(trophy) {
  // The data file ends each guide with a "Sources: ..." sentence; the sources are
  // rendered separately below, so strip that sentence here to avoid showing it twice.
  return trophy.guide.replace(/\s*Sources:.*$/, '');
}

function trophyMeta(trophy) {
  const parts = [];
  if (trophy.chapter) parts.push(trophy.chapter);
  if (trophy.mission) parts.push('Mission: ' + trophy.mission);
  if (trophy.count != null) parts.push('Target: ' + trophy.count.toLocaleString('en-US'));
  return parts.join(' · ');
}

function sourceList(trophy) {
  const wrap = document.createElement('p');
  wrap.className = 'sources';
  wrap.textContent = 'Sources: ';
  (trophy.sources ?? []).forEach((source, i) => {
    if (i > 0) wrap.append(', ');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.name;
      wrap.append(link);
    } else {
      wrap.append(source.name);
    }
  });
  return wrap;
}

function trophyCard(trophy) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(trophy.name) ? ' earned' : '');
  li.dataset.name = trophy.name;

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'trophy-check';
  check.checked = earned.has(trophy.name);
  check.setAttribute('aria-label', 'Earned: ' + trophy.name);
  check.addEventListener('change', () => {
    if (check.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveProgress();
    render();
  });
  li.append(check);

  const body = document.createElement('div');

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const name = document.createElement('span');
  name.className = 'trophy-name';
  name.textContent = isSpoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
  head.append(name);
  const grade = document.createElement('span');
  grade.className = 'grade grade-' + trophy.grade;
  grade.textContent = trophy.grade;
  head.append(grade);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  head.append(kindTag);
  if (trophy.missable) {
    const miss = document.createElement('span');
    miss.className = 'tag tag-missable';
    miss.textContent = 'Missable';
    head.append(miss);
  }
  if (trophy.hidden) {
    const hid = document.createElement('span');
    hid.className = 'tag tag-hidden';
    hid.textContent = 'Hidden on PSN';
    head.append(hid);
  }
  body.append(head);

  if (isSpoilerHidden(trophy)) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Story trophy — its name, description and guide stay hidden until you earn it. Tick the box when it pops to reveal it.';
    body.append(note);
  } else {
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = trophy.description;
    body.append(desc);
    const meta = trophyMeta(trophy);
    if (meta) {
      const metaEl = document.createElement('p');
      metaEl.className = 'trophy-meta';
      metaEl.textContent = meta;
      body.append(metaEl);
    }
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'guide-toggle';
    const open = openGuides.has(trophy.name);
    toggle.textContent = open ? 'Hide guide' : 'Show guide';
    toggle.setAttribute('aria-expanded', String(open));
    const guideBox = document.createElement('div');
    guideBox.className = 'guide';
    if (open) {
      const text = document.createElement('p');
      text.textContent = guideBody(trophy);
      guideBox.append(text, sourceList(trophy));
    }
    toggle.addEventListener('click', () => {
      if (openGuides.has(trophy.name)) openGuides.delete(trophy.name);
      else openGuides.add(trophy.name);
      saveProgress();
      render();
    });
    body.append(toggle, guideBox);
  }

  li.append(body);
  return li;
}

function visibleTrophies() {
  const query = searchEl.value.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (!kindMatchesFilter(trophy, activeKind)) return false;
    if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
    if (notEarnedEl.checked && earned.has(trophy.name)) return false;
    if (query) {
      const haystack = [trophy.name, trophy.description, trophy.guide, trophy.mission ?? '', trophy.chapter ?? ''].join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const total = trophies.length;
  const count = earned.size;
  const pct = Math.round((count / total) * 100);
  document.getElementById('progress-text').textContent = `${count} of ${total} earned`;
  document.getElementById('progress-pct').textContent = `${pct}% to platinum`;
  document.getElementById('progress-fill').style.width = pct + '%';
  const note = document.getElementById('progress-note');
  if (count === total) note.textContent = 'Platinum earned — Vice Got a Price! You are a Leonida Legend.';
  else if (count === total - 1) note.textContent = 'One more trophy and the platinum is yours.';
  else note.textContent = `Earn the other ${total - count - 1} trophies to unlock Vice Got a Price!`;
  document.getElementById('tracker-progress').textContent =
    `${count} of ${total} earned — ${pct}% to platinum`;
}

function render() {
  const shown = visibleTrophies();
  listEl.replaceChildren(...shown.map(trophyCard));
  if (shown.length === 0) {
    emptyNoteEl.hidden = false;
    emptyNoteEl.textContent = activeKind === 'online'
      ? 'No online trophies: GTA VI launches as a single-player game, so every trophy is earned offline.'
      : 'No trophies match these filters. Clear the search or pick another kind.';
  } else {
    emptyNoteEl.hidden = true;
  }
  renderProgress();
}

function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
  saveNoteEl.textContent = `Exported ${earned.size} earned trophies.`;
}

async function importProgress(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((trophy) => trophy.name));
    const imported = names.filter((name) => known.has(name));
    earned = new Set(imported);
    saveProgress();
    render();
    saveNoteEl.textContent = `Imported ${imported.length} earned trophies.`;
  } catch {
    saveNoteEl.textContent = 'That file could not be imported — it is not a progress export from this guide.';
  }
}

document.getElementById('kind-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-kind]');
  if (!button) return;
  activeKind = button.dataset.kind;
  for (const chip of document.querySelectorAll('#kind-filters .chip')) {
    const active = chip === button;
    chip.classList.toggle('active', active);
    chip.setAttribute('aria-pressed', String(active));
  }
  render();
});
searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
notEarnedEl.addEventListener('change', render);
spoilersEl.addEventListener('change', () => {
  spoilersOn = spoilersEl.checked;
  localStorage.setItem(SPOILER_KEY, spoilersOn ? 'on' : 'off');
  render();
});
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', (event) => {
  importProgress(event.target.files[0]);
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (earned.size === 0) return;
  earned = new Set();
  saveProgress();
  render();
  saveNoteEl.textContent = 'Progress reset.';
});

render();
