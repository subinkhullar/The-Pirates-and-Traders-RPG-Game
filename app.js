/**
 * ============================================================================
 * 🏴‍☠️⚓ THE PIRATES AND TRADERS RPG GAME BY SUBIN KHULLAR 😎
 * Complete Production-Ready Game Engine Architecture (app.js)
 * Modern Spiritual Successor to Sid Meier's Pirates!, Port Royale & Sea Dogs
 * 
 * Copyright ©️ 2026 Subin Khullar. All rights reserved.
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. CONSTANTS, BALANCING VARIABLES & WORLD CONFIGURATION
   ============================================================================ */

const GAME_CONFIG = {
  TITLE: "The Pirates and Traders RPG Game by Subin Khullar 😎",
  COPYRIGHT: "Copyright ©️ 2026 Subin Khullar. All rights reserved.",
  VERSION: "1.0.0",
  START_YEAR: 1687,
  WORLD_WIDTH: 3600,
  WORLD_HEIGHT: 2600,
  TIME_STEP_MS: 3000, // 3 seconds = 1 in-game day while sailing
  SAVE_KEY: "PIRATES_TRADERS_SUBIN_KHULLAR_SAVE_V1"
};

const COMMODITIES = [
  { id: "grain", name: "Grain & Hardtack", basePrice: 8, scarcity: 0.2, luxury: 1, illegal: false, weight: 1 },
  { id: "timber", name: "Seasoned Timber", basePrice: 14, scarcity: 0.3, luxury: 1, illegal: false, weight: 2 },
  { id: "iron", name: "Iron & Cannonballs", basePrice: 26, scarcity: 0.4, luxury: 2, illegal: false, weight: 3 },
  { id: "rum", name: "Barbados Rum", basePrice: 38, scarcity: 0.5, luxury: 3, illegal: false, weight: 1 },
  { id: "tobacco", name: "Virginia Tobacco", basePrice: 52, scarcity: 0.6, luxury: 4, illegal: false, weight: 1 },
  { id: "sugar", name: "Refined Cane Sugar", basePrice: 65, scarcity: 0.5, luxury: 4, illegal: false, weight: 2 },
  { id: "spices", name: "East Indies Spices", basePrice: 110, scarcity: 0.7, luxury: 5, illegal: false, weight: 1 },
  { id: "silk", name: "Fine Lyon Silk", basePrice: 145, scarcity: 0.8, luxury: 5, illegal: false, weight: 1 },
  { id: "gems", name: "Plundered Emeralds", basePrice: 280, scarcity: 0.9, luxury: 6, illegal: false, weight: 1 }
];

const CONTRABAND = [
  { id: "gunpowder", name: "Untaxed Gunpowder", basePrice: 85, risk: 0.35, weight: 1 },
  { id: "stolen_silver", name: "Spanish Stolen Silver", basePrice: 190, risk: 0.55, weight: 2 },
  { id: "opium", name: "Smuggled Black Lotus", basePrice: 320, risk: 0.75, weight: 1 },
  { id: "relic_curio", name: "Ancient Tideborn Curio", basePrice: 580, risk: 0.85, weight: 1 }
];

const SHIP_TYPES = {
  Sloop: { name: "Coastal Sloop", hull: 80, sails: 100, cannons: 8, cargo: 50, maxCrew: 22, speed: 6.2, turnRate: 0.055, cost: 700 },
  Brigantine: { name: "War Brigantine", hull: 140, sails: 95, cannons: 16, cargo: 90, maxCrew: 45, speed: 5.5, turnRate: 0.045, cost: 1800 },
  Frigate: { name: "Royal Frigate", hull: 220, sails: 85, cannons: 28, cargo: 140, maxCrew: 80, speed: 4.8, turnRate: 0.035, cost: 4200 },
  Galleon: { name: "Treasure Galleon", hull: 320, sails: 75, cannons: 40, cargo: 240, maxCrew: 120, speed: 3.9, turnRate: 0.025, cost: 8500 },
  ManOfWar: { name: "Imperial Man-of-War", hull: 460, sails: 65, cannons: 64, cargo: 320, maxCrew: 200, speed: 3.2, turnRate: 0.018, cost: 16000 }
};

const WORLD_PORTS = [
  { id: "port_royal", name: "Port Royal", x: 620, y: 780, faction: "Britain", type: "Citadel", prosperity: 88, produces: ["rum", "sugar"], consumes: ["timber", "grain", "spices"] },
  { id: "havana", name: "Havana", x: 420, y: 440, faction: "Spain", type: "Citadel", prosperity: 92, produces: ["tobacco", "gems"], consumes: ["iron", "grain", "rum"] },
  { id: "tortuga", name: "Tortuga", x: 940, y: 640, faction: "Pirate", type: "Haven", prosperity: 65, produces: ["rum", "iron"], consumes: ["silk", "spices", "grain"] },
  { id: "curacao", name: "Willemstad, Curaçao", x: 1120, y: 1320, faction: "Netherlands", type: "Trade Capital", prosperity: 95, produces: ["spices", "silk"], consumes: ["timber", "iron"] },
  { id: "martinique", name: "Fort-de-France, Martinique", x: 1540, y: 1040, faction: "France", type: "Colony", prosperity: 78, produces: ["sugar", "silk"], consumes: ["grain", "rum"] },
  { id: "nassau", name: "New Providence, Nassau", x: 680, y: 320, faction: "Pirate", type: "Haven", prosperity: 58, produces: ["rum", "timber"], consumes: ["spices", "silk", "iron"] },
  { id: "cartagena", name: "Cartagena de Indias", x: 740, y: 1460, faction: "Spain", type: "Citadel", prosperity: 90, produces: ["gems", "iron"], consumes: ["silk", "tobacco"] },
  { id: "barbados", name: "Bridgetown, Barbados", x: 1720, y: 1180, faction: "Britain", type: "Colony", prosperity: 84, produces: ["sugar", "rum"], consumes: ["grain", "timber"] },
  { id: "santo_domingo", name: "Santo Domingo", x: 1060, y: 740, faction: "Spain", type: "Colony", prosperity: 76, produces: ["tobacco", "grain"], consumes: ["iron", "spices"] },
  { id: "isla_de_muerte", name: "Isla de la Muerte", x: 2240, y: 880, faction: "Pirate", type: "Haven", prosperity: 45, produces: ["gems"], consumes: ["grain", "rum", "timber"] },
  { id: "sirens_reef", name: "The Siren's Reef", x: 1880, y: 1640, faction: "Tideborn Ruins", type: "Ruin", prosperity: 20, produces: ["gems"], consumes: ["grain"] },
  { id: "sunken_capital", name: "The Sunken Tideborn Citadel", x: 2840, y: 1980, faction: "Tideborn Ruins", type: "Ancient Capital", prosperity: 10, produces: [], consumes: [] }
];

const TIDEBORN_RELICS = [
  { id: 1, name: "The Astrolabe of Tides", location: "Hidden in Siren's Reef", found: false, desc: "Grants clairvoyance over currents and wind patterns." },
  { id: 2, name: "The Trident of Calamity", location: "Held by Ghost Captain Graves", found: false, desc: "Summons thunderous squalls against enemy warships." },
  { id: 3, name: "The Abyssal Pearl", location: "Sunken inside the Great Whirlpool", found: false, desc: "Doubles crew stamina and removes scurvy risks." },
  { id: 4, name: "The Leviathan Cipher", location: "Buried on Isla de la Muerte", found: false, desc: "Reveals secret deep-sea smuggler trenches." },
  { id: 5, name: "The Crown of the Endless Sea", location: "Locked in the Sunken Tideborn Citadel", found: false, desc: "Dominion artifact granting mastery over all Caribbean routes." }
];

