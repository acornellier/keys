import { Panel } from './Common/Panel.tsx'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { selectSelectedSpawn, selectSpawn } from '../store/reducers/hoverReducer.ts'
import { getIconLink } from '../data/spells/mergeSpells.ts'
import { addToast } from '../store/reducers/toastReducer.ts'

import { useDungeon } from '../store/routes/routeHooks.ts'
import { useAppDispatch, useRootSelector } from '../store/storeUtil.ts'

export function MobInfo() {
  const dispatch = useAppDispatch()
  const selectedSpawn = useRootSelector(selectSelectedSpawn)
  const dungeon = useDungeon()
  if (selectedSpawn === null) return

  const mobSpawn = dungeon.mobSpawns[selectedSpawn]
  if (!mobSpawn) return

  const { mob } = mobSpawn
  const spells = dungeon.spells[mob.id]

  const onClickSpellId = async (spellId: number) => {
    await navigator.clipboard.writeText(spellId.toString())
    dispatch(addToast({ message: `Copied Spell ID to clipboard: ${spellId}` }))
  }

  return (
    <div className="fixed bottom-12 sm:bottom-2 left-2 z-10 min-w-[250px]">
      <Panel blue>
        <div>
          <div className="flex items-center justify-between gap-2">
            <a href={`https://www.wowhead.com/npc=${mob.id}`} target="_blank" rel="noreferrer">
              <div className="font-bold text-lg">{mob.name}</div>
            </a>
            <XMarkIcon
              width={20}
              height={20}
              className="cursor-pointer -mt-2"
              onClick={() => dispatch(selectSpawn(null))}
            />
          </div>
          <div className="flex justify-between gap-2">
            <div>{mob.creatureType}</div>
            <div>ID: {mob.id}</div>
          </div>
        </div>
        {spells?.length && (
          <div className="flex flex-col gap-2">
            {spells.map((spell) => (
              <div
                key={spell.id}
                className="h-8 flex items-center border border-gray-500 rounded-md"
              >
                <a
                  href={`https://www.wowhead.com/spell=${spell.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={getIconLink(spell.icon)}
                    width={30}
                    height={30}
                    alt={spell.name}
                    className="rounded-md rounded-r-none"
                  />
                </a>

                <a
                  className="flex-grow h-full"
                  href={`https://www.wowhead.com/spell=${spell.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="gritty flex justify-between items-center gap-2 px-2 h-full bg-fancy-red opacity-90 text-nowrap border border-transparent border-r-gray-500">
                    {spell.name}
                  </div>
                </a>
                <div
                  className="gritty flex w-[70px] justify-between items-center gap-2 px-2 h-full bg-fancy-red rounded-md rounded-l-none opacity-90 cursor-pointer select-none"
                  onClick={() => onClickSpellId(spell.id)}
                >
                  {spell.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}
