import { Dungeon, DungeonKey } from './types.ts'
import { mdtDungeons, mdtMobSpawns } from './mdtDungeons.ts'
import { dungeonSpells } from './spells.ts'
import { mapHeight } from '../util/map.ts'

export const dungeonData = (key: DungeonKey) => ({
  mdt: mdtDungeons[key],
  mobSpawns: mdtMobSpawns[key],
  mobSpawnsList: Object.values(mdtMobSpawns[key]),
  spells: dungeonSpells[key],
})

export const aa: Dungeon = {
  name: 'Algethar Academy',
  key: 'aa',
  icon: 'achievement_dungeon_dragonacademy',
  ...dungeonData('aa'),
}

export const ad: Dungeon = {
  name: "Atal'Dazar",
  key: 'ad',
  defaultBounds: [
    [0, 110],
    [-240, 330],
  ],
  icon: 'achievement_dungeon_ataldazar',
  ...dungeonData('ad'),
}

export const bh: Dungeon = {
  name: 'Brackenhide Hollow',
  key: 'bh',
  icon: 'achievement_dungeon_brackenhidehollow',
  ...dungeonData('bh'),
}

export const brh: Dungeon = {
  name: 'Black Rook Hold',
  key: 'brh',
  icon: 'achievement_dungeon_blackrookhold',
  ...dungeonData('brh'),
}

export const dht: Dungeon = {
  name: 'Darkheart Thicket',
  key: 'dht',
  defaultBounds: [
    [-20, 46],
    [-242, 346],
  ],
  icon: 'achievement_dungeon_darkheartthicket',
  ...dungeonData('dht'),
}

export const eb: Dungeon = {
  name: 'Everbloom',
  key: 'eb',
  defaultBounds: [
    [-40, 180],
    [-180, 300],
  ],
  icon: 'achievement_dungeon_everbloom',
  ...dungeonData('eb'),
}

export const fall: Dungeon = {
  name: 'DOTI: Fall of Galakrond',
  key: 'fall',
  defaultBounds: [
    [-10, 50],
    [-mapHeight, 350],
  ],
  icon: 'achievement_dungeon_dawnoftheinfinite',
  ...dungeonData('fall'),
}

export const nok: Dungeon = {
  name: 'Nokhud Offensive',
  key: 'nok',
  icon: 'achievement_dungeon_centaurplains',
  defaultBounds: [
    [-70, 90],
    [-215, 270],
  ],
  ...dungeonData('nok'),
}

export const rise: Dungeon = {
  name: "DOTI: Murozond's Rise",
  key: 'rise',
  defaultBounds: [
    [-10, 50],
    [-mapHeight, 350],
  ],
  icon: 'achievement_dungeon_dawnoftheinfinite',
  ...dungeonData('rise'),
}

export const tott: Dungeon = {
  name: 'Throne of the Tides',
  key: 'tott',
  defaultBounds: [
    [-20, 50],
    [-230, 340],
  ],
  icon: 'achievement_dungeon_throne-of-the-tides',
  ...dungeonData('tott'),
}

export const wcm: Dungeon = {
  name: 'Waycrest Manor',
  key: 'wcm',
  icon: 'achievement_dungeon_waycrestmannor',
  ...dungeonData('wcm'),
}

export const dungeons = [ad, brh, dht, fall, rise, eb, tott, wcm]

export const dungeonsByKey = dungeons.reduce(
  (acc, dungeon) => {
    acc[dungeon.key] = dungeon
    return acc
  },
  {} as Record<DungeonKey, Dungeon>,
)

export const dungeonsByMdtIdx = dungeons.reduce(
  (acc, dungeon) => {
    acc[dungeon.mdt.dungeonIndex] = dungeon
    return acc
  },
  {} as Record<number, Dungeon>,
)
