import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null; // 현재 로그인된 사용자 정보
    isLoggedIn: boolean; // 로그인 상태
    login: (user: User) => void; // 로그인 함수
    logout: () => void; // 로그아웃 함수
}

// Zustand store 생성
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: false,
            // 로그인 처리
            login: (user: User) => {
                console.log('User set:', user); // 로그 출력
                set(() => ({
                    user,
                    isLoggedIn: true,
                }));
            },
            // 로그아웃 처리
            logout: () => {
                console.log('User cleared.'); // 로그 출력
                set(() => ({
                    user: null,
                    isLoggedIn: false,
                }));
            },
        }),
        {
            name: 'auth-storage', // localStorage 키 이름
            storage: {
                getItem: (name) => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
        },
    ),
);
