import { createForm } from '@/lib/complex_form'
import type { FormItem, Group } from './types'
const { Provider, useAppend } = createForm<Group, FormItem>()
export {
    Provider,
    useAppend
}