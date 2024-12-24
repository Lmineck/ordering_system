'use client';

import { collection, getDocs } from '@firebase/firestore';
import { myFirestore } from '@/app/firebase/firebase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const [data, setData] = useState<
        Array<{ id: string; [key: string]: string }>
    >([]); // 사용자 데이터 상태
    const [id, setId] = useState(''); // 입력된 ID
    const [password, setPassword] = useState(''); // 입력된 패스워드
    const [message, setMessage] = useState(''); // 로그인 결과 메시지

    // Firestore에서 데이터 가져오기
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(myFirestore, 'user'),
            );
            const fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id, // 문서 ID 포함
                ...doc.data(),
            }));
            setData(fetchedData); // 가져온 데이터를 상태에 저장
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [data]);

    // 로그인 처리 함수
    const handleLogin = () => {
        const user = data.find(
            (user) => user.id === id && user.password === password,
        );

        if (user) {
            setMessage(user.branch); // 성공 메시지 설정
        } else {
            setMessage('로그인 실패! 아이디 또는 비밀번호를 확인하세요.'); // 실패 메시지 설정
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
            <div onSubmit={handleLogin} className="w-full max-w-md space-y-4">
                <div>
                    <Label htmlFor="id">아이디</Label>
                    <Input
                        id="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
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
                    <Button type="submit" variant="outline" className="w-[48%]">
                        로그인
                    </Button>
                    <Link href="/signup" className="w-[48%]">
                        <Button variant="outline" className="w-full">
                            회원가입
                        </Button>
                    </Link>
                </div>
                <p>{message}</p>
            </div>
        </div>
    );
}
