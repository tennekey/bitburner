export function settings() {
  return {
    hackPrograms: ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'],
    homeRamReserved: 20,
    homeRamReservedBase: 20,
    homeRamExtraRamReserved: 12,
    homeRamBigMode: 64,
    minSecurityLevelOffset: 1,
    maxMoneyMultiplier: 0.9,
    minSecurityWeight: 100,
    mapRefreshInterval: 12 * 60 * 60 * 1000,
    maxWeakenTime: 60 * 60 * 1000,
    maxPlayerServers: 25,
    gbRamCost: 55000,
    maxGbRam: 1048576,
    minGbRam: 32,
    totalMoneyAllocation: 0.9,
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

export async function main(ns) {
  return {
    settings,
    getItem,
    setItem,
    localeHHMMSS,
    getPlayerDetails
  }
}
