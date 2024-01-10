import React from "react";
import { Editor } from "@tinymce/tinymce-react";

type EditorTinyProps = {
    value: string;
    onChange: (content: string) => void;
};

const TINYMCE_INIT = {
    branding: false,
    menubar: false,
    height: "200",
    plugins: "code anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
    toolbar: "code | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
};

const EditorTiny = ({ value, onChange }: EditorTinyProps) => {
    return (
        <Editor 
            value={value} 
            onEditorChange={(newContent, editor) => onChange(newContent)} 
            init={TINYMCE_INIT} />
    );
};

export default EditorTiny;
