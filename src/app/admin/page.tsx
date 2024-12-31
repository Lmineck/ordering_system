'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    return (
        <div className="flex items-center justify-center h-[75vh] bg-white">
            <div className="w-[320px] h-[400px] bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between">
                <div className="flex flex-col h-full justify-between">
                    <Link href="/admin/orders" className="flex-grow flex">
                        <Button
                            size="lg"
                            className="w-full h-full text-2xl font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            주문 보기
                        </Button>
                    </Link>
                    <div className="flex space-x-4 w-full mt-4">
                        <Link href="/admin/items" className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full h-32 text-lg font-semibold bg-white hover:bg-gray-100"
                            >
                                품목 관리
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
            </div>
        </div>
    );
}
