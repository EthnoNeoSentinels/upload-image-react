// import { useRef, useState, type Dispatch, type SetStateAction } from "react";
// import type { ImageUrl } from "./types";
// import ImageZoomIn from "./ImageZoomIn";
// import ImagePreviewItem from "./ImagePreviewItem";

// // 1. Import Cropper and CSS
// import { Cropper, type CropperRef } from 'react-advanced-cropper';
// import 'react-advanced-cropper/dist/style.css';

// interface ImageUploadProps {
//   entireWindowsWidth: string;
//   previewImageWidth: string;
//   previewImageHeight: string;
//   imageSizeRequired: number;
//   imageUrlArray: ImageUrl[];
//   setImageUrlArray: Dispatch<SetStateAction<ImageUrl[]>>;
//   imageSizeText: string;
//   previewImageGap: string;
// }

// export default function ImageUpload({
//   imageUrlArray,
//   setImageUrlArray,
//   imageSizeRequired = 5 * 1024 * 1024,
//   imageSizeText = "5MB",
//   entireWindowsWidth,
//   previewImageWidth,
//   previewImageHeight,
//   previewImageGap,
// }: ImageUploadProps) {
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // 2. Ref for the Cropper to extract the result
//   const cropperRef = useRef<CropperRef>(null);

//   // State
//   const [isZoomIn, setIsZoomIn] = useState(false);
//   const [zoomInImage, setZoomInImage] = useState<ImageUrl>();
  
//   // 3. State for handling the Temporary Crop Image
//   const [tempCropImage, setTempCropImage] = useState<string | null>(null);
//   const [originalFileName, setOriginalFileName] = useState<string>("image.png");

//   const handleButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   // ----------------------------------------------------------------
//   // STEP A: Handle File Selection (Validate & Open Cropper)
//   // ----------------------------------------------------------------
//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     const file = files[0];
//     const tempUrl = URL.createObjectURL(file);

//     // Validation (Type & Size)
//     if (file.size === 0) {
//       alert("File is empty");
//       return;
//     } 
//     if (!file.type.startsWith("image/")) {
//       alert("Only image files are allowed.");
//       return;
//     } 
//     if (file.size > imageSizeRequired) {
//       alert("File is too big! Max " + imageSizeText + ".");
//       return;
//     }

//     // Check corruption
//     const isValidImage = await checkImageCorruption(tempUrl);
//     if (!isValidImage) {
//       alert("File is corrupted or unreadable.");
//       return;
//     }

//     // If valid, DO NOT upload yet. Open the Cropper instead.
//     setOriginalFileName(file.name);
//     setTempCropImage(tempUrl);
    
//     // Reset input so same file can be selected again if cancelled
//     event.target.value = "";
//   };

//   // ----------------------------------------------------------------
//   // STEP B: Handle Crop Confirmation (Actual Upload Logic)
//   // ----------------------------------------------------------------
//   const handleCropConfirm = () => {
//     const cropper = cropperRef.current;
//     if (!cropper) return;

//     const canvas = cropper.getCanvas();
//     if (!canvas) return;

//     // Convert Canvas to Blob/URL
//     canvas.toBlob((blob) => {
//       if (!blob) return;
      
//       const croppedUrl = URL.createObjectURL(blob);
//       const newUid = crypto.randomUUID();

//       // Create the Item
//       const newImageItem: ImageUrl = {
//         uid: newUid,
//         name: originalFileName,
//         status: "uploading", // Start uploading immediately
//         url: croppedUrl, // Use the CROPPED url
//         progress: 0,
//         errorMsg: "",
//       };

//       // Add to array
//       setImageUrlArray((prev) => [...prev, newImageItem]);

//       // Close Cropper
//       setTempCropImage(null);

//       // Start Simulation
//       startUploadSimulation(newUid);

//     }, 'image/jpeg');
//   };

//   const handleCropCancel = () => {
//     setTempCropImage(null);
//   };

