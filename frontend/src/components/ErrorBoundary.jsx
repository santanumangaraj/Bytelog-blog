import React from "react";
import { useRouteError, Link } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("ErrorBoundary caught an uncaught render error:", error);

  // Extract status and message depending on the type of error thrown
  const status = error?.status || 500;
  const statusText = error?.statusText || "Internal Server Error";
  const errorMessage = error?.data || error?.message || "An unexpected error occurred. Please try again later.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12 transition-colors duration-300">
      <div className="max-w-lg w-full bg-base-100 rounded-3xl shadow-2xl p-8 md:p-12 border border-base-300 text-center relative overflow-hidden">
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-error to-warning"></div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center text-error animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
            </svg>
          </div>
        </div>

        {/* Error Status Code */}
        <h1 className="text-6xl font-black text-error mb-2 tracking-tight">{status}</h1>
        
        {/* Status Text Header */}
        <h2 className="text-3xl font-extrabold text-base-content mb-4">{statusText}</h2>
        
        {/* Error Details */}
        <div className="bg-base-200 rounded-xl p-4 mb-8 max-h-40 overflow-y-auto text-left border border-base-300">
          <p className="text-sm font-mono text-base-content/80 break-words whitespace-pre-wrap">
            {errorMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn btn-primary px-8 shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5  9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Back to Home
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-outline px-8 transition-all duration-200 w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Retry Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
