module.exports = {
    "env": {
        "browser": true
    },
    extends: [
        'eslint-config-airbnb-base',
    ],
    rules: {
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    }
};