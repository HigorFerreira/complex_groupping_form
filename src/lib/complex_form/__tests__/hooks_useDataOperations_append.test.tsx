/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createForm } from '../index'
import { DataOperations } from '../utils'
import type { Item } from '../types'

type FormGroups = 'pessoal' | 'telefones'

const { Provider, useDataOperations, useData } = createForm<FormGroups>()


describe('useDataOperations - append', () => {
    it('throws error when hook is outside of Provider', () => {
        expect(() => renderHook( () => useDataOperations() )).toThrow()
    })

    it('checks hook when it\'s inside Provider', () => {
        const { result } = renderHook(() => useDataOperations(), { wrapper: Provider })
        expect(result.current).toBeInstanceOf(DataOperations)
    })

    it('stable references between renders after using append', () => {
        const refs: DataOperations<FormGroups>[] = []
        const { rerender, result } = renderHook(
            () => {
                const data = useData()
                const dop = useDataOperations()
                refs.push(dop)
                return [ data, dop ] as const
            },
            { wrapper: Provider }
        )

        act(() => {
            const [, dop ] = result.current
            dop.append('telefones', { value: '001' })
            dop.append('telefones', { value: '002' })
            dop.append('telefones', { value: '003' })
        })

        rerender()
        rerender()
        rerender()

        const [ data ] = result.current
        
        expect(data).toBeDefined()
        // console.log(JSON.stringify(data, null, 2))
        expect(refs.every(r => r === refs[0])).toBe(true)
        expect(data!['telefones'].every(({ value }, i) => value === `00${i + 1}`)).toBe(true)

        act(() => {
            const [, dop ] = result.current
            dop.append('telefones', { value: '004' })
        })
        const [ updatedData ] = result.current
        expect(updatedData?.telefones).toBeDefined()
        expect(updatedData?.telefones).toBeInstanceOf(Array)
        expect(updatedData?.telefones.length).toBeGreaterThan(0)
        expect(updatedData!['telefones'].every(({ value }, i) => value === `00${i + 1}`)).toBe(true)
        rerender()
        const [ finalData ] = result.current
        expect(finalData!['telefones'].every(({ value }, i) => value === `00${i + 1}`)).toBe(true)
    })

    it('append data to form', () => {
        const { result } = renderHook(() => {
            const data = useData()
            const dop = useDataOperations()
            return { data, dop }
        }, { wrapper: Provider })
        const item1: Partial<Item> = { value: 'Item1', image: 'someimage' }
        const item2: Partial<Item> = { key: 'Some key' }
        const item3: Partial<Item> = { label: 'Label', extra_value: 'ExtraValue', image: 'Image', options: '', value: 'Value' }

        act(() => {
            const { dop } = result.current
            dop.append('pessoal', item1)
            dop.append('pessoal', item2)
            dop.append('pessoal', item3)
        })

        const { data } = result.current
        expect(data).toBeDefined()

        for(const item of data!['pessoal']){
            expect(item).toBeDefined()
            expect(item.key).toBeDefined()
            expect(item.key).toBeTypeOf('string')
        }

        expect(data!['pessoal'][1].key).toBe(item2.key)

        ;[ item1, item2, item3 ].forEach((item, i) => {
            expect(data!['pessoal'][i]).toMatchObject(item)
        })
    })

    it('getByKey should work after append', () => {
        const { result } = renderHook(() => {
            const dop = useDataOperations()
            return { dop }
        }, { wrapper: Provider })
        const item: Partial<Item> = { key: 'item', value: 'Item1', image: 'someimage' }
        let restored_item: unknown
        
        act(() => {
            const { dop } = result.current
            dop.append('pessoal', item)
        })

        act(() => {
            const { dop } = result.current
            restored_item = dop.getByKey('pessoal', 'item').collect()
        })

        expect(restored_item).toBeDefined()
        expect(restored_item).toBeInstanceOf(Array)
        expect((restored_item as Array<unknown>)[0]).toEqual(item)
    })
})