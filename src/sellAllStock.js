import { sellShorts, sellLongs } from 'common.js'

export async function main(ns) {
  ns.disableLog('ALL')

  let stockSymbols = ns.stock.getSymbols()
  stockSymbols.forEach((stockSymbol) => {
    sellLongs(ns, stockSymbol)
    sellShorts(ns, stockSymbol)
  })
}