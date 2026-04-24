import './App.css'
import { Fragment, useEffect, useRef } from 'react'
import { useData, useDataOperations } from '@/lib/complex_form/exports/hooks'

type FormGroups = 'list' | 'pernsonal' | (string & {})

export default function App() {
	const callOnce = useRef(false)
	const data = useData<FormGroups>()
	const dop = useDataOperations<FormGroups>()

	useEffect(() => {
		if(!callOnce.current){
			dop.append('list', { label: 'Label', value: '001' })
				.append('list', { label: 'Telefone', value: '002' })
			callOnce.current = true
		}
	}, [ callOnce, dop ])

	useEffect(() => console.log({ data }), [ data ])

	return <div>
		<h1>Something</h1>
		<div className='flex justify-center'>
			<div className='flex flex-col gap-4'>
				{ data?.list?.map(({ key, label, value }) => {
					const k = `ipt:${key}`
					return <Fragment key={key}>
						<div className='flex flex-col p-4 rounded-[12px] border-black border-1 [&_input]:px-4 [&_input]:py-2'>
							<label htmlFor={k}>{ label }</label>
							<input id={k} type="text" value={value} onChange={e => dop.getByKey('list', key??'').update('list', { value: e.target.value })} />
						</div>
					</Fragment>
				}) ?? [] }
			</div>
		</div>
	</div>
}
