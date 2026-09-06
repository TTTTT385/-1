import './styles/app.css'
import {
  matches,
  news,
  newsTabs,
  standings,
  players,
  teams,
  teamName,
  teamCrest,
} from './data/sports.js'

const state = {
  view: 'matches',
  newsFilter: 'all',
  matchFilter: 'all',
  selectedMatchId: null,
  matchTab: 'details',
  lineupSide: 'home',
  favorites: loadFavorites(),
  deferredPrompt: null,
  showInstall: false,
  showIosHelp: false,
  search: '',
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('goal360-favs') || '[]')
  } catch {
    return []
  }
}

function saveFavorites() {
  localStorage.setItem('goal360-favs', JSON.stringify(state.favorites))
}

function isFavorite(id) {
  return state.favorites.includes(id)
}

function toggleFavorite(id) {
  if (isFavorite(id)) {
    state.favorites = state.favorites.filter((x) => x !== id)
  } else {
    state.favorites = [...state.favorites, id]
  }
  saveFavorites()
  render()
}

const icons = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/></svg>`,
  starFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.6 12 20l-7.5-7.4a4.5 4.5 0 1 1 7.5-5 4.5 4.5 0 1 1 7.5 5z"/></svg>`,
  games: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  news: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5z"/><path d="M18 7h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4"/><path d="M8 9h6M8 13h6M8 17h4"/></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16M9 6v12"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
}

function crestHtml(teamId) {
  const t = teams[teamId]
  const label = teamCrest(teamId)
  const bg = t?.color || '#333'
  const color = bg.toLowerCase() === '#ffffff' || bg.toLowerCase() === '#fde100' ? '#111' : '#fff'
  return `<span class="crest" style="background:${bg};color:${color}">${label}</span>`
}

function statusLabel(match) {
  if (match.status === 'live') {
    return `<span class="live-pill">LIVE ${match.minute}</span>`
  }
  if (match.status === 'finished') return 'סיום'
  return match.kickoff || match.minute
}

function scoreText(match) {
  if (match.score[0] == null) return '—'
  return `${match.score[0]} – ${match.score[1]}`
}

function renderTopbar(titleExtras = '') {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">360</div>
        <div class="brand-text">
          <strong>גול360</strong>
          <span>ספורט בזמן אמת</span>
        </div>
      </div>
      <div class="top-actions">
        ${titleExtras}
        <button class="icon-btn" data-action="open-search" aria-label="חיפוש">${icons.search}</button>
        <button class="icon-btn" data-action="toggle-install" aria-label="הוספה לדף הבית">${icons.bell}</button>
      </div>
    </header>
  `
}

function renderNav() {
  const items = [
    { id: 'matches', label: 'משחקים', icon: icons.games },
    { id: 'news', label: 'חדשות', icon: icons.news },
    { id: 'table', label: 'טבלה', icon: icons.table },
    { id: 'more', label: 'עוד', icon: icons.more },
  ]
  return `
    <nav class="bottom-nav">
      ${items
        .map(
          (item) => `
        <button class="nav-item ${state.view === item.id ? 'active' : ''}" data-nav="${item.id}">
          ${item.icon}
          <span>${item.label}</span>
        </button>
      `,
        )
        .join('')}
    </nav>
  `
}

function renderMatches() {
  const filters = [
    { id: 'all', label: 'הכל' },
    { id: 'live', label: 'חי' },
    { id: 'finished', label: 'הסתיימו' },
    { id: 'scheduled', label: 'עוד לא התחילו' },
  ]
  const list = matches.filter((m) =>
    state.matchFilter === 'all' ? true : m.status === state.matchFilter,
  )

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head">
        <h2>משחקים היום</h2>
        <button class="link" data-action="goto-player" data-player="solomon">שחקן בולט</button>
      </div>
      <div class="chips">
        ${filters
          .map(
            (f) => `
          <button class="chip ${state.matchFilter === f.id ? 'active' : ''}" data-match-filter="${f.id}">${f.label}</button>
        `,
          )
          .join('')}
      </div>
      <div class="match-list">
        ${list
          .map(
            (m) => `
          <button class="match-row" data-open-match="${m.id}">
            <div class="match-meta">
              <span>${m.league === 'il' ? 'ליגת העל' : m.league === 'ucl' ? 'ליגת האלופות' : 'בינלאומי'}</span>
              ${statusLabel(m)}
            </div>
            <div class="match-teams">
              <div class="team-side">
                ${crestHtml(m.home)}
                <strong>${teamName(m.home)}</strong>
              </div>
              <div class="scoreboard">
                <div class="score" dir="ltr">${scoreText(m)}</div>
                <div class="minute ${m.status === 'live' ? 'live' : ''}">${m.minute}</div>
              </div>
              <div class="team-side away">
                <strong>${teamName(m.away)}</strong>
                ${crestHtml(m.away)}
              </div>
            </div>
          </button>
        `,
          )
          .join('')}
      </div>
    </div>
  `
}

