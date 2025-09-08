import React from "react";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  title: string;
  subtitle: string;
  onClose: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Props> = ({ title, subtitle, onClose, children }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg max-w-xl mx-auto w-9/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          <button onClick={onClose} className="text-blue-500 hover:bg-blue-100 rounded-full p-3 cursor-pointer">
            <AiOutlineClose size={17} className="text-blue-500" />
          </button>
        </div>
        <div>
            <p className="text-md font-light">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
