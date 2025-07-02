import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import json from "eslint-plugin-json";
import prettier from "eslint-plugin-prettier/recommended";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default defineConfig([
  globalIgnores(["node_modules/", "dist/", "coverage/"]),
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommendedTypeChecked,
  // TODO: Migrate to @stylistic/eslint-plugin
  tseslint.configs.stylisticTypeChecked,
  ...vue.configs["flat/recommended"],
  eslintPluginUnicorn.configs.recommended,
  prettier,

  // https://github.com/vuejs/eslint-config-typescript
  ...vueTsEslintConfig({
    // Optional: extend additional configurations from typescript-eslint'.
    // Supports all the configurations in
    // https://typescript-eslint.io/users/configs#recommended-configurations
    extends: [
      "recommendedTypeChecked",
      "stylisticTypeChecked",

      // Other utility configurations, such as 'eslintRecommended', (note that it's in camelCase)
      // are also extendable here. But we don't recommend using them directly.
    ],
  }),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },

    rules: {
      semi: ["error", "always"],

      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
        },
      ],

      eqeqeq: ["error", "always"],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "@typescript-eslint/no-unused-vars":
        process.env.NODE_ENV === "production" ? "error" : "warn",
      "vue/no-unused-vars":
        process.env.NODE_ENV === "production" ? "error" : "warn",
      "vue/no-undef-properties":
        process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-console": "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-var": "error",
      "prefer-const": "error",

      "prettier/prettier": [
        "error",
        {
          endOfLine: "lf",
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      "unicorn/better-regex": "error",
      // TODO: Enable this rule after fixing all the issues
      "unicorn/prevent-abbreviations": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/prefer-add-event-listener": "off",
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/prefer-node-protocol": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,json,jsonc,json5}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ["**/*.json"],
    ...json.configs["recommended"],
    rules: {
      "json/*": ["error", { allowComments: true }],
    },
  },
]);
