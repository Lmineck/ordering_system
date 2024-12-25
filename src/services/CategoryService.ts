import { Category } from '@/types/category';
import FirebaseService from './FirebaseService';
import ItemService from './ItemService';

class CategoryService extends FirebaseService<Category> {
    private itemService: ItemService;

    constructor() {
        super('category'); // Firestore 컬렉션 이름 전달
        this.itemService = new ItemService(); // ItemService 인스턴스 초기화
    }

    // 특정 카테고리 이름이 이미 존재하는지 확인
    async isCategoryExists(name: string): Promise<boolean> {
        const existingCategory = await this.findOneByField('name', name);
        return existingCategory !== null;
    }

    // 중복 검사 후 카테고리 추가
    async addCategory(name: string): Promise<string> {
        const exists = await this.isCategoryExists(name);
        if (exists) {
            throw new Error(`Category with name "${name}" already exists.`);
        }
        return await this.create({ name });
    }

    // 카테고리 삭제 (ID 기반)
    async deleteCategoryById(id: string): Promise<void> {
        // 1. ID를 통해 카테고리 가져오기
        const category = await this.read(id);
        if (!category) {
            throw new Error(`Category with ID "${id}" not found.`);
        }

        const categoryName = category.name;

        // 2. 해당 카테고리를 참조하는 아이템 가져오기
        const relatedItems =
            await this.itemService.getItemsByCategory(categoryName);

        // 3. 관련된 아이템 삭제
        for (const item of relatedItems) {
            await this.itemService.deleteItem(item.id!);
        }

        // 4. 카테고리 삭제
        await this.delete(id);

        console.log(
            `Category "${categoryName}" and related items deleted successfully.`,
        );
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            const categories = await this.list(); // FirebaseService의 list() 메서드 사용
            return categories;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    }
}

export default CategoryService;
