/**
 * ESPN's public site API — free, no key, and CORS-open, so the browser can
 * call it directly with no backend or secret of ours in the loop.
 */
import {
  heTeam,
  heStatus,
  heEventType,
  hePosition,
  heStatLabel,
  isTranslatableStat,
} from '../data/hebrew.js'

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer'
const BASE_V2 = 'https://site.api.espn.com/apis/v2/sports/soccer'

export const LEAGUES = [
  { slug: 'isr.1', name: 'ליגת העל', short: 'ליגת העל' },
  { slug: 'uefa.champions', name: 'ליגת האלופות', short: 'אלופות' },
  { slug: 'eng.1', name: 'פרמייר ליג', short: 'אנגליה' },
  { slug: 'esp.1', name: 'לה ליגה', short: 'ספרד' },
  { slug: 'ita.1', name: 'סרייה A', short: 'איטליה' },
  { slug: 'ger.1', name: 'בונדסליגה', short: 'גרמניה' },
  { slug: 'fra.1', name: 'ליג 1', short: 'צרפת' },
  { slug: 'uefa.europa', name: 'הליגה האירופית', short: 'אירופית' },
]

export function leagueName(slug) {
  return LEAGUES.find((l) => l.slug === slug)?.name || slug
}

const CACHE_TTL = {
  scoreboard: 30_000,
  summary: 30_000,
  standings: 10 * 60_000,
  news: 10 * 60_000,
}

const cache = new Map()

async function getJson(url, ttl) {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < ttl) return hit.data

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`ESPN ${res.status}`)
    const data = await res.json()
    cache.set(url, { at: Date.now(), data })
    return data
  } finally {
    clearTimeout(timeout)
  }
}

const LIVE_STATES = new Set(['in'])
const DONE_STATES = new Set(['post'])

function normalizeStatus(status) {
  const state = status?.type?.state
  if (LIVE_STATES.has(state)) return 'live'
  if (DONE_STATES.has(state)) return 'finished'
  return 'scheduled'
}

function kickoffLabel(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const time = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  if (sameDay) return time
  return `${date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })} ${time}`
}

function normalizeTeam(competitor) {
  const team = competitor?.team || {}
  return {
    id: team.id,
    name: heTeam(team.displayName || team.name),
    englishName: team.displayName || team.name || '',
    abbr: team.abbreviation || '',
    logo: team.logo || team.logos?.[0]?.href || '',
    color: team.color ? `#${team.color}` : '#2a3242',
    score: competitor?.score === undefined ? null : Number(competitor.score),
  }
}

/** ESPN reports the minute in `displayClock`; scheduled games get a kickoff time. */
function minuteLabel(status, iso) {
  const state = normalizeStatus(status)
  if (state === 'scheduled') return kickoffLabel(iso)
  if (state === 'finished') return 'סיום'
  const clock = status?.displayClock
  if (clock && clock !== '0\'') return clock
  return heStatus(status?.type?.description)
}

function normalizeEvent(event, leagueSlug) {
  const competition = event.competitions?.[0] || {}
  const competitors = competition.competitors || []
  const home = competitors.find((c) => c.homeAway === 'home') || competitors[0]
  const away = competitors.find((c) => c.homeAway === 'away') || competitors[1]

  return {
    id: event.id,
    leagueSlug,
    leagueName: leagueName(leagueSlug),
    status: normalizeStatus(competition.status || event.status),
    statusText: heStatus((competition.status || event.status)?.type?.description),
    minute: minuteLabel(competition.status || event.status, event.date),
    date: event.date,
    venue: competition.venue?.fullName || '',
    home: normalizeTeam(home),
    away: normalizeTeam(away),
  }
}

