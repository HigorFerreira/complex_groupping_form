import { useContext, useEffect, useMemo, useRef, type Context } from 'react'
import type { ContextType, BaseItem } from './types'
import { DataOperations } from './utils'

export function makeHooks<TGroups extends string, TItem extends Partial<BaseItem>>(
    Context: Context< ContextType< TGroups, TItem > | null >
) {
    function useData(){
        const ctx = useContext(Context)
        if(ctx === undefined) throw new Error('Hook useData used outside a context')
        const { group_list, data_obj } = ctx??{}
        const data = useMemo(() => {
             
        }, [ group_list, data_obj ])
    }
}
