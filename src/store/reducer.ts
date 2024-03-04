﻿import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MdtRoute, Pull, Route } from '../code/types.ts'
import { DungeonKey, MobSpawn } from '../data/types.ts'
import { dungeonsByKey } from '../data/dungeons.ts'
import { mdtRouteToRoute } from '../code/mdtUtil.ts'
import { mobSpawnsEqual } from '../code/mobSpawns.ts'
import undoable, { includeAction } from 'redux-undo'

export interface State {
  route: Route
  hoveredPull: number | null
  hoveredMobSpawn: MobSpawn | null
}

const defaultDungeonKey: DungeonKey = 'eb'
export const lastDungeonKey = 'lastDungeonKey'
export const routeLocalStorageKey = 'savedRoute'

const emptyPull = { id: 0, mobSpawns: [] }

const makeEmptyRoute = (dungeonKey: DungeonKey): Route => ({
  name: 'New route',
  dungeonKey,
  selectedPull: 0,
  pulls: [emptyPull],
  uid: '',
})

function getRouteByLocalStorage(dungeonKey?: DungeonKey): Route {
  const dungeon = dungeonKey ?? window.localStorage.getItem(lastDungeonKey) ?? defaultDungeonKey
  const item = window.localStorage.getItem(routeLocalStorageKey + dungeon)
  return item ? JSON.parse(item) : makeEmptyRoute(dungeon as DungeonKey)
}

const initialState: State = {
  route: getRouteByLocalStorage(),
  hoveredPull: null,
  hoveredMobSpawn: null,
}

const findSelectedPull = (route: Route, mobSpawn: MobSpawn) =>
  route.pulls.findIndex((pull) =>
    pull.mobSpawns.some((mobSpawn2) => mobSpawnsEqual(mobSpawn, mobSpawn2)),
  )

function toggleSpawnAction(
  route: Route,
  payload: { mobSpawn: MobSpawn; individual: boolean },
): Pull[] {
  const data = dungeonsByKey[route.dungeonKey]

  const origSelectedPull = findSelectedPull(route, payload.mobSpawn)

  const groupSpawns = payload.individual
    ? [{ mobSpawn: payload.mobSpawn, selectedPull: origSelectedPull }]
    : data.mdt.enemies
        .flatMap((mob) => mob.spawns.map((spawn) => ({ mob, spawn })))
        .filter(
          (mobSpawn) =>
            mobSpawnsEqual(mobSpawn, payload.mobSpawn) ||
            (payload.mobSpawn.spawn.group !== null &&
              mobSpawn.spawn.group === payload.mobSpawn.spawn.group),
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

function addPullFunc(state: State, newPullIndex: number = state.route.pulls.length) {
  const maxId = state.route.pulls.reduce<number>((acc, pull) => (pull.id > acc ? pull.id : acc), 0)
  const newPull = { id: maxId + 1, mobSpawns: [] }
  state.route.pulls.splice(newPullIndex, 0, newPull)
  state.route.selectedPull = newPullIndex
}

const baseReducer = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setDungeon(state, { payload }: PayloadAction<DungeonKey>) {
      state.route = getRouteByLocalStorage(payload)
      state.hoveredPull = null
    },
    newRoute(state) {
      console.log('newroute')
      state.route = makeEmptyRoute(state.route.dungeonKey)
      state.hoveredPull = null
    },
    importRoute(state, { payload }: PayloadAction<MdtRoute>) {
      state.route = mdtRouteToRoute(payload)
      state.hoveredPull = null
    },
    clearRoute(state) {
      state.route.pulls = [emptyPull]
      state.hoveredPull = null
    },
    setName(state, { payload }: PayloadAction<string>) {
      state.route.name = payload
    },
    addPull(state, { payload = state.route.pulls.length }: PayloadAction<number | undefined>) {
      addPullFunc(state, payload)
    },
    prependPull(state) {
      addPullFunc(state, state.route.selectedPull)
    },
    appendPull(state) {
      addPullFunc(state, state.route.selectedPull + 1)
    },
    deletePull(state, { payload = state.route.selectedPull }: PayloadAction<number | undefined>) {
      state.route.pulls = state.route.pulls.filter((_, index) => index !== payload)
      if (state.route.selectedPull >= state.route.pulls.length) {
        state.route.selectedPull -= 1
      }
    },
    selectPull(state, { payload }: PayloadAction<number>) {
      if (payload >= 0 && payload < state.route.pulls.length) {
        state.route.selectedPull = payload
      }
    },
    selectPullRelative(state, { payload }: PayloadAction<number>) {
      const newIndex = state.route.selectedPull + payload
      if (newIndex >= 0 && newIndex < state.route.pulls.length) {
        state.route.selectedPull = newIndex
      }
    },
    hoverPull(state, { payload }: PayloadAction<number | null>) {
      state.hoveredPull = payload
    },
    hoverMobSpawn(state, { payload }: PayloadAction<MobSpawn | null>) {
      state.hoveredMobSpawn = payload
    },
    toggleSpawn(state, { payload }: PayloadAction<{ mobSpawn: MobSpawn; individual: boolean }>) {
      state.route.pulls = toggleSpawnAction(state.route, payload)
    },
    setPulls(state, { payload }: PayloadAction<Pull[]>) {
      state.route.pulls = payload
    },
  },
})

export const reducer = undoable(baseReducer.reducer, {
  filter: includeAction([
    baseReducer.actions.newRoute.type,
    baseReducer.actions.clearRoute.type,
    baseReducer.actions.addPull.type,
    baseReducer.actions.prependPull.type,
    baseReducer.actions.appendPull.type,
    baseReducer.actions.deletePull.type,
    baseReducer.actions.toggleSpawn.type,
    baseReducer.actions.setPulls.type,
  ]),
})

// Action creators are generated for each case reducer function
export const {
  setDungeon,
  newRoute,
  importRoute,
  clearRoute,
  setName,
  addPull,
  prependPull,
  appendPull,
  deletePull,
  selectPull,
  selectPullRelative,
  hoverPull,
  hoverMobSpawn,
  toggleSpawn,
  setPulls,
} = baseReducer.actions