/* ============================================================================
   2. SYNTHESIZED WEB AUDIO ENGINE (ZERO EXTERNAL ASSETS)
   ============================================================================ */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.ambientGain = null;
    this.initialized = false;
    this.masterVol = 0.7;
    this.sfxVol = 0.8;
    this.ambientVol = 0.5;
    this.ambientSource = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVol, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startAmbientOceanNoise();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  setVolumes(master, sfx, ambient) {
    this.masterVol = master;
    this.sfxVol = sfx;
    this.ambientVol = ambient;
    if (!this.initialized || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(master, this.ctx.currentTime, 0.05);
    this.sfxGain.gain.setTargetAtTime(sfx, this.ctx.currentTime, 0.05);
    this.ambientGain.gain.setTargetAtTime(ambient, this.ctx.currentTime, 0.05);
  }

  startAmbientOceanNoise() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // Subtle wave swell LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);

    whiteNoise.start(0);
    lfo.start(0);
    this.ambientSource = whiteNoise;
  }

  playCannon() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    // Boom noise burst
    const noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.9;
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(gain);
    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    noiseSource.start(now);
    osc.stop(now + 0.7);
    noiseSource.stop(now + 0.4);
  }

  playSwordClash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playCoins() {
    if (!this.ctx) return;
    const pitches = [1400, 1850, 2200];
    pitches.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.06);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  playFanfare() {
    if (!this.ctx) return;
    const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + (idx * 0.12);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }
}

/* ============================================================================
   3. GAME STATE CONTAINER
   ============================================================================ */

class GameState {
  constructor() {
    this.captain = {
      name: "Edward Vance",
      flagshipName: "The Sea Swallow",
      nationality: "Britain",
      career: "Merchant",
      mode: "Normal",
      gold: 600,
      bankVault: 0,
      bankDebt: 0,
      monopolies: 0,
      bribeActiveDays: 0,
      marque: false,
      date: new Date(1687, 2, 15) // March 15, 1687
    };

    this.ship = {
      type: "Sloop",
      name: "The Sea Swallow",
      hull: 80,
      maxHull: 80,
      sails: 100,
      cannons: 8,
      cargoCapacity: 50,
      maxCrew: 22,
      crew: 15,
      morale: 85,
      speedBonus: 1.0,
      cannonTier: 1,
      cargo: {
        grain: 10,
        rum: 4
      },
      contraband: {}
    };

    this.fleet = []; // Escort ships

    this.crewMembers = [
      { id: 1, name: "Sean 'Barnacle' Kelly", role: "Quartermaster", skill: 3, trait: "Veteran", loyalty: 88, wage: 4 },
      { id: 2, name: "Thaddeus Flint", role: "Gunner", skill: 4, trait: "Aggressive", loyalty: 75, wage: 5 },
      { id: 3, name: "Dr. Bartholomew", role: "Doctor", skill: 3, trait: "Lucky", loyalty: 90, wage: 6 }
    ];

    this.reputations = {
      Britain: 65,
      Spain: 45,
      France: 50,
      Netherlands: 55,
      Pirate: 30
    };

    this.world = {
      playerX: 630,
      playerY: 790,
      heading: 0, // radians
      targetHeading: 0,
      speedKnots: 0,
      anchored: true,
      currentPortId: "port_royal"
    };

    this.weather = {
      windDirection: Math.PI / 4, // 45 degrees NE
      windKnots: 14,
      condition: "Fair Sea Breeze"
    };

    this.acts = {
      currentAct: 1,
      actTitle: "Rise From Nothing",
      actDesc: "Establish steady trade, earn 2,000 gold, upgrade to a Brigantine, and uncover the first Tideborn relic clue."
    };

    this.relics = JSON.parse(JSON.stringify(TIDEBORN_RELICS));

    this.quests = [
      { id: "q1", title: "Cane & Rum Delivery", desc: "Transport 15 tons of Sugar to Tortuga.", rewardGold: 380, targetPort: "tortuga", complete: false },
      { id: "q2", title: "Bounty on Blackbeard's Runner", desc: "Hunt down the pirate raider lurking south of Nassau.", rewardGold: 750, complete: false }
    ];

    this.achievementsUnlocked = new Set();
    this.marketPriceFluctuation = {};
  }
}

/* ============================================================================
   4. WEATHER & TIME MANAGEMENT
   ============================================================================ */

class WeatherManager {
  constructor(state, audio) {
    this.state = state;
    this.audio = audio;
  }

  update() {
    // Wind gently drifts
    this.state.weather.windDirection += (Math.random() - 0.5) * 0.15;
    this.state.weather.windKnots = Math.max(4, Math.min(38, this.state.weather.windKnots + (Math.random() - 0.5) * 2));

    if (this.state.weather.windKnots > 30) {
      this.state.weather.condition = "Fierce Gale Swell";
    } else if (this.state.weather.windKnots > 18) {
      this.state.weather.condition = "Stiff Sea Breeze";
    } else {
      this.state.weather.condition = "Fair Sailing Breeze";
    }
  }
}

/* ============================================================================
   5. DYNAMIC ECONOMY & MARKET ENGINE
   ============================================================================ */

class EconomyManager {
  constructor(state) {
    this.state = state;
    this.initPortMarkets();
  }

  initPortMarkets() {
    WORLD_PORTS.forEach(port => {
      this.state.marketPriceFluctuation[port.id] = {};
      COMMODITIES.forEach(good => {
        let price = good.basePrice;
        if (port.produces.includes(good.id)) price = Math.round(price * 0.55);
        if (port.consumes.includes(good.id)) price = Math.round(price * 1.55);
        this.state.marketPriceFluctuation[port.id][good.id] = Math.max(4, price);
      });
    });
  }

  fluctuateMarket() {
    WORLD_PORTS.forEach(port => {
      COMMODITIES.forEach(good => {
        const current = this.state.marketPriceFluctuation[port.id][good.id] || good.basePrice;
        const drift = (Math.random() - 0.5) * 4;
        let nextPrice = Math.round(current + drift);
        if (port.produces.includes(good.id)) {
          nextPrice = Math.max(Math.round(good.basePrice * 0.4), Math.min(Math.round(good.basePrice * 0.85), nextPrice));
        } else if (port.consumes.includes(good.id)) {
          nextPrice = Math.max(Math.round(good.basePrice * 1.25), Math.min(Math.round(good.basePrice * 2.5), nextPrice));
        } else {
          nextPrice = Math.max(Math.round(good.basePrice * 0.7), Math.min(Math.round(good.basePrice * 1.4), nextPrice));
        }
        this.state.marketPriceFluctuation[port.id][good.id] = nextPrice;
      });
    });
  }

  getPrice(portId, goodId) {
    return this.state.marketPriceFluctuation[portId]?.[goodId] || 20;
  }

  getContrabandPrice(portId, item) {
    const port = WORLD_PORTS.find(p => p.id === portId);
    let mult = port && port.faction === "Pirate" ? 1.4 : 2.8;
    return Math.round(item.basePrice * mult);
  }

