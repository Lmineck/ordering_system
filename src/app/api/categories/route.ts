import { NextRequest, NextResponse } from 'next/server';
import CategoryService from '@/services/CategoryService';

const categoryService = new CategoryService();

// GET /api/categories - 전체 카테고리 가져오기
export async function GET() {
    try {
        const categories = await categoryService.getAllCategories();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { message: 'Failed to fetch categories.' },
            { status: 500 },
        );
    }
}

// POST /api/categories - 새로운 카테고리 추가
export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { message: 'Category name is required.' },
                { status: 400 },
            );
        }

        const newCategoryId = await categoryService.addCategory(name);
        return NextResponse.json({ id: newCategoryId, name }, { status: 201 });
    } catch (error) {
        console.error('Error adding category:', error);
        return NextResponse.json(
            { message: 'Failed to add category.' },
            { status: 500 },
        );
    }
}
