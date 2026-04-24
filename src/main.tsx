import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import ComplexFormProvider from '@/lib/complex_form/exports/provider.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ComplexFormProvider>
			<App />
		</ComplexFormProvider>
	</StrictMode>,
)