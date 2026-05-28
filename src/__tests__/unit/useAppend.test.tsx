import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppend, useDataStructure, wrapper } from './helpers'

describe('useAppend', () => {
    it('adiciona um item ao grupo correto', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            structure: useDataStructure(),
        }), { wrapper })

        expect(result.current.structure).toEqual({})

        act(() => {
            result.current.append('groupA', { name: 'Item 1', value: 10 })
        })

        expect(result.current.structure?.groupA).toHaveLength(1)
        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'Item 1', value: 10 })
    })

    it('gera uma key única para cada item', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupA', { name: 'B', value: 2 })
        })

        const [item1, item2] = result.current.structure?.groupA ?? []
        expect(item1?.key).toBeDefined()
        expect(item2?.key).toBeDefined()
        expect(item1?.key).not.toBe(item2?.key)
    })

    it('adiciona em grupos distintos sem interferência', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupB', { name: 'B', value: 2 })
        })

        expect(result.current.structure?.groupA).toHaveLength(1)
        expect(result.current.structure?.groupB).toHaveLength(1)
    })
})
