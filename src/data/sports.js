/** Demo sports data — Hebrew sports PWA */

export const leagues = [
  { id: 'il', name: 'ליגת העל', season: '2024/2025' },
  { id: 'ucl', name: 'ליגת האלופות', season: '2024/2025' },
  { id: 'epl', name: 'פרמייר ליג', season: '2024/2025' },
]

export const teams = {
  mta: { id: 'mta', name: 'מכבי ת״א', short: 'מכבי ת״א', color: '#1a3a8a' },
  hbs: { id: 'hbs', name: 'הפועל ב״ש', short: 'הפועל ב״ש', color: '#c8102e' },
  mha: { id: 'mha', name: 'מכבי חיפה', short: 'מכבי חיפה', color: '#006633' },
  hta: { id: 'hta', name: 'הפועל ת״א', short: 'הפועל ת״א', color: '#c8102e' },
  bar: { id: 'bar', name: 'ברצלונה', short: 'ברצלונה', color: '#a50044' },
  bvb: { id: 'bvb', name: 'דורטמונד', short: 'דורטמונד', color: '#fde100' },
  rma: { id: 'rma', name: 'ריאל מדריד', short: 'ריאל מדריד', color: '#ffffff' },
  ata: { id: 'ata', name: 'אטאלנטה', short: 'אטאלנטה', color: '#1e3a8a' },
  bel: { id: 'bel', name: 'בלגיה', short: 'בלגיה', color: '#000000' },
  isr: { id: 'isr', name: 'ישראל', short: 'ישראל', color: '#0038b8' },
  lee: { id: 'lee', name: 'לידס', short: 'לידס', color: '#ffcd00' },
  tot: { id: 'tot', name: 'טוטנהאם', short: 'טוטנהאם', color: '#132257' },
}

export const players = {
  solomon: {
    id: 'solomon',
    name: 'מנור סולומון',
    position: 'כנף שמאל',
    number: 14,
    age: 25,
    height: '1.70 מ׳',
    dob: '24/07/1999',
    nationality: 'ישראל',
    club: 'lee',
    nationalTeam: 'isr',
    rating: 7.0,
    apps: '15/19',
    goals: 3,
    assists: 3,
    careerApps: 41,
    careerGoals: 7,
    contract: 'עד 2028',
    photo:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop&q=80',
    history: [
      { from: 'טוטנהאם', to: 'לידס', date: '2024' },
      { from: 'שחטר', to: 'טוטנהאם', date: '2023' },
      { from: 'מכבי פ״ת', to: 'שחטר', date: '2019' },
    ],
  },
  peretz: {
    id: 'peretz',
    name: 'דניאל פרץ',
    position: 'שוער',
    number: 18,
    age: 24,
    height: '1.90 מ׳',
    dob: '10/07/2000',
    nationality: 'ישראל',
    club: 'mta',
    nationalTeam: 'isr',
    rating: 7.2,
    apps: '12/14',
    goals: 0,
    assists: 0,
    careerApps: 68,
    careerGoals: 0,
    contract: 'עד 2027',
    photo:
      'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=200&h=200&fit=crop&q=80',
    history: [
      { from: 'מכבי ת״א', to: 'באיירן', date: 'השאלה 2024' },
      { from: 'נוער מכבי ת״א', to: 'מכבי ת״א', date: '2021' },
    ],
  },
}

