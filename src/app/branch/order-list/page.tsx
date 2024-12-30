'use client';

import React, { useEffect, useState } from 'react';
import FirebaseService from '@/services/FirebaseService';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { Order, OrderItem } from '@/types/order';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

const orderService = new FirebaseService<Order>('order');

function BranchOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [editingItem, setEditingItem] = useState<{
        orderId: string;
        itemIndex: number;
    } | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

    const branchName = user?.branch;

    const isToday = selectedDate ? isSameDay(selectedDate, new Date()) : false;

    const fetchBranchOrders = async (date: Date | null) => {
        try {
            if (!date) return;

            setLoading(true);

            const dateString = format(date, 'yyyyMMdd');

            const orders = await orderService.findOrdersByBranchAndDate(
                branchName,
                dateString,
            );
            setOrders(orders);
        } catch (err) {
            setError('주문 데이터를 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchOrders(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setIsDateDialogOpen(false);
    };

    const handleEditClick = (orderId: string, itemIndex: number) => {
        setEditingItem({ orderId, itemIndex });
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = async (orderId: string, itemIndex: number) => {
        try {
            const order = orders.find((o) => o.id === orderId);
            if (!order) return;

            const updatedItems = order.items.filter(
                (_, idx) => idx !== itemIndex,
            );

            await orderService.update(orderId, { items: updatedItems });

            setOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o.id === orderId ? { ...o, items: updatedItems } : o,
                ),
            );
            setSnackbarMessage('삭제되었습니다.');
        } catch (error) {
            console.error('주문 삭제 중 오류 발생:', error);
            alert('주문을 삭제하는 중 문제가 발생했습니다.');
        }
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;

        const { orderId, itemIndex } = editingItem;
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;

        try {
            // 수정된 아이템 목록 생성
            const updatedItems = order.items.map((item, idx) =>
                idx === itemIndex ? { ...item, quantity: item.quantity } : item,
            );

            // Firestore로 보낼 데이터에서 id 필드를 제외
            const { id, ...orderData } = order;

            // 업데이트 요청
            await orderService.update(orderId, {
                ...orderData,
                items: updatedItems,
            });

            // UI 상태 업데이트
            setOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o.id === orderId ? { ...o, items: updatedItems } : o,
                ),
            );
            setSnackbarMessage('수정되었습니다.');
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('주문 수정 중 오류 발생:', error);
            alert('주문을 수정하는 중 문제가 발생했습니다.');
        }
    };

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setEditingItem(null);
    };

    const handleDateDialogClose = () => {
        setIsDateDialogOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarMessage(null);
    };

    return (
        <motion.div
            key="branch-orders-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-white shadow-lg w-full max-w-xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">
                        {`${branchName} 주문 내역`}
                    </CardTitle>
                    <div className="text-m text-gray-500">
                        {format(selectedDate || new Date(), 'yyyy년 MM월 dd일')}
                    </div>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="h-[60vh] flex items-center justify-center text-gray-500">
                            해당 날짜의 주문 내역이 없습니다.
                        </div>
                    ) : (
                        <ScrollArea className="h-[60vh]">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 text-left">
                                            품목명
                                        </th>
                                        <th className="py-2 text-right">
                                            수량
                                        </th>
                                        <th className="py-2 text-right">
                                            단위
                                        </th>
                                        <th className="py-2 text-right">
                                            작업
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) =>
                                        order.items.map((item, idx) => (
                                            <tr
                                                key={`${order.id}-${idx}`}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-3">
                                                    {item.name}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {item.unit}
                                                </td>
                                                <td className="py-3 text-right flex justify-end space-x-2">
                                                    <Button
                                                        className="text-xs text-white bg-green-500 hover:bg-green-600"
                                                        disabled={!isToday}
                                                        onClick={() =>
                                                            handleEditClick(
                                                                order.id!,
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        수정
                                                    </Button>
                                                    <Button
                                                        className="text-xs text-white bg-red-500 hover:bg-red-600"
                                                        disabled={!isToday}
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                order.id!,
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        삭제
                                                    </Button>
                                                </td>
                                            </tr>
                                        )),
                                    )}
                                </tbody>
                            </table>
                        </ScrollArea>
                    )}
                </CardContent>
                <div className="text-center p-4 flex justify-between space-x-4">
                    <Button
                        className="w-full h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setIsDateDialogOpen(true)}
                    >
                        날짜 변경
                    </Button>
                </div>
            </Card>

            <Dialog open={isDateDialogOpen} onClose={handleDateDialogClose}>
                <DialogTitle>날짜 선택</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    className="mt-2"
                                />
                            )}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDateDialogClose}>닫기</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
                <DialogContent>
                    {editingItem && (
                        <>
                            {/* Item 이름 표시 */}
                            <div className="mb-4 text-m font-semibold text-gray-800">
                                {orders.find(
                                    (o) => o.id === editingItem.orderId,
                                )?.items[editingItem.itemIndex].name ||
                                    '아이템 이름 :'}
                            </div>
                            {/* 수량 입력 TextField */}
                            <TextField
                                fullWidth
                                type="number"
                                label="수량"
                                value={
                                    orders.find(
                                        (o) => o.id === editingItem.orderId,
                                    )?.items[editingItem.itemIndex].quantity ||
                                    ''
                                }
                                onChange={(e) =>
                                    setOrders((prevOrders) =>
                                        prevOrders.map((order) =>
                                            !editingItem ||
                                            order.id === editingItem.orderId
                                                ? {
                                                      ...order,
                                                      items: order.items.map(
                                                          (item, idx) =>
                                                              !editingItem ||
                                                              idx ===
                                                                  editingItem.itemIndex
                                                                  ? {
                                                                        ...item,
                                                                        quantity:
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                    }
                                                                  : item,
                                                      ),
                                                  }
                                                : order,
                                        ),
                                    )
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outline" onClick={handleEditDialogClose}>
                        취소
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveEdit}>저장</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </motion.div>
    );
}

export default BranchOrdersPage;
