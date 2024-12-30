'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { User } from '@/types/user';
import UserService from '@/services/UserService';
import { formatDate } from '@/utils/formatDate';
import Loading from '@/app/loading';

const userService = new UserService();

const sortUsers = (users: User[]) => {
    return users.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        if (a.role === 'guest' && b.role !== 'guest') return -1;
        if (a.role !== 'guest' && b.role === 'guest') return 1;
        return a.branch.localeCompare(b.branch);
    });
};

const getRoleLabel = (role: string) => {
    switch (role) {
        case 'admin':
            return '관리자';
        case 'user':
            return '유저';
        case 'guest':
            return '승인 대기';
        default:
            return role; // Fallback for unexpected roles
    }
};

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true); // 로딩 시작
            try {
                const fetchedUsers = await userService.getAllUsers();
                setUsers(sortUsers(fetchedUsers));
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };
        fetchUsers();
    }, []);

    const approveUser = async (id: string) => {
        await userService.upgradeRoleToUser(id);
        setUsers((prevUsers) =>
            sortUsers(
                prevUsers.map((user) =>
                    user.id === id ? { ...user, role: 'user' } : user,
                ),
            ),
        );
        setSelectedUser((prev) =>
            prev && prev.id === id ? { ...prev, role: 'user' } : prev,
        );
    };

    const deleteUser = async (id: string) => {
        await userService.deleteUserById(id);
        setUsers((prevUsers) =>
            sortUsers(prevUsers.filter((user) => user.id !== id)),
        );
        setSelectedUser(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center">지점 관리</h1>
            <Card className="w-full">
                <CardHeader className="relative flex flex-col items-center">
                    <div className="flex justify-between w-full items-center">
                        <div className="absolute left-0">
                            {selectedUser && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedUser(null)}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <CardTitle className="text-center mx-auto">
                            {selectedUser ? '지점 상세 정보' : '지점 목록'}
                        </CardTitle>
                    </div>
                    {!selectedUser && (
                        <div className="mt-2">
                            <Badge
                                variant="secondary"
                                className="text-gray-500"
                            >
                                총 가입된 지점 수: {users.length}
                            </Badge>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-2">
                                    <p>
                                        <strong>지점:</strong>{' '}
                                        {selectedUser.branch}
                                    </p>
                                    <p>
                                        <strong>이름:</strong>{' '}
                                        {selectedUser.name}
                                    </p>
                                    <p>
                                        <strong>아이디:</strong>{' '}
                                        {selectedUser.userId}
                                    </p>
                                    <p>
                                        <strong>역할:</strong>{' '}
                                        {getRoleLabel(selectedUser.role)}
                                    </p>
                                    <p>
                                        <strong>전화번호:</strong>{' '}
                                        {selectedUser.phone}
                                    </p>
                                    <p>
                                        <strong>생성일:</strong>{' '}
                                        {formatDate(selectedUser.createdAt)}
                                    </p>
                                    <p>
                                        <strong>수정일:</strong>{' '}
                                        {formatDate(selectedUser.updatedAt)}
                                    </p>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        {selectedUser.role === 'guest' && (
                                            <Button
                                                onClick={() =>
                                                    approveUser(selectedUser.id)
                                                }
                                                className="bg-green-500 text-white hover:bg-green-600"
                                            >
                                                승인
                                            </Button>
                                        )}
                                        {selectedUser.role !== 'admin' && (
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    deleteUser(selectedUser.id)
                                                }
                                                className="bg-red-500 text-white hover:bg-red-600"
                                            >
                                                삭제
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.ul
                                key="list"
                                className="space-y-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {users.map((user) => (
                                    <motion.li
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <span>{user.branch}</span>
                                        <Badge
                                            style={{
                                                backgroundColor:
                                                    user.role === 'admin'
                                                        ? 'blue'
                                                        : user.role === 'user'
                                                          ? 'green'
                                                          : 'red',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {getRoleLabel(user.role)}
                                        </Badge>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}
