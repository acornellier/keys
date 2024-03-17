﻿import { AppDispatch, RootState } from './store.ts'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { dungeonsByKey } from '../data/dungeons.ts'
import { RouteState } from './routes/routesReducer.ts'
import { DungeonKey } from '../data/types.ts'
import { createSelector } from '@reduxjs/toolkit'
import { HoverState } from './reducers/hoverReducer.ts'
import { findMobSpawn } from '../util/mobSpawns.ts'
import { useEffect, useState } from 'react'

export const useAppDispatch: () => AppDispatch = useDispatch

export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector

export const useRoutesSelector = <T>(selector: (state: RouteState) => T): T =>
  useRootSelector((state) => selector(state.routes.present))

export const useHoverSelector = <T>(selector: (state: HoverState) => T): T =>
  useRootSelector((state) => selector(state.hover))

// Routes
export const useRoute = () =>
  useRootSelector((state) => state.import.previewRoute ?? state.routes.present.route)

export const useActualRoute = () => useRoutesSelector((state) => state.route)

export const usePreviewRoute = () => useRootSelector((state) => state.import.previewRoute)

const selectAllRoutes = (state: RouteState) => state.savedRoutes
const selectDungeonRoutes = createSelector(
  [selectAllRoutes, (_, dungeonKey: DungeonKey) => dungeonKey],
  (allRoutes, dungeonKey) => allRoutes.filter((route) => route.dungeonKey === dungeonKey),
)
export const useDungeonRoutes = (dungeonKey: DungeonKey) =>
  useRoutesSelector((state) => selectDungeonRoutes(state, dungeonKey))

export function useDungeon() {
  const route = useRoute()
  return dungeonsByKey[route.dungeonKey]
}

// Hover
export const useHoveredPull = () => {
  const previewRoute = usePreviewRoute()
  const hoveredPull = useHoverSelector((state) => state.hoveredPull)
  return previewRoute ? null : hoveredPull
}

export function useHoveredMobSpawn() {
  const dungeon = useDungeon()
  const hoveredMobSpawn = useHoverSelector((state) => state.hoveredSpawn)
  return hoveredMobSpawn === null ? null : findMobSpawn(hoveredMobSpawn, dungeon)
}

// Map
export function useMapObjectsHidden(minDelay: number = 0, maxDelay: number = 100) {
  const hidden = useRootSelector((state) => state.map.objectsHidden)
  const [delayedHidden, setDelayedHidden] = useState(hidden)

  useEffect(() => {
    if (!hidden) setTimeout(() => setDelayedHidden(false), minDelay + Math.random() * maxDelay)
    else setDelayedHidden(true)
  }, [hidden, minDelay, maxDelay])

  return delayedHidden
}
