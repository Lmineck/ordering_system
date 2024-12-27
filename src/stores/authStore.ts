import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    isLoggedIn: boolean | null; // null로 초기화
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoggedIn: null, // 초기값 null
            login: (user: User) => {
                console.log('User set:', user);
                set(() => ({
                    user,
                    isLoggedIn: true,
                }));
            },
            logout: () => {
                console.log('User cleared.');
                set(() => ({
                    user: null,
                    isLoggedIn: false,
                }));
            },
        }),
        {
            name: 'auth-storage',
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
