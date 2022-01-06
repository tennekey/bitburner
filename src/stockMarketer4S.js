import { settings, localeHHMMSS, sellShorts, sellLongs, getStockInfo } from 'common.js'
// NOTE: You need to be on BitNode 8 to Buy/Sell Shorts.
// Comment out lines 17, 30, & 57-62 if not

let stockSymbols
let corpus

function getMoney(ns) {
  return ns.getServerMoneyAvailable('home') - 5 * settings().stockCommission
}

// Only if not going to lose money
function sellUnderperforming(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)

  if (stockInfo.sharesShort && stockInfo.sharesShort * (stockInfo.avgPriceShort - stockInfo.stockAskPrice) > 2 * settings().stockCommission) {
    sellShorts(ns, stockSymbol)
  }

  if (stockInfo.sharesLong && stockInfo.sharesLong * (stockInfo.stockBidPrice - stockInfo.avgPriceLong) > 2 * settings().stockCommission) {
    sellLongs(ns, stockSymbol)
  }
}

function sellWrongPosition(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)

  // Sell shorts if going up
  if (stockInfo.position === 'Long' && stockInfo.sharesShort) {
    sellShorts(ns, stockSymbol)
  }

  // Sell longs if going down
  if (stockInfo.position === 'Short' && stockInfo.sharesLong) {
    sellLongs(ns, stockSymbol)
  }
}

function buyNewShares(ns, stockSymbol) {
  const stockInfo = getStockInfo(ns, stockSymbol)
  const minimumMoneyToInvest = 10 * settings().stockCommission

  if (!stockInfo.haveMaxShares && getMoney(ns) > minimumMoneyToInvest) {
    let maxSharesToBuy
    let sharesToBuy
    let buyValue
    let shareType

    if (stockInfo.position === 'Long') {
      maxSharesToBuy = stockInfo.maxShares - stockInfo.sharesLong
      sharesToBuy = Math.max(0, Math.min(maxSharesToBuy, Math.floor(getMoney(ns) / stockInfo.stockAskPrice)))
      if (sharesToBuy) {
        buyValue = ns.stock.buy(stockSymbol, sharesToBuy)
      }
      shareType = 'longs'
    } else {
      maxSharesToBuy = stockInfo.maxShares - stockInfo.sharesShort
      sharesToBuy = Math.max(0, Math.min(maxSharesToBuy, Math.floor(getMoney(ns) / stockInfo.stockBidPrice)))
      if (sharesToBuy) {
        buyValue = ns.stock.short(stockSymbol, sharesToBuy)
      }
      shareType = 'shorts'
    }

    if (sharesToBuy) {
      const invested = ns.nFormat(buyValue * sharesToBuy, '$0.000a')
      ns.print(`[${localeHHMMSS()}][${stockSymbol}] Bought ${sharesToBuy} ${shareType} for ${ns.nFormat(buyValue, '$0.000a')} each. Invested: ${invested}`)
    }
  }
}

export async function main(ns) {
  ns.disableLog('ALL')
  let tickCounter = 1

  stockSymbols = ns.stock.getSymbols()

  corpus = ns.getServerMoneyAvailable('home') - settings().stockCommission
  stockSymbols.forEach((stockSymbol) => {
    const stockInfo = getStockInfo(ns, stockSymbol)

    corpus += stockInfo.sharesLong * stockInfo.avgPriceLong + stockInfo.sharesShort * stockInfo.avgPriceShort
  })
  const startingCorpus = corpus

  while (true) {
    ns.clearLog()
    ns.print(`[${localeHHMMSS()}] Tick counter: ${tickCounter}, corpus: ${ns.nFormat(corpus, '$0.000a')}`)
    ns.print(`[${localeHHMMSS()}] Starting corpus: ${ns.nFormat(startingCorpus, '$0.000a')}`)

    stockSymbols.sort((a, b) => {
      const stockA = getStockInfo(ns, a)
      const stockB = getStockInfo(ns, b)

      if (stockB.expectedReturn === stockA.expectedReturn) {
        return Math.abs(stockB.probability) - Math.abs(stockA.probability)
      }

      return stockB.expectedReturn - stockA.expectedReturn
    })

    stockSymbols
      .filter((stockSymbol) => getStockInfo(ns, stockSymbol).haveAnyShares)
      .filter((stockSymbol, index) => stockSymbol !== stockSymbols[index])
      .forEach((stockSymbol) => sellUnderperforming(ns, stockSymbol))
    await ns.asleep(5)

    stockSymbols.forEach((stockSymbol) => sellWrongPosition(ns, stockSymbol))
    await ns.asleep(5)

    stockSymbols.forEach((stockSymbol) => buyNewShares(ns, stockSymbol))
    await ns.asleep(5)

    await ns.asleep(3500)
    tickCounter++
  }
}
