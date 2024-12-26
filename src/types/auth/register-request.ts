// 회원가입 요청 body

export interface RegisterRequest {
    userId: string;
    password: string;
    name: string;
    phone: string;
    branch: string;
}
