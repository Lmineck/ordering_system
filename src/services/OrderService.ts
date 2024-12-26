import FirebaseService from './FirebaseService';
import { Order } from '@/types/order';

class OrderService extends FirebaseService<Order> {
    constructor() {
        super('order'); // Firestore 컬렉션 이름 전달
    }

    // 주문 생성
    async createOrder(order: Omit<Order, 'id'>): Promise<string> {
        try {
            const orderId = await this.create(order);
            return orderId;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // 주문 조회 (주문 날짜로 조회)
    async getOrdersByDate(orderDate: string): Promise<Order[]> {
        return await this.findByField('orderDate', orderDate);
    }

    // 주문 조회 (주문 지점으로 조회, 최근순, 페이지네이션)
    async getOrdersByBranch(
        branch: string,
        page: number = 1,
    ): Promise<Order[]> {
        const pageSize = 5;
        const orders = await this.findByMultipleFields({ branch });
        const sortedOrders = orders.sort(
            (a, b) =>
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime(),
        );
        const startIndex = (page - 1) * pageSize;
        return sortedOrders.slice(startIndex, startIndex + pageSize);
    }

    // 주문 날짜 조회 (주문이 존재하는 날짜만, 페이지네이션)
    async getAvailableOrderDates(page: number = 1): Promise<string[]> {
        const orders = await this.list(); // 전체 주문 가져오기
        const uniqueDates = Array.from(
            new Set(
                orders.map(
                    (order) =>
                        new Date(order.orderDate).toISOString().split('T')[0],
                ),
            ),
        );

        // 페이지네이션 적용
        const pageSize = 5;
        const startIndex = (page - 1) * pageSize;
        return uniqueDates.slice(startIndex, startIndex + pageSize);
    }
}

export default OrderService;
