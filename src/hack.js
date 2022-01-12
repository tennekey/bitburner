export async function main(ns) {
  const target = ns.args[0]
  const threads = ns.args[1]
  const delay = ns.args[2]
  const affectStock = ns.args[3]

  if (delay && delay > 0) {
    await ns.asleep(delay)
  }

  ns.print(`Starting operation: hack on ${target} in ${threads} threads`)
  await ns.hack(target, {
    threads,
    stock: affectStock
  })
  ns.exit()
}