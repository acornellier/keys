import { useCallback } from 'react'
import {
  addPull,
  appendPull,
  clearPull,
  deletePull,
  prependPull,
  selectPull,
  selectPullRelative,
} from '../../../store/routes/routesReducer.ts'
import { useShortcut } from '../../../util/hooks/useShortcut.ts'
import { shortcuts } from '../../../data/shortcuts.ts'

import { useAppDispatch } from '../../../store/storeUtil.ts'

export function usePullShortcuts() {
  const dispatch = useAppDispatch()

  const onKeyBackspace = useCallback(() => dispatch(deletePull({ moveUp: true })), [dispatch])
  useShortcut(shortcuts.backspacePull, onKeyBackspace, { allowRepeat: true })

  const onKeyDelete = useCallback(() => dispatch(deletePull({})), [dispatch])
  useShortcut(shortcuts.deletePull, onKeyDelete, { allowRepeat: true })

  const onAppend = useCallback(() => dispatch(appendPull()), [dispatch])
  useShortcut(shortcuts.appendPull, onAppend)

  const onAppendToEnd = useCallback(() => dispatch(addPull()), [dispatch])
  useShortcut(shortcuts.addPull, onAppendToEnd)

  const onPrepend = useCallback(() => dispatch(prependPull()), [dispatch])
  useShortcut(shortcuts.prependPull, onPrepend)

  const onClearPull = useCallback(() => dispatch(clearPull()), [dispatch])
  useShortcut(shortcuts.clearPull, onClearPull)

  const onPullDown = useCallback(() => dispatch(selectPullRelative(1)), [dispatch])
  useShortcut(shortcuts.pullDown, onPullDown, { allowRepeat: true })

  const onPullUp = useCallback(() => dispatch(selectPullRelative(-1)), [dispatch])
  useShortcut(shortcuts.pullUp, onPullUp, { allowRepeat: true })

  const onNumberKey = useCallback(
    (e: KeyboardEvent) => {
      let num = Number(e.key)
      if (num === 0) num += 10
      dispatch(selectPull(num - 1))
    },
    [dispatch],
  )
  useShortcut(shortcuts.selectPullNumber, onNumberKey)
}
