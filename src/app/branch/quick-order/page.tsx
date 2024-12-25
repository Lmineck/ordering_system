'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CategorySelector from './category-selector';
import ItemList from './item-list';
import CartSummary from './cart-summary';
import { Category } from '@/types/category';
import { OrderItem } from '@/types/order';
import { useAuthStore } from '@/stores/authStore';

export default function QuickOrder() {
    const { user } = useAuthStore();

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryItems, setCategoryItems] = useState<
        Record<string, OrderItem[]>
    >({});
    const [items, setItems] = useState<OrderItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [allCartItems, setAllCartItems] = useState<OrderItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    // 페이지 초기 로드: 모든 카테고리와 아이템 데이터 가져오기
    const fetchAllData = async () => {
        try {
            const categoriesRes = await fetch('/api/categories');
            if (!categoriesRes.ok)
                throw new Error('Failed to fetch categories');
            const categoriesData: Category[] = await categoriesRes.json();

            // 모든 카테고리의 아이템을 가져오기
            const allItemsPromises = categoriesData.map(async (category) => {
                const itemsRes = await fetch(
                    `/api/items?category=${encodeURIComponent(category.name)}`,
                );
                if (!itemsRes.ok)
                    throw new Error(
                        `Failed to fetch items for ${category.name}`,
                    );
                const itemsData: OrderItem[] = await itemsRes.json();
                return {
                    [category.id]: itemsData.map((item) => ({
                        ...item,
                        quantity: 0, // 초기 수량은 0
                    })),
                };
            });

            const allItems = await Promise.all(allItemsPromises);
            const itemsMap = Object.assign({}, ...allItems); // 모든 카테고리 아이템을 합침

            setCategories(categoriesData);
            setCategoryItems(itemsMap);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchAllData();
    }, []);

    // 카테고리 선택 시 아이템 설정
    useEffect(() => {
        if (selectedCategory && categoryItems[selectedCategory]) {
            const updatedItems = categoryItems[selectedCategory].map((item) => {
                const existingCartItem = allCartItems.find(
                    (cartItem) => cartItem.id === item.id,
                );
                return {
                    ...item,
                    quantity: existingCartItem ? existingCartItem.quantity : 0, // 기존 수량 유지
                };
            });
            setItems(updatedItems);
        } else {
            setItems([]);
        }
    }, [selectedCategory, categoryItems, allCartItems]);

    // 수량 조정
    const updateItemQuantity = (itemId: string, newQuantity: number) => {
        const updatedItems = items.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
        );
        setItems(updatedItems);

        // 전체 카트 업데이트
        const updatedAllCartItems = [...allCartItems];
        updatedItems
            .filter((item) => item.quantity > 0)
            .forEach((item) => {
                const existingItemIndex = updatedAllCartItems.findIndex(
                    (cartItem) => cartItem.id === item.id,
                );
                if (existingItemIndex > -1) {
                    // 이미 있는 아이템이면 수량 업데이트
                    updatedAllCartItems[existingItemIndex].quantity =
                        item.quantity;
                } else {
                    // 새로운 아이템 추가
                    updatedAllCartItems.push(item);
                }
            });

        setAllCartItems(
            updatedAllCartItems.filter((item) => item.quantity > 0),
        );
    };

    // 주문하기
    const placeOrder = async () => {
        const now = new Date();
        const kstDate = new Date(
            now.getTime() + 9 * 60 * 60 * 1000, // UTC 시간에서 9시간 추가 (KST)
        );

        const orderPayload = {
            items: allCartItems,
            orderDate: kstDate.toISOString(), // KST 기준 ISO 형식
            branch: user?.branch,
            status: 'pending', // 초기 상태
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });
            if (!res.ok) throw new Error('Failed to place order');
            alert('주문이 완료되었습니다!');
            setAllCartItems([]);
            setShowCart(false);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('주문 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {/* 카테고리 선택 */}
            <div className="p-4 bg-gray-100">
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
            {/* 아이템 리스트 */}
            <div className="flex-grow relative">
                <ScrollArea className="h-full p-4">
                    <ItemList
                        items={items}
                        onUpdateQuantity={updateItemQuantity}
                    />
                </ScrollArea>
            </div>
            {/* 장바구니 정보 */}
            <div className="sticky bottom-0 p-4 bg-white border-t">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                        총{' '}
                        {allCartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                        )}{' '}
                        개 항목
                    </span>
                    <Button onClick={() => setShowCart(true)}>담기</Button>
                </div>
            </div>
            {/* 장바구니 요약 */}
            {showCart && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCart(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-t-xl w-full max-w-md p-4">
                        <CartSummary
                            items={allCartItems}
                            onClose={() => setShowCart(false)}
                        />
                        <Button onClick={placeOrder} className="w-full mt-4">
                            주문하기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
