// 유저 정보

export interface User {
    id: string;
    userId: string;
    password: string;
    role: string; // admin | guest | user
    name: string;
    phone: string;
    branch: string;
    createdAt: string;
    updatedAt: string;
}
