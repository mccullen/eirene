import { useRef } from "react";

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