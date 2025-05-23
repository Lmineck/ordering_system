'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { RegisterRequest } from '@/types/auth/register-request';
import { useAuthStore } from '@/stores/authStore';

export default function Register() {
    const router = useRouter();
    const { logout } = useAuthStore();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [branch, setBranch] = useState('');
    const [isIdValid, setIsIdValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isBranchValid, setIsBranchValid] = useState(false);
    const [idTouched, setIdTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [branchTouched, setBranchTouched] = useState(false);

    useEffect(() => {
        logout();
    }, [logout]);

    // 아이디 규칙: 영문 소문자 및 숫자, 6~12자
    const idRegex = /^[a-z0-9]{6,12}$/;

    // 비밀번호 규칙: 최소 8자, 숫자, 영문자, 특수문자 포함
    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // 핸드폰 번호 규칙: 010-0000-0000 형식
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    // 지점 규칙: "오일내"로 시작하고 "점"으로 끝나는 문자열
    const branchRegex = /^오일내.+점$/;

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserId(value);
        setIsIdValid(idRegex.test(value));
        setIdTouched(true);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setIsPasswordValid(passwordRegex.test(value));
        setPasswordTouched(true);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        setIsPhoneValid(phoneRegex.test(value));
        setPhoneTouched(true);
    };

    const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBranch(value);
        setIsBranchValid(branchRegex.test(value));
        setBranchTouched(true);
    };

    const handleRegister = async () => {
        try {
            const requestBody: RegisterRequest = {
                userId,
                password,
                name,
                phone,
                branch,
            };

            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다!');
                router.replace('/auth/login');
            } else {
                const error = await response.json();
                alert('회원가입 실패: ' + error.message);
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    const handleLogin = () => {
        router.replace('/auth/login');
    };

    // 모든 유효성 검사 통과 여부 확인
    const isFormValid =
        isIdValid && isPasswordValid && isPhoneValid && isBranchValid;

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
                        placeholder="영문 소문자 및 숫자, 6~12자로 입력하세요"
                        value={userId}
                        onChange={handleIdChange}
                        required
                        className={`${
                            idTouched && !isIdValid
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } w-full`}
                    />
                    {idTouched && !isIdValid && (
                        <p className="mt-1 text-sm text-red-500">
                            아이디는 영문 소문자 및 숫자로 6~12자로 입력해야
                            합니다.
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="숫자, 영문자, 특수문자 포함 최소 8자"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className={`${
                            passwordTouched && !isPasswordValid
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } w-full`}
                    />
                    {passwordTouched && !isPasswordValid && (
                        <p className="mt-1 text-sm text-red-500">
                            비밀번호는 숫자, 영문자, 특수문자를 포함한 최소
                            8자여야 합니다.
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="name">이름</Label>
                    <Input
                        id="name"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="phone">핸드폰번호</Label>
                    <Input
                        id="phone"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        className={`${
                            phoneTouched && !isPhoneValid
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } w-full`}
                    />
                    {phoneTouched && !isPhoneValid && (
                        <p className="mt-1 text-sm text-red-500">
                            핸드폰 번호는 010-0000-0000 형식이어야 합니다.
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="branch">지점</Label>
                    <Input
                        id="branch"
                        placeholder="오일내 신촌점"
                        value={branch}
                        onChange={handleBranchChange}
                        required
                        className={`${
                            branchTouched && !isBranchValid
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } w-full`}
                    />
                    {branchTouched && !isBranchValid && (
                        <p className="mt-1 text-sm text-red-500">
                            지점 이름은 &apos;오일내&apos;로 시작하고
                            &apos;점&apos;으로 끝나야 합니다.
                        </p>
                    )}
                </div>
                <div className="flex justify-between">
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        onClick={handleRegister}
                        disabled={!isFormValid} // 유효성 검사 결과에 따라 버튼 활성화/비활성화
                    >
                        회원가입 하기
                    </Button>
                </div>
                <div className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        onClick={handleLogin}
                    >
                        로그인 화면으로
                    </Button>
                </div>
            </div>
        </div>
    );
}
