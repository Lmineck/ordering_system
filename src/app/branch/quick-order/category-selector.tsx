import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/category';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
            {/* Animated Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <Card className="p-4">
                    <motion.div
                        className="flex space-x-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {categories.map((category) => (
                            <motion.div
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant={
                                        selectedCategory === category.id
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        onSelectCategory(category.id)
                                    }
                                    className={cn(
                                        'flex-shrink-0',
                                        selectedCategory === category.id
                                            ? 'bg-gray-500 text-white'
                                            : '',
                                    )}
                                >
                                    {category.name}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                </Card>
            </motion.div>
        </ScrollArea>
    );
}
