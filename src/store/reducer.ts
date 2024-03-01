﻿import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MdtRoute, Pull, Route } from '../code/types.ts'
import { DungeonKey, MobSpawn } from '../data/types.ts'
import { sampleRoutes } from '../data/sampleRoutes.ts'
import { dungeonsByKey } from '../data/dungeons.ts'
import { mdtRouteToRoute } from '../code/mdtUtil.ts'
import { getPullColor } from '../code/colors.ts'
import { mobSpawnsEqual } from '../code/util.ts'

export interface CounterState {
  route: Route
  hoveredPull: number | null
}

const defaultDungeonKey: DungeonKey = 'eb'
export const routeLocalStorageKey = 'savedRoute'

function getRouteByLocalStorage(): Route {
  const item = window.localStorage.getItem(routeLocalStorageKey)
  return item ? JSON.parse(item) : sampleRoutes[defaultDungeonKey]
}

const initialState: CounterState = {
  route: getRouteByLocalStorage(),
  hoveredPull: null,
}

const findSelectedPull = (route: Route, mobSpawn: MobSpawn) =>
  route.pulls.findIndex((pull) =>
    pull.mobSpawns.some((mobSpawn2) => mobSpawnsEqual(mobSpawn, mobSpawn2)),
  )

function toggleSpawnAction(route: Route, payload: MobSpawn): Pull[] {
  const data = dungeonsByKey[route.dungeonKey]

  const origSelectedPull = findSelectedPull(route, payload)

  const groupSpawns = data.mdt.enemies
    .flatMap((mob) => mob.spawns.map((spawn) => ({ mob, spawn })))
    .filter(
      (mobSpawn) =>
        mobSpawnsEqual(mobSpawn, payload) ||
        (payload.spawn.group !== null && mobSpawn.spawn.group === payload.spawn.group),
    )
    .map((mobSpawn) => {
      const selectedPull = findSelectedPull(route, mobSpawn)
      return { mobSpawn, selectedPull }
    })

  if (origSelectedPull !== -1) {
    // if already selected, deselect
    return route.pulls.map((pull, pullIdx) =>
      pullIdx !== origSelectedPull
        ? pull
        : {
            ...pull,
            mobSpawns: pull.mobSpawns.filter(
              (mobSpawn2) =>
                !groupSpawns.some(({ mobSpawn }) => mobSpawnsEqual(mobSpawn, mobSpawn2)),
            ),
          },
    )
  } else {
    // otherwise, select
    return route.pulls.map((pull, pullIdx) =>
      pullIdx !== route.selectedPull
        ? pull
        : {
            ...pull,
            mobSpawns: [
              ...pull.mobSpawns,
              ...groupSpawns
                .filter(({ selectedPull }) => selectedPull === -1)
                .map(({ mobSpawn }) => mobSpawn),
            ],
          },
    )
  }
}

export const reducer = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setRoute(state, { payload }: PayloadAction<Route>) {
      state.route = payload
    },
    setDungeon(state, { payload }: PayloadAction<DungeonKey>) {
      state.route = sampleRoutes[payload]
    },
    importRoute(state, { payload }: PayloadAction<MdtRoute>) {
      state.route = mdtRouteToRoute(payload)
    },
    setName(state, { payload }: PayloadAction<string>) {
      state.route.name = payload
    },
    addPull(state) {
      const newPullIndex = state.route.pulls.length
      const maxIdx = state.route.pulls.reduce<number>(
        (acc, pull) => (pull.id > acc ? pull.id : acc),
        0,
      )
      const id = maxIdx + 1
      const newPull = { id, color: getPullColor(newPullIndex), mobSpawns: [] }
      state.route.pulls = [...state.route.pulls, newPull]
    },
    selectPull(state, { payload }: PayloadAction<number>) {
      state.route.selectedPull = payload
    },
    hoverPull(state, { payload }: PayloadAction<number | null>) {
      state.hoveredPull = payload
    },
    toggleSpawn(state, { payload }: PayloadAction<MobSpawn>) {
      state.route.pulls = toggleSpawnAction(state.route, payload)
    },
    setPulls(state, { payload }: PayloadAction<Pull[]>) {
      state.route.pulls = payload.map((pull, newPullIndex) => ({
        ...pull,
        color: getPullColor(newPullIndex),
      }))
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setRoute,
  setDungeon,
  importRoute,
  setName,
  addPull,
  selectPull,
  hoverPull,
  toggleSpawn,
  setPulls,
} = reducer.actions