function renderNews() {
  const filtered =
    state.newsFilter === 'all'
      ? news
      : news.filter((n) => n.category === state.newsFilter)

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head">
        <h2>חדשות ועדכונים</h2>
      </div>
      <div class="chips">
        ${newsTabs
          .map(
            (t) => `
          <button class="chip ${state.newsFilter === t.id ? 'active' : ''}" data-news-filter="${t.id}">${t.label}</button>
        `,
          )
          .join('')}
      </div>
      ${filtered
        .map(
          (n) => `
        <article class="news-card">
          <div class="media"><img src="${n.image}" alt="" loading="lazy" /></div>
          <div class="body">
            <div class="news-meta"><span>${n.source}</span><span>${n.time}</span></div>
            <h3>${n.title}</h3>
            <div class="news-actions">
              <span>${icons.heart} ${n.likes}</span>
              <span>${icons.share} שיתוף</span>
            </div>
          </div>
        </article>
      `,
        )
        .join('')}
    </div>
  `
}

function renderTable() {
  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="league-banner">
        <h2>ליגת העל 2024/2025</h2>
        <p>טבלה · משחקים · סטטיסטיקות</p>
      </div>
      <div class="chips">
        <button class="chip active">טבלה</button>
        <button class="chip" data-nav="matches">משחקים</button>
        <button class="chip" data-action="goto-player" data-player="solomon">שחקן מצטיין</button>
      </div>
      <div class="table-wrap">
        <div class="table-header">
          <span>#</span><span>קבוצה</span><span>מש׳</span><span>הפרש</span><span>נק׳</span>
        </div>
        ${standings
          .map((row) => {
            const t = teams[row.team]
            return `
            <div class="table-row">
              <span class="pos">${row.pos}</span>
              <div class="team">${crestHtml(row.team)}<span>${t.name}</span></div>
              <span>${row.played}</span>
              <span>${row.gd > 0 ? '+' : ''}${row.gd}</span>
              <span class="pts">${row.pts}</span>
            </div>
          `
          })
          .join('')}
      </div>
      <button class="spotlight" data-action="goto-player" data-player="solomon">
        <img src="${players.solomon.photo}" alt="" />
        <div>
          <strong>שחקן מצטיין · מנור סולומון</strong>
          <span>דירוג 7.0 · 3 בישולים · לידס</span>
        </div>
      </button>
    </div>
  `
}

function renderPlayer(playerId = 'solomon') {
  const p = players[playerId] || players.solomon
  const club = teams[p.club]

  return `
    <header class="topbar">
      <div class="detail-header" style="margin:0">
        <button class="back-btn" data-action="back">${icons.back}</button>
        <h2>פרופיל שחקן</h2>
      </div>
      <div class="top-actions">
        <button class="icon-btn ${isFavorite(p.id) ? 'active' : ''}" data-action="fav" data-id="${p.id}" style="${isFavorite(p.id) ? 'color:var(--warning)' : ''}">
          ${isFavorite(p.id) ? icons.starFilled : icons.star}
        </button>
      </div>
    </header>
    <div class="view-scroll">
      <div class="player-hero">
        <img class="player-photo" src="${p.photo}" alt="${p.name}" />
        <div>
          <h2>${p.name}</h2>
          <p>${p.position} · ${club?.name || ''} · #${p.number}</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-tile"><div class="val">${p.age}</div><div class="lbl">גיל</div></div>
        <div class="stat-tile"><div class="val">${p.height}</div><div class="lbl">גובה</div></div>
        <div class="stat-tile"><div class="val">${p.number}</div><div class="lbl">מספר</div></div>
      </div>
      <div class="stat-grid">
        <div class="stat-tile"><div class="val">${p.rating}</div><div class="lbl">דירוג ★</div></div>
        <div class="stat-tile"><div class="val">${p.goals}</div><div class="lbl">שערים</div></div>
        <div class="stat-tile"><div class="val">${p.assists}</div><div class="lbl">בישולים</div></div>
      </div>
      <div class="info-panel">
        <h3>פרטי שחקן</h3>
        <div class="info-rows">
          <div class="info-row"><span>לאום</span><span>${p.nationality}</span></div>
          <div class="info-row"><span>תאריך לידה</span><span>${p.dob}</span></div>
          <div class="info-row"><span>הופעות העונה</span><span>${p.apps}</span></div>
          <div class="info-row"><span>חוזה</span><span>${p.contract}</span></div>
          <div class="info-row"><span>קריירה</span><span>${p.careerApps} הופ׳ · ${p.careerGoals} שערים</span></div>
        </div>
      </div>
      <div class="info-panel">
        <h3>היסטוריית קריירה</h3>
        <div class="timeline">
          ${p.history
            .map(
              (h) => `
            <div class="timeline-item">${h.date}: ${h.from} ← ${h.to}</div>
          `,
            )
            .join('')}
        </div>
      </div>
    </div>
  `
}

