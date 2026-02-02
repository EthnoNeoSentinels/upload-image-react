import type { Dispatch, SetStateAction } from "react";
import ImageUpload from "./ImageUpload";
import type { ImageUrl } from "./types";

interface AppProps {
  imageUrlArray: ImageUrl[];
  entireWindowsWidth: string;
  previewImageWidth: string;
  previewImageHeight: string;
  imageSizeRequired: number;
  setImageUrlArray: Dispatch<SetStateAction<ImageUrl[]>>;
}

export default function UploadImageApp({
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
  imageSizeRequired,
  imageUrlArray,
  setImageUrlArray,
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
      />
    </>
  );
}
