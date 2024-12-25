import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/category';

interface CategorySelectorProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string) => void;
}

export default function CategorySelector({
    categories,
    selectedCategory,
    onSelectCategory,
}: CategorySelectorProps) {
    return (
        <ScrollArea className="whitespace-nowrap overflow-x-auto max-w-full">
            <div className="flex space-x-2">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={
                            selectedCategory === category.id
                                ? 'default'
                                : 'outline'
                        }
                        onClick={() => onSelectCategory(category.id)}
                        className="flex-shrink-0"
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
        </ScrollArea>
    );
}