function renderPitch(lineup) {
  if (!lineup) {
    return `<div class="empty-state"><h3>אין הרכב עדיין</h3><p>ההרכב יפורסם לפני המשחק</p></div>`
  }
  return `
    <div class="pitch">
      ${lineup.players
        .map(
          (pl) => `
        <div class="pitch-player" style="right:${pl.x}%; top:${pl.y}%">
          <span class="rating">${pl.rating.toFixed(1)}</span>
          <div class="avatar">${pl.num}</div>
          <div class="name">${pl.name}</div>
        </div>
      `,
        )
        .join('')}
    </div>
    <p style="text-align:center;color:var(--text-muted);font-size:13px;font-weight:600;margin-bottom:12px">מערך ${lineup.formation}</p>
  `
}

function renderMatchDetail() {
  const match = matches.find((m) => m.id === state.selectedMatchId)
  if (!match) {
    state.view = 'matches'
    return renderMatches()
  }

  const tabs = [
    { id: 'details', label: 'פרטים' },
    { id: 'lineups', label: 'הרכבים' },
    { id: 'stats', label: 'סטטיסטיקה' },
  ]

  let body = ''
  if (state.matchTab === 'details') {
    body = `
      ${
        match.possession
          ? `
        <div class="possession">
          <div class="possession-labels">
            <span>${teamName(match.home)} ${match.possession.home}%</span>
            <span>שליטה</span>
            <span>${match.possession.away}% ${teamName(match.away)}</span>
          </div>
          <div class="possession-bar">
            <div class="home" style="width:${match.possession.home}%"></div>
            <div class="away" style="width:${match.possession.away}%"></div>
          </div>
        </div>
      `
          : ''
      }
      <div class="section-head"><h2>אירועי המשחק</h2></div>
      <div class="event-list">
        ${
          match.events.length
            ? match.events
                .map(
                  (e) => `
              <div class="event-item">
                <div style="display:flex;align-items:center;gap:10px">
                  <span class="ball">${e.type === 'goal' ? '⚽' : '■'}</span>
                  <span>${e.player}</span>
                </div>
                <span style="color:var(--text-muted)">${e.minute}</span>
              </div>
            `,
                )
                .join('')
            : `<div class="empty-state"><p>טרם היו אירועים</p></div>`
        }
      </div>
    `
  } else if (state.matchTab === 'lineups') {
    const side = state.lineupSide
    const lineup = match.lineups?.[side]
    body = `
      <div class="team-toggle">
        <button class="${side === 'home' ? 'active' : ''}" data-lineup-side="home">${teamName(match.home)}</button>
        <button class="${side === 'away' ? 'active' : ''}" data-lineup-side="away">${teamName(match.away)}</button>
      </div>
      ${renderPitch(lineup)}
    `
  } else {
    body = `
      <div class="stat-grid">
        <div class="stat-tile"><div class="val">${match.possession?.home ?? '—'}</div><div class="lbl">שליטה בית</div></div>
        <div class="stat-tile"><div class="val">${match.events.filter((e) => e.type === 'goal').length}</div><div class="lbl">שערים</div></div>
        <div class="stat-tile"><div class="val">${match.possession?.away ?? '—'}</div><div class="lbl">שליטה חוץ</div></div>
      </div>
      <div class="info-panel">
        <h3>סיכום</h3>
        <div class="info-rows">
          <div class="info-row"><span>סטטוס</span><span>${match.status === 'live' ? 'בשידור חי' : match.status === 'finished' ? 'הסתיים' : 'ממתין'}</span></div>
          <div class="info-row"><span>דקה</span><span>${match.minute}</span></div>
          <div class="info-row"><span>תוצאה</span><span dir="ltr">${scoreText(match)}</span></div>
        </div>
      </div>
    `
  }

  return `
    <header class="topbar">
      <div class="detail-header" style="margin:0">
        <button class="back-btn" data-action="back">${icons.back}</button>
        <h2>פרטי משחק</h2>
      </div>
      <div class="top-actions">
        <button class="icon-btn" data-action="fav" data-id="${match.id}" style="${isFavorite(match.id) ? 'color:var(--warning)' : ''}">
          ${isFavorite(match.id) ? icons.starFilled : icons.star}
        </button>
      </div>
    </header>
    <div class="view-scroll">
      <div class="score-hero">
        <div class="match-meta" style="margin-bottom:12px">
          <span>${match.league === 'il' ? 'ליגת העל' : match.league === 'ucl' ? 'ליגת האלופות' : 'בינלאומי'}</span>
          ${statusLabel(match)}
        </div>
        <div class="match-teams">
          <div class="team-side">
            ${crestHtml(match.home)}
            <strong>${teamName(match.home)}</strong>
          </div>
          <div class="scoreboard">
            <div class="score" dir="ltr">${scoreText(match)}</div>
            <div class="minute ${match.status === 'live' ? 'live' : ''}">${match.minute}</div>
          </div>
          <div class="team-side away">
            <strong>${teamName(match.away)}</strong>
            ${crestHtml(match.away)}
          </div>
        </div>
      </div>
      <div class="tabs">
        ${tabs
          .map(
            (t) => `
          <button class="tab ${state.matchTab === t.id ? 'active' : ''}" data-match-tab="${t.id}">${t.label}</button>
        `,
          )
          .join('')}
      </div>
      ${body}
    </div>
  `
}

