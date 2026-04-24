import { useRef, useState, type PropsWithChildren } from 'react'
import { createFormContext } from './context'
import { makeHooks } from './hooks'
import type { DataState } from './types'

export function createForm<TGroups extends string>() {
    const Context = createFormContext<TGroups>()
    const hooks   = makeHooks(Context)

    function Provider({ children }: PropsWithChildren) {
        const initialDataSet = useRef(false)
        const [ data, setData ] = useState<DataState<TGroups>>({} as DataState<TGroups>)

        return <Context value={{ data, setData, initialDataSet, }}>
            { children }
        </Context>
    }

    return { Provider, ...hooks }
}
