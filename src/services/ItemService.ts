import { Item } from '@/types/item';
import FirebaseService from './FirebaseService';
import { ImageUploadService } from './ImageUploadService';

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
        const item = await this.read(itemId);

        if (item?.imgUrl !== '') {
            ImageUploadService.deleteImage(item!.imgUrl); // 이미지 삭제
        }

        await this.delete(itemId); // Firebase에서 아이템 삭제
        console.log(`Item with ID ${itemId} deleted successfully`);
    }
}

export default ItemService;
