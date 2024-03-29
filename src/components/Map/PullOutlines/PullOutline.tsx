﻿import { Circle, Polygon, Tooltip } from 'react-leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { getPullColor } from '../../../util/colors.ts'
import { MobSpawn, Point } from '../../../data/types.ts'
import { expandPolygon, iconSizeMagicScaling, makeConvexHull } from '../../../util/hull.ts'
import { mobScale } from '../../../util/mobSpawns.ts'
import { selectPull } from '../../../store/routes/routesReducer.ts'
import { Pull } from '../../../util/types.ts'
import { useMapObjectsHidden } from '../../../store/reducers/mapReducer.ts'

import { useDungeon } from '../../../store/routes/routeHooks.ts'
import { useAppDispatch } from '../../../store/storeUtil.ts'

interface Props {
  pull: Pull
  index: number
  isHovered: boolean
  isSelected: boolean
}

interface Outline {
  hull?: Array<Point>
  circle?: { center: Point; radius: number }
}

function createOutline(mobSpawns: MobSpawn[]): Outline {
  if (mobSpawns.length <= 0) return {}

  if (mobSpawns.length === 1) {
    const mobSpawn = mobSpawns[0]!
    const scale = mobScale(mobSpawn)
    return {
      circle: {
        center: mobSpawn.spawn.pos,
        radius: scale * iconSizeMagicScaling * (mobSpawn.mob.isBoss ? 1.1 : 1),
      },
    }
  }

  const vertices = mobSpawns.map((mobSpawn) => ({
    pos: mobSpawn.spawn.pos,
    scale: mobScale(mobSpawn),
  }))

  let hull = makeConvexHull(vertices)
  hull = expandPolygon(hull, 10)
  hull = makeConvexHull(hull)

  return { hull: hull.map((m) => m.pos) }
}

function PullOutlineComponent({ pull, index, isSelected, isHovered }: Props) {
  const dispatch = useAppDispatch()
  const dungeon = useDungeon()
  const mobSpawns = useMemo(
    () => pull.spawns.map((spawnId) => dungeon.mobSpawns[spawnId]).filter(Boolean) as MobSpawn[],
    [dungeon, pull.spawns],
  )
  const { hull, circle } = useMemo(() => createOutline(mobSpawns), [mobSpawns])
  const pullColor = getPullColor(index)
  const hidden = useMapObjectsHidden(100)

  // Change key to force re-render
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((prevKey) => prevKey + 1000)
  }, [isHovered, isSelected, pull, index, hidden])

  const eventHandlers = useMemo(
    () => ({
      click: () => {
        dispatch(selectPull(index))
      },
    }),
    [dispatch, index],
  )

  const tooltipClass = `pull-number-tooltip ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`
  const outlineOacity = hidden ? 0 : isSelected || isHovered ? 1 : 0.6
  const textOpacity = hidden ? 0 : isSelected || isHovered ? 1 : 0.9
  const weight = isSelected ? 6 : isHovered ? 4.5 : 3.5

  return circle ? (
    <Circle
      key={key}
      center={circle.center}
      radius={circle.radius}
      eventHandlers={eventHandlers}
      color={pullColor}
      fillOpacity={0}
      opacity={outlineOacity}
      weight={weight}
    >
      <Tooltip
        className={tooltipClass}
        direction="center"
        permanent
        opacity={textOpacity}
        offset={[0, -15]}
      >
        {index + 1}
      </Tooltip>
    </Circle>
  ) : hull ? (
    <Polygon
      key={key}
      positions={hull}
      eventHandlers={eventHandlers}
      color={pullColor}
      fillOpacity={0}
      opacity={outlineOacity}
      weight={weight}
    >
      <Tooltip className={tooltipClass} direction="center" permanent opacity={textOpacity}>
        {index + 1}
      </Tooltip>
    </Polygon>
  ) : null
}

export const PullOutline = memo(PullOutlineComponent)
