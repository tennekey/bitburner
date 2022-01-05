export function settings() {
  return {
    stockCommission: 100000,
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

export function sellShorts(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)
  const shortSellValue = ns.stock.sellShort(stockSymbol, stockInfo.sharesShort)

  if (shortSellValue) {
    corpus += stockInfo.sharesShort * (stockInfo.avgPriceShort - shortSellValue) - 2 * commission
    ns.print(
      `[${localeHHMMSS()}][${stockSymbol}] Sold ${stockInfo.sharesShort} shorts for ${ns.nFormat(shortSellValue, '$0.000a')}. Profit: ${ns.nFormat(
        stockInfo.sharesLong * (stockInfo.avgPriceShort - shortSellValue) - 2 * commission,
        '$0.000a'
      )}`
    )
  }
}

export function sellLongs(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)
  const longSellValue = ns.stock.sell(stockSymbol, stockInfo.sharesLong)

  if (longSellValue) {
    corpus += stockInfo.sharesLong * (longSellValue - stockInfo.avgPriceLong) - 2 * commission
    ns.print(
      `[${localeHHMMSS()}][${stockSymbol}] Sold ${stockInfo.sharesLong} longs for ${ns.nFormat(longSellValue, '$0.000a')}. Profit: ${ns.nFormat(
        stockInfo.sharesLong * (longSellValue - stockInfo.avgPriceLong) - 2 * commission,
        '$0.000a'
      )}`
    )
  }
}

export function getStockInfo(ns, stockSymbol) {
  const [sharesLong, avgPriceLong, sharesShort, avgPriceShort] = ns.stock.getPosition(stockSymbol)
  const volatility = ns.stock.getVolatility(stockSymbol)
  const probability = ns.stock.getForecast(stockSymbol) - 0.5
  const expectedReturn = Math.abs(volatility * probability)
  const maxShares = ns.stock.getMaxShares(stockSymbol)

  const haveAnyShares = sharesLong + sharesShort > 0
  const haveMaxShares = sharesLong + sharesShort === maxShares

  const stockAskPrice = ns.stock.getAskPrice(stockSymbol)
  const stockBidPrice = ns.stock.getBidPrice(stockSymbol)

  const position = probability >= 0 ? 'Long' : 'Short'

  return {
    stockSymbol,
    maxShares,
    haveAnyShares,
    haveMaxShares,
    sharesLong,
    avgPriceLong,
    stockAskPrice,
    sharesShort,
    avgPriceShort,
    stockBidPrice,
    volatility,
    probability,
    expectedReturn,
    position,
  }
}

export async function main(ns) {
  return {
    settings,
    getItem,
    setItem,
    localeHHMMSS,
    getPlayerDetails,
    sellShorts,
    sellLongs,
    getStockInfo
  }
}
