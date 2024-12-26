import { NextRequest, NextResponse } from 'next/server';
import UserService from '@/services/UserService';
import { LoginRequest } from '@/types/auth/login-request';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as LoginRequest;
        const { userId, password } = body;

        if (!userId || !password) {
            return NextResponse.json(
                { message: 'Missing id or password' },
                { status: 400 },
            );
        }

        // UserService를 통해 로그인 처리
        const userService = new UserService();
        const user = await userService.login({ userId, password });

        if (user) {
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 },
            );
        }
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 },
        );
    }
}
