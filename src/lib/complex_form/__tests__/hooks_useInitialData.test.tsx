/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createForm } from '../index'
import { DataOperations } from '../utils'
import type { Item } from '../types'

type FormGroups = 'pessoal' | 'telefones'

const { Provider, useData, useInitialData, useDataOperations } = createForm<FormGroups>()

describe('useInitialData', () => {

    it('should throw error outside context', () => {
        expect(() => renderHook(() => useInitialData())).toThrow()
    })

    describe('should test initial population', () => {
        const item1: Partial<Item> = { value: 'Item1', extra_value: 'Extra' }
        const item2: Partial<Item> = { key: 'SomeKey', value: 'Somevalue' }
        const { result } = renderHook(() => {
            const data = useData()
            const dop = useDataOperations()
            useInitialData({
                'pessoal': [
                    item1,
                    item2
                ],
                'telefones': [
                    item1
                ]
            })
            return { data, dop }
        }, { wrapper: Provider })

        act(() => {
            const { data, dop } = result.current
            it('should telefones populated', () => {
                const first_telefone = dop.first('telefones').collect()
                expect(first_telefone).toBeDefined()
                expect(first_telefone).toEqual(item1)
            })

            it('should pessoal pupulated', () => {
                expect(data?.pessoal).toBeDefined()
                expect(data?.pessoal).toBeInstanceOf(Array)
                expect(data?.pessoal.length).toBe(2)
                expect(data?.pessoal).toEqual([ item1, item2 ])
            })
        })
    })
})