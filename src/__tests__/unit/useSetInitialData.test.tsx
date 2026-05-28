import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSetInitialData, useDataStructure, wrapper } from './helpers'
import type { TestGroup, TestItem } from './helpers'

describe('useSetInitialData', () => {
    it('hidrata o estado com os dados iniciais', () => {
        const initialData: Partial<Record<TestGroup, Array<Partial<TestItem>>>> = {
            groupA: [{ name: 'A', value: 1 }, { name: 'B', value: 2 }],
            groupB: [{ name: 'C', value: 3 }],
        }

        const { result } = renderHook(() => ({
            structure: useDataStructure(),
            reset: useSetInitialData(initialData),
        }), { wrapper })

        expect(result.current.structure?.groupA).toHaveLength(2)
        expect(result.current.structure?.groupB).toHaveLength(1)
        expect(result.current.structure?.groupA?.[0]).toMatchObject({ name: 'A', value: 1 })
    })

    it('gera keys para itens que não possuem key', () => {
        const { result } = renderHook(() => ({
            structure: useDataStructure(),
            reset: useSetInitialData({ groupA: [{ name: 'sem-key', value: 0 }] }),
        }), { wrapper })

        expect(result.current.structure?.groupA?.[0]?.key).toBeDefined()
        expect(typeof result.current.structure?.groupA?.[0]?.key).toBe('string')
    })

    it('preserva a key quando o item já possui uma', () => {
        const { result } = renderHook(() => ({
            structure: useDataStructure(),
            reset: useSetInitialData({ groupA: [{ key: 'minha-key-fixa', name: 'X', value: 0 }] }),
        }), { wrapper })

        expect(result.current.structure?.groupA?.[0]?.key).toBe('minha-key-fixa')
    })

    it('reset permite reidratação dos dados', () => {
        const { result } = renderHook(() => ({
            structure: useDataStructure(),
            reset: useSetInitialData({ groupA: [{ name: 'inicial', value: 1 }] }),
        }), { wrapper })

        expect(result.current.structure?.groupA).toHaveLength(1)

        act(() => { result.current.reset() })

        // após reset, o hook poderia ser chamado novamente com novos dados
        // (aqui verificamos que reset não lança erro e o estado atual permanece)
        expect(result.current.structure?.groupA).toHaveLength(1)
    })
})
