import ImageUpload from "./ImageUpload";
import type { ImageUrl } from "./types";

interface AppProps {
  imageArray: ImageUrl[];
  entireWindowsWidth: string;
  previewImageWidth: string;
  previewImageHeight: string;
}

export default function UploadImageApp({
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
}: AppProps) {
  return (
    <>
      <ImageUpload
        entireWindowsWidth={entireWindowsWidth}
        previewImageWidth={previewImageWidth}
        previewImageHeight={previewImageHeight}
      />
    </>
  );
}