  calculateCargoWeight(ship) {
    let weight = 0;
    for (const [id, qty] of Object.entries(ship.cargo)) {
      const g = COMMODITIES.find(c => c.id === id);
      if (g) weight += qty * g.weight;
    }
    for (const [id, qty] of Object.entries(ship.contraband)) {
      const c = CONTRABAND.find(item => item.id === id);
      if (c) weight += qty * c.weight;
    }
    return weight;
  }
}

/* ============================================================================
   6. 500 ACHIEVEMENTS ENGINE
   ============================================================================ */

class AchievementManager {
  constructor(state, audio, ui) {
    this.state = state;
    this.audio = audio;
    this.ui = ui;
    this.definitions = this.generateAchievementsList();
  }

  generateAchievementsList() {
    const list = [];
    const tiers = ["Bronze", "Silver", "Gold", "Platinum", "Legendary"];
    let id = 1;

    // 100 Gold Accumulation achievements
    for (let i = 1; i <= 100; i++) {
      const threshold = i * 250;
      const tier = tiers[Math.min(4, Math.floor(i / 21))];
      list.push({
        id: `gold_${i}`,
        num: id++,
        name: `Coffers of Midas #${i}`,
        desc: `Accumulate a treasury of at least ${threshold.toLocaleString()} gold doubloons.`,
        tier: tier,
        check: s => s.captain.gold + s.captain.bankVault >= threshold
      });
    }

    // 100 Naval Victorious achievements
    for (let i = 1; i <= 100; i++) {
      const tier = tiers[Math.min(4, Math.floor(i / 21))];
      list.push({
        id: `victories_${i}`,
        num: id++,
        name: `Bane of the High Seas #${i}`,
        desc: `Win ${i * 2} naval skirmishes or boarding duels.`,
        tier: tier,
        check: (s, stat) => (stat?.combatVictories || 0) >= i * 2
      });
    }

    // 100 Trading & Cargo achievements
    for (let i = 1; i <= 100; i++) {
      const tons = i * 15;
      const tier = tiers[Math.min(4, Math.floor(i / 21))];
      list.push({
        id: `cargo_${i}`,
        num: id++,
        name: `Merchant Monarch #${i}`,
        desc: `Trade ${tons} tons of cargo across Caribbean markets.`,
        tier: tier,
        check: (s, stat) => (stat?.cargoTraded || 0) >= tons
      });
    }

    // 100 Distance & Exploration achievements
    for (let i = 1; i <= 100; i++) {
      const miles = i * 40;
      const tier = tiers[Math.min(4, Math.floor(i / 21))];
      list.push({
        id: `explore_${i}`,
        num: id++,
        name: `Pathfinder of the Deep #${i}`,
        desc: `Sail over ${miles} nautical leagues under full canvas.`,
        tier: tier,
        check: (s, stat) => (stat?.leaguesSailed || 0) >= miles
      });
    }

    // 100 Legend & Relic achievements
    for (let i = 1; i <= 100; i++) {
      const tier = tiers[Math.min(4, Math.floor(i / 21))];
      list.push({
        id: `relic_${i}`,
        num: id++,
        name: `Tideborn Sovereign #${i}`,
        desc: `Unearth relics and complete act step #${i}.`,
        tier: tier,
        check: (s, stat) => (stat?.relicPoints || 0) >= i
      });
    }

    return list;
  }

  evaluate(stats) {
    let newlyUnlocked = 0;
    this.definitions.forEach(ach => {
      if (!this.state.achievementsUnlocked.has(ach.id)) {
        if (ach.check(this.state, stats)) {
          this.state.achievementsUnlocked.add(ach.id);
          newlyUnlocked++;
          this.ui.showToast(`🏆 Achievement Unlocked: ${ach.name}!`, "gold");
          this.audio.playFanfare();
        }
      }
    });
    if (newlyUnlocked > 0) {
      this.ui.renderAchievements(this.definitions);
    }
  }
}

/* ============================================================================
   7. BOARDING DUEL SYSTEM (TIMING, STAMINA & COMBOS)
   ============================================================================ */

class DuelManager {
  constructor(state, audio, ui, onDuelComplete) {
    this.state = state;
    this.audio = audio;
    this.ui = ui;
    this.onDuelComplete = onDuelComplete;
    this.active = false;

    this.player = { hp: 100, maxHp: 100, stamina: 100, maxStamina: 100, pistolAmmo: 2, guard: false, riposteReady: false };
    this.enemy = { name: "Captain Blood", hp: 110, maxHp: 110, stamina: 80, maxStamina: 80, stance: "aggressive" };
  }

  start(enemyName, enemyHp) {
    this.active = true;
    this.player.hp = 100;
    this.player.stamina = 100;
    this.player.pistolAmmo = 2;
    this.player.guard = false;
    this.player.riposteReady = false;

    this.enemy.name = enemyName || "Captain Ramirez";
    this.enemy.hp = enemyHp || 115;
    this.enemy.maxHp = this.enemy.hp;
    this.enemy.stamina = 80;
    this.enemy.stance = "aggressive";

    this.ui.setupDuelScreen(this.player, this.enemy);
  }

  playerAction(actionType) {
    if (!this.active) return;
    let logMsg = "";

    switch (actionType) {
      case "slash":
        if (this.player.stamina < 15) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 15;
        let dmg = 18 + Math.floor(Math.random() * 8);
        if (this.player.riposteReady) {
          dmg *= 2;
          this.player.riposteReady = false;
          logMsg += "<strong>Critical Riposte Strike!</strong> ";
        }
        this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
        this.audio.playSwordClash();
        logMsg += `You deliver a swift slash for ${dmg} damage!`;
        break;

      case "heavy":
        if (this.player.stamina < 35) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 35;
        let hDmg = 34 + Math.floor(Math.random() * 12);
        this.enemy.hp = Math.max(0, this.enemy.hp - hDmg);
        this.audio.playSwordClash();
        logMsg += `You unleash a crushing broadsword cleave for ${hDmg} damage!`;
        break;

      case "thrust":
        if (this.player.stamina < 25) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 25;
        let tDmg = 24 + Math.floor(Math.random() * 6);
        this.enemy.hp = Math.max(0, this.enemy.hp - tDmg);
        this.audio.playSwordClash();
        logMsg += `A lunging rapier thrust pierces armor for ${tDmg} damage!`;
        break;

      case "parry":
        if (this.player.stamina < 20) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 20;
        this.player.guard = true;
        this.player.riposteReady = true;
        logMsg += "You raise your steel in defensive guard, preparing a riposte!";
        break;

      case "dodge":
        if (this.player.stamina < 20) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 20;
        this.player.guard = true;
        logMsg += "You roll aside across the ship deck planks!";
        break;

      case "pistol":
        if (this.player.pistolAmmo <= 0) return this.ui.showToast("No Flintlock Ammo!", "crimson");
        this.player.pistolAmmo--;
        let pDmg = 45;
        this.enemy.hp = Math.max(0, this.enemy.hp - pDmg);
        this.audio.playCannon();
        logMsg += `BANG! Flintlock shot blasts the enemy captain for ${pDmg} unblockable damage!`;
        break;

      case "dirty":
        if (this.player.stamina < 15) return this.ui.showToast("Out of Stamina!", "crimson");
        this.player.stamina -= 15;
        this.enemy.stamina = Math.max(0, this.enemy.stamina - 40);
        logMsg += "You fling sea salt and sand into the enemy's eyes, breaking their tempo!";
        break;

      case "rest":
        this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 45);
        logMsg += "You step back and steady your breath, regaining stamina.";
        break;
    }

