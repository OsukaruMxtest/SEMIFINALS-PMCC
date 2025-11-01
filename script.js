const MAP_NAMES = {1: "Erangel", 2: "Miramar", 3: "Sanhok", 4: "Rondo"};

const DAY_FILES = {
  day1: [ 
    "data/day1/M1.csv","data/day1/M2.csv","data/day1/M3.csv","data/day1/M4.csv",
    "data/day1/M5.csv","data/day1/M6.csv","data/day1/M7.csv","data/day1/M8.csv"
  ],
  day2: [ 
    "data/day2/M1.csv","data/day2/M2.csv","data/day2/M3.csv","data/day2/M4.csv",
    "data/day2/M5.csv","data/day2/M6.csv","data/day2/M7.csv","data/day2/M8.csv"
  ]
};

const QUALIFIED_TEAM_IDS = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

const TEAM_NAMES = {
  semifinales: {
    lobby1: {
      10: "SOUTHEASTERN LOUISIANA",
      7: "ALGOMA",
      16: "ITSV",
      4: "PORTAGE",
      3: "COQUITLAM",
      18: "UNAM",
      12: "ST. CLAIR",
      17: "SENECA (B)",
      15: "CINCINNATI",
      13: "CONESTOGA",
      9: "MIDDLESEX COUNTY",
      5: "BAUP (A)",
      8: "BAUP (B)",
      14: "ALABAMA",
      6: "SENECA (A)",
      11: "CANADA WEST"
    },
    lobby2: {
      10: "NIAGARA",
      15: "ALABAMA",
      14: "MIDDLESEX COUNTY",
      9: "ARKANSAS STATE",
      16: "RED RIVER",
      8: "VICTORIA",
      3: "SENECA",
      6: "ST. CLAIR",
      5: "OLD COLLEGE A&T",
      12: "ST. CLAIR",
      13: "ALGOMA",
      17: "NORTHERN ARIZONA",
      11: "KENT STATE",
      18: "ELMHURST",
      7: "VANCOUVER CC",
      4: "CANADA WEST"
    }
  },
  finales: {
    1: "ITSV",
    2: "Southeastern Louisiana",
    3: "Middlesex County",
    4: "Seneca (B)",
    5: "Seneca (A)",
    6: "Portage",
    7: "Alabama",
    8: "Coquitlam",
    9: "Canada West",
    10: "Kent State",
    11: "Arkansas State",
    12: "Middlesex County",
    13: "Red River",
    14: "Algoma",
    15: "Seneca (C)",
    16: "Vancouver CC"
  }
};

function getTeamName(fase, lobby, teamId) {
  const id = Number(teamId);
  if (fase === 'semifinales') {
    const lobbyKey = `lobby${lobby}`;
    if (TEAM_NAMES.semifinales[lobbyKey] && TEAM_NAMES.semifinales[lobbyKey][id] !== undefined) {
      return TEAM_NAMES.semifinales[lobbyKey][id];
    }
  } else if (fase === 'finales') {
    if (TEAM_NAMES.finales[id] !== undefined) {
      return TEAM_NAMES.finales[id];
    }
  }
  return `Team ${id}`;
}

const POSITION_POINTS = {
  1: 10,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 2,
  8: 1
  // >8 -> 0
};

let globalData = {
  matches: [], 
  teams: {},   
  players: {}  
};
let uidToName = {};
let currentLang = localStorage.getItem('lang') || 'es';
let selectedDay = 'day1'; 
let currentTeamDetailId = null; 

