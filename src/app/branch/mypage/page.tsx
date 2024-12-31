'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import UserService from '@/services/UserService';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { formatDate } from '@/utils/formatDate';

const userService = new UserService();

export default function MyPage() {
    const { user, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        userId: user?.userId || '',
        password: '',
        confirmPassword: '',
        name: user?.name || '',
        phone: user?.phone || '',
        branch: user?.branch || '',
    });

    // 유효성 상태 관리
    const [isUserIdValid, setIsUserIdValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    // 유효성 검사 정규식
    const userIdRegex = /^[a-z0-9]{6,12}$/; // 사용자 ID 규칙
    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    // user 상태가 변경될 때 formData도 초기화
    useEffect(() => {
        if (user) {
            setFormData({
                userId: user.userId || '',
                password: '',
                confirmPassword: '',
                name: user.name || '',
                phone: user.phone || '',
                branch: user.branch || '',
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                userId: user.userId,
                password: '',
                confirmPassword: '',
                name: user.name,
                phone: user.phone,
                branch: user.branch,
            });
        }
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        const userIdValid = userIdRegex.test(formData.userId);
        const passwordValid =
            formData.password !== '' && passwordRegex.test(formData.password);
        const confirmPasswordValid =
            formData.password === formData.confirmPassword;
        const phoneValid = phoneRegex.test(formData.phone);

        setIsUserIdValid(userIdValid);
        setIsPasswordValid(passwordValid);
        setIsConfirmPasswordValid(confirmPasswordValid);
        setIsPhoneValid(phoneValid);

        if (
            !userIdValid ||
            !passwordValid ||
            !confirmPasswordValid ||
            !phoneValid
        ) {
            alert('입력값을 확인해주세요.');
            return;
        }

        const now = new Date();
        const formattedTime = format(now, 'yyyyMMddHHmmss');

        // 서버 요청 데이터 생성
        const updateData: Partial<User> = {
            userId: formData.userId,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            updatedAt: formattedTime,
        };

        // 비밀번호가 입력된 경우에만 추가
        if (formData.password) {
            updateData.password = formData.password;
        }

        try {
            // 서버에 업데이트 요청
            await userService.updateUser(user!.id, updateData);

            // 성공적으로 저장 시 상태 업데이트
            setUser({
                ...user,
                userId: formData.userId,
                name: formData.name,
                phone: formData.phone,
                updatedAt: formattedTime,
            });

            setIsEditing(false);
            alert('수정이 완료되었습니다.');
        } catch (error) {
            console.error(error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-md"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isEditing ? '내 프로필 수정' : '내 프로필'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.form
                                key="edit-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="userId">사용자 ID</Label>
                                    <Input
                                        id="userId"
                                        name="userId"
                                        value={formData.userId}
                                        disabled
                                    />
                                    {!isUserIdValid && (
                                        <p className="text-sm text-red-500">
                                            사용자 ID는 영문 소문자 및 숫자로
                                            6~12자로 입력해야 합니다.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        새 비밀번호
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="비밀번호를 입력하세요"
                                        className={`${
                                            isPasswordValid
                                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        }`}
                                    />
                                    {!isPasswordValid && (
                                        <p className="text-sm text-red-500">
                                            비밀번호는 숫자, 영문자, 특수문자를
                                            포함한 최소 8자여야 합니다.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        새 비밀번호 확인
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        className={`${
                                            isConfirmPasswordValid
                                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        }`}
                                    />
                                    {!isConfirmPasswordValid && (
                                        <p className="text-sm text-red-500">
                                            비밀번호와 비밀번호 확인이 일치하지
                                            않습니다.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">전화번호</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="010-0000-0000"
                                        className={`${
                                            isPhoneValid
                                                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        }`}
                                    />
                                    {!isPhoneValid && (
                                        <p className="text-sm text-red-500">
                                            전화번호는 010-0000-0000 형식이어야
                                            합니다.
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branch">지점</Label>
                                    <Input
                                        id="branch"
                                        name="branch"
                                        value={formData.branch}
                                        disabled
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="submit"
                                        className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 border border-blue-500 focus:ring focus:ring-blue-300"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        저장
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-red-500 text-white hover:bg-white hover:text-red-500 border border-red-500 focus:ring focus:ring-red-300"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        취소
                                    </Button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="view-profile"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground text-gray-600">
                                            지점
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user!.branch}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground  text-gray-600">
                                            이름
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user!.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground text-gray-600">
                                            사용자 ID
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user!.userId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground  text-gray-600">
                                            전화번호
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user!.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground  text-gray-600">
                                            가입일
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {formatDate(user!.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground  text-gray-600">
                                            수정일
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {formatDate(user!.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleEdit}
                                        className="bg-green-500 text-white hover:bg-white hover:text-green-500 border border-green-500 focus:ring focus:ring-green-300"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        수정
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
}
