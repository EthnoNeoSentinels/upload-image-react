import type { Dispatch, SetStateAction } from "react";
import ImageUpload from "./ImageUpload";
import type { ImageUrl } from "./types";

interface AppProps {
  imageUrlArray: ImageUrl[];
  entireWindowsWidth: string;
  previewImageWidth: string;
  previewImageHeight: string;
  imageSizeRequired: number;
  imageSizeText: string;
  previewImageGap: string;
  setImageUrlArray: Dispatch<SetStateAction<ImageUrl[]>>;
}

export default function UploadImageApp({
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
  imageSizeRequired,
  imageUrlArray,
  setImageUrlArray,
  imageSizeText = "5MB",
  previewImageGap,
}: AppProps) {
  return (
    <>
      <ImageUpload
        entireWindowsWidth={entireWindowsWidth}
        previewImageWidth={previewImageWidth}
        previewImageHeight={previewImageHeight}
        imageSizeRequired={imageSizeRequired}
        imageUrlArray={imageUrlArray}
        setImageUrlArray={setImageUrlArray}
        imageSizeText={imageSizeText}
        previewImageGap={previewImageGap}
      />
    </>
  );
}
