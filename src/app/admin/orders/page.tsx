'use client';

import React, { useEffect, useState } from 'react';
import FirebaseService from '@/services/FirebaseService';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { Order, OrderItem } from '@/types/order';
import { Button } from '@/components/ui/button';
import Loading from '@/app/loading';

const orderService = new FirebaseService<Order>('order');

function OrdersPage() {
    const [aggregatedItems, setAggregatedItems] = useState<
        Record<string, { quantity: number; unit: string }>
    >({});
    const [branchOrders, setBranchOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
    const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);

    const fetchOrders = async (date: Date | null) => {
        try {
            if (!date) return;

            setLoading(true);

            // 선택한 날짜 계산
            const dateString = format(date, 'yyyyMMdd');

            // Firestore에서 데이터 가져오기
            const orders = await orderService.findOrdersByDate(dateString);

            // `items` 합산
            const aggregated = aggregateItems(orders);
            setAggregatedItems(aggregated);
            setBranchOrders(orders);
        } catch (err) {
            setError('주문 데이터를 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 초기화: 오늘 날짜로 조회
        fetchOrders(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        setIsDateDialogOpen(false); // 팝업 닫기
    };

    const handleDateDialogOpen = () => setIsDateDialogOpen(true);
    const handleDateDialogClose = () => setIsDateDialogOpen(false);

    const handleBranchDialogOpen = () => setIsBranchDialogOpen(true);
    const handleBranchDialogClose = () => setIsBranchDialogOpen(false);

    const handleBranchClick = (branch: string) => {
        setSelectedBranch(branch);
        setIsBranchDialogOpen(false); // 팝업 닫기
    };

    const handleResetToTotal = () => setSelectedBranch(null);

    const handlePrint = () => {
        const printContent = document.getElementById('print-section');
        const printWindow = window.open('', '', 'width=800,height=600');

        if (!printWindow) {
            console.error(
                'Unable to open print window. It may be blocked by the browser.',
            );
            return;
        }

        printWindow.document.write(`
        <html>
            <head>
                <title>주문 내역 출력</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                ${printContent?.innerHTML}
            </body>
        </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const isEmpty = selectedBranch
        ? Object.keys(
              aggregateItems(
                  branchOrders.filter(
                      (order) => order.branch === selectedBranch,
                  ),
              ),
          ).length === 0
        : Object.keys(aggregatedItems).length === 0;

    const displayedAggregatedItems = selectedBranch
        ? aggregateItems(
              branchOrders.filter((order) => order.branch === selectedBranch),
          )
        : aggregatedItems;

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Loading />;
    }

    return (
        <motion.div
            key="orders-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-white shadow-lg w-full max-w-xl mx-auto relative">
                <div id="print-section">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold">
                            {selectedBranch
                                ? `${selectedBranch} 주문 내역`
                                : '주문 합계'}
                        </CardTitle>
                        <div className="text-m text-gray-500">
                            {format(
                                selectedDate || new Date(),
                                'yyyy년 MM월 dd일',
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isEmpty ? (
                            <div className="h-[60vh] flex items-center justify-center text-gray-500">
                                해당 날짜의 발주내역이 없습니다.
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(
                                            displayedAggregatedItems,
                                        ).map(([name, { quantity, unit }]) => (
                                            <tr
                                                key={name}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-3">{name}</td>
                                                <td className="py-3 text-right">
                                                    {quantity}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        )}
                    </CardContent>
                </div>
                <button
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                    onClick={handlePrint} // 클릭 이벤트 핸들러 추가
                    aria-label="Print"
                >
                    <img
                        src="/images/printer.png" // 이미지 경로
                        alt="프린트하기" // 이미지 대체 텍스트
                        className="h-8 w-8"
                    />
                </button>
                <div className="text-center py-4 flex space-x-4 px-4">
                    <Button
                        className="w-full h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleDateDialogOpen}
                    >
                        다른 날짜 선택
                    </Button>
                    {selectedBranch ? (
                        <Button
                            className="w-full h-12 font-semibold bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleResetToTotal}
                        >
                            총 주문 합계 보기
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-12 font-semibold bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleBranchDialogOpen}
                        >
                            지점별 주문 보기
                        </Button>
                    )}
                </div>
            </Card>

            {/* 날짜 선택 팝업 */}
            <Dialog open={isDateDialogOpen} onClose={handleDateDialogClose}>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDateDialogClose}
                        className="text-blue-600"
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 지점 선택 팝업 */}
            <Dialog open={isBranchDialogOpen} onClose={handleBranchDialogClose}>
                <DialogTitle>지점 목록</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.from(
                            new Set(branchOrders.map((order) => order.branch)),
                        ).map((branch) => (
                            <ListItem key={branch} disablePadding>
                                <ListItemButton
                                    onClick={() => handleBranchClick(branch)}
                                >
                                    <ListItemText primary={branch} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleBranchDialogClose}
                        className="text-blue-600"
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}

function aggregateItems(
    orders: { items: OrderItem[] }[],
): Record<string, { quantity: number; unit: string }> {
    const aggregated: Record<string, { quantity: number; unit: string }> = {};

    orders.forEach((order) => {
        order.items.forEach((item) => {
            if (aggregated[item.name]) {
                aggregated[item.name].quantity += item.quantity;
            } else {
                aggregated[item.name] = {
                    quantity: item.quantity,
                    unit: item.unit,
                };
            }
        });
    });

    return aggregated;
}

export default OrdersPage;
