import { NextRequest, NextResponse } from 'next/server';
import ItemService from '@/services/ItemService';

const itemService = new ItemService();

// GET: 카테고리별 아이템 가져오기
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category'); // Query parameter로 카테고리 가져오기

        if (!category) {
            return NextResponse.json(
                { message: 'Category query parameter is required.' },
                { status: 400 },
            );
        }

        const items = await itemService.getItemsByCategory(category);
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json(
            { message: 'Failed to fetch items.' },
            { status: 500 },
        );
    }
}

// POST: 아이템 추가
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { name, imgUrl, category, unit } = body;

        // 필수 필드 확인
        if (!name || !category || !unit) {
            return NextResponse.json(
                { message: 'Missing required fields.' },
                { status: 400 },
            );
        }

        // imgUrl이 제공되지 않으면 빈 문자열 설정
        const validImgUrl = imgUrl?.trim() || '';

        // 아이템 추가
        const newItemId = await itemService.addItem({
            name,
            imgUrl: validImgUrl,
            category,
            unit,
        });
        return NextResponse.json(
            { id: newItemId, message: 'Item added successfully.' },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error adding item:', error);
        return NextResponse.json(
            { message: 'Failed to add item.' },
            { status: 500 },
        );
    }
}
