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
            const filters = { branch: order.branch }; // 지점 필터
            const rangeField = 'orderDate';
            const rangeStart = `${dateKey}000000`;
            const rangeEnd = `${dateKey}235959`;

            // 동일 날짜와 지점의 주문 찾기
            const existingOrders = await this.findByMultipleFieldsWithRange(
                filters,
                rangeField,
                rangeStart,
                rangeEnd,
            );

            if (existingOrders.length > 0) {
                // 동일 날짜와 지점의 주문이 이미 존재
                const existingOrder = existingOrders[0];
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

                // 최종 주문 아이템 목록록
                const finalItems = [...updatedItems, ...newItems];

                // 새로운 주문 시간으로 업데이트
                const updatedOrderDate = order.orderDate;

                // 요청 사항 합산
                if (order.requestNote != null) {
                    const combinedRequestNote = existingOrder.requestNote
                        ? `${existingOrder.requestNote}\n${order.requestNote}`
                        : order.requestNote;

                    // 기존 요청 사항에 새 요청 사항 추가
                    await this.updateByConditions(
                        filters,
                        rangeField,
                        rangeStart,
                        rangeEnd,
                        {
                            items: finalItems,
                            orderDate: updatedOrderDate,
                            requestNote: combinedRequestNote,
                        },
                    );
                } else {
                    // 요청 사항이 없는 경우 기존대로 업데이트
                    await this.updateByConditions(
                        filters,
                        rangeField,
                        rangeStart,
                        rangeEnd,
                        { items: finalItems, orderDate: updatedOrderDate },
                    );
                }

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
