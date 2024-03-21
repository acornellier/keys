﻿import { DungeonDropdown } from './DungeonDropdown.tsx'
import { Button } from '../Common/Button.tsx'
import { useIsGuestCollab } from '../../store/collab/collabReducer.ts'
import { RouteDropdown } from '../Sidebar/RouteDropdown.tsx'
import { RenameRoute } from '../Sidebar/Buttons/RenameRoute.tsx'
import { useState } from 'react'
import { sidebarWidth } from '../Sidebar/Sidebar.tsx'
import { UndoRedo } from './UndoRedo.tsx'
import { isMobile } from '../../util/dev.ts'

export const dropdownWidth = 260

export function Header() {
  const isGuestCollab = useIsGuestCollab()
  const [isRenaming, setRenaming] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-20 w-full grid items-center pointer-events-none">
      <div className="pointer-events-none flex flex-col items-start gap-4 lg: flex-row]">
        <div
          className="w-fit flex gap-4 flex-col flex-wrap items-start sm:flex-row sm:items-stretch pointer-events-auto"
          style={{
            maxWidth: isMobile ? '' : `calc(100% - ${sidebarWidth + 32}px)`,
          }}
        >
          <Button twoDimensional className="min-w-fit" innerClass="text-2xl">
            <img src="/images/favicon2.png" alt="logo" width={36} className="min-w-[36] mr-1" />
            <div>Threechest</div>
          </Button>
          <div className="h-full" style={{ width: dropdownWidth }}>
            <DungeonDropdown />
          </div>
          <div className="flex gap-2 pointer-events-auto">
            {!isRenaming && (
              <div className="h-full" style={{ width: dropdownWidth }}>
                <RouteDropdown />
              </div>
            )}
            <RenameRoute isRenaming={isRenaming} setRenaming={setRenaming} />
          </div>
        </div>
        {!isGuestCollab && (
          <div className="hidden md:block pointer-events-auto">
            <UndoRedo />
          </div>
        )}
      </div>
    </div>
  )
}
