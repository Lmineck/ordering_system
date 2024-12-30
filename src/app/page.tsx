'use client';

import { useAuthStore } from '@/stores/authStore';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './loading';

export default function Home() {
    const { user, isLoggedIn, isLoading } = useAuthStore();

    useEffect(() => {
        if (isLoading) return; // 로컬 저장소 로드 중에는 아무것도 하지 않음
        if (!isLoggedIn) {
            redirect('/auth/login');
        } else if (user?.role === 'user') {
            redirect('/branch');
        } else if (user?.role === 'admin') {
            redirect('/admin');
        }
    }, [user, isLoggedIn, isLoading]);

    if (isLoading) {
        return <Loading />;
    }

    return null;
}
