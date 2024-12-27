'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';

interface User {
    id: string;
    userId: string;
    password: string;
    role: string;
    name: string;
    phone: string;
    branch: string;
    createdAt: string;
    updatedAt: string;
}

const dummyUser: User = {
    id: '1',
    userId: 'john.doe',
    password: '********',
    role: 'user',
    name: '홍길동',
    phone: '010-1234-5678',
    branch: '서울',
    createdAt: '2023-01-01',
    updatedAt: '2023-06-15',
};

export default function MyPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<User>(dummyUser);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Updated user:', user);
        setIsEditing(false);
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
                        내 프로필
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
                                        value={user.userId}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">비밀번호</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={user.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={user.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">전화번호</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button type="submit">
                                        <Save className="w-4 h-4 mr-2" />
                                        저장
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
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
                                        <p className="text-sm font-medium text-muted-foreground">
                                            이름
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            사용자 ID
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.userId}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            전화번호
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            역할
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.role}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            지점
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.branch}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            가입일
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.createdAt}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            수정일
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {user.updatedAt}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => setIsEditing(true)}>
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
