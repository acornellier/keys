import { Button } from '../../Common/Button.tsx'
import { useAppDispatch, useIsGuestCollab } from '../../../store/hooks.ts'
import { newRoute } from '../../../store/routes/routesReducer.ts'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { TooltipStyled } from '../../Common/TooltipStyled.tsx'

export function NewRoute() {
  const dispatch = useAppDispatch()
  const isGuestCollab = useIsGuestCollab()

  return (
    <>
      <Button
        Icon={PlusCircleIcon}
        data-tooltip-id="new-route-tooltip"
        short
        className="flex-1"
        onClick={() => dispatch(newRoute())}
        disabled={isGuestCollab}
      />
      <TooltipStyled id="new-route-tooltip">New empty route</TooltipStyled>
    </>
  )
}
