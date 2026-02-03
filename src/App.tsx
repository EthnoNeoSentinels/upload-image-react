import { useState } from "react";
import type { ImageUrl } from "./UploadImage/types";
import UploadImageApp from "./UploadImage/UploadImageApp";

function App() {
  const [imageUrlArray, setImageUrlArray] = useState<ImageUrl[]>([]);

  console.log(imageUrlArray);

  return (
    <>
      <div className="w-full flex">
        <div className="w-1/2 bg-green-500 h-screen">Test</div>

        <UploadImageApp
          //Assigned an State Array here to map the image
          imageUrlArray={imageUrlArray}
          //State Array method??
          setImageUrlArray={setImageUrlArray}
          // ("1" = 4px) follow tailwind width standard
          entireWindowsWidth="w-1/2"
          previewImageWidth="w-40" // default width is 40
          previewImageHeight="h-40" // default height is 40
          previewImageGap="gap-2" //default is 2
          imageSizeRequired={5 * 1024 * 1024} //default is 5MB
          imageSizeText="5MB" //if any size is modify change the text at here
        />
      </div>
    </>
  );
}

export default App;
