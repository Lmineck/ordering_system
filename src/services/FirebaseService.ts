import {
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    FirestoreDataConverter,
    WithFieldValue,
    DocumentData,
    QueryDocumentSnapshot,
    SnapshotOptions,
    where,
    orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

class FirebaseService<T extends DocumentData & { id?: string }> {
    private collectionName: string;
    private converter: FirestoreDataConverter<T>;

    constructor(collectionName: string) {
        this.collectionName = collectionName;

        this.converter = {
            toFirestore: (data: WithFieldValue<T>): DocumentData => {
                const { ...rest } = data; // `id`는 Firestore에 저장하지 않음
                return rest;
            },
            fromFirestore: (
                snapshot: QueryDocumentSnapshot,
                options: SnapshotOptions,
            ): T => {
                const data = snapshot.data(options) as T;
                return { ...data, id: snapshot.id }; // 문서 ID를 포함
            },
        };
    }

    private getCollectionRef() {
        return collection(db, this.collectionName).withConverter(
            this.converter,
        );
    }

    private getDocRef(id: string) {
        return doc(db, this.collectionName, id).withConverter(this.converter);
    }

    async create(data: Omit<T, 'id'>): Promise<string> {
        try {
            const docRef = await addDoc(
                this.getCollectionRef(),
                data as WithFieldValue<T>,
            );
            return docRef.id;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    }

    async read(id: string): Promise<T | null> {
        try {
            const docSnap = await getDoc(this.getDocRef(id));
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.warn('Document not found');
                return null;
            }
        } catch (error) {
            console.error('Error reading document:', error);
            throw error;
        }
    }

    async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
        try {
            const docRef = this.getDocRef(id);
            await updateDoc(
                docRef,
                data as Partial<WithFieldValue<DocumentData>>,
            );
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = this.getDocRef(id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    async list(): Promise<T[]> {
        try {
            const querySnapshot = await getDocs(query(this.getCollectionRef()));
            return querySnapshot.docs.map((doc) => doc.data());
        } catch (error) {
            console.error('Error listing documents:', error);
            throw error;
        }
    }

    async findByField(field: string, value: any): Promise<T[]> {
        try {
            const q = query(this.getCollectionRef(), where(field, '==', value));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error(`Error finding documents by ${field}:`, error);
            throw error;
        }
    }

    async findOneByField(field: string, value: any): Promise<T | null> {
        try {
            const q = query(this.getCollectionRef(), where(field, '==', value));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as T;
            }
            return null;
        } catch (error) {
            console.error(`Error finding document by ${field}:`, error);
            throw error;
        }
    }

    // 다중 조건 필터링
    async findByMultipleFields(filters: Record<string, any>): Promise<T[]> {
        try {
            const conditions = Object.entries(filters).map(([field, value]) =>
                where(field, '==', value),
            );
            const q = query(this.getCollectionRef(), ...conditions);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error('Error finding documents by multiple fields:', error);
            throw error;
        }
    }

    // FirebaseService 클래스 내부
    async findOrdersByDate(date: string): Promise<T[]> {
        try {
            const startOfDay = `${date}000000`; // 오늘 시작 시간
            const endOfDay = `${date}235959`; // 오늘 끝 시간

            const q = query(
                this.getCollectionRef(),
                where('orderDate', '>=', startOfDay),
                where('orderDate', '<=', endOfDay),
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error('Error finding orders by date:', error);
            throw error;
        }
    }

    // 5. 정렬
    async listWithSorting(
        orderFields: [string, 'asc' | 'desc'][],
    ): Promise<T[]> {
        try {
            const orderConditions = orderFields.map(([field, direction]) =>
                orderBy(field, direction),
            );
            const q = query(this.getCollectionRef(), ...orderConditions);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error('Error listing documents with sorting:', error);
            throw error;
        }
    }

    // FirebaseService에 새로운 메서드 추가
    async findByFieldPartialMatch(field: string, value: string): Promise<T[]> {
        try {
            const q = query(
                this.getCollectionRef(),
                where(field, '>=', value),
                where(field, '<=', value + '\uf8ff'),
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error(
                `Error finding documents with partial match on ${field}:`,
                error,
            );
            throw error;
        }
    }

    async findOrdersByBranchAndDate(
        branch: string | undefined,
        date: string,
    ): Promise<T[]> {
        try {
            const startOfDay = `${date}000000`; // 시작 시간
            const endOfDay = `${date}235959`; // 끝 시간

            // Firestore 쿼리 작성
            const q = query(
                this.getCollectionRef(),
                where('branch', '==', branch),
                where('orderDate', '>=', startOfDay),
                where('orderDate', '<=', endOfDay),
            );

            // 쿼리 실행
            const querySnapshot = await getDocs(q);

            // 결과 매핑
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error('Error finding orders by branch and date:', error);
            throw error;
        }
    }

    async findByMultipleFieldsWithRange(
        filters: Record<string, unknown>,
        rangeField: string,
        rangeStart: string,
        rangeEnd: string,
    ): Promise<T[]> {
        try {
            const conditions = Object.entries(filters).map(([field, value]) =>
                where(field, '==', value),
            );

            const q = query(
                this.getCollectionRef(),
                ...conditions,
                where(rangeField, '>=', rangeStart),
                where(rangeField, '<=', rangeEnd),
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error(
                'Error finding documents with range and filters:',
                error,
            );
            throw error;
        }
    }

    async updateByConditions(
        filters: Record<string, unknown>,
        rangeField: string,
        rangeStart: string,
        rangeEnd: string,
        updateData: Partial<Omit<T, 'id'>>,
    ): Promise<string | null> {
        try {
            const existingDocs = await this.findByMultipleFieldsWithRange(
                filters,
                rangeField,
                rangeStart,
                rangeEnd,
            );

            if (existingDocs.length > 0) {
                const docToUpdate = existingDocs[0];
                if (docToUpdate.id) {
                    await this.update(docToUpdate.id, updateData);
                    return docToUpdate.id;
                }
            }
            return null;
        } catch (error) {
            console.error('Error updating document by conditions:', error);
            throw error;
        }
    }
}

export default FirebaseService;
