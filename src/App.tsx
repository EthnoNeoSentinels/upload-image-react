import type { ImageUrl } from "./UploadImage/types";
import UploadImageApp from "./UploadImage/UploadImageApp";

function App() {
  const testArray: ImageUrl[] = [];

  return (
    <>
      <div className="w-full flex">
        <div className="w-1/2 bg-green-500 h-screen">Test</div>

        <UploadImageApp
          //Assigned an Array here to map the image
          imageArray={testArray}
          //Accept Number Value
          // ("1" = 4px) follow tailwind width standard
          //Fraction (1/2, 1/3, 1/4 ...etc)
          // if using px, place enclose the number with brackets --> Example [100px]
          entireWindowsWidth="w-1/2"
          // default width is 40, write in number or [100px] 
          previewImageWidth={"w-30"}
          // default height is 40, write in number or [100px]
          previewImageHeight={"h-30"}
        />
      </div>
    </>
  );
}

export default App;
