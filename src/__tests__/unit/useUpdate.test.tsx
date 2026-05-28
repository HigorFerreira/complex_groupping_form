import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAppend, useUpdate, useDataStructure, wrapper } from './helpers'

describe('useUpdate', () => {
    it('atualiza os campos de um item existente', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            update: useUpdate(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => { result.current.append('groupA', { name: 'original', value: 1 }) })

        const key = result.current.structure?.groupA?.[0]?.key as string
        act(() => { result.current.update(key, 'groupA', { name: 'atualizado' }) })

        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'atualizado', value: 1 })
    })

    it('preserva campos não mencionados no update', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            update: useUpdate(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => { result.current.append('groupA', { name: 'nome', value: 99 }) })

        const key = result.current.structure?.groupA?.[0]?.key as string
        act(() => { result.current.update(key, 'groupA', { value: 42 }) })

        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'nome', value: 42 })
    })

    it('faz append quando a key não existe no grupo', () => {
        const { result } = renderHook(() => ({
            update: useUpdate(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => { result.current.update('key-inexistente', 'groupA', { name: 'novo', value: 5 }) })

        expect(result.current.structure?.groupA).toHaveLength(1)
        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'novo', value: 5 })
    })

    it('não altera outros itens do mesmo grupo', () => {
        const { result } = renderHook(() => ({
            append: useAppend(),
            update: useUpdate(),
            structure: useDataStructure(),
        }), { wrapper })

        act(() => {
            result.current.append('groupA', { name: 'A', value: 1 })
            result.current.append('groupA', { name: 'B', value: 2 })
        })

        const key = result.current.structure?.groupA?.[0]?.key as string
        act(() => { result.current.update(key, 'groupA', { name: 'A atualizado' }) })

        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'A atualizado' })
        expect(result.current.structure?.groupA?.[1]).toMatchObject({ name: 'B', value: 2 })
    })
})
