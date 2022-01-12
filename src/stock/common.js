export const settings = {
    stockCommission: 100000,
    totalMoneyAllocation: 0.9, // Amount of total player money to allocate into stocks
}

export function localeHHMMSS(ms = 0) {
    if (!ms) {
        ms = new Date().getTime()
    }

    return new Date(ms).toLocaleTimeString()
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