import { useAppend, useRemove, useUpdate, useDataStructure, useData } from '@/form/hooks'

import './App.css'
import { useEffect, useState } from 'react'


export default function App() {

	const append = useAppend()
	const remove = useRemove()
	const get_data = useData()
	const update = useUpdate()

	const [ field, setField ] = useState('')

	const form_structure = useDataStructure()

	// useEffect(() => console.log('App', { data: get_data() }), [ get_data ])

	return <div>
		<h1>Something</h1>
		<div className='flex justify-center'>
			<div className='flex flex-col gap-4'>
				{/* { data?.list?.map(({ key, label, value }) => {
					const k = `ipt:${key}`
					return <Fragment key={key}>
						<div className='flex flex-col p-4 rounded-[12px] border-black border-1 [&_input]:px-4 [&_input]:py-2'>
							<label htmlFor={k}>{ label }</label>
							<input id={k} type="text" value={value} onChange={e => dop.getByKey('list', key??'').update('list', { value: e.target.value })} />
						</div>
					</Fragment>
				}) ?? [] } */}
			</div>
		</div>
		<div className='flex justify-center mt-10'>
			<div className=''>
				<div className='flex gap-4'>
					<div className='flex flex-col p-4 rounded-[12px] border-black border-1 [&_input]:px-4 [&_input]:py-2'>
						<label htmlFor="test">Once test</label>
						<input id='test' type="text" value={field} onChange={(e) => setField(e.target.value)} />
					</div>
					<div>
						<button className='cursor-pointer p-3' onClick={() => {
							remove(field)
						}}>
							Remove
						</button>
					</div>
				</div>
				<div>
					<button className='cursor-pointer p-6' onClick={() => {
						append('group1', { title: 'Test1', label: 'Label' })
					}}>
						Append
					</button>
				</div>
			</div>
			
		</div>
		<div>
			<h4>Group 1</h4>
			{ form_structure?.group1?.map(item => {
				return <div key={item.key} className='flex gap-2' >
					<input type="text" placeholder='Title' value={get_data(item.key)?.title} onChange={e => update(item.key, 'group1', { title: e.target.value })} />
					<input type="text" placeholder='Label' value={get_data(item.key)?.label} onChange={e => update(item.key, 'group1', { label: e.target.value })} />
				</div>
			}) }
		</div>
	</div>
}
