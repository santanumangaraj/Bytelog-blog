import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan, faRotate } from "@fortawesome/free-solid-svg-icons";
import { CYAN, PINK } from "../blog/blogUi.jsx";
import FieldError from "./FieldError.jsx";

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with the backend limit

export const validateCoverFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Cover image must be a JPG, PNG or WebP file.";
  }
  if (file.size > MAX_BYTES) {
    return "Cover image must be smaller than 5 MB.";
  }
  return null;
};

const BlogCoverUpload = ({ file, previewUrl, onSelect, onRemove, error }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFiles = (files) => {
    const next = files?.[0];
    if (next) onSelect(next);
  };

  return (
    <div className="card rounded-3xl bg-base-100 p-5 shadow-md sm:p-6">
      <h2 className="font-barlow text-lg font-bold text-base-content">Cover Image</h2>
      <p className="mt-1 text-xs text-base-content/60">
        JPG, PNG or WebP · up to 5 MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {previewUrl ? (
        <div className="mt-4">
          <div className="overflow-hidden rounded-2xl bg-base-200">
            <img
              src={previewUrl}
              alt={file?.name ? `Cover preview: ${file.name}` : "Cover preview"}
              className="h-44 w-full object-cover"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={pick}
              className="btn btn-sm btn-outline gap-2 rounded-full font-semibold"
              style={{ color: CYAN, borderColor: CYAN }}
            >
              <FontAwesomeIcon icon={faRotate} className="text-xs" />
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="btn btn-sm btn-ghost gap-2 rounded-full font-semibold text-base-content/70"
            >
              <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
              Remove
            </button>
          </div>
          {file?.name && (
            <p className="mt-2 truncate text-xs text-base-content/50">{file.name}</p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`mt-4 grid w-full place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragging ? "bg-base-200" : "border-base-300 hover:bg-base-200/60"
          }`}
          style={dragging ? { borderColor: PINK } : undefined}
        >
          <span
            className="grid h-12 w-12 place-items-center rounded-2xl text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${CYAN}, ${PINK})` }}
          >
            <FontAwesomeIcon icon={faImage} />
          </span>
          <span className="mt-4 block text-sm font-semibold text-base-content">
            Click to upload
          </span>
          <span className="mt-1 block text-xs text-base-content/60">
            or drag and drop your cover here
          </span>
        </button>
      )}

      <FieldError message={error} />
    </div>
  );
};

export default BlogCoverUpload;