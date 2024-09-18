import { create } from "zustand";

interface ModalStore {
  isModalOpen: boolean;
  modalOpen: () => void;
  modalClose: () => void;
  modalToggle: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isModalOpen: false,
  modalOpen: () => set({ isModalOpen: true }),
  modalClose: () => set({ isModalOpen: false }),
  modalToggle: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
}));

//Not need in this project as using shadcn dailog modal
