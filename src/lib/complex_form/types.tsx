import type { Dispatch, RefObject, SetStateAction } from "react"

export type DataArrItem<TItem extends Partial<BaseItem>> = Array<TItem>
export type DataObjItems<TItem extends Partial<BaseItem>> = Record<string, Partial<TItem>>
export type DataGroups<TGroups extends string, TItem extends Partial<BaseItem>> = Partial< Record<TGroups, Array< TItem >> >
export type DataItemGroup<TGroups extends string> = Partial<Record<string, TGroups>>

export type RecordArrayGroups<G extends string, T> =
    Partial<Record< G, Array<Partial<T>> >>
    
export type BaseItem = { key: string } & object

export type ContextType<TGroups extends string, TItem extends Partial<BaseItem>> = {
    counter: number
    structureCounter: number
    setCounter: Dispatch<SetStateAction<number>>
    setStructureCounter: Dispatch<SetStateAction<number>>
    data: RefObject< RecordArrayGroups< TGroups, TItem > >
    initial: RefObject<{ renders: number }>
}
