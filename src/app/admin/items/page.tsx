'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import ItemList from './item-list';
import { Category } from '@/types/category';

export default function ItemManagement() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [loading, setLoading] = useState(false);

    // 카테고리 가져오기
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data: Category[] = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    // 새로운 카테고리 추가
    const addCategory = async () => {
        if (newCategoryName.trim()) {
            try {
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newCategoryName.trim() }),
                });

                if (!response.ok) throw new Error('Failed to add category');
                const newCategory: Category = await response.json();
                setCategories([...categories, newCategory]);
                setNewCategoryName('');
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }
    };

    // 카테고리 삭제
    const deleteCategory = async (id: string) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete category');
            setCategories(categories.filter((category) => category.id !== id));
            if (selectedCategory === id) {
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="min-h-scree">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    상품 관리
                </h1>

                <div className="bg-white shadow rounded-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        카테고리
                    </h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                                        selectedCategory === category.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <button
                                        className="mr-2 focus:outline-none"
                                        onClick={() =>
                                            setSelectedCategory(category.id)
                                        }
                                    >
                                        {category.name}
                                    </button>
                                    <button
                                        className="text-current hover:text-red-500 focus:outline-none"
                                        onClick={() =>
                                            deleteCategory(category.id)
                                        }
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="새 카테고리 이름"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-grow"
                        />
                        <Button
                            onClick={addCategory}
                            className="w-full sm:w-auto"
                        >
                            <Plus size={16} className="mr-2" />
                            추가
                        </Button>
                    </div>
                </div>

                {selectedCategory && (
                    <ItemList
                        categoryId={selectedCategory}
                        categoryName={
                            categories.find((c) => c.id === selectedCategory)
                                ?.name || ''
                        }
                    />
                )}
            </div>
        </div>
    );
}
