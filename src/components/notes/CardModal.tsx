"use client";

import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  open: boolean;
  color: string;
  onClose: () => void;  
  children: React.ReactNode;
  headerAction?: React.ReactNode; // 👈 tambahan
};

const Modal = ({ open, onClose, children, color }: ModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="border rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
            style={{
              backgroundColor: color === "default" ? "var(--background)" : `var(--note-${color})`,
              borderColor: color === "default" ? "var(--border)" : `var(--note-${color})`,
            }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >       
            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
