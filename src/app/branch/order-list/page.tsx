'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Package } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface OrderItem {
    id: string;
    name: string;
    unit: string;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    items: OrderItem[];
}

export interface PaginatedOrders {
    orders: Order[];
    totalPages: number;
    currentPage: number;
}

const ITEMS_PER_PAGE = 5;

export default function OrderHistory() {
    const [paginatedOrders, setPaginatedOrders] = useState<PaginatedOrders>({
        orders: [],
        totalPages: 0,
        currentPage: 1,
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        // 여기서 실제 API 호출을 통해 주문 데이터를 가져올 수 있습니다.
        // 이 예제에서는 더미 데이터를 사용합니다.
        const dummyOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
            id: `${i + 1}`,
            date: new Date(2023, 5, i + 1, 10, 0).toISOString(),
            status: ['pending', 'processing', 'completed', 'cancelled'][
                Math.floor(Math.random() * 4)
            ] as Order['status'],
            items: [
                {
                    id: `${i}a`,
                    name: '사과',
                    unit: '개',
                    quantity: Math.floor(Math.random() * 10) + 1,
                },
                {
                    id: `${i}b`,
                    name: '바나나',
                    unit: '송이',
                    quantity: Math.floor(Math.random() * 5) + 1,
                },
            ],
        }));

        const totalPages = Math.ceil(dummyOrders.length / ITEMS_PER_PAGE);
        setPaginatedOrders({
            orders: dummyOrders.slice(0, ITEMS_PER_PAGE),
            totalPages,
            currentPage: 1,
        });
    }, []);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'processing':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleCancelOrder = (orderId: string) => {
        // 여기서 실제 API 호출을 통해 주문을 취소할 수 있습니다.
        console.log(`주문 ${orderId} 취소`);
        setPaginatedOrders((prev) => ({
            ...prev,
            orders: prev.orders.map((order) =>
                order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order,
            ),
        }));
        setSelectedOrder(null);
    };

    const changePage = (newPage: number) => {
        // 실제 구현에서는 여기서 API를 호출하여 새 페이지 데이터를 가져와야 합니다.
        const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedOrders((prev) => ({
            ...prev,
            orders: Array.from({ length: 20 }, (_, i) => ({
                id: `${i + 1 + startIndex}`,
                date: new Date(
                    2023,
                    5,
                    i + 1 + startIndex,
                    10,
                    0,
                ).toISOString(),
                status: ['pending', 'processing', 'completed', 'cancelled'][
                    Math.floor(Math.random() * 4)
                ] as Order['status'],
                items: [
                    {
                        id: `${i + startIndex}a`,
                        name: '사과',
                        unit: '개',
                        quantity: Math.floor(Math.random() * 10) + 1,
                    },
                    {
                        id: `${i + startIndex}b`,
                        name: '바나나',
                        unit: '송이',
                        quantity: Math.floor(Math.random() * 5) + 1,
                    },
                ],
            })).slice(0, ITEMS_PER_PAGE),
            currentPage: newPage,
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-center">주문 내역</h1>
            <AnimatePresence mode="wait">
                {selectedOrder ? (
                    <motion.div
                        key="order-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedOrder(null)}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <span>
                                        {format(
                                            parseISO(selectedOrder.date),
                                            'yyyy년 MM월 dd일 EEEE',
                                            { locale: ko },
                                        )}
                                    </span>
                                    <Badge variant="outline">
                                        {selectedOrder.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[50vh]">
                                    <ul className="space-y-4">
                                        {selectedOrder.items.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Package className="h-6 w-6 text-primary" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.quantity}{' '}
                                                            {item.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                                {selectedOrder.status !== 'cancelled' && (
                                    <Button
                                        variant="destructive"
                                        className="w-full mt-6"
                                        onClick={() =>
                                            handleCancelOrder(selectedOrder.id)
                                        }
                                    >
                                        주문 취소
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="order-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="bg-white shadow-lg">
                            <CardContent className="p-0">
                                <ScrollArea className="h-[60vh]">
                                    <ul className="divide-y">
                                        {paginatedOrders.orders.map(
                                            (order, index) => (
                                                <motion.li
                                                    key={order.id}
                                                    whileHover={{
                                                        backgroundColor:
                                                            'rgba(0,0,0,0.05)',
                                                    }}
                                                    onClick={() =>
                                                        handleOrderClick(order)
                                                    }
                                                    className={`flex items-center justify-between p-4 cursor-pointer ${
                                                        index ===
                                                        ITEMS_PER_PAGE - 1
                                                            ? 'border-b-2 border-gray-200'
                                                            : ''
                                                    }`}
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {format(
                                                                parseISO(
                                                                    order.date,
                                                                ),
                                                                'yyyy년 MM월 dd일 EEEE',
                                                                { locale: ko },
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(
                                                                parseISO(
                                                                    order.date,
                                                                ),
                                                                'HH:mm',
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline">
                                                            {order.status}
                                                        </Badge>
                                                        <div
                                                            className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}
                                                        ></div>
                                                    </div>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    onClick={() =>
                                        changePage(
                                            paginatedOrders.currentPage - 1,
                                        )
                                    }
                                    disabled={paginatedOrders.currentPage === 1}
                                >
                                    이전 페이지
                                </Button>
                                <span>
                                    {paginatedOrders.currentPage} /{' '}
                                    {paginatedOrders.totalPages}
                                </span>
                                <Button
                                    onClick={() =>
                                        changePage(
                                            paginatedOrders.currentPage + 1,
                                        )
                                    }
                                    disabled={
                                        paginatedOrders.currentPage ===
                                        paginatedOrders.totalPages
                                    }
                                >
                                    다음 페이지
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
