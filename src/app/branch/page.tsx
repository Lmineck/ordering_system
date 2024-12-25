'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    return (
        <div className="flex-grow flex items-center justify-center">
            <div className="w-[320px] aspect-[3/4] bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between">
                <div className="aspect-square w-full mb-4">
                    <Link
                        href="/branch/quick-order"
                        className="flex-1 aspect-square"
                    >
                        <Button
                            size="lg"
                            className="w-full h-full text-2xl font-bold bg-blue-600 hover:bg-blue-700"
                        >
                            빠른 주문
                        </Button>
                    </Link>
                </div>

                <div className="flex space-x-4 w-full">
                    <Link href="/mypage" className="flex-1 aspect-square">
                        <Button
                            variant="outline"
                            className="w-full h-full text-lg font-semibold bg-white hover:bg-gray-100"
                        >
                            마이페이지
                        </Button>
                    </Link>
                    <Link
                        href="/order-history"
                        className="flex-1 aspect-square"
                    >
                        <Button
                            variant="outline"
                            className="w-full h-full text-lg font-semibold bg-white hover:bg-gray-100"
                        >
                            주문내역
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
