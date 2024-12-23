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
            <body>{children}</body>
        </html>
    );
}
