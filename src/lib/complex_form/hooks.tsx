import { useContext as useReactContext,/* useEffect, useMemo, useRef, */type Context, useCallback } from 'react'
import type { ContextType, BaseItem, GetDataFunction,/* DataObjItems*/ } from './types'
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
        const get_data = useCallback(
            ((key: string | null = null): any => {
                // 1. Handle string key (returns single item or undefined)
                if (typeof key === "string") {
                    return data_obj?.[key];
                }

                // 2. Handle null/undefined (returns the grouped record)
                const data = {} as Partial<Record<TGroups, TItem[]>>;
                
                if (group_list) {
                    (Object.keys(group_list) as TGroups[]).forEach((groupKey) => {
                        // @ts-expect-error
                        data[groupKey] = group_list[groupKey]?.map(item => {
                            return data_obj?.[item.key ?? ''];
                        }) ?? [];
                    });
                }

                return data;
            }) as GetDataFunction<TGroups, TItem>, // Cast to your overloaded type here
            [data_obj, group_list]
        );

        return get_data
    }

    function useAppend() {
        const { setDataArr, setDataObj, setGroupList, setItemGroup } = useContext('useAppend', Context)
        function append(group: TGroups, item: Partial<Omit<TItem, 'key'>>) {
            const key = uuidv4()
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

    function useSetInitialData() {
        const { initialDataSet, setDataArr, setDataObj, setGroupList, setItemGroup } = useContext('useSetInitialData', Context)

        function setInitialData(grouped_data: Partial<Record<TGroups, Array<Partial<Omit<TItem, 'key'>> & { key?: string }>>>) {
            if (initialDataSet?.current) return

            const new_data_arr: Array<TItem> = []
            const new_data_obj: Record<string, Partial<TItem>> = {}
            const new_group_list: Partial<Record<TGroups, Array<TItem>>> = {}
            const new_item_group: Partial<Record<string, TGroups>> = {}

            ;(Object.keys(grouped_data) as TGroups[]).forEach(group => {
                const items = grouped_data[group] ?? []
                new_group_list[group] = []
                items.forEach(item => {
                    const key = item.key ?? uuidv4()
                    const full_item = { ...item, key } as TItem
                    new_data_arr.push(full_item)
                    new_data_obj[key] = full_item
                    new_group_list[group]!.push(full_item)
                    new_item_group[key] = group
                })
            })

            setDataArr?.(new_data_arr)
            setDataObj?.(new_data_obj)
            setGroupList?.(new_group_list)
            setItemGroup?.(new_item_group)

            if (initialDataSet) initialDataSet.current = true
        }

        return setInitialData
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

    return { useAppend, useRemove, useUpdate, useDataStructure, useData, useSetInitialData }
}
