// 회원가입 요청 body

import { branch } from './branch';

export interface RegisterRequest {
    id: string;
    password: string;
    name: string;
    phone: string;
    role: string;
    branch?: branch;
}
