const { defineConfig, globalIgnores, } = require("eslint/config")

const tsParser = require("@typescript-eslint/parser")
const typescriptEslint = require("@typescript-eslint/eslint-plugin")
const js = require("@eslint/js")

const { FlatCompat, } = require("@eslint/eslintrc")

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

module.exports = defineConfig([{
  ignores: ["**/dist", "**/eslint.config.cjs"],
  languageOptions: {
    parser: tsParser,

    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json"],
      EXPERIMENTAL_useProjectService: true,
    },
  },

  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  extends: compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ),

  rules: {
    "padded-blocks": ["error", { "classes": "always", }],

    "semi": ["error", "never"],
    "comma-dangle": ["error", "never"],

    "max-len": ["error", { code: 140, }],

    "object-curly-newline": "off",

    // "no-underscore-dangle": ["error", {
    //   "allowAfterThis": true,
    // }],

    "no-param-reassign": ["error", {
      "props": false,
    }],

    "no-restricted-syntax": ["off", "ForOfStatement"],
    "no-await-in-loop": "off",
    "no-bitwise": "off",
    "no-continue": "off",

    "@typescript-eslint/unbound-method": ["error", {
      ignoreStatic: true,
    }],

    "indent": "off",
    "@typescript-eslint/indent": "off",
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
}, globalIgnores(["**/dist", "**/eslint.config.cjs"]), {
  rules: {
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-invalid-void-type": "off"
  }
}])