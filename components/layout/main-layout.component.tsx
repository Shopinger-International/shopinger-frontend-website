import { Poppins } from "next/font/google";
import { useState } from "react";
// types
import type { FC, ReactNode } from "react";

// local components
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--poppins",
});

const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div
      className={`${poppins.variable} ${poppins.className} relative min-h-screen bg-white text-gray-900`}
    >
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
