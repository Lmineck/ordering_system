import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    isLoggedIn: boolean | null; // 초기값 null
    isLoading: boolean; // 상태 로드 중인지 여부
    login: (user: User) => void;
    logout: () => void;
    setUser: (user: Partial<User>) => void;
    setLoading: (isLoading: boolean) => void; // isLoading 상태를 설정하는 메서드
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: null, // 초기값 null
            isLoading: true, // 로컬 저장소 로드 중
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
            setUser: (updatedFields: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...updatedFields };
                    set(() => ({
                        user: updatedUser,
                    }));
                }
            },
            setLoading: (isLoading: boolean) => {
                set(() => ({
                    isLoading,
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
            onRehydrateStorage: () => {
                return (state) => {
                    if (state) {
                        // 로드 완료 후 isLoading을 false로 설정
                        state.setLoading(false);
                    }
                };
            },
        },
    ),
);
