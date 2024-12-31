import { NextRequest, NextResponse } from 'next/server';
import { ImageUploadService } from '@/services/ImageUploadService';

export const config = {
    api: {
        bodyParser: false, // FormData를 처리하므로 기본 bodyParser를 비활성화
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData(); // FormData 추출
        const file = formData.get('file') as File;
        const categoryName = formData.get('categoryName') as string;
        const itemName = formData.get('itemName') as string;
        const unit = formData.get('unit') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 },
            );
        }

        if (!categoryName) {
            return NextResponse.json(
                { error: 'No name provided' },
                { status: 400 },
            );
        }

        // 파일 데이터와 이름 추출
        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name || 'unknown';

        // ImageUploadService를 통해 파일 저장
        const savedPath = ImageUploadService.handleFileUpload(
            buffer,
            originalName,
            categoryName,
            itemName,
            unit,
        );

        console.log('File saved at:', savedPath);

        return NextResponse.json({ filePath: savedPath });
    } catch (error) {
        console.error('Error processing file upload:', error);
        return NextResponse.json(
            { error: 'File upload failed' },
            { status: 500 },
        );
    }
}
