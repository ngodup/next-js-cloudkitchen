import { useModalStore } from "@/hooks/useModal";
import React, { ReactNode, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";

type CustomModalProps = {
  children: ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({ children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null); // Root type to manage the portal
  const isOpen = useModalStore((state) => state.isModalOpen); // Get modal open state from Zustand
  const closeModal = useModalStore((state) => state.modalClose); // Get the close function from Zustand

  useEffect(() => {
    if (!modalRootRef.current) {
      // Create the modal root element only once
      modalRootRef.current = document.createElement("div");
      document.body.appendChild(modalRootRef.current);
      rootRef.current = createRoot(modalRootRef.current);
    }

    if (!isOpen || !rootRef.current) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target === modalRef.current) {
        closeModal();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const modalContent = (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        <div
          className="bg-white shadow-lg p-5 rounded w-full h-full sm:w-1/2 sm:h-1/2 overflow-y-auto"
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    );

    rootRef.current.render(modalContent);

    modalRef.current?.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      modalRef.current?.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
      rootRef.current?.render(null); // Clean up rendered content
    };
  }, [isOpen, closeModal, children]);

  useEffect(() => {
    return () => {
      // Clean up the modal root when the component unmounts
      if (modalRootRef.current) {
        document.body.removeChild(modalRootRef.current);
        modalRootRef.current = null;
        rootRef.current = null;
      }
    };
  }, []);

  return null;
};

export default CustomModal;
