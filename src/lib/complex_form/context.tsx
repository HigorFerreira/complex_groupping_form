import { createContext as reactCreateContext } from 'react'
import type { ContextType, BaseItem } from './types'

export function createContext<TGroups extends string, TItem extends Partial<BaseItem>>() {
    return reactCreateContext<ContextType< TGroups, TItem > | null>(null)
}