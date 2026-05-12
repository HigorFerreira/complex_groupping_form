import { useAppend } from '@/form'

import './App.css'


export default function App() {

	const append = useAppend()

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
				<div className='flex flex-col p-4 rounded-[12px] border-black border-1 [&_input]:px-4 [&_input]:py-2'>
					<label htmlFor="test">Once test</label>
					<input id='test' type="text" />
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
	</div>
}
