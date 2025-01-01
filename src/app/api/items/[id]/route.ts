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
