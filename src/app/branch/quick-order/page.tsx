'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import CategorySelector from './category-selector';
import ItemList from './item-list';
import CartSummary from './cart-summary';
import { Category } from '@/types/category';
import { useAuthStore } from '@/stores/authStore';
import { Item } from '@/types/item';
import { Order, OrderItem } from '@/types/order';
import { format } from 'date-fns';

export interface ListItem extends Item {
    quantity: number; // 주문에서만 사용하는 수량
}

export default function QuickOrder() {
    const { user } = useAuthStore();

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryItems, setCategoryItems] = useState<
        Record<string, ListItem[]>
    >({});
    const [items, setItems] = useState<ListItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [allCartItems, setAllCartItems] = useState<ListItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const fetchAllData = async () => {
        try {
            const categoriesRes = await fetch('/api/categories');
            if (!categoriesRes.ok)
                throw new Error('Failed to fetch categories');
            const categoriesData: Category[] = await categoriesRes.json();

            const allItemsPromises = categoriesData.map(async (category) => {
                const itemsRes = await fetch(
                    `/api/items?category=${encodeURIComponent(category.name)}`,
                );
                if (!itemsRes.ok)
                    throw new Error(
                        `Failed to fetch items for ${category.name}`,
                    );
                const itemsData: ListItem[] = await itemsRes.json();
                return {
                    [category.id]: itemsData.map((item) => ({
                        ...item,
                        quantity: 0,
                    })),
                };
            });

            const allItems = await Promise.all(allItemsPromises);
            const itemsMap = Object.assign({}, ...allItems);

            setCategories(categoriesData);
            setCategoryItems(itemsMap);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (selectedCategory && categoryItems[selectedCategory]) {
            const updatedItems = categoryItems[selectedCategory].map((item) => {
                const existingCartItem = allCartItems.find(
                    (cartItem) => cartItem.id === item.id,
                );
                return {
                    ...item,
                    quantity: existingCartItem ? existingCartItem.quantity : 0,
                };
            });
            setItems(updatedItems);
        } else {
            setItems([]);
        }
    }, [selectedCategory, categoryItems, allCartItems]);

    const updateItemQuantity = (itemId: string, newQuantity: number) => {
        const updatedItems = items.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
        );
        setItems(updatedItems);

        const updatedAllCartItems = [...allCartItems];

        updatedItems.forEach((item) => {
            const existingItemIndex = updatedAllCartItems.findIndex(
                (cartItem) => cartItem.id === item.id,
            );

            if (item.quantity > 0) {
                if (existingItemIndex > -1) {
                    updatedAllCartItems[existingItemIndex].quantity =
                        item.quantity;
                } else {
                    updatedAllCartItems.push(item);
                }
            } else if (existingItemIndex > -1) {
                updatedAllCartItems.splice(existingItemIndex, 1);
            }
        });

        setAllCartItems(updatedAllCartItems);
    };

    const placeOrder = async () => {
        const now = new Date();
        const formattedTime = format(now, 'yyyyMMddHHmmss');

        const orderItems: OrderItem[] = allCartItems.map((item) => ({
            name: item.name,
            category: item.category,
            unit: item.unit,
            quantity: item.quantity,
        }));

        const orderPayload: Omit<Order, 'id'> = {
            items: orderItems,
            orderDate: formattedTime,
            branch: user?.branch ?? 'Unknown Branch',
            status: 'pending',
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
        <motion.div
            className="flex flex-col h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4">
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
            <motion.div
                className="flex-grow relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <ScrollArea className="h-full p-4">
                    <ItemList
                        items={items}
                        onUpdateQuantity={updateItemQuantity}
                    />
                </ScrollArea>
            </motion.div>
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
            {showCart && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCart(false);
                        }
                    }}
                >
                    <motion.div
                        className="bg-white rounded-t-xl w-full max-w-md p-4"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <CartSummary
                            items={allCartItems}
                            onClose={() => setShowCart(false)}
                        />
                        <Button onClick={placeOrder} className="w-full mt-4">
                            주문하기
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
}
