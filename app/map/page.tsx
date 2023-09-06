import { Map } from '@/components/map'

const isServer = typeof window === 'undefined'

export default function Home() {
  console.warn(`Home isServer: ${isServer}`)
  return (
    <div>
      <Map />
    </div>
  )
}
