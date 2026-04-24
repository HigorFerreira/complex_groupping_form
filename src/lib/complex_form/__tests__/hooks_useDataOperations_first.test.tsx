/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createForm } from '../index'
import { DataOperations } from '../utils'
import type { Item } from '../types'

type FormGroups = 'pessoal' | 'telefones'
// @ts-expect-error Unused
const { Provider, useDataOperations, useData } = createForm<FormGroups>()


describe('useDataOperations - first', () => {
    it('first have to be callable', () => {
        const { result } = renderHook(() => useDataOperations(), { wrapper: Provider })
        expect(result.current.first).toBeTypeOf('function')
    })

    it('first have to return DataOperations', () => {
        const { result } = renderHook(() => useDataOperations(), { wrapper: Provider })
        let res: unknown
        act(() => { res = result.current.first('pessoal') })
        expect(res).toBeInstanceOf(DataOperations)
    })

    it('should get first item appended', () => {
        const item: Partial<Item> = { value: 'item1' }
        const { result } = renderHook(() => useDataOperations(), { wrapper: Provider })

        act(() => {
            const dop = result.current
            dop.append('pessoal', item)
        })

        let got_from_first: unknown
        act(() => {
            const dop = result.current
            got_from_first = dop.first('pessoal').collect()
        })

        expect(got_from_first).toBeDefined()
        expect((got_from_first as Partial<Item>).key).toBeDefined()
        expect((got_from_first as Partial<Item>).key).toBeTypeOf('string')
        expect(got_from_first).toMatchObject(item)
    })

    it('should get first item not appended as undefined', () => {
        const { result } = renderHook(() => useDataOperations(), { wrapper: Provider })
        let got_from_first: unknown
        act(() => {
            const dop = result.current
            got_from_first = dop.first('pessoal').collect()
        })
        expect(got_from_first).not.toBeDefined()
        expect(got_from_first).toBeTypeOf('undefined')
    })
})