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
                    {/* 고정된 크기의 이미지 */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                            src={
                                item.imgUrl
                                    ? `/api/images?path=${encodeURIComponent(item.imgUrl.replace('/uploads/', ''))}`
                                    : '/svgs/placeholder.svg'
                            }
                            alt={item.name || 'Placeholder'}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                        />
                    </div>

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
                                        Math.max(
                                            0,
                                            item.quantity - (item.amount ?? 1),
                                        ),
                                    )
                                }
                            >
                                -
                            </Button>
                            <span className="text-center text-sm sm:text-base w-6 sm:w-8 whitespace-nowrap overflow-hidden">
                                {item.quantity}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                onClick={() =>
                                    onUpdateQuantity(
                                        item.id,
                                        item.quantity + (item.amount ?? 1),
                                    )
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
