import { useRef } from "react";

/*
Just a button mascaraing as a file input
*/
export default function FileButton({children, className="", onClick}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="file-button">
            <input ref={fileInputRef} type="file" className="hidden" onChange={onClick} />
            <button className={className} onClick={(event) => {
                fileInputRef.current?.click();
            }}>
                {children}
            </button>
        </div>
    );
}