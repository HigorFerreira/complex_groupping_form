import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { createContext } from './context'
import { makeHooks } from './hooks'
import type {
    BaseItem,
    DataArrItem,
    DataObjItems,
    DataGroups,
} from './types'

export function createForm<TGroups extends string, TItem extends Partial<BaseItem>>() {
    const Context = createContext<TGroups, TItem>()
    const hooks = makeHooks(Context)

    function Provider({ children }: PropsWithChildren) {
        const initialDataSet = useRef(false)
        const [ data_arr, setDataArr ] = useState<DataArrItem< TItem >>([])
        const [ data_obj, setDataObj ] = useState<DataObjItems< TItem >>({})
        const [ group_list, setGroupList ] = useState<DataGroups< TGroups, TItem >>({})

        useEffect(() => console.log({ data_arr, data_obj, group_list }), [ data_arr, data_obj, group_list ])

        return <Context value={{ initialDataSet, data_arr, setDataArr, data_obj, setDataObj, group_list, setGroupList }} >
            { children }
        </Context>
    }

    return { Provider, ...hooks }
}
