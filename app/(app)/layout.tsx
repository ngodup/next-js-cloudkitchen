"use client";
import { Poppins } from "next/font/google";
import CustomModal from "@/components/custom-modal";
import Header from "@/components/layout/header";
import SideMenu from "@/components/layout/sidebar/side-menu";
import { useModalStore } from "@/hooks/useModal";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isModalOpen, modalClose } = useModalStore();
  // const openModal = useModalStore((state) => state.modalOpen);

  return (
    <div className={cn("flex", poppins.className)}>
      <div className="hidden lg:block">
        <SideMenu />
      </div>

      <main className="w-full flex-1 overflow-hidden">
        {/* header for page client */}
        <Header />
        {children}

        {/* Include the modal here */}
        {isModalOpen && (
          <CustomModal>
            <div className="flex justify-between">
              <div>
                <h2>Modal Content</h2>
                <p>This is the content inside the modal.</p>
              </div>
              <XCircle
                className="text-red-700"
                onClick={useModalStore.getState().modalClose}
              />
            </div>
          </CustomModal>
        )}
      </main>
    </div>
  );
}