const translations = {
  es: {
    title: "PMCC FALL 2025 — SEMIFINALES / FINALES",
    day1: "Semifinales",
    day2: "Finales",
    teams: "Equipos",
    players: "Jugadores",
    maps: "Por Mapa",
    highlights: "Destacados",
    teamSummary: "Resumen de Equipos",
    pos: "Pos",
    team: "Equipo",
    eliminations: "Elim",
    damage: "Daño",
    wwwcd: "WWWCD",
    positionPoints: "PP",
    total: "Total",
    topPlayers: "Jugadores",
    player: "Jugador",
    headshotPct: "Headshot %",
    longestElim: "Elim. más lejana",
    statsByMap: "Estadísticas por Mapa (Finales acumuladas M1+M5, M2+M6...)",
    selectMap: "Selecciona un mapa para ver estadísticas detalladas.",
    dayHighlights: "Destacados por Mapa (Finales)",
    backToTeams: "← Volver a Equipos",
    teamDetails: "Detalles del Equipo",
    mvt: "MVT",
    mvp: "MVP",
    longestKill: "Baja más lejana",
    grenadeKills: "Elim. con granada",
    assists: "Asistencias",
    knocks: "Noqueos",
    noData: "No hay datos suficientes.",
    noMapData: map => `No hay datos para ${map}.`,
    teamStatsByMatch: "Estadísticas por Partida",
    match: idx => `Partida ${idx}`,
    playerName: "Jugador",
    kills: "Bajas",
    maxDist: "Máx. Dist.",
    assistsAbbr: "Asist.",
    knocksAbbr: "Noqueos",
    hs: "HS",
    damageTaken: "Daño Recibido",
    healing: "Curación",
    oob: "Fuera Círculo",
    grenades: "Granadas",
    driven: "Dist. Conducida",
    walked: "Dist. Recorrida",
    revives: "Rescates",
    topTeamsInMap: map => `Mejores Equipos en ${map}`,
    topPlayersInMap: map => `Mejores Jugadores en ${map}`,
    noMatchesForTeam: "No se encontraron partidas para este equipo.",
    playersAccumulated: "Acumulado (Semifinales + Finales)",
    playersFinals: "Finales (solo)",
    playersSemifinals: "Semifinales (solo)",
    accumulated: "Acumulado",
    finalsOnly: "Solo Finales",
    statsByMapDay1: "Estadísticas por Mapa (Semifinales)",
    statsByMapDay2: "Estadísticas por Mapa (Finales)",
    highlightsDay1: "Destacados por Mapa (Semifinales)",
    highlightsDay2: "Destacados por Mapa (Finales)",
    teamPlayerStats: "Estadísticas Totales por Jugador",
    totalStats: "Estadísticas Totales",
    matchesPlayed: "Partidas Jugadas",
    totalKills: "Total Bajas",
    totalDamage: "Daño Total",
    totalHeadshots: "Total Headshots",
    avgKills: "Prom. Bajas por Partida",
    avgDamage: "Prom. Daño por Partida",
    playerStats: "Estadísticas de Jugadores"
  },
  en: {
    title: "PMCC FALL 2025 — SEMIFINALS / FINALS",
    day1: "Semifinals",
    day2: "Finals",
    teams: "Teams",
    players: "Players",
    maps: "By Map",
    highlights: "Highlights",
    teamSummary: "Team Summary",
    pos: "Pos",
    team: "Team",
    eliminations: "Elim",
    damage: "Damage",
    wwwcd: "WWWCD",
    positionPoints: "PP",
    total: "Total",
    topPlayers: "Players",
    player: "Player",
    headshotPct: "Headshot %",
    longestElim: "Longest Elimination",
    statsByMap: "Stats by Map (Finals accumulated M1+M5, M2+M6...)",
    selectMap: "Select a map to view detailed stats.",
    dayHighlights: "Highlights by Map (Finals)",
    backToTeams: "← Back to Teams",
    teamDetails: "Team Details",
    mvt: "MVT",
    mvp: "MVP",
    longestKill: "Longest Kill",
    grenadeKills: "Grenade Kills",
    assists: "Assists",
    knocks: "Knocks",
    noData: "Not enough data.",
    noMapData: map => `No data for ${map}.`,
    teamStatsByMatch: "Match Stats",
    match: idx => `Match ${idx}`,
    playerName: "Player",
    kills: "Kills",
    maxDist: "Max Dist.",
    assistsAbbr: "Assists",
    knocksAbbr: "Knocks",
    hs: "HS",
    damageTaken: "Damage Taken",
    healing: "Healing",
    oob: "OOB Time",
    grenades: "Grenades",
    driven: "Driven",
    walked: "Walked",
    revives: "Revives",
    topTeamsInMap: map => `Top Teams in ${map}`,
    topPlayersInMap: map => `Top Players in ${map}`,
    noMatchesForTeam: "No matches found for this team.",
    playersAccumulated: "Accumulated (Semifinals + Finals)",
    playersFinals: "Finals (only)",
    playersSemifinals: "Semifinals (only)",
    accumulated: "Accumulated",
    finalsOnly: "Finals Only",
    statsByMapDay1: "Stats by Map (Semifinals)",
    statsByMapDay2: "Stats by Map (Finals)",
    highlightsDay1: "Highlights by Map (Semifinals)",
    highlightsDay2: "Highlights by Map (Finals)",
    teamPlayerStats: "Total Player Statistics",
    totalStats: "Total Statistics",
    matchesPlayed: "Matches Played",
    totalKills: "Total Kills",
    totalDamage: "Total Damage",
    totalHeadshots: "Total Headshots",
    avgKills: "Kills per Match",
    avgDamage: "Damage per Match",
    playerStats: "Player Statistics"
  }
};

function t(key, ...args) {
  let str = translations[currentLang][key] || key;
  if (typeof str === 'function') str = str(...args);
  return str;
}

function setLanguage(lang) {
  if (!['es', 'en'].includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);

  document.querySelector('h1').textContent = t('title');
  document.querySelector('.day-selector .btn[data-day="day1"]').textContent = t('day1');
  document.querySelector('.day-selector .btn[data-day="day2"]').textContent = t('day2');

  document.querySelector('.tab[data-tab="teams"]').textContent = t('teams');
  document.querySelector('.tab[data-tab="players"]').textContent = t('players');
  document.querySelector('.tab[data-tab="maps"]').textContent = t('maps');
  document.querySelector('.tab[data-tab="highlights"]').textContent = t('highlights');

  document.getElementById('back-to-teams').textContent = t('backToTeams');

  const accCaption = document.querySelector('#players-acc-table caption');
  const finalsCaption = document.querySelector('#players-finals-table caption');
  if (accCaption) {
    accCaption.textContent = selectedDay === 'day1' ? t('playersSemifinals') : t('playersAccumulated');
  }
  if (finalsCaption) {
    finalsCaption.textContent = t('playersFinals');
  }

  const activeTab = document.querySelector('.tab.active')?.dataset.tab;
  if (activeTab) updateTabContent(activeTab);

  document.getElementById('lang-es').classList.toggle('active', lang === 'es');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');

  if (currentTeamDetailId && document.getElementById("team-detail")?.classList.contains("active")) {
    const team = globalData.teams[currentTeamDetailId];
    if (currentTeamDetailId && document.getElementById("team-detail")?.classList.contains("active")) {
  renderTeamDetail(currentTeamDetailId);
}
  }
}

