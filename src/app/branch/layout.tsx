'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '../loading';

export default function BranchLayout({
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
        } else if (user?.role !== 'user') {
            logout(); // 로그아웃 호출
            router.replace('/auth/login');
        }
    }, [user, isLoggedIn, logout, router]);

    // 리다이렉트 처리 중 로딩 상태를 표시할 수 있음
    if (user?.role !== 'user' || !isLoggedIn) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col min-h-screen p-4">
            {/* 헤더 */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Image
                        src="/svgs/home.svg"
                        alt="홈"
                        width={30}
                        height={30}
                        className="cursor-pointer mr-4"
                        onClick={() => router.replace('/branch')}
                    />
                    <span className="text-xl font-semibold">
                        {user?.branch}
                    </span>
                </div>
                <Button onClick={logout} variant="outline" size="default">
                    로그아웃
                </Button>
            </header>

            {/* 페이지 콘텐츠 */}
            <main>{children}</main>
        </div>
    );
}
