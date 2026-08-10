import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Flame, 
  Zap, 
  Compass, 
  Check, 
  Calculator as CalcIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ChevronRight, 
  Menu, 
  X,
  FileText,
  ThermometerSnowflake,
  ExternalLink,
  Award,
  ShieldCheck,
  FileCheck,
  Eye,
  Sun,
  Moon
} from 'lucide-react';
import { RADIATORS, HERO_RADIATORS, TRANSLATIONS } from './data.ts';
import { Radiator, SectionType } from './types.ts';
import ProductCatalog from './components/ProductCatalog.tsx';
import HeroConvectionCanvas from './components/HeroConvectionCanvas.tsx';
import ModelCombobox from './components/ModelCombobox.tsx';
import { sendContactToTelegram } from './telegram.ts';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  const [activeTab, setActiveTab] = useState<SectionType>('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Create subtle parallax offsets for different visual assets in each section
  const yHeroGlowY = useTransform(scrollY, [0, 800], [0, 150]);
  const yHeroContentY = useTransform(scrollY, [0, 800], [0, -40]);
  const yHeroCircleY = useTransform(scrollY, [0, 800], [0, 100]);

  const yProductsGlowY = useTransform(scrollY, [400, 2000], [-40, 80]);
  const yProductsTitleOffset = useTransform(scrollY, [400, 2000], [-20, 20]);
  const yProductsPromo = useTransform(scrollY, [800, 2400], [40, -40]);

  const yCertificatesBgGlow = useTransform(scrollY, [1200, 2800], [-100, 100]);
  const yCertificatesTitleOffset = useTransform(scrollY, [1200, 2800], [-30, 30]);

  const yAboutBgGlow = useTransform(scrollY, [2000, 3600], [-60, 60]);
  const yAboutTitleOffset = useTransform(scrollY, [2000, 3600], [-30, 30]);
  const yAboutCardsParallax = useTransform(scrollY, [2000, 3600], [20, -20]);

  const yContactsBgGlow = useTransform(scrollY, [2800, 4600], [-80, 80]);
  const yContactsRightCard = useTransform(scrollY, [2800, 4600], [40, -40]);
  
  // Interactive Calculator State
  const [roomArea, setRoomArea] = useState(20);
  const [ceilingHeight, setCeilingHeight] = useState(2.7);
  const [insulation, setInsulation] = useState<'poor' | 'average' | 'excellent'>('average');
  
  // Order Dialog and Form Submission States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    model: '',
    calculatedSections: 14,
    calculatedPower: 2600
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  // References for scrolling support
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];

  // Sync theme selection to document root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Monitor scroll height to make navbar sticky & trigger active section highlights
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Detect active section on scroll
      const scrollPosition = window.scrollY + 160;
      
      const homeOffset = homeRef.current?.offsetTop || 0;
      const productsOffset = productsRef.current?.offsetTop || 0;
      const certificatesOffset = certificatesRef.current?.offsetTop || 0;
      const aboutOffset = aboutRef.current?.offsetTop || 0;

      if (scrollPosition >= aboutOffset) {
        setActiveTab('about');
      } else if (scrollPosition >= certificatesOffset) {
        setActiveTab('certificates');
      } else if (scrollPosition >= productsOffset) {
        setActiveTab('products');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (section: SectionType) => {
    setActiveTab(section);
    setMobileMenuOpen(false);
    
    let targetRef: React.RefObject<HTMLDivElement | null>;
    switch (section) {
      case 'home': targetRef = homeRef; break;
      case 'about': targetRef = aboutRef; break;
      case 'products': targetRef = productsRef; break;
      case 'certificates': targetRef = certificatesRef; break;
      case 'contacts': targetRef = contactsRef; break;
    }

    if (targetRef && targetRef.current) {
      const offsetTop = targetRef.current.offsetTop;
      window.scrollTo({
        top: offsetTop - 90,
        behavior: 'smooth'
      });
    }
  };

  // Slider Auto-play when intro completes
  useEffect(() => {
    if (!isIntroComplete) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_RADIATORS.length);
    }, 8000); // 8 seconds per slide for peaceful viewing
    
    return () => clearInterval(interval);
  }, [isIntroComplete]);

  // Thermic calculations formula based on standard European building standards EN 442
  const maxTempNormalFactor = 40; // Watts per cubic meter standard requirements
  const calcPower = () => {
    let basePower = roomArea * ceilingHeight * maxTempNormalFactor;
    
    // Insulation correction multiplier
    if (insulation === 'poor') basePower *= 1.35;
    if (insulation === 'excellent') basePower *= 0.8;
    
    return Math.round(basePower);
  };

  const calculatedPower = calcPower();
  const calculatedSections = Math.ceil(calculatedPower / 195); // BP-500 offers 195 Watts per section

  const handleLangToggle = () => {
    setLang(prev => (prev === 'RU' ? 'EN' : 'RU'));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_RADIATORS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_RADIATORS.length) % HERO_RADIATORS.length);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      await sendContactToTelegram(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          model: formData.model,
          message: formData.message,
          calculatedPower,
          calculatedSections,
        },
        lang
      );
      setFormData(prev => ({
        ...prev,
        calculatedPower,
        calculatedSections
      }));
      setFormSubmitted(true);
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerOrderModal = (radiatorName?: string) => {
    setFormData(prev => ({
      ...prev,
      // Only pre-fill when a specific product was chosen; leave empty
      // otherwise so the field isn't coupled to the hero carousel.
      model: radiatorName || '',
      calculatedPower,
      calculatedSections
    }));
    setFormSubmitted(false);
    setSubmitError(false);
    setShowOrderModal(true);
  };

  const radiator = HERO_RADIATORS[currentSlide];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 relative grid-overlay selection:bg-neon-lime selection:text-black">
      
      {/* BACKGROUND ABSTRACT GEOMETRICS - Like on Google Gemini & high-tech platforms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft background blurred glowing nebulas */}
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full ambient-glow-green blur-[120px] opacity-75 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] rounded-full ambient-glow-cyan blur-[130px] opacity-60 animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full ambient-glow-indigo blur-[110px] opacity-50 animate-pulse" style={{ animationDuration: '18s' }} />

        {/* Delicate floating architectural line rings & dotted grids */}
        <div className="absolute top-[15%] right-[15%] w-64 h-64 rounded-full border border-white/5 opacity-40 animate-spin" style={{ animationDuration: '60s' }} />
        <div className="absolute top-[15%] right-[15%] w-48 h-48 rounded-full border border-dashed border-neon-lime/10 opacity-30 animate-spin" style={{ animationDuration: '40s' }} />
        
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 rounded-full border border-white/5 opacity-30 animate-spin" style={{ animationDuration: '90s', animationDirection: 'reverse' }} />
        <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full border border-dashed border-[#06b6d4]/15 opacity-40 animate-spin" style={{ animationDuration: '50s' }} />

        {/* Little vector crosses representing precise dimensions */}
        <div className="absolute top-[25%] left-[25%] text-white/10 font-mono text-xs select-none">✕</div>
        <div className="absolute top-[65%] left-[75%] text-white/10 font-mono text-xs select-none">✕</div>
        <div className="absolute bottom-[35%] left-[45%] text-white/10 font-mono text-xs select-none">✕</div>
        <div className="absolute top-[45%] left-[80%] text-white/5 font-mono text-[10px] tracking-widest uppercase select-none">THERMAL OUTPUT COMPLIANT EN-442</div>
        <div className="absolute top-[80%] left-[8%] text-white/5 font-mono text-[10px] tracking-widest uppercase select-none">HYDRAULIC CERTIFIED 3.5 MPA</div>
      </div>

      {/* HEADER / NAVIGATION BAR */}
      <header className={`fixed z-50 transition-all duration-300 ${
        scrolled 
          ? 'top-0 left-0 w-full py-3 sm:py-4 liquid-glass-refractive !border-t-0 !border-x-0 !rounded-none shadow-lg shadow-black/10 md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-[94%] md:max-w-7xl md:!rounded-full md:!border md:!border-white/20 md:px-2' 
          : 'top-0 left-0 w-full py-4 sm:py-6 bg-transparent md:top-6 md:left-1/2 md:-translate-x-1/2 md:w-[94%] md:max-w-7xl md:rounded-full md:border md:border-white/10 md:bg-white/5 md:dark:bg-white/[0.02] md:backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between relative">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-5 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <span className="font-sans font-black text-2xl tracking-widest text-[#002045] dark:text-[#facc15] group-hover:text-[#f59e0b] hover:text-[#f59e0b] transition-colors duration-300">
              NAWAS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime block animate-ping" />
          </div>

          {/* Central Pill-shaped Menu - Perfect matches mockup */}
          <nav className="hidden md:flex md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 items-center p-1 rounded-full transition-all duration-300 liquid-glass-refractive">
            <div className="flex relative" style={{ borderRadius: '65.68435px' }}>
              {(['home', 'products', 'certificates', 'about'] as SectionType[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    id={`nav-btn-${tab}`}
                    onClick={() => scrollToSection(tab)}
                    className={`relative px-5 py-2.5 rounded-full text-xs font-display font-extrabold uppercase tracking-wider transition-colors duration-300 z-10 cursor-pointer ${isActive ? 'active-nav-btn text-white' : 'text-neon-lime opacity-85 hover:opacity-100 hover:text-neon-lime-hover'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-neon-lime rounded-full z-[-1]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t.nav[tab]}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right Controls: Language indicator & Order Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <button 
              id="lang-toggle-btn"
              onClick={handleLangToggle}
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full cursor-pointer liquid-glass-button text-gray-700 dark:text-gray-200"
              title="Toggle Language"
            >
              <Globe className="w-4.5 h-4.5 text-neon-lime" />
            </button>

            {/* Theme Toggle Button */}
            <button 
              id="theme-toggle-btn"
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full cursor-pointer liquid-glass-button text-gray-700 dark:text-gray-200"
              title={theme === 'light' ? 'Тёмная тема' : 'Дневная тема'}
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5 text-neon-lime" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-neon-lime" />
              )}
            </button>

            {/* CTA button, neon styled */}
            <button
              id="header-cta-btn"
              onClick={() => scrollToSection('contacts')}
              className="px-6 py-2.5 bg-neon-lime text-black hover:bg-neon-lime-hover text-xs font-display font-bold uppercase tracking-widest rounded-full shadow-lg shadow-neon-lime/20 transition-all duration-300 cursor-pointer active:scale-95"
            >
              {t.ctaOrder}
            </button>
          </div>

          {/* Responsive Mobile burger toggle button */}
          <div className="md:hidden flex items-center gap-1.5 sm:gap-3">
            <button 
              id="mobile-lang-toggle-btn"
              onClick={handleLangToggle}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 rounded-full cursor-pointer liquid-glass-button text-gray-700 dark:text-gray-200"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neon-lime" />
            </button>
            <button 
              id="mobile-theme-toggle-btn"
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 rounded-full cursor-pointer liquid-glass-button text-gray-700 dark:text-gray-200"
              title={theme === 'light' ? 'Тёмная тема' : 'Дневная тема'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neon-lime" />
              ) : (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-neon-lime" />
              )}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 rounded-full cursor-pointer liquid-glass-button text-gray-700 dark:text-gray-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE COLLAPSIBILITY OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] bg-dark-bg/95 backdrop-blur-xl border-b border-border-dark z-40 p-6 flex flex-col gap-5 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              {(['home', 'products', 'certificates', 'about'] as SectionType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={`text-left py-3 px-4 rounded-xl text-base font-display font-extrabold transition-all ${activeTab === tab ? 'bg-neon-lime/10 text-neon-lime border-l-4 border-neon-lime' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  {t.nav[tab]}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('contacts');
              }}
              className="w-full text-center py-3.5 bg-neon-lime text-black font-display font-bold uppercase tracking-widest rounded-full shadow-lg shadow-neon-lime/20"
            >
              {t.ctaOrder}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO / SLIDER / SECTION - PARALLAX INTRO CONTAINER */}
      <section 
        id="home"
        ref={homeRef} 
        className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-center items-center pt-24 overflow-hidden z-20 px-4"
      >
        {/* Dynamic convection molecules background */}
        <HeroConvectionCanvas theme={theme} />

        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center grow relative">
          
          <div className="w-full relative flex flex-col items-center justify-center min-h-[460px] md:min-h-[580px]">
            {/* HERO PARALLAX INTRO ANIMATING GRAPHIC: GIGANTIC "NAWAS" BACKGROUND BANNER WORD */}
            <motion.div style={{ y: yHeroGlowY }} className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-[2] -translate-y-[125px] transform-gpu will-change-transform">
              <motion.div
                initial={{ y: -250, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 110, 
                  damping: 24, 
                  delay: 0.2
                }}
                onAnimationComplete={() => setIsIntroComplete(true)}
                className="w-full text-center relative overflow-hidden"
              >
                {/* Plain backdrop word NAWAS with theme colors and DM Sans font at max weight */}
                <h1 
                  className="font-dm font-black tracking-widest uppercase leading-none text-center select-none block text-[15vw] md:text-[270px] transition-colors duration-300"
                  style={{ color: theme === 'dark' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(0, 32, 69, 0.15)' }}
                >
                  NAWAS
                </h1>
              </motion.div>
            </motion.div>

            {/* HERO PARALLAX SLIDER INTRO GRAPHIC: ACTIVE RADIATOR IMAGE DOCKED OVER THE GIGANTIC TEXT */}
            <motion.div style={{ y: yHeroContentY }} className="relative z-10 w-full max-w-[310px] sm:max-w-[480px] md:max-w-[750px] lg:max-w-[950px] flex items-center justify-center select-none transform-gpu will-change-transform">
              
              {/* Radiator slide rendering with transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={isIntroComplete ? { x: 100, opacity: 0, scale: 0.95 } : { y: 350, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -100, opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 120, 
                    damping: 22, 
                    duration: 0.55
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Subtle active radiator radial floor glow matching model accents */}
                  <div 
                    className="absolute -inset-4 md:-inset-16 rounded-full blur-[80px] opacity-40 transition-all duration-1000 mix-blend-screen pointer-events-none z-[-1]"
                    style={{ backgroundColor: radiator.accentGlowColor }}
                  />

                  {/* Rendered item */}
                  <img
                    id={`hero-radiator-image-${radiator.id}`}
                    src={radiator.image}
                    alt={radiator.name}
                    className="max-h-[220px] sm:max-h-[300px] md:max-h-[380px] lg:max-h-[440px] w-auto h-auto object-contain filter contrast-105 active:scale-95 transition-all duration-300"
                    style={{
                      filter: `contrast(1.05) drop-shadow(0 18px 25px rgba(0,0,0,0.45)) drop-shadow(0 12px 35px ${
                        theme === 'dark' ? 'rgba(250, 204, 21, 0.7)' : 'rgba(0, 149, 255, 0.65)'
                      })`
                    }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Water mirror subtle reflection below model for a true premium look */}
                  <div className="absolute top-[96%] left-0 right-0 h-[80px] overflow-hidden pointer-events-none opacity-20 blur-[2px] scale-y-[-0.8] hidden md:block select-none">
                    <img
                      src={radiator.image}
                      alt="Mirror reflection"
                      className="w-full h-full object-contain filter grayscale brightness-50"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Left Arrow button - matches premium theme */}
              <button
                id="hero-slider-prev-btn"
                onClick={prevSlide}
                className="hidden sm:flex absolute left-2 md:-left-4 lg:-left-12 p-3 sm:p-4 rounded-full border border-border-dark glassmorphism text-gray-400 hover:text-white hover:border-neon-lime transition-all duration-300 cursor-pointer shadow-lg z-20 items-center justify-center active:scale-90"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Slider Right Arrow button */}
              <button
                id="hero-slider-next-btn"
                onClick={nextSlide}
                className="hidden sm:flex absolute right-2 md:-right-4 lg:-right-12 p-3 sm:p-4 rounded-full border border-border-dark glassmorphism text-gray-400 hover:text-white hover:border-neon-lime transition-all duration-300 cursor-pointer shadow-lg z-20 items-center justify-center active:scale-90"
              >
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

            </motion.div>
          </div>

          {/* BELOW SLIDER CONTENT - Tagline and quick indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-20 text-center max-w-3xl mt-6 md:mt-8 px-4 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3  py-1 mb-3.5 rounded-full border border-border-dark bg-[#0f0f0f]/60 font-mono text-[10px] tracking-widest text-[#06b6d4] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] block animate-pulse" />
              <span>{radiator.modelCode}</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-6 selection:bg-neon-lime selection:text-black">
              {radiator.name}
            </h2>

            {/* CTA action group */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  const targetElement = document.getElementById('products');
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 border-[1.8px] border-border-dark hover:border-neon-lime bg-[#0d0d0d] hover:bg-[#121212] text-xs font-display font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
              >
                <span>{t.hero.specSheet}</span>
                <ChevronRight className="w-4 h-4 text-neon-lime" />
              </button>
              
              <button
                onClick={() => triggerOrderModal(radiator.name)}
                className="px-8 py-3 bg-neon-lime hover:bg-neon-lime-hover text-black text-xs font-display font-extrabold uppercase tracking-widest rounded-full border border-neon-lime shadow-lg shadow-neon-lime/10 transition-all duration-300"
              >
                {t.ctaOrder}
              </button>
            </div>

            {/* Slider Bullet Dots Indicators */}
            <div className="flex items-center gap-3 mt-8 md:mt-12 justify-center">
              <button 
                onClick={prevSlide} 
                className="flex sm:hidden w-8 h-8 rounded-full border border-border-dark bg-white/5 items-center justify-center text-gray-400 active:text-white cursor-pointer"
                title="Previous slide"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-neon-lime" />
              </button>

              <div className="flex items-center gap-2.5 px-1">
                {HERO_RADIATORS.map((rad, idx) => (
                  <button
                    key={rad.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all duration-500 rounded-full cursor-pointer ${idx === currentSlide ? 'w-8 neon-active-dot bg-neon-lime' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    title={`View ${rad.name}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide} 
                className="flex sm:hidden w-8 h-8 rounded-full border border-border-dark bg-white/5 items-center justify-center text-gray-400 active:text-white cursor-pointer"
                title="Next slide"
              >
                <ArrowRight className="w-3.5 h-3.5 text-neon-lime" />
              </button>
            </div>

          </motion.div>

        </div>

        {/* Dynamic Tagline bottom scroll marker */}
        <div className="w-full py-6 mt-8 z-20 text-center select-none pointer-events-none border-t border-dashed border-border-dark max-w-7xl mx-auto px-4">
          <p className="text-xs sm:text-sm font-light text-[#8e8e93] tracking-widest">
            {t.hero.tagline}
          </p>
        </div>
      </section>

      {/* PRODUCTS SECTION AND CALCULATOR */}
      <section 
        id="products"
        ref={productsRef}
        className="py-24 relative overflow-hidden z-20 border-t border-border-dark bg-transparent"
      >
        {/* Parallax background glows */}
        <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none transform-gpu" />
        <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-neon-lime/5 blur-[100px] pointer-events-none transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* PRODUCT CATALOG SECTIONS WITH NEON RED & LIQUID GLASS */}
          <div id="products-catalog-sections" className="mb-24">
            <ProductCatalog lang={lang} onOrder={triggerOrderModal} />
          </div>

          {/* SECTION & OUTPUT INTERACTIVE CALCULATOR */}
          <div className="border border-border-dark bg-white/80 dark:bg-[#090909]/80 backdrop-blur-md rounded-2xl p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-lime/3 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-neon-lime/10 flex items-center justify-center border border-neon-lime/20">
                <CalcIcon className="w-5 h-5 text-neon-lime" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {t.products.calcSectionTitle}
                </h3>
                <p className="text-xs text-gray-400">
                  {lang === 'RU' ? 'Быстрый инженерный калькулятор отопления помещения' : 'Quick engineering calculations for regional residential thermal requirements'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Slider Inputs form */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Room area slider slider input */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-white">{t.products.calcRoomArea}</span>
                    <span className="font-mono text-neon-lime font-bold">{roomArea} м²</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    value={roomArea}
                    onChange={(e) => setRoomArea(Number(e.target.value))}
                    className="w-full h-1.5 bg-border-dark rounded-lg appearance-none cursor-pointer accent-neon-lime"
                    title="Room area"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>10 м²</span>
                    <span>60 м²</span>
                    <span>120 м²</span>
                  </div>
                </div>

                {/* Ceiling height input */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-white">{t.products.calcCeilingHeight}</span>
                    <span className="font-mono text-neon-lime font-bold">{ceilingHeight.toFixed(1)} м</span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="4.0"
                    step="0.1"
                    value={ceilingHeight}
                    onChange={(e) => setCeilingHeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-border-dark rounded-lg appearance-none cursor-pointer accent-neon-lime"
                    title="Ceiling height"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>2.5 м</span>
                    <span>3.2 м</span>
                    <span>4.0 м</span>
                  </div>
                </div>

                {/* Thermal isolation select pill blocks */}
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-white">{t.products.calcWallType}</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setInsulation('poor')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all duration-300 cursor-pointer ${
                        insulation === 'poor'
                          ? 'border-[#ff4d4d] bg-[#ff4d4d]/10 text-[#002045] dark:text-[#ff4d4d] font-bold'
                          : 'border-border-dark bg-gray-50/50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-400 hover:text-[#f59e0b] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between mb-1 transition-colors duration-300">
                        <span>{lang === 'RU' ? 'Слабое' : 'Poor'}</span>
                        {insulation === 'poor' && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4d]" />}
                      </div>
                      <span className="text-[10px] opacity-75">{lang === 'RU' ? 'Старые кирпичные дома, сквозняки' : 'Drafty windows, uninsulated brickwork'}</span>
                    </button>
                    
                    <button
                      onClick={() => setInsulation('average')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all duration-300 cursor-pointer ${
                        insulation === 'average'
                          ? 'border-neon-lime bg-neon-lime/10 text-[#002045] dark:text-neon-lime font-bold'
                          : 'border-border-dark bg-gray-50/50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-400 hover:text-[#f59e0b] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between mb-1 transition-colors duration-300">
                        <span>{lang === 'RU' ? 'Среднее' : 'Average'}</span>
                        {insulation === 'average' && <span className="w-1.5 h-1.5 rounded-full bg-neon-lime" />}
                      </div>
                      <span className="text-[10px] opacity-75">{lang === 'RU' ? 'Типовая застройка, ПВХ-окна' : 'Standard block apartment with double pane PVC'}</span>
                    </button>
                    
                    <button
                      onClick={() => setInsulation('excellent')}
                      className={`p-3 rounded-xl border text-left text-xs transition-all duration-300 cursor-pointer ${
                        insulation === 'excellent'
                          ? 'border-[#06b6d4] bg-[#06b6d4]/10 text-[#002045] dark:text-[#06b6d4] font-bold'
                          : 'border-border-dark bg-gray-50/50 dark:bg-[#0d0d0d] text-gray-500 dark:text-gray-400 hover:text-[#f59e0b] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between mb-1 transition-colors duration-300">
                        <span>{lang === 'RU' ? 'Отличное' : 'Excellent'}</span>
                        {insulation === 'excellent' && <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />}
                      </div>
                      <span className="text-[10px] opacity-75">{lang === 'RU' ? 'Материалы утепления Х, сэндвич' : 'Modern eco-insulation block, triple pane'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Dynamic Calculation Output card */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-gray-50/50 dark:bg-[#0e0e0e] border border-border-dark flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase mb-4 pb-2 border-b border-border-dark/40">
                    {lang === 'RU' ? 'Технический расчёт' : 'System Evaluation Log'}
                  </div>
                  
                  {/* Total power required */}
                  <div className="mb-6">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">
                      {t.products.calcResultPower}
                    </span>
                    <span id="calculated-power-display" className="text-3xl font-display font-black text-white">
                      {calculatedPower} <span className="text-lg text-neon-lime">Вт</span>
                    </span>
                  </div>

                  {/* Sectional and model requirements */}
                  <div className="flex flex-col gap-4">
                    <div className="p-3 bg-white/3 rounded-xl border border-border-dark flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-mono">Bimetal Pro (BP-500)</span>
                        <span className="text-xs text-white">{lang === 'RU' ? 'Секции по 195 Вт каждая' : 'Sections at 195W per code'}</span>
                      </div>
                      <span id="calculated-sections-display" className="text-xl font-display font-bold text-neon-lime">{calculatedSections} секц.</span>
                    </div>

                    <div className="p-3 bg-white/3 rounded-xl border border-border-dark flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-mono">Flat Steel 22 (FS-22)</span>
                        <span className="text-xs text-white">
                          {calculatedPower > 2000 ? (lang === 'RU' ? 'Панель 1200мм × 500мм' : 'Panel size 1200mm × 500mm') : (lang === 'RU' ? 'Панель 1000мм × 500мм' : 'Panel size 1000mm × 500mm')}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-white">1 шт</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => triggerOrderModal()}
                    className="w-full py-3.5 bg-transparent border border-[#002045] hover:border-[#f59e0b] dark:border-neon-lime text-[#002045] dark:text-neon-lime hover:bg-[#f59e0b] dark:hover:bg-neon-lime hover:text-white dark:hover:text-black text-xs font-display font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer"
                  >
                    {t.products.calcBuyBtn}
                  </button>
                </div>
              </div>


            </div>

          </div>

        </div>
      </section>

      {/* CERTIFICATES AND STANDARDS SECTION */}
      <section 
        id="certificates"
        ref={certificatesRef}
        className="py-24 relative overflow-hidden z-20 border-t border-border-dark bg-white/40 dark:bg-[#030303]"
      >
        {/* Ambient Parallax Glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none transform-gpu" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-lime/5 rounded-full blur-[120px] pointer-events-none transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header Description */}
          <motion.div style={{ y: yCertificatesTitleOffset }} className="text-center max-w-3xl mx-auto mb-16 transform-gpu will-change-transform group">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#002045] dark:text-[#facc15] hover:text-[#f59e0b] group-hover:text-[#f59e0b] transition-colors duration-300 cursor-default mb-6 uppercase">
              {lang === 'RU' ? 'Сертификаты и Стандарты' : 'Certificates & Standards'}
            </h2>
            <div className="w-16 h-[2px] bg-[#002045] dark:bg-[#facc15] mx-auto mb-6 group-hover:bg-[#f59e0b] transition-colors duration-300" />
          </motion.div>

          {/* Grid of Certificates - with scroll animation and parallax-feel offsets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'gost',
                code: 'ГОСТ 31311-2005',
                title: lang === 'RU' ? 'Государственный Стандарт Отопительных Приборов' : 'State Standard Compliance',
                subtitle: lang === 'RU' ? 'Обязательная сертификация в РФ' : 'Mandatory Quality Standard',
                desc: lang === 'RU' ? 
                  'Приборы тестируются под пиковым избыточным давлением 30 Атм на разрыв и герметичность.' : 
                  'Tested under tight proof burst pressure of 30 Atm to secure absolute structural integrity.',
                protocol: lang === 'RU' ? 'Протокол № 482-НВ' : 'Protocol Ref. № 482-NV',
                icon: ShieldCheck,
                badgeColor: 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20',
                specs: lang === 'RU' ? 
                  ['Давление при опрессовке: 24 Атм', 'Разрушающее давление: >40 Атм', 'Срок эксплуатации: 20 лет'] :
                  ['Test Seal Pressure: 24 Atm', 'Ultimate Burst Limit: >40 Atm', 'Operation Warranty: 20 Years']
              },
              {
                id: 'ce',
                code: 'CE EN 442-2',
                title: lang === 'RU' ? 'Европейский Теплоэнергетический Сертификат' : 'European Conformity Mark',
                subtitle: lang === 'RU' ? 'Директива Европейского Союза v4' : 'Conformité Européenne Standards',
                desc: lang === 'RU' ? 
                  'Официально гарантирует декларируемый уровень теплоотдачи и полную экологичность сплава.' : 
                  'Guarantees verified thermal output parameters under international standardized criteria.',
                protocol: lang === 'RU' ? 'Декларация ЕС' : 'EC Declaration of Conformity',
                icon: Award,
                badgeColor: 'text-[#CCFF00] bg-[#CCFF00]/10 border-[#CCFF00]/20',
                specs: lang === 'RU' ? 
                  ['Стандарты теплоотдачи: EN 442', 'Сплав радиатора: EN 573-3', 'Прочность соединений: Класс А'] :
                  ['Thermal Performance: EN 442', 'Certified Alloy: EN 573-3', 'Laser Welding Joints: Class A']
              },
              {
                id: 'iso',
                code: 'ISO 9001:2015',
                title: lang === 'RU' ? 'Стандарт Системы Менеджмента Качества' : 'Global Management Standard',
                subtitle: lang === 'RU' ? 'TÜV SÜD международная аттестация' : 'TÜV SÜD Quality Qualification',
                desc: lang === 'RU' ? 
                  'Роботизированные заводы осуществляют сплошной 100%-й оптический и лазерный контроль швов.' : 
                  'Robotic factory assembly lines with automated vision diagnostics of every molecular weld.',
                protocol: lang === 'RU' ? 'Рег. номер 12 100 489' : 'Reg. Holder No. 12 100 489',
                icon: FileCheck,
                badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                specs: lang === 'RU' ? 
                  ['Роботизация сборки: 98.4%', 'Двойная проверка герметичности', 'Прослеживаемость партии: Есть'] :
                  ['Robotics Assembly Rate: 98.4%', 'Double Leakproofing Test', 'Batch Code Traceability: Yes']
              },
              {
                id: 'akzo',
                code: 'AkzoNobel® EcoShield',
                title: lang === 'RU' ? 'Гигиенический Сертификат Покрытия' : 'Ecological Paint Shield',
                subtitle: lang === 'RU' ? 'Экологически чистая полимеризация' : 'VOC-Free Chemical Certificate',
                desc: lang === 'RU' ? 
                  'Защитная немецкая эмаль при нагревании до 110°C не выделяет формальдегиды или свинец.' : 
                  'German environmental coating ensures no emission of heavy metals or toxic formaldehydes.',
                protocol: lang === 'RU' ? 'Сертификат Akzo-2026' : 'Compliance ID Akzo-2026',
                icon: Shield,
                badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                specs: lang === 'RU' ? 
                  ['Эмиссия токсинов: 0.00%', 'Термостойкость краски: 130°C', 'Антикоррозийный барьер: Max'] :
                  ['Emission Rates: 0.00% VOC', 'Thermal Endurance Paint: 130°C', 'Corrosion Shielding: Maximum']
              }
            ].map((cert, index) => {
              const IconComp = cert.icon;
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 50 + index * 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  className={`bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-[15px] p-6 relative overflow-hidden group hover:border-[#002045]/40 transition-all duration-300 flex flex-col justify-between h-full hover:shadow-xl hover:shadow-neon-lime/5 ${
                    index === 0 || index === 1 ? 'border-2 border-border-dark' : 'border border-border-dark'
                  }`}
                >
                  {/* Glowing background hint on card hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-neon-lime/10 rounded-full blur-3xl group-hover:bg-neon-lime/20 transition-all pointer-events-none" />

                  <div>
                    {/* Icon and Code */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#111] border border-border-dark flex items-center justify-center text-neon-lime group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5 text-neon-lime" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${cert.badgeColor}`}>
                        {cert.code}
                      </span>
                    </div>

                    {/* Standard details */}
                    <h3 className="font-display font-black text-md text-gray-900 dark:text-white mb-1 tracking-tight">
                      {cert.title}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono block mb-3 uppercase tracking-wider">
                      {cert.subtitle}
                    </span>
                    <p className="text-gray-550 dark:text-gray-400 font-light text-xs leading-relaxed mb-5">
                      {cert.desc}
                    </p>

                    {/* Specifications List (Technical indicators) */}
                    <div className={`bg-gray-50 dark:bg-[#050505] p-3.5 rounded-[10px] border border-border-dark/60 mb-6 font-mono text-[10px] space-y-2 ${
                      index === 0 || index === 2 ? 'border-2' : ''
                    }`}>
                      <div className="text-[9px] uppercase tracking-wider text-neon-lime/75 font-bold">// {lang === 'RU' ? 'ИСПЫТАНИЯ' : 'METRICS'}</div>
                      {cert.specs.map((specStr, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-1 rounded-full bg-neon-lime shrink-0" />
                          <span>{specStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rounded Action Button */}
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="w-full py-2.5 rounded-full border border-border-dark hover:border-transparent bg-transparent hover:bg-neon-lime hover:text-white dark:hover:text-black font-bold text-xs font-display text-gray-500 dark:text-gray-300 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'RU' ? 'Посмотреть копию' : 'View Replica'}</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section 
        id="about"
        ref={aboutRef}
        className="py-24 relative overflow-hidden z-20 border-t border-border-dark bg-white/40 dark:bg-[#080808]/40"
      >
        {/* Parallax background glows */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-neon-lime/5 blur-[80px] pointer-events-none transform-gpu" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Headline header */}
          <motion.div style={{ y: yAboutTitleOffset }} className="text-center max-w-3xl mx-auto mb-16 transform-gpu will-change-transform group">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#002045] dark:text-[#facc15] hover:text-[#f59e0b] group-hover:text-[#f59e0b] transition-colors duration-300 cursor-default mb-4">
              {t.about.title}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-light">
              {t.about.subtitle}
            </p>
          </motion.div>

          {/* Grid of Benefits - styled EXACTLY like Certificates cards! */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'heat',
                code: 'AERO-FLOW v2.8',
                title: t.about.benefit1Title,
                subtitle: lang === 'RU' ? 'Аэродинамический дизайн' : 'Aerodynamic design',
                desc: t.about.benefit1Desc,
                icon: Flame,
                badgeColor: 'text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20',
                specs: lang === 'RU' ? 
                  ['Коэффициент теплоотдачи: 1.95', 'Скорость нагрева: <8 мин', 'Эффективность конвекции: 98%'] :
                  ['Heat Output Ratio: 1.95', 'Heating Velocity: <8 mins', 'Convective Flow Rate: 98%']
              },
              {
                id: 'safety',
                code: 'PRESSURE-PRO v5.0',
                title: t.about.benefit2Title,
                subtitle: lang === 'RU' ? 'Пневматическая стойкость' : 'Pneumatic Endurance',
                desc: t.about.benefit2Desc,
                icon: Shield,
                badgeColor: 'text-[#ff4d4d] bg-[#ff4d4d]/10 border-[#ff4d4d]/20',
                specs: lang === 'RU' ? 
                  ['Макс. рабочее давление: 50 Атм', 'Запас прочности: 2.5x', 'Сталь труб коллектора: 2.2 мм'] :
                  ['Max Operating Pressure: 50 Atm', 'Structural Safety Margin: 2.5x', 'Steel Well Pipe Bore: 2.2 mm']
              },
              {
                id: 'design',
                code: 'AKZO-SHIELD',
                title: t.about.benefit3Title,
                subtitle: lang === 'RU' ? 'Полимерное покрытие AkzoNobel' : 'Aesthetic polymer protection',
                desc: t.about.benefit3Desc,
                icon: Compass,
                badgeColor: 'text-neon-lime bg-neon-lime/10 border-neon-lime/20',
                specs: lang === 'RU' ? 
                  ['Толщина напыления: 120 мкм', 'УФ-стойкость: Класс 4A (Max)', 'Адгезионная прочность: Gt0'] :
                  ['Coating Layer Width: 120 μm', 'UV Bleaching Resistance: Class 4A', 'Adhesion Strength: Gt0 Grade']
              },
              {
                id: 'lifetime',
                code: 'ANTI-CORR v4',
                title: t.about.benefit4Title,
                subtitle: lang === 'RU' ? 'Химическая пассивация каналов' : 'Chemical protection',
                desc: t.about.benefit4Desc,
                icon: Zap,
                badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                specs: lang === 'RU' ? 
                  ['Защита от электрокоррозии', 'Срок службы: 25+ лет', 'Совместимость с антифризами: 100%'] :
                  ['Electro-Corrosion Protection', 'Expected Service Life: 25+ Years', 'Antifreeze Compatibility: 100%']
              }
            ].map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 50 + index * 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  className="border border-border-dark bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-[15px] p-6 relative overflow-hidden group hover:border-[#002045]/40 transition-all duration-300 flex flex-col justify-between h-full hover:shadow-xl hover:shadow-neon-lime/5"
                >
                  {/* Glowing background hint on card hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-neon-lime/10 rounded-full blur-3xl group-hover:bg-neon-lime/20 transition-all pointer-events-none" />

                  <div>
                    {/* Icon and Code */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#111] border border-border-dark flex items-center justify-center text-neon-lime group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5 text-neon-lime" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${benefit.badgeColor}`}>
                        {benefit.code}
                      </span>
                    </div>

                    {/* Benefit title & description */}
                    <h3 className="font-display font-black text-md text-gray-900 dark:text-white mb-1 tracking-tight group-hover:text-[#002045] transition-colors">
                      {benefit.title}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono block mb-3 uppercase tracking-wider">
                      {benefit.subtitle}
                    </span>
                    <p className="text-gray-550 dark:text-gray-400 font-light text-xs leading-relaxed mb-5">
                      {benefit.desc}
                    </p>

                    {/* Specifications List (Technical indicators) */}
                    <div className="bg-gray-50 dark:bg-[#050505] p-3.5 rounded-[10px] border border-border-dark/60 font-mono text-[10px] space-y-2 mt-auto">
                      <div className="text-[9px] uppercase tracking-wider text-neon-lime/75 font-bold">// {lang === 'RU' ? 'ХАРАКТЕРИСТИКИ' : 'METRICS'}</div>
                      {benefit.specs.map((specStr, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-1 rounded-full bg-neon-lime shrink-0" />
                          <span>{specStr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick numbers banner detailing quality certifications */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8 border border-border-dark bg-white dark:bg-[#0a0a0a] rounded-[15px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-lime/5 via-transparent to-transparent opacity-60 rounded-[15px] pointer-events-none" />
            <div className="text-center md:border-r border-border-dark/50 last:border-0 py-2 sm:py-3">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-neon-lime block mb-1">0.12%</span>
              <span className="text-[9px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 font-mono tracking-wider">Индекс брака за 8 лет</span>
            </div>
            <div className="text-center md:border-r border-border-dark/50 last:border-0 py-2 sm:py-3">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-white block mb-1">ФЗ-117</span>
              <span className="text-[9px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 font-mono tracking-wider">Сертифицировано в РФ</span>
            </div>
            <div className="text-center md:border-r border-border-dark/50 last:border-0 py-2 sm:py-3">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-neon-lime block mb-1">100%</span>
              <span className="text-[9px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 font-mono tracking-wider">Роботизированный шов</span>
            </div>
            <div className="text-center last:border-0 py-2 sm:py-3">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-gray-900 dark:text-white block mb-1">&gt; 150т</span>
              <span className="text-[9px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 font-mono tracking-wider">Уже установлено в РФ</span>
            </div>
          </div>

        </div>
      </section>
      <section 
        id="contacts"
        ref={contactsRef}
        className="py-24 relative overflow-hidden z-20 border-t border-border-dark bg-white/70 dark:bg-[#080808]/70"
      >
        {/* Parallax background glows */}
        <div className="absolute -top-32 left-[10%] w-96 h-96 rounded-full bg-neon-lime/3 blur-[120px] pointer-events-none transform-gpu" />
        <div className="absolute -bottom-32 right-[10%] w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-widest text-[#002045] dark:text-[#facc15] hover:text-[#f59e0b] hover:dark:text-[#f59e0b] group uppercase inline-block relative pb-4 transition-colors duration-300 cursor-default">
              {lang === 'RU' ? 'КОНТАКТЫ' : 'CONTACTS'}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-[#002045] dark:bg-[#facc15] group-hover:bg-[#f59e0b] transition-colors duration-300" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Left box: Feedback form */}
            <motion.div style={{ y: yContactsRightCard }} className="transform-gpu will-change-transform flex flex-col justify-between">
              <div className="glassmorphism p-8 sm:p-10 rounded-[15px] shadow-xl flex-1 flex flex-col justify-between">
                
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                  {/* Name and Phone side-by-side or stacked */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="form-name" className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider">{t.contacts.nameLabel}</label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t.contacts.namePlaceholder}
                        className="w-full bg-[#f8fafc]/90 dark:bg-[#111] border border-gray-200/50 dark:border-border-dark px-4 py-3.5 rounded-[10px] focus:border-[#002045] dark:focus:border-[#CCFF00] outline-none text-sm font-normal text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    {/* Telephone Input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="form-phone" className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider">{t.contacts.phoneLabel}</label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder={t.contacts.phonePlaceholder}
                        className="w-full bg-[#f8fafc]/90 dark:bg-[#111] border border-gray-200/50 dark:border-border-dark px-4 py-3.5 rounded-[10px] focus:border-[#002045] dark:focus:border-[#CCFF00] outline-none text-sm font-normal text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email Input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="form-email" className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider">{t.contacts.emailLabel}</label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder={t.contacts.emailPlaceholder}
                        className="w-full bg-[#f8fafc]/90 dark:bg-[#111] border border-gray-200/50 dark:border-border-dark px-4 py-3.5 rounded-[10px] focus:border-[#002045] dark:focus:border-[#CCFF00] outline-none text-sm font-normal text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    {/* Active Selected Model selector */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="form-model" className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider">
                        {lang === 'RU' ? 'ИНТЕРЕСУЮЩАЯ МОДЕЛЬ' : 'INQUIRED MODEL'}
                      </label>
                      <ModelCombobox
                        id="form-model"
                        value={formData.model}
                        options={RADIATORS.map(r => r.name)}
                        onChange={(val) => setFormData({...formData, model: val})}
                        inputClassName="w-full bg-[#f8fafc]/90 dark:bg-[#111] border border-gray-200/50 dark:border-border-dark px-4 py-3.5 rounded-[10px] focus:border-[#002045] dark:focus:border-[#CCFF00] outline-none text-sm text-gray-900 dark:text-gray-300 font-normal transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="form-msg" className="text-xs font-bold text-gray-400 font-sans uppercase tracking-wider">{t.contacts.messageLabel}</label>
                    <textarea
                      id="form-msg"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.contacts.messagePlaceholder}
                      className="w-full bg-[#f8fafc]/90 dark:bg-[#111] border border-gray-200/50 dark:border-border-dark px-4 py-3.5 rounded-[10px] focus:border-[#002045] dark:focus:border-[#CCFF00] outline-none text-sm font-normal text-gray-900 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Form Submission Confirmation Message */}
                  {formSubmitted && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 rounded-[3px] text-xs flex items-start gap-2.5 font-light"
                    >
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{t.contacts.successMsg}</span>
                    </motion.div>
                  )}

                  {/* Form Submission Error Message */}
                  {submitError && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 rounded-[3px] text-xs flex items-start gap-2.5 font-light"
                    >
                      <span className="shrink-0 mt-0.5">⚠</span>
                      <span>{t.contacts.errorMsg}</span>
                    </motion.div>
                  )}

                  {/* Submission Trigger Button */}
                  <button
                    id="submit-form-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#002045] hover:bg-[#003066] text-white hover:text-white dark:bg-[#facc15] dark:hover:bg-[#eab308] dark:text-black dark:hover:text-black font-display font-bold uppercase text-xs tracking-widest rounded-[10px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                        <span>{t.contacts.sendingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span className="transition-colors duration-300">{t.contacts.submitBtn}</span>
                        <Send className="w-4 h-4 text-white group-hover:text-white/80 dark:text-black dark:group-hover:text-black/80 transition-colors duration-300" />
                      </>
                    )}
                  </button>
                </form>

              </div>
            </motion.div>

            {/* Right panel: Elegant info blocks & Warning/Notice badge */}
            <div className="flex flex-col justify-between gap-6">
              
              {/* Info Block - Address */}
              <div id="contact-info-address" className="glassmorphism rounded-[15px] p-6 flex items-center gap-5 group transition-all duration-300">
                <div className="w-14 h-14 bg-[#002045] dark:bg-[#facc15]/10 group-hover:bg-[#f59e0b] dark:group-hover:bg-[#facc15] rounded-[3px] flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-[#ffffff] dark:text-[#facc15] group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                    {t.contacts.addressTitle}
                  </span>
                  <span className="text-sm font-bold text-[#002045] dark:text-white group-hover:text-[#f59e0b] group-hover:dark:text-[#facc15] block transition-colors duration-300">Andijan, Uzbekistan</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mt-0.5">{t.contacts.addressVal}</span>
                </div>
              </div>

              {/* Info Block - Phone */}
              <div id="contact-info-phone" className="glassmorphism rounded-[15px] p-6 flex items-center gap-5 group transition-all duration-300">
                <div className="w-14 h-14 bg-[#002045] dark:bg-[#facc15]/10 group-hover:bg-[#f59e0b] dark:group-hover:bg-[#facc15] rounded-[3px] flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300">
                  <Phone className="w-6 h-6 text-[#ffffff] dark:text-[#facc15] group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                    {t.contacts.phoneTitle}
                  </span>
                  <span className="text-sm font-bold text-[#002045] dark:text-white group-hover:text-[#f59e0b] group-hover:dark:text-[#facc15] block font-mono transition-colors duration-300">+998 50 071 48 02</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mt-0.5">{lang === 'RU' ? 'Пн-Пт: 09:00 - 18:00' : 'Mon-Fri: 09:00 - 18:00'}</span>
                </div>
              </div>

              {/* Info Block - Email */}
              <div id="contact-info-email" className="glassmorphism rounded-[15px] p-6 flex items-center gap-5 group transition-all duration-300">
                <div className="w-14 h-14 bg-[#002045] dark:bg-[#facc15]/10 group-hover:bg-[#f59e0b] dark:group-hover:bg-[#facc15] rounded-[3px] flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300">
                  <Mail className="w-6 h-6 text-[#ffffff] dark:text-[#facc15] group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block mb-1">
                    {t.contacts.emailTitle}
                  </span>
                  <span className="text-sm font-bold text-[#002045] dark:text-white group-hover:text-[#f59e0b] group-hover:dark:text-[#facc15] block font-mono transition-colors duration-300">sales@nawas.uz</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mt-0.5 font-mono">technical: support@nawas.uz</span>
                </div>  
              </div>

              {/* Notice quote warning block */}
              <div className="border-l-4 border-amber-500 bg-amber-500/5 p-5 pl-6 rounded-r-[3px] mt-2">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {lang === 'RU' 
                    ? '«Наши инженеры готовы ответить на любые технические вопросы и подготовить тепловые расчеты в течение 24 часов.»' 
                    : '"Our engineering department is designated to resolve complex thermal integration inquiries and send certified calculations within 24 hours."'}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border-dark bg-[#030303] py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border-dark/50">
            
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <span className="font-display font-black text-xl tracking-tight text-neon-lime">{t.brand}</span>
              <span className="w-1 w-1 bg-neon-lime rounded-full" />
              <span className="text-xs text-gray-400 font-mono pl-2 border-l border-border-dark uppercase tracking-widest">{lang === 'RU' ? 'Надёжное тепло' : 'Reliable Warmth'}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#8e8e93]">
              {(['home', 'products', 'certificates', 'about'] as SectionType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className="hover:text-neon-lime uppercase tracking-wider transition-colors font-mono"
                >
                  {t.nav[tab]}
                </button>
              ))}
            </div>

          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8e8e93] font-light">
            <p>© {new Date().getFullYear()} {t.brand}. {lang === 'RU' ? 'Все права защищены.' : 'All rights reserved.'}</p>
            <p className="flex items-center gap-2.5">
              <span>{lang === 'RU' ? 'Разработано в соответствии с концепцией ИИ-студии' : 'Crafted complying with Gemini UI/UX concepts.'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-lime block animate-pulse" />
            </p>
          </div>

        </div>
      </footer>

      {/* ORDER POPUP / PROPOSAL MODAL OVERLAY */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="absolute inset-0 bg-[#000000]/85 backdrop-blur-md"
            />

            {/* Modal layout */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="glassmorphism w-full max-w-2xl rounded-[3px] p-5 sm:p-8 relative overflow-y-auto max-h-[90vh] text-left shadow-2xl z-10 scrollbar-none"
            >
              
              <button 
                onClick={() => setShowOrderModal(false)}
                className="absolute top-4 right-4 p-2 rounded-[3px] border border-border-dark bg-[#0f0f0f] text-gray-400 hover:text-white transition-colors"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-dark">
                <div className="w-11 h-11 bg-neon-lime/10 border border-neon-lime/20 rounded-[3px] flex items-center justify-center text-neon-lime shrink-0">
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                    {lang === 'RU' ? 'Спецификация заказа' : 'Custom Radiator Selection Proposal'}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">NAWAS ORDER SYSTEM v2.4</span>
                </div>
              </div>

              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div className="p-4 bg-white/2 border border-border-dark rounded-[3px] flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">ВЫБРАННЫЙ ПРИБОР</span>
                      <span className="text-md font-bold text-white font-display block uppercase">{formData.model}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block">РАСЧЁТНАЯ МОЩНОСТЬ</span>
                      <span className="text-[#06b6d4] font-bold font-mono">{calculatedPower} Ватт</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="modal-name" className="text-[10px] text-gray-400 font-mono uppercase">{t.contacts.nameLabel}</label>
                      <input
                        id="modal-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-[#0f0f0f] border border-border-dark p-3 rounded-[3px] focus:border-neon-lime text-xs text-white"
                        placeholder="Александр"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="modal-phone" className="text-[10px] text-gray-400 font-mono uppercase">{t.contacts.phoneLabel}</label>
                      <input
                        id="modal-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="bg-[#0f0f0f] border border-border-dark p-3 rounded-[3px] focus:border-neon-lime text-xs text-white"
                        placeholder="+7 (9xx) xxx-xx-xx"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="modal-email" className="text-[10px] text-gray-400 font-mono uppercase">{t.contacts.emailLabel}</label>
                    <input
                      id="modal-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-[#0f0f0f] border border-border-dark p-3 rounded-[3px] focus:border-neon-lime text-xs text-white"
                      placeholder="alex@gmail.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="modal-message" className="text-[10px] text-gray-400 font-mono uppercase">{t.contacts.messageLabel}</label>
                    <textarea
                      id="modal-message"
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-[#0f0f0f] border border-border-dark p-3 rounded-[3px] focus:border-neon-lime text-xs text-white"
                      placeholder={lang === 'RU' ? 'Адрес доставки или комментарии...' : 'Delivery address...'}
                    />
                  </div>

                  <button
                    id="modal-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 bg-neon-lime hover:bg-neon-lime-hover text-black font-display font-black text-xs uppercase tracking-widest rounded-[3px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>{t.contacts.sendingBtn}</span>
                      </>
                    ) : (
                      t.ctaOrder
                    )}
                  </button>
                  {submitError && (
                    <div className="mt-2 p-3 border border-red-500/20 bg-red-500/5 text-red-400 rounded-[3px] text-[11px] flex items-start gap-2 font-light">
                      <span className="shrink-0">⚠</span>
                      <span>{t.contacts.errorMsg}</span>
                    </div>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8 flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-[3px] flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  
                  <h4 className="font-display font-black text-2xl text-white mb-2 uppercase tracking-tight">
                    {lang === 'RU' ? 'Заказ успешно оформлен' : 'Order Document Prepared'}
                  </h4>
                  
                  <p className="text-sm text-gray-400 font-light max-w-md mx-auto mb-6">
                    {lang === 'RU' ? 'Инженерная спецификация направлена вам на почту. Мы уже готовим предложение!' : 'Custom proposal specification report sent successfully! Let\'s secure details shortly.'}
                  </p>
 
                  <div className="w-full bg-[#0a0a0a] border border-border-dark/60 rounded-[3px] p-5 mb-8 text-left font-mono text-[11px] leading-relaxed select-all">
                    <div className="text-neon-lime uppercase font-bold tracking-wider mb-2">📄 PROPOSAL CERTIFICATE:</div>
                    <div className="grid grid-cols-2 gap-y-1 text-gray-400">
                      <div>Name:</div><div className="text-white">{formData.name}</div>
                      <div>Phone:</div><div className="text-white">{formData.phone}</div>
                      <div>Inquired Model:</div><div className="text-white">{formData.model}</div>
                      <div>Thermal Output:</div><div className="text-[#06b6d4] font-bold">{calculatedPower} Watts</div>
                      <div>Ideal Sections:</div><div className="text-white">{calculatedSections} sec. (Bimetal)</div>
                      <div>Reference ID:</div><div className="text-white">NW-{Math.round(Math.random() * 900000 + 100000)}</div>
                    </div>
                  </div>
 
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="px-8 py-3 bg-neon-lime text-black font-display font-bold text-xs uppercase tracking-wider rounded-[3px] transition-all hover:bg-neon-lime-hover cursor-pointer"
                  >
                    {lang === 'RU' ? 'Закрыть окно' : 'Close Details'}
                  </button>
                </motion.div>
              )}

            </motion.div>
          </div>
        )}

        {/* Certificate Replica Modal Window */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-[#0b0b0b] border border-border-dark rounded-[3px] p-5 sm:p-8 overflow-y-auto max-h-[90vh] z-10 text-left scrollbar-none"
            >
              {/* Close Button tag */}
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-[3px] border border-border-dark bg-[#111] hover:border-white/30 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row gap-6 items-stretch pt-2 sm:pt-0">
                {/* Visual Official Certificate mockup */}
                <div className="w-full max-w-[280px] mx-auto md:max-w-none md:w-[45%] bg-white text-black p-5 rounded-[3px] relative shadow-2xl flex flex-col justify-between overflow-hidden aspect-[1/1.41] select-none font-sans border border-gray-100 shrink-0">
                  {/* Security lines / guilloche background frame */}
                  <div className="absolute inset-2 border-4 border-double border-[#ccd5ae]/30 pointer-events-none" />
                  <div className="absolute inset-3 border border-gray-200 pointer-events-none" />

                  {/* Header / Seal emblem in certificate */}
                  <div className="text-center relative">
                    <div className="w-8 h-8 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-1 text-red-800 font-bold opacity-85">
                      <ShieldCheck className="w-4 h-4 text-red-800" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-gray-800 font-serif">NAWAS RESEARCH LABS</div>
                    <div className="text-[5px] text-gray-400 font-mono tracking-widest block uppercase">GLOBAL CONFORMITY REPORT</div>
                  </div>

                  {/* Content details */}
                  <div className="my-1.5 text-center">
                    <span className="text-[5px] text-gray-400 block font-mono leading-none">REGISTRATION CODE</span>
                    <h4 className="text-[10px] font-mono font-bold text-gray-900 tracking-wide border-b border-gray-200 pb-0.5 mb-1 bg-yellow-50/50 leading-tight">
                      {selectedCertificate.code}
                    </h4>

                    <div className="text-[7px] text-gray-600 italic font-serif leading-tight px-1 text-center">
                      We hereby certify that NAWAS radiator core structural assemblies comply with target metrics listed below.
                    </div>
                  </div>

                  {/* Technical indicators box */}
                  <div className="bg-gray-50/70 p-1.5 rounded-lg border border-gray-100 font-mono text-[5px] space-y-0.5 text-gray-600">
                    <div className="font-bold text-gray-900 text-[6px] border-b border-gray-200 pb-0.5 mb-0.5 flex items-center justify-between">
                      <span>✓ TECHNICAL COMPLIANCE:</span>
                      <span className="text-green-600 font-black">PASSED</span>
                    </div>
                    {selectedCertificate.specs.map((spec: string, i: number) => (
                      <div key={i} className="flex justify-between leading-none">
                        <span>{spec.split(':')[0]}</span>
                        <span className="font-bold text-gray-900">{spec.split(':')[1] || '✔'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom stamp and authority */}
                  <div className="flex justify-between items-end mt-2">
                    {/* Hologram sticker */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-400 to-yellow-400 opacity-80 flex items-center justify-center shadow-inner relative border border-white/40">
                      <Award className="w-3.5 h-3.5 text-white/95" />
                    </div>

                    {/* Stamp and signature */}
                    <div className="text-right border-t border-gray-300 pt-1 w-20 relative select-none">
                      {/* Round red stamp hologram overlay */}
                      <div className="absolute -top-5 -right-1.5 w-10 h-10 rounded-full border border-dashed border-red-800/30 flex items-center justify-center font-bold text-[5px] text-red-800/40 uppercase transform -rotate-12 pointer-events-none leading-none text-center">
                        PASSED<br/>LAB REPORT
                      </div>
                      <div className="font-serif italic text-[10px] leading-tight text-gray-700">NAW Eng. Group</div>
                      <div className="text-[5px] text-gray-400 leading-none">Senior Certifier</div>
                    </div>
                  </div>
                </div>

                {/* Technical Side Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <span className="text-[9px] uppercase text-neon-lime font-mono tracking-widest block mb-1">
                      // {selectedCertificate.code}
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase mb-4 leading-tight">
                      {selectedCertificate.title}
                    </h3>
                    
                    <div className="border border-border-dark/60 bg-[#050505] p-4 rounded-[3px] mb-4">
                      <span className="text-[9px] text-gray-500 font-mono block mb-1.5 uppercase select-none tracking-widest">// REGULATORY REPORT</span>
                      <p className="text-xs text-gray-300 font-light leading-relaxed">
                        {selectedCertificate.desc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
                        <Check className="w-3.5 h-3.5 text-neon-lime shrink-0" />
                        <span>{lang === 'RU' ? 'Официально аттестованная копия документа' : 'Authorized official standard evaluation report.'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
                        <Check className="w-3.5 h-3.5 text-neon-lime shrink-0" />
                        <span>{selectedCertificate.protocol}</span>
                      </div>
                    </div>
                  </div>

                  {/* PDF download and share CTAs */}
                  <div className="space-y-2.5 mt-6">
                    <button
                      onClick={() => {
                        // Safe high-end replica download simulation
                        const content = `NAWAS OFFICIAL COMPLIANCE CERTIFICATE\n\nReference Code: ${selectedCertificate.code}\nTitle: ${selectedCertificate.title}\nReport: ${selectedCertificate.protocol}\nSpecs:\n${selectedCertificate.specs.join('\n')}\n\nConformity Status: APPROVED & VERIFIED`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `NAWAS_Certificate_${selectedCertificate.id.toUpperCase()}.txt`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full py-3 bg-neon-lime text-black font-display font-bold text-xs uppercase tracking-wider rounded-[3px] hover:bg-neon-lime-hover transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neon-lime/10"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{lang === 'RU' ? 'Скачать копию документа' : 'Download Document Copy'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="w-full py-3 bg-transparent border border-border-dark text-gray-400 hover:text-white hover:border-white/30 text-xs font-display uppercase tracking-widest rounded-[3px] transition-colors cursor-pointer"
                    >
                      {lang === 'RU' ? 'Вернуться назад' : 'Return Back'}
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
