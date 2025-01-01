import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const filePathParts = searchParams.get('path')?.split('/') || [];

    let filePath;
    if (filePathParts.length === 0 || filePathParts[0] === '') {
        // Use placeholder when path is empty
        filePath = path.join(
            process.cwd(),
            'public',
            'svgs',
            'placeholder.svg',
        );
    } else {
        filePath = path.join(process.cwd(), 'uploads', ...filePathParts);
    }

    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath); // Read file as a buffer
        const fileType = path.extname(filePath).slice(1); // Get file extension without the dot
        const mimeType =
            fileType === 'jpg' || fileType === 'jpeg'
                ? 'image/jpeg'
                : fileType === 'svg'
                  ? 'image/svg+xml'
                  : 'application/octet-stream';

        return new Response(fileBuffer, {
            headers: {
                'Content-Type': mimeType,
            },
        });
    } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
