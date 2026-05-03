import { motion } from 'motion/react';

const NEWS = [
  "SSC CGL 2025 Notification Out",
  "UPSC Civil Services 2025 Registration Open",
  "CBSE Board Result 2025 Declared",
  "SBI PO Admit Card Download",
  "PM Kisan 19th Installment Released",
  "NEET UG 2025 Registration Open",
  "Railway Group D New Vacancy 2025",
  "Ayushman Bharat New Registration"
];

export default function Ticker() {
  const doubledNews = [...NEWS, ...NEWS];

  return (
    <div className="bg-orange-600 text-white py-2 flex items-center overflow-hidden shrink-0 shadow-inner">
      <div className="font-bold flex-shrink-0 bg-white text-orange-700 text-[10px] px-2 py-0.5 rounded ml-4 mr-3 uppercase tracking-tighter shadow-sm z-10">
        Latest Update
      </div>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }}
        className="flex gap-12 whitespace-nowrap"
      >
        {doubledNews.map((item, i) => (
          <span key={i} className="text-[11px] font-semibold flex items-center gap-2">
            • {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
