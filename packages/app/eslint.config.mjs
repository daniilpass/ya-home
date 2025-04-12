import { defineConfig, globalIgnores } from "eslint/config";
import pluginReact from "eslint-plugin-react";

import baseConfig from "../../eslint.base.mjs";

export default defineConfig([
    globalIgnores([
        "service-worker.js",
    ]),
    pluginReact.configs.flat.recommended,
	{
        settings: {
            react: {
                version: "detect"
            }
        },
		extends: [baseConfig],
	},
]);