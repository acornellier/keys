﻿import { Spawn } from '../../data/types.ts'
import { Marker, Polygon, Tooltip } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { Mob } from '../../data/types.ts'
import { renderToString } from 'react-dom/server'
import { memo, useEffect, useMemo, useState } from 'react'
import { mobScale, mobSpawnsEqual } from '../../code/mobSpawns.ts'
import { darkenColor, getPullColor } from '../../code/colors.ts'
import { useAppDispatch, useAppSelector, useRoute } from '../../store/hooks.ts'
import { hoverMobSpawn, toggleSpawn } from '../../store/reducer.ts'
import { useKeyDown } from '../../hooks/useKeyHeld.ts'

interface MobSpawnProps {
  iconScaling: number
  mob: Mob
  spawn: Spawn
}

interface MobSpawnMemoProps extends MobSpawnProps {
  isHovered: boolean
  isGroupHovered: boolean
  matchingPullIndex: number | null
}

function MobSpawnComponent({
  iconScaling,
  mob,
  spawn,
  isHovered,
  isGroupHovered,
  matchingPullIndex,
}: MobSpawnMemoProps) {
  const dispatch = useAppDispatch()
  // const isCtrlKeyDown = useKeyDown('Control')
  // const isAltKeyDown = useKeyDown('Alt')
  const iconSize = iconScaling * mobScale(mob) * (isHovered ? 1.2 : 1)
  const showCount = isGroupHovered

  // Change key to force re-render
  const [patrolKey, setPatrolKey] = useState(0)
  useEffect(() => {
    setPatrolKey((prevKey) => prevKey + 1000)
  }, [isGroupHovered])

  return (
    <>
      <Marker
        position={spawn.pos}
        zIndexOffset={isHovered ? 100_000 : 0}
        icon={divIcon({
          popupAnchor: [100, 0],
          iconUrl: `/npc_portaits/${mob.id}.png`,
          iconSize: [iconSize, iconSize],
          className: 'mob',
          html: renderToString(
            <div
              className="absolute h-full w-full rounded-full border border-slate-300 overflow-hidden border-transparent"
              style={{
                background:
                  'linear-gradient(white, white) padding-box, linear-gradient(to bottom, #dfdfe3, #373738) border-box',
                borderWidth: iconScaling * mobScale(mob) * 0.04,
                boxShadow: 'black 0px 0px 10px 0px',
              }}
            >
              <div
                className="absolute h-full w-full"
                style={{
                  backgroundImage: `url('/npc_portraits/${mob.id}.png')`,
                  backgroundSize: 'contain',
                  backgroundBlendMode: 'overlay',
                  backgroundColor:
                    matchingPullIndex !== null
                      ? darkenColor(getPullColor(matchingPullIndex), 100)
                      : undefined,
                }}
              >
                {showCount && mob.count > 0 && (
                  <div
                    className="absolute flex items-center justify-center w-full h-full text-white font-bold"
                    style={{
                      fontSize: iconScaling * 0.7 * mobScale(mob),
                      WebkitTextStroke: `${iconScaling * 0.02}px black`,
                    }}
                  >
                    {mob.count}
                  </div>
                )}
                {/*{isAltKeyDown && !showCount && spawn.group !== null && (*/}
                {/*  <div*/}
                {/*    className="fixed flex items-center justify-center w-full h-full text-white font-bold"*/}
                {/*    style={{*/}
                {/*      fontSize: iconScaling * 0.6 * mobScale(mob),*/}
                {/*      WebkitTextStroke: `${iconScaling * 0.02}px black`,*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    G{spawn.group}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </div>,
          ),
        })}
        eventHandlers={{
          click: () => dispatch(toggleSpawn({ mob, spawn })),
          mouseover: () => dispatch(hoverMobSpawn({ mob, spawn })),
          mouseout: () => dispatch(hoverMobSpawn(null)),
        }}
      >
        {isHovered && (
          <Tooltip className="no-arrow" direction="right" offset={[10, 0]} permanent>
            {`${mob.name} ${spawn.spawnIndex}`}
          </Tooltip>
        )}
      </Marker>
      {mob.isBoss && (
        <Marker
          position={spawn.pos}
          zIndexOffset={isHovered ? 0 : -10_000}
          icon={divIcon({
            iconSize: [iconSize, iconSize],
            className: 'elite-portait',
            html: renderToString(
              <div
                className="absolute"
                style={{
                  backgroundImage: `url('/wow/elite.png')`,
                  backgroundSize: 'contain',
                  zIndex: -1,
                  width: '165%',
                  height: '165%',
                  top: '-30%',
                  left: '-45%',
                }}
              />,
            ),
          })}
        />
      )}
      {spawn.patrol.length && (
        <Polygon
          key={patrolKey}
          positions={spawn.patrol}
          color="#1d1db0"
          weight={isGroupHovered ? 6 : 2}
          dashArray={isGroupHovered ? undefined : [4, 10]}
          opacity={isGroupHovered ? 1 : 0.5}
        />
      )}
    </>
  )
}

const MobSpawnMemo = memo(MobSpawnComponent)

export function MobSpawn({ iconScaling, mob, spawn }: MobSpawnProps) {
  const route = useRoute()

  const hoveredMobSpawn = useAppSelector((state) => state.hoveredMobSpawn)
  const isHovered = !!hoveredMobSpawn && mobSpawnsEqual(hoveredMobSpawn, { mob, spawn })
  const isGroupHovered =
    isHovered ||
    (!!hoveredMobSpawn &&
      hoveredMobSpawn.spawn.group !== null &&
      hoveredMobSpawn.spawn.group === spawn.group)

  const matchingPullIndex = useMemo(() => {
    const index = route.pulls.findIndex((pull) =>
      pull.mobSpawns.some((mobSpawn) => mobSpawnsEqual(mobSpawn, { mob, spawn })),
    )
    return index !== -1 ? index : null
  }, [route.pulls, mob, spawn])

  return (
    <MobSpawnMemo
      iconScaling={iconScaling}
      mob={mob}
      spawn={spawn}
      isHovered={isHovered}
      isGroupHovered={isGroupHovered}
      matchingPullIndex={matchingPullIndex}
    />
  )
}
