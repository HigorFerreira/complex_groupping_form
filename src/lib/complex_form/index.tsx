import { useRef, useState, type PropsWithChildren } from 'react'
import { createContext } from './context'
import { makeHooks } from './hooks'
import type {
    BaseItem,
    RecordArrayGroups,
} from './types'

/**
 * Refatoração:
 * Vou guardar os dados em uma ref e e ter estados contadores para atualizacoes eventuais de UI
 */
export function createForm<TGroups extends string, TItem extends Partial<BaseItem>>() {
    const Context = createContext<TGroups, TItem>()
    const hooks = makeHooks(Context)

    function Provider({ children }: PropsWithChildren) {
        const [ counter, setCounter ] = useState(0)
        const [ structureCounter, setStructureCounter ] = useState(0)

        const data = useRef<RecordArrayGroups< TGroups, TItem >>({})
        const initial = useRef({ renders: 0 })


        return <Context value={{ counter, setCounter, structureCounter, setStructureCounter, initial, data }} >
            { children }
        </Context>
    }

    return { Provider, ...hooks }
}
