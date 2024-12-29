import FirebaseService from './FirebaseService';
import { Order } from '@/types/order';

class OrderService extends FirebaseService<Order> {
    constructor() {
        super('order'); // Firestore 컬렉션 이름 전달
    }

    // 주문 생성 또는 업데이트
    async createOrUpdateOrder(order: Omit<Order, 'id'>): Promise<string> {
        try {
            const dateKey = order.orderDate.slice(0, 8); // yyyymmdd 추출
            const existingOrders = await this.findByFieldPartialMatch(
                'orderDate',
                dateKey,
            );

            if (existingOrders.length > 0) {
                // 동일 날짜의 주문이 이미 존재
                const existingOrder = existingOrders[0]; // 첫 번째 주문 가져오기
                const updatedItems = existingOrder.items.map((existingItem) => {
                    const matchingNewItem = order.items.find(
                        (newItem) =>
                            newItem.name === existingItem.name &&
                            newItem.category === existingItem.category &&
                            newItem.unit === existingItem.unit,
                    );

                    if (matchingNewItem) {
                        // name, category, unit이 동일한 경우 수량 합산
                        return {
                            ...existingItem,
                            quantity:
                                existingItem.quantity +
                                matchingNewItem.quantity,
                        };
                    }

                    return existingItem; // 기존 항목 유지
                });

                // 새로 추가된 제품 중 기존에 없는 제품을 추가
                const newItems = order.items.filter(
                    (newItem) =>
                        !existingOrder.items.some(
                            (existingItem) =>
                                existingItem.name === newItem.name &&
                                existingItem.category === newItem.category &&
                                existingItem.unit === newItem.unit,
                        ),
                );

                const finalItems = [...updatedItems, ...newItems];

                const updatedOrderDate = order.orderDate; // 새로운 주문 시간으로 업데이트

                await this.update(existingOrder.id, {
                    items: finalItems,
                    orderDate: updatedOrderDate,
                });

                return existingOrder.id;
            } else {
                // 새로운 주문 생성
                const orderId = await this.create(order);
                return orderId;
            }
        } catch (error) {
            console.error('Error creating or updating order:', error);
            throw error;
        }
    }
}

export default OrderService;
