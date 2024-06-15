import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import debounce from "lodash/debounce";

export default function NewReactQuill(props) {
  const [value, setValue] = useState(props.newTicketFormData.message);

  useEffect(() => {
    setValue(props.newTicketFormData.message);

    // eslint-disable-next-line
  }, [props.newTicketFormData.templateId]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const editorStyle = {
    backgroundColor: "white",
    borderRadius: "5px",
  };

  // Create a debounced function
  const debouncedHandleChange = debounce((content) => {
    props.handleNewTicketDataChange(content, "~~~~");
  }, 300); // Adjust the debounce delay as needed

  // Handle changes in the editor content
  const handleEditorChange = (content) => {
    setValue(content);

    // Call the debounced function
    debouncedHandleChange(content);
  };

  useEffect(() => {
    // Clean up the debounced function when the component unmounts
    return () => {
      debouncedHandleChange.cancel();
    };
  }, []);

  return (
    <ReactQuill
      ref={props.quillRef}
      name="message"
      theme="snow"
      modules={modules}
      formats={formats}
      style={editorStyle}
      onChange={handleEditorChange}
      value={value}
    />
  );
}