export async function fetchScoreboard(slugs) {
  const wanted = Array.isArray(slugs) ? slugs : [slugs]
  const results = await Promise.allSettled(
    wanted.map(async (slug) => {
      const data = await getJson(`${BASE}/${slug}/scoreboard`, CACHE_TTL.scoreboard)
      return (data.events || []).map((e) => normalizeEvent(e, slug))
    }),
  )

  const matches = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
  const failed = results.filter((r) => r.status === 'rejected').length

  const order = { live: 0, scheduled: 1, finished: 2 }
  matches.sort((a, b) => {
    const byStatus = order[a.status] - order[b.status]
    if (byStatus !== 0) return byStatus
    return new Date(a.date) - new Date(b.date)
  })

  if (!matches.length && failed === wanted.length) {
    throw new Error('כל הבקשות ל-ESPN נכשלו')
  }

  return { matches, partial: failed > 0 && failed < wanted.length }
}

/**
 * ESPN gives each starter a position abbreviation rather than coordinates,
 * so map those onto pitch percentages. `right` is used for x because the
 * pitch is laid out inside an RTL document.
 */
const PITCH_COORDS = {
  G: [50, 90],
  RB: [16, 72],
  'RB-R': [16, 72],
  LB: [84, 72],
  'LB-L': [84, 72],
  'CD-R': [37, 76],
  'CD-L': [63, 76],
  CD: [50, 76],
  D: [50, 76],
  'D-R': [30, 76],
  'D-L': [70, 76],
  DM: [50, 60],
  'DM-R': [37, 60],
  'DM-L': [63, 60],
  CM: [50, 52],
  M: [50, 52],
  'M-R': [33, 52],
  'M-L': [67, 52],
  RM: [24, 52],
  LM: [76, 52],
  AM: [50, 36],
  'AM-R': [22, 38],
  'AM-L': [78, 38],
  RW: [20, 27],
  LW: [80, 27],
  'F-R': [36, 20],
  'F-L': [64, 20],
  F: [50, 20],
  CF: [50, 20],
  S: [50, 20],
}

function coordsFor(abbr, index) {
  const hit = PITCH_COORDS[abbr]
  if (hit) return hit
  // Unknown code: spread remaining players across midfield rather than stacking.
  return [20 + ((index * 23) % 70), 46]
}

/** Nudges players that resolved to the same slot so labels stay readable. */
function deOverlap(players) {
  const seen = new Map()
  return players.map((p) => {
    const key = `${p.x}-${p.y}`
    const count = seen.get(key) || 0
    seen.set(key, count + 1)
    if (count === 0) return p
    const shift = count % 2 === 1 ? 11 * Math.ceil(count / 2) : -11 * (count / 2)
    return { ...p, x: Math.min(92, Math.max(8, p.x + shift)) }
  })
}

function normalizeRoster(rosterEntry) {
  const all = rosterEntry?.roster || []
  const starters = all.filter((p) => p.starter)

  const players = deOverlap(
    starters.map((p, i) => {
      const abbr = p.position?.abbreviation || ''
      const [x, y] = coordsFor(abbr, i)
      const athlete = p.athlete || {}
      const rating = Number(
        p.stats?.find((s) => s.name === 'rating' || s.name === 'ESPNRating')?.value,
      )
      return {
        id: athlete.id,
        name: athlete.shortName || athlete.displayName || '—',
        fullName: athlete.displayName || '',
        num: p.jersey || '',
        position: hePosition(abbr),
        x,
        y,
        rating: Number.isFinite(rating) && rating > 0 ? rating : null,
      }
    }),
  )

  const bench = all
    .filter((p) => !p.starter)
    .map((p) => ({
      id: p.athlete?.id,
      name: p.athlete?.displayName || '—',
      num: p.jersey || '',
      position: hePosition(p.position?.abbreviation || 'SUB'),
    }))

  return {
    teamId: rosterEntry?.team?.id,
    teamName: heTeam(rosterEntry?.team?.displayName),
    formation: rosterEntry?.formation || '',
    players,
    bench,
  }
}

/** ESPN leaves `athletesInvolved` empty on soccer feeds, so read the sentence. */
function playerFromEventText(text) {
  if (!text) return ''
  const goal = text.match(/\.\s*([^.]+?)\s+\([^)]+\)\s+(?:left|right|header|converts|scores)/i)
  if (goal) return goal[1].trim()
  const card = text.match(/^([^(]+?)\s+\([^)]+\)\s+is shown/i)
  if (card) return card[1].trim()
  const sub = text.match(/\.\s*([^.]+?)\s+replaces\s+([^.]+)\./i)
  if (sub) return `${sub[1].trim()} ← ${sub[2].trim()}`
  return ''
}

