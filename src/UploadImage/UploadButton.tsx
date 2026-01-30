interface ButtonProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

export default function UpdateButton({ handleChange, handleClick }: ButtonProps) {
  

  return (
    <>
      <div>
        <span className="">
          <input accept="" type="file" name="file" className="hidden" onChange={handleChange} />
          <button
            type="button"
            className="bg-none flex flex-col items-center justify-center 
            text-center h-25.5 w-25.5 box-border border border-dashed text-[14px] 
            border-[#dbdbdb] hover:border-[#1677ff] rounded-lg transition delay-75 
            duration-300 ease-in-out transform"
            onClick={handleClick}
          >
            <span role="img" aria-label="plus" className="">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="plus"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
              </svg>
            </span>
            <div className="mt-2">Upload</div>
          </button>
        </span>
      </div>
    </>
  );
}