    // Check Enemy Defeat
    if (this.enemy.hp <= 0) {
      this.active = false;
      this.ui.updateDuelUI(this.player, this.enemy, logMsg + " <strong>Enemy captain defeated!</strong>");
      this.audio.playFanfare();
      setTimeout(() => this.onDuelComplete(true), 1200);
      return;
    }

    // Enemy Turn AI
    this.enemyTurn(logMsg);
  }

  enemyTurn(playerLog) {
    const actions = ["slash", "heavy", "thrust", "rest"];
    const choice = this.enemy.stamina < 20 ? "rest" : actions[Math.floor(Math.random() * actions.length)];
    let enemyMsg = "";

    if (choice === "rest") {
      this.enemy.stamina = Math.min(this.enemy.maxStamina, this.enemy.stamina + 35);
      enemyMsg = `${this.enemy.name} circles warily, recovering composure.`;
    } else {
      let dmg = choice === "heavy" ? 28 : choice === "thrust" ? 20 : 14;
      this.enemy.stamina -= 20;

      if (this.player.guard) {
        dmg = Math.round(dmg * 0.2);
        this.player.guard = false;
        enemyMsg = `You parried ${this.enemy.name}'s attack, taking only ${dmg} glance damage!`;
        this.audio.playSwordClash();
      } else {
        this.player.hp = Math.max(0, this.player.hp - dmg);
        this.audio.playSwordClash();
        enemyMsg = `${this.enemy.name} strikes with ${choice} for ${dmg} damage!`;
      }
    }

    // Stamina trickle recovery
    this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 10);

    const fullLog = `${playerLog}<br>${enemyMsg}`;
    this.ui.updateDuelUI(this.player, this.enemy, fullLog);

    if (this.player.hp <= 0) {
      this.active = false;
      this.ui.showToast("You were struck down in duel!", "crimson");
      setTimeout(() => this.onDuelComplete(false), 1400);
    }
  }
}

/* ============================================================================
   8. REAL-TIME NAVAL COMBAT CANVAS ENGINE
   ============================================================================ */

class CombatManager {
  constructor(canvas, state, audio, ui, onCombatEnd) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.state = state;
    this.audio = audio;
    this.ui = ui;
    this.onCombatEnd = onCombatEnd;
    this.active = false;

    this.player = null;
    this.enemy = null;
    this.cannonballs = [];
    this.selectedShot = "round";
  }

  startBattle(enemyShipType = "Brigantine", enemyName = "Spanish Privateer") {
    this.active = true;
    const baseEnemy = SHIP_TYPES[enemyShipType] || SHIP_TYPES.Brigantine;

    this.player = {
      x: 180,
      y: 260,
      angle: 0,
      hull: this.state.ship.hull,
      maxHull: this.state.ship.maxHull,
      sails: this.state.ship.sails,
      crew: this.state.ship.crew,
      cannons: this.state.ship.cannons,
      reloadLeft: 0,
      reloadRight: 0
    };

    this.enemy = {
      name: enemyName,
      type: enemyShipType,
      x: 520,
      y: 260,
      angle: Math.PI,
      hull: baseEnemy.hull,
      maxHull: baseEnemy.hull,
      sails: 100,
      crew: baseEnemy.maxCrew,
      cannons: baseEnemy.cannons,
      reloadTimer: 60
    };

    this.cannonballs = [];
    this.resizeCanvas();
    this.ui.updateNavalCombatUI(this.player, this.enemy, 340);
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth || 800;
    this.canvas.height = this.canvas.clientHeight || 500;
  }

  fireBroadside(side) {
    if (!this.active) return;
    const isPort = side === "left";
    const reload = isPort ? this.player.reloadLeft : this.player.reloadRight;
    if (reload > 0) {
      this.ui.showToast("Cannons still swabbing and reloading!", "crimson");
      return;
    }

    if (isPort) this.player.reloadLeft = 90;
    else this.player.reloadRight = 90;

    this.audio.playCannon();

    // Spawn salvo
    const fireAngle = this.player.angle + (isPort ? -Math.PI / 2 : Math.PI / 2);
    const count = Math.max(3, Math.floor(this.player.cannons / 2));

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.22;
      this.cannonballs.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(fireAngle + spread) * 7.5,
        vy: Math.sin(fireAngle + spread) * 7.5,
        life: 55,
        isPlayer: true,
        type: this.selectedShot
      });
    }

    this.ui.showToast(`Broadside fired with ${this.selectedShot.toUpperCase()} shot!`, "gold");
  }

  updateAndRender() {
    if (!this.active) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Water & Waves
    ctx.fillStyle = "#10253f";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // AI movement & Broadside decision
    const dx = this.player.x - this.enemy.x;
    const dy = this.player.y - this.enemy.y;
    const dist = Math.hypot(dx, dy);

    this.enemy.angle += 0.015;
    this.enemy.x += Math.cos(this.enemy.angle) * 1.5;
    this.enemy.y += Math.sin(this.enemy.angle) * 1.5;

    // Enemy auto fire
    if (this.enemy.reloadTimer-- <= 0 && dist < 320) {
      this.enemy.reloadTimer = 110;
      this.audio.playCannon();
      const fireAng = Math.atan2(dy, dx);
      for (let i = 0; i < 4; i++) {
        const spread = (Math.random() - 0.5) * 0.25;
        this.cannonballs.push({
          x: this.enemy.x,
          y: this.enemy.y,
          vx: Math.cos(fireAng + spread) * 6.5,
          vy: Math.sin(fireAng + spread) * 6.5,
          life: 60,
          isPlayer: false,
          type: "round"
        });
      }
    }

    // Cooldown ticks
    if (this.player.reloadLeft > 0) this.player.reloadLeft--;
    if (this.player.reloadRight > 0) this.player.reloadRight--;

    // Update Cannonballs
    for (let i = this.cannonballs.length - 1; i >= 0; i--) {
      const b = this.cannonballs[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life--;

      // Hit detection
      const target = b.isPlayer ? this.enemy : this.player;
      if (Math.hypot(b.x - target.x, b.y - target.y) < 28) {
        b.life = 0;
        this.applyShotDamage(target, b.type);
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.type === "fire" ? 4.5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = b.type === "fire" ? "#e74c3c" : "#2c3e50";
      ctx.fill();

      if (b.life <= 0) this.cannonballs.splice(i, 1);
    }

    // Draw Ships
    this.drawShip(ctx, this.player.x, this.player.y, this.player.angle, "#3498db", "Flagship");
    this.drawShip(ctx, this.enemy.x, this.enemy.y, this.enemy.angle, "#e74c3c", this.enemy.name);

    // Update UI Elements
    this.ui.updateNavalCombatUI(this.player, this.enemy, Math.round(dist));

    // End conditions
    if (this.enemy.hull <= 0) {
      this.active = false;
      this.audio.playFanfare();
      this.onCombatEnd("sunk", this.enemy);
    } else if (this.player.hull <= 0) {
      this.active = false;
      this.onCombatEnd("defeated", this.enemy);
    }
  }

  applyShotDamage(target, shotType) {
    if (shotType === "round") target.hull = Math.max(0, target.hull - 18);
    else if (shotType === "chain") target.sails = Math.max(10, target.sails - 25);
    else if (shotType === "grape") target.crew = Math.max(0, target.crew - 6);
    else if (shotType === "fire") {
      target.hull = Math.max(0, target.hull - 12);
      target.sails = Math.max(15, target.sails - 15);
    }
  }

  drawShip(ctx, x, y, angle, color, label) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Hull polygon
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(24, 0);
    ctx.lineTo(-18, -10);
    ctx.lineTo(-24, 0);
    ctx.lineTo(-18, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sails
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(-6, -14, 4, 28);
    ctx.fillRect(8, -12, 3, 24);

    ctx.restore();

    ctx.fillStyle = "#f5eedb";
    ctx.font = "11px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 22);
  }
}

/* ============================================================================
   9. WORLD MAP & OPEN OCEAN SAILING ENGINE
   ============================================================================ */

class WorldManager {
  constructor(canvas, state, audio, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.state = state;
    this.audio = audio;
    this.ui = ui;
    this.isChartOverview = false;

    this.islands = [
      { x: 300, y: 350, r: 85, name: "Cuba Archipelago" },
      { x: 800, y: 700, r: 110, name: "Hispaniola Wilds" },
      { x: 1400, y: 950, r: 60, name: "Leeward Cays" },
      { x: 2100, y: 1550, r: 90, name: "Forbidden Shallows" }
    ];
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth || window.innerWidth;
    this.canvas.height = this.canvas.clientHeight || window.innerHeight;
  }

  turnPort() {
    this.state.world.heading -= 0.08;
  }

  turnStarboard() {
    this.state.world.heading += 0.08;
  }

  sailUp() {
    this.state.world.anchored = false;
    this.state.world.speedKnots = Math.min(14, this.state.world.speedKnots + 2.5);
  }

  sailDown() {
    this.state.world.speedKnots = Math.max(0, this.state.world.speedKnots - 2.5);
    if (this.state.world.speedKnots === 0) this.state.world.anchored = true;
  }

  anchor() {
    this.state.world.anchored = true;
    this.state.world.speedKnots = 0;
  }

  update(dt, stats) {
    const w = this.state.world;
    if (!w.anchored && w.speedKnots > 0) {
      w.playerX += Math.cos(w.heading) * (w.speedKnots * 0.35);
      w.playerY += Math.sin(w.heading) * (w.speedKnots * 0.35);

      // World boundaries clamp
      w.playerX = Math.max(50, Math.min(GAME_CONFIG.WORLD_WIDTH - 50, w.playerX));
      w.playerY = Math.max(50, Math.min(GAME_CONFIG.WORLD_HEIGHT - 50, w.playerY));

      stats.leaguesSailed = (stats.leaguesSailed || 0) + (w.speedKnots * 0.02);
    }

    // Check proximity to ports
    let closestPort = null;
    let closestDist = 9999;
    WORLD_PORTS.forEach(port => {
      const d = Math.hypot(w.playerX - port.x, w.playerY - port.y);
      if (d < closestDist) {
        closestDist = d;
        closestPort = port;
      }
    });

    if (closestDist < 75) {
      this.ui.showProximityPrompt(closestPort);
    } else {
      this.ui.hideProximityPrompt();
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.state.world;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Camera center on player ship
    ctx.translate(this.canvas.width / 2 - w.playerX, this.canvas.height / 2 - w.playerY);

    // Deep ocean base
    ctx.fillStyle = "#0c1b2c";
    ctx.fillRect(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);

    // Grid coordinates
    ctx.strokeStyle = "rgba(40, 70, 105, 0.3)";
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_CONFIG.WORLD_WIDTH; x += 200) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_CONFIG.WORLD_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < GAME_CONFIG.WORLD_HEIGHT; y += 200) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_CONFIG.WORLD_WIDTH, y);
      ctx.stroke();
    }

    // Islands
    this.islands.forEach(isl => {
      ctx.fillStyle = "#274a2b";
      ctx.beginPath();
      ctx.arc(isl.x, isl.y, isl.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#c2b280";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#f5eedb";
      ctx.font = "italic 13px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(isl.name, isl.x, isl.y - isl.r - 8);
    });

    // Ports
    WORLD_PORTS.forEach(port => {
      ctx.fillStyle = port.faction === "Pirate" ? "#e74c3c" : port.faction === "Britain" ? "#3498db" : "#f1c40f";
      ctx.beginPath();
      ctx.arc(port.x, port.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(port.name, port.x, port.y + 26);
    });

    // Player Ship
    ctx.save();
    ctx.translate(w.playerX, w.playerY);
    ctx.rotate(w.heading);

    // Ship Hull
    ctx.fillStyle = "#8b5a2b";
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -8);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-14, 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sails
    ctx.fillStyle = "#fdfbf7";
    ctx.fillRect(-4, -12, 3, 24);
    ctx.fillRect(6, -10, 2.5, 20);

    ctx.restore();
    ctx.restore();
  }
}

