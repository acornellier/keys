import { useState } from 'react'
import { MdtRoute } from '../../code/types.ts'
import { Button } from '../Common/Button.tsx'
import { useAppDispatch } from '../../store/hooks.ts'
import { useToasts } from '../Toast/useToasts.ts'
import { importRoute } from '../../api/importRoute.ts'
import { importRoute as importRouteAction } from '../../store/routesReducer.ts'

const eb =
  '!WA:2!fb5slnmquuyKHHqmecjHqXPiQnOIrenn9HjIkwFHkIAvRiIiTjZeIgt00eRf)x4sx6YUSRk(Rq)R4sxzgIp2CH75C(Uh4ouJAX4hJBTwGt3XlvRdgFd4vhpcXZoXpUlSyINt)T8IpPtSBjD3nR)qt)eCJ(2jrr4G4dt89v(8NLJtA5JFa7dUt8hLnscCXHb7484hp3g7JTJ9cdgU(DPuTFBaeybGIAa4BaidlhF7KoDFcbq81Td9dJIujedmHizIaslMgLzfeJgltVrYp6ytilQKtWIbY(oFKknMjzaCinowe3xRw1CPLNBEDJYtRo5mZAPikJa0C0dAGd04fq8FT5ARV9oNE25xC5b7T)rhNDNwlMwyfeOIurlrzbPYAmWmsITbovD38JOKlvM7VIPYg9U17MW7BAJDVsQ6)Lzs2QG(ciqbDD6OyMdLIqDmEHLJjNOScVqb9Y0ev(L1SLbonrjeK6aPoWmwk9uPSxpH6yPVcQyZI0Y(ga'

const bigEb =
  '!WA:2!JXWCQKuROKl5y5PwC(5MQcfLFPLKQtLNAQzZ8IsjZ0slZKlnNsQKvJknZuwuQLLMzjBH5gvHjbvwI5uAQHTPKlTOIsnVscO0CYHXpbLtWLMuoPwwQ5WCbccvexknV0tn)88mLkU4Kko1Csn5sYm)84kOcaQRILAhcY4PevybzLFj5KBEzNzXxGGYRiRskTGcZpVIko3SZjZYQ8ccS9o7U3(RT(gBU1IlT8kRMv2bQw(fuyrfp0WJm6y92x)dm44tm5utF2ZD(lCX6QVHgBQ5wATT27OZU6UNkRQ6AQTKslR8kMz25MFHmpXjp1PpZvXoqDd0m4KvMRIFUzNvozMxPywkMNLOcZmRCYoVClOvCYmRGerkMVLIkds38YpqlLzw1IvMHGKI5Gso)CYVOIuoT0mo10sdaa'

export function ImportRoute() {
  const dispatch = useAppDispatch()
  const [input, setInput] = useState(eb)

  const { addToast } = useToasts()

  const handleClick = () => {
    importRoute(input).then((mdtRoute: MdtRoute) => {
      dispatch(importRouteAction(mdtRoute))
      addToast('Route imported!')
    })
  }

  return (
    <Button data-tooltip-id="import-route-tooltip" short className="flex-1" onClick={handleClick}>
      Import MDT
    </Button>
  )
}
