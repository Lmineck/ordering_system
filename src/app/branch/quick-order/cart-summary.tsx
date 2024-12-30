import { OrderItem } from '@/types/order';
import Image from 'next/image'; // Next.js 이미지 컴포넌트 사용

interface CartSummaryProps {
    items: OrderItem[];
    onClose: () => void; // 닫기 핸들러 추가
}

export default function CartSummary({ items, onClose }: CartSummaryProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">주문 내역</h2>
                {/* 닫기 아이콘 */}
                <button onClick={onClose} className="p-1">
                    <Image
                        src="/svgs/cancel.svg" // 아이콘 경로
                        alt="닫기"
                        width={24} // 아이콘 크기
                        height={24} // 아이콘 크기
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                </button>
            </div>
            {items.map((item) => (
                <div key={item.name} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                        {item.quantity} {item.unit}
                    </span>
                </div>
            ))}
        </div>
    );
}
