import { NextRequest, NextResponse } from 'next/server';
import ItemService from '@/services/ItemService';

const itemService = new ItemService();

// DELETE: 아이템 삭제
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { message: 'Item ID is required.' },
                { status: 400 },
            );
        }

        await itemService.deleteItem(id);
        return NextResponse.json(
            { message: 'Item deleted successfully.' },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json(
            { message: 'Failed to delete item.' },
            { status: 500 },
        );
    }
}

// PATCH: 아이템 수정
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const updates = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Item ID is required.' },
                { status: 400 },
            );
        }

        await itemService.updateItem(id, updates);
        return NextResponse.json(
            { message: 'Item updated successfully.' },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error updating item:', error);
        return NextResponse.json(
            { message: 'Failed to update item.' },
            { status: 500 },
        );
    }
}
