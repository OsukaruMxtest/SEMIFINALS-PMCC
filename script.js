// --- CONFIGURACIÓN ---
const MAP_NAMES = {1: "Erangel", 2: "Miramar", 3: "Sanhok", 4: "Rondo"};

// --- MAPEO DE EQUIPOS CLASIFICADOS DESDE SEMIFINALES A FINALES ---
const QUALIFIED_TEAMS_MAP = {
  "1-16": { newId: 3, name: "ITSV" },
  "1-10": { newId: 4, name: "Southeastern Louisiana" },
  "1-9":  { newId: 5, name: "Middlesex County" },
  "1-17": { newId: 6, name: "Seneca (B)" },
  "1-6":  { newId: 7, name: "Seneca (A)" },
  "1-4":  { newId: 8, name: "Portage" },
  "1-14": { newId: 9, name: "Alabama (A)" },
  "1-3":  { newId: 10, name: "Coquitlam" },
  "2-4":  { newId: 11, name: "Canada West" },
  "2-11": { newId: 12, name: "Kent State" },
  "2-9":  { newId: 13, name: "Arkansas State" },
  "2-14": { newId: 14, name: "Middlesex County" },
  "2-16": { newId: 15, name: "Red River" },
  "2-13": { newId: 16, name: "Algoma" },
  "2-15": { newId: 17, name: "Alabama (B)" },
  "2-7":  { newId: 18, name: "Vancouver CC" }
};

// 🔑 EQUIPOS CLASIFICADOS A LA FINAL — ACTUALIZADOS
const QUALIFIED_TEAMS = new Set(Object.keys(QUALIFIED_TEAMS_MAP));

const QUALIFIED_TEAM_IDS = Object.values(QUALIFIED_TEAMS_MAP).map(t => t.newId);
const TEAM_ID_NAME_OVERRIDE = Object.fromEntries(
  Object.values(QUALIFIED_TEAMS_MAP).map(t => [t.newId, t.name])
);

const DAY1_FILES = [
  "data/day1/M1.csv", "data/day1/M2.csv", "data/day1/M3.csv", "data/day1/M4.csv",
  "data/day1/M5.csv", "data/day1/M6.csv", "data/day1/M7.csv", "data/day1/M8.csv"
];

let globalData = {
  matches: [],
  teams: {},
  players: {},
  allMaps: new Set()
};

let uidToName = {};
let currentLang = localStorage.getItem('lang') || 'es';

// --- TRADUCCIONES ---
const translations = {
  es: {
    title: "PMCC FALL 2025 — DATOS SEMIFINALES",
    day1: "Día 1",
    day2: "Día 2",
    teams: "Equipos",
    players: "Jugadores",
    maps: "Por Mapa",
    highlights: "Highlights",
    teamSummary: "Resumen por Equipos",
    pos: "Pos",
    team: "Equipo",
    eliminations: "Eliminaciones",
    damage: "Daño",
    wwwcd: "WWWCD",
    topPlayers: "Jugadores Destacados",
    player: "Jugador",
    headshotPct: "Headshot %",
    longestElim: "Elim. a mayor distancia",
    statsByMap: "Estadísticas por Mapa",
    selectMap: "Selecciona un mapa para ver estadísticas detalladas.",
    dayHighlights: "Highlights del Día",
    backToTeams: "← Volver a Equipos",
    teamDetails: "Estadísticas: {name} (L{lobby})",
    mvt: "MVT",
    mvp: "MVP",
    longestKill: "Baja más lejana",
    oobTime: "Más tiempo fuera del círculo",
    grenadeKills: "elim. con granada",
    assists: "asistencias",
    knocks: "noqueos",
    noData: "No hay datos suficientes.",
    noMapData: map => `No hay datos para ${map}.`,
    teamStatsByMatch: "Estadísticas por Partida",
    match: idx => `Partida ${idx}`,
    teamTotalStats: "Estadísticas Totales por Jugador",
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
    revives: "Rescates"
  },
  en: {
    title: "PMCC FALL 2025 — SEMIFINALS DATA",
    day1: "Day 1",
    day2: "Day 2",
    teams: "Teams",
    players: "Players",
    maps: "By Map",
    highlights: "Highlights",
    teamSummary: "Team Summary",
    pos: "Pos",
    team: "Team",
    eliminations: "Eliminations",
    damage: "Damage",
    wwwcd: "WWWCD",
    topPlayers: "Top Players",
    player: "Player",
    headshotPct: "Headshot %",
    longestElim: "Longest Elimination",
    statsByMap: "Stats by Map",
    selectMap: "Select a map to view detailed stats.",
    dayHighlights: "Day Highlights",
    backToTeams: "← Back to Teams",
    teamDetails: "Stats: {name} (L{lobby})",
    mvt: "MVT",
    mvp: "MVP",
    longestKill: "Longest Kill",
    oobTime: "Most Time Outside Blue Zone",
    grenadeKills: "grenade kills",
    assists: "assists",
    knocks: "knocks",
    noData: "Not enough data.",
    noMapData: map => `No data for ${map}.`,
    teamStatsByMatch: "Match Stats",
    match: idx => `Match ${idx}`,
    teamTotalStats: "Total Player Stats",
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
    revives: "Revives"
  }
};

