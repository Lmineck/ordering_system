import React, { ChangeEvent } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
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
                        <span className="font-semibold">클릭하여 업로드</span>{' '}
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
        </div>
    );
}
