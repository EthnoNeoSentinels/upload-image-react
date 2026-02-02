import { useRef, useState } from "react";
import type { ImageUrl } from "./types";
import ImageZoomIn from "./ImageZoomIn";
import ImagePreviewItem from "./ImagePreviewItem";

interface ImageUploadProps {
  entireWindowsWidth: string;
  previewImageWidth: string;
  previewImageHeight: string;
}

export default function ImageUpload({
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
}: ImageUploadProps) {
  //useRef to handle hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  //state declarations
  const [imageUrlArray, setImageUrlArray] = useState<ImageUrl[]>([]);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [zoomInImage, setZoomInImage] = useState<ImageUrl>();

  //Upload Button
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  //Hidden file input element
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newUid = crypto.randomUUID();
      const file = files[0];

      const tempUrl = URL.createObjectURL(file);

      const newImageItem: ImageUrl = {
        uid: newUid,
        name: file.name,
        status: "uploading",
        url: tempUrl,
        progress: 0,
      };

      setImageUrlArray((prev) => [...prev, newImageItem]);

      const getNextProgress = (currentProgress: number) => {
        const next = currentProgress + 20;
        return next >= 90 ? 90 : next;
      };

      //uploading progress bar...?
      const uploadInterval = setInterval(() => {
        setImageUrlArray((prevArray) => {
          return prevArray.map((image) => {
            //check any exist uid and the image is not in uploading
            if (image.uid != newUid || image.status !== "uploading") {
              return image;
            }
            return {
              ...image,
              progress: getNextProgress(image.progress),
            };
          });
        });
      }, 200);

      //simulation of uploading image
      setTimeout(() => {
        clearInterval(uploadInterval);

        const isError = file.name.toLowerCase().includes("error");

        setImageUrlArray((prevArray) =>
          prevArray.map((img) => {
            //find specific image in an array by UID
            if (img.uid === newUid) {
              return {
                ...img,
                status: isError ? "error" : "done",
                progress: 100,
              };
            }

            return img;
          }),
        );
      }, 2000);
    }
    event.target.value = "";
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
      <div className={`w-${entireWindowsWidth}`}>
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