export const matches = [
  {
    id: 'm1',
    league: 'ucl',
    status: 'live',
    minute: "86'",
    home: 'bar',
    away: 'bvb',
    score: [3, 2],
    possession: { home: 58, away: 42 },
    events: [
      { minute: "85'", type: 'goal', team: 'home', player: 'פראן טורס' },
      { minute: "78'", type: 'goal', team: 'away', player: 'סרהו גיראסי' },
      { minute: "61'", type: 'goal', team: 'home', player: 'לוין ימאל' },
      { minute: "44'", type: 'goal', team: 'away', player: 'ברנדט' },
      { minute: "22'", type: 'goal', team: 'home', player: 'רוברט לוונדובסקי' },
    ],
    lineups: {
      home: {
        formation: '4-3-3',
        players: [
          { name: 'טר שטגן', num: 1, x: 50, y: 88, rating: 6.8 },
          { name: 'קונדה', num: 23, x: 18, y: 72, rating: 7.1 },
          { name: 'אראוחו', num: 4, x: 38, y: 74, rating: 7.0 },
          { name: 'קובארסי', num: 5, x: 62, y: 74, rating: 6.9 },
          { name: 'באלדה', num: 3, x: 82, y: 72, rating: 7.3 },
          { name: 'דה יונג', num: 21, x: 35, y: 52, rating: 7.4 },
          { name: 'פדרי', num: 8, x: 50, y: 48, rating: 8.1 },
          { name: 'גווי', num: 6, x: 65, y: 52, rating: 7.2 },
          { name: 'רפיניה', num: 11, x: 20, y: 28, rating: 7.6 },
          { name: 'לוונדובסקי', num: 9, x: 50, y: 22, rating: 8.0 },
          { name: 'ימאל', num: 19, x: 80, y: 28, rating: 8.4 },
        ],
      },
      away: {
        formation: '4-2-3-1',
        players: [
          { name: 'קובל', num: 1, x: 50, y: 88, rating: 6.5 },
          { name: 'ריירסון', num: 26, x: 18, y: 72, rating: 6.7 },
          { name: 'שוֹטֵן', num: 4, x: 38, y: 74, rating: 6.6 },
          { name: 'הומלס', num: 15, x: 62, y: 74, rating: 6.9 },
          { name: 'בנסימי', num: 5, x: 82, y: 72, rating: 6.8 },
          { name: 'ג׳נפו', num: 8, x: 38, y: 55, rating: 7.0 },
          { name: 'סהיטי', num: 20, x: 62, y: 55, rating: 6.9 },
          { name: 'אדמי', num: 27, x: 22, y: 38, rating: 7.1 },
          { name: 'ברנדט', num: 10, x: 50, y: 36, rating: 7.5 },
          { name: 'מאלן', num: 21, x: 78, y: 38, rating: 7.2 },
          { name: 'גיראסי', num: 9, x: 50, y: 20, rating: 7.8 },
        ],
      },
    },
  },
  {
    id: 'm2',
    league: 'ucl',
    status: 'finished',
    minute: 'סיום',
    home: 'ata',
    away: 'rma',
    score: [3, 2],
    possession: { home: 46, away: 54 },
    events: [
      { minute: "90'+2", type: 'goal', team: 'home', player: 'רטה' },
      { minute: "71'", type: 'goal', team: 'away', player: 'בלינגהאם' },
      { minute: "59'", type: 'goal', team: 'away', player: 'בלינגהאם' },
      { minute: "33'", type: 'goal', team: 'home', player: 'לוקומן' },
      { minute: "12'", type: 'goal', team: 'home', player: 'סקאמצ׳ה' },
    ],
    lineups: {
      home: {
        formation: '3-4-2-1',
        players: [
          { name: 'קארנסק', num: 29, x: 50, y: 88, rating: 7.2 },
          { name: 'ג׳ימסיטי', num: 19, x: 28, y: 72, rating: 7.0 },
          { name: 'הין', num: 4, x: 50, y: 74, rating: 7.1 },
          { name: 'קולה', num: 5, x: 72, y: 72, rating: 6.9 },
          { name: 'זאפאטה', num: 3, x: 15, y: 52, rating: 7.3 },
          { name: 'דה רון', num: 15, x: 38, y: 55, rating: 7.4 },
          { name: 'אדאם', num: 13, x: 62, y: 55, rating: 7.0 },
          { name: 'בלהנובה', num: 22, x: 85, y: 52, rating: 7.1 },
          { name: 'לוקומן', num: 11, x: 35, y: 32, rating: 8.2 },
          { name: 'סקאמצ׳ה', num: 10, x: 65, y: 32, rating: 8.0 },
          { name: 'רטה', num: 9, x: 50, y: 18, rating: 8.5 },
        ],
      },
      away: {
        formation: '4-3-1-2',
        players: [
          { name: 'לונין', num: 13, x: 50, y: 88, rating: 6.4 },
          { name: 'קרבחאל', num: 2, x: 18, y: 72, rating: 6.6 },
          { name: 'מיליטאו', num: 3, x: 38, y: 74, rating: 6.5 },
          { name: 'רודיגר', num: 22, x: 62, y: 74, rating: 6.8 },
          { name: 'מנדי', num: 23, x: 82, y: 72, rating: 6.7 },
          { name: 'ולברדה', num: 8, x: 30, y: 52, rating: 7.1 },
          { name: 'צ׳ומני', num: 14, x: 50, y: 55, rating: 6.9 },
          { name: 'קמאבינגה', num: 12, x: 70, y: 52, rating: 6.8 },
          { name: 'בלינגהאם', num: 5, x: 50, y: 36, rating: 8.6 },
          { name: 'ויניסיוס', num: 7, x: 35, y: 22, rating: 7.4 },
          { name: 'מבפה', num: 9, x: 65, y: 22, rating: 7.2 },
        ],
      },
    },
  },
  {
    id: 'm3',
    league: 'il',
    status: 'scheduled',
    minute: '21:00',
    home: 'mta',
    away: 'hbs',
    score: [null, null],
    kickoff: 'הערב',
    possession: null,
    events: [],
    lineups: null,
  },
  {
    id: 'm4',
    league: 'intl',
    status: 'live',
    minute: "67'",
    home: 'bel',
    away: 'isr',
    score: [0, 1],
    possession: { home: 61, away: 39 },
    events: [
      { minute: "34'", type: 'goal', team: 'away', player: 'ערן זהבי' },
      { minute: "52'", type: 'yellow', team: 'home', player: 'דה בראונה' },
    ],
    lineups: {
      home: {
        formation: '4-2-3-1',
        players: [
          { name: 'קורטואה', num: 1, x: 50, y: 88, rating: 6.5 },
          { name: 'קסטאניה', num: 21, x: 18, y: 72, rating: 6.4 },
          { name: 'אלדרטופטופ', num: 4, x: 38, y: 74, rating: 6.6 },
          { name: 'טיילמנס', num: 5, x: 62, y: 74, rating: 6.7 },
          { name: 'תילמנס', num: 3, x: 82, y: 72, rating: 6.5 },
          { name: 'אונאנה', num: 8, x: 38, y: 55, rating: 6.8 },
          { name: 'דה ברוין', num: 7, x: 62, y: 52, rating: 7.4 },
          { name: 'דֹקּוּ', num: 22, x: 22, y: 36, rating: 6.9 },
          { name: 'קארסקו', num: 10, x: 50, y: 34, rating: 7.0 },
          { name: 'טרוסאר', num: 11, x: 78, y: 36, rating: 6.8 },
          { name: 'לוקאקו', num: 9, x: 50, y: 18, rating: 6.7 },
        ],
      },
      away: {
        formation: '3-4-2-1',
        players: [
          { name: 'פרץ', num: 1, x: 50, y: 88, rating: 7.8 },
          { name: 'דבורסקי', num: 4, x: 28, y: 72, rating: 7.1 },
          { name: 'יחזקאל', num: 5, x: 50, y: 74, rating: 7.0 },
          { name: 'שלו', num: 3, x: 72, y: 72, rating: 7.2 },
          { name: 'דסה', num: 2, x: 15, y: 52, rating: 6.9 },
          { name: 'פרץ מ.', num: 6, x: 38, y: 55, rating: 7.0 },
          { name: 'גלוך', num: 10, x: 62, y: 52, rating: 7.5 },
          { name: 'אבוחצירא', num: 8, x: 85, y: 52, rating: 7.1 },
          { name: 'סולומון', num: 7, x: 35, y: 32, rating: 7.6 },
          { name: 'וייסמן', num: 11, x: 65, y: 32, rating: 7.3 },
          { name: 'זהבי', num: 9, x: 50, y: 18, rating: 8.2 },
        ],
      },
    },
  },
  {
    id: 'm5',
    league: 'il',
    status: 'finished',
    minute: 'סיום',
    home: 'mha',
    away: 'hta',
    score: [2, 1],
    possession: { home: 53, away: 47 },
    events: [
      { minute: "81'", type: 'goal', team: 'home', player: 'שרי' },
      { minute: "55'", type: 'goal', team: 'away', player: 'בראון' },
      { minute: "23'", type: 'goal', team: 'home', player: 'דוד' },
    ],
    lineups: null,
  },
]

