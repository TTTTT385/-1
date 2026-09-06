/**
 * Hebrew localisation for data that arrives from ESPN in English.
 * Anything missing falls through to the original English string, so an
 * unmapped club still renders instead of showing a blank crest.
 */

const TEAMS = {
  // ליגת העל
  'Maccabi Tel-Aviv': 'מכבי תל אביב',
  'Maccabi Tel Aviv': 'מכבי תל אביב',
  'Hapoel Tel-Aviv': 'הפועל תל אביב',
  'Hapoel Tel Aviv': 'הפועל תל אביב',
  'Maccabi Haifa': 'מכבי חיפה',
  'Hapoel Haifa': 'הפועל חיפה',
  "Hapoel Be'er": 'הפועל באר שבע',
  "Hapoel Be'er Sheva": 'הפועל באר שבע',
  'Beitar Jerusalem': 'בית״ר ירושלים',
  'Hapoel Jerusalem': 'הפועל ירושלים',
  'Maccabi Netanya': 'מכבי נתניה',
  'Maccabi Petah-Tikva': 'מכבי פתח תקווה',
  'Hapoel Petah-Tikva': 'הפועל פתח תקווה',
  'Moadon Sport Ashdod': 'מ.ס. אשדוד',
  'Hapoel Kiryat Shmona': 'עירוני קרית שמונה',
  'Bnei Sakhnin': 'בני סכנין',
  'Hapoel Hadera': 'הפועל חדרה',
  'Maccabi Raina': 'מכבי בני ריינה',
  'Ironi Tiberias': 'עירוני טבריה',
  'Hapoel Ramat Gan': 'הפועל רמת גן',
  'Sektzia Nes Tziona': 'סקציה נס ציונה',
  'Ashdod': 'אשדוד',

  // ספרד
  'Barcelona': 'ברצלונה',
  'Real Madrid': 'ריאל מדריד',
  'Atletico Madrid': 'אתלטיקו מדריד',
  'Atlético Madrid': 'אתלטיקו מדריד',
  'Valencia': 'ולנסיה',
  'Sevilla': 'סביליה',
  'Real Betis': 'ריאל בטיס',
  'Villarreal': 'ויאריאל',
  'Athletic Club': 'אתלטיק בילבאו',
  'Real Sociedad': 'ריאל סוסיאדד',
  'Celta Vigo': 'סלטה ויגו',
  'Osasuna': 'אוססונה',
  'Alavés': 'אלאבס',
  'Alaves': 'אלאבס',
  'Getafe': 'חטאפה',
  'Rayo Vallecano': 'ראיו ואייקאנו',
  'Mallorca': 'מיורקה',
  'Espanyol': 'אספניול',
  'Girona': 'ג׳ירונה',
  'Levante': 'לבנטה',
  'Elche': 'אלצ׳ה',
  'Málaga': 'מלאגה',
  'Malaga': 'מלאגה',
  'Real Oviedo': 'ריאל אוביידו',

  // אנגליה
  'Manchester City': 'מנצ׳סטר סיטי',
  'Manchester United': 'מנצ׳סטר יונייטד',
  'Liverpool': 'ליברפול',
  'Arsenal': 'ארסנל',
  'Chelsea': 'צ׳לסי',
  'Tottenham Hotspur': 'טוטנהאם',
  'Tottenham': 'טוטנהאם',
  'Newcastle United': 'ניוקאסל',
  'Aston Villa': 'אסטון וילה',
  'West Ham United': 'ווסטהאם',
  'Everton': 'אוורטון',
  'Brighton & Hove Albion': 'ברייטון',
  'Brighton': 'ברייטון',
  'Brentford': 'ברנטפורד',
  'Crystal Palace': 'קריסטל פאלאס',
  'Fulham': 'פולהאם',
  'Wolverhampton Wanderers': 'וולבס',
  'Nottingham Forest': 'נוטינגהאם פורסט',
  'Bournemouth': 'בורנמות׳',
  'Leeds United': 'לידס יונייטד',
  'Leeds': 'לידס יונייטד',
  'Burnley': 'ברנלי',
  'Sunderland': 'סנדרלנד',
  'Leicester City': 'לסטר סיטי',
  'Southampton': 'סאות׳המפטון',
  'Ipswich Town': 'איפסוויץ׳',

  // איטליה
  'Juventus': 'יובנטוס',
  'AC Milan': 'מילאן',
  'Inter Milan': 'אינטר',
  'Internazionale': 'אינטר',
  'Napoli': 'נאפולי',
  'Roma': 'רומא',
  'AS Roma': 'רומא',
  'Lazio': 'לאציו',
  'Atalanta': 'אטאלנטה',
  'Fiorentina': 'פיורנטינה',
  'Bologna': 'בולוניה',
  'Torino': 'טורינו',
  'Udinese': 'אודינזה',
  'Genoa': 'ג׳נואה',
  'Cagliari': 'קליארי',
  'Sassuolo': 'סאסואולו',
  'Parma': 'פארמה',
  'Como': 'קומו',
  'Lecce': 'לצ׳ה',
  'Verona': 'ורונה',
  'Hellas Verona': 'ורונה',
  'Venezia': 'ונציה',
  'Frosinone': 'פרוזינונה',
  'Monza': 'מונזה',
  'Pisa': 'פיזה',
  'Cremonese': 'קרמונזה',

  // גרמניה
  'Bayern Munich': 'באיירן מינכן',
  'Borussia Dortmund': 'בורוסיה דורטמונד',
  'Bayer Leverkusen': 'באייר לוורקוזן',
  'RB Leipzig': 'לייפציג',
  'Eintracht Frankfurt': 'איינטרכט פרנקפורט',
  'VfB Stuttgart': 'שטוטגרט',
  'Borussia Mönchengladbach': 'בורוסיה מנשנגלדבאך',
  'SC Freiburg': 'פרייבורג',
  'Werder Bremen': 'ורדר ברמן',
  'FC Augsburg': 'אאוגסבורג',
  'Union Berlin': 'יוניון ברלין',
  'Mainz': 'מיינץ',
  'VfL Wolfsburg': 'וולפסבורג',
  'Hamburg SV': 'המבורג',
  'FC Koln': 'קלן',
  'FC Köln': 'קלן',
  'Hoffenheim': 'הופנהיים',
  'St. Pauli': 'סנט פאולי',
  'Heidenheim': 'היידנהיים',

  // צרפת ואחרות
  'Paris Saint-Germain': 'פ.ס.ז׳',
  'Marseille': 'מארסיי',
  'Lyon': 'ליון',
  'Monaco': 'מונאקו',
  'Lille': 'ליל',
  'Nice': 'ניס',
  'Rennes': 'רן',
  'Lens': 'לאנס',
  'Ajax': 'אייאקס',
  'PSV Eindhoven': 'פ.ס.ו. אינדהובן',
  'Feyenoord': 'פיינורד',
  'Benfica': 'בנפיקה',
  'FC Porto': 'פורטו',
  'Porto': 'פורטו',
  'Sporting CP': 'ספורטינג ליסבון',
  'Celtic': 'סלטיק',
  'Rangers': 'ריינג׳רס',
  'Club Brugge': 'קלוב ברוז׳',
  'Galatasaray': 'גלאטסראיי',
  'Fenerbahce': 'פנרבחצ׳ה',
  'Fenerbahçe': 'פנרבחצ׳ה',
  'Besiktas': 'בשיקטש',
  'Olympiacos': 'אולימפיאקוס',
  'AEK Athens': 'איי.אי.קיי אתונה',
  'Panathinaikos': 'פנאתינייקוס',
  'Red Bull Salzburg': 'זלצבורג',
  'LASK Linz': 'לאסק לינץ',
  'Shakhtar Donetsk': 'שחטאר דונייצק',
  'Dynamo Kyiv': 'דינמו קייב',
  'Slavia Prague': 'סלביה פראג',
  'Qarabag': 'קרבאח',
  'Bodo/Glimt': 'בודו/גלימט',
  'Copenhagen': 'קופנהגן',
  'Atalanta BC': 'אטאלנטה',

  // נבחרות
  'Israel': 'ישראל',
  'Belgium': 'בלגיה',
  'England': 'אנגליה',
  'Spain': 'ספרד',
  'France': 'צרפת',
  'Germany': 'גרמניה',
  'Italy': 'איטליה',
  'Portugal': 'פורטוגל',
  'Netherlands': 'הולנד',
  'Brazil': 'ברזיל',
  'Argentina': 'ארגנטינה',
  'Croatia': 'קרואטיה',
  'Denmark': 'דנמרק',
  'Poland': 'פולין',
  'Sweden': 'שוודיה',
  'Norway': 'נורווגיה',
  'Switzerland': 'שווייץ',
  'Austria': 'אוסטריה',
  'Türkiye': 'טורקיה',
  'Turkey': 'טורקיה',
  'Kosovo': 'קוסובו',
  'Czechia': 'צ׳כיה',
  'Bosnia-Herzegovina': 'בוסניה',
  'Romania': 'רומניה',
  'Serbia': 'סרביה',
  'Greece': 'יוון',
  'Ukraine': 'אוקראינה',
  'Scotland': 'סקוטלנד',
  'Wales': 'ויילס',
  'Republic of Ireland': 'אירלנד',
  'Estonia': 'אסטוניה',
  'Moldova': 'מולדובה',
  'Slovakia': 'סלובקיה',
  'Slovenia': 'סלובניה',
  'Hungary': 'הונגריה',
  'Albania': 'אלבניה',
  'North Macedonia': 'מקדוניה',
  'Georgia': 'גאורגיה',
  'Iceland': 'איסלנד',
  'Finland': 'פינלנד',
  'Latvia': 'לטביה',
  'Lithuania': 'ליטא',
  'Cyprus': 'קפריסין',
  'Bulgaria': 'בולגריה',
}

