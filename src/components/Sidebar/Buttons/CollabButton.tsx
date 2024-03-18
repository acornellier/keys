import { Button } from '../../Common/Button.tsx'
import { useAppDispatch, useRootSelector } from '../../../store/hooks.ts'
import { endCollab, joinCollab, startCollab } from '../../../store/reducers/collabReducer.ts'
import { useCallback, useEffect } from 'react'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { Collab } from '../../Collab/Collab.tsx'
import { addToast } from '../../../store/reducers/toastReducer.ts'
import { generateSlug } from 'random-word-slugs'

export function CollabButton() {
  const dispatch = useAppDispatch()
  const { active, room } = useRootSelector((state) => state.collab)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const collabRoom = urlParams.get('collab')
    if (collabRoom) {
      dispatch(joinCollab(collabRoom))
    }
  }, [dispatch])

  const shareUrl = useCallback(
    async (room: string) => {
      const url = window.location.host + `?collab=${room}`
      await navigator.clipboard.writeText(url)
      dispatch(addToast({ message: 'Collab URL copied to clipboard!' }))
    },
    [dispatch],
  )

  const onClick = useCallback(async () => {
    if (active) {
      dispatch(endCollab())
      dispatch(addToast({ message: 'Collab ended.', type: 'info' }))
    } else {
      const room = generateSlug()
      dispatch(startCollab(room))
      await shareUrl(room)
    }
  }, [dispatch, active, shareUrl])

  const onShare = useCallback(() => shareUrl(room), [room, shareUrl])

  return (
    <div className="flex gap-1">
      <Button
        color={active ? 'green' : 'red'}
        Icon={UserGroupIcon}
        outline={!active}
        short
        onClick={onClick}
        className="w-full"
      >
        {!active ? 'Start Collab' : 'Collab active'}
      </Button>
      {active && (
        <>
          <Collab />
          <Button outline short onClick={onShare}>
            Share room
          </Button>
        </>
      )}
    </div>
  )
}