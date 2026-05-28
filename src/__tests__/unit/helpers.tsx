import type { PropsWithChildren } from 'react'
import { createForm } from '@/lib/complex_form'

export type TestGroup = 'groupA' | 'groupB'
export type TestItem = { key: string; name: string; value: number }

export const {
    Provider,
    useAppend,
    useRemove,
    useUpdate,
    useData,
    useDataStructure,
    useSetInitialData,
} = createForm<TestGroup, TestItem>()

export function wrapper({ children }: PropsWithChildren) {
    return <Provider>{children}</Provider>
}
