import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import type { DataState, Item } from './types'
import { v4 as uuidv4 } from 'uuid'

export enum LastExec {
    None,
    GetByKey,
    Update,
    Append,
    First,
}

type CollectReturnMap = {
    [LastExec.None]: undefined
    [LastExec.GetByKey]: [Partial<Item>, number]
    [LastExec.Update]: undefined
    [LastExec.Append]: undefined
    [LastExec.First]: Partial<Item> | undefined
}

export class DataOperations<
    TGroups extends string,
    TLastExec extends LastExec = LastExec.None
> {
    private last_exec: LastExec
    private stack: unknown[]
    // dataRef em vez de data: lê sempre o valor mais recente sem criar nova instância
    private dataRef: MutableRefObject<DataState<TGroups>>
    private setData: Dispatch<SetStateAction<DataState<TGroups>>>

    constructor(
        dataRef: MutableRefObject<DataState<TGroups>>,
        setData: Dispatch<SetStateAction<DataState<TGroups>>>,
        stack: unknown[] = [],
        last_exec: LastExec = LastExec.None
    ) {
        this.dataRef = dataRef
        this.setData = setData
        this.stack = stack
        this.last_exec = last_exec
    }

    public append(group: TGroups, data: Partial<Item>): DataOperations<TGroups, LastExec.Append> {
        
        this.setData(prev => {
            const prevGroup = [ ...(prev[group] ?? []) ]
            return {
                ...prev,
                [group]: [...prevGroup, { ...data, key: data.key ?? uuidv4() }]
            }
        })

        return new DataOperations<TGroups, LastExec.Append>(
            this.dataRef, this.setData, [undefined], LastExec.Append
        )
    }

    public first(group: TGroups): DataOperations<TGroups, LastExec.First> {
        const data = this.dataRef.current
        const first_data = data?.[group]?.[0]
        const chainedStack = [ first_data ]

        return new DataOperations<TGroups, LastExec.First>(
            this.dataRef, this.setData, chainedStack, LastExec.First
        )
    }

    public getByKey(group: TGroups, key: string): DataOperations<TGroups, LastExec.GetByKey> {
        const data = this.dataRef.current
        const item_index = data?.[group]?.findIndex(({ key: obj_key }) => obj_key === key) ?? -1

        // Stack isolado por cadeia — múltiplos getByKey() do mesmo dop não interferem
        // Quando não encontrado, passa { key } para que update() use-a como chave do novo item
        const chainStack: unknown[] = []
        if (item_index < 0) {
            chainStack.push([{ key }, -1])
        } else {
            chainStack.push([data[group][item_index], item_index])
        }

        return new DataOperations<TGroups, LastExec.GetByKey>(
            this.dataRef, this.setData, chainStack, LastExec.GetByKey
        )
    }

    public update(group: TGroups, data: Partial<Item>): DataOperations<TGroups, LastExec.Update> {
        const [old_item, old_item_index]: [ Partial<Item> | undefined, number ] =
            this.last_exec === LastExec.GetByKey
                ? (this.stack.pop() as CollectReturnMap[LastExec.GetByKey])
                : this.last_exec === LastExec.First
                    ? [  (this.stack.pop() as CollectReturnMap[LastExec.First]), 0  ]
                    : [{}, -1]

        // Functional update: lê currentItem do prev (não de old_item stale)
        // old_item_index indica ONDE atualizar; o conteúdo vem sempre do prev
        this.setData(prev => {
            const prevGroup = [...(prev[group] ?? [])]
            if (old_item_index < 0) {
                return {
                    ...prev,
                    [group]: [...prevGroup, { ...data, key: data.key ?? old_item.key ?? uuidv4() }],
                }
            }
            const currentItem = prevGroup[old_item_index] ?? {}
            const updated: Partial<Item> = {
                ...currentItem,
                ...data,
                key: data.key ?? (currentItem as Partial<Item>).key ?? uuidv4(),
            }
            prevGroup.splice(old_item_index, 1, updated)
            return { ...prev, [group]: prevGroup }
        })

        return new DataOperations<TGroups, LastExec.Update>(
            this.dataRef, this.setData, [undefined], LastExec.Update
        )
    }

    public collect(): CollectReturnMap[TLastExec] {
        return this.stack.pop() as CollectReturnMap[TLastExec]
    }
}
