import { RouteDetails } from './RouteDetails.tsx'
import { SharePanel } from './SharePanel.tsx'
import { SidebarCollapser } from './SidebarCollapser.tsx'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'
import { Pulls } from './Pulls/Pulls.tsx'

const margin = 8
const width = 285

export function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebarCollaposed', false)

  return (
    <div
      className="fixed right-0 z-20 flex flex-col gap-3"
      style={{
        width,
        margin: `${margin}px 0`,
        maxHeight: `calc(100% - 2*${margin}px)`,
        right: collapsed ? -width : 0,
        transition: '150ms all',
      }}
    >
      <SidebarCollapser collapsed={collapsed} setCollapsed={setCollapsed} />
      <RouteDetails />
      <SharePanel />
      <Pulls />
    </div>
  )
}
