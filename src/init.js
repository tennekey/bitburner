const baseUrl = 'https://raw.githubusercontent.com/tennekey/bitburner/master/src/'
const filesToDownload = [
  'common.js',
  'mainHack.js',
  'spider.js',
  'grow.js',
  'hack.js',
  'weaken.js',
  'playerServers.js',
  'killAll.js',
  'runHacking.js',
  'contractor.js',
  'stock/stockMarketer4s.js',
  'stock/sellAllStock.js'
]
const valuesToRemove = ['BB_SERVER_MAP']

function localeHHMMSS(ms = 0) {
  if (!ms) {
    ms = new Date().getTime()
  }

  return new Date(ms).toLocaleTimeString()
}

export async function main(ns) {
  ns.tprint(`[${localeHHMMSS()}] Initializing scripts...`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  for (let i = 0; i < filesToDownload.length; i++) {
    const filename = filesToDownload[i]
    const path = baseUrl + filename
    await ns.scriptKill(filename, 'home')
    await ns.rm(filename)
    await ns.asleep(200)
    ns.tprint(`[${localeHHMMSS()}] Downloading ${path}...`)
    await ns.wget(path + '?ts=' + new Date().getTime(), filename)
    ns.tprint(`[${localeHHMMSS()}] Success`)
  }

  valuesToRemove.map((value) => localStorage.removeItem(value))

  ns.print(`[${localeHHMMSS()}] Spawning killAll`)
  ns.spawn('killAll.js', 1, 'runHacking.js')
}