/* ============================================================================
   10. USER INTERFACE ARCHITECTURE & EVENT COORDINATOR
   ============================================================================ */

class UIManager {
  constructor(state, audio) {
    this.state = state;
    this.audio = audio;

    this.currentView = "viewMainMenu";
    this.activeModal = null;
    this.cachedElements = {};
  }

  getEl(id) {
    if (!this.cachedElements[id]) {
      this.cachedElements[id] = document.getElementById(id);
    }
    return this.cachedElements[id];
  }

  showToast(message, type = "gold") {
    const container = this.getEl("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast-msg toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  switchView(viewId) {
    document.querySelectorAll(".view-panel").forEach(p => {
      p.classList.remove("active-view");
      p.classList.add("hidden");
    });
    const target = this.getEl(viewId);
    if (target) {
      target.classList.remove("hidden");
      target.classList.add("active-view");
      this.currentView = viewId;
    }

    const header = this.getEl("gameHeader");
    if (header) {
      if (viewId === "viewMainMenu" || viewId === "viewNewGame") {
        header.classList.add("hidden");
      } else {
        header.classList.remove("hidden");
      }
    }
  }

  openModal(modalId) {
    this.closeActiveModal();
    const modal = this.getEl(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      this.activeModal = modalId;
    }
  }

  closeActiveModal() {
    if (this.activeModal) {
      const modal = this.getEl(this.activeModal);
      if (modal) modal.classList.add("hidden");
      this.activeModal = null;
    }
  }

  updateHUD() {
    const s = this.state;
    const ship = s.ship;
    const captain = s.captain;

    this.setText("hudPlayerName", captain.name);
    this.setText("hudCareerBadge", captain.career);
    this.setText("hudGoldCount", captain.gold.toLocaleString());
    this.setText("hudCurrentLocation", s.world.currentPortId ? WORLD_PORTS.find(p => p.id === s.world.currentPortId)?.name || "High Seas" : "Open Ocean");
    this.setText("hudCurrentDate", captain.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));

    const hullPct = Math.round((ship.hull / ship.maxHull) * 100);
    this.setText("hudHullValue", `${hullPct}%`);
    const hullBar = this.getEl("hudHullBar");
    if (hullBar) hullBar.style.width = `${hullPct}%`;

    this.setText("hudCrewCount", `${ship.crew}/${ship.maxCrew}`);
    const moraleBar = this.getEl("hudMoraleBar");
    if (moraleBar) moraleBar.style.width = `${ship.morale}%`;

    let weight = 0;
    for (const [_, q] of Object.entries(ship.cargo)) weight += q;
    for (const [_, q] of Object.entries(ship.contraband)) weight += q;
    this.setText("hudCargoCapacity", `${weight}/${ship.cargoCapacity} t`);

    // Wind Compass needle angle
    const needle = this.getEl("hudWindCompass");
    if (needle) {
      const deg = (s.weather.windDirection * 180) / Math.PI;
      needle.style.transform = `rotate(${deg}deg)`;
    }
    this.setText("hudWindKnots", `${Math.round(s.weather.windKnots)} kts`);
  }

