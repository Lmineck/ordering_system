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

const ITEMS_PER_PAGE = 5;

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

export interface Branch {
    id: string;
    name: string;
    orders: Order[];
}

export interface PaginatedOrders {
    orders: Order[];
    totalPages: number;
    currentPage: number;
}

export default function AdminBranchOrderList() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [paginatedOrders, setPaginatedOrders] = useState<PaginatedOrders>({
        orders: [],
        totalPages: 0,
        currentPage: 1,
    });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        // Fetch branches from API in a real application
        const dummyBranches: Branch[] = Array.from({ length: 10 }, (_, i) => ({
            id: `branch-${i + 1}`,
            name: `지점 ${i + 1}`,
            orders: Array.from({ length: 20 }, (_, j) => ({
                id: `order-${i}-${j}`,
                date: new Date(2023, 5, j + 1).toISOString(),
                items: Array.from({ length: 5 }, (_, k) => ({
                    id: `item-${i}-${j}-${k}`,
                    category: ['과일', '채소', '육류', '유제품', '가공식품'][
                        Math.floor(Math.random() * 5)
                    ],
                    name: ['사과', '바나나', '당근', '소고기', '우유'][
                        Math.floor(Math.random() * 5)
                    ],
                    quantity: Math.floor(Math.random() * 50) + 1,
                })),
            })),
        }));

        setBranches(dummyBranches);
    }, []);

    const handleBranchClick = (branch: Branch) => {
        setSelectedBranch(branch);
        setPaginatedOrders({
            orders: branch.orders.slice(0, ITEMS_PER_PAGE),
            totalPages: Math.ceil(branch.orders.length / ITEMS_PER_PAGE),
            currentPage: 1,
        });
        setSelectedOrder(null);
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
    };

    const changePage = (newPage: number) => {
        if (selectedBranch) {
            const startIndex = (newPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            setPaginatedOrders((prev) => ({
                ...prev,
                orders: selectedBranch.orders.slice(startIndex, endIndex),
                currentPage: newPage,
            }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-center">
                지점별 발주 목록
            </h1>
            <AnimatePresence mode="wait">
                {selectedOrder ? (
                    <OrderDetail
                        order={selectedOrder}
                        onBack={() => setSelectedOrder(null)}
                    />
                ) : selectedBranch ? (
                    <OrderList
                        branch={selectedBranch}
                        orders={paginatedOrders.orders}
                        currentPage={paginatedOrders.currentPage}
                        totalPages={paginatedOrders.totalPages}
                        onOrderClick={handleOrderClick}
                        onPageChange={changePage}
                        onBack={() => setSelectedBranch(null)}
                    />
                ) : (
                    <BranchList
                        branches={branches}
                        onBranchClick={handleBranchClick}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

interface BranchListProps {
    branches: Branch[];
    onBranchClick: (branch: Branch) => void;
}

function BranchList({ branches, onBranchClick }: BranchListProps) {
    return (
        <motion.div
            key="branch-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-white shadow-lg">
                <CardContent className="p-0">
                    <ScrollArea className="h-[70vh]">
                        <ul className="divide-y">
                            {branches.map((branch, index) => (
                                <motion.li
                                    key={branch.id}
                                    whileHover={{
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                    }}
                                    onClick={() => onBranchClick(branch)}
                                    className={`flex items-center justify-between p-4 cursor-pointer ${
                                        index === branches.length - 1
                                            ? 'border-b-2 border-gray-200'
                                            : ''
                                    }`}
                                >
                                    <div>
                                        <p className="font-medium">
                                            {branch.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            총 {branch.orders.length}개 주문
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </motion.li>
                            ))}
                        </ul>
                    </ScrollArea>
                </CardContent>
            </Card>
        </motion.div>
    );
}

interface OrderListProps {
    branch: Branch;
    orders: Order[];
    currentPage: number;
    totalPages: number;
    onOrderClick: (order: Order) => void;
    onPageChange: (page: number) => void;
    onBack: () => void;
}

function OrderList({
    branch,
    orders,
    currentPage,
    totalPages,
    onOrderClick,
    onPageChange,
    onBack,
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
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <span>{branch.name} 발주 목록</span>
                    </CardTitle>
                </CardHeader>
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
