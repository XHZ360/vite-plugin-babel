import babel, { TransformOptions } from '@babel/core';
import { Loader } from 'esbuild';
import { createFilter, FilterPattern, Plugin } from 'vite';

import { esbuildPluginBabel } from './esbuildBabel';

export interface BabelPluginOptions {
	/** Babel config */
	babelConfig?: TransformOptions;
	/** Esbuild pulugin filter */
	filter?: RegExp;
	/** Esbuild loader */
	loader?: Loader | ((path: string) => Loader);
	/** Vite plugin apply */
	apply?: 'serve' | 'build';
	/** Vite plugin enforce */
	enforce?: 'pre' | 'post';
	/** Vite include */
	include?: FilterPattern,
	/** Vite exclude */
	exclude?: FilterPattern
}

const babelPlugin = ({ babelConfig = {}, apply, loader, enforce, include, exclude, filter }: BabelPluginOptions = {}): Plugin => {
	const _filter = createFilter(include, exclude);
	return {
		name: 'babel-plugin',
		apply,
		enforce: enforce || 'pre',
		config() {
			return {
				optimizeDeps: {
					esbuildOptions: {
						plugins: [
							esbuildPluginBabel({
								config: { ...babelConfig },
								filter,
								loader,
							}),
						],
					},
				},
			};
		},

		transform(code, id) {
			const shouldTransform = _filter(id);
			if (!shouldTransform) return;
			return babel
				.transformAsync(code, { filename: id, ...babelConfig })
				.then((result) => ({ code: result?.code ?? '', map: result?.map }));
		},
	};
};

export default babelPlugin;
export * from './esbuildBabel';

