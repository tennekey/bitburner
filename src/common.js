export const settings = {
  hackPrograms: ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'],
  homeRamReserved: 100,
  homeRamReservedBase: 20, // Represents how much memory the base hacking scripts will take
  homeRamExtraRamReserved: 80, //Represents any additional memory (in GB) to be set aside for player use
  homeRamBigMode: 64,
  minSecurityLevelOffset: 1,
  maxMoneyMultiplier: 0.9, // Ratio of max money available on server before hack will carry out
  minSecurityWeight: 100,
  mapRefreshInterval: 6 * 60 * 60 * 1000, // Time interval for main process to re-crawl servers for refreshed info
  maxWeakenTime: 30 * 60 * 1000, // Max time to wait for weaken process
  maxPlayerServers: 25,
  maxGbRam: 1048576, // Maximum RAM amount (in GB) allowed for player purchased servers
  minGbRam: 64, // Minimum RAM amount (in GB) for auto-purchased servers
  affectStock: false, // Whether hack/grow/weaken should affect stock prices
  keys: {
    serverMap: 'BB_SERVER_MAP',
    hackTarget: 'BB_HACK_TARGET',
    action: 'BB_ACTION',
  },
  changes: {
    hack: 0.002,
    grow: 0.004,
    weaken: 0.05,
  },
  actions: {
    BUY: 'buy',
    UPGRADE: 'upgrade',
  },
}

export function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

export function getItem(key) {
  let item = localStorage.getItem(key)

  return item ? JSON.parse(item) : undefined
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getPlayerDetails(ns) {
  let portHacks = 0

  settings().hackPrograms.forEach((hackProgram) => {
    if (ns.fileExists(hackProgram, 'home')) {
      portHacks += 1
    }
  })

  return {
    hackingLevel: ns.getHackingLevel(),
    portHacks,
  }
}

export function createUUID() {
  var dt = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}