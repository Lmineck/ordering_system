// 주문

import { Item } from './item';

export interface Order {
    id: string; // 주문 ID
    items: OrderItem[]; // 주문 항목 리스트
    branch: string; // 주문 지점
    orderDate: Date; // 주문 날짜
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // 주문 상태
}

export interface OrderItem extends Item {
    quantity: number; // 주문에서만 사용하는 수량
}
