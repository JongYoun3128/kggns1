export default [
    { ignores: ['dist'] }, // 검사 제외 경로
    prettierConfig, // Prettier와 충돌 방지 설정
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@typescript-eslint': typescriptPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...js.configs.recommended.rules, // JS 기본 추천 룰
            ...reactHooks.configs.recommended.rules, // 리액트 훅 룰
            ...typescriptPlugin.configs.recommended.rules, // TS 기본 추천 룰

            'prettier/prettier': 'error', // Prettier 포맷 오류를 ESLint 에러로 처리

            // 스타일 관련 룰
            eqeqeq: ['error', 'always'], // 항상 === 사용
            curly: ['error', 'all'], // 중괄호 항상 사용
            quotes: ['error', 'single', { avoidEscape: true }], // '' 사용
            semi: ['error', 'always'], // 세미콜론 항상 사용

            // TypeScript 룰
            '@typescript-eslint/no-explicit-any': 'warn', // any 사용 경고
            '@typescript-eslint/explicit-function-return-type': [
                // 함수 타입 명시 권장
                'warn',
                { allowExpressions: true },
            ],
            'no-unused-vars': 'off', // 사용하지 않은 변수 경고
            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: '^[A-Z_]' },
            ],

            // React 관련
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react/prop-types': 'off', // TS로 prop type 검사하므로 끔
        },
    },
];
