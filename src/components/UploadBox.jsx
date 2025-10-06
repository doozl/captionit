import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const UploadBox = ({ onImageUpload, preview, onGenerate }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div
        animate={{
          y: preview ? 0 : [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: preview ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-3xl shadow-xl p-8 transition-all ${
            isDragging
              ? "border-4 border-indigo-500 scale-105"
              : "border-4 border-transparent"
          }`}
        >
          {!preview ? (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full p-6 mb-6"
                >
                  <Upload className="w-12 h-12 text-indigo-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Upload your image
                </h3>
                <p className="text-gray-500">Drag & drop or click to browse</p>
              </div>
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-gray-100"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGenerate}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                Generate Captions ✨
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadBox;
