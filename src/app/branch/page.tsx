'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const userName = '홍길동'; // This would typically come from a state or context

    return (
        <div className="flex flex-col min-h-screen p-4">
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    {/* <UserCircle className="h-12 w-12 text-gray-700 mr-2" /> */}
                    <span className="text-xl font-semibold">{userName}</span>
                </div>
                <Button variant="outline" size="lg">
                    매장 변경
                </Button>
            </header>

            <main className="flex-grow flex items-center justify-center">
                <div className="w-[320px] aspect-[3/4] bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between">
                    <div className="aspect-square w-full mb-4">
                        <Button
                            size="lg"
                            className="w-full h-full text-2xl font-bold bg-blue-600 hover:bg-blue-700"
                        >
                            빠른 주문
                        </Button>
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
            </main>
        </div>
    );
}