function t(key, ...args) {
  let str = translations[currentLang][key] || key;
  if (typeof str === 'function') str = str(...args);
  return str;
}

function formatTeamTitle(template, name, lobby) {
  return template.replace('{name}', name).replace('{lobby}', lobby);
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

  const activeTab = document.querySelector('.tab.active')?.dataset.tab;
  if (activeTab) updateTabContent(activeTab);

  document.getElementById('lang-es').classList.toggle('active', lang === 'es');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

function updateTabContent(tabId) {
  switch (tabId) {
    case 'teams':
      document.querySelector('#teams h2').textContent = t('teamSummary');
      document.querySelector('#teams thead th:nth-child(1)').textContent = t('pos');
      document.querySelector('#teams thead th:nth-child(2)').textContent = t('team');
      document.querySelector('#teams thead th:nth-child(3)').textContent = t('eliminations');
      document.querySelector('#teams thead th:nth-child(4)').textContent = t('damage');
      document.querySelector('#teams thead th:nth-child(5)').textContent = t('wwwcd');
      renderTeams();
      break;
    case 'players':
      document.querySelector('#players h2').textContent = t('topPlayers');
      document.querySelector('#players thead th:nth-child(1)').textContent = t('player');
      document.querySelector('#players thead th:nth-child(2)').textContent = t('team');
      document.querySelector('#players thead th:nth-child(3)').textContent = t('eliminations');
      document.querySelector('#players thead th:nth-child(4)').textContent = t('damage');
      document.querySelector('#players thead th:nth-child(5)').textContent = t('headshotPct');
      document.querySelector('#players thead th:nth-child(6)').textContent = t('longestElim');
      renderPlayers();
      break;
    case 'maps':
      document.querySelector('#maps h2').textContent = t('statsByMap');
      document.getElementById('map-stats').innerHTML = `<p>${t('selectMap')}</p>`;
      break;
    case 'highlights':
      document.querySelector('#highlights h2').textContent = t('dayHighlights');
      renderHighlights();
      break;
  }
}

// --- UTILIDADES ---
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

function getLobbyAndMap(filename) {
  const match = filename.match(/M(\d)/);
  if (!match) return { lobby: 1, map: "Unknown" };
  const num = parseInt(match[1]);
  const lobby = num <= 4 ? 1 : 2;
  const mapNum = num <= 4 ? num : num - 4;
  return { lobby, map: MAP_NAMES[mapNum] || `Map ${mapNum}` };
}

// --- CARGA DEL MAPEO UID → NOMBRE CLARO ---
async function loadUidNameMap() {
  try {
    const response = await fetch("uid-name.csv");
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load uid-name.csv`);
    const csvText = await response.text();
    const Papa = window.Papa;
    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });

    uidToName = {};
    for (const row of result.data) {
      let uidRaw = (row.UID || "").toString().trim();

      if (/e[+-]/i.test(uidRaw)) {
        try {
          const num = Number(uidRaw);
          if (Number.isSafeInteger(num)) {
            uidRaw = num.toFixed(0);
          } else {
            uidRaw = BigInt(Math.round(num)).toString();
          }
        } catch (e) {
          const [mantissa, exponentStr] = uidRaw.toLowerCase().split('e');
          const exponent = parseInt(exponentStr, 10);
          if (!isNaN(exponent) && mantissa.includes('.')) {
            const [intPart, decPart] = mantissa.split('.');
            let full = intPart + (decPart || '');
            const zerosToAdd = exponent - (decPart?.length || 0);
            if (zerosToAdd >= 0) {
              full += '0'.repeat(zerosToAdd);
            } else {
              full = (Number(uidRaw)).toFixed(0);
            }
            uidRaw = full;
          } else {
            uidRaw = (Number(uidRaw)).toFixed(0);
          }
        }
      } else if (uidRaw.includes(".")) {
        uidRaw = uidRaw.split(".")[0];
      }

      const nameClean = (row.Name || "").toString().trim();
      if (uidRaw && nameClean) {
        uidToName[uidRaw] = nameClean;
      }
    }

    console.log("✅ uidToName loaded with", Object.keys(uidToName).length, "players.");
  } catch (err) {
    console.error("❌ Error loading uid-name.csv:", err);
  }
}

// --- CARGA PRINCIPAL ---
async function loadDay() {
  const Papa = window.Papa;
  globalData = { matches: [], teams: {}, players: {}, allMaps: new Set() };

  for (const file of DAY1_FILES) {
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

      const { lobby, map } = getLobbyAndMap(file);
      globalData.allMaps.add(map);

      const match = { lobby, map, teams: {}, players: [], rows: result.data };
      globalData.matches.push(match);

      for (const row of result.data) {
        const safeNum = (val) => (val === "" || val == null || isNaN(val)) ? 0 : Number(val);
        const numFields = [
          "TeamID", "Rango", "uId", "Salud", "Número de Bajas", "Daño",
          "Máxima Distancia de Baja", "Asistencias", "Noqueos", "Número de Headshots",
          "Daño Recibido", "Curación", "Tiempo Fuera del Círculo Azul",
          "Bajas con Granada", "Rescates", "Distancia Conducida", "Distancia Recorrida"
        ];
        for (const field of numFields) {
          row[field] = safeNum(row[field]);
        }

        const compTeamId = `${lobby}-${row["TeamID"]}`;
        
        // 🔁 Remapeo del equipo a su nuevo ID y nombre final si aplica
        const mapKey = `${lobby}-${row["TeamID"]}`;
        let finalTeamId = row["TeamID"];
        let finalTeamName = row["Nombre del Equipo"] || "";

        if (QUALIFIED_TEAMS_MAP[mapKey]) {
          finalTeamId = QUALIFIED_TEAMS_MAP[mapKey].newId;
          finalTeamName = QUALIFIED_TEAMS_MAP[mapKey].name;
        }

        const overrideName = TEAM_ID_NAME_OVERRIDE[Number(finalTeamId)];
        const teamName = overrideName || finalTeamName || `Team ${finalTeamId}`;

        const uidFromMatch = (row["uId"] || "").toString().trim();
        const compPlayerId = `${lobby}-${uidFromMatch}`;
        const playerName = uidToName[uidFromMatch] || row["Nombre del Jugador"] || "Unknown";

        if (!match.teams[compTeamId]) {
          match.teams[compTeamId] = {
            name: teamName,
            rank: row["Rango"],
            kills: 0,
            damage: 0,
            heals: 0,
            revives: 0,
            players: []
          };
        }
        const team = match.teams[compTeamId];
        team.kills += row["Número de Bajas"];
        team.damage += row["Daño"];
        team.heals += row["Curación"];
        team.revives += row["Rescates"];
        team.players.push(row);

        if (!globalData.players[compPlayerId]) {
          globalData.players[compPlayerId] = {
            name: playerName,
            team: teamName,
            lobby,
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

        if (!p.byMap[map]) p.byMap[map] = { kills: 0, damage: 0, maxDist: 0 };
        p.byMap[map].kills += row["Número de Bajas"];
        p.byMap[map].damage += row["Daño"];
        p.byMap[map].maxDist = Math.max(p.byMap[map].maxDist, row["Máxima Distancia de Baja"]);

        match.players.push(row);
      }
    } catch (err) {
      console.error("Error processing file:", file, err);
    }
  }

  globalData.teams = {};
  for (const match of globalData.matches) {
    for (const [id, team] of Object.entries(match.teams)) {
      if (!globalData.teams[id]) {
        globalData.teams[id] = {
          id,
          lobby: parseInt(id.split("-")[0]),
          teamId: parseInt(id.split("-")[1]),
          name: team.name,
          totalKills: 0,
          totalDamage: 0,
          top1: 0,
          ranks: [],
          matches: 0
        };
      }
      globalData.teams[id].totalKills += team.kills;
      globalData.teams[id].totalDamage += team.damage;
      globalData.teams[id].ranks.push(team.rank);
      globalData.teams[id].matches += 1;
      if (team.rank === 1) globalData.teams[id].top1 += 1;
    }
  }

  renderAll();
  renderMapSection("Erangel");
}

// --- RENDERIZADO ---
function renderAll() {
  renderTeams();
  renderPlayers();
  renderHighlights();
  setupEventListeners();
}

function renderTeams() {
  const tbody = document.getElementById("teams-body");
  tbody.innerHTML = "";

  const qualifiedTeams = Object.values(globalData.teams)
    .filter(team => QUALIFIED_TEAMS.has(team.id))
    .sort((a, b) => b.totalKills - a.totalKills);

  qualifiedTeams.forEach((team, idx) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-team-id", team.id);
    tr.style.cursor = "pointer";
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${team.name} <small>(L${team.lobby})</small></td>
      <td>${team.totalKills}</td>
      <td>${team.totalDamage}</td>
      <td>${team.top1}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPlayers() {
  const tbody = document.getElementById("players-body");
  tbody.innerHTML = "";

  const qualifiedPlayers = Object.values(globalData.players)
    .filter(p => QUALIFIED_TEAMS.has(p.compTeamId))
    .sort((a, b) => b.kills - a.kills || b.damage - a.damage);

  qualifiedPlayers.forEach(player => {
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
    tbody.appendChild(tr);
  });
}

function renderHighlights() {
  const container = document.getElementById("highlights-list");
  container.innerHTML = "";

  const teams = Object.values(globalData.teams).filter(t => QUALIFIED_TEAMS.has(t.id));
  const players = Object.values(globalData.players).filter(p => QUALIFIED_TEAMS.has(p.compTeamId) && p.kills > 0);

  if (teams.length === 0 || players.length === 0) {
    container.innerHTML = `<p>${t('noData')}</p>`;
    return;
  }

  const mvt = teams.reduce((a, b) => a.totalKills > b.totalKills ? a : b);
  container.innerHTML += `
    <div class="highlight-card">
      <strong>${t('mvt')}: ${mvt.name} (L${mvt.lobby})</strong><br>
      ${mvt.totalKills} ${t('eliminations').toLowerCase()}<br>
      ${mvt.totalDamage} ${t('damage').toLowerCase()}
    </div>
  `;

  const mvp = players.reduce((a, b) => a.kills > b.kills ? a : b);
  container.innerHTML += `
    <div class="highlight-card">
      <strong>${t('mvp')}: ${mvp.name} (${mvp.team}) (L${mvp.lobby})</strong><br>
      ${mvp.kills} elim. | ${mvp.damage} ${t('damage').toLowerCase()}<br>
      ${mvp.headshots} ${t('headshotPct').replace('%', '').toLowerCase()}
    </div>
  `;

  const longest = players.reduce((a, b) => a.maxDistance > b.maxDistance ? a : b);
  if (longest.maxDistance > 0) {
    container.innerHTML += `
      <div class="highlight-card">
        <strong>${longest.maxDistance}m</strong><br>
        ${t('longestKill')}<br>
        <em>${longest.name} (${longest.team})</em>
      </div>
    `;
  }

  const oob = players.reduce((a, b) => a.oobTime > b.oobTime ? a : b);
  if (oob.oobTime > 0) {
    container.innerHTML += `
      <div class="highlight-card">
        <strong>${secondsToTime(oob.oobTime)}</strong><br>
        ${t('oobTime')}<br>
        <em>${oob.name} (${oob.team})</em>
      </div>
    `;
  }

  const grenade = players.reduce((a, b) => a.grenadeKills > b.grenadeKills ? a : b);
  if (grenade.grenadeKills > 0) {
    container.innerHTML += `
      <div class="highlight-card">
        <strong>${grenade.grenadeKills} ${t('grenadeKills')}</strong><br>
        <em>${grenade.name} (${grenade.team})</em>
      </div>
    `;
  }

  const assist = players.reduce((a, b) => a.assists > b.assists ? a : b);
  if (assist.assists > 0) {
    container.innerHTML += `
      <div class="highlight-card">
        <strong>${assist.assists} ${t('assists')}</strong><br>
        <em>${assist.name} (${assist.team})</em>
      </div>
    `;
  }

  const knock = players.reduce((a, b) => a.knocks > b.knocks ? a : b);
  if (knock.knocks > 0) {
    container.innerHTML += `
      <div class="highlight-card">
        <strong>${knock.knocks} ${t('knocks')}</strong><br>
        <em>${knock.name} (${knock.team})</em>
      </div>
    `;
  }
}

function renderMapSection(mapFilter) {
  const container = document.getElementById("map-stats");
  container.innerHTML = "";

  const matches = globalData.matches.filter(m => m.map === mapFilter);
  if (matches.length === 0) {
    container.innerHTML = `<p>${t('noMapData')(mapFilter)}</p>`;
    return;
  }

  const mapTeams = {};
  const mapPlayers = [];

  for (const match of matches) {
    for (const [id, team] of Object.entries(match.teams)) {
      if (QUALIFIED_TEAMS.has(id)) {
        if (!mapTeams[id]) {
          mapTeams[id] = { name: team.name, kills: 0, damage: 0, lobby: match.lobby };
        }
        mapTeams[id].kills += team.kills;
        mapTeams[id].damage += team.damage;
      }
    }
    for (const p of match.players) {
      const pid = `${match.lobby}-${p["uId"]}`;
      if (QUALIFIED_TEAMS.has(`${match.lobby}-${p["TeamID"]}`)) {
        mapPlayers.push({ ...p, lobby: match.lobby });
      }
    }
  }

  const teamsArray = Object.values(mapTeams).sort((a, b) => b.kills - a.kills).slice(0, 10);
  let html = `<h3>Top Teams in ${mapFilter}</h3><table class="data-table"><thead><tr><th>Team</th><th>Kills</th><th>Damage</th></tr></thead><tbody>`;
  teamsArray.forEach(t => {
    html += `<tr><td>${t.name} <small>(L${t.lobby})</small></td><td>${t.kills}</td><td>${t.damage}</td></tr>`;
  });
  html += `</tbody></table>`;

  const playerMapStats = {};
  for (const p of mapPlayers) {
    const uidFromMatch = (p["uId"] || "").toString().trim();
    const key = `${p.lobby}-${uidFromMatch}`;
    const playerName = uidToName[uidFromMatch] || p["Nombre del Jugador"] || "Unknown";
    if (!playerMapStats[key]) {
      playerMapStats[key] = {
        name: playerName,
        team: p["Nombre del Equipo"],
        lobby: p.lobby,
        kills: 0,
        damage: 0,
        maxDist: 0
      };
    }
    playerMapStats[key].kills += p["Número de Bajas"];
    playerMapStats[key].damage += p["Daño"];
    playerMapStats[key].maxDist = Math.max(playerMapStats[key].maxDist, p["Máxima Distancia de Baja"]);
  }

  const topPlayers = Object.values(playerMapStats).sort((a, b) => b.kills - a.kills).slice(0, 10);
  html += `<h3>Top Players in ${mapFilter}</h3><table class="data-table"><thead><tr><th>Player</th><th>Team</th><th>Kills</th><th>Damage</th><th>Max Dist.</th></tr></thead><tbody>`;
  topPlayers.forEach(p => {
    html += `<tr><td>${p.name}</td><td>${p.team} <small>(L${p.lobby})</small></td><td>${p.kills}</td><td>${p.damage}</td><td>${p.maxDist}m</td></tr>`;
  });
  html += `</tbody></table>`;

  container.innerHTML = html;
}

function renderTeamDetail(teamId) {
  const team = globalData.teams[teamId];
  if (!team) return;

  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById("team-detail").classList.add("active");

  const titleTemplate = t('teamDetails');
  document.getElementById("team-detail-title").textContent = formatTeamTitle(titleTemplate, team.name, team.lobby);

  const matchesOfTeam = globalData.matches.filter(match =>
    Object.keys(match.teams).includes(teamId)
  );

  if (matchesOfTeam.length === 0) {
    document.getElementById("team-player-stats").innerHTML = "<p>No matches found for this team.</p>";
    return;
  }

  let html = `<h3>${t('teamStatsByMatch')}</h3>`;

  matchesOfTeam.forEach((match, idx) => {
    const map = match.map;
    const matchPlayers = match.players.filter(p => `${match.lobby}-${p["TeamID"]}` === teamId);
    
    html += `<h4>${t('match')(idx + 1)} - ${map}</h4>`;
    html += `<table class="data-table"><thead><tr>
      <th>${t('playerName')}</th>
      <th>${t('kills')}</th>
      <th>${t('damage')}</th>
      <th>${t('maxDist')}</th>
      <th>${t('assistsAbbr')}</th>
      <th>${t('knocksAbbr')}</th>
      <th>${t('hs')}</th>
      <th>${t('damageTaken')}</th>
      <th>${t('healing')}</th>
      <th>${t('oob')}</th>
      <th>${t('grenades')}</th>
      <th>${t('driven')}</th>
      <th>${t('walked')}</th>
      <th>${t('revives')}</th>
    </tr></thead><tbody>`;

    matchPlayers.forEach(p => {
      const playerName = uidToName[p["uId"]?.toString().trim()] || p["Nombre del Jugador"] || "Unknown";
      html += `<tr>
        <td>${playerName}</td>
        <td>${p["Número de Bajas"]}</td>
        <td>${p["Daño"]}</td>
        <td>${p["Máxima Distancia de Baja"]}m</td>
        <td>${p["Asistencias"]}</td>
        <td>${p["Noqueos"]}</td>
        <td>${p["Número de Headshots"]}</td>
        <td>${p["Daño Recibido"] || 0}</td>
        <td>${p["Curación"] || 0}</td>
        <td>${p["Tiempo Fuera del Círculo Azul"] || "0m 0s"}</td>
        <td>${p["Bajas con Granada"] || 0}</td>
        <td>${(p["Distancia Conducida"] || 0)}m</td>
        <td>${(p["Distancia Recorrida"] || 0)}m</td>
        <td>${p["Rescates"] || 0}</td>
      </tr>`;
    });

    html += `</tbody></table><br>`;
  });

  const playersOfTeam = Object.values(globalData.players).filter(p => p.compTeamId === teamId);
  html += `<h3>${t('teamTotalStats')}</h3>`;
  html += `<table class="data-table"><thead><tr>
    <th>${t('playerName')}</th>
    <th>${t('kills')}</th>
    <th>${t('damage')}</th>
    <th>${t('maxDist')}</th>
    <th>${t('assistsAbbr')}</th>
    <th>${t('knocksAbbr')}</th>
    <th>${t('hs')}</th>
    <th>${t('damageTaken')}</th>
    <th>${t('healing')}</th>
    <th>${t('oob')}</th>
    <th>${t('grenades')}</th>
    <th>${t('revives')}</th>
  </tr></thead><tbody>`;

  playersOfTeam.forEach(p => {
    let damageTaken = 0, healing = 0, oobTimeSec = 0, grenadeKills = 0, revives = 0;

    globalData.matches.forEach(match => {
      match.players.forEach(row => {
        const uid = (row["uId"] || "").toString().trim();
        const compPid = `${match.lobby}-${uid}`;
        if (compPid === p.compPlayerId) {
          damageTaken += row["Daño Recibido"] || 0;
          healing += row["Curación"] || 0;
          oobTimeSec += parseTime(row["Tiempo Fuera del Círculo Azul"]);
          grenadeKills += row["Bajas con Granada"] || 0;
          revives += row["Rescates"] || 0;
        }
      });
    });

    html += `<tr>
      <td>${p.name}</td>
      <td>${p.kills}</td>
      <td>${p.damage}</td>
      <td>${p.maxDistance}m</td>
      <td>${p.assists}</td>
      <td>${p.knocks}</td>
      <td>${p.headshots}</td>
      <td>${damageTaken}</td>
      <td>${healing}</td>
      <td>${secondsToTime(oobTimeSec)}</td>
      <td>${grenadeKills}</td>
      <td>${revives}</td>
    </tr>`;
  });

  html += `</tbody></table>`;

  document.getElementById("team-player-stats").innerHTML = html;
}

function setupEventListeners() {
  // --- Idioma ---
  document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

  // --- Pestañas ---
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
      updateTabContent(btn.dataset.tab);
    });
  });

  // --- Mapas ---
  document.querySelectorAll(".map-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".map-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMapSection(btn.dataset.map);
    });
  });

  // ✅ Listener DIRECTO en #teams-body
  document.getElementById("teams-body").addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (row && row.dataset.teamId) {
      renderTeamDetail(row.dataset.teamId);
    }
  });

  // --- Botón de regreso ---
  const backBtn = document.getElementById("back-to-teams");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.querySelector('.tab[data-tab="teams"]').classList.add("active");
      document.getElementById("teams").classList.add("active");
    });
  }
}

// --- INICIO ---
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
  loadDay();
});
