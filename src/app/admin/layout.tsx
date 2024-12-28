'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/dist/client/components/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuthStore();

    useEffect(() => {
        // 사용자 권한 검증 및 리다이렉트 처리
        if (isLoggedIn === null) return;
        if (!isLoggedIn) {
            router.replace('/auth/login');
        } else if (user?.role !== 'admin') {
            logout(); // 로그아웃 호출
            router.replace('/auth/login');
        }
    }, [user, isLoggedIn, logout, router]);

    // 리다이렉트 처리 중 로딩 상태를 표시할 수 있음
    if (user?.role !== 'admin' || !isLoggedIn) {
        return <div>Redirecting...</div>;
    }

    const adminName = '관리자';

    return (
        <div className="flex flex-col min-h-screen p-4">
            {/* 헤더 */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Image
                        src="/svgs/home.svg"
                        alt="홈"
                        width={20}
                        height={20}
                        className="cursor-pointer mr-4"
                        onClick={() => router.replace('/admin')}
                    />
                    <span className="text-lg font-semibold">{adminName}</span>
                </div>
                <Button onClick={logout} variant="outline" size="lg">
                    로그아웃
                </Button>
            </header>

            {/* 페이지의 콘텐츠 */}
            <main>{children}</main>
        </div>
    );
}
