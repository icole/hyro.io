module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: [
    'ember',
    'decorator-position',
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:decorator-position/ember'
  ],
  env: {
    browser: true,
    jquery: true
  },
  rules: {
    "no-console": "off"
  },
  overrides: [
    // node files
    {
      files: [
        'testem.js',
        'ember-cli-build.js',
        'config/**/*.js',
        'lib/*/index.js',
        '.eslintrc.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    },
    // engine files
    {
      files: [
        'app/app.js',
        'lib/**/addon/addon/engine.js'
      ],
      rules: {
        'ember/avoid-leaking-state-in-ember-objects': 'off'
      }
    }
  ]
};
