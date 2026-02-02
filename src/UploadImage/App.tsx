import { useRef, useState } from "react";
import { Eye, Image, Plus, Trash, X } from "lucide-react";
type UploadStatus = "idle" | "uploading" | "success" | "error";

interface ImageUrl {
  uid: string;
  name: string;
  status: string;
  url: string;
}

export default function UploadImageApp() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrlArray, setImageUrlArray] = useState<ImageUrl[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
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
      const file = files[0];

      setStatus("uploading");
      setProgress(0);

      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      //
      setTimeout(() => {
        clearInterval(uploadInterval);

        if (file.name.toLowerCase().includes("error")) {
          const newUrl = URL.createObjectURL(file);
          const newImage = {
            uid: crypto.randomUUID(),
            url: newUrl,
            status: "error",
            name: file.name,
          };
          setImageUrlArray((prev) => [...prev, newImage]);
          setStatus("success");
        } else {
          const newUrl = URL.createObjectURL(file);
          const newImage = {
            uid: crypto.randomUUID(),
            url: newUrl,
            status: "done",
            name: file.name,
          };
          setImageUrlArray((prev) => [...prev, newImage]);
          setProgress(100);
          setStatus("success");
        }
      }, 5000);
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
                {image.status === "error" ? (
                  <>
                    <div className="group w-40 h-40 border-2 border-red-400 bg-gray-400/20 rounded-xl relative p-2">
                      {/* <div
                        className="absolute w-22 -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded 
                shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Upload failed
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black "></div>
                      </div> */}

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
                ) : (
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
              </div>
            </>
          ))}

          {/* Uploading Progress Bar */}
          {status === "uploading" &&  (
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
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

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
