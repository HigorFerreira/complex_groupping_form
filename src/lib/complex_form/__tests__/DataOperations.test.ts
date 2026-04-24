import { describe, it, expect, vi } from 'vitest'
import { DataOperations } from '../utils'
import type { DataState, Item } from '../types'

type G = 'grupo_a' | 'grupo_b'

function makeRef(data: Partial<DataState<G>> = {}) {
    return { current: data as DataState<G> }
}

describe('DataOperations.getByKey', () => {
    it('collect() retorna [{ key }, -1] quando grupo está vazio', () => {
        const dop = new DataOperations<G>(makeRef({ grupo_a: [] }), vi.fn())
        const result = dop.getByKey('grupo_a', 'x').collect()
        // key é preservada para que update() a use ao inserir o novo item
        expect(result).toEqual([{ key: 'x' }, -1])
    })

    it('collect() retorna [{ key }, -1] quando item não existe', () => {
        const dop = new DataOperations<G>(
            makeRef({ grupo_a: [{ key: 'outro', value: 'v' }] }),
            vi.fn()
        )
        expect(dop.getByKey('grupo_a', 'inexistente').collect()).toEqual([{ key: 'inexistente' }, -1])
    })

    it('collect() encontra item no índice 0 (bug fix)', () => {
        const item: Partial<Item> = { key: 'primeiro', value: 'val' }
        const dop = new DataOperations<G>(
            makeRef({ grupo_a: [item, { key: 'segundo' }] }),
            vi.fn()
        )
        const [found, idx] = dop.getByKey('grupo_a', 'primeiro').collect()!
        expect(found).toEqual(item)
        expect(idx).toBe(0)
    })

    it('collect() retorna item e índice corretos para item no meio', () => {
        const item: Partial<Item> = { key: 'meio', value: 'v2' }
        const dop = new DataOperations<G>(
            makeRef({ grupo_a: [{ key: 'a' }, item, { key: 'c' }] }),
            vi.fn()
        )
        const [found, idx] = dop.getByKey('grupo_a', 'meio').collect()!
        expect(found).toEqual(item)
        expect(idx).toBe(1)
    })

    it('dois getByKey() do mesmo dop não interferem (stacks isolados)', () => {
        const dop = new DataOperations<G>(
            makeRef({
                grupo_a: [
                    { key: 'k1', value: 'v1' },
                    { key: 'k2', value: 'v2' },
                ],
            }),
            vi.fn()
        )
        const chain1 = dop.getByKey('grupo_a', 'k1')
        const chain2 = dop.getByKey('grupo_a', 'k2')

        const [item2] = chain2.collect()!
        const [item1] = chain1.collect()!

        expect(item1?.value).toBe('v1')
        expect(item2?.value).toBe('v2')
    })
})

describe('DataOperations.update', () => {
    it('insere novo item quando key não existe', () => {
        const setData = vi.fn()
        const dop = new DataOperations<G>(makeRef({ grupo_a: [] }), setData)
        dop.getByKey('grupo_a', 'novo').update('grupo_a', { value: 'inserido' })

        expect(setData).toHaveBeenCalledOnce()
        const updater = setData.mock.calls[0][0]
        const result = updater({ grupo_a: [], grupo_b: [] })
        expect(result.grupo_a).toHaveLength(1)
        expect(result.grupo_a[0].value).toBe('inserido')
    })

    it('atualiza item existente preservando outras propriedades', () => {
        const setData = vi.fn()
        const existing: Partial<Item> = { key: 'item1', value: 'antigo', label: 'Label' }
        const dop = new DataOperations<G>(
            makeRef({ grupo_a: [existing] }),
            setData
        )
        dop.getByKey('grupo_a', 'item1').update('grupo_a', { value: 'novo' })

        const updater = setData.mock.calls[0][0]
        const result = updater({ grupo_a: [existing], grupo_b: [] })
        expect(result.grupo_a[0].value).toBe('novo')
        expect(result.grupo_a[0].label).toBe('Label')
        expect(result.grupo_a[0].key).toBe('item1')
    })

    it('usa functional update (lê de prev, não de data stale)', () => {
        const setData = vi.fn()
        const staleData = makeRef({ grupo_a: [{ key: 'k', value: 'stale' }] })
        const dop = new DataOperations<G>(staleData, setData)

        dop.getByKey('grupo_a', 'k').update('grupo_a', { value: 'novo' })

        const updater = setData.mock.calls[0][0]
        // Simula estado mais recente passado pelo React
        const freshPrev = { grupo_a: [{ key: 'k', value: 'fresco', label: 'L' }], grupo_b: [] }
        const result = updater(freshPrev)
        // deve preservar 'label' do prev, não do stale
        expect(result.grupo_a[0].label).toBe('L')
        expect(result.grupo_a[0].value).toBe('novo')
    })

    it('update() pode atualizar grupo diferente do getByKey', () => {
        const setData = vi.fn()
        const dop = new DataOperations<G>(
            makeRef({ grupo_a: [], grupo_b: [{ key: 'kb', value: 'original' }] }),
            setData
        )
        // getByKey em grupo_a mas update em grupo_b
        dop.getByKey('grupo_a', 'ka').update('grupo_b', { value: 'atualizado' })

        const updater = setData.mock.calls[0][0]
        const result = updater({ grupo_a: [], grupo_b: [{ key: 'kb', value: 'original' }] })
        // Como 'ka' não existe em grupo_a, old_item_index = -1 → insere em grupo_b
        expect(result.grupo_b).toHaveLength(2)
    })

    it('dataRef atualizado é lido pelo próximo getByKey', () => {
        const setData = vi.fn()
        const ref = makeRef({ grupo_a: [] })
        const dop = new DataOperations<G>(ref, setData)

        // Simula React atualizando o ref após um re-render
        ref.current = { grupo_a: [{ key: 'k', value: 'atualizado' }], grupo_b: [] }

        const [item] = dop.getByKey('grupo_a', 'k').collect()!
        expect(item.value).toBe('atualizado')
    })
})
