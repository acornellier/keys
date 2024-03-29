import { Drawing } from './Drawing.tsx'

import { useRoute } from '../../../store/routes/routeHooks.ts'

export function Drawings() {
  const route = useRoute()

  return route.drawings.map((drawing, index) => <Drawing key={index} drawing={drawing} />)
}
