import { defineConfig } from 'eslint/config';
import baseConfig from '../../eslint.base.mjs';

export default defineConfig([
	{
		extends: [baseConfig],
	}
]);