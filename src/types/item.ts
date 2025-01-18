// 상품

export interface Item {
    id: string; // 제품 ID
    index: number; // 순서
    name: string; // 제품 이름
    imgUrl: string; // 제품 이미지 url
    category: string; // 카테고리 이름 (비정규화)
    unit: string; // 단위
    amount: number | null;
}