function updateTabContent(tabId) {
  switch (tabId) {
    case 'teams':
      document.querySelector('#teams h2').textContent = t('teamSummary');
      const teamHeaders = document.querySelectorAll('#teams thead th');
      teamHeaders[0].textContent = t('pos');
      teamHeaders[1].textContent = t('team');
      teamHeaders[2].textContent = t('eliminations');
      teamHeaders[3].textContent = t('positionPoints');
      teamHeaders[4].textContent = t('total');
      teamHeaders[5].textContent = t('wwwcd');
      renderTeams();
      break;
    case 'players':
      document.querySelector('#players h2').textContent = t('topPlayers');
      const playerHeaders = document.querySelectorAll('#players-acc-table thead th, #players-finals-table thead th');
      playerHeaders[0].textContent = t('player');
      playerHeaders[1].textContent = t('team');
      playerHeaders[2].textContent = t('eliminations');
      playerHeaders[3].textContent = t('damage');
      playerHeaders[4].textContent = t('headshotPct');
      playerHeaders[5].textContent = t('longestElim');
      renderPlayers();
      break;
    case 'maps':
      document.querySelector('#maps h2').textContent = selectedDay === 'day1' ? t('statsByMapDay1') : t('statsByMapDay2');
      document.getElementById('map-stats').innerHTML = `<p>${t('selectMap')}</p>`;
      break;
    case 'highlights':
      document.querySelector('#highlights h2').textContent = selectedDay === 'day1' ? t('highlightsDay1') : t('highlightsDay2');
      renderHighlights();
      break;
  }
}

function parseTime(timeStr) {
  if (!timeStr || timeStr === "0m 0s" || timeStr === "") return 0;
  const clean = timeStr.replace(/\s+/g, " ").trim();
  const parts = clean.split("m");
  const mins = parseInt(parts[0]) || 0;
  const secs = parts[1] ? parseInt(parts[1].replace(/\D/g, "")) || 0 : 0;
  return mins * 60 + secs;
}

function secondsToTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function getLobbyAndMapInfo(filename) {
  const match = filename.match(/M(\d)/i);
  if (!match) return { lobby: 1, map: "Unknown", matchNum: 0 };
  const num = parseInt(match[1]);
  const lobby = num <= 4 ? 1 : 2;
  const mapNum = num <= 4 ? num : num - 4;
  return { lobby, map: MAP_NAMES[mapNum] || `Map ${mapNum}`, matchNum: num };
}

function isQualifiedTeamId(teamId) {
  return QUALIFIED_TEAM_IDS.includes(Number(teamId));
}

function compId(lobby, teamId) { 
  return `${lobby}-${teamId}`; 
}

async function loadUidNameMap() {
  try {
    const response = await fetch("uid-name.csv");
    if (!response.ok) { 
      console.warn("uid-name.csv not found"); 
      return; 
    }
    const csvText = await response.text();
    const Papa = window.Papa;
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    uidToName = {};
    for (const row of result.data) {
      let uidRaw = (row.UID || "").toString().trim();
      if (uidRaw.includes(".")) uidRaw = uidRaw.split(".")[0];
      const nameClean = (row.Name || "").toString().trim();
      if (uidRaw && nameClean) uidToName[uidRaw] = nameClean;
    }
    console.log("uidToName loaded:", Object.keys(uidToName).length);
  } catch (err) {
    console.error("Error loading uid-name.csv", err);
  }
}

