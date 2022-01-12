import {
    settings,
    getItem,
    setItem,
    localeHHMMSS,
    getMemberNames,
    getMemberInformation,
    sortBy
} from 'common.js'

function getMoney(ns) {
    return ns.getServerMoneyAvailable('home') - 1000000000
}

export async function main(ns) {
    ns.disableLog('ALL')
    ns.print(`[${localeHHMMSS()}] Starting gangAscender`)

    let hostname = ns.getHostname()

    if (hostname !== 'home') {
        throw new Exception('Run the script from home')
    }

    if (getMoney(ns) > 0) {
        const doAscension = getItem(settings.keys.doAscension) || false
        const buyEquipment = getItem(settings.keys.buyEquipment) || false
        const strengthAscensionMultHardLimit = getItem(settings.keys.strAscMultHardLimit) || 100
        setItem(settings.keys.doAscension, doAscension)
        setItem(settings.keys.buyEquipment, buyEquipment)
        setItem(settings.keys.strAscMultHardLimit, strengthAscensionMultHardLimit)

        const baseballBat = 'Baseball Bat'

        const gangMemberNames = getMemberNames(ns)

        gangMemberNames
            .sort(sortBy(ns, SORT_TYPES.STR, DIRECTIONS.DESC))
            .sort(sortBy(ns, SORT_TYPES.STR_MULT, DIRECTIONS.DESC))
            .sort(sortBy(ns, SORT_TYPES.STR_ASC_MULT, DIRECTIONS.DESC))

        ns.print(`[${localeHHMMSS()}] Members (${gangMemberNames.length}) to check: ${gangMemberNames.join(', ')}`)

        for (let i = 0; i < gangMemberNames.length; i++) {
            const gangMemberName = gangMemberNames[i]
            let ascended = true
            let counter = 0

            ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] Starting ${baseballBat} ascension`)

            while (ascended) {
                ascended = false

                const gangMemberInfo = getMemberInformation(ns, gangMemberName)
                if (gangMemberInfo.str_asc_mult < strengthAscensionMultHardLimit) {
                    let hasBat = gangMemberInfo.upgrades.includes(baseballBat)

                    if (!hasBat && getMoney(ns) > 0) {
                        hasBat = ns.gang.purchaseEquipment(gangMemberName, baseballBat)
                    }

                    if (hasBat) {
                        if (gangMemberInfo.str_asc_mult < strengthAscensionMultHardLimit) {
                            ns.gang.ascendMember(gangMemberName)
                            ascended = true
                            counter += 1
                        } else {
                            ns.gang.setMemberTask(gangMemberName, 'Terrorism')
                        }
                    }
                }

                await ns.asleep(1)
            }

            ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] ${counter} ascensions done, moving on`)

            await ns.asleep(1)
        }

        ns.print(`[${localeHHMMSS()}] Finished Basball Bat ascension`)

        let myGangReputation = ns.gang.getGangInformation().respect
        const minimumReputationToBuyDex = 50000000

        if (myGangReputation > minimumReputationToBuyDex && getMoney(ns) > 0) {
            let equipmentList = ['Baseball Bat', 'Bulletproof Vest', 'Ford Flex V20', 'Katana', 'Glock 18C']

            gangMemberNames
                .sort(sortBy(ns, SORT_TYPES.DEX, DIRECTIONS.DESC))
                .sort(sortBy(ns, SORT_TYPES.DEX_MULT, DIRECTIONS.DESC))
                .sort(sortBy(ns, SORT_TYPES.DEX_ASC_MULT, DIRECTIONS.DESC))

            ns.print(`[${localeHHMMSS()}] Members (${gangMemberNames.length}) to check: ${gangMemberNames.join(', ')}`)

            for (let i = 0; i < gangMemberNames.length && myGangReputation > minimumReputationToBuyDex; i++) {
                const gangMemberName = gangMemberNames[i]
                let ascended = true
                let counter = 0

                ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] Starting dex ascension`)

                while (ascended) {
                    ascended = false

                    let gangMemberInfo = getMemberInformation(ns, gangMemberName)
                    if (gangMemberInfo.dex_asc_mult < strengthAscensionMultHardLimit) {
                        let missingEq = equipmentList.filter((equipment) => !gangMemberInfo.upgrades.includes(equipment))

                        if (missingEq.length && getMoney(ns) > 0) {
                            missingEq.forEach((equipment) => {
                                if (getMoney(ns) > 0) {
                                    ns.gang.purchaseEquipment(gangMemberName, equipment)
                                }
                            })
                        }

                        gangMemberInfo = getMemberInformation(ns, gangMemberName)
                        missingEq = equipmentList.filter((equipment) => !gangMemberInfo.upgrades.includes(equipment))

                        if (!missingEq.length) {
                            if (gangMemberInfo.dex_asc_mult < strengthAscensionMultHardLimit) {
                                ns.gang.ascendMember(gangMemberName)
                                ascended = true
                                counter += 1
                            } else {
                                ns.gang.setMemberTask(gangMemberName, 'Terrorism')
                            }
                        }
                    }

                    await ns.sleep(1)
                }

                ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] ${counter} ascensions done, moving on`)
                myGangReputation = ns.gang.getGangInformation().respect
                await ns.asleep(1)
            }

            ns.print(`[${localeHHMMSS()}] Finished Dex ascension`)
        }

        myGangReputation = ns.gang.getGangInformation().respect
        const minimumReputationToBuyAll = 100000000

        if (myGangReputation > minimumReputationToBuyAll && getMoney(ns) > 0) {
            let equipmentList = [
                'Baseball Bat',
                'Bulletproof Vest',
                'Ford Flex V20',
                'Full Body Armor',
                'NUKE Rootkit',
                'ATX1070 Superbike',
                'Katana',
                'Mercedes-Benz S9001',
                'Glock 18C',
                'Liquid Body Armor',
                'Soulstealer Rootkit',
                'White Ferrari',
                'Graphene Plating Armor',
                'Hmap Node',
                'P90C',
                'Steyr AUG',
                'Demon Rootkit',
                'Jack the Ripper',
                'AK-47',
                'M15A10 Assault Rifle',
                'AWM Sniper Rifle',
            ]

            gangMemberNames.sort(sortBy(ns, SORT_TYPES.REPUTATION, DIRECTIONS.ASC))

            ns.print(`[${localeHHMMSS()}] Members (${gangMemberNames.length}) to check: ${gangMemberNames.join(', ')}`)

            for (let i = 0; i < gangMemberNames.length && myGangReputation > minimumReputationToBuyAll; i++) {
                const gangMemberName = gangMemberNames[i]
                let ascended = true
                let counter = 0

                ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] Starting full ascension`)

                while (ascended) {
                    ascended = false

                    let gangMemberInfo = getMemberInformation(ns, gangMemberName)
                    if (gangMemberInfo.hack_asc_mult < strengthAscensionMultHardLimit) {
                        let missingEq = equipmentList.filter((equipment) => !gangMemberInfo.upgrades.includes(equipment))

                        if (missingEq.length && getMoney(ns) > 0) {
                            missingEq.forEach((equipment) => {
                                if (getMoney(ns) > 0) {
                                    ns.gang.purchaseEquipment(gangMemberName, equipment)
                                }
                            })
                        }

                        gangMemberInfo = getMemberInformation(ns, gangMemberName)
                        missingEq = equipmentList.filter((equipment) => !gangMemberInfo.upgrades.includes(equipment))

                        if (!missingEq.length) {
                            if (gangMemberInfo.hack_asc_mult < strengthAscensionMultHardLimit) {
                                ns.gang.ascendMember(gangMemberName)
                                ascended = true
                                counter += 1
                            } else {
                                ns.gang.setMemberTask(gangMemberName, 'Terrorism')
                            }
                        }
                    }

                    await ns.asleep(1)
                }

                ns.print(`[${localeHHMMSS()}][${gangMemberName}][${i + 1}/${gangMemberNames.length}] ${counter} ascensions done, moving on`)
                myGangReputation = ns.gang.getGangInformation().respect
                await ns.asleep(1)
            }

            ns.print(`[${localeHHMMSS()}] Finished full ascension`)
        }
    }

    ns.print(`[${localeHHMMSS()}] Finished, exiting`)
}