'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addDoc, collection } from '@firebase/firestore';
import { myFirestore } from '@/app/firebase/firebase';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();

    const [id, setId] = useState(''); // 입력된 ID
    const [password, setPassword] = useState(''); // 입력된 패스워드
    const [name, setName] = useState(''); // 입력된 이름
    const [phone, setPhone] = useState(''); // 입력된 핸드폰번호
    const [branch, setBranch] = useState(''); // 입력된 지점

    const handleRegister = async () => {
        if (!id || !password || !name || !phone || !branch) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            // 현재 시간 생성 및 변환
            const now = new Date();
            const formattedTime = `${now.getFullYear()}${String(
                now.getMonth() + 1,
            ).padStart(
                2,
                '0',
            )}${String(now.getDate()).padStart(2, '0')}${String(
                now.getHours(),
            ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

            // Firestore의 users 컬렉션에 데이터 추가
            const docRef = await addDoc(collection(myFirestore, 'user'), {
                id,
                password,
                name,
                phone,
                branch,
                createdAt: formattedTime, // 생성 시간
                updatedAt: formattedTime, // 수정 시간
                role: 'guest', // role 값 하드코딩
            });

            alert('회원가입이 완료되었습니다! ID: ' + docRef.id);

            router.replace('/auth/login');
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
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
                <div>
                    <Label htmlFor="name">이름</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="phone">핸드폰번호</Label>
                    <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="branch">지점</Label>
                    <Input
                        id="branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                        onClick={handleRegister}
                    >
                        회원가입
                    </Button>
                </div>
            </div>
        </div>
    );
}
