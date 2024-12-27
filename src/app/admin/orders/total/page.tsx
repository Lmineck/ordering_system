'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface OrderItem {
    id: string;
    category: string;
    name: string;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
}

export interface PaginatedOrders {
    orders: Order[];
    totalPages: number;
    currentPage: number;
}

const ITEMS_PER_PAGE = 5;

export default function AdminOrderList() {
    const [paginatedOrders, setPaginatedOrders] = useState<PaginatedOrders>({
        orders: [],
        totalPages: 0,
        currentPage: 1,
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        // Fetch orders from API in a real application
        const dummyOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
            id: `${i + 1}`,
            date: new Date(2023, 5, i + 1).toISOString(),
            items: Array.from({ length: 5 }, (_, j) => ({
                id: `${i}-${j}`,
                category: ['과일', '채소', '육류', '유제품', '가공식품'][
                    Math.floor(Math.random() * 5)
                ],
                name: ['사과', '바나나', '당근', '소고기', '우유'][
                    Math.floor(Math.random() * 5)
                ],
                quantity: Math.floor(Math.random() * 50) + 1,
            })),
        }));

        const totalPages = Math.ceil(dummyOrders.length / ITEMS_PER_PAGE);
        setPaginatedOrders({
            orders: dummyOrders.slice(0, ITEMS_PER_PAGE),
            totalPages,
            currentPage: 1,
        });
    }, []);

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
    };

    const changePage = (newPage: number) => {
        // In a real application, fetch new page data from API
        const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedOrders((prev) => ({
            ...prev,
            orders: Array.from({ length: 20 }, (_, i) => ({
                id: `${i + 1 + startIndex}`,
                date: new Date(2023, 5, i + 1 + startIndex).toISOString(),
                items: Array.from({ length: 5 }, (_, j) => ({
                    id: `${i + startIndex}-${j}`,
                    category: ['과일', '채소', '육류', '유제품', '가공식품'][
                        Math.floor(Math.random() * 5)
                    ],
                    name: ['사과', '바나나', '당근', '소고기', '우유'][
                        Math.floor(Math.random() * 5)
                    ],
                    quantity: Math.floor(Math.random() * 50) + 1,
                })),
            })).slice(0, ITEMS_PER_PAGE),
            currentPage: newPage,
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">
                일자별 발주 목록 ( 총합 )
            </h1>
            <AnimatePresence mode="wait">
                {selectedOrder ? (
                    <OrderDetail
                        order={selectedOrder}
                        onBack={() => setSelectedOrder(null)}
                    />
                ) : (
                    <OrderList
                        orders={paginatedOrders.orders}
                        currentPage={paginatedOrders.currentPage}
                        totalPages={paginatedOrders.totalPages}
                        onOrderClick={handleOrderClick}
                        onPageChange={changePage}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

interface OrderListProps {
    orders: Order[];
    currentPage: number;
    totalPages: number;
    onOrderClick: (order: Order) => void;
    onPageChange: (page: number) => void;
}

function OrderList({
    orders,
    currentPage,
    totalPages,
    onOrderClick,
    onPageChange,
}: OrderListProps) {
    return (
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
                            {orders.map((order, index) => (
                                <motion.li
                                    key={order.id}
                                    whileHover={{
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                    }}
                                    onClick={() => onOrderClick(order)}
                                    className={`flex items-center justify-between p-4 cursor-pointer ${
                                        index === orders.length - 1
                                            ? 'border-b-2 border-gray-200'
                                            : ''
                                    }`}
                                >
                                    <div>
                                        <p className="font-medium">
                                            {format(
                                                parseISO(order.date),
                                                'yyyy년 MM월 dd일 EEEE',
                                                { locale: ko },
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            총 {order.items.length}개 품목
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </motion.li>
                            ))}
                        </ul>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        이전 페이지
                    </Button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        다음 페이지
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

interface OrderDetailProps {
    order: Order;
    onBack: () => void;
}

function OrderDetail({ order, onBack }: OrderDetailProps) {
    return (
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
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <span>
                            {format(
                                parseISO(order.date),
                                'yyyy년 MM월 dd일 EEEE',
                                { locale: ko },
                            )}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2">카테고리</th>
                                    <th className="pb-2">품목명</th>
                                    <th className="pb-2 text-right">수량</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="py-3">
                                            {item.category}
                                        </td>
                                        <td className="py-3">{item.name}</td>
                                        <td className="py-3 text-right">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </motion.div>
    );
}
