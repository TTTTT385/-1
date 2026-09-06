import './styles/app.css'
import {
  LEAGUES,
  leagueName,
  fetchScoreboard,
  fetchMatchDetail,
  fetchStandings,
  fetchNews,
  fetchPlayer,
} from './api/espn.js'

const DEFAULT_LEAGUES = LEAGUES.map((l) => l.slug)
const REFRESH_MS = 45_000

const state = {
  view: 'matches',
  league: 'all',
  matchStatus: 'all',
  newsLeague: 'isr.1',
  tableLeague: 'isr.1',
  matchTab: 'events',
  lineupSide: 'home',
  selectedMatch: null,
  selectedPlayer: null,
  favorites: loadFavorites(),
  deferredPrompt: null,
  showInstall: false,
  showInstallHelp: false,
  lastUpdated: null,
  refreshing: false,
  data: {
    matches: { loading: true, error: null, items: [], partial: false },
    detail: { loading: false, error: null, item: null },
    table: { loading: false, error: null, item: null },
    news: { loading: false, error: null, items: [] },
    player: { loading: false, error: null, item: null },
  },
}

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem('goal360-favs') || '[]')
  } catch {
    return []
  }
}

function isFavorite(id) {
  return state.favorites.includes(String(id))
}

function toggleFavorite(id) {
  const key = String(id)
  state.favorites = isFavorite(key)
    ? state.favorites.filter((x) => x !== key)
    : [...state.favorites, key]
  localStorage.setItem('goal360-favs', JSON.stringify(state.favorites))
  render()
}

const icons = {
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/></svg>`,
  starFilled: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.8 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
  games: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  news: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V5z"/><path d="M18 7h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-4"/><path d="M8 9h6M8 13h6M8 17h4"/></svg>`,
  table: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16M9 6v12"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`,
}

