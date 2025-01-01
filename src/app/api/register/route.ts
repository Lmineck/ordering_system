import { NextRequest, NextResponse } from 'next/server';
import UserService from '@/services/UserService';
import { RegisterRequest } from '@/types/auth/register-request';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RegisterRequest;
        const { userId, password, name, phone, branch } = body;

        // 필수 필드 검증
        if (!userId || !password || !name || !phone || !branch) {
            return NextResponse.json(
                { message: '모든 필드를 입력해주세요.' },
                { status: 400 },
            );
        }

        // UserService를 통해 회원가입 처리
        const userService = new UserService();
        const createdUserId = await userService.register(body);

        // 성공 응답
        return NextResponse.json(
            {
                message: '회원가입이 성공적으로 완료되었습니다.',
                userId: createdUserId,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('회원가입 처리 중 오류:', error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : '알 수 없는 오류가 발생했습니다.',
            },
            { status: 400 }, // 상태 코드는 400으로 설정 (클라이언트 오류)
        );
    }
}
