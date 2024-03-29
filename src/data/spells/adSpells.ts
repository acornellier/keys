import wclSpells from './ad_spells.json'
import { Spells } from '../types.ts'
import { mergeSpells } from './mergeSpells.ts'

const extraSpells: Spells = {
  122973: [
    {
      id: 253544,
      name: "Bwonsamdi's Mantle",
      icon: 'trade_archaeology_skullstaff.jpg',
    },
    {
      id: 253517,
      name: 'Mending Word',
      icon: 'spell_holy_aspiration.jpg',
    },
    {
      id: 253526,
      name: 'Dispel',
      icon: 'spell_holy_dispelmagic.jpg',
    },
  ],
  122984: [
    {
      id: 254959,
      name: 'Soulburn',
      icon: 'spell_shadow_soulleech_1.jpg',
    },
  ],
}

export const adSpells = mergeSpells(wclSpells, extraSpells)
