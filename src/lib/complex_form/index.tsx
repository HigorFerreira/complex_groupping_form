import { useRef, useState, type PropsWithChildren } from 'react'
import { createContext } from './context'
import { makeHooks } from './hooks'
import type {
    BaseItem,
    DataArrItem,
    DataObjItems,
    DataGroups,
    DataItemGroup,
} from './types'

export function createForm<TGroups extends string, TItem extends Partial<BaseItem>>() {
    const Context = createContext<TGroups, TItem>()
    const hooks = makeHooks(Context)

    function Provider({ children }: PropsWithChildren) {
        const initialDataSet = useRef(false)
        const [ data_arr, setDataArr ] = useState<DataArrItem< TItem >>([])
        const [ data_obj, setDataObj ] = useState<DataObjItems< TItem >>({})
        const [ group_list, setGroupList ] = useState<DataGroups< TGroups, TItem >>({})
        const [ item_group, setItemGroup ] = useState<DataItemGroup< TGroups >>({})

        // useEffect(() => console.log({ data_arr, data_obj, group_list, item_group }), [ data_arr, data_obj, group_list, item_group ])

        return <Context value={{ initialDataSet, data_arr, setDataArr, data_obj, setDataObj, group_list, setGroupList, item_group, setItemGroup, }} >
            { children }
        </Context>
    }

    return { Provider, ...hooks }
}
