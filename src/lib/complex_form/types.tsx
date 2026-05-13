import type { Dispatch, RefObject, SetStateAction } from "react"


export type DataArrItem<TItem extends Partial<BaseItem>> = Array<TItem>
export type DataObjItems<TItem extends Partial<BaseItem>> = Record<string, Partial<TItem>>
export type DataGroups<TGroups extends string, TItem extends Partial<BaseItem>> = Partial< Record<TGroups, Array< TItem >> >
export type DataItemGroup<TGroups extends string> = Partial<Record<string, TGroups>>

export type ContextType<TGroups extends string, TItem extends Partial<BaseItem>> = {
    data_arr: DataArrItem<TItem>
    setDataArr: Dispatch<SetStateAction< DataArrItem<TItem> >>
    data_obj: DataObjItems<TItem>
    setDataObj: Dispatch<SetStateAction< DataObjItems<TItem> >>
    group_list: DataGroups<TGroups, TItem>
    setGroupList: Dispatch<SetStateAction< DataGroups<TGroups, TItem> >>
    item_group: DataItemGroup<TGroups>
    setItemGroup: Dispatch<SetStateAction< DataItemGroup<TGroups> >>
    initialDataSet: RefObject<boolean>
}

export type BaseItem = { key: string } & object

export type DataOperationsOpts<TGroups extends string, TItem extends Partial<BaseItem>> = {
    data_arr_ref: RefObject< DataArrItem<TItem> >
    setDataArr: Dispatch<SetStateAction< DataArrItem<TItem> >>
    data_obj_ref: RefObject< DataObjItems<TItem> >
    setDataObj: Dispatch<SetStateAction< DataObjItems<TItem> >>
    group_list_ref: RefObject< DataGroups<TGroups, TItem> >
    setGroupList: Dispatch<SetStateAction< DataGroups<TGroups, TItem> >>
}

export type GetDataFunction<TGroups extends string, TItem extends Partial<BaseItem>> = 
    ((key: string) => TItem | undefined) &
    ((key: null) => Partial<Record<TGroups, Array<TItem>>>) &
    ((key?: undefined) => Partial<Record<TGroups, Array<TItem>>>) &
    ((key?: any) => any);