//   // ----------------------------------------------------------------
//   // Helper: Simulation Logic (Moved out for clarity)
//   // ----------------------------------------------------------------
//   const startUploadSimulation = (uid: string) => {
//     const uploadInterval = setInterval(() => {
//       setImageUrlArray((prevArray) => {
//         return prevArray.map((image) => {
//           if (image.uid !== uid || image.status !== "uploading") {
//             return image;
//           }
//           const nextProgress = image.progress + 20;
//           return {
//             ...image,
//             progress: nextProgress >= 90 ? 90 : nextProgress,
//           };
//         });
//       });
//     }, 200);

//     setTimeout(() => {
//       clearInterval(uploadInterval);
//       updateImageStatus(uid, {
//         status: "done",
//         progress: 100,
//       });
//     }, 2000);
//   };

//   // ----------------------------------------------------------------
//   // Standard Helpers
//   // ----------------------------------------------------------------
//   const checkImageCorruption = (url: string): Promise<boolean> => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = url;
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//     });
//   };

//   const updateImageStatus = (uid: string, updates: Partial<ImageUrl>) => {
//     setImageUrlArray((prev) =>
//       prev.map((img) => (img.uid === uid ? { ...img, ...updates } : img)),
//     );
//   };

//   const handleZoomInImage = (uid: string) => {
//     if (!isZoomIn) {
//       setIsZoomIn(true);
//       const image = imageUrlArray.find((image) => image.uid === uid);
//       setZoomInImage(image);
//     } else {
//       setIsZoomIn(false);
//     }
//   };

//   const handleCloseZoomIn = () => setIsZoomIn(false);

//   const handleRemoveImage = (uid: string) => {
//     setImageUrlArray((previousImages) => 
//       previousImages.filter((image) => image.uid !== uid)
//     );
//   };

//   return (
//     <>
//       <div className={`${entireWindowsWidth}`}>
//         {/* Zoom Modal */}
//         <ImageZoomIn
//           isZoomIn={isZoomIn}
//           onCloseZoomIn={handleCloseZoomIn}
//           zoomInImage={zoomInImage}
//         />

//         {/* CROPPER MODAL (Only shows when tempCropImage is set) */}
//         {tempCropImage && (
//           <div style={{
//             position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
//             zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column'
//           }}>
//             <div style={{flex: 1, position: 'relative'}}>
//               <Cropper
//                 ref={cropperRef}
//                 src={tempCropImage}
//                 className={'cropper'}
//                 stencilProps={{ aspectRatio: 1 }} // Optional: Remove to allow free crop
//               />
//             </div>
            
//             {/* Control Bar */}
//             <div style={{
//               height: '80px', background: '#222', display: 'flex', 
//               alignItems: 'center', justifyContent: 'center', gap: '20px'
//             }}>
//               <button 
//                 onClick={handleCropCancel}
//                 style={{
//                   padding: '10px 20px', borderRadius: '4px', border: 'none', 
//                   backgroundColor: '#444', color: 'white', cursor: 'pointer'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleCropConfirm}
//                 style={{
//                   padding: '10px 20px', borderRadius: '4px', border: 'none', 
//                   backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer'
//                 }}
//               >
//                 Upload Cropped Image
//               </button>
//             </div>
//           </div>
//         )}

//         <ImagePreviewItem
//           imageUrlArray={imageUrlArray}
//           handleButtonClick={handleButtonClick}
//           handleFileChange={handleFileChange}
//           handleRemoveImage={handleRemoveImage}
//           handleZoomInImage={handleZoomInImage}
//           previewImageWidth={previewImageWidth}
//           previewImageHeight={previewImageHeight}
//           previewImageGap={previewImageGap}
//         />

//         <input
//           ref={fileInputRef}
//           type="file"
//           hidden
//           accept="image/*"
//           onChange={handleFileChange}
//         />
//       </div>
//     </>
//   );
// }