async function loadDay(day = 'day1') {
  selectedDay = day;
  globalData = { matches: [], teams: {}, players: {} };
  const Papa = window.Papa;
  const files = DAY_FILES[day] || [];
  
  for (const file of files) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        console.warn("File not found:", file);
        continue;
      }
      const csvText = await response.text();
      const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      if (!result.data?.length) { 
        console.warn("Empty file:", file); 
        continue; 
      }

      const { lobby, map, matchNum } = getLobbyAndMapInfo(file);
      const match = { day, matchNum, lobby, map, teams: {}, players: [], rows: result.data };
      globalData.matches.push(match);

      for (const row of result.data) {
        const safeNum = (val) => (val === "" || val == null || isNaN(val)) ? 0 : Number(val);
        const numFields = [
          "TeamID", "Rango", "uId", "Salud", "Número de Bajas", "Daño",
          "Máxima Distancia de Baja", "Asistencias", "Noqueos", "Número de Headshots",
          "Daño Recibido", "Curación", "Tiempo Fuera del Círculo Azul",
          "Bajas con Granada", "Rescates", "Distancia Conducida", "Distancia Recorrida"
        ];
        for (const field of numFields) row[field] = safeNum(row[field]);

        const teamIdRaw = row["TeamID"];
        const compTeamId = compId(match.lobby, teamIdRaw);
        const uidFromMatch = (row["uId"] || "").toString().trim();
        const compPlayerId = compId(match.lobby, uidFromMatch);
        
        const fase = day === 'day1' ? 'semifinales' : 'finales';
        const teamName = getTeamName(fase, match.lobby, teamIdRaw);

        if (!match.teams[compTeamId]) {
          match.teams[compTeamId] = {
            name: teamName,
            rank: row["Rango"],
            kills: 0,
            damage: 0,
            players: []
          };
        }
        const team = match.teams[compTeamId];
        team.kills += row["Número de Bajas"];
        team.damage += row["Daño"];
        team.rank = row["Rango"]; 
        team.players.push(row);

        if (!globalData.players[compPlayerId]) {
          const playerName = uidToName[uidFromMatch] || row["Nombre del Jugador"] || "Unknown";
          globalData.players[compPlayerId] = {
            name: playerName,
            team: teamName,
            lobby: match.lobby,
            compTeamId,
            compPlayerId,
            kills: 0,
            damage: 0,
            headshots: 0,
            maxDistance: 0,
            grenadeKills: 0,
            assists: 0,
            knocks: 0,
            oobTime: 0,
            matches: 0,
            byMap: {}
          };
        }
        const p = globalData.players[compPlayerId];
        p.kills += row["Número de Bajas"];
        p.damage += row["Daño"];
        p.headshots += row["Número de Headshots"];
        p.maxDistance = Math.max(p.maxDistance, row["Máxima Distancia de Baja"]);
        p.grenadeKills += row["Bajas con Granada"];
        p.assists += row["Asistencias"];
        p.knocks += row["Noqueos"];
        p.oobTime += parseTime(row["Tiempo Fuera del Círculo Azul"]);
        p.matches += 1;

        if (!p.byMap[match.map]) p.byMap[match.map] = { kills: 0, damage: 0, maxDist: 0 };
        p.byMap[match.map].kills += row["Número de Bajas"];
        p.byMap[match.map].damage += row["Daño"];
        p.byMap[match.map].maxDist = Math.max(p.byMap[match.map].maxDist, row["Máxima Distancia de Baja"]);

        match.players.push(row);
      }
    } catch (err) {
      console.error("Error processing file:", file, err);
    }
  }

  aggregateTeams();
  renderAll();
}

function aggregateTeams() {
  globalData.teams = {};
  for (const match of globalData.matches) {
    for (const [id, t] of Object.entries(match.teams)) {
      const teamIdNum = Number(id.split("-")[1]);
      if (!isQualifiedTeamId(teamIdNum)) continue;
      if (!globalData.teams[id]) {
        globalData.teams[id] = {
          id,
          lobby: parseInt(id.split("-")[0]),
          teamId: teamIdNum,
          name: t.name,
          totalKills: 0,
          totalDamage: 0,
          top1: 0,
          positionPoints: 0,
          ranks: [],
          matches: 0,
          lastPosition: null
        };
      }
      const g = globalData.teams[id];
      g.totalKills += t.kills;
      g.totalDamage += t.damage;
      g.ranks.push(t.rank);
      g.matches += 1;
      if (t.rank === 1) g.top1 += 1;
      const pts = POSITION_POINTS[t.rank] || 0;
      g.positionPoints += pts;
      g.lastPosition = t.rank;
    }
  }
  for (const t of Object.values(globalData.teams)) {
    t.total = t.totalKills + t.positionPoints;
  }
}

function renderAll() {
  renderTeams();
  renderPlayers();
  renderHighlights();
  const activeMapBtn = document.querySelector('.map-btn.active');
  if (activeMapBtn) renderMapSection(activeMapBtn.dataset.map);
  setupEventListeners(); 
  
  updateSectionTitles();
  
  if (currentTeamDetailId && document.getElementById("team-detail").classList.contains("active")) {
    renderTeamDetail(currentTeamDetailId);
  }
}

function updateSectionTitles() {
  const mapsTitle = document.querySelector('#maps h2');
  if (mapsTitle) {
    mapsTitle.textContent = selectedDay === 'day1' ? t('statsByMapDay1') : t('statsByMapDay2');
  }
  
  const highlightsTitle = document.querySelector('#highlights h2');
  if (highlightsTitle) {
    highlightsTitle.textContent = selectedDay === 'day1' ? t('highlightsDay1') : t('highlightsDay2');
  }
}

