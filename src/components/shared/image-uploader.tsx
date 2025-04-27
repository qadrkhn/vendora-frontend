"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import apiRoutes from "@/constants/apiRoutes";
import API from "@/lib/api";
import { MimeTypes } from "@/constants/mimeTypes";

interface UploadedFile {
  id: number;
  url: string;
}

interface ImageUploaderProps {
  multiple?: boolean;
  onUploaded: (files: UploadedFile[] | UploadedFile) => void;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  acceptTypes?: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  multiple = false,
  onUploaded,
  disabled = false,
  className = "",
  showPreview = true,
  acceptTypes = MimeTypes.images,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate MIME type
    for (let i = 0; i < files.length; i++) {
      if (!acceptTypes.includes(files[i].type)) {
        toast.error(
          `Invalid file type: ${files[i].type}. Allowed types are ${acceptTypes}`
        );
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();

      if (multiple) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files[]", files[i]);
        }
      } else {
        formData.append("file", files[0]);
      }

      const response = await API.post(apiRoutes.file.upload, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data.data;
      const uploads: UploadedFile[] = Array.isArray(data) ? data : [data];

      setPreviews(uploads.map((f) => f.url));
      toast.success("File uploaded successfully.");
      onUploaded(multiple ? uploads : uploads[0]);
    } catch (error: any) {
      toast.error("Failed to upload file.");
      const errs = error?.response?.data?.errors;

      if (errs && typeof errs === "object") {
        Object.entries(errs).forEach(([key, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(`${key}: ${msg}`));
          } else if (typeof messages === "string") {
            toast.error(`${key}: ${messages}`);
          }
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {showPreview && previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((url, idx) => (
              <div
                key={idx}
                className="relative w-32 h-32 rounded overflow-hidden"
              >
                <Image
                  src={url}
                  alt="Uploaded preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        <div className="absolute top-2 left-2 z-10">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : multiple
              ? "Upload Files"
              : "Upload File"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes.join(",")}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
};

export default ImageUploader;
