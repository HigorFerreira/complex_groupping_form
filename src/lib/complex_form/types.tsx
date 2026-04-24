import type { Dispatch, RefObject, SetStateAction } from "react"


export type ContextType<TGroups extends string> = {
    data: DataState<TGroups>
    setData: Dispatch<SetStateAction<DataState<TGroups>>>
    initialDataSet: RefObject<boolean>
}

export type Item = {
    key: string
    label: string
    value: string
    extra_value: string
    options: string
    image: string
}

export type DataState<TGroups extends string> = Record<TGroups, Array<Partial<Item>>>