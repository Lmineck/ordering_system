import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

export class ImageUploadService {
    private static baseUploadDir = path.join(process.cwd(), 'public/uploads');

    /**
     * 파일 저장 디렉토리 초기화
     * @param categoryName 카테고리 이름
     */
    private static initializeCategoryDir(categoryName: string) {
        const categoryDir = path.join(this.baseUploadDir, categoryName);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }
        return categoryDir;
    }

    /**
     * 파일 업로드 처리
     * @param fileBuffer 업로드된 파일의 Buffer 데이터
     * @param originalName 파일의 원본 이름
     * @param categoryName 카테고리 이름
     * @returns 업로드된 파일의 저장 경로
     */
    static handleFileUpload(
        fileBuffer: Buffer,
        originalName: string,
        categoryName: string,
        itemName: string,
        unit: string,
    ): string {
        const categoryDir = this.initializeCategoryDir(categoryName); // 카테고리 디렉토리 초기화

        const extension = originalName.split('.').pop(); // 파일 확장자 추출
        const currentDate = format(new Date(), 'yyyyMMdd_HHmmss'); // 현재 날짜와 시간을 형식 지정
        const uniqueFileName = `${itemName}_${unit}_${currentDate}.${extension}`; // 고유한 파일 이름 생성
        const filePath = path.join(categoryDir, uniqueFileName); // 최종 파일 경로

        fs.writeFileSync(filePath, fileBuffer); // 파일 저장
        return `/uploads/${categoryName}/${uniqueFileName}`; // 클라이언트에서 접근 가능한 경로 반환
    }

    /**
     * 카테고리 디렉토리 삭제
     * @param categoryName 카테고리 이름
     */
    static deleteCategoryFolder(categoryName: string): void {
        const categoryDir = path.join(this.baseUploadDir, categoryName);

        if (!fs.existsSync(categoryDir)) {
            console.log(`Category directory does not exist: ${categoryDir}`);
            return;
        }

        // 디렉토리와 모든 하위 파일 및 폴더 삭제
        fs.rmSync(categoryDir, { recursive: true, force: true });
    }

    /**
     * imgUrl 파일 삭제
     */
    static deleteImage(imgUrl: string): void {
        const filePath = path.join(process.cwd(), 'public', imgUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // 파일 삭제
            console.log(`Image deleted: ${filePath}`);
        } else {
            console.warn(`Image not found: ${filePath}`);
        }
    }
}