const STATUS = {
  'Scheduled': 'טרם התחיל',
  'Pre-Game': 'לפני המשחק',
  'First Half': 'מחצית ראשונה',
  'Second Half': 'מחצית שנייה',
  'Halftime': 'מחצית',
  'Full Time': 'סיום',
  'Final Score': 'סיום',
  'Final Score - After Penalties': 'סיום (פנדלים)',
  'Final Score - After Extra Time': 'סיום (הארכה)',
  'Extra Time - First Half': 'הארכה, מחצית ראשונה',
  'Extra Time - Second Half': 'הארכה, מחצית שנייה',
  'Extra Time - Halftime': 'הארכה, מחצית',
  'Penalty Shootout': 'פנדלים',
  'Postponed': 'נדחה',
  'Canceled': 'בוטל',
  'Cancelled': 'בוטל',
  'Abandoned': 'הופסק',
  'Delayed': 'מתעכב',
}

const EVENT_TYPES = {
  'Goal': 'שער',
  'Own Goal': 'שער עצמי',
  'Penalty - Scored': 'פנדל — שער',
  'Penalty - Missed': 'פנדל — החמצה',
  'Penalty - Saved': 'פנדל — הצלה',
  'Yellow Card': 'כרטיס צהוב',
  'Red Card': 'כרטיס אדום',
  'Second Yellow Card': 'צהוב שני',
  'Substitution': 'חילוף',
  'Kickoff': 'שריקת פתיחה',
  'End Regular Time': 'סיום 90 הדקות',
  'Start Delay': 'עיכוב',
  'End Delay': 'חזרה למשחק',
  'Penalty Shootout - Goal': 'פנדל — שער',
  'Penalty Shootout - Miss': 'פנדל — החמצה',
}

