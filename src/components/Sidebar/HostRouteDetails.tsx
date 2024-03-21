import { Panel } from '../Common/Panel.tsx'
import { Button } from '../Common/Button.tsx'
import { ExportRoute } from './Buttons/ExportRoute.tsx'
import { ShareRoute } from './Buttons/ShareRoute.tsx'
import { ArchiveBoxArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline'

import { useRoute, useSavedRoutes } from '../../store/routes/routeHooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from '../../store/storeUtil.ts'
import { saveRoute, updateSavedRoutes } from '../../store/routes/routesReducer.ts'

interface Props {
  collapsed?: boolean
}

export function HostRouteDetails({ collapsed }: Props) {
  const dispatch = useAppDispatch()
  const route = useRoute()
  const savedRoutes = useSavedRoutes()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!savedRoutes.some(({ uid }) => route.uid === uid)) setSaved(false)
  }, [route, savedRoutes])

  const onSave = useCallback(async () => {
    dispatch(updateSavedRoutes())
    await saveRoute(route)
    setSaved(true)
  }, [dispatch, route])

  return (
    <Panel noRightBorder>
      <Button
        Icon={saved ? CheckIcon : ArchiveBoxArrowDownIcon}
        short
        onClick={onSave}
        disabled={saved}
        className={`${collapsed ? '[&]:hidden' : ''}`}
      >
        {saved ? 'Route saved' : "Save host's route locally"}
      </Button>
      <div className={`flex gap-1 ${collapsed ? 'hidden' : ''}`}>
        <ExportRoute />
        <ShareRoute />
      </div>
    </Panel>
  )
}