const NOISE_EVENTS = new Set(['Start Delay', 'End Delay'])

function normalizeKeyEvents(keyEvents, homeId) {
  return (keyEvents || [])
    .filter((e) => e.type?.text && !NOISE_EVENTS.has(e.type.text))
    .map((e) => ({
      minute: e.clock?.displayValue || '',
      typeText: heEventType(e.type?.text),
      isGoal: /goal/i.test(e.type?.text || '') && !/miss|saved/i.test(e.type?.text || ''),
      isCard: /card/i.test(e.type?.text || ''),
      isSub: /substitution/i.test(e.type?.text || ''),
      side: e.team?.id ? (String(e.team.id) === String(homeId) ? 'home' : 'away') : null,
      player: playerFromEventText(e.text),
      text: e.text || '',
    }))
    .reverse()
}

function normalizeBoxscore(boxscore, homeId) {
  const teams = boxscore?.teams || []
  const pick = (side) =>
    teams.find((t) =>
      side === 'home'
        ? String(t.team?.id) === String(homeId)
        : String(t.team?.id) !== String(homeId),
    )

  const homeTeam = pick('home')
  const awayTeam = pick('away')
  if (!homeTeam || !awayTeam) return []

  const homeStats = new Map(
    (homeTeam.statistics || []).map((s) => [s.name, s.displayValue]),
  )
  const awayStats = new Map(
    (awayTeam.statistics || []).map((s) => [s.name, s.displayValue]),
  )

  return [...homeStats.keys()]
    .filter(isTranslatableStat)
    .map((name) => ({
      label: heStatLabel(name),
      home: homeStats.get(name) ?? '—',
      away: awayStats.get(name) ?? '—',
    }))
}

export async function fetchMatchDetail(leagueSlug, eventId) {
  const data = await getJson(
    `${BASE}/${leagueSlug}/summary?event=${eventId}`,
    CACHE_TTL.summary,
  )

  const competition = data.header?.competitions?.[0] || {}
  const competitors = competition.competitors || []
  const home = competitors.find((c) => c.homeAway === 'home') || competitors[0]
  const away = competitors.find((c) => c.homeAway === 'away') || competitors[1]
  const homeId = home?.id

  const rosters = (data.rosters || []).map(normalizeRoster)
  const homeRoster = rosters.find((r) => String(r.teamId) === String(homeId)) || rosters[0]
  const awayRoster = rosters.find((r) => String(r.teamId) !== String(homeId)) || rosters[1]

  return {
    id: eventId,
    leagueSlug,
    leagueName: leagueName(leagueSlug),
    status: normalizeStatus(competition.status),
    statusText: heStatus(competition.status?.type?.description),
    minute: minuteLabel(competition.status, competition.date),
    venue: data.gameInfo?.venue?.fullName || '',
    attendance: data.gameInfo?.attendance || null,
    home: {
      ...normalizeTeam(home),
      name: heTeam(home?.team?.displayName || home?.team?.name),
    },
    away: {
      ...normalizeTeam(away),
      name: heTeam(away?.team?.displayName || away?.team?.name),
    },
    lineups: {
      home: homeRoster?.players?.length ? homeRoster : null,
      away: awayRoster?.players?.length ? awayRoster : null,
    },
    events: normalizeKeyEvents(data.keyEvents, homeId),
    stats: normalizeBoxscore(data.boxscore, homeId),
  }
}

