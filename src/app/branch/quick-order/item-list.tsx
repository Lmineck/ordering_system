import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { OrderItem } from '@/types/order';

interface ItemListProps {
    items: OrderItem[];
    onUpdateQuantity: (itemId: string, newQuantity: number) => void;
}

export default function ItemList({ items, onUpdateQuantity }: ItemListProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
                >
                    <Image
                        src={item.imgUrl || '/svgs/placeholder.svg'} // imgUrl이 비어 있으면 기본 이미지 사용
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.unit}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                onUpdateQuantity(
                                    item.id,
                                    Math.max(0, item.quantity - 1),
                                )
                            }
                        >
                            -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                            }
                        >
                            +
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
