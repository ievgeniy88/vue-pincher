import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import json from "eslint-plugin-json";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  {
    /**
     * ESLint requires "ignores" key to be the only one in this object
     */
    ignores: ["dist", "node_modules"],
  },

  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/recommended"],
  prettier,

  // https://github.com/vuejs/eslint-config-typescript
  ...vueTsEslintConfig({
    // Optional: extend additional configurations from typescript-eslint'.
    // Supports all the configurations in
    // https://typescript-eslint.io/users/configs#recommended-configurations
    extends: [
      // By default, only the recommended rules are enabled.
      "recommended",
      // You can also manually enable the stylistic rules.
      "stylistic",

      // Other utility configurations, such as 'eslintRecommended', (note that it's in camelCase)
      // are also extendable here. But we don't recommend using them directly.
    ],
  }),

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
    },
  },
  {
    files: ["**/*.json"],
    ...json.configs["recommended"],
    rules: {
      "json/*": ["error", { allowComments: true }],
    },
  },
];