function renderMore() {
  const favMatches = matches.filter((m) => isFavorite(m.id))
  const favPlayers = Object.values(players).filter((p) => isFavorite(p.id))

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head"><h2>עוד</h2></div>
      <div class="info-panel">
        <h3>הוספה לדף הבית</h3>
        <p style="color:var(--text-muted);font-size:13px;line-height:1.5;margin-bottom:12px">
          התקינו את גול360 כאיקון בטלפון — בלי חנות אפליקציות. עובד ב-iPhone וב-Android.
        </p>
        <button class="btn-primary" data-action="install" style="width:100%">הוסף לדף הבית</button>
        <div class="ios-help ${state.showIosHelp ? 'show' : ''}" id="ios-help">
          <strong>אייפון (Safari):</strong> לחצו על כפתור השיתוף ואז על ״הוסף למסך הבית״.<br />
          <strong>אנדרואיד (Chrome):</strong> תפריט ⋮ ואז ״התקן אפליקציה״ / ״הוסף למסך הבית״.
        </div>
      </div>
      <div class="section-head"><h2>מועדפים</h2></div>
      ${
        !favMatches.length && !favPlayers.length
          ? `<div class="fav-empty"><p>עדיין אין מועדפים — סמנו כוכב במשחק או בשחקן</p></div>`
          : `
            <div class="match-list">
              ${favMatches
                .map(
                  (m) => `
                <button class="match-row" data-open-match="${m.id}">
                  <div class="match-teams">
                    <div class="team-side">${crestHtml(m.home)}<strong>${teamName(m.home)}</strong></div>
                    <div class="scoreboard"><div class="score" dir="ltr">${scoreText(m)}</div></div>
                    <div class="team-side away"><strong>${teamName(m.away)}</strong>${crestHtml(m.away)}</div>
                  </div>
                </button>
              `,
                )
                .join('')}
            </div>
            ${favPlayers
              .map(
                (p) => `
              <button class="spotlight" data-action="goto-player" data-player="${p.id}" style="margin-top:10px">
                <img src="${p.photo}" alt="" />
                <div><strong>${p.name}</strong><span>${p.position}</span></div>
              </button>
            `,
              )
              .join('')}
          `
      }
      <div class="info-panel" style="margin-top:14px">
        <h3>שחקנים לדוגמה</h3>
        <button class="spotlight" data-action="goto-player" data-player="solomon" style="border:none;padding:0;background:transparent;margin:0 0 10px">
          <img src="${players.solomon.photo}" alt="" />
          <div><strong>מנור סולומון</strong><span>כנף · לידס</span></div>
        </button>
        <button class="spotlight" data-action="goto-player" data-player="peretz" style="border:none;padding:0;background:transparent;margin:0">
          <img src="${players.peretz.photo}" alt="" />
          <div><strong>דניאל פרץ</strong><span>שוער · מכבי ת״א</span></div>
        </button>
      </div>
    </div>
  `
}

function renderInstallBanner() {
  if (!state.showInstall) return ''
  return `
    <div class="install-banner show">
      <div>
        <strong>הוסיפו את גול360 לדף הבית</strong>
        <p>גישה מהירה כמו אפליקציה — במסך מלא</p>
      </div>
      <div class="install-actions">
        <button class="btn-primary" data-action="install">הוסף</button>
        <button class="btn-ghost" data-action="dismiss-install">לא עכשיו</button>
      </div>
    </div>
  `
}

function render() {
  const app = document.getElementById('app')
  let content = ''
  const hideNav = state.view === 'match' || state.view === 'player'

  if (state.view === 'matches') content = renderMatches()
  else if (state.view === 'news') content = renderNews()
  else if (state.view === 'table') content = renderTable()
  else if (state.view === 'more') content = renderMore()
  else if (state.view === 'match') content = renderMatchDetail()
  else if (state.view === 'player') content = renderPlayer(state.selectedPlayerId)
  else content = renderMatches()

  app.innerHTML = `
    <div class="app-shell ${state.showInstall ? 'with-install-banner' : ''} ${hideNav ? 'no-nav' : ''}">
      ${content}
      ${hideNav ? '' : renderNav()}
      ${renderInstallBanner()}
    </div>
  `
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

async function handleInstall() {
  if (state.deferredPrompt) {
    state.deferredPrompt.prompt()
    const result = await state.deferredPrompt.userChoice
    state.deferredPrompt = null
    state.showInstall = false
    if (result.outcome === 'accepted') {
      state.showIosHelp = false
    }
    render()
    return
  }
  state.showIosHelp = true
  state.view = 'more'
  state.showInstall = false
  render()
  document.getElementById('ios-help')?.scrollIntoView({ block: 'center' })
}

function bindGlobalEvents() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nav],[data-action],[data-open-match],[data-match-filter],[data-news-filter],[data-match-tab],[data-lineup-side],[data-player]')
    if (!t) return

    if (t.dataset.nav) {
      state.view = t.dataset.nav
      state.selectedMatchId = null
      render()
      return
    }
    if (t.dataset.openMatch) {
      state.selectedMatchId = t.dataset.openMatch
      state.view = 'match'
      state.matchTab = 'details'
      state.lineupSide = 'home'
      render()
      return
    }
    if (t.dataset.matchFilter) {
      state.matchFilter = t.dataset.matchFilter
      render()
      return
    }
    if (t.dataset.newsFilter) {
      state.newsFilter = t.dataset.newsFilter
      render()
      return
    }
    if (t.dataset.matchTab) {
      state.matchTab = t.dataset.matchTab
      render()
      return
    }
    if (t.dataset.lineupSide) {
      state.lineupSide = t.dataset.lineupSide
      render()
      return
    }

    const action = t.dataset.action
    if (!action) {
      if (t.dataset.player) {
        state.selectedPlayerId = t.dataset.player
        state.view = 'player'
        render()
      }
      return
    }

    if (action === 'back') {
      state.view = state.view === 'player' ? 'more' : 'matches'
      render()
      return
    }
    if (action === 'goto-player') {
      state.selectedPlayerId = t.dataset.player || 'solomon'
      state.view = 'player'
      render()
      return
    }
    if (action === 'fav') {
      toggleFavorite(t.dataset.id)
      return
    }
    if (action === 'install' || action === 'toggle-install') {
      handleInstall()
      return
    }
    if (action === 'dismiss-install') {
      state.showInstall = false
      localStorage.setItem('goal360-install-dismissed', '1')
      render()
      return
    }
    if (action === 'open-search') {
      state.view = 'news'
      render()
    }
  })
}

function setupPwaInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    state.deferredPrompt = e
    if (!localStorage.getItem('goal360-install-dismissed') && !isStandalone()) {
      state.showInstall = true
      render()
    }
  })

  window.addEventListener('appinstalled', () => {
    state.showInstall = false
    state.deferredPrompt = null
    render()
  })

  // Show soft prompt on iOS / browsers without beforeinstallprompt
  if (!isStandalone() && !localStorage.getItem('goal360-install-dismissed')) {
    setTimeout(() => {
      if (!state.deferredPrompt) {
        state.showInstall = true
        render()
      }
    }, 1800)
  }
}

function tickLiveMinutes() {
  setInterval(() => {
    let changed = false
    for (const m of matches) {
      if (m.status === 'live' && typeof m.minute === 'string' && m.minute.endsWith("'")) {
        const n = parseInt(m.minute, 10)
        if (!Number.isNaN(n) && n < 90) {
          m.minute = `${n + 1}'`
          changed = true
        }
      }
    }
    if (changed && (state.view === 'matches' || state.view === 'match')) render()
  }, 60000)
}

bindGlobalEvents()
setupPwaInstall()
tickLiveMinutes()
render()
