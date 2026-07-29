import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Shield, 
  Layers, 
  Ruler, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Info,
  BadgeAlert,
  CalendarCheck2
} from 'lucide-react';
import { Radiator } from '../types.ts';
import { RADIATORS } from '../data.ts';

interface ProductCatalogProps {
  lang: 'RU' | 'EN';
  onOrder: (modelName: string) => void;
}

type CategoryType = 'all' | 'bimetal' | 'aluminum' | 'panel' | 'boiler';

export default function ProductCatalog({ lang, onOrder }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRadiator, setSelectedRadiator] = useState<Radiator | null>(null);

  const itemsPerPage = 8; // With an 84-item catalog this gives ~11 pages

  // Labels based on selected language
  const translations = {
    RU: {
      sectionTitle: 'ПРОДУКЦИЯ',
      headline: 'Наша продукция',
      sub: 'Выберите оптимальный радиатор для вашего климата и интерьера',
      categories: {
        all: 'Все',
        bimetal: 'Биметалл',
        aluminum: 'Алюминий',
        panel: 'Панель',
        boiler: 'Котёл'
      },
      showSpecs: 'Характеристики',
      order: 'Заказать',
      close: 'Закрыть',
      techTitle: 'Технические характеристики',
      certified: 'Все значения сертифицированы по европейским стандартам EN 442.',
      output: 'Теплоотдача',
      pressure: 'Давление',
      material: 'Материал',
      dimensions: 'Размеры',
      warranty: 'Гарантия',
      weight: 'Вес секции/блока',
      page: 'Свяжитесь с нами для детального подбора'
    },
    EN: {
      sectionTitle: 'PRODUCTS',
      headline: 'Our Products',
      sub: 'Choose the state-of-the-art heating option that matches your interior styles',
      categories: {
        all: 'All',
        bimetal: 'Bimetal',
        aluminum: 'Aluminum',
        panel: 'Panel',
        boiler: 'Boiler'
      },
      showSpecs: 'Specifications',
      order: 'Order Now',
      close: 'Close',
      techTitle: 'Technical Specifications',
      certified: 'All mechanical outputs are certified according to global testing protocols.',
      output: 'Heat Output',
      pressure: 'Working Pressure',
      material: 'Material Body',
      dimensions: 'Dimensions',
      warranty: 'Warranty',
      weight: 'Unit weight',
      page: 'Contact us for a tailored architectural calculation'
    }
  };

  const t = translations[lang];

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Filter products by selected category
  const filteredRadiators = RADIATORS.filter(radiator => {
    if (selectedCategory === 'all') return true;
    return radiator.category === selectedCategory;
  });

  // Paginated subset
  const totalItems = filteredRadiators.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRadiators = filteredRadiators.slice(startIndex, startIndex + itemsPerPage);

  // Generate pagination pages
  const renderPaginationRange = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Return 1, 2, ... totalPages as requested by mockup format "1 2 ... 4"
      pages.push(1);
      pages.push(2);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };


  return (
    <div className="w-full">
      {/* 1. SECTION HEADLINE AND HERO */}
      <div className="text-center max-w-3xl mx-auto mb-10 px-4 group">
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#002045] dark:text-[#facc15] hover:text-[#f59e0b] group-hover:text-[#f59e0b] mb-4 pb-2 uppercase select-none leading-tight transition-colors duration-300 cursor-default">
          {t.headline}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 font-light text-center max-w-lg mx-auto leading-relaxed">
          {t.sub}
        </p>
      </div>

      {/* 2. OVER-CARDS LIQUID GLASS NAVIGATION TAB */}
      <div className="w-full flex justify-start sm:justify-center mb-10 pt-0 overflow-x-auto no-scrollbar px-4">
        <div className="liquid-glass p-1.5 rounded-[29px] flex flex-row items-center gap-1 sm:gap-1.5 mx-auto shrink-0">
          {(['all', 'bimetal', 'aluminum', 'panel', 'boiler'] as CategoryType[]).map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={isActive 
                  ? "bg-[#CCFF00] text-[#ffffff] dark:text-[#000000] font-extrabold px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm rounded-[30px] transition-all duration-300 shadow-md shadow-[#CCFF00]/15 whitespace-nowrap shrink-0" 
                  : "text-[#CCFF00] hover:bg-black/5 dark:hover:bg-white/5 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-[30px] transition-all duration-300 whitespace-nowrap shrink-0"
                }
              >
                {t.categories[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRODUCT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <AnimatePresence mode="popLayout">
          {paginatedRadiators.map((radiator) => (
            <motion.div
              layout
              key={radiator.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedRadiator(radiator)}
              className="group border border-border-dark bg-white/70 dark:bg-[#0a0a0a]/90 backdrop-blur-md hover:border-gray-400 dark:hover:border-zinc-700 rounded-[15px] p-6 relative overflow-hidden transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_25px_50px_rgba(180,185,195,0.6)] dark:hover:shadow-[0_25px_50px_rgba(180,180,180,0.25)] flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-mono tracking-widest font-black text-white/55 rounded-[3px] uppercase">
                {radiator.modelCode}
              </div>

              {/* Product Visual Center */}
              <div className="h-64 flex items-center justify-center p-4 relative">
                {/* Visual subtle colorful background aura */}
                <div 
                  className="absolute w-44 h-44 rounded-full blur-[65px] opacity-15 group-hover:opacity-30 transition-all duration-700 pointer-events-none"
                  style={{ backgroundColor: radiator.accentGlowColor }}
                />
                <img
                  src={radiator.image}
                  alt={radiator.name}
                  className="max-h-[190px] w-auto h-auto object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_16px_32px_rgba(255,255,255,0.06)] group-hover:drop-shadow-[0_22px_45px_rgba(215,220,230,0.7)] group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Info & CTA Footer */}
              <div className="border-t border-border-dark pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-2xl text-white group-hover:text-[#CCFF00] transition-colors">
                      {radiator.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-light mt-1 line-clamp-2">
                      {lang === 'RU' ? radiator.subtitle : radiator.subtitle.replace(/Стальной|Биметаллический|Анодированный/, '')}
                    </p>
                  </div>
                </div>

                {/* Grid spec sheets expand triggers */}
                <div className="mt-5 flex flex-col xs:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRadiator(radiator);
                    }}
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-[30px] border border-border-dark hover:border-[#CCFF00]/40 text-xs font-display font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-4 h-4 text-[#CCFF00]" />
                    <span>{t.showSpecs}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder(radiator.name);
                    }}
                    className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-[30px] bg-[#CCFF00] text-[#ffffff] dark:text-[#000000] hover:bg-neon-lime-hover text-xs font-display font-black uppercase tracking-widest transition-all shadow-md shadow-[#CCFF00]/10 flex items-center justify-center"
                  >
                    {t.order}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. CHRYSTAL POLISHED PAGINATION BOTTOM BAR (MATCHING MOCKUP 2) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 bg-transparent select-none">
          {/* Arrow Left */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`p-2 transition-all duration-300 text-2xl font-black ${currentPage === 1 ? 'text-gray-700 cursor-not-allowed' : 'text-[#CCFF00] hover:scale-110'}`}
          >
            ‹
          </button>

          <div className="flex items-center gap-3">
            {renderPaginationRange().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="text-gray-500 font-bold px-2">
                    ...
                  </span>
                );
              }

              const isPageActive = currentPage === page;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-11 h-11 flex items-center justify-center text-sm font-bold transition-all duration-300 rounded-[25px] cursor-pointer ${
                    isPageActive 
                      ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/15' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Arrow Right */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, Math.min(totalPages, prev + 1)))}
            disabled={currentPage === totalPages}
            className={`p-2 transition-all duration-300 text-2xl font-black ${currentPage === totalPages ? 'text-gray-700 cursor-not-allowed' : 'text-[#CCFF00] hover:scale-110'}`}
          >
            ›
          </button>
        </div>
      )}

      {/* 5. MODAL SHOWING CHARACTERISTICS & TECH SPECS */}
      <AnimatePresence>
        {selectedRadiator && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark/light glass blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRadiator(null)}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-lg border border-border-dark rounded-[3px] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedRadiator(null)}
                className="absolute top-4 right-4 p-2 rounded-[3px] border border-border-dark bg-white dark:bg-[#0f0f0f] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-6">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#CCFF00] tracking-widest font-black block mb-1">
                    {selectedRadiator.modelCode}
                  </span>
                  <h3 className="font-display font-black text-3xl text-white">
                    {selectedRadiator.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-light mt-1">
                    {selectedRadiator.subtitle}
                  </p>
                </div>

                {/* Visual representation Inside specs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-y border-border-dark py-6">
                  <div className="md:col-span-4 flex items-center justify-center max-h-[160px]">
                    <img
                      src={selectedRadiator.image}
                      alt={selectedRadiator.name}
                      className="max-h-[150px] w-auto h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="md:col-span-8 text-sm text-gray-400 font-light leading-relaxed">
                    {selectedRadiator.description}
                  </p>
                </div>

                {/* Specs Sheet Grid */}
                <div>
                  <h4 className="font-display font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#CCFF00]" />
                    <span>{t.techTitle}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.output}</span>
                      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {selectedRadiator.specs.output}
                      </span>
                    </div>

                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.pressure}</span>
                      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        {selectedRadiator.specs.pressure}
                      </span>
                    </div>

                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.material}</span>
                      <span className="text-sm font-semibold text-white">{selectedRadiator.specs.material}</span>
                    </div>

                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.dimensions}</span>
                      <span className="text-sm font-semibold text-white">{selectedRadiator.specs.dimensions}</span>
                    </div>

                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.warranty}</span>
                      <span className="text-sm font-semibold text-green-400">{selectedRadiator.specs.warranty}</span>
                    </div>

                    <div className="flex flex-col border-b border-border-dark pb-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono mb-0.5">{t.weight}</span>
                      <span className="text-sm font-semibold text-white">{selectedRadiator.specs.weightSection || 'Н/Д'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-dark flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-gray-400 italic">
                    * {t.certified}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedRadiator(null)}
                      className="px-5 py-2.5 rounded-[3px] border border-border-dark hover:border-white/20 text-xs font-display font-bold uppercase text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {t.close}
                    </button>
                    <button
                      onClick={() => {
                        onOrder(selectedRadiator.name);
                        setSelectedRadiator(null);
                      }}
                      className="px-6 py-2.5 bg-[#CCFF00] text-black hover:bg-[#d6ff38] text-xs font-display font-black uppercase tracking-wider rounded-[3px] transition-colors shadow-lg shadow-[#CCFF00]/15 cursor-pointer"
                    >
                      {t.order}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
