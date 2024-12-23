import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '오일내 주문 발주 시스템',
    description: '간편한 주문 발주 PWA',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/* manifest.json 연결 */}
            <link rel="manifest" href="/manifest.json" />
            {/* 아이콘 설정 */}
            <link rel="icon" href="/images/test_192x192.png" sizes="192x192" />
            <link
                rel="apple-touch-icon"
                href="/images/test_512x512.png"
                sizes="512x512"
            />
            <meta name="theme-color" content="#000000" />
            <body>{children}</body>
        </html>
    );
}