function renderTeams() {
  const tbody = document.getElementById("teams-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const teamsArr = Object.values(globalData.teams);
  teamsArr.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.top1 !== a.top1) return b.top1 - a.top1;
    if (b.positionPoints !== a.positionPoints) return b.positionPoints - a.positionPoints;
    if (b.totalKills !== a.totalKills) return b.totalKills - a.totalKills;
    const aLast = a.lastPosition || 999;
    const bLast = b.lastPosition || 999;
    return aLast - bLast;
  });

  teamsArr.forEach((team, idx) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-team-id", team.id);
    tr.style.cursor = "pointer";
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${team.name} <small>(L${team.lobby})</small></td>
      <td>${team.totalKills}</td>
      <td>${team.positionPoints}</td>
      <td>${team.total}</td>
      <td>${team.top1}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPlayers() {
  const tbodyAcc = document.getElementById("players-acc-body");
  const tbodyFinals = document.getElementById("players-finals-body");
  const finalsTableWrapper = document.querySelector('#players-finals-table').closest('.players-table-wrapper');
  
  if (!tbodyAcc || !tbodyFinals || !finalsTableWrapper) return;
  tbodyAcc.innerHTML = "";
  tbodyFinals.innerHTML = "";

  if (selectedDay === 'day1') {
    finalsTableWrapper.style.display = 'none';
    const accCaption = document.querySelector('#players-acc-table caption');
    if (accCaption) accCaption.textContent = t('playersSemifinals');
  } else {
    finalsTableWrapper.style.display = 'block';
    const accCaption = document.querySelector('#players-acc-table caption');
    const finalsCaption = document.querySelector('#players-finals-table caption');
    if (accCaption) accCaption.textContent = t('playersAccumulated');
    if (finalsCaption) finalsCaption.textContent = t('playersFinals');
  }

  const accPlayers = Object.values(globalData.players)
    .filter(p => isQualifiedTeamId(Number(p.compTeamId.split("-")[1])))
    .sort((a,b) => b.kills - a.kills || b.damage - a.damage);

  accPlayers.forEach(player => {
    const hsPct = player.kills > 0 ? Math.round((player.headshots / player.kills) * 100) : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${player.name}</td>
      <td>${player.team} <small>(L${player.lobby})</small></td>
      <td>${player.kills}</td>
      <td>${player.damage}</td>
      <td>${hsPct}%</td>
      <td>${player.maxDistance}m</td>
    `;
    tbodyAcc.appendChild(tr);
  });

  if (selectedDay === 'day2') {
    const finalsPlayersAgg = {};
    for (const match of globalData.matches.filter(m => m.day === 'day2')) {
      for (const row of match.rows) {
        const lid = match.lobby;
        const uid = (row["uId"] || "").toString().trim();
        const compPid = compId(lid, uid);
        const teamIdNum = Number(row["TeamID"]);
        if (!isQualifiedTeamId(teamIdNum)) continue;
        const teamName = getTeamName('finales', lid, teamIdNum);
        if (!finalsPlayersAgg[compPid]) {
          finalsPlayersAgg[compPid] = {
            name: uidToName[uid] || row["Nombre del Jugador"] || "Unknown",
            team: teamName,
            lobby: lid,
            kills: 0,
            damage: 0,
            headshots: 0,
            maxDistance: 0
          };
        }
        const p = finalsPlayersAgg[compPid];
        p.kills += row["Número de Bajas"] || 0;
        p.damage += row["Daño"] || 0;
        p.headshots += row["Número de Headshots"] || 0;
        p.maxDistance = Math.max(p.maxDistance, row["Máxima Distancia de Baja"] || 0);
      }
    }

    Object.values(finalsPlayersAgg).sort((a,b) => b.kills - a.kills || b.damage - a.damage).forEach(player => {
      const hsPct = player.kills > 0 ? Math.round((player.headshots / player.kills) * 100) : 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${player.name}</td>
        <td>${player.team} <small>(L${player.lobby})</small></td>
        <td>${player.kills}</td>
        <td>${player.damage}</td>
        <td>${hsPct}%</td>
        <td>${player.maxDistance}m</td>
      `;
      tbodyFinals.appendChild(tr);
    });
  }
}

