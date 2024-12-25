import { NextRequest, NextResponse } from 'next/server';
import OrderService from '@/services/OrderService';

const orderService = new OrderService();

// POST: 주문 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, orderDate, branch, status } = body;

        // 필수 데이터 검증
        if (!items || !orderDate || !branch || !status) {
            return NextResponse.json(
                { message: 'Invalid order data' },
                { status: 400 },
            );
        }

        // 주문 생성
        const orderId = await orderService.createOrder(body);
        return NextResponse.json(
            { id: orderId, message: 'Order created successfully' },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        );
    }
}
