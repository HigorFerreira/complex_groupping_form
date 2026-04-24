import {
    useData as __useData,
    useDataOperations as __useDataOperations,
} from '.'
import type { DataState } from '../types'
import type { DataOperations } from '../utils'

export function useData<TGroups extends string>(){
    return __useData() as unknown as DataState<TGroups>
}

export function useDataOperations<TGroups extends string>(){
    return __useDataOperations() as unknown as DataOperations<TGroups>
}