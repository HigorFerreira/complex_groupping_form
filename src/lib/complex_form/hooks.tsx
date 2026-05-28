import { useContext as useReactContext,/* useEffect, useMemo, useRef, */type Context, useCallback, useMemo } from 'react'
import type { ContextType, BaseItem, RecordArrayGroups } from './types'
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
        const { structureCounter, data } = useContext('useData', Context)
        return useMemo(() => {
            /**
             * O structureCounter controla quando atualizar os dados no UI
             * isso vai ajudar a atualizar os casos em que "células de formulário"
             * são adicionadas dinânmicamente via append ou remove, evitando que o onChange deles
             * causem renderizações infinitas
             */
            return data?.current
        }, [ structureCounter, data ])
    }

    function useData() {
        const { counter, data } = useContext('useData', Context)
        return useMemo(() => {
            // O counter controla quando atualizar os dados no UI
            return data?.current
        }, [ counter, data ])
    }

    function useAppend() {
        const { setStructureCounter, setCounter, data: ref } = useContext('useAppend', Context)
        function append(group: TGroups, adding_item: Partial<Omit<TItem, 'key'>>) {
            const data = ref?.current
            if(!data) throw new Error('No data')
            if(!data[group]){
                data[group] = []
            }
            const item = { ...adding_item, key: uuidv4() } as Partial<TItem>
            data[group].push(item)
            setStructureCounter?.(prev => prev+1)
            setCounter?.(prev => prev+1)
        }
        return append
    }

    function useRemove(){
        const { setStructureCounter, setCounter, data: ref } = useContext('useRemove', Context)
        function remove(key: string): boolean {
            const data = ref?.current
            if(!data) throw new Error('No data')
            for(const _group_key of Object.keys(data)){
                const group_key = _group_key as TGroups
                const remove_index = data[group_key]?.findIndex(({ key: k }) => k === key)
                if(remove_index === undefined || remove_index < 0) continue
                data[group_key]?.splice(remove_index, 1)
                setStructureCounter?.(prev => prev+1)
                setCounter?.(prev => prev+1)
                return true
            }
            return false
        }
        return remove
    }

    function useSetInitialData(data: RecordArrayGroups< TGroups, TItem >, maxRenders: number = 1) {
        const { setStructureCounter, setCounter, data: ref_object, initial } = useContext('useSetInitialData', Context)
        if(initial?.current.renders){
            initial.current.renders += 1
        }
        if(ref_object?.current) {
            ref_object.current = data
            if(initial?.current.renders??Number.MAX_SAFE_INTEGER >= maxRenders){
                setStructureCounter?.(prev => prev+1)
                setCounter?.(prev => prev+1)
            }
        }
        const reset = useCallback(() => {
            if(initial?.current && initial.current.renders >= maxRenders){
                initial.current.renders = 0
            }
        }, [ initial ])
        
        return reset
    }

    function useUpdate(){
        const { setCounter, data: ref } = useContext('useUpdate', Context)
        const append = useAppend()
        function update(key: string, group: TGroups, item: Partial<Omit<TItem, 'key'>>) {
            const data = ref?.current
            if(!data) throw new Error('No data')
            
            const found_item = data?.[group]?.findIndex(({ key: k }) => k===key)
            if(found_item === undefined || found_item < 0) {
                append(group, item)
                return
            }
            if(data?.[group]?.[found_item]){
                data[group][found_item] = {
                    ...data[group][found_item],
                    ...item
                }
                setCounter?.(prev => prev+1)
            }
        }
        return update
    }

    return { useAppend, useRemove, useUpdate, useDataStructure, useData, useSetInitialData }
}