  setText(id, val) {
    const el = this.getEl(id);
    if (el) el.textContent = val;
  }

  showProximityPrompt(port) {
    const prompt = this.getEl("seaProximityPrompt");
    if (!prompt) return;
    this.setText("proximityTargetName", port.name);
    this.setText("proximityTargetDesc", `${port.faction} Citadel • ${port.type}`);
    prompt.classList.remove("hidden");
  }

  hideProximityPrompt() {
    const prompt = this.getEl("seaProximityPrompt");
    if (prompt) prompt.classList.add("hidden");
  }

  setupDuelScreen(player, enemy) {
    this.switchView("viewDuel");
    this.setText("duelPlayerName", this.state.captain.name);
    this.setText("duelEnemyName", enemy.name);
    this.updateDuelUI(player, enemy, "The duel commences! Choose your maneuver carefully.");
  }

  updateDuelUI(player, enemy, logText) {
    this.setText("duelPlayerHpVal", player.hp);
    this.setText("duelPlayerStaminaVal", player.stamina);
    this.setText("duelEnemyHpVal", enemy.hp);
    this.setText("duelEnemyStaminaVal", enemy.stamina);

    const pHpBar = this.getEl("duelPlayerHpBar");
    if (pHpBar) pHpBar.style.width = `${Math.max(0, player.hp)}%`;

    const pStaBar = this.getEl("duelPlayerStaminaBar");
    if (pStaBar) pStaBar.style.width = `${Math.max(0, player.stamina)}%`;

    const eHpBar = this.getEl("duelEnemyHpBar");
    if (eHpBar) eHpBar.style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;

    const logBox = this.getEl("duelCombatLog");
    if (logBox && logText) {
      logBox.innerHTML = `<p>${logText}</p>`;
      logBox.scrollTop = logBox.scrollHeight;
    }
  }

  updateNavalCombatUI(player, enemy, dist) {
    this.setText("combatPlayerShipName", this.state.ship.name);
    this.setText("combatEnemyShipName", enemy.name);
    this.setText("combatDistanceValue", `${dist} yds`);

    const pHullPct = Math.round((player.hull / player.maxHull) * 100);
    const eHullPct = Math.round((enemy.hull / enemy.maxHull) * 100);

    const pHullBar = this.getEl("combatPlayerHullBar");
    if (pHullBar) pHullBar.style.width = `${pHullPct}%`;
    const eHullBar = this.getEl("combatEnemyHullBar");
    if (eHullBar) eHullBar.style.width = `${eHullPct}%`;

    this.setText("combatPlayerHullText", `${player.hull}/${player.maxHull}`);
    this.setText("combatEnemyHullText", `${enemy.hull}/${enemy.maxHull}`);

    const boardBtn = this.getEl("btnCombatBoardShip");
    if (boardBtn) boardBtn.disabled = dist > 90;
  }

  renderPortMarket(economy, currentPortId) {
    const tbody = this.getEl("marketTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    COMMODITIES.forEach(c => {
      const price = economy.getPrice(currentPortId, c.id);
      const inHold = this.state.ship.cargo[c.id] || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>Class ${c.luxury}</td>
        <td>${120 - inHold} t</td>
        <td><strong style="color: #997819;">${price} Gold</strong></td>
        <td>${inHold} t</td>
        <td>${price} G</td>
        <td>
          <button class="btn btn-gold btn-sm" data-action="buy" data-good="${c.id}">Buy</button>
          <button class="btn btn-outline btn-sm" data-action="sell" data-good="${c.id}" ${inHold <= 0 ? "disabled" : ""}>Sell</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderAchievements(definitions) {
    const container = this.getEl("achievementsGridContainer");
    if (!container) return;
    container.innerHTML = "";

    const unlocked = this.state.achievementsUnlocked;
    this.setText("achieveUnlockedCount", unlocked.size);
    const pct = Math.round((unlocked.size / 500) * 100);
    this.setText("achievePercent", `${pct}%`);

    definitions.slice(0, 120).forEach(ach => {
      const isDone = unlocked.has(ach.id);
      const card = document.createElement("div");
      card.className = `achieve-card ${isDone ? "unlocked" : "locked"}`;
      card.innerHTML = `
        <div class="achieve-icon">${isDone ? "🏆" : "🔒"}</div>
        <div class="achieve-meta">
          <h5>${ach.name} <small>(${ach.tier})</small></h5>
          <p>${ach.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

/* ============================================================================
   11. SAVE, LOAD & PWA PERSISTENCE ENGINE
   ============================================================================ */

class SaveManager {
  constructor(state, ui, audio) {
    this.state = state;
    this.ui = ui;
    this.audio = audio;
  }

  save() {
    try {
      const payload = JSON.stringify({
        captain: this.state.captain,
        ship: this.state.ship,
        fleet: this.state.fleet,
        crewMembers: this.state.crewMembers,
        reputations: this.state.reputations,
        world: this.state.world,
        acts: this.state.acts,
        relics: this.state.relics,
        quests: this.state.quests,
        achievements: Array.from(this.state.achievementsUnlocked),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(GAME_CONFIG.SAVE_KEY, payload);
      this.ui.showToast("💾 Voyage Logbook successfully saved!", "gold");
      this.ui.setText("saveTimestampLabel", `Last saved: ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      this.ui.showToast("Failed to save to local storage", "crimson");
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
      if (!raw) {
        this.ui.showToast("No saved voyage records found.", "crimson");
        return false;
      }
      const data = JSON.parse(raw);
      Object.assign(this.state.captain, data.captain);
      this.state.captain.date = new Date(data.captain.date);
      Object.assign(this.state.ship, data.ship);
      this.state.fleet = data.fleet || [];
      this.state.crewMembers = data.crewMembers || [];
      Object.assign(this.state.reputations, data.reputations);
      Object.assign(this.state.world, data.world);
      Object.assign(this.state.acts, data.acts);
      this.state.relics = data.relics || this.state.relics;
      this.state.quests = data.quests || [];
      this.state.achievementsUnlocked = new Set(data.achievements || []);

      this.ui.showToast("📂 Saved voyage resumed!", "gold");
      this.ui.updateHUD();
      return true;
    } catch (e) {
      this.ui.showToast("Corrupted voyage save data.", "crimson");
      return false;
    }
  }

  exportSave() {
    const raw = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
    if (!raw) return this.ui.showToast("Save your voyage first!", "crimson");
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Pirates_Traders_Save_${this.state.captain.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.ui.showToast("Voyage exported to JSON file.", "gold");
  }

  importSave(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        localStorage.setItem(GAME_CONFIG.SAVE_KEY, JSON.stringify(parsed));
        this.load();
        this.ui.showToast("Save file successfully imported!", "gold");
      } catch (err) {
        this.ui.showToast("Invalid JSON save file format.", "crimson");
      }
    };
    reader.readAsText(file);
  }
}

/* ============================================================================
   12. PWA SERVICE WORKER & OFFLINE INSTALLER
   ============================================================================ */

class PWAInstaller {
  constructor(ui) {
    this.ui = ui;
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
          .then(() => console.log("PWA Service Worker registered offline."))
          .catch(err => console.warn("SW Registration Failed", err));
      });
    }

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      this.deferredPrompt = e;
      const banner = document.getElementById("pwaInstallBanner");
      if (banner) banner.classList.remove("hidden");
    });

    const installBtn = document.getElementById("pwaInstallBtn");
    if (installBtn) {
      installBtn.addEventListener("click", () => {
        if (!this.deferredPrompt) return;
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
          const banner = document.getElementById("pwaInstallBanner");
          if (banner) banner.classList.add("hidden");
        });
      });
    }

    const dismissBtn = document.getElementById("pwaDismissBtn");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        const banner = document.getElementById("pwaInstallBanner");
        if (banner) banner.classList.add("hidden");
      });
    }
  }
}

