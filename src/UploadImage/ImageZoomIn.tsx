import type { ImageUrl } from "../components/interface/types";
import { X } from "lucide-react";

interface imageZoomInProps {
  isZoomIn: Boolean;
  zoomInImage: ImageUrl | undefined;
  onCloseZoomIn: () => void;
}

export default function ImageZoomIn({
  isZoomIn,
  zoomInImage,
  onCloseZoomIn,
}: imageZoomInProps) {
  if (!zoomInImage) return null;
  return (
    <>
      {isZoomIn === true && (
        <div className="absolute z-90 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 h-screen w-screen backdrop-blur-sm">
          <button
            className="absolute top-7 right-6 bg-black/10 rounded-full p-3 cursor-pointer"
            onClick={onCloseZoomIn}
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
    </>
  );
}