function renderHighlights() {
  const container = document.getElementById("highlights-list");
  const aggregateDiv = document.getElementById("highlights-aggregate");
  container.innerHTML = "";
  aggregateDiv.innerHTML = "";

  const dayMatches = globalData.matches.filter(m => m.day === selectedDay);
  if (dayMatches.length === 0) {
    container.innerHTML = `<p>${t('noData')}</p>`;
    return;
  }

  const mapBuckets = {};
  for (const match of dayMatches) {
    const mapKey = match.map;
    if (!mapBuckets[mapKey]) mapBuckets[mapKey] = { matches: [], teams: {}, players: [] };
    mapBuckets[mapKey].matches.push(match);
    for (const [id, team] of Object.entries(match.teams)) {
      const teamIdNum = Number(id.split("-")[1]);
      if (!isQualifiedTeamId(teamIdNum)) continue;
      if (!mapBuckets[mapKey].teams[id]) mapBuckets[mapKey].teams[id] = { name: team.name, kills: 0, damage: 0 };
      mapBuckets[mapKey].teams[id].kills += team.kills;
      mapBuckets[mapKey].teams[id].damage += team.damage;
    }
    for (const row of match.rows) {
      const uid = (row["uId"] || "").toString().trim();
      const compPid = compId(match.lobby, uid);
      const teamIdNum = Number(row["TeamID"]);
      if (!isQualifiedTeamId(teamIdNum)) continue;
      const teamName = getTeamName(selectedDay === 'day1' ? 'semifinales' : 'finales', match.lobby, teamIdNum);
      mapBuckets[mapKey].players.push({...row, lobby: match.lobby, teamNameOverride: teamName});
    }
  }

  for (const [mapKey, bucket] of Object.entries(mapBuckets)) {
    const teamsArr = Object.values(bucket.teams);
    let mvt = null;
    if (teamsArr.length) mvt = teamsArr.reduce((a,b) => ( (b.kills + b.damage/1000) > (a.kills + a.damage/1000) ? b : a ));
    const playersAgg = {};
    for (const p of bucket.players) {
      const uid = (p["uId"] || "").toString().trim();
      const key = `${p.lobby}-${uid}`;
      const name = uidToName[uid] || p["Nombre del Jugador"] || "Unknown";
      const teamName = p.teamNameOverride || getTeamName(selectedDay === 'day1' ? 'semifinales' : 'finales', p.lobby, p["TeamID"]);
      if (!playersAgg[key]) playersAgg[key] = { name, team: teamName, kills:0, damage:0, headshots:0, grenadeKills:0, assists:0, knocks:0, maxDistance:0 };
      playersAgg[key].kills += p["Número de Bajas"] || 0;
      playersAgg[key].damage += p["Daño"] || 0;
      playersAgg[key].headshots += p["Número de Headshots"] || 0;
      playersAgg[key].grenadeKills += p["Bajas con Granada"] || 0;
      playersAgg[key].assists += p["Asistencias"] || 0;
      playersAgg[key].knocks += p["Noqueos"] || 0;
      playersAgg[key].maxDistance = Math.max(playersAgg[key].maxDistance, p["Máxima Distancia de Baja"] || 0);
    }
    const playersArr = Object.values(playersAgg);
    let mvp = playersArr.length ? playersArr.reduce((a,b) => (b.kills !== a.kills ? (b.kills > a.kills ? b : a) : (b.damage > a.damage ? b : a))) : null;
    let longest = playersArr.length ? playersArr.reduce((a,b) => a.maxDistance > b.maxDistance ? a : b) : null;
    let grenade = playersArr.length ? playersArr.reduce((a,b) => a.grenadeKills > b.grenadeKills ? a : b) : null;
    let assist = playersArr.length ? playersArr.reduce((a,b) => a.assists > b.assists ? a : b) : null;
    let knock = playersArr.length ? playersArr.reduce((a,b) => a.knocks > b.knocks ? a : b) : null;

    let html = `<div class="highlight-card">`;
    html += `<strong>${mapKey}</strong>`;
    
    if (mvt) {
      html += `<div style="margin-top: 8px;"><strong>${t('mvt')}:</strong> ${mvt.name || 'N/A'} — ${mvt.kills} elim. | ${mvt.damage} dmg</div>`;
    }
    
    if (mvp) {
      html += `<div><strong>${t('mvp')}:</strong> ${mvp.name} (${mvp.team}) — ${mvp.kills} elim. | ${mvp.damage} dmg</div>`;
    }
    
    if (longest && longest.maxDistance > 0) {
      html += `<div><strong>${t('longestKill')}:</strong> ${longest.maxDistance}m — ${longest.name} (${longest.team})</div>`;
    }
    
    if (grenade && grenade.grenadeKills > 0) {
      html += `<div><strong>${t('grenadeKills')}:</strong> ${grenade.grenadeKills} — ${grenade.name} (${grenade.team})</div>`;
    }
    
    if (assist && assist.assists > 0) {
      html += `<div><strong>${t('assists')}:</strong> ${assist.assists} — ${assist.name} (${assist.team})</div>`;
    }
    
    if (knock && knock.knocks > 0) {
      html += `<div><strong>${t('knocks')}:</strong> ${knock.knocks} — ${knock.name} (${knock.team})</div>`;
    }
    
    html += `</div>`;
    container.innerHTML += html;
  }

  const aggPlayers = {};
  const aggTeams = {};
  for (const match of dayMatches) {
    for (const row of match.rows) {
      const uid = (row["uId"] || "").toString().trim();
      const key = `${match.lobby}-${uid}`;
      if (!isQualifiedTeamId(Number(row["TeamID"]))) continue;
      const teamName = getTeamName(selectedDay === 'day1' ? 'semifinales' : 'finales', match.lobby, row["TeamID"]);
      if (!aggPlayers[key]) aggPlayers[key] = { name: uidToName[uid] || row["Nombre del Jugador"] || "Unknown", team: teamName, kills:0, damage:0, headshots:0 };
      aggPlayers[key].kills += row["Número de Bajas"] || 0;
      aggPlayers[key].damage += row["Daño"] || 0;
      aggPlayers[key].headshots += row["Número de Headshots"] || 0;
    }
    for (const [id, team] of Object.entries(match.teams)) {
      if (!isQualifiedTeamId(Number(id.split("-")[1]))) continue;
      if (!aggTeams[id]) aggTeams[id] = { name: team.name, kills:0, damage:0 };
      aggTeams[id].kills += team.kills;
      aggTeams[id].damage += team.damage;
    }
  }
  const mvpAgg = Object.values(aggPlayers).sort((a,b) => {
    const scoreA = a.kills + (a.damage/100) + (a.headshots*0.5);
    const scoreB = b.kills + (b.damage/100) + (b.headshots*0.5);
    return scoreB - scoreA;
  })[0];
  const mvtAgg = Object.values(aggTeams).sort((a,b) => (b.kills + b.damage/1000) - (a.kills + a.damage/1000))[0];

  let aggHtml = "";
  if (mvpAgg) aggHtml += `<div class="highlight-card"><strong>MVP:</strong><br>${mvpAgg.name} (${mvpAgg.team}) — ${mvpAgg.kills} elim. | ${mvpAgg.damage} dmg | ${mvpAgg.headshots} HS</div>`;
  if (mvtAgg) aggHtml += `<div class="highlight-card"><strong>MVT:</strong><br>${mvtAgg.name} — ${mvtAgg.kills} elim. | ${mvtAgg.damage} dmg</div>`;
  aggregateDiv.innerHTML = aggHtml;
}

