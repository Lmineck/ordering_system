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

    // 아이템 순서 위로 이동
    async moveItemUp(itemId: string, categoryName: string): Promise<void> {
        try {
            const items = await this.getItemsByCategory(categoryName);
            // item.index를 기준으로 오름차순 정렬
            const sortedItems = items.sort((a, b) => a.index - b.index);

            const currentIndex = sortedItems.findIndex(
                (item) => item.id === itemId,
            );

            if (currentIndex > 0) {
                const currentItem = items[currentIndex];
                const previousItem = items[currentIndex - 1];

                // index 값 교환
                await this.update(currentItem.id!, {
                    index: previousItem.index,
                });
                await this.update(previousItem.id!, {
                    index: currentItem.index,
                });

                console.log(
                    `Moved item ${itemId} up. New index: ${previousItem.index}`,
                );
            }
        } catch (error) {
            console.error(`Error moving item ${itemId} up:`, error);
            throw error;
        }
    }

    // 아이템 순서 아래로 이동
    async moveItemDown(itemId: string, categoryName: string): Promise<void> {
        try {
            const items = await this.getItemsByCategory(categoryName);
            // item.index를 기준으로 오름차순 정렬
            const sortedItems = items.sort((a, b) => a.index - b.index);

            const currentIndex = sortedItems.findIndex(
                (item) => item.id === itemId,
            );

            if (currentIndex < items.length) {
                const currentItem = items[currentIndex];
                const nextItem = items[currentIndex + 1];

                // index 값 교환
                await this.update(currentItem.id!, { index: nextItem.index });
                await this.update(nextItem.id!, { index: currentItem.index });

                console.log(
                    `Moved item ${itemId} down. New index: ${nextItem.index}`,
                );
            }
        } catch (error) {
            console.error(`Error moving item ${itemId} down:`, error);
            throw error;
        }
    }
}

export default ItemService;