/* ============================================================================
   13. MASTER GAME ENGINE ORCHESTRATOR
   ============================================================================ */

class GameEngine {
  constructor() {
    this.state = new GameState();
    this.audio = new AudioManager();
    this.ui = new UIManager(this.state, this.audio);
    this.weather = new WeatherManager(this.state, this.audio);
    this.economy = new EconomyManager(this.state);
    this.achievements = new AchievementManager(this.state, this.audio, this.ui);
    this.saveManager = new SaveManager(this.state, this.ui, this.audio);
    this.pwa = new PWAInstaller(this.ui);

    this.stats = { leaguesSailed: 0, cargoTraded: 0, combatVictories: 0, relicPoints: 0 };
    this.lastTickTime = performance.now();
    this.dayTicker = 0;

    this.worldCanvas = document.getElementById("worldCanvas");
    this.combatCanvas = document.getElementById("combatCanvas");

    this.worldManager = new WorldManager(this.worldCanvas, this.state, this.audio, this.ui);
    this.combatManager = new CombatManager(this.combatCanvas, this.state, this.audio, this.ui, (outcome, enemy) => this.handleCombatOutcome(outcome, enemy));
    this.duelManager = new DuelManager(this.state, this.audio, this.ui, win => this.handleDuelOutcome(win));

    this.bindEvents();
    this.checkExistingSave();
  }

  checkExistingSave() {
    const raw = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
    const continueBtn = document.getElementById("btnMenuContinue");
    const summary = document.getElementById("saveSummaryInfo");
    if (raw && continueBtn) {
      continueBtn.disabled = false;
      try {
        const data = JSON.parse(raw);
        if (summary) summary.textContent = `Active voyage: Captain ${data.captain.name} (${data.captain.gold} gold)`;
      } catch (e) {}
    }
  }

