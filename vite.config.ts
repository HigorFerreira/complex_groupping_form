import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		dts({
			include: ['src/lib/complex_form/**/*'],
			tsconfigPath: './tsconfig.app.json',
			insertTypesEntry: true,
			pathsToAliases: true,  // converte paths do tsconfig em aliases na geração dos .d.ts
			/*insertTypesEntry: true, An object literal cannot have multiple properties with the same name.ts(1117)
				(property) insertTypesEntry?: boolean | undefined
				Whether to generate types entry file(s).

				When true, uses package.json types property if it exists or ${outDir}/index.d.ts.

				Value is forced to true when rollupTypes is true.

				@default

				false*/
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: 'src/lib/complex_form/exports/index.ts',
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
		},
	},
})