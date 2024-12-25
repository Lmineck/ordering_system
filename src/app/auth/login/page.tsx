'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '@/types/auth/login-request';

export default function Login() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // 로그인 처리 함수
    const handleLogin = async () => {
        try {
            const requestBody: LoginRequest = {
                userId,
                password,
            };

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const loginedUser = await response.json();
                if (loginedUser?.role === 'admin') {
                    login(loginedUser);
                    alert(`로그인 성공! 환영합니다, ${loginedUser?.name}`);
                    router.replace('/admin');
                } else if (loginedUser?.role === 'user') {
                    login(loginedUser);
                    alert(`로그인 성공! 환영합니다, ${loginedUser?.name}`);
                    router.replace('/branch');
                } else {
                    alert(
                        `'${loginedUser?.name}' 님은 계정 승인 대기중입니다.`,
                    );
                }
            } else {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
            <Image
                src="/images/logo.png"
                alt="회사 로고"
                width={200}
                height={200}
                className="mb-8"
            />
            <div className="w-full max-w-md space-y-4">
                <div>
                    <Label htmlFor="id">아이디</Label>
                    <Input
                        id="id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-between">
                    {/* 로그인 버튼 */}
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-[48%] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        onClick={handleLogin}
                    >
                        로그인
                    </Button>

                    {/* 회원가입 버튼 */}
                    <Link href="/auth/register" className="w-[48%]">
                        <Button
                            variant="outline"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            회원가입
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
