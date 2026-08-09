import React from "react";

const FieldError = ({ message }) =>
  message ? (
    <p role="alert" className="mt-2 text-xs font-medium text-error">
      {message}
    </p>
  ) : null;

export default FieldError;