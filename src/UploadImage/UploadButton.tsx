import { Plus } from "lucide-react";

interface UploadButtonProps {
  onClick: () => void;
}

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <button
      type="button"
      className={`
          flex flex-col items-center justify-center text-center h-40 w-40 shrink-0
          box-border border-2 border-dashed text-[14px] 
          rounded-lg transition-all duration-500 ease-out cursor-pointer
          border-[#dbdbdb] hover:border-[#1677ff] hover:text-[#1677ff]

        `}
      onClick={onClick}
    >
      <span role="img" aria-label="plus" className="mb-2">
        <Plus />
      </span>
      <div>Upload</div>
    </button>
  );
}
