'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/ui/file-upload';
import Image from 'next/image';
import { Item } from '@/types/item';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

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
        index: items.length + 1,
        name: '',
        imgUrl: '',
        category: categoryName,
        unit: '',
        amount: 1,
    });
    const [resetFileUpload, setResetFileUpload] = useState(false);

    // 아이템 가져오기
    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/items?category=${categoryName}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            const data: Item[] = await response.json();

            // item.index를 기준으로 오름차순 정렬
            const sortedData = data.sort((a, b) => a.index - b.index);

            setItems(sortedData);
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
        if (newItem.amount == null) {
            alert('단위량을 입력해주세요.');
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
                index: items.length + 1,
                name: '',
                imgUrl: '',
                category: categoryName,
                unit: '',
                amount: 1,
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

    // 순서 변경 핸들링 함수
    const handleMoveUp = async (itemId: string) => {
        try {
            const response = await fetch(
                `/api/items/move-up?itemId=${itemId}&categoryName=${encodeURIComponent(
                    categoryName,
                )}`,
                {
                    method: 'GET',
                },
            );
            if (!response.ok) throw new Error('Failed to move item up');
            await fetchItems(); // 변경 후 목록 다시 로드
        } catch (error) {
            console.error('Error moving item up:', error);
        }
    };

    const handleMoveDown = async (itemId: string) => {
        try {
            const response = await fetch(
                `/api/items/move-down?itemId=${itemId}&categoryName=${encodeURIComponent(
                    categoryName,
                )}`,
                {
                    method: 'GET',
                },
            );
            if (!response.ok) throw new Error('Failed to move item down');
            await fetchItems(); // 변경 후 목록 다시 로드
        } catch (error) {
            console.error('Error moving item down:', error);
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
                            {/* 순서 변경 버튼 */}
                            <div className="flex flex-col justify-center items-center mr-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mb-1 p-1"
                                    onClick={() => handleMoveUp(item.id)}
                                    disabled={item.index === 1} // 첫 번째 아이템은 위로 이동 불가
                                >
                                    <ChevronUp size={16} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 p-1"
                                    onClick={() => handleMoveDown(item.id)}
                                    disabled={item.index === items.length} // 마지막 아이템은 아래로 이동 불가
                                >
                                    <ChevronDown size={16} />
                                </Button>
                            </div>

                            {/* 이미지 */}
                            <div className="flex items-center justify-center relative w-24 h-24 mr-4">
                                <Image
                                    src={
                                        item.imgUrl
                                            ? `/api/images?path=${encodeURIComponent(item.imgUrl.replace('/uploads/', ''))}`
                                            : '/svgs/placeholder.svg'
                                    }
                                    alt={item.name || 'Placeholder'}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>

                            {/* 오른쪽 내용 */}
                            <div className="flex flex-col sm:flex-row flex-grow sm:items-center">
                                {/* 이름 및 단위 */}
                                <div className="flex-grow mt-2 sm:mt-0">
                                    <h3 className="font-semibold text-base sm:text-lg">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.amount} {item.unit}
                                    </p>
                                </div>

                                {/* 버튼 */}
                                <div className="flex justify-end mt-2 sm:mt-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-12 w-12 sm:h-14 sm:w-14"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        <Trash2
                                            size={20}
                                            className="sm:size-24"
                                        />
                                    </Button>
                                </div>
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
                        type="number"
                        placeholder="단위량"
                        value={newItem.amount || ''}
                        onInput={(e) => {
                            const input = e.target as HTMLInputElement;
                            input.value = input.value.replace(/[^0-9.]/g, ''); // 숫자와 소수점만 허용
                        }}
                        onChange={(e) =>
                            setNewItem({
                                ...newItem,
                                amount: parseFloat(e.target.value),
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
