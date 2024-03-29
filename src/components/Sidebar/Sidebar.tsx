import { RouteDetails } from './RouteDetails.tsx'
import { SidebarCollapser } from './SidebarCollapser.tsx'
import { Pulls } from './Pulls/Pulls.tsx'
import { CollabPanel } from '../Collab/CollabPanel.tsx'
import { useState } from 'react'
import { HostRouteDetails } from './HostRouteDetails.tsx'
import { useIsGuestCollab } from '../../store/collab/collabReducer.ts'
import { MiniPulls } from './Pulls/MiniPulls.tsx'
import { isMobile } from '../../util/dev.ts'
import { useAppDispatch, useRootSelector } from '../../store/storeUtil.ts'
import { setSidebarCollapsed } from '../../store/reducers/mapReducer.ts'

export const sidebarWidth = 290
const marginTop = 8
const marginBottom = 60

export function Sidebar() {
  const dispatch = useAppDispatch()
  const topCollapsed = useRootSelector((state) => state.map.sidebarCollapsed)
  const [bottomCollapsed, setBottomCollapsed] = useState(false)
  const isBottomCollapsed = !topCollapsed || bottomCollapsed
  const isGuestCollab = useIsGuestCollab()

  return (
    <>
      <div
        className="fixed pt-16 md:pt-0 z-20 flex flex-col gap-1.5 transition-all"
        style={{
          width: sidebarWidth,
          marginTop,
          marginBottom,
          maxHeight: `calc(100% - ${marginTop}px - ${marginBottom}px)`,
          right: topCollapsed ? -sidebarWidth : 0,
        }}
      >
        <SidebarCollapser
          collapsed={topCollapsed}
          setCollapsed={() => dispatch(setSidebarCollapsed(!topCollapsed))}
        />
        {isGuestCollab ? <HostRouteDetails /> : <RouteDetails />}
        <CollabPanel />
        <Pulls />
      </div>
      <div
        className="fixed z-20 transition-all"
        style={{
          width: sidebarWidth,
          marginTop,
          marginBottom: isMobile ? marginTop : marginBottom,
          maxHeight: `calc(100% - ${marginTop}px - ${marginBottom}px)`,
          right: isBottomCollapsed ? -sidebarWidth : 0,
          bottom: 0,
        }}
      >
        {topCollapsed && (
          <>
            <SidebarCollapser collapsed={bottomCollapsed} setCollapsed={setBottomCollapsed} />
            <MiniPulls />
          </>
        )}
      </div>
    </>
  )
}