import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ImageUrl } from "./types";
import ImageZoomIn from "./ImageZoomIn";
import ImagePreviewItem from "./ImagePreviewItem";
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
  imageUrlArray,
  setImageUrlArray,
  imageSizeRequired = 5 * 1024 * 1024,
  imageSizeText = "5MB",
  entireWindowsWidth,
  previewImageWidth,
  previewImageHeight,
  previewImageGap,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  // State
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [zoomInImage, setZoomInImage] = useState<ImageUrl>();
  
  // Changed type to string | null because we don't need a full ImageUrl object just for the temp crop view
  const [tempCropImage, setTempCropImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const tempUrl = URL.createObjectURL(file);

    // Validation
    let isError = false;
    if (file.size === 0) isError = true;
    else if (!file.type.startsWith("image/")) isError = true;
    else if (file.size > imageSizeRequired) isError = true;

    if (!isError) {
      const isValidImage = await checkImageCorruption(tempUrl);
      if (!isValidImage) isError = true;
    }

    if (isError) {
       // Handle error (alert or show message)
       return;
    }

    // FIX 1: DO NOT add to imageUrlArray here!
    // Just save the info for the Cropper Modal
    setOriginalFileName(file.name);
    setTempCropImage(tempUrl);
    
    // Reset input value so the same file can be selected again if cancelled
    event.target.value = "";
  };

  // FIX 2: Simplified Cancel (No need to remove from array because we never added it)
  const handleCropCancel = () => {
    setTempCropImage(null);
  };

  const handleCropConfirm = () => {
    const cropper = cropperRef.current;
    if (!cropper) return;

    const canvas = cropper.getCanvas();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const croppedUrl = URL.createObjectURL(blob);
      const newUid = crypto.randomUUID();

      // FIX 3: This is the ONLY place we create the item and add it to the list
      const newImageItem: ImageUrl = {
        uid: newUid,
        name: originalFileName,
        status: "uploading",
        url: croppedUrl,
        progress: 0,
        errorMsg: "",
      };

      setImageUrlArray((prev) => [...prev, newImageItem]);
      setTempCropImage(null); // Close modal
      startUploadingImage(newUid);
    }, "image/png");
  };

  // ... (Keep helper functions like checkImageCorruption, startUploadingImage, updateImageStatus, etc.) ...
  const checkImageCorruption = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const startUploadingImage = (uid: string) => {
    const uploadInterval = setInterval(() => {
      setImageUrlArray((prevArray) => {
        return prevArray.map((image) => {
          if (image.uid !== uid || image.status !== "uploading") return image;
          const nextProgress = image.progress + 20;
          return { ...image, progress: nextProgress >= 90 ? 90 : nextProgress };
        });
      });
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      updateImageStatus(uid, { status: "done", progress: 100 });
    }, 2000);
  };

  const updateImageStatus = (uid: string, updates: Partial<ImageUrl>) => {
    setImageUrlArray((prev) => prev.map((img) => (img.uid === uid ? { ...img, ...updates } : img)));
  };

  const handleZoomInImage = (uid: string) => {
    if (!isZoomIn) {
      setIsZoomIn(true);
      const image = imageUrlArray.find((image) => image.uid === uid);
      setZoomInImage(image);
    } else setIsZoomIn(false);
  };

  const handleCloseZoomIn = () => setIsZoomIn(false);

  const handleRemoveImage = (uid: string) => {
    setImageUrlArray((prev) => prev.filter((image) => image.uid !== uid));
  };

  return (
    <>
      <div className={`${entireWindowsWidth}`}>
        <ImageZoomIn
          isZoomIn={isZoomIn}
          onCloseZoomIn={handleCloseZoomIn}
          zoomInImage={zoomInImage}
        />

        {/* Cropper Modal */}
        {tempCropImage && (
          <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/50 flex flex-col justify-between items-center">
            <div className="w-full h-full flex justify-center items-center">
              <div className="bg-white w-[800px] h-[500px]"> {/* Increased size for better visibility */}
                <Cropper
                  ref={cropperRef}
                  src={tempCropImage}
                  className="cropper w-full h-full"
                  stencilProps={{ aspectRatio: undefined }} // Enables free-form resizing
                />
              </div>
            </div>
            <div className="h-24 w-full flex items-center justify-center gap-5 bg-white/10">
              <button
                onClick={handleCropCancel}
                className="px-4 py-3 rounded-lg bg-gray-600 font-bold text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-5 py-3 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700"
              >
                Upload Cropped Image
              </button>
            </div>
          </div>
        )}

        <ImagePreviewItem
          imageUrlArray={imageUrlArray}
          handleButtonClick={handleButtonClick}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleZoomInImage={handleZoomInImage}
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