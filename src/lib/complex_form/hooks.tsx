import { useContext as useReactContext, useEffect, useMemo, useRef, type Context } from 'react'
import type { ContextType, BaseItem } from './types'
// import { DataOperations } from './utils'
import { v4 as uuidv4 } from 'uuid'

function useContext<T>(hook_name: string, context: Context<T>): Partial<NonNullable< T >> {
    const ctx = useReactContext(context)
    if(ctx === undefined) throw new Error(`Hook ${hook_name} used outside a context`)
    return ctx??{}
}

export function makeHooks<TGroups extends string, TItem extends Partial<BaseItem>>(
    Context: Context< ContextType< TGroups, TItem > | null >
) {


    function useAppend() {
        const { setDataArr, setDataObj, setGroupList } = useContext('useAppend', Context)
        const key = uuidv4()

        function append(group: TGroups, item: Partial<Omit<TItem, 'key'>>) {
            // @ts-expect-error Annotation throuble
            setDataArr?.(prev => [
                ...prev,
                { ...item, key }
            ])
            // @ts-expect-error Annotation throuble
            setDataObj?.(prev => ({
                ...prev,
                [key]: {
                    ...item,
                    key
                }
            }))
            setGroupList?.(prev => ({
                ...prev,
                [group]: [
                    ...(prev?.[group]??[]),
                    { ...item, key }
                ]
            }))
        }
        
        return append
    }


    return { useAppend }
}
