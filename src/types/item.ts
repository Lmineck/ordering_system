// 품목

export interface Item {
    productId: string; // 제품 ID
    productName: string; // 제품 이름
    imgUrl: string; // 제품 이미지 url
    category: string; // 카테고리
    unit: string; // 단위
    quantity: number; // 수량
    unitPrice: number; // 단가
    totalPrice: number; // 총 가격 (unitPrice * quantity)
}