function renderMapSection(mapFilter) {
  const container = document.getElementById("map-stats");
  container.innerHTML = "";

  const dayMatches = globalData.matches.filter(m => m.day === selectedDay);
  if (dayMatches.length === 0) {
    container.innerHTML = `<p>${t('noData')}</p>`;
    return;
  }

  const matches = dayMatches.filter(m => m.map === mapFilter);
  if (matches.length === 0) {
    container.innerHTML = `<p>${t('noMapData', mapFilter)}</p>`;
    return;
  }

  const mapTeams = {};
  const mapPlayers = {};

  for (const match of matches) {
    for (const [id, team] of Object.entries(match.teams)) {
      const teamNum = Number(id.split("-")[1]);
      if (!isQualifiedTeamId(teamNum)) continue;
      if (!mapTeams[id]) mapTeams[id] = { name: team.name, kills:0, damage:0, lobby: match.lobby };
      mapTeams[id].kills += team.kills;
      mapTeams[id].damage += team.damage;
    }
    for (const row of match.rows) {
      const uid = (row["uId"] || "").toString().trim();
      const key = `${match.lobby}-${uid}`;
      const teamNum = Number(row["TeamID"]);
      if (!isQualifiedTeamId(teamNum)) continue;
      const teamName = getTeamName(selectedDay === 'day1' ? 'semifinales' : 'finales', match.lobby, teamNum);
      if (!mapPlayers[key]) mapPlayers[key] = { name: uidToName[uid] || row["Nombre del Jugador"] || "Unknown", team: teamName, lobby: match.lobby, kills:0, damage:0, maxDist:0 };
      mapPlayers[key].kills += row["Número de Bajas"] || 0;
      mapPlayers[key].damage += row["Daño"] || 0;
      mapPlayers[key].maxDist = Math.max(mapPlayers[key].maxDist, row["Máxima Distancia de Baja"] || 0);
    }
  }

  const teamsArray = Object.values(mapTeams).sort((a,b) => b.kills - a.kills).slice(0, 20);
  let html = `<h3>${t('topTeamsInMap', mapFilter)}</h3><table class="data-table"><thead><tr><th>${t('team')}</th><th>${t('eliminations')}</th><th>${t('damage')}</th></tr></thead><tbody>`;
  teamsArray.forEach(t => {
    html += `<tr><td>${t.name} <small>(L${t.lobby})</small></td><td>${t.kills}</td><td>${t.damage}</td></tr>`;
  });
  html += `</tbody></table>`;

  const topPlayers = Object.values(mapPlayers).sort((a,b) => b.kills - a.kills).slice(0, 20);
  html += `<h3>${t('topPlayersInMap', mapFilter)}</h3><table class="data-table"><thead><tr><th>${t('player')}</th><th>${t('team')}</th><th>${t('eliminations')}</th><th>${t('damage')}</th><th>${t('longestElim')}</th></tr></thead><tbody>`;
  topPlayers.forEach(p => {
    html += `<tr><td>${p.name}</td><td>${p.team} <small>(L${p.lobby})</small></td><td>${p.kills}</td><td>${p.damage}</td><td>${p.maxDist}m</td></tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderTeamDetail(teamId) {
  const team = globalData.teams[teamId];
  if (!team) { 
    console.warn("Team not found:", teamId); 
    return; 
  }

  currentTeamDetailId = teamId;

  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById("team-detail").classList.add("active");

  document.getElementById("team-detail-title").textContent = `${t('teamDetails')}: ${team.name} (L${team.lobby})`;

  const matchesOfTeam = globalData.matches.filter(match => Object.keys(match.teams).includes(teamId));
  if (matchesOfTeam.length === 0) {
    document.getElementById("team-player-stats").innerHTML = `<p>${t('noMatchesForTeam')}</p>`;
    return;
  }

  let html = `<h3>${t('teamPlayerStats')}</h3>`;
  
  const playerStats = {};
  
  const allTeamPlayers = new Set();
  matchesOfTeam.forEach(match => {
    const teamData = match.teams[teamId];
    if (teamData && teamData.players) {
      teamData.players.forEach(player => {
        const uid = (player["uId"] || "").toString().trim();
        const playerName = uidToName[uid] || player["Nombre del Jugador"] || "Unknown";
        allTeamPlayers.add(playerName);
        
        if (!playerStats[playerName]) {
          playerStats[playerName] = {
            name: playerName,
            matches: 0,
            kills: 0,
            damage: 0,
            headshots: 0,
            maxDistance: 0,
            grenadeKills: 0,
            assists: 0,
            knocks: 0,
            revives: 0
          };
        }
        
        playerStats[playerName].matches += 1;
        playerStats[playerName].kills += player["Número de Bajas"] || 0;
        playerStats[playerName].damage += player["Daño"] || 0;
        playerStats[playerName].headshots += player["Número de Headshots"] || 0;
        playerStats[playerName].maxDistance = Math.max(playerStats[playerName].maxDistance, player["Máxima Distancia de Baja"] || 0);
        playerStats[playerName].grenadeKills += player["Bajas con Granada"] || 0;
        playerStats[playerName].assists += player["Asistencias"] || 0;
        playerStats[playerName].knocks += player["Noqueos"] || 0;
        playerStats[playerName].revives += player["Rescates"] || 0;
      });
    }
  });

  const playerStatsArray = Object.values(playerStats).sort((a, b) => b.kills - a.kills);
  
  html += `<table class="data-table"><thead><tr>
    <th>${t('playerName')}</th>
    <th>${t('matchesPlayed')}</th>
    <th>${t('totalKills')}</th>
    <th>${t('totalDamage')}</th>
    <th>${t('totalHeadshots')}</th>
    <th>${t('avgKills')}</th>
    <th>${t('avgDamage')}</th>
    <th>${t('maxDist')}</th>
    <th>${t('grenades')}</th>
    <th>${t('assistsAbbr')}</th>
    <th>${t('knocksAbbr')}</th>
    <th>${t('revives')}</th>
  </tr></thead><tbody>`;
  
  playerStatsArray.forEach(player => {
    const avgKills = player.matches > 0 ? (player.kills / player.matches).toFixed(1) : "0";
    const avgDamage = player.matches > 0 ? (player.damage / player.matches).toFixed(0) : "0";
    
    html += `<tr>
      <td>${player.name}</td>
      <td>${player.matches}</td>
      <td>${player.kills}</td>
      <td>${player.damage}</td>
      <td>${player.headshots}</td>
      <td>${avgKills}</td>
      <td>${avgDamage}</td>
      <td>${player.maxDistance}m</td>
      <td>${player.grenadeKills}</td>
      <td>${player.assists}</td>
      <td>${player.knocks}</td>
      <td>${player.revives}</td>
    </tr>`;
  });
  
  html += `</tbody></table>`;
  
  html += `<h3>${t('teamStatsByMatch')}</h3>`;

  matchesOfTeam.forEach((match, idx) => {
    const map = match.map;
    const matchPlayers = match.players.filter(p => `${match.lobby}-${p["TeamID"]}` === teamId);
    html += `<h4>${t('match', idx + 1)} - ${map}</h4>`;
    html += `<table class="data-table"><thead><tr>
      <th>${t('playerName')}</th><th>${t('kills')}</th><th>${t('damage')}</th><th>${t('maxDist')}</th><th>${t('assistsAbbr')}</th><th>${t('knocksAbbr')}</th><th>${t('hs')}</th>
      </tr></thead><tbody>`;
    matchPlayers.forEach(p => {
      const playerName = uidToName[(p["uId"] || "").toString().trim()] || p["Nombre del Jugador"] || "Unknown";
      html += `<tr><td>${playerName}</td><td>${p["Número de Bajas"]}</td><td>${p["Daño"]}</td><td>${p["Máxima Distancia de Baja"]}m</td><td>${p["Asistencias"]}</td><td>${p["Noqueos"]}</td><td>${p["Número de Headshots"]}</td></tr>`;
    });
    html += `</tbody></table><br>`;
  });

  document.getElementById("team-player-stats").innerHTML = html;
}

function setupEventListeners() {
  document.getElementById('lang-es')?.addEventListener('click', () => setLanguage('es'));
  document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", tabClickHandler);
  });

  document.querySelectorAll(".day-selector .btn").forEach(btn => {
    btn.addEventListener('click', dayClickHandler);
  });

  document.querySelectorAll(".map-btn").forEach(btn => {
    btn.addEventListener('click', mapBtnHandler);
  });

  document.getElementById("teams-body")?.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-team-id]");
    if (row && row.dataset.teamId) {
      renderTeamDetail(row.dataset.teamId);
    }
  });

  document.getElementById("back-to-teams")?.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.querySelector('.tab[data-tab="teams"]').classList.add("active");
    document.getElementById("teams").classList.add("active");
    renderTeams();
  });
}

function tabClickHandler(evt) {
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  evt.currentTarget.classList.add("active");
  const tabId = evt.currentTarget.dataset.tab;
  document.getElementById(tabId).classList.add("active");
  if (tabId === 'maps') {
    const activeMapBtn = document.querySelector('.map-btn.active');
    renderMapSection(activeMapBtn ? activeMapBtn.dataset.map : 'Erangel');
  } else if (tabId === 'highlights') {
    renderHighlights();
  } else if (tabId === 'teams') {
    renderTeams();
  } else if (tabId === 'players') {
    renderPlayers();
  }
}

function dayClickHandler(evt) {
  const btn = evt.currentTarget;
  document.querySelectorAll(".day-selector .btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const day = btn.dataset.day;
  loadDay(day);
}

function mapBtnHandler(evt) {
  document.querySelectorAll(".map-btn").forEach(b => b.classList.remove("active"));
  const btn = evt.currentTarget;
  btn.classList.add("active");
  renderMapSection(btn.dataset.map);
}

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof Papa === "undefined") {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/papaparse@5.4.1/papaparse.min.js";
    await new Promise(resolve => { 
      script.onload = resolve; 
      document.head.appendChild(script); 
    });
  }
  setLanguage(currentLang);
  await loadUidNameMap();
  loadDay(selectedDay); 
});
