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
    startAt,
    endAt,
    orderBy,
    limit,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // 1. 페이지네이션 지원
    async listWithPagination(
        lastId: string | null,
        pageSize: number = 10,
    ): Promise<T[]> {
        try {
            let q = query(this.getCollectionRef(), limit(pageSize));
            if (lastId) {
                const lastDocSnap = await getDoc(this.getDocRef(lastId));
                if (lastDocSnap.exists()) {
                    q = query(
                        this.getCollectionRef(),
                        startAt(lastDocSnap),
                        limit(pageSize),
                    );
                }
            }
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => doc.data());
        } catch (error) {
            console.error('Error listing documents with pagination:', error);
            throw error;
        }
    }

    // 2. 다중 조건 필터링
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // 3. 범위 검색
    async findByRange(
        field: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startValue: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        endValue: any,
    ): Promise<T[]> {
        try {
            const q = query(
                this.getCollectionRef(),
                orderBy(field),
                startAt(startValue),
                endAt(endValue),
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error(
                `Error finding documents by range for field: ${field}`,
                error,
            );
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
}

export default FirebaseService;
