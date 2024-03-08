import { Button } from '../../Common/Button.tsx'
import { exportRouteApi } from '../../../api/exportRouteApi.ts'
import { useAppDispatch, useRoute } from '../../../store/hooks.ts'
import { addToast } from '../../../store/toastReducer.ts'
import { ShareIcon } from '@heroicons/react/24/outline'

export function ShareRoute() {
  const dispatch = useAppDispatch()
  const route = useRoute()

  const handleClick = async () => {
    try {
      const str = await exportRouteApi(route)
      addToast(dispatch, 'URL copied to clipboard!')
      const url = window.location.host + `?mdt=${str}`
      return navigator.clipboard.writeText(url)
    } catch (err) {
      addToast(dispatch, `Failed to export MDT string: ${err}`, 'error')
    }
  }

  return (
    <Button short className="flex-1" onClick={handleClick}>
      <ShareIcon width={18} height={18} />
      Share URL
    </Button>
  )
}