export const standings = [
  { pos: 1, team: 'hbs', played: 28, gd: 32, pts: 64 },
  { pos: 2, team: 'mta', played: 28, gd: 28, pts: 61 },
  { pos: 3, team: 'mha', played: 28, gd: 18, pts: 54 },
  { pos: 4, team: 'hta', played: 28, gd: 6, pts: 44 },
  { pos: 5, team: 'lee', played: 28, gd: -2, pts: 38 },
  { pos: 6, team: 'tot', played: 28, gd: -8, pts: 33 },
]

export const news = [
  {
    id: 'n1',
    category: 'news',
    source: 'Walla Sports',
    time: 'לפני 4 שעות',
    title: "דניאל פרץ: 'החלום הוא להיות שוער ראשון בבאיירן מינכן'",
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=500&fit=crop&q=80',
    likes: 428,
  },
  {
    id: 'n2',
    category: 'transfers',
    source: 'ONE',
    time: 'לפני 6 שעות',
    title: 'סולומון חתם על הארכת חוזה בלידס — יישאר עד 2028',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop&q=80',
    likes: 312,
  },
  {
    id: 'n3',
    category: 'boom',
    source: 'Sport5',
    time: 'לפני שעתיים',
    title: 'מכבי ת״א בדרך לפלייאוף האלופות אחרי ניצחון דרמטי',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop&q=80',
    likes: 891,
  },
  {
    id: 'n4',
    category: 'highlights',
    source: 'Channel 12',
    time: 'לפני 8 שעות',
    title: 'הגול של השבוע: גלוך עם בעיטה אדירה מ־25 מטר',
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=500&fit=crop&q=80',
    likes: 1204,
  },
  {
    id: 'n5',
    category: 'news',
    source: 'Walla Sports',
    time: 'אתמול',
    title: 'הסכם משפטי בין השחקנים הושג — העונה נמשכת כמתוכנן',
    image:
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=500&fit=crop&q=80',
    likes: 156,
  },
]

export const newsTabs = [
  { id: 'all', label: 'הכל' },
  { id: 'news', label: 'חדשות' },
  { id: 'boom', label: 'BOOM!' },
  { id: 'highlights', label: 'היילייטס' },
  { id: 'transfers', label: 'העברות' },
]

export function teamCrest(teamId) {
  const t = teams[teamId]
  if (!t) return '?'
  return t.short.slice(0, 2)
}

export function teamName(teamId) {
  return teams[teamId]?.name ?? teamId
}
