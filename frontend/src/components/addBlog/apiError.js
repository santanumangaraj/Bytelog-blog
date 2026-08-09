/* Maps an axios error to a user-friendly message. Never surfaces stack traces. */
export const getApiErrorMessage = (err) => {
  if (err?.response) {
    const { status, data } = err.response;
    const serverMessage =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : null;

    switch (status) {
      case 400:
      case 422:
        return serverMessage || "Some fields are invalid. Please review and try again.";
      case 401:
        return "Your session has expired. Please sign in again to publish.";
      case 403:
        return "You don't have permission to create a blog.";
      case 413:
        return "Your cover image is too large. Please upload a smaller file.";
      case 500:
      default:
        return status >= 500
          ? "Something went wrong on our side. Please try again in a moment."
          : serverMessage || "Request failed. Please try again.";
    }
  }

  if (err?.request) {
    return "Network error — check your connection and try again.";
  }

  return "Unexpected error. Please try again.";
};

/* Pulls per-field messages out of a 400 response when the backend sends them. */
export const getFieldErrors = (err) => {
  const data = err?.response?.data;
  const raw = data?.errors ?? data?.error?.errors;
  if (!raw) return {};
  if (Array.isArray(raw)) {
    return raw.reduce((acc, item) => {
      const field = item?.field ?? item?.path ?? item?.param;
      if (field && !acc[field]) acc[field] = item?.message ?? "Invalid value.";
      return acc;
    }, {});
  }
  if (typeof raw === "object") {
    return Object.entries(raw).reduce((acc, [k, v]) => {
      acc[k] = Array.isArray(v) ? v[0] : String(v);
      return acc;
    }, {});
  }
  return {};
};