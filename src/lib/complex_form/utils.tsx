// import type { Dispatch, RefObject, SetStateAction } from 'react'
// import { v4 as uuidv4 } from 'uuid'

// import type {
//     BaseItem,
//     DataOperationsOpts,
// } from './types'

// export enum LastExec {
//     None,
//     GetByKey,
//     Update,
//     Append,
//     First,
// }

// type CollectReturnMap = {
//     [LastExec.None]: undefined
//     [LastExec.GetByKey]: [Partial<BaseItem>, number]
//     [LastExec.Update]: undefined
//     [LastExec.Append]: undefined
//     [LastExec.First]: Partial<BaseItem> | undefined
// }

// export class DataOperations<
//     TGroups extends string,
//     TItem extends Partial<BaseItem>,
//     TLastExec extends LastExec = LastExec.None
// > {
//     private last_exec: LastExec
//     private stack: unknown[]

//     private data_arr_ref: DataOperations< TGroups, TItem >['data_arr_ref']
//     private data_obj_ref: DataOperations< TGroups, TItem >['data_obj_ref']
//     private group_list_ref: DataOperations< TGroups, TItem >['group_list_ref']
    
//     private setDataArr: DataOperations< TGroups, TItem >['setDataArr']
//     private setDataObj: DataOperations< TGroups, TItem >['setDataObj']
//     private setGroupList: DataOperations< TGroups, TItem >['setGroupList']

//     constructor(
//         opts: DataOperationsOpts< TGroups, TItem >,
//         stack: unknown[] = [],
//         last_exec: LastExec = LastExec.None
//     ) {
//         this.stack = stack
//         this.last_exec = last_exec

//         this.data_arr_ref = opts.data_arr_ref
//         this.data_obj_ref = opts.data_obj_ref
//         this.group_list_ref = opts.group_list_ref

//         this.setDataArr = opts.setDataArr
//         this.setDataObj = opts.setDataObj
//         this.setGroupList = opts.setGroupList
//     }

//     public append(group: TGroups, data: Partial<BaseItem>): DataOperations<TGroups, LastExec.Append> {
        
//     }

//     public first(group: TGroups): DataOperations<TGroups, LastExec.First> {
//     }

//     public getByKey(group: TGroups, key: string): DataOperations<TGroups, LastExec.GetByKey> {
//     }

//     public update(group: TGroups, data: Partial<BaseItem>): DataOperations<TGroups, LastExec.Update> {
//     }

//     public collect(): CollectReturnMap[TLastExec] {
//         return this.stack.pop() as CollectReturnMap[TLastExec]
//     }
// }

export {}