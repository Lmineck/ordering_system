'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import Image from 'next/image';
import { Item } from '@/types/item';
import { Trash2 } from 'lucide-react';

interface ItemListProps {
    categoryId: string;
    categoryName: string;
}

export default function ItemList({ categoryName }: ItemListProps) {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedFile, setSelectedFile] = useState<{
        file: File | null;
        previewUrl: string | null;
    }>({
        file: null,
        previewUrl: null,
    });
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: '',
        imgUrl: '',
        category: categoryName,
        unit: '',
    });
    const [resetFileUpload, setResetFileUpload] = useState(false);

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/items?category=${categoryName}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            const data: Item[] = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [categoryName]);

    const addItem = async () => {
        // 유효성 검사 필요
        if (!newItem.name.trim()) {
            alert('상품명을 입력해주세요.');
            return;
        }
        if (!newItem.unit.trim()) {
            alert('단위를 입력해주세요.');
            return;
        }

        try {
            let uploadedFilePath: string = '';

            // 파일이 선택된 경우 업로드
            if (selectedFile.file) {
                const result = await uploadFile(
                    selectedFile.file,
                    newItem.category,
                    newItem.name,
                    newItem.unit,
                );
                uploadedFilePath = result || ''; // null일 경우 빈 문자열 할당
            }

            // 새로운 아이템 추가 요청
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newItem,
                    imgUrl: uploadedFilePath || '', // 업로드된 파일 경로 또는 빈 문자열 전달
                }),
            });

            if (!response.ok) throw new Error('Failed to add item');

            await fetchItems();

            // 상태 초기화
            setNewItem({
                name: '',
                imgUrl: '',
                category: categoryName,
                unit: '',
            });
            setSelectedFile({ file: null, previewUrl: null }); // 파일 상태 초기화
            setResetFileUpload(true); // FileUpload 초기화
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const uploadFile = async (
        file: File,
        categoryName: string,
        itemName: string,
        unit: string,
    ): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file); // 파일 추가
            formData.append('categoryName', categoryName);
            formData.append('itemName', itemName);
            formData.append('unit', unit);

            const response = await fetch('/api/images/upload', {
                method: 'POST',
                body: formData, // FormData로 요청 전송
            });

            if (!response.ok) throw new Error('File upload failed');

            const data = await response.json();
            return data.filePath; // 업로드된 파일 경로 반환
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete item');

            await fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    useEffect(() => {
        if (categoryName) fetchItems();
    }, [fetchItems, categoryName]);

    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {categoryName} 상품 목록
            </h2>

            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="relative w-24 h-24 mr-4">
                                <Image
                                    src={item.imgUrl || '/svgs/placeholder.svg'}
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
                                    onClick={() => deleteItem(item.id)}
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </div>
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
                        onFileSelect={(file) => {
                            setSelectedFile({
                                file,
                                previewUrl: URL.createObjectURL(file),
                            });
                        }}
                        resetTrigger={resetFileUpload}
                    />
                    <Button
                        variant={'outline'}
                        onClick={addItem}
                        className="w-full"
                    >
                        추가
                    </Button>
                </div>
            </div>
        </div>
    );
}
