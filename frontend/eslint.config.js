import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/no-unused-modules': 'off',
    'react-refresh/only-export-components': 'off',
  },
})
