import { useEffect, useRef, useState } from "react";
import type { ImageUrl } from "./types";
import { X } from "lucide-react";

interface imageZoomInProps {
  isZoomIn: boolean;
  zoomInImage: ImageUrl | undefined;
  onCloseZoomIn: () => void;
}

export default function ImageZoomIn({
  isZoomIn,
  zoomInImage,
  onCloseZoomIn,
}: imageZoomInProps) {
  //default size is 1, able to zoomIn in adjust the image size
  const [scale, setScale] = useState(1);

  // both 0 are distance from center
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // is the primary mouse button is holding????
  const [isDragging, setIsDragging] = useState(false);

  // to store initial click position
  // useState not suitable to use in here because it has render
  // to not trigger the rendering,
  // useRef can use to store the position behind the scenes with render
  const dragStart = useRef({ x: 0, y: 0 });

  //use to reset the value to initial state if {isZoomIn} is true
  useEffect(() => {
    if (isZoomIn) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomIn, zoomInImage]);

  if (!zoomInImage) return null;

  //ZOOM function==========================================================================================================
  //Zoom In function in middle mouse scroll wheel
  const handleScrollWheel = (e: React.WheelEvent) => {
    //use to stops an event from bubbling up the DOM tree,
    // preventing parent elements from receiving the same event
    e.stopPropagation();

    //define the spped to zoom the image
    //you can change this to large value to 
    // increase the zoom to be faster
    const zoomSensitivity = 0.2;
    //control the scroll direction to add or minus
    //if < 0 means (zoom in) zoomSensitivity is positive
    //if > 0 means (zoom out) zoomSensitivity is negative
    const delta = e.deltaY < 0 ? zoomSensitivity : -zoomSensitivity;
    // calculate the final size to enforce safety imits
    // This code adjusts a size value by adding a change (delta) to it, 
    // but it makes sure the size stays 
    // between a minimum of 0.5 and a maximum of 10. 
    // If the result is smaller than 0.5, it sets it to 0.5. 
    // If it's bigger than 10, it sets it to 10. 
    // Basically, it calculates the new size but caps it 
    // so it doesn’t get too small or too big.

    //Just a Basic limitation setting to do (minumum = 0.5*100=50%, maximum = 5*100 = 500%)
    const newScale = Math.min(Math.max(0.5, scale + delta), 5);
    //update image scale!
    setScale(newScale);
  };

  //Drag function==========================================================================================================
  // handle the mouse is holding (mouse down)
  const handleMouseDown = (e: React.MouseEvent) => {
    // stops the browser from doing what it normally does 
    // when you click and drag
    // It is showing a ghost image that you can drop somewhere 
    e.preventDefault();
    //the user is holding mouse button down
    setIsDragging(true);
    //calculate the mouse position and currect Image Position
    // saves the starting point where the drag began, 
    // so later the program can figure out how far you have moved.
    dragStart.current = {
      // calculation that figures out the difference 
      // between where the mouse is now and 
      // where the element initially was, 
      // helping to move the element smoothly as you drag.
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // handle the mouse on hold, drag and move (mouse move)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation()
    
    //calculates how far you have moved the mouse from 
    // where you started dragging, and 
    // updates the position of the object accordingly.
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;

    setPosition({ x: newX, y: newY });
  };

  // handle the mouse is not holding (mouse up)
  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
  }

  return (
    <>
      {isZoomIn === true && (
        <div
          className="absolute z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        bg-black/40 h-screen w-screen backdrop-blur-sm overflow-hidden"
          onWheel={handleScrollWheel}
          // Attach MouseUp/Leave to the background so dragging stops even if you slip off the image
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <button
            className="absolute top-7 right-6 bg-black/10 rounded-full p-3 
            cursor-pointer z-50 hover:bg-black/30 transition-colors"
            onClick={onCloseZoomIn}
          >
            <X color="white" />
          </button>
          <div
            className="relative w-fit h-100 mx-auto top-1/2 
          -translate-y-1/2 flex items-center justify-center"
          >
            {zoomInImage && (
              <>
                <img
                  key={zoomInImage.uid}
                  src={zoomInImage.url}
                  alt={zoomInImage.name}
                  //event assigned
                  onMouseDown={handleMouseDown}
                  className="w-full h-full object-contain select-none"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    // disable transition during drag for instant response, enable it for zoom
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                />
              </>
            )}
          </div>
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2
           text-white bg-black/50 px-3 py-1 rounded-full text-sm 
           pointer-events-none select-none"
          >
            {Math.round(scale * 100)}%
          </div>
        </div>
      )}
    </>
  );
}
