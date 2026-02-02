import { Trash, Image, Eye } from "lucide-react";
import { UploadButton } from "./UploadButton";
import type { ImageUrl } from "./types";

interface ImagePreviewItemProps {
  imageUrlArray: ImageUrl[];
  handleRemoveImage: (uid: string) => void;
  handleZoomInImage: (uid: string) => void;
  handleButtonClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  //css passing
  previewImageWidth: string;
  previewImageHeight: string;
}

export default function ImagePreviewItem({
  imageUrlArray,
  handleRemoveImage,
  handleZoomInImage,
  handleFileChange,
  handleButtonClick,
  previewImageWidth = "w-40",
  previewImageHeight = "w-40",

  //css passing
}: ImagePreviewItemProps) {
  return (
    <>
      <div className="flex flex-wrap mt-4 mx-5 gap-2">
        {/* Preview Image */}
        {imageUrlArray.map((image) => (
          <>
            <div key={image.uid}>
              {image.status === "error" && (
                <>
                  <div
                    className={`group ${previewImageWidth} ${previewImageHeight} border-2 border-red-400 bg-gray-400/20 rounded-xl relative p-2`}
                  >
                    <button
                      onClick={() => handleRemoveImage(image.uid)}
                      className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer
                  opacity-0 group-hover:opacity-100"
                    >
                      <Trash color="white" />
                    </button>

                    <div className="w-full h-full flex flex-col items-center justify-center relative group-hover:bg-black/50 group-hover:brightness-50 rounded-xl transition-all duration-300">
                      <Image color="red" size={30} />
                      <span className="text-xs text-center text-red-500 font-medium">
                        {image.errorMsg}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {image.status === "done" && image.progress === 100 && (
                <>
                  <div
                    className={`w-fit h-fit border border-gray-300 rounded-xl group`}
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={image.url}
                        alt="Preview"
                        className={`${previewImageWidth} ${previewImageHeight} object-cover rounded-xl shadow-sm 
                     block p-2 animate-[popIn_0.4s_ease-out_forwards] 
                    group-hover:brightness-50 transition-all duration-500`}
                      />
                      {/* Hover Icons */}
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
                  className={`${previewImageWidth} ${previewImageHeight} border border-dashed border-gray-300 rounded-xl flex flex-col 
            items-center justify-center bg-gray-50 p-4 animate-[popIn_0.5s_ease-out_forwards]`}
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

        <UploadButton
          handleButtonClick={handleButtonClick}
          handleFileChange={() => handleFileChange}
          //css passing
          previewImageWidth={previewImageWidth}
          previewImageHeight={previewImageHeight}
        />
      </div>
    </>
  );
}
