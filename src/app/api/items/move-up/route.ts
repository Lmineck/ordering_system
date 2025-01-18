import { NextRequest, NextResponse } from 'next/server';
import ItemService from '@/services/ItemService';

const itemService = new ItemService();

// GET: 아이템 index 위 아이템과 변경
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const itemId = searchParams.get('itemId');
        const categoryName = searchParams.get('categoryName');

        if (!itemId || !categoryName) {
            return NextResponse.json(
                { error: 'itemId and categoryName are required' },
                { status: 400 },
            );
        }

        // 아이템 순서 위로 이동
        await itemService.moveItemUp(itemId, categoryName);

        return NextResponse.json(
            { message: `Item ${itemId} moved up successfully` },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error moving item up:', error);
        return NextResponse.json(
            { error: 'Failed to move item up' },
            { status: 500 },
        );
    }
}
