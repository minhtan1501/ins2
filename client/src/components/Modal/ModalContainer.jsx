import React from "react";

export default function ModalContainer({
  children,
  onClose,
  visible,
  className,
}) {
  const handleClick = (e) => {
    if (!onClose) return;
    if (e.target.id === "modal-container") onClose && onClose();
  };
  if (!visible) return null;
  return (
    <div
      id="modal-container"
      onClick={handleClick}
      className={`
     fixed inset-0 dark:bg-white m-0 z-50
     dark:bg-opacity-50 bg-opacity-50 bg-primary 
     backdrop-blur-sm flex items-center justify-center min-h-screen ${className}`}
    >
      {children}
    </div>
  );
}
