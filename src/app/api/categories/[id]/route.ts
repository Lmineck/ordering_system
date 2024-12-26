import { NextRequest, NextResponse } from 'next/server';
import CategoryService from '@/services/CategoryService';

const categoryService = new CategoryService();

// DELETE /api/categories/:id
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params; // 비동기적으로 params 추출

        if (!id) {
            return NextResponse.json(
                { message: 'Category ID is required.' },
                { status: 400 },
            );
        }

        await categoryService.deleteCategoryById(id);
        return NextResponse.json(
            { message: 'Category deleted successfully.' },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { message: 'Failed to delete category.' },
            { status: 500 },
        );
    }
}