export async function fetchStandings(leagueSlug) {
  const data = await getJson(`${BASE_V2}/${leagueSlug}/standings`, CACHE_TTL.standings)

  const groups = (data.children || []).map((child) => {
    const entries = (child.standings?.entries || []).map((entry) => {
      const stats = new Map((entry.stats || []).map((s) => [s.name, s.displayValue]))
      return {
        rank: Number(stats.get('rank')) || 0,
        team: {
          id: entry.team?.id,
          name: heTeam(entry.team?.displayName),
          logo: entry.team?.logos?.[0]?.href || '',
          color: entry.team?.color ? `#${entry.team.color}` : '#2a3242',
          abbr: entry.team?.abbreviation || '',
        },
        played: stats.get('gamesPlayed') ?? '—',
        goalDiff: stats.get('pointDifferential') ?? '—',
        points: stats.get('points') ?? '—',
      }
    })
    entries.sort((a, b) => a.rank - b.rank)
    return { name: hebrewGroupName(child.name), entries }
  })

  return {
    leagueName: leagueName(leagueSlug),
    season: data.season?.displayName || '',
    groups: groups.filter((g) => g.entries.length),
  }
}

function hebrewGroupName(name) {
  const map = {
    'Group Championship': 'פלייאוף עליון',
    'Group Relegation': 'פלייאוף תחתון',
    'Overall': 'טבלה כללית',
    'League Phase': 'שלב הליגה',
  }
  if (map[name]) return map[name]
  const groupLetter = /^Group\s+(\w)$/.exec(name || '')
  if (groupLetter) return `בית ${groupLetter[1]}`
  return name || ''
}

export async function fetchNews(leagueSlug) {
  const data = await getJson(`${BASE}/${leagueSlug}/news`, CACHE_TTL.news)

  return (data.articles || [])
    .filter((a) => a.headline)
    .map((a) => ({
      id: a.id || a.headline,
      title: a.headline,
      description: a.description || '',
      image: a.images?.[0]?.url || '',
      published: a.published,
      publishedLabel: relativeTime(a.published),
      link:
        a.links?.web?.href ||
        a.links?.mobile?.href ||
        a.links?.api?.news?.href ||
        '',
    }))
}

const PLAYER_STATS = [
  ['appearances', 'הופעות'],
  ['totalGoals', 'שערים'],
  ['goalAssists', 'בישולים'],
  ['totalShots', 'בעיטות'],
  ['shotsOnTarget', 'למסגרת'],
  ['saves', 'הצלות'],
  ['foulsCommitted', 'עבירות'],
  ['yellowCards', 'צהובים'],
  ['redCards', 'אדומים'],
  ['subIns', 'נכנס מהספסל'],
]

export async function fetchPlayer(leagueSlug, athleteId) {
  const data = await getJson(
    `https://site.web.api.espn.com/apis/common/v3/sports/soccer/${leagueSlug}/athletes/${athleteId}`,
    CACHE_TTL.standings,
  )
  const a = data.athlete || {}

  const seasonStats = (data.statsSummary?.statistics || [])
    .map((s) => ({ label: heStatLabel(s.name) || s.displayName, value: s.displayValue }))
    .filter((s) => s.value != null)

  return {
    id: athleteId,
    name: a.displayName || a.fullName || '',
    firstName: a.firstName || '',
    headshot: a.headshot?.href || '',
    jersey: a.jersey || '',
    age: a.age || null,
    height: a.displayHeight || '',
    weight: a.displayWeight || '',
    citizenship: heTeam(a.citizenship) || a.citizenship || '',
    positionName: a.position?.displayName || '',
    teamName: heTeam(data.team?.displayName) || '',
    teamLogo: data.team?.logos?.[0]?.href || '',
    seasonStats,
  }
}

/** Season totals for a player, taken from the match roster feed. */
export function playerStatsFromRoster(rosterPlayerStats) {
  return PLAYER_STATS.map(([name, label]) => {
    const stat = (rosterPlayerStats || []).find((s) => s.name === name)
    return stat ? { label, value: stat.displayValue } : null
  }).filter(Boolean)
}

function relativeTime(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) return 'עכשיו'
  const minutes = Math.round(diff / 60_000)
  if (minutes < 60) return `לפני ${minutes} דק׳`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `לפני ${hours} שעות`
  const days = Math.round(hours / 24)
  if (days === 1) return 'אתמול'
  if (days < 30) return `לפני ${days} ימים`
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })
}