const POSITIONS = {
  G: 'שוער',
  D: 'מגן',
  CD: 'בלם',
  'CD-R': 'בלם',
  'CD-L': 'בלם',
  RB: 'מגן ימני',
  LB: 'מגן שמאלי',
  'RB-R': 'מגן ימני',
  'LB-L': 'מגן שמאלי',
  M: 'קשר',
  CM: 'קשר',
  DM: 'קשר הגנתי',
  'DM-R': 'קשר הגנתי',
  'DM-L': 'קשר הגנתי',
  RM: 'קשר ימני',
  LM: 'קשר שמאלי',
  AM: 'קשר התקפי',
  'AM-R': 'כנף ימין',
  'AM-L': 'כנף שמאל',
  RW: 'כנף ימין',
  LW: 'כנף שמאל',
  F: 'חלוץ',
  'F-R': 'חלוץ',
  'F-L': 'חלוץ',
  CF: 'חלוץ מרכזי',
  S: 'חלוץ',
  SUB: 'ספסל',
}

const STAT_LABELS = {
  possessionPct: 'שליטה בכדור',
  totalShots: 'בעיטות',
  shotsOnTarget: 'בעיטות למסגרת',
  foulsCommitted: 'עבירות',
  wonCorners: 'קרנות',
  offsides: 'נבדלים',
  saves: 'הצלות',
  yellowCards: 'כרטיסים צהובים',
  redCards: 'כרטיסים אדומים',
  accuratePasses: 'מסירות מדויקות',
  totalPasses: 'מסירות',
}

/** Strips ESPN's "FC"/"CF" noise so a club still matches the dictionary. */
function normalizeName(name) {
  return String(name || '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function heTeam(name) {
  const clean = normalizeName(name)
  if (TEAMS[clean]) return TEAMS[clean]
  const withoutPrefix = clean.replace(/^(FC|AC|AS|SC|VfB|VfL|SV|RB)\s+/i, '')
  if (TEAMS[withoutPrefix]) return TEAMS[withoutPrefix]
  const withoutSuffix = clean.replace(/\s+(FC|CF|SC|BC)$/i, '')
  return TEAMS[withoutSuffix] || clean
}

export function heStatus(description) {
  return STATUS[normalizeName(description)] || normalizeName(description)
}

export function heEventType(text) {
  return EVENT_TYPES[normalizeName(text)] || normalizeName(text)
}

export function hePosition(abbr) {
  return POSITIONS[normalizeName(abbr)] || normalizeName(abbr)
}

export function heStatLabel(name) {
  return STAT_LABELS[name] || name
}

export function isTranslatableStat(name) {
  return name in STAT_LABELS
}
