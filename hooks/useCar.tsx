import { create } from "zustand";
import { useAppSelector } from "@/store";
import { selectCartProducts } from "@/store/cart/cart-slice";

interface CartStore {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useCart = () => {
  const cartProducts = useAppSelector(selectCartProducts);
  const { isOpen, openCart, closeCart, toggleCart } = useCartStore();

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    itemCount: cartProducts.length,
  };
};
