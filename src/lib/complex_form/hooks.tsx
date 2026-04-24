import { useContext, useEffect, useRef, type Context } from 'react'
import type { ContextType, DataState } from './types'
import { DataOperations } from './utils'

export function makeHooks<TGroups extends string>(
    Context: Context<ContextType<TGroups> | null>
) {
    function useData() {
        const { data } = useContext(Context) ?? {}
        return data
    }

    function useDataOperations(): DataOperations<TGroups> {
        const ctx = useContext(Context)
        if (!ctx) throw new Error('useDataOperations deve ser usado dentro do Provider')

        // Ref sempre atualizado com o data mais recente — sem causar re-render
        const dataRef = useRef(ctx.data)
        /* eslint-disable-next-line */
        dataRef.current = ctx.data

        // Instância estável: criada uma vez por mount, nunca muda de referência.
        // getByKey() sempre lê de dataRef.current → sem dados obsoletos.
        // setData de useState é garantidamente estável pelo React.
        const dopRef = useRef<DataOperations<TGroups> | null>(null)
        /* eslint-disable-next-line */
        if (!dopRef.current) {
            dopRef.current = new DataOperations(dataRef, ctx.setData)
        }

        /* eslint-disable-next-line */
        return dopRef.current
    }

    function useInitialData(data?: Partial<DataState<TGroups>>){
        const ctx = useContext(Context)
        if (!ctx) throw new Error('useInitialData deve ser usado dentro do Provider')
        const { setData, initialDataSet } = ctx
        useEffect(() => {
            if(data && Object.keys(data).length > 0 && !initialDataSet.current){
                setData(prev => {
                    return {
                        ...prev,
                        ...data,
                    }
                })
                initialDataSet.current = true
            }
        }, [ initialDataSet, data, setData ])    
    }

    return { useData, useDataOperations, useInitialData }
}
