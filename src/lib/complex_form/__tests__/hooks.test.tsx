import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createForm } from '../index'
import { DataOperations } from '../utils'

type G = 'pessoal' | 'endereco'

// Uma instância do form criada fora dos testes (factory chamada uma vez)
const form = createForm<G>()

describe('useData', () => {
    it('retorna undefined fora do Provider', () => {
        const { result } = renderHook(() => form.useData())
        expect(result.current).toBeUndefined()
    })

    it('retorna estado inicial vazio dentro do Provider', () => {
        const { result } = renderHook(() => form.useData(), { wrapper: form.Provider })
        expect(result.current).toEqual({})
    })

    it('reflete atualização de estado após update', () => {
        const { result } = renderHook(
            () => ({ data: form.useData(), dop: form.useDataOperations() }),
            { wrapper: form.Provider }
        )

        act(() => {
            result.current.dop.getByKey('pessoal', 'nome').update('pessoal', { value: 'Mylene' })
        })

        expect(result.current.data?.pessoal?.[0]?.value).toBe('Mylene')
    })
})

describe('useDataOperations', () => {
    it('retorna instância de DataOperations', () => {
        const { result } = renderHook(() => form.useDataOperations(), { wrapper: form.Provider })
        expect(result.current).toBeInstanceOf(DataOperations)
    })

    it('referência é estável entre re-renders (não causa renders infinitos)', () => {
        const refs: DataOperations<G>[] = []

        const { rerender } = renderHook(
            () => {
                const dop = form.useDataOperations()
                refs.push(dop)
                return dop
            },
            { wrapper: form.Provider }
        )

        rerender()
        rerender()
        rerender()

        // Todas as referências devem ser o mesmo objeto
        expect(refs.every(r => r === refs[0])).toBe(true)
    })

    it('collect() lê dados frescos após update sem recriar dop', () => {
        const { result } = renderHook(() => form.useDataOperations(), { wrapper: form.Provider })
        const dopAntes = result.current

        act(() => {
            result.current.getByKey('endereco', 'cep').update('endereco', { value: '12345-678' })
        })

        // dop é a mesma referência
        expect(result.current).toBe(dopAntes)

        // mas lê o valor atualizado via dataRef
        const [item] = result.current.getByKey('endereco', 'cep').collect()!
        expect(item?.value).toBe('12345-678')
    })

    it('múltiplos getByKey() no mesmo render não interferem', () => {
        const { result } = renderHook(
            () => form.useDataOperations(),
            { wrapper: form.Provider }
        )

        act(() => {
            result.current.getByKey('pessoal', 'nome').update('pessoal', { value: 'Ana' })
            result.current.getByKey('pessoal', 'cpf').update('pessoal', { value: '000' })
        })

        const [nome] = result.current.getByKey('pessoal', 'nome').collect()!
        const [cpf]  = result.current.getByKey('pessoal', 'cpf').collect()!

        expect(nome?.value).toBe('Ana')
        expect(cpf?.value).toBe('000')
    })

    it('item inserido sem key recebe uuid automaticamente', () => {
        const { result } = renderHook(
            () => ({ data: form.useData(), dop: form.useDataOperations() }),
            { wrapper: form.Provider }
        )

        act(() => {
            result.current.dop
                .getByKey('pessoal', 'chave_inexistente')
                .update('pessoal', { value: 'novo' })
        })

        const item = result.current.data?.pessoal?.[0]
        expect(item?.key).toBeTruthy()
        expect(typeof item?.key).toBe('string')
        expect(item?.value).toBe('novo')
    })
})
