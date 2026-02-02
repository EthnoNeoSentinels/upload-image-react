import { useRef, useState } from "react";
import { Eye, Image, Plus, Trash, X } from "lucide-react";
import type { ImageUrl } from "../interface/types";

export default function UploadImageApp() {
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
      <div className="w-full">
        {isZoomIn === true && (
          <div className="absolute z-90 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 h-screen w-screen backdrop-blur-sm">
            <button
              className="absolute top-7 right-6 bg-black/10 rounded-full p-3 cursor-pointer"
              onClick={() => handleZoomInImage("")}
            >
              <X color="white" />
            </button>
            <div className="relative bg-white w-100 h-100 mx-auto top-1/2 -translate-y-1/2">
              {zoomInImage && (
                <>
                  <img
                    key={zoomInImage.uid}
                    src={zoomInImage.url}
                    alt={zoomInImage.name}
                    className="w-full h-full"
                  />
                </>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 justify-center items-center mt-4 mx-5">
          {/* Preview Image */}
          {imageUrlArray.map((image) => (
            <>
              <div key={image.uid}>
                {image.status === "error" && (
                  <>
                    <div className="group w-40 h-40 border-2 border-red-400 bg-gray-400/20 rounded-xl relative p-2">
                      <button
                        onClick={() => handleRemoveImage(image.uid)}
                        className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer
                  opacity-0 group-hover:opacity-100"
                      >
                        <Trash color="white" />
                      </button>

                      <div className="w-full h-full flex flex-col items-center justify-center relative group-hover:bg-black/50 group-hover:brightness-50 rounded-xl transition-all duration-300">
                        <Image color="red" size={30} />
                        <span className="text-xs text-red-500 font-medium">
                          Upload Error
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {image.status === "done" && image.progress === 100 && (
                  <>
                    <div className="h-40 w-40 border border-gray-300 rounded-xl group ">
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-40 h-40 object-cover rounded-xl shadow-sm 
                     block p-2 animate-[popIn_0.4s_ease-out_forwards] 
                    group-hover:brightness-50 transition-all duration-500"
                        />
                        {/* Hidden Icons */}
                        <div className="z-30 text-white opacity-0 flex space-x-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                          <button
                            className="cursor-pointer"
                            onClick={() => handleZoomInImage(image.uid)}
                          >
                            <Eye />
                          </button>
                          <button
                            onClick={() => handleRemoveImage(image.uid)}
                            className="cursor-pointer"
                          >
                            <Trash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Uploading Progress Bar */}
                {image.status === "uploading" && (
                  <div
                    className="w-40 h-40 border border-dashed border-gray-300 rounded-xl flex flex-col 
            items-center justify-center bg-gray-50 p-4 animate-[popIn_0.5s_ease-out_forwards]"
                  >
                    <div className="text-sm text-gray-600 mb-2 font-medium">
                      Uploading...
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${image.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ))}

          <button
            type="button"
            className={`
          flex flex-col items-center justify-center text-center h-40 w-40 shrink-0
          box-border border-2 border-dashed text-[14px] 
          rounded-lg transition-all duration-500 ease-out cursor-pointer
          border-[#dbdbdb] hover:border-[#1677ff] hover:text-[#1677ff]

        `}
            onClick={handleButtonClick}
          >
            <span role="img" aria-label="plus" className="mb-2">
              <Plus />
            </span>
            <div>Upload</div>
          </button>
        </div>

        {/* Hidden file upload input element */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </>
  );
}
