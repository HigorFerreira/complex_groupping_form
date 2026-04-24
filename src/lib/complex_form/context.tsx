import { createContext } from 'react'
import type { ContextType } from './types'

export function createFormContext<TGroups extends string>() {
    return createContext<ContextType<TGroups> | null>(null)
}
