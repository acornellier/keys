import { useMap, useMapEvents } from 'react-leaflet'
import { useMemo, useState } from 'react'
import { mapIconScaling } from '../../../util/map.ts'
import { MobSpawnWrapper } from './MobSpawn.tsx'
import {
  boxSelectEnd,
  boxSelectSpawns,
  boxSelectStart,
} from '../../../store/routes/routesReducer.ts'
import type { LeafletEventHandlerFnMap } from 'leaflet'
import { setBoxHovering } from '../../../store/reducers/hoverReducer.ts'
import { useDungeon } from '../../../store/routes/routeHooks.ts'
import { useAppDispatch } from '../../../store/storeUtil.ts'
import { Delayed } from '../../Common/Delayed.tsx'

export function Mobs() {
  const dungeon = useDungeon()
  const map = useMap()
  const dispatch = useAppDispatch()

  const [iconScaling, setIconScaling] = useState(mapIconScaling(map))

  const mapEvents: LeafletEventHandlerFnMap = useMemo(() => {
    return {
      zoomend: () => setIconScaling(mapIconScaling(map)),
      boxselectstart: () => {
        dispatch(setBoxHovering(true))
        dispatch(boxSelectStart())
      },
      boxselectmove({ bounds, inverse }) {
        const spawns = dungeon.mobSpawnsList
          .filter(({ spawn }) => bounds.contains(spawn.pos))
          .map(({ spawn }) => spawn.id)

        dispatch(boxSelectSpawns({ spawns, inverse }))
      },
      boxselectend() {
        dispatch(setBoxHovering(false))
        dispatch(boxSelectEnd())
      },
    }
  }, [dispatch, dungeon, map])

  useMapEvents(mapEvents)

  // Delay all mobs by 50ms for performance
  return (
    <Delayed delay={50}>
      {dungeon.mobSpawnsList.map((mobSpawn) => (
        <MobSpawnWrapper key={mobSpawn.spawn.id} iconScaling={iconScaling} mobSpawn={mobSpawn} />
      ))}
    </Delayed>
  )
}
