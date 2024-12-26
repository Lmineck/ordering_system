import { Item } from '@/types/item';
import FirebaseService from './FirebaseService';

class ItemService extends FirebaseService<Item> {
    constructor() {
        super('item'); // Firestore 컬렉션 이름 전달
    }

    // 카테고리 name이 동일한 아이템 리스트 가져오기
    async getItemsByCategory(categoryName: string): Promise<Item[]> {
        try {
            const items = await this.findByField('category', categoryName);
            return items;
        } catch (error) {
            console.error(
                `Error fetching items for category: ${categoryName}`,
                error,
            );
            throw error;
        }
    }

    // 아이템 추가하기
    async addItem(item: Omit<Item, 'id'>): Promise<string> {
        try {
            const newItemId = await this.create(item);
            return newItemId;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    // 아이템 삭제하기
    async deleteItem(itemId: string): Promise<void> {
        try {
            await this.delete(itemId);
        } catch (error) {
            console.error(`Error deleting item with ID: ${itemId}`, error);
            throw error;
        }
    }

    // 아이템 수정하기
    async updateItem(
        itemId: string,
        updates: Partial<Omit<Item, 'id'>>,
    ): Promise<void> {
        try {
            await this.update(itemId, updates);
        } catch (error) {
            console.error(`Error updating item with ID: ${itemId}`, error);
            throw error;
        }
    }
}

export default ItemService;
