import type { Dispatch, SetStateAction } from "react"


export type ContextType<TGroups extends string> = {
    data: DataState<TGroups>
    setData: Dispatch<SetStateAction<DataState<TGroups>>>
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