function esc(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function crest(team, size = 28) {
  if (team?.logo) {
    return `<img class="crest-img" style="width:${size}px;height:${size}px" src="${esc(team.logo)}" alt="" loading="lazy" />`
  }
  const label = (team?.abbr || team?.name || '?').slice(0, 3)
  return `<span class="crest" style="width:${size}px;height:${size}px;background:${esc(team?.color || '#2a3242')}">${esc(label)}</span>`
}

function statusBadge(match) {
  if (match.status === 'live') {
    return `<span class="live-pill">${esc(match.minute)}</span>`
  }
  if (match.status === 'finished') return `<span class="meta-tag">סיום</span>`
  return `<span class="meta-tag">${esc(match.minute)}</span>`
}

function scoreText(match) {
  if (match.home.score == null || match.away.score == null) return '—'
  return `${match.home.score} – ${match.away.score}`
}

function skeletonRows(count = 4) {
  return `<div class="match-list">${Array.from({ length: count })
    .map(() => `<div class="skeleton-row"></div>`)
    .join('')}</div>`
}

function errorBlock(message, retryAction) {
  return `
    <div class="empty-state">
      <h3>לא הצלחנו לטעון נתונים</h3>
      <p>${esc(message)}</p>
      <button class="btn-primary" style="margin-top:14px" data-action="${retryAction}">נסה שוב</button>
    </div>
  `
}

function updatedLabel() {
  if (!state.lastUpdated) return 'טוען…'
  const time = state.lastUpdated.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `עודכן ${time}`
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">360</div>
        <div class="brand-text">
          <strong>גול360</strong>
          <span>${esc(updatedLabel())}</span>
        </div>
      </div>
      <div class="top-actions">
        <button class="icon-btn ${state.refreshing ? 'spinning' : ''}" data-action="refresh" aria-label="רענון">${icons.refresh}</button>
        <button class="icon-btn" data-action="install" aria-label="הוספה לדף הבית">${icons.download}</button>
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
          ${item.icon}<span>${item.label}</span>
        </button>`,
        )
        .join('')}
    </nav>
  `
}

function matchRow(match) {
  return `
    <button class="match-row" data-open-match="${esc(match.id)}" data-league="${esc(match.leagueSlug)}">
      <div class="match-meta">
        <span>${esc(match.leagueName)}</span>
        ${statusBadge(match)}
      </div>
      <div class="match-teams">
        <div class="team-side">
          ${crest(match.home)}
          <strong>${esc(match.home.name)}</strong>
        </div>
        <div class="scoreboard">
          <div class="score" dir="ltr">${esc(scoreText(match))}</div>
          <div class="minute ${match.status === 'live' ? 'live' : ''}">${esc(match.status === 'scheduled' ? 'היום' : match.statusText)}</div>
        </div>
        <div class="team-side away">
          <strong>${esc(match.away.name)}</strong>
          ${crest(match.away)}
        </div>
      </div>
    </button>
  `
}

function renderMatches() {
  const { loading, error, items, partial } = state.data.matches

  const statusFilters = [
    { id: 'all', label: 'הכל' },
    { id: 'live', label: 'חי' },
    { id: 'scheduled', label: 'בקרוב' },
    { id: 'finished', label: 'הסתיימו' },
  ]

  const liveCount = items.filter((m) => m.status === 'live').length
  const visible = items.filter((m) =>
    state.matchStatus === 'all' ? true : m.status === state.matchStatus,
  )

  let body
  if (loading && !items.length) body = skeletonRows()
  else if (error && !items.length) body = errorBlock(error, 'refresh')
  else if (!visible.length)
    body = `<div class="empty-state"><h3>אין משחקים להצגה</h3><p>נסו סינון אחר או ליגה אחרת</p></div>`
  else body = `<div class="match-list">${visible.map(matchRow).join('')}</div>`

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head">
        <h2>משחקים</h2>
        ${liveCount ? `<span class="live-count">${liveCount} משחקים חיים</span>` : ''}
      </div>
      <div class="chips">
        ${statusFilters
          .map(
            (f) => `<button class="chip ${state.matchStatus === f.id ? 'active' : ''}" data-match-status="${f.id}">${f.label}</button>`,
          )
          .join('')}
      </div>
      <div class="chips">
        <button class="chip ${state.league === 'all' ? 'active' : ''}" data-league-filter="all">כל הליגות</button>
        ${LEAGUES.map(
          (l) => `<button class="chip ${state.league === l.slug ? 'active' : ''}" data-league-filter="${l.slug}">${l.short}</button>`,
        ).join('')}
      </div>
      ${partial ? `<p class="notice">חלק מהליגות לא נטענו — נסו לרענן</p>` : ''}
      ${body}
      <p class="source-note">נתונים חיים מ-ESPN · ${esc(updatedLabel())}</p>
    </div>
  `
}

function renderPitch(lineup) {
  if (!lineup) {
    return `<div class="empty-state"><h3>ההרכב עוד לא פורסם</h3><p>הרכבים מתפרסמים כשעה לפני שריקת הפתיחה</p></div>`
  }
  return `
    <div class="pitch">
      ${lineup.players
        .map(
          (p) => `
        <button class="pitch-player" style="right:${p.x}%; top:${p.y}%" data-open-player="${esc(p.id || '')}">
          ${p.rating ? `<span class="rating">${p.rating.toFixed(1)}</span>` : ''}
          <div class="avatar">${esc(p.num)}</div>
          <div class="name">${esc(p.name)}</div>
        </button>`,
        )
        .join('')}
    </div>
    ${lineup.formation ? `<p class="formation-note">מערך <span dir="ltr">${esc(lineup.formation)}</span></p>` : ''}
    ${
      lineup.bench.length
        ? `<div class="info-panel">
            <h3>ספסל</h3>
            <div class="info-rows">
              ${lineup.bench
                .slice(0, 9)
                .map(
                  (b) => `<button class="info-row bench-row" data-open-player="${esc(b.id || '')}"><span>${esc(b.num)} · ${esc(b.name)}</span><span>${esc(b.position)}</span></button>`,
                )
                .join('')}
            </div>
          </div>`
        : ''
    }
  `
}

function renderMatchDetail() {
  const { loading, error, item } = state.data.detail

  if (loading && !item) {
    return `
      ${detailHeader('פרטי משחק')}
      <div class="view-scroll">${skeletonRows(3)}</div>
    `
  }
  if (error && !item) {
    return `
      ${detailHeader('פרטי משחק')}
      <div class="view-scroll">${errorBlock(error, 'reload-detail')}</div>
    `
  }

  const match = item
  const tabs = [
    { id: 'events', label: 'אירועים' },
    { id: 'lineups', label: 'הרכבים' },
    { id: 'stats', label: 'סטטיסטיקה' },
  ]

  let body = ''
  if (state.matchTab === 'events') {
    body = match.events.length
      ? `<div class="event-list">
          ${match.events
            .map(
              (e) => `
            <div class="event-item ${e.side === 'away' ? 'away' : ''}">
              <div class="event-main">
                <span class="event-icon ${e.isGoal ? 'goal' : e.isCard ? 'card' : e.isSub ? 'sub' : ''}">${e.isGoal ? '⚽' : e.isCard ? '▮' : e.isSub ? '⇄' : '•'}</span>
                <div>
                  <strong>${esc(e.player || e.typeText)}</strong>
                  <span class="event-sub">${esc(e.player ? e.typeText : e.text.slice(0, 70))}</span>
                </div>
              </div>
              <span class="event-minute" dir="ltr">${esc(e.minute)}</span>
            </div>`,
            )
            .join('')}
        </div>`
      : `<div class="empty-state"><h3>אין אירועים</h3><p>${esc(match.status === 'scheduled' ? 'המשחק עוד לא התחיל' : 'טרם דווחו אירועים')}</p></div>`
  } else if (state.matchTab === 'lineups') {
    const lineup = match.lineups[state.lineupSide]
    body = `
      <div class="team-toggle">
        <button class="${state.lineupSide === 'home' ? 'active' : ''}" data-lineup-side="home">${esc(match.home.name)}</button>
        <button class="${state.lineupSide === 'away' ? 'active' : ''}" data-lineup-side="away">${esc(match.away.name)}</button>
      </div>
      ${renderPitch(lineup)}
    `
  } else {
    body = match.stats.length
      ? `<div class="stats-list">
          ${match.stats
            .map(
              (s) => `
            <div class="stat-compare">
              <div class="stat-compare-head">
                <span dir="ltr">${esc(s.home)}</span>
                <span class="stat-name">${esc(s.label)}</span>
                <span dir="ltr">${esc(s.away)}</span>
              </div>
              ${statBar(s)}
            </div>`,
            )
            .join('')}
        </div>`
      : `<div class="empty-state"><h3>אין סטטיסטיקה</h3><p>נתונים יופיעו לאחר תחילת המשחק</p></div>`
  }

  return `
    ${detailHeader('פרטי משחק', match.id)}
    <div class="view-scroll">
      <div class="score-hero">
        <div class="match-meta" style="margin-bottom:14px">
          <span>${esc(match.leagueName)}</span>
          ${statusBadge(match)}
        </div>
        <div class="match-teams">
          <div class="team-side stacked">
            ${crest(match.home, 44)}
            <strong>${esc(match.home.name)}</strong>
          </div>
          <div class="scoreboard">
            <div class="score big" dir="ltr">${esc(scoreText(match))}</div>
            <div class="minute ${match.status === 'live' ? 'live' : ''}">${esc(match.statusText)}</div>
          </div>
          <div class="team-side stacked">
            ${crest(match.away, 44)}
            <strong>${esc(match.away.name)}</strong>
          </div>
        </div>
        ${match.venue ? `<p class="venue">${esc(match.venue)}</p>` : ''}
      </div>
      <div class="tabs">
        ${tabs
          .map(
            (t) => `<button class="tab ${state.matchTab === t.id ? 'active' : ''}" data-match-tab="${t.id}">${t.label}</button>`,
          )
          .join('')}
      </div>
      ${body}
    </div>
  `
}

function statBar(stat) {
  const home = parseFloat(stat.home)
  const away = parseFloat(stat.away)
  if (!Number.isFinite(home) || !Number.isFinite(away) || home + away === 0) return ''
  const total = home + away
  return `
    <div class="possession-bar">
      <div class="home" style="width:${(home / total) * 100}%"></div>
      <div class="away" style="width:${(away / total) * 100}%"></div>
    </div>
  `
}

function detailHeader(title, favId) {
  return `
    <header class="topbar">
      <div class="detail-header" style="margin:0">
        <button class="back-btn" data-action="back">${icons.back}</button>
        <h2>${esc(title)}</h2>
      </div>
      <div class="top-actions">
        ${
          favId
            ? `<button class="icon-btn" data-action="fav" data-id="${esc(favId)}" style="${isFavorite(favId) ? 'color:var(--warning)' : ''}">${isFavorite(favId) ? icons.starFilled : icons.star}</button>`
            : ''
        }
      </div>
    </header>
  `
}

function renderTable() {
  const { loading, error, item } = state.data.table

  let body
  if (loading && !item) body = skeletonRows(6)
  else if (error && !item) body = errorBlock(error, 'reload-table')
  else if (!item?.groups.length)
    body = `<div class="empty-state"><h3>אין טבלה</h3><p>הליגה הזו לא מפרסמת טבלה כרגע</p></div>`
  else
    body = item.groups
      .map(
        (group) => `
      ${item.groups.length > 1 ? `<h3 class="group-title">${esc(group.name)}</h3>` : ''}
      <div class="table-wrap">
        <div class="table-header">
          <span>#</span><span>קבוצה</span><span>מש׳</span><span>הפרש</span><span>נק׳</span>
        </div>
        ${group.entries
          .map(
            (row) => `
          <div class="table-row">
            <span class="pos">${esc(row.rank)}</span>
            <div class="team">${crest(row.team, 24)}<span>${esc(row.team.name)}</span></div>
            <span dir="ltr">${esc(row.played)}</span>
            <span dir="ltr">${esc(row.goalDiff)}</span>
            <span class="pts" dir="ltr">${esc(row.points)}</span>
          </div>`,
          )
          .join('')}
      </div>`,
      )
      .join('')

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="league-banner">
        <h2>${esc(leagueName(state.tableLeague))}</h2>
        <p>${esc(item?.season || 'טבלת ליגה')}</p>
      </div>
      <div class="chips">
        ${LEAGUES.map(
          (l) => `<button class="chip ${state.tableLeague === l.slug ? 'active' : ''}" data-table-league="${l.slug}">${l.short}</button>`,
        ).join('')}
      </div>
      ${body}
      <p class="source-note">נתונים חיים מ-ESPN</p>
    </div>
  `
}

function renderNews() {
  const { loading, error, items } = state.data.news

  let body
  if (loading && !items.length) body = skeletonRows(3)
  else if (error && !items.length) body = errorBlock(error, 'reload-news')
  else if (!items.length)
    body = `<div class="empty-state"><h3>אין חדשות</h3><p>נסו ליגה אחרת</p></div>`
  else
    body = items
      .map(
        (article) => `
      <a class="news-card" href="${esc(article.link)}" target="_blank" rel="noopener noreferrer">
        ${article.image ? `<div class="media"><img src="${esc(article.image)}" alt="" loading="lazy" /></div>` : ''}
        <div class="body">
          <div class="news-meta"><span>ESPN</span><span>${esc(article.publishedLabel)}</span></div>
          <h3>${esc(article.title)}</h3>
          ${article.description ? `<p class="news-desc">${esc(article.description)}</p>` : ''}
          <div class="news-actions"><span>${icons.external} קרא בהרחבה</span></div>
        </div>
      </a>`,
      )
      .join('')

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head"><h2>חדשות</h2></div>
      <div class="chips">
        ${LEAGUES.map(
          (l) => `<button class="chip ${state.newsLeague === l.slug ? 'active' : ''}" data-news-league="${l.slug}">${l.short}</button>`,
        ).join('')}
      </div>
      ${body}
      <p class="source-note">כותרות מ-ESPN (באנגלית)</p>
    </div>
  `
}

function renderPlayer() {
  const { loading, error, item } = state.data.player

  if (loading && !item) {
    return `${detailHeader('פרופיל שחקן')}<div class="view-scroll">${skeletonRows(3)}</div>`
  }
  if (error && !item) {
    return `${detailHeader('פרופיל שחקן')}<div class="view-scroll">${errorBlock(error, 'back')}</div>`
  }

  const p = item
  const details = [
    ['גיל', p.age],
    ['גובה', p.height],
    ['לאום', p.citizenship],
    ['תפקיד', p.positionName],
    ['מספר', p.jersey],
    ['קבוצה', p.teamName],
  ].filter(([, value]) => value)

  return `
    ${detailHeader('פרופיל שחקן', p.id)}
    <div class="view-scroll">
      <div class="player-hero">
        ${
          p.headshot
            ? `<img class="player-photo" src="${esc(p.headshot)}" alt="" />`
            : `<div class="player-photo placeholder">${esc((p.name || '?').slice(0, 1))}</div>`
        }
        <div>
          <h2>${esc(p.name)}</h2>
          <p>${esc([p.positionName, p.teamName].filter(Boolean).join(' · '))}</p>
        </div>
      </div>
      ${
        p.seasonStats.length
          ? `<div class="stat-grid">
              ${p.seasonStats
                .slice(0, 6)
                .map(
                  (s) => `<div class="stat-tile"><div class="val" dir="ltr">${esc(s.value)}</div><div class="lbl">${esc(s.label)}</div></div>`,
                )
                .join('')}
            </div>`
          : ''
      }
      <div class="info-panel">
        <h3>פרטי שחקן</h3>
        <div class="info-rows">
          ${details
            .map(
              ([label, value]) => `<div class="info-row"><span>${esc(label)}</span><span>${esc(value)}</span></div>`,
            )
            .join('')}
        </div>
      </div>
      <p class="source-note">נתוני שחקן מ-ESPN</p>
    </div>
  `
}

function renderMore() {
  const favMatches = state.data.matches.items.filter((m) => isFavorite(m.id))

  return `
    ${renderTopbar()}
    <div class="view-scroll">
      <div class="section-head"><h2>עוד</h2></div>
      <div class="info-panel">
        <h3>הוספה לדף הבית</h3>
        <p class="panel-text">
          התקינו את גול360 כאיקון בטלפון — בלי חנות אפליקציות, ועם גישה במסך מלא.
        </p>
        <button class="btn-primary full" data-action="install">הוסף לדף הבית</button>
        <div class="ios-help ${state.showInstallHelp ? 'show' : ''}" id="install-help">
          <strong>אייפון (Safari):</strong> כפתור השיתוף ואז ״הוסף למסך הבית״.<br />
          <strong>אנדרואיד (Chrome):</strong> תפריט ⋮ ואז ״התקן אפליקציה״.
        </div>
      </div>

      <div class="info-panel">
        <h3>מאיפה הנתונים</h3>
        <p class="panel-text">
          תוצאות, הרכבים, טבלאות וחדשות נמשכים בזמן אמת מ-ESPN — API ציבורי וחינמי
          שלא דורש מפתח או הרשמה. שמות הקבוצות מתורגמים לעברית באפליקציה.
        </p>
        <div class="info-rows" style="margin-top:12px">
          <div class="info-row"><span>עדכון אחרון</span><span>${esc(updatedLabel())}</span></div>
          <div class="info-row"><span>רענון אוטומטי</span><span>כל 45 שניות</span></div>
          <div class="info-row"><span>ליגות</span><span dir="ltr">${LEAGUES.length}</span></div>
        </div>
      </div>

      <div class="section-head"><h2>מועדפים</h2></div>
      ${
        favMatches.length
          ? `<div class="match-list">${favMatches.map(matchRow).join('')}</div>`
          : `<div class="fav-empty"><p>עדיין אין מועדפים — סמנו כוכב במשחק</p></div>`
      }
    </div>
  `
}

function renderInstallBanner() {
  if (!state.showInstall) return ''
  return `
    <div class="install-banner show">
      <div>
        <strong>הוסיפו את גול360 לדף הבית</strong>
        <p>תוצאות חיות בלחיצה אחת, כמו אפליקציה</p>
      </div>
      <div class="install-actions">
        <button class="btn-primary" data-action="install">הוסף</button>
        <button class="btn-ghost" data-action="dismiss-install">לא עכשיו</button>
      </div>
    </div>
  `
}

function render() {
  const views = {
    matches: renderMatches,
    news: renderNews,
    table: renderTable,
    more: renderMore,
    match: renderMatchDetail,
    player: renderPlayer,
  }
  const hideNav = state.view === 'match' || state.view === 'player'
  const content = (views[state.view] || renderMatches)()

  document.getElementById('app').innerHTML = `
    <div class="app-shell ${state.showInstall ? 'with-install-banner' : ''} ${hideNav ? 'no-nav' : ''}">
      ${content}
      ${hideNav ? '' : renderNav()}
      ${renderInstallBanner()}
    </div>
  `
}

function describeError(err) {
  if (err?.name === 'AbortError') return 'הבקשה לקחה יותר מדי זמן'
  if (String(err?.message).includes('Failed to fetch')) return 'אין חיבור לאינטרנט'
  return err?.message || 'שגיאה לא ידועה'
}

async function loadMatches({ silent = false } = {}) {
  const slot = state.data.matches
  slot.loading = !silent
  slot.error = null
  state.refreshing = true
  if (!silent) render()

  try {
    const slugs = state.league === 'all' ? DEFAULT_LEAGUES : [state.league]
    const { matches, partial } = await fetchScoreboard(slugs)
    slot.items = matches
    slot.partial = partial
    state.lastUpdated = new Date()
  } catch (err) {
    slot.error = describeError(err)
  } finally {
    slot.loading = false
    state.refreshing = false
    render()
  }
}

async function loadDetail(leagueSlug, eventId) {
  const slot = state.data.detail
  slot.loading = true
  slot.error = null
  render()
  try {
    slot.item = await fetchMatchDetail(leagueSlug, eventId)
    // Prefer showing whichever side actually published a lineup.
    if (!slot.item.lineups.home && slot.item.lineups.away) state.lineupSide = 'away'
  } catch (err) {
    slot.error = describeError(err)
  } finally {
    slot.loading = false
    render()
  }
}

async function loadTable() {
  const slot = state.data.table
  slot.loading = true
  slot.error = null
  slot.item = null
  render()
  try {
    slot.item = await fetchStandings(state.tableLeague)
  } catch (err) {
    slot.error = describeError(err)
  } finally {
    slot.loading = false
    render()
  }
}

async function loadNews() {
  const slot = state.data.news
  slot.loading = true
  slot.error = null
  slot.items = []
  render()
  try {
    slot.items = await fetchNews(state.newsLeague)
  } catch (err) {
    slot.error = describeError(err)
  } finally {
    slot.loading = false
    render()
  }
}

async function loadPlayer(athleteId) {
  const slot = state.data.player
  slot.loading = true
  slot.error = null
  slot.item = null
  render()
  try {
    const league = state.selectedMatch?.leagueSlug || 'eng.1'
    slot.item = await fetchPlayer(league, athleteId)
  } catch (err) {
    slot.error = describeError(err)
  } finally {
    slot.loading = false
    render()
  }
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
    await state.deferredPrompt.userChoice
    state.deferredPrompt = null
    state.showInstall = false
    render()
    return
  }
  state.showInstallHelp = true
  state.showInstall = false
  state.view = 'more'
  render()
  document.getElementById('install-help')?.scrollIntoView({ block: 'center' })
}

function bindEvents() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-nav],[data-action],[data-open-match],[data-match-status],[data-league-filter],[data-news-league],[data-table-league],[data-match-tab],[data-lineup-side],[data-open-player]')
    if (!target) return

    const d = target.dataset

    if (d.nav) {
      state.view = d.nav
      render()
      if (d.nav === 'table' && !state.data.table.item) loadTable()
      if (d.nav === 'news' && !state.data.news.items.length) loadNews()
      return
    }
    if (d.openMatch) {
      state.selectedMatch = { id: d.openMatch, leagueSlug: d.league }
      state.view = 'match'
      state.matchTab = 'events'
      state.lineupSide = 'home'
      state.data.detail.item = null
      loadDetail(d.league, d.openMatch)
      return
    }
    if (d.openPlayer) {
      state.selectedPlayer = d.openPlayer
      state.view = 'player'
      loadPlayer(d.openPlayer)
      return
    }
    if (d.matchStatus) {
      state.matchStatus = d.matchStatus
      render()
      return
    }
    if (d.leagueFilter) {
      state.league = d.leagueFilter
      loadMatches()
      return
    }
    if (d.newsLeague) {
      state.newsLeague = d.newsLeague
      loadNews()
      return
    }
    if (d.tableLeague) {
      state.tableLeague = d.tableLeague
      loadTable()
      return
    }
    if (d.matchTab) {
      state.matchTab = d.matchTab
      render()
      return
    }
    if (d.lineupSide) {
      state.lineupSide = d.lineupSide
      render()
      return
    }

    switch (d.action) {
      case 'back':
        state.view = state.view === 'player' ? 'match' : 'matches'
        render()
        break
      case 'refresh':
        loadMatches()
        if (state.view === 'match' && state.selectedMatch) {
          loadDetail(state.selectedMatch.leagueSlug, state.selectedMatch.id)
        }
        break
      case 'reload-detail':
        if (state.selectedMatch) {
          loadDetail(state.selectedMatch.leagueSlug, state.selectedMatch.id)
        }
        break
      case 'reload-table':
        loadTable()
        break
      case 'reload-news':
        loadNews()
        break
      case 'fav':
        toggleFavorite(d.id)
        break
      case 'install':
        handleInstall()
        break
      case 'dismiss-install':
        state.showInstall = false
        localStorage.setItem('goal360-install-dismissed', '1')
        render()
        break
      default:
        break
    }
  })
}

function setupPwaInstall() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    state.deferredPrompt = event
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

  if (!isStandalone() && !localStorage.getItem('goal360-install-dismissed')) {
    setTimeout(() => {
      if (!state.deferredPrompt) {
        state.showInstall = true
        render()
      }
    }, 2500)
  }
}

function startAutoRefresh() {
  setInterval(() => {
    if (document.hidden) return
    if (state.view === 'matches' || state.view === 'more') {
      loadMatches({ silent: true })
    } else if (state.view === 'match' && state.selectedMatch) {
      const live = state.data.detail.item?.status === 'live'
      if (live) loadDetail(state.selectedMatch.leagueSlug, state.selectedMatch.id)
    }
  }, REFRESH_MS)

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) loadMatches({ silent: true })
  })
}

bindEvents()
setupPwaInstall()
startAutoRefresh()
render()
loadMatches()
