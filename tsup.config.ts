// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig(
    {
        entry: {
            provider: 'src/lib/complex_form/exports/provider.tsx',
            hooks: 'src/lib/complex_form/exports/hooks.tsx',
        },
        format: ['esm', 'cjs'],
        dts: true,
        splitting: true,
        treeshake: true,
        clean: true,
        external: ['react', 'react-dom'],
    }
)