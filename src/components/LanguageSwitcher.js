import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', label: 'ENGLISH', flag: '🇺🇸' },
    { code: 'JP', label: '日本語', flag: '🇯🇵' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === selectedLang);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <motion.button
          className="language-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg">{selectedLanguage?.flag}</span>
          <span className="language-label">{selectedLanguage?.label}</span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="language-menu"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className="language-option"
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="language-option-label">{lang.label}</span>
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