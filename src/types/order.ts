// 주문

export interface Order {
    id: string; // 주문 ID
    items: OrderItem[]; // 주문 항목 리스트
    branch: string; // 주문 지점
    orderDate: string; // 주문 날짜
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // 주문 상태
}

export interface OrderItem {
    name: string; // 제품 이름
    category: string; // 카테고리 이름
    unit: string; // 단위
    quantity: number; // 주문 수량
}
