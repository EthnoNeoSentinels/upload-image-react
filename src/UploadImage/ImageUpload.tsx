import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ImageUrl } from "./types";
import ImageZoomIn from "./ImageZoomIn";
import ImagePreviewItem from "./ImagePreviewItem";

interface ImageUploadProps {
  entireWindowsWidth: string;
  previewImageWidth: string;
  previewImageHeight: string;
  imageSizeRequired: number;
  imageUrlArray: ImageUrl[];
  setImageUrlArray: Dispatch<SetStateAction<ImageUrl[]>>;
  imageSizeText: string;
  previewImageGap: string;
}

export default function ImageUpload({
  //array passing
  imageUrlArray,
  setImageUrlArray,

  //size passing
  imageSizeRequired = 5 * 1024 * 1024,
  imageSizeText = "5MB",

  //css passing
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
  previewImageGap,
}: ImageUploadProps) {
  //useRef to handle hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  //state declarations
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [zoomInImage, setZoomInImage] = useState<ImageUrl>();

  //Upload Button
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  //Hidden file input element
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    //file info
    //define file random id
    const newUid = crypto.randomUUID();
    // receive the file
    const file = files[0];
    //create blob url for the file
    const tempUrl = URL.createObjectURL(file);

    //check for file format in local
    let isError = false;
    let errorMsg = "";

    if (!file.type.startsWith("image/")) {
      errorMsg = "Only image files are allowed.";
      isError = true;
    } else if (file.size > imageSizeRequired) {
      errorMsg = "File is too big! Max " + imageSizeText + ".";
      isError = true;
    }

    // Prepare to insert image in uploading / error status
    const newImageItem: ImageUrl = {
      uid: newUid,
      name: file.name,
      status: isError ? "error" : "uploading",
      url: tempUrl,
      progress: 0,
      errorMsg: isError ? errorMsg : "",
    };

    setImageUrlArray((prev) => [...prev, newImageItem]);

    event.target.value = "";

    //if any error occur before, it interrupt the action,
    // no going to check network error
    if (isError) {
      return;
    }

    // A. The Progress Timer (Ticks every 200ms)
    const uploadInterval = setInterval(() => {
      setImageUrlArray((prevArray) => {
        return prevArray.map((image) => {
          // Only update THIS specific image
          if (image.uid !== newUid || image.status !== "uploading") {
            return image;
          }

          // Cap simulated progress at 90% until finished
          const nextProgress = image.progress + 20;
          return {
            ...image,
            progress: nextProgress >= 90 ? 90 : nextProgress,
          };
        });
      });
    }, 200);

    // B. The Finish Timer (Finishes after 2 seconds)
    setTimeout(() => {
      clearInterval(uploadInterval); // Stop the progress ticker

      // Mark as done
      updateImageStatus(newUid, {
        status: "done",
        progress: 100,
      });
    }, 2000);

    //axios
  };

  const updateImageStatus = (uid: string, updates: Partial<ImageUrl>) => {
    setImageUrlArray((prev) =>
      prev.map((img) => (img.uid === uid ? { ...img, ...updates } : img)),
    );
  };

  const handleZoomInImage = (uid: string) => {
    if (isZoomIn === false) {
      setIsZoomIn(true);
      const image = imageUrlArray.find((image) => image.uid === uid);
      setZoomInImage(image);
    } else {
      setIsZoomIn(false);
    }
  };

  const handleCloseZoomIn = () => setIsZoomIn(false);

  const handleRemoveImage = (uid: string) => {
    //the image uid not same is remain,
    // if the uid is same, the image will no keep inside the array => means remove
    // but the image still using the resources?
    setImageUrlArray((previousImages) => {
      const imagesAfterRemoval = previousImages.filter((image) => {
        const notThisImage = image.uid !== uid;
        return notThisImage;
      });

      return imagesAfterRemoval;
    });
  };

  return (
    <>
      <div className={`${entireWindowsWidth}`}>
        <ImageZoomIn
          isZoomIn={isZoomIn}
          onCloseZoomIn={handleCloseZoomIn}
          zoomInImage={zoomInImage}
        />

        <ImagePreviewItem
          // Allow to pass in array
          imageUrlArray={imageUrlArray}
          handleButtonClick={handleButtonClick}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleZoomInImage={handleZoomInImage}
          //css passing
          previewImageWidth={previewImageWidth}
          previewImageHeight={previewImageHeight}
          previewImageGap={previewImageGap}
        />

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
