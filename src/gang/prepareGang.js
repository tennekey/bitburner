import {
    settings,
    setItem
} from '/gang/common.js'

export async function main(ns) {
    ns.disableLog('ALL')
    const equipment = ns.gang.getEquipmentNames().map((equipmentName) => {
        return {
            name: equipmentName,
            type: ns.gang.getEquipmentType(equipmentName),
            cost: ns.gang.getEquipmentCost(equipmentName),
            ...ns.gang.getEquipmentStats(equipmentName),
        }
    })
    equipment.sort((a, b) => a.cost - b.cost)

    setItem(
        settings.keys.equipmentList,
        equipment.filter((eq) => eq.type !== 'Augmentation')
    )
    setItem(
        settings.keys.augumentationList,
        equipment.filter((eq) => eq.type === 'Augmentation')
    )

    ns.tprint('Done')
}