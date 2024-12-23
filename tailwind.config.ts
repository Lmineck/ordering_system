import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)', // CSS 변수 연결
                foreground: 'var(--foreground)', // CSS 변수 연결
            },
            fontFamily: {
                sans: ['Pretendard', 'Arial', 'sans-serif'], // Pretendard 기본 폰트
            },
        },
    },
    plugins: [],
};

export default config;
