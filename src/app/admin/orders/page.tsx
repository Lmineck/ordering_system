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
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        font-size: 12px; /* 글자 크기 줄임 */
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        font-size: 12px; /* 테이블 글자 크기 줄임 */
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 4px; /* 패딩을 줄여 셀 간격 촘촘하게 */
                        text-align: left; 
                    }
                    th { 
                        background-color: #f4f4f4; 
                        font-size: 13px; /* 헤더는 약간 더 큰 글자 크기 */
                    }
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
                            <ScrollArea className="h-[60vh] overflow-y-auto">
                                <table className="w-full border-collapse">
                                    <thead className="bg-white sticky top-0 shadow">
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
                                                <td className="py-2">{name}</td>
                                                <td className="py-2 text-right">
                                                    {quantity}
                                                </td>
                                                <td className="py-2 text-right">
                                                    {unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        )}
                        <div className="bg-gray-100 p-4 mt-4 text-gray-600 text-sm">
                            <h3 className="font-semibold mb-4">[ 요청사항 ]</h3>
                            {selectedBranch
                                ? // 특정 지점의 요청사항 표시
                                  branchOrders
                                      .filter(
                                          (order) =>
                                              order.branch === selectedBranch,
                                      )
                                      .map((order, idx) => (
                                          <div key={idx} className="mb-2">
                                              <span className="font-semibold">
                                                  {order.branch}
                                              </span>{' '}
                                              -{' '}
                                              {order.requestNote ||
                                                  '요청사항이 없습니다.'}
                                          </div>
                                      ))
                                : // 모든 지점의 요청사항 표시
                                  branchOrders.map((order, idx) => (
                                      <div key={idx} className="mb-2">
                                          <span className="font-semibold">
                                              {order.branch}
                                          </span>{' '}
                                          -{' '}
                                          {order.requestNote ||
                                              '요청사항이 없습니다.'}
                                      </div>
                                  ))}
                        </div>
                    </CardContent>
                </div>

                <button
                    className="absolute top-5 left-5 text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        const statWindow = window.open(
                            '',
                            '',
                            'width=auto,height=auto',
                        );
                        if (!statWindow) {
                            console.error(
                                'Unable to open stat window. It may be blocked by the browser.',
                            );
                            return;
                        }

                        // 데이터 필터링: 모든 고기와 야채 아이템을 포함하도록 데이터 준비
                        const allItems = { 고기: new Set(), 야채: new Set() };
                        branchOrders.forEach((order) => {
                            order.items.forEach((item) => {
                                if (
                                    item.category === '고기' ||
                                    item.category === '야채'
                                ) {
                                    allItems[item.category].add(item.name);
                                }
                            });
                        });

                        const allMeatItems = Array.from(allItems['고기']);
                        const allVegetableItems = Array.from(allItems['야채']);

                        // 각 지점별로 고기와 야채 아이템의 수량 정리
                        const branchData = branchOrders.reduce(
                            (result, order) => {
                                if (!result[order.branch]) {
                                    result[order.branch] = {
                                        고기: allMeatItems.reduce(
                                            (acc, item) => {
                                                acc[item] = 0;
                                                return acc;
                                            },
                                            {},
                                        ),
                                        야채: allVegetableItems.reduce(
                                            (acc, item) => {
                                                acc[item] = 0;
                                                return acc;
                                            },
                                            {},
                                        ),
                                    };
                                }

                                order.items.forEach((item) => {
                                    if (
                                        item.category === '고기' ||
                                        item.category === '야채'
                                    ) {
                                        result[order.branch][item.category][
                                            item.name
                                        ] += item.quantity;
                                    }
                                });

                                return result;
                            },
                            {},
                        );

                        // 테이블 HTML 생성
                        const tableHeader = `
            <tr>
                <th>지점명</th>
                ${allMeatItems.map((item) => `<th>${item}</th>`).join('')}
                ${allVegetableItems.map((item) => `<th>${item}</th>`).join('')}
            </tr>
        `;

                        const tableRows = Object.entries(branchData)
                            .map(([branch, categories]) => {
                                const meatCells = allMeatItems
                                    .map(
                                        (item) =>
                                            `<td>${categories['고기'][item] || 0}</td>`,
                                    )
                                    .join('');
                                const vegetableCells = allVegetableItems
                                    .map(
                                        (item) =>
                                            `<td>${categories['야채'][item] || 0}</td>`,
                                    )
                                    .join('');

                                return `
                    <tr>
                        <td>${branch}</td>
                        ${meatCells}
                        ${vegetableCells}
                    </tr>
                `;
                            })
                            .join('');

                        statWindow.document.write(`
        <html>
            <head>
                <title>지점별 통계</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: white;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .container {
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    table {
                        width: 100%;
                        max-width: 100%;
                        border-collapse: collapse;
                        text-align: center;
                        font-size: 10px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 4px;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                    .print-button {
                        margin-top: 10px;
                        background: none;
                        border: none;
                        color: #007BFF;
                        cursor: pointer;
                        font-size: 12px;
                        text-decoration: underline;
                        align-self: flex-end;
                    }
                    .print-button:hover {
                        color: #0056b3;
                    }
                    @media print {
                        @page {
                            size: landscape;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                        .print-button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 style="font-size: 14px;">지점별 통계</h1>
                    <table>
                        <thead>
                            ${tableHeader}
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    <button class="print-button" onclick="window.print()">출력하기</button>
                </div>
            </body>
        </html>
        `);
                        statWindow.document.close();
                    }}
                    aria-label="Statistics"
                >
                    <img
                        src="/images/list.png"
                        alt="지점별통계"
                        className="h-8 w-8"
                    />
                </button>

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
