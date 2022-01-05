import { localeHHMMSS } from 'common.js'

export async function main(ns) {
  ns.print(`[${localeHHMMSS()}] Starting runHacking`)

  let hostname = ns.getHostname()

  if (hostname !== 'home') {
    throw new Exception('Run the script from home')
  }

  const homeRam = ns.getServerMaxRam('home')

  if (homeRam >= 32) {
    ns.print(`[${localeHHMMSS()}] Spawning spider`)
    await ns.run('spider.js', 1, 'mainHack.js')
    await ns.sleep(3000)
    ns.print(`[${localeHHMMSS()}] Spawning playerServers`)
    ns.spawn('playerServers.js', 1)
  } else {
    ns.print(`[${localeHHMMSS()}] Spawning spider`)
    ns.spawn('spider.js', 1, 'mainHack.js')
  }
}
