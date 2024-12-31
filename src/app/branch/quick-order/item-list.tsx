import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ListItem } from './page';

interface ItemListProps {
    items: ListItem[];
    onUpdateQuantity: (itemId: string, newQuantity: number) => void;
}

export default function ItemList({ items, onUpdateQuantity }: ItemListProps) {
    return (
        <div className="flex flex-col gap-4 p-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
                >
                    {/* 이미지 (항상 왼쪽) */}
                    <Image
                        src={item.imgUrl || '/svgs/placeholder.svg'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                    />

                    {/* 오른쪽 내용 */}
                    <div className="flex flex-1 flex-col sm:flex-row justify-between">
                        {/* 이름 및 단위 */}
                        <div className="mt-2 sm:mt-0">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.unit}</p>
                        </div>

                        {/* 수량 및 버튼 */}
                        <div className="flex items-center mt-4 sm:mt-0 sm:justify-start justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                onClick={() =>
                                    onUpdateQuantity(
                                        item.id,
                                        Math.max(0, item.quantity - 1),
                                    )
                                }
                            >
                                -
                            </Button>
                            <span className="text-center text-sm sm:text-base w-6 sm:w-8">
                                {item.quantity}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1)
                                }
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
