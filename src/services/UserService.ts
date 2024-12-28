import { LoginRequest } from '@/types/auth/login-request';
import { RegisterRequest } from '@/types/auth/register-request';
import { User } from '@/types/user';
import FirebaseService from '@services/FirebaseService';

class UserService extends FirebaseService<User> {
    constructor() {
        // "users" 컬렉션 이름으로 FirebaseService 초기화
        super('user');
    }

    /**
     * 모든 유저 정보를 가져오는 함수
     * @returns 유저 리스트
     */
    async getAllUsers(): Promise<User[]> {
        return await this.list();
    }

    /**
     * ID로 유저를 삭제하는 함수
     * @param id 삭제할 유저의 고유 Firestore ID
     * @returns void
     */
    async deleteUserById(id: string): Promise<void> {
        await this.delete(id);
    }

    /**
     * 유저 정보를 수정하는 함수
     * @param id 수정할 유저의 고유 Firestore ID
     * @param updatedData 수정할 데이터
     * @returns void
     */
    async updateUser(
        id: string,
        updatedData: Partial<Omit<User, 'id'>>,
    ): Promise<void> {
        // Firestore의 고유 ID를 사용하여 업데이트
        await this.update(id, updatedData);
    }

    /**
     * 유저의 역할을 guest에서 user로 변경하는 함수
     * @param id 역할을 변경할 유저의 고유 Firestore ID
     * @returns void
     */
    async upgradeRoleToUser(id: string): Promise<void> {
        await this.update(id, { role: 'user' });
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
        const formattedTime = `${now.getFullYear()}${String(
            now.getMonth() + 1,
        ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(
            now.getHours(),
        ).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

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