  bindEvents() {
    // Initial Audio unlock overlay
    const enterBtn = document.getElementById("enterGameBtn");
    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        this.audio.init();
        document.getElementById("audioUnlockOverlay").classList.add("hidden");
      });
    }

    // Main Menu Buttons
    document.getElementById("btnMenuNewGame")?.addEventListener("click", () => this.ui.switchView("viewNewGame"));
    document.getElementById("btnCancelNewGame")?.addEventListener("click", () => this.ui.switchView("viewMainMenu"));
    document.getElementById("btnMenuContinue")?.addEventListener("click", () => {
      if (this.saveManager.load()) {
        this.ui.switchView(this.state.world.currentPortId ? "viewPort" : "viewWorldMap");
      }
    });

    document.getElementById("btnMenuSaveLoad")?.addEventListener("click", () => this.ui.openModal("viewSettingsModal"));
    document.getElementById("btnMenuAchievements")?.addEventListener("click", () => {
      this.ui.renderAchievements(this.achievements.definitions);
      this.ui.openModal("viewAchievementsModal");
    });
    document.getElementById("btnMenuSettings")?.addEventListener("click", () => this.ui.openModal("viewSettingsModal"));
    document.getElementById("btnMenuCredits")?.addEventListener("click", () => this.ui.openModal("viewSettingsModal"));

    // Launch New Game
    document.getElementById("btnLaunchNewGame")?.addEventListener("click", () => {
      const name = document.getElementById("charNameInput")?.value.trim() || "Edward Vance";
      const shipName = document.getElementById("charFlagshipInput")?.value.trim() || "The Sea Swallow";
      const faction = document.querySelector('input[name="startingFaction"]:checked')?.value || "Britain";
      const career = document.querySelector('input[name="charCareer"]:checked')?.value || "Merchant";
      const mode = document.getElementById("gameModeSelect")?.value || "Normal";

      this.state.captain.name = name;
      this.state.captain.flagshipName = shipName;
      this.state.ship.name = shipName;
      this.state.captain.nationality = faction;
      this.state.captain.career = career;
      this.state.captain.mode = mode;

      this.ui.showToast(`Articles signed! Fair winds, Captain ${name}!`, "gold");
      this.saveManager.save();
      this.enterPort("port_royal");
    });

    // Sailing Virtual Helm Controls
    document.getElementById("btnHelmPort")?.addEventListener("click", () => this.worldManager.turnPort());
    document.getElementById("btnHelmStarboard")?.addEventListener("click", () => this.worldManager.turnStarboard());
    document.getElementById("btnHelmSailUp")?.addEventListener("click", () => this.worldManager.sailUp());
    document.getElementById("btnHelmSailDown")?.addEventListener("click", () => this.worldManager.sailDown());
    document.getElementById("btnHelmAnchor")?.addEventListener("click", () => this.worldManager.anchor());

    // Proximity Action Drop Anchor into Port
    document.getElementById("btnProximityAction")?.addEventListener("click", () => {
      const portId = this.state.world.currentPortId || "port_royal";
      this.enterPort(portId);
    });

    // Depart Port to High Seas
    document.getElementById("btnDepartPort")?.addEventListener("click", () => {
      this.state.world.currentPortId = null;
      this.state.world.anchored = false;
      this.state.world.speedKnots = 4;
      this.ui.switchView("viewWorldMap");
      this.ui.showToast("Weigh anchor! Sailing for open water.", "gold");
      this.worldManager.resize();
    });

    // Port District Tabs
    document.querySelectorAll(".port-tab").forEach(tab => {
      tab.addEventListener("click", e => {
        document.querySelectorAll(".port-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".port-district-pane").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const dist = tab.dataset.district;
        const pane = document.getElementById(`district${dist.charAt(0).toUpperCase() + dist.slice(1)}`);
        if (pane) pane.classList.add("active");
      });
    });

    // Commodity Market Transactions
    document.getElementById("marketTableBody")?.addEventListener("click", e => {
      const target = e.target;
      const goodId = target.dataset.good;
      const action = target.dataset.action;
      if (!goodId || !action) return;

      const price = this.economy.getPrice(this.state.world.currentPortId, goodId);
      if (action === "buy") {
        if (this.state.captain.gold < price) return this.ui.showToast("Not enough doubloons!", "crimson");
        const currentWeight = this.economy.calculateCargoWeight(this.state.ship);
        if (currentWeight >= this.state.ship.cargoCapacity) return this.ui.showToast("Hold is completely full!", "crimson");

        this.state.captain.gold -= price;
        this.state.ship.cargo[goodId] = (this.state.ship.cargo[goodId] || 0) + 1;
        this.stats.cargoTraded = (this.stats.cargoTraded || 0) + 1;
        this.audio.playCoins();
        this.ui.updateHUD();
        this.ui.renderPortMarket(this.economy, this.state.world.currentPortId);
      } else if (action === "sell") {
        const inHold = this.state.ship.cargo[goodId] || 0;
        if (inHold <= 0) return;
        this.state.ship.cargo[goodId]--;
        this.state.captain.gold += price;
        this.stats.cargoTraded = (this.stats.cargoTraded || 0) + 1;
        this.audio.playCoins();
        this.ui.updateHUD();
        this.ui.renderPortMarket(this.economy, this.state.world.currentPortId);
      }
    });

    // Tavern Liar's Dice Mini-Game
    document.getElementById("btnRollDice")?.addEventListener("click", () => {
      const wager = parseInt(document.getElementById("diceWagerInput")?.value || "50", 10);
      if (this.state.captain.gold < wager) return this.ui.showToast("Not enough gold for that wager!", "crimson");

      const pRolls = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      const eRolls = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      const pSum = pRolls.reduce((a, b) => a + b, 0);
      const eSum = eRolls.reduce((a, b) => a + b, 0);

      document.getElementById("playerDiceBox").textContent = `[ ${pRolls.join(" ")} ] (Sum: ${pSum})`;
      document.getElementById("npcDiceBox").textContent = `[ ${eRolls.join(" ")} ] (Sum: ${eSum})`;

      if (pSum >= eSum) {
        this.state.captain.gold += wager;
        this.audio.playCoins();
        this.ui.setText("diceOutcomeLog", `You win! Old Salt pays out ${wager} gold!`);
      } else {
        this.state.captain.gold -= wager;
        this.ui.setText("diceOutcomeLog", `Old Salt wins the toss! You lose ${wager} gold.`);
      }
      this.ui.updateHUD();
    });

    // Naval Combat Controls
    document.querySelectorAll(".shot-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".shot-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.combatManager.selectedShot = btn.dataset.shot;
      });
    });

    document.getElementById("btnCombatFireLeft")?.addEventListener("click", () => this.combatManager.fireBroadside("left"));
    document.getElementById("btnCombatFireRight")?.addEventListener("click", () => this.combatManager.fireBroadside("right"));
    document.getElementById("btnCombatBoardShip")?.addEventListener("click", () => {
      this.combatManager.active = false;
      this.duelManager.start(this.combatManager.enemy.name, 110);
    });

    // Duel Commands
    document.querySelectorAll(".btn-duel, .btn-duel-def, .btn-duel-special").forEach(btn => {
      btn.addEventListener("click", () => this.duelManager.playerAction(btn.dataset.action));
    });

    // HUD Dialog Modals Toggles
    document.getElementById("btnOpenQuests")?.addEventListener("click", () => this.ui.openModal("viewQuestModal"));
    document.getElementById("btnOpenInventory")?.addEventListener("click", () => this.ui.openModal("viewInventoryModal"));
    document.getElementById("btnOpenFleet")?.addEventListener("click", () => this.ui.openModal("viewFleetModal"));
    document.getElementById("btnOpenAchievements")?.addEventListener("click", () => {
      this.ui.renderAchievements(this.achievements.definitions);
      this.ui.openModal("viewAchievementsModal");
    });
    document.getElementById("hudMenuToggleBtn")?.addEventListener("click", () => this.ui.openModal("viewPauseModal"));

    // Close Modals
    document.querySelectorAll(".btn-close-modal").forEach(btn => {
      btn.addEventListener("click", () => this.ui.closeActiveModal());
    });

    // Save & Load UI
    document.getElementById("btnManualSave")?.addEventListener("click", () => this.saveManager.save());
    document.getElementById("btnManualLoad")?.addEventListener("click", () => this.saveManager.load());
    document.getElementById("btnExportSave")?.addEventListener("click", () => this.saveManager.exportSave());
    document.getElementById("importSaveFileInput")?.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) this.saveManager.importSave(e.target.files[0]);
    });

    // Keyboard Hotkeys
    window.addEventListener("keydown", e => {
      if (this.ui.currentView === "viewWorldMap") {
        if (e.key === "ArrowLeft" || e.key === "a") this.worldManager.turnPort();
        if (e.key === "ArrowRight" || e.key === "d") this.worldManager.turnStarboard();
        if (e.key === "ArrowUp" || e.key === "w") this.worldManager.sailUp();
        if (e.key === "ArrowDown" || e.key === "s") this.worldManager.sailDown();
        if (e.key === " ") this.worldManager.anchor();
      }
    });

    window.addEventListener("resize", () => {
      this.worldManager.resize();
      this.combatManager.resizeCanvas();
    });
  }

  enterPort(portId) {
    this.state.world.currentPortId = portId;
    this.state.world.anchored = true;
    this.state.world.speedKnots = 0;

    const port = WORLD_PORTS.find(p => p.id === portId);
    this.ui.setText("portName", port.name);
    this.ui.setText("portFactionAndType", `${port.faction} Citadel • ${port.type} • Prosperity: ${port.prosperity}%`);
    this.ui.renderPortMarket(this.economy, portId);
    this.ui.switchView("viewPort");
    this.ui.updateHUD();
    this.saveManager.save();
  }

  handleCombatOutcome(outcome, enemy) {
    if (outcome === "sunk") {
      this.stats.combatVictories = (this.stats.combatVictories || 0) + 1;
      this.ui.showToast(`Enemy ship was sent down to Davy Jones' Locker! +350 Gold recovered.`, "gold");
      this.state.captain.gold += 350;
      this.ui.updateHUD();
      this.ui.switchView("viewWorldMap");
    } else {
      this.ui.showToast("Your flagship was crippled! The crew towed you into the nearest haven.", "crimson");
      this.state.ship.hull = 35;
      this.state.captain.gold = Math.max(0, this.state.captain.gold - 200);
      this.enterPort("port_royal");
    }
  }

  handleDuelOutcome(win) {
    if (win) {
      this.stats.combatVictories = (this.stats.combatVictories || 0) + 1;
      this.state.captain.gold += 600;
      this.ui.showToast("You conquered the enemy captain! Prize plundered (+600 Gold)!", "gold");
      this.ui.updateHUD();
      this.ui.switchView("viewWorldMap");
    } else {
      this.ui.showToast("Defeated in duel! Forced to surrender hold cargo.", "crimson");
      this.state.ship.cargo = {};
      this.enterPort("tortuga");
    }
  }

  start() {
    this.worldManager.resize();
    const loop = (now) => {
      const dt = (now - this.lastTickTime) / 1000;
      this.lastTickTime = now;

      // In-game day progress
      this.dayTicker += dt * 1000;
      if (this.dayTicker >= GAME_CONFIG.TIME_STEP_MS) {
        this.dayTicker = 0;
        this.state.captain.date.setDate(this.state.captain.date.getDate() + 1);
        this.weather.update();
        this.economy.fluctuateMarket();
        this.achievements.evaluate(this.stats);
        this.ui.updateHUD();
      }

      // View updates
      if (this.ui.currentView === "viewWorldMap") {
        this.worldManager.update(dt, this.stats);
        this.worldManager.render();
      } else if (this.ui.currentView === "viewNavalCombat") {
        this.combatManager.updateAndRender();
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Instantiate engine when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  window.piratesGameEngine = new GameEngine();
  window.piratesGameEngine.start();
});
