"use client";

import ImageUploader from "@/components/shared/image-uploader";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { id: number; url: string }) => void;
  onRemove: (url: string) => void;
  value: { id: number; url: string }[];
  type: "standard" | "profile" | "cover";
  dontShowPreview?: boolean;
}

const ImageUpload: FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  type,
  value,
  dontShowPreview,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // this makes sure that component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  //

  if (type === "profile") {
    return (
      <div className="relative rounded-full w-52 h-52 mx-auto bg-gray-200 border-2 border-white shadow-2xl overflow-visible">
        {value.length > 0 && (
          <Image
            src={value[0].url}
            alt=""
            width={300}
            height={300}
            className="w-52 h-52 rounded-full object-cover absolute top-0 bottom-0 right-0 left-0"
          />
        )}
        <ImageUploader
          multiple={false}
          showPreview={false}
          onUploaded={(file) => {
            if (!Array.isArray(file)) {
              onChange({ id: file.id, url: file.url });
            }
          }}
          disabled={disabled}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default ImageUpload;
