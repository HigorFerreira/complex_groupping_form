import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppend, useRemove, useDataStructure, wrapper } from './helpers'

describe('useRemove', () => {
    it('remove o item pelo key e retorna o item deletado', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            remove: useRemove(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => { result.current.append('groupA', { name: 'X', value: 1 }) })

        const key = result.current.structure?.groupA?.[0]?.key as string
        expect(key).toBeDefined()

        let deleted: unknown
        act(() => { deleted = result.current.remove(key) })

        expect(result.current.structure?.groupA).toHaveLength(0)
        expect((deleted as { key: string })?.key).toBe(key)
    })

    it('retorna {} ao tentar remover key inexistente', () => {
        const { result } = renderHook(() => ({
            remove: useRemove(),
        }), { wrapper })

        let returned: unknown
        act(() => { returned = result.current.remove('chave-que-nao-existe') })

        expect(returned).toEqual({})
    })

    it('remove apenas o item correto quando há múltiplos no grupo', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            remove: useRemove(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupA', { name: 'B', value: 2 })
            result.current.append('groupA', { name: 'C', value: 3 })
        })

        const key = result.current.structure?.groupA?.[1]?.key as string
        act(() => { result.current.remove(key) })

        expect(result.current.structure?.groupA).toHaveLength(2)
        expect(result.current.structure?.groupA?.find(i => i.key === key)).toBeUndefined()
    })

    it('não afeta outros grupos', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            remove: useRemove(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupB', { name: 'B', value: 2 })
        })

        const key = result.current.structure?.groupA?.[0]?.key as string
        act(() => { result.current.remove(key) })

        expect(result.current.structure?.groupA).toHaveLength(0)
        expect(result.current.structure?.groupB).toHaveLength(1)
    })
})
