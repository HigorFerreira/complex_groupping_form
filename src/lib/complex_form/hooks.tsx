import { useContext as useReactContext, useEffect, useMemo, useRef, type Context, useCallback } from 'react'
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

    function useDataStructure() {
        const { group_list } = useContext('useDataStructure', Context)
        const ret: NonNullable<typeof group_list> = !group_list
            ? {}
            : group_list
        return ret
    }

    function useData() {
        const { data_obj, group_list } = useContext('useData', Context)
        const get_data = useCallback((key: string | null = null) => {
            if(key) return data_obj?.[key]
            const data = {} as NonNullable< typeof group_list >
            console.log({ group_list })
            Object.keys(group_list??{}).forEach(key => {
                console.log(key)
                const _key = key as TGroups
                // @ts-expect-error Annotation
                data[_key] = data[_key]?.map(({ key }) => {
                    return data_obj?.[key??'']
                })??[]
            })
            console.log({ data })
        }, [ data_obj, group_list ])

        return get_data
    }

    function useAppend() {
        const { setDataArr, setDataObj, setGroupList, setItemGroup } = useContext('useAppend', Context)
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
            setItemGroup?.(prev => ({
                ...prev,
                [key]: group,
            }))
        }
        
        return append
    }

    function useRemove(){
        const { data_obj, data_arr, group_list, item_group, setDataArr, setDataObj, setGroupList, setItemGroup } = useContext('useRemove', Context)
        function remove(key: string){
            const item = data_obj?.[key]
            if(!item) return null
            const removed_item = { ...item }

            const new_data_obj = { ...(data_obj??{}) }
            const new_data_arr = [ ...(data_arr??[]) ]
            const new_group_list = { ...(group_list??{}) } as typeof group_list
            const new_item_group = { ...(item_group??{}) } as typeof item_group

            delete new_data_obj[key]
            new_data_arr.splice(new_data_arr.findIndex(item => item.key === key), 1)
            {
                const group = new_group_list?.[new_item_group?.[key] as TGroups]
                group?.splice(group.findIndex(item => item.key === key), 1)                
            }
            delete new_item_group?.[key]
            
            setDataArr?.(new_data_arr)
            setDataObj?.(new_data_obj)
            setGroupList?.(new_group_list??{})
            setItemGroup?.(new_item_group??{})

            return removed_item
        }
        return remove
    }

    function useUpdate(){
        const { data_obj, setDataObj } = useContext('useUpdate', Context)
        const append = useAppend()
        function update(key: string, group: TGroups, item: Partial<Omit<TItem, 'key'>>) {
            const current_item = data_obj?.[key]
            if(!current_item) {
                append(group, item)
            }
            else {
                setDataObj?.(prev => {
                    const current_item = prev?.[key]
                    return {
                        ...prev,
                        [key]: {
                            ...current_item,
                            ...item
                        }
                    }
                })
            }
        }

        return update
    }

    return { useAppend, useRemove, useUpdate, useDataStructure, useData }
}
