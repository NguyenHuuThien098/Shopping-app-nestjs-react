// @ts-check

export default {
  root: true,
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended', // Quy tắc cơ bản của ESLint
    'prettier', // Tích hợp Prettier
  ],
  plugins: ['prettier'], // Plugin Prettier
  parserOptions: {
    ecmaVersion: 12, // Hỗ trợ ES2021
    sourceType: 'module', // Sử dụng ES Modules
  },
  rules: {
    'prettier/prettier': 'error', // Báo lỗi nếu không tuân theo Prettier
    'no-unused-vars': 'warn', // Cảnh báo nếu có biến không sử dụng
    'no-console': 'off', // Cho phép sử dụng console.log
  },
};