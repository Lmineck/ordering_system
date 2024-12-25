import { OrderItem } from '@/types/order';

interface CartSummaryProps {
    items: OrderItem[];
}

export default function CartSummary({ items }: CartSummaryProps) {
    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold mb-4">주문 내역</h2>
            {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                        {item.quantity} {item.unit}
                    </span>
                </div>
            ))}
        </div>
    );
}
