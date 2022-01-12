export const settings = {
    keys: {
        buyEquipment: 'BB_BUY_EQUIPMENT',
        doAscension: 'BB_DO_ASCENSION',
        strAscMultHardLimit: 'BB_STR_ASC_MULT_HARD_LIMIT',
        equipmentList: 'BB_EQUIPMENT_LIST',
        augumentationList: 'BB_AUGUMENTATION_LIST',
    },
}

export const SORT_TYPES = {
    VIGILANTIE: 'Vigilantie',
    TERRORISM: 'Terrorism',
    REPUTATION: 'Reputation',
    STR: 'Strength',
    STR_MULT: 'Strength Multiplier',
    STR_ASC_MULT: 'Strength Ascencion Multiplier',
    DEX: 'Dexterity',
    DEX_MULT: 'Dexterity Multiplier',
    DEX_ASC_MULT: 'Dexterity Ascencion Multiplier',
}

export const DIRECTIONS = {
    ASC: 'Ascending',
    DESC: 'Descending',
}

export const gangMemberNamesList = [
    'Darth Vader',
    'Joker',
    'Two-Face',
    'Warden Norton',
    'Hannibal Lecter',
    'Sauron',
    'Bane',
    'Tyler Durden',
    'Agent Smith',
    'Gollum',
    'Vincent Vega',
    'Saruman',
    'Loki',
    'Vito Corleone',
    'Balrog',
    'Palpatine',
    'Michael Corleone',
    'Talia al Ghul',
    'John Doe',
    'Scarecrow',
    'Commodus',
    'Jabba the Hutt',
    'Scar',
    'Grand Moff Tarkin',
    'Boba Fett',
    'Thanos',
    'Terminator',
    'Frank Costello',
    'Hector Barbossa',
    'Xenomorph',
]

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

export function getMemberNames(ns) {
    return ns.gang.getMemberNames()
}

export function getMemberInformation(ns, name) {
    return ns.gang.getMemberInformation(name)
}

export function sortBy(ns, sortType = null, direction = DIRECTIONS.ASC) {
    return function (a, b) {
        const memberInfoA = getMemberInformation(ns, a)
        const memberInfoB = getMemberInformation(ns, b)

        let statA
        let statB

        if (sortType === SORT_TYPES.VIGILANTIE) {
            statA = memberInfoA.hack + memberInfoA.str + memberInfoA.def + memberInfoA.dex + memberInfoA.agi
            statB = memberInfoB.hack + memberInfoB.str + memberInfoB.def + memberInfoB.dex + memberInfoB.agi
        } else if (sortType === SORT_TYPES.TERRORISM) {
            statA = memberInfoA.hack + memberInfoA.str + memberInfoA.def + memberInfoA.dex + memberInfoA.cha
            statB = memberInfoB.hack + memberInfoB.str + memberInfoB.def + memberInfoB.dex + memberInfoB.cha
        } else if (sortType === SORT_TYPES.REPUTATION) {
            statA = memberInfoA.earnedRespect
            statB = memberInfoB.earnedRespect
        } else if (sortType === SORT_TYPES.STR) {
            statA = memberInfoA.str
            statB = memberInfoB.str
        } else if (sortType === SORT_TYPES.STR_MULT) {
            statA = memberInfoA.str_mult
            statB = memberInfoB.str_mult
        } else if (sortType === SORT_TYPES.STR_ASC_MULT) {
            statA = memberInfoA.str_asc_mult
            statB = memberInfoB.str_asc_mult
        } else {
            const indexA = gangMemberNamesList.findIndex((name) => name === memberInfoA.name)
            const indexB = gangMemberNamesList.findIndex((name) => name === memberInfoB.name)

            return indexA - indexB
        }

        if (statA === statB) {
            return 0
        }

        if (direction === DIRECTIONS.ASC) {
            return statA - statB
        } else {
            return statB - statA
        }
    }
}