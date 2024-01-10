export const getFileIcon = (fileType: string): string => {
    switch (fileType) {
        case "image/gif": 
        case "image/jpeg": 
        case "image/jpg": 
        case "image/png": 
        case "image/webp": 
            return "bi bi-file-earmark-image";
        case "video/avi": 
        case "video/mov": 
        case "video/mp4": 
        case "video/wmv": 
            return "bi bi-file-earmark-play";
        case "audio/mp3": 
        case "audio/mpeg": 
        case "audio/wav": 
            return "bi bi-file-earmark-music";
        case "application/pdf": return "bi bi-file-earmark-pdf";
        case "application/msword": return "bi bi-file-earmark-word";
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return "bi bi-file-earmark-word";
        case "application/vnd.ms-excel": return "bi bi-file-earmark-excel";
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": return "bi bi-file-earmark-excel";
        case "application/vnd.ms-powerpoint": return "bi bi-file-earmark-ppt";
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation": return "bi bi-file-earmark-ppt";
        case "text/plain": return "bi bi-file-earmark-text";
        default: return "bi bi-file-earmark-fill";
    }
};

export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
};

export const stripHtmlTags = (str: string): string => {
    if (!str) return "";
    return str.replace(/<\/?[^>]+(>|$)/g, "");
};
