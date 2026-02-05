import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ImageUrl } from "./types";
import ImageZoomIn from "./ImageZoomIn";
import ImagePreviewItem from "./ImagePreviewItem";

//crop features import library
//lib = react-advanced-cropper
import { Cropper, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

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

  //useRef to
  const cropperRef = useRef<CropperRef>(null);

  //state declarations
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [zoomInImage, setZoomInImage] = useState<ImageUrl>();
  // const [isCrop, setIsCrop] = useState(false);
  const [tempCropImage, setTempCropImage] = useState<ImageUrl | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  console.log(imageUrlArray);

  //Upload Button
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  //Hidden file input element
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    if (file.size === 0) {
      errorMsg = "File is empty";
      isError = true;
    } else if (!file.type.startsWith("image/")) {
      errorMsg = "Only image files are allowed.";
      isError = true;
    } else if (file.size > imageSizeRequired) {
      errorMsg = "File is too big! Max " + imageSizeText + ".";
      isError = true;
    }

    if (!isError) {
      const isValidImage = await checkImageCorruption(tempUrl);
      if (!isValidImage) {
        errorMsg = "File is corrupted or unreadable.";
        isError = true;
      }
      const newImageItem: ImageUrl = {
        uid: newUid,
        name: file.name,
        status: isError ? "error" : "uploading",
        url: tempUrl,
        progress: 0,
        errorMsg: isError ? errorMsg : "",
      };

      setImageUrlArray((prev) => [...prev, newImageItem]);
    }

    event.target.value = "";

    //if any error occur before, it interrupt the action,
    if (isError) {
      return;
    }
    setOriginalFileName(file.name);
    setTempCropImage(newImageItem);
  };

  const handleCropCancel = (uid: string) => {
    setTempCropImage(null);

    setImageUrlArray((previousImages) => {
      const imagesAfterRemoval = previousImages.filter((image) => {
        const notThisImage = image.uid !== uid;
        return notThisImage;
      });

      return imagesAfterRemoval;
    });
  };

  const checkImageCorruption = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;

      // If it loads correctly, it is not corrupted
      img.onload = () => resolve(true);

      // If it errors, the binary data is bad
      img.onerror = () => resolve(false);
    });
  };

  const handleCropConfirm = () => {
    //get the current crop image
    const cropper = cropperRef.current;
    if (!cropper) return;

    const canvas = cropper.getCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const croppedUrl = URL.createObjectURL(blob);
      const newUid = crypto.randomUUID();

      const newImageItem: ImageUrl = {
        uid: newUid,
        name: originalFileName,
        status: "uploading",
        url: croppedUrl,
        progress: 0,
        errorMsg: "",
      };

      // add to array
      setImageUrlArray((prev) => [...prev, newImageItem]);

      // close the crop window
      setTempCropImage(null);

      // Start upload
      startUploadingImage(newUid);
    }, "image/png");
  };

  const startUploadingImage = (uid: string) => {
    const uploadInterval = setInterval(() => {
      setImageUrlArray((prevArray) => {
        return prevArray.map((image) => {
          if (image.uid !== uid || image.status !== "uploading") {
            return image;
          }
          const nextProgress = image.progress + 20;
          return {
            ...image,
            progress: nextProgress >= 90 ? 90 : nextProgress,
          };
        });
      });
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      updateImageStatus(uid, {
        status: "done",
        progress: 100,
      });
    }, 2000);
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

        {tempCropImage && (
          <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/50 flex flex-col justify-between items-center">
            <div className="w-full h-full flex justify-center items-center">
              <div className="bg-white w-250 h-125">
                <div className="w-full h-full">
                  <Cropper
                    ref={cropperRef}
                    src={tempCropImage.url}
                    className="cropper w-full h-full"
                  />
                </div>
              </div>
            </div>
            <div className="">
              {/* conrtol button */}
              <div className="h-20 flex items-center justify-center gap-5">
                <button
                  onClick={() => handleCropCancel(tempCropImage.uid)}
                  className="px-4 py-3 rounded-lg bg-gray-600 
              font-bold text-white cursor-pointer
               hover:bg-gray-700 active:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="px-5 py-3 rounded-lg bg-blue-600 
              font-bold text-white cursor-pointer
               hover:bg-blue-700 active:bg-blue-500"
                >
                  Upload Cropped Image
                </button>
              </div>
            </div>
          </div>
        )}

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
