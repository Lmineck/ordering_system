'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const [showOrderView, setShowOrderView] = useState(false);

    return (
        <div className="flex-grow flex items-center justify-center">
            <div className="w-[320px] h-[400px] bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between">
                {!showOrderView ? (
                    <div className="flex flex-col h-full justify-between">
                        <Button
                            size="lg"
                            className="w-full flex-grow text-2xl font-bold bg-blue-600 hover:bg-blue-700"
                            onClick={() => setShowOrderView(true)}
                        >
                            주문 보기
                        </Button>
                        <div className="flex space-x-4 w-full mt-4">
                            <Link href="/admin/items" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-32 text-lg font-semibold bg-white hover:bg-gray-100"
                                >
                                    상품 관리
                                </Button>
                            </Link>
                            <Link href="/admin/users" className="flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full h-32 text-lg font-semibold bg-white hover:bg-gray-100"
                                >
                                    유저 관리
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex-grow flex items-center justify-center w-full max-w-[600px] mx-auto">
                            <Link
                                href="/admin/orders/by-date"
                                className="flex-1 max-w-[200px] mx-2"
                            >
                                <Button
                                    size="lg"
                                    className="w-full h-[150px] text-xl font-bold bg-blue-600 hover:bg-blue-700"
                                >
                                    일자별
                                </Button>
                            </Link>
                            <Link
                                href="/admin/orders/by-branch"
                                className="flex-1 max-w-[200px] mx-2"
                            >
                                <Button
                                    size="lg"
                                    className="w-full h-[150px] text-xl font-bold bg-green-600 hover:bg-green-700"
                                >
                                    지점별
                                </Button>
                            </Link>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full h-16 mt-4 text-lg font-semibold"
                            onClick={() => setShowOrderView(false)}
                        >
                            뒤로가기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
