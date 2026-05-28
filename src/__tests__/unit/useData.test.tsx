import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppend, useData, wrapper } from './helpers'

describe('useData', () => {
    it('sem key retorna todos os dados agrupados', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            getData: useData(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupB', { name: 'B', value: 2 })
        })

        const all = result.current.getData() as Record<string, unknown[]>
        expect(all?.groupA).toHaveLength(1)
        expect(all?.groupB).toHaveLength(1)
    })

    it('com key retorna o item específico', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            getData: useData(),
            structure: useAppend(),
        }), { wrapper })

        act(() => { result.current.append('groupA', { name: 'específico', value: 7 }) })

        // pega a key do item recém-adicionado via getData sem key
        const all = result.current.getData() as Record<string, Array<{ key: string }>>
        const key = all?.groupA?.[0]?.key as string

        const item = result.current.getData(key) as { name: string; value: number }
        expect(item?.name).toBe('específico')
        expect(item?.value).toBe(7)
    })

    it('com key inexistente retorna {}', () => {
        const { result } = renderHook(() => ({
            getData: useData(),
        }), { wrapper })

        const item = result.current.getData('nao-existe')
        expect(item).toEqual({})
    })

    it('retorna uma cópia — mutações externas não afetam o estado interno', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            getData: useData(),
        }), { wrapper })

        act(() => { result.current.append('groupA', { name: 'original', value: 1 }) })

        const snapshot = result.current.getData() as Record<string, Array<{ name: string }>>
        snapshot.groupA![0]!.name = 'mutado externamente'

        const fresh = result.current.getData() as Record<string, Array<{ name: string }>>
        expect(fresh.groupA![0]!.name).toBe('original')
    })
})
