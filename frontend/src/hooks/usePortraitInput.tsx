import { useState } from "react";

const usePortraitInput = () => {
    const [portraitFile, setPortraitFile] = useState<File | null>(null); // Stores actual File object of selected portrait
    const [portraitSrc, setPortraitSrc] = useState<string | null>(null); // Holds source path of selected portrait for preview purposes
    
    const handlePortraitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setPortraitFile(file);
            setPortraitSrc(URL.createObjectURL(file));
        }
    };

    return { portraitSrc, portraitFile, handlePortraitChange };
};

export default usePortraitInput;
