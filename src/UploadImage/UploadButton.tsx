import { Plus } from "lucide-react";
import { useRef } from "react";

interface UploadButtonProps {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;

  //css passing
  previewImageWidth: number | string;
  previewImageHeight: number | string;
}

export function UploadButton({
  handleFileChange,
  handleButtonClick,
  previewImageWidth = "w-40",
  previewImageHeight = "w-40",
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        className={`
          flex flex-col items-center justify-center text-center ${previewImageHeight} ${previewImageWidth} shrink-0
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
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileChange}
        accept="image/*"
      />
    </>
  );
}
