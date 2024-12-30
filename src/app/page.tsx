'use client';

import { useAuthStore } from '@/stores/authStore';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const { user, isLoggedIn } = useAuthStore();

    useEffect(() => {
        // 사용자 권한 검증 및 리다이렉트 처리
        if (isLoggedIn === null) return;
        if (!isLoggedIn) {
            redirect('/auth/login');
        } else if (user?.role === 'user') {
            redirect('/branch');
        } else if (user?.role === 'admin') {
            redirect('/admin');
        }
    }, [user, isLoggedIn]);

    return null;
}
