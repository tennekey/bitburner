import { settings, getItem } from 'common.js'

const scriptsToKill = [
  'mainHack.js',
  'spider.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'playerServers.js',
  'runHacking.js',
  'initHacking.js',
  'start.js',
  'find.js',
]

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Starting killAll`)

  const scriptToRunAfter = ns.args[0]

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  const serverMap = getItem(settings.keys.serverMap)

  if (!serverMap || serverMap.lastUpdate < new Date().getTime() - settings.mapRefreshInterval) {
    ns.tprint(`[${localeHHMMSS()}] Spawning spider`)
    ns.spawn('spider.js', 1, 'killAll.js')
    ns.exit()
    return
  }

  for (let i = 0; i < scriptsToKill.length; i++) {
    await ns.scriptKill(scriptsToKill[i], 'home')
  }

  const killAbleServers = Object.keys(serverMap.servers)
    .filter((hostname) => ns.serverExists(hostname))
    .filter((hostname) => hostname !== 'home')

  for (let i = 0; i < killAbleServers.length; i++) {
    await ns.killall(killAbleServers[i])
  }

  ns.tprint(`[${localeHHMMSS()}] All processes killed`)

  if (scriptToRunAfter) {
    ns.tprint(`[${localeHHMMSS()}] Spawning ${scriptToRunAfter}`)
    ns.spawn(scriptToRunAfter, 1)
  } else {
    ns.tprint(`[${localeHHMMSS()}] Spawning runHacking`)
    ns.spawn('runHacking.js', 1)
  }
}
