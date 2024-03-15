﻿import { useMemo } from 'react'
import { DungeonKey } from '../../data/types.ts'
import { dungeons } from '../../data/dungeons.ts'
import { useAppDispatch, useDungeon } from '../../store/hooks.ts'
import { setDungeon } from '../../store/routes/routesReducer.ts'
import { Dropdown, DropdownOption } from '../Common/Dropdown.tsx'

const options: DropdownOption[] = dungeons.map((dungeon) => ({
  id: dungeon.key,
  label: dungeon.name,
  icon: (
    <img
      className="rounded border-2 border-gray-600"
      height={36}
      width={36}
      src={`https://wow.zamimg.com/images/wow/icons/large/${dungeon.icon}.jpg`}
      alt={dungeon.name}
    />
  ),
}))

export function DungeonDropdown() {
  const dispatch = useAppDispatch()
  const dungeon = useDungeon()

  const selected = useMemo(() => options.find((option) => option.id === dungeon.key)!, [dungeon])

  return (
    <div className="min-w-[260px]">
      <Dropdown
        className="dungeon-dropdown"
        options={options}
        selected={selected}
        onSelect={(newDungeon) => dispatch(setDungeon(newDungeon.id as DungeonKey))}
      />
    </div>
  )
}
