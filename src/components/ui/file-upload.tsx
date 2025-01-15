import React, { ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    resetTrigger?: boolean; // 상태를 리셋할 트리거
}

export function FileUpload({ onFileSelect, resetTrigger }: FileUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const validateFile = (file: File) => {
        const validTypes = [
            'image/svg+xml',
            'image/png',
            'image/jpeg',
            'image/gif',
        ];
        const maxFileSize = 4 * 1024 * 1024; // 4MB

        if (!validTypes.includes(file.type)) {
            alert(
                '지원하지 않는 파일 형식입니다. SVG, PNG, JPG, GIF만 업로드 가능합니다.',
            );
            return false;
        }

        if (file.size > maxFileSize) {
            alert(
                '파일 크기가 너무 큽니다. 2MB 이하의 파일만 업로드 가능합니다.',
            );
            return false;
        }

        return true;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (validateFile(file)) {
                // 기존 URL 해제
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                const newPreviewUrl = URL.createObjectURL(file);
                setPreviewUrl(newPreviewUrl); // 유효성 검사를 통과한 경우 미리보기 URL 설정
                onFileSelect(file); // 상위 컴포넌트에 파일 전달
            } else {
                event.target.value = ''; // 유효성 검사 실패 시 파일 입력 초기화
            }
        }
    };

    const handleCancelPreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl); // 기존 URL 해제
        }
        setPreviewUrl(null); // 상태 초기화
    };

    useEffect(() => {
        // resetTrigger가 true일 때 상태 초기화
        if (resetTrigger) {
            handleCancelPreview();
        }
    }, [resetTrigger]);

    return (
        <div className="flex items-center justify-center w-full">
            {!previewUrl ? (
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                                클릭하여 업로드
                            </span>{' '}
                            또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF (최대 2MB)
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>
            ) : (
                <div className="relative w-64 h-64">
                    <Image
                        src={previewUrl} // blob URL
                        alt="Uploaded Image"
                        fill // 부모 컨테이너에 맞춰 렌더링
                        style={{ objectFit: 'cover' }} // 필요한 경우 스타일 추가
                    />
                    <button
                        className="absolute top-2 right-2 bg-gray-100 text-gray-700 rounded-full p-1 shadow-md hover:bg-gray-200"
                        onClick={handleCancelPreview} // 미리보기 취소
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
