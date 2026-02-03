import { useState } from "react";
import type { ImageUrl } from "./UploadImage/types";
import UploadImageApp from "./UploadImage/UploadImageApp";
import columbina1 from "../src/assets/columbina1.jpeg";
import columbina2 from "../src/assets/columbina2.jpeg";
import columbina3 from "../src/assets/columbina3.jpeg";

function App() {
  const [imageUrlArray, setImageUrlArray] = useState<ImageUrl[]>([
    {
      uid: "1",
      errorMsg: "",
      name: "",
      progress: 100,
      status: "done",
      url: columbina1,
    },
    {
      uid: "2",
      errorMsg: "",
      name: "",
      progress: 100,
      status: "done",
      url: columbina2,
    },
    {
      uid: "3",
      errorMsg: "",
      name: "",
      progress: 100,
      status: "done",
      url: columbina3,
    },
  ]);

  return (
    <>
      <div className="w-full flex">
        {/* <div className="w-1/2 bg-green-500 h-screen">Test</div> */}

        <UploadImageApp
          //Assigned an State Array here to map the image
          imageUrlArray={imageUrlArray}
          //Dispatch method
          setImageUrlArray={setImageUrlArray}
          // ("1" = 4px) follow tailwind width standard
          entireWindowsWidth="w-full"
          // default width is 40
          previewImageWidth="w-60"
          // default height is 40
          previewImageHeight="h-60"
          //default is 2
          previewImageGap="gap-2"
          //default is 5MB
          imageSizeRequired={5 * 1024 * 1024}
          //if any size is modify change the text at here
          imageSizeText="5MB"
        />
      </div>
    </>
  );
}

export default App;
