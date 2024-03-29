﻿import { createMigrate } from 'redux-persist'
import { initialState, RouteState } from './routesReducer.ts'
import { StateWithHistory } from 'redux-undo'

type PersistedStateCur = StateWithHistory<RouteState>

type PersistedStatePrev = StateWithHistory<RouteState>

export const routePersistVersion = 6

/*
 * Each migration step will take one version as input and return the next version as output.
 * (The key `2` means that it is the step which migrates from V1 to V2.)
 */
const persistMigrations = {
  [routePersistVersion]: (state: PersistedStatePrev): PersistedStateCur => {
    return {
      ...state,
      past: [],
      future: [],
      present: initialState,
    }
  },
}

type MigrationState = PersistedStateCur | PersistedStatePrev

export const routeMigrate = createMigrate<MigrationState>(persistMigrations)
