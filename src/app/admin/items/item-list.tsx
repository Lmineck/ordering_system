'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Item } from '@/types/item';

interface ItemListProps {
    categoryId: string; // 카테고리 ID
    categoryName: string; // 카테고리 이름
}

export default function ItemList({ categoryName }: ItemListProps) {
    const [items, setItems] = useState<Item[]>([]);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: '',
        imgUrl: '',
        category: categoryName,
        unit: '',
    });

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/items?category=${categoryName}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            const data: Item[] = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async () => {
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) throw new Error('Failed to add item');

            // 아이템 추가 후 새로 데이터 가져오기
            await fetchItems();

            // 입력 필드 초기화
            setNewItem({
                name: '',
                imgUrl: '',
                category: categoryName,
                unit: '',
            });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateItem = async () => {
        if (editingItem) {
            try {
                const response = await fetch(`/api/items/${editingItem.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingItem),
                });

                if (!response.ok) throw new Error('Failed to update item');

                // 아이템 업데이트 후 새로 데이터 가져오기
                await fetchItems();

                setEditingItem(null);
            } catch (error) {
                console.error('Error updating item:', error);
            }
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete item');

            // 아이템 삭제 후 새로 데이터 가져오기
            await fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleFileSelect = (file: File, isNewItem: boolean) => {
        const imageUrl = URL.createObjectURL(file);
        if (isNewItem) {
            setNewItem({ ...newItem, imgUrl: imageUrl });
        } else if (editingItem) {
            setEditingItem({ ...editingItem, imgUrl: imageUrl });
        }
    };

    useEffect(() => {
        fetchItems();
    }, [categoryName]);

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {categoryName} 상품 목록
            </h2>

            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        {editingItem?.id === item.id ? (
                            <div className="space-y-4">
                                <Input
                                    value={editingItem.name}
                                    onChange={(e) =>
                                        setEditingItem({
                                            ...editingItem,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="상품명"
                                />
                                <Input
                                    value={editingItem.unit}
                                    onChange={(e) =>
                                        setEditingItem({
                                            ...editingItem,
                                            unit: e.target.value,
                                        })
                                    }
                                    placeholder="단위"
                                />
                                <FileUpload
                                    onFileSelect={(file) =>
                                        handleFileSelect(file, false)
                                    }
                                />
                                <div className="flex justify-between">
                                    <Button
                                        onClick={updateItem}
                                        className="w-1/2"
                                    >
                                        저장
                                    </Button>
                                    <Button
                                        onClick={() => setEditingItem(null)}
                                        variant="outline"
                                        className="w-1/2"
                                    >
                                        취소
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <div className="relative w-24 h-24 mr-4">
                                    <Image
                                        src={
                                            item.imgUrl ||
                                            '/svgs/placeholder.svg'
                                        }
                                        alt={item.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-md"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600">{item.unit}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingItem(item)}
                                    >
                                        <Edit2 size={20} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        <Trash2 size={20} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    새 상품 추가
                </h3>
                <div className="space-y-4">
                    <Input
                        placeholder="상품명"
                        value={newItem.name}
                        onChange={(e) =>
                            setNewItem({
                                ...newItem,
                                name: e.target.value,
                            })
                        }
                    />
                    <Input
                        placeholder="단위"
                        value={newItem.unit}
                        onChange={(e) =>
                            setNewItem({
                                ...newItem,
                                unit: e.target.value,
                            })
                        }
                    />
                    <FileUpload
                        onFileSelect={(file) => handleFileSelect(file, true)}
                    />
                    <Button onClick={addItem} className="w-full">
                        <Plus size={16} className="mr-2" />
                        추가
                    </Button>
                </div>
            </div>
        </div>
    );
}
