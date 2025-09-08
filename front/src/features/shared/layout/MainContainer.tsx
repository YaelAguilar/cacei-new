import React from "react";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar";

type Props = {
  children?: React.ReactNode;
};

const MainContainer: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="relative flex gap-2 px-4 md:px-1 md:pr-2 ">
        <Toaster position="top-right" reverseOrder={true} toastOptions={{ duration: 5000 }} />
        
        {/* Sidebar dinámico */}
        <Sidebar />
      
        <main className="flex-1 rounded-2xl">
          <Header />
          <div className="px-0 rounded-2xl h-screen-6em overflow-y-auto bg-[#F7F8FA] mt-6 custom-scrollbar over-hidden"> 
            <div className="px-4 max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MainContainer;