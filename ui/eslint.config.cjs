const { defineConfig, globalIgnores, } = require("eslint/config")

const globals = require("globals")

const { fixupConfigRules, } = require("@eslint/compat")

const tsParser = require("@typescript-eslint/parser")
const reactRefresh = require("eslint-plugin-react-refresh")
const js = require("@eslint/js")

const { FlatCompat } = require("@eslint/eslintrc")

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

module.exports = defineConfig([{
	languageOptions: {
		globals: {
			...globals.browser,
		},

		parser: tsParser,

		parserOptions: {
			tsconfigRootDir: __dirname,
			project: ["./tsconfig.app.json"],
			EXPERIMENTAL_useProjectService: true,
		},
	},

	extends: fixupConfigRules(compat.extends(
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:react-hooks/recommended",
	)),

	plugins: {
		"react-refresh": reactRefresh,
	},

	rules: {
		"react-refresh/only-export-components": ["warn", {
			allowConstantExport: true,
		}],

		"react/react-in-jsx-scope": "off",

		"padded-blocks": ["error", {
			"classes": "always",
		}],

		"no-param-reassign": ["error", {
			"props": false,
		}],

		"object-curly-newline": "off",
		"no-await-in-loop": "off",

		"max-len": ["error", {
			code: 120,
		}],

		"no-restricted-syntax": ["off", "ForOfStatement"],
		"semi": ["error", "never"],
		"comma-dangle": ["error", "never"],

		"@typescript-eslint/no-misused-promises": ["error", {
			"checksVoidReturn": {
				arguments: true,
				attributes: false,
				properties: true,
				returns: true,
				variables: true,
			},
		}],

		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"no-unused-vars": "off",

		"@typescript-eslint/no-unused-vars": ["warn", {
			ignoreRestSiblings: true,
		}],

		"@typescript-eslint/restrict-template-expressions": ["error", {
			allowAny: false,
			allowBoolean: false,
			allowNullish: false,
			allowNumber: true,
			allowRegExp: false,
			allowNever: false,
		}],
	},
}, globalIgnores(["**/dist", "**/.eslintrc.cjs", "**/vite.config.ts"])])