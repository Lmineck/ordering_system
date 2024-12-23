// 주문

import { Item } from "./item";

export interface Order {
  orderId: string; // 주문 ID
  items: Item[]; // 주문 항목 리스트
  orderDate: Date; // 주문 날짜
  status: "pending" | "confirmed" | "cancelled" | "completed"; // 주문 상태
  totalAmount: number; // 주문 총 금액 (모든 항목의 totalPrice 합계)
  notes?: string; // 비고/주석 (선택적)
}
