import { createForm } from '@/lib/complex_form'
import type { FormItem, Group } from './types'
const { Provider, useAppend, useRemove } = createForm<Group, FormItem>()
export {
    Provider,
    useAppend,
    useRemove,
}