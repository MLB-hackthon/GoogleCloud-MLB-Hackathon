import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'English', flag: '🇺🇸' },
    { code: 'JP', label: '日本語', flag: '🇯🇵' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        <motion.button
          className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg">{languages.find(lang => lang.code === selectedLang)?.flag}</span>
          <span className="font-medium">{selectedLang}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className="flex items-center space-x-3 w-full px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="whitespace-nowrap">{lang.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 