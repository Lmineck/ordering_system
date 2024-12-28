import { LoginRequest } from '@/types/auth/login-request';
import { RegisterRequest } from '@/types/auth/register-request';
import { User } from '@/types/user';
import FirebaseService from '@services/FirebaseService';
import { format } from 'date-fns';

class UserService extends FirebaseService<User> {
    constructor() {
        // "users" 컬렉션 이름으로 FirebaseService 초기화
        super('user');
    }

    /**
     * 특정 유저를 가져오는 함수 (ID로 검색)
     * @param id 유저 ID
     * @returns User 데이터 또는 null
     */
    async getUserById(id: string): Promise<User | null> {
        return await this.read(id);
    }

    /**
     * 모든 유저를 가져오는 함수
     * @returns User 배열
     */
    async getAllUsers(): Promise<User[]> {
        return await this.list();
    }

    /**
     * 유저를 생성하는 함수
     * @param user User 데이터 (id 제외)
     * @returns 생성된 유저 ID
     */
    async createUser(user: Omit<User, 'id'>): Promise<string> {
        return await this.create(user);
    }

    /**
     * 유저 데이터를 업데이트하는 함수
     * @param id 유저 ID
     * @param userData 업데이트할 데이터 (일부 필드만 가능)
     */
    async updateUser(
        id: string,
        userData: Partial<Omit<User, 'id'>>,
    ): Promise<void> {
        await this.update(id, userData);
    }

    /**
     * 유저를 삭제하는 함수
     * @param id 유저 ID
     */
    async deleteUser(id: string): Promise<void> {
        await this.delete(id);
    }

    /**
     * 로그인 요청을 처리하는 함수
     * @param loginRequest 로그인 요청 객체
     * @returns User 데이터 또는 null
     */
    async login(loginRequest: LoginRequest): Promise<User | null> {
        const { userId, password } = loginRequest;
        const user = await this.findOneByField('userId', userId);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    /**
     * 회원가입 요청을 처리하는 함수
     * @param registerRequest 회원가입 요청 객체
     * @returns 생성된 유저 ID
     */
    async register(registerRequest: RegisterRequest): Promise<string> {
        const { userId, password, name, phone, branch } = registerRequest;

        const now = new Date();
        const formattedTime = format(now, 'yyyyMMddHHmmss');

        return await this.createUser({
            userId,
            password,
            name,
            phone,
            branch,
            createdAt: formattedTime,
            updatedAt: formattedTime,
            role: 'guest',
        });
    }
}

export default UserService;
