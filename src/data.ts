import { Radiator } from './types.ts';

// Radiator Assets (pointing to we generated images)
export const RADIATORS: Radiator[] = [
  {
    id: 'flat-panel',
    name: 'NAWAS Flat Steel 22',
    modelCode: 'Model FS-22-500',
    subtitle: 'Стальной панельный радиатор высокого давления',
    description: 'Изогнутые тонкие грани холодного проката стали с двойной конвекционной рубашкой обеспечивают сочетание высокой теплоотдачи и безупречной минималистичной эстетики.',
    image: '/assets/images/radiator_panel_1779615710019.png',
    accentGlowColor: 'rgba(250, 204, 21, 0.25)',
    price: 'от 7,800 ₽',
    category: 'panel',
    specs: {
      output: '1850 Вт',
      pressure: '10 бар (испытательное 15 бар)',
      material: 'Сталь холодного проката (1.25 мм)',
      dimensions: '500 × 1000 × 100 мм',
      warranty: '10 лет',
      weightSection: '22.4 кг (моноблок)'
    }
  },
  {
    id: 'sectional-bimetal',
    name: 'NAWAS Bimetal Pro',
    modelCode: 'Model BP-500/10',
    subtitle: 'Биметаллический секционный радиатор',
    description: 'Стальной внутренний коллектор полностью изолирует теплоноситель от алюминиевого корпуса. Выдерживает колоссальные гидроудары центрального отопления.',
    image: '/assets/images/radiator_classic_1779615731280.png',
    accentGlowColor: 'rgba(34, 197, 94, 0.25)',
    price: '920 ₽ / секция',
    category: 'bimetal',
    specs: {
      output: '195 Вт на секцию',
      pressure: '35 бар (испытательное 52 бар)',
      material: 'Стальной сердечник + Алюминиевый сплав',
      dimensions: '560 × 80 × 90 мм (одна секция)',
      warranty: '15 лет',
      weightSection: '1.75 кг / секция'
    }
  },
  {
    id: 'designer-anthracite',
    name: 'NAWAS Anthracite Slim',
    modelCode: 'Model AS-600',
    subtitle: 'Дизайнерский радиатор монолитного типа',
    description: 'Анодированный алюминий с глубоким матовым покрытием цвета "Антрацит". Создан для дизайнерских ремонтов и установки перед панорамным остеклением.',
    image: '/assets/images/radiator_design_1779615754574.png',
    accentGlowColor: 'rgba(6, 182, 212, 0.25)',
    price: 'от 14,500 ₽',
    category: 'aluminum',
    specs: {
      output: '2100 Вт',
      pressure: '16 бар (испытательное 24 бар)',
      material: 'Авиационный алюминий с защитным нано-покрытием',
      dimensions: '600 × 1200 × 80 мм',
      warranty: '20 лет',
      weightSection: '16.8 кг (моноблок)'
    }
  },
  {
    id: 'smart-boiler',
    name: 'NAWAS GazEco 24',
    modelCode: 'Model GE-250',
    subtitle: 'Энергоэффективный газовый котёл',
    description: 'Двухконтурный настенный котёл высокой мощности со встроенной интуитивной системой погодной компенсации и возможностью Wi-Fi управления.',
    image: '/assets/images/radiator_design_1779615754574.png',
    accentGlowColor: 'rgba(239, 68, 68, 0.25)',
    price: 'от 48,000 ₽',
    category: 'boiler',
    specs: {
      output: '24 кВт',
      pressure: '3 бар (испытательное 5 бар)',
      material: 'Медный первичный теплообменник + Сверхпрочные эко-материалы',
      dimensions: '720 × 400 × 340 мм',
      warranty: '5 лет',
      weightSection: '32.5 кг (моноблок)'
    }
  },
  {
    id: 'bimetal-force',
    name: 'NAWAS Bimetal Force 350',
    modelCode: 'Model BF-350/8',
    subtitle: 'Суперпрочный низкопрофильный прибор',
    description: 'Уменьшенное межосевое расстояние радиатора идеально подходит для остеклений с низким уровнем подоконного пространства.',
    image: '/assets/images/radiator_classic_1779615731280.png',
    accentGlowColor: 'rgba(234, 179, 8, 0.25)',
    price: '890 ₽ / секция',
    category: 'bimetal',
    specs: {
      output: '142 Вт на секцию',
      pressure: '35 бар (испытательное 52/60 бар)',
      material: 'Стальной бесшовный сердечник + Алюминий',
      dimensions: '410 × 80 × 80 мм (одна секция)',
      warranty: '15 лет',
      weightSection: '1.40 кг / секция'
    }
  },
  {
    id: 'alum-neo',
    name: 'NAWAS Alum Neo 500',
    modelCode: 'Model AN-500/10',
    subtitle: 'Усиленный литой отопительный радиатор',
    description: 'Аэродинамическая форма внутренних ребер увеличивает естественный конвективный поток воздуха в комнате на 22% для сверхбыстрого обогрева.',
    image: '/assets/images/radiator_classic_1779615731280.png',
    accentGlowColor: 'rgba(16, 185, 129, 0.25)',
    price: '820 ₽ / секция',
    category: 'aluminum',
    specs: {
      output: '185 Вт на секцию',
      pressure: '20 бар (испытательное 30 бар)',
      material: 'Премиальный алюминиевый сплав высокой очистки',
      dimensions: '570 × 80 × 85 мм (одна секция)',
      warranty: '10 лет',
      weightSection: '1.25 кг / секция'
    }
  },
  {
    id: 'steel-compact',
    name: 'NAWAS Steel Compact 21',
    modelCode: 'Model SC-21-300',
    subtitle: 'Многопрофильный радиатор малой высоты',
    description: 'Встроенный высокоточный терморегулирующий клапан позволяет плавно контролировать тепловую мощность для идеального микроклимата.',
    image: '/assets/images/radiator_panel_1779615710019.png',
    accentGlowColor: 'rgba(99, 102, 241, 0.25)',
    price: 'от 6,900 ₽',
    category: 'panel',
    specs: {
      output: '1240 Вт',
      pressure: '10 бар (испытательное 15 бар)',
      material: 'Холоднокатаная сталь марки DC01 (1.20 мм)',
      dimensions: '300 × 1100 × 75 мм',
      warranty: '10 лет',
      weightSection: '14.5 кг (моноблок)'
    }
  },
  {
    id: 'boiler-volt',
    name: 'NAWAS Volt Smart 12',
    modelCode: 'Model VS-120',
    subtitle: 'Электрический микропроцессорный котёл',
    description: 'Компактный электрический котёл с бесшумным симисторным переключением фаз, встроенным расширительным баком и циркуляционным насосом.',
    image: '/assets/images/radiator_design_1779615754574.png',
    accentGlowColor: 'rgba(124, 58, 237, 0.25)',
    price: 'от 34,500 ₽',
    category: 'boiler',
    specs: {
      output: '12 кВт',
      pressure: '3 бар (испытательное 4.5 бар)',
      material: 'Нержавеющая сталь марки AISI 304, литой блок',
      dimensions: '620 × 380 × 220 мм',
      warranty: '5 лет',
      weightSection: '21.0 кг (моноблок)'
    }
  }
];

export const TRANSLATIONS = {
  RU: {
    brand: 'NAWAS',
    nav: {
      home: 'Главный',
      about: 'О нас',
      products: 'Продукция',
      certificates: 'Сертификаты',
      contacts: 'Контакты'
    },
    ctaOrder: 'Заказать',
    hero: {
      tagline: 'Надёжное тепло. Современные радиаторы для вашего дома.',
      exploreBtn: 'Исследовать модели',
      calcBtn: 'Калькулятор секций',
      specSheet: 'Технические характеристики'
    },
    about: {
      title: 'Превосходство в каждой детали',
      subtitle: 'Приводя премиальные инженерные решения в ваше жилое пространство',
      benefit1Title: 'Исключительная теплоотдача',
      benefit1Desc: 'Специальный сплав металлов и аэродинамическая конструкция обеспечивают ускоренный прогрев и мягкое излучение.',
      benefit2Title: 'Абсолютная безопасность',
      benefit2Desc: 'Испытания под повышенным давлением гарантируют устойчивость радиаторов к перепадам до 50 атмосфер.',
      benefit3Title: 'Премиальный дизайн',
      benefit3Desc: 'Матовое порошковое напыление AkzoNobel защищает поверхность от выцветания, царапин и термических деформаций.',
      benefit4Title: 'Долговечность на века',
      benefit4Desc: 'Многоуровневое антикоррозийное покрытие внутренних каналов дает уверенность в эксплуатации более 25 лет.'
    },
    products: {
      title: 'Наш ассортимент',
      subtitle: 'Выберите оптимальный радиатор для вашего климата и интерьера',
      selectModel: 'Выберите модель:',
      calcSectionTitle: 'Рассчитать оптимальную мощность',
      calcRoomArea: 'Площадь комнаты (м²)',
      calcCeilingHeight: 'Высота потолков (м)',
      calcWallType: 'Степень утепления',
      calcWallType1: 'Слабое (однослойные стены, старые окна)',
      calcWallType2: 'Нормальное (стандартный кирпич, двойной стеклопакет)',
      calcWallType3: 'Отличное (современный сэндвич, энергоэффективные окна)',
      calcResultPower: 'Необходимая тепловая мощность:',
      calcResultSections: 'Рекомендуемое кол-во секций (Bimetal):',
      calcResultPanels: 'Рекомендуемый размер панельного типа:',
      calcBuyBtn: 'Получить расчёт на почту'
    },
    contacts: {
      title: 'Связаться с нами',
      subtitle: 'Наш эксперт ответит на ваши вопросы и подберет идеальное отопление',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Иван Иванов',
      phoneLabel: 'Номер телефона',
      phonePlaceholder: '+7 (999) 000-00-00',
      emailLabel: 'Электронная почта',
      emailPlaceholder: 'info@nawas.ru',
      messageLabel: 'Ваш запрос или вопросы по объекту',
      messagePlaceholder: 'Нужен подбор радиаторов для загородного дома 150 кв.м...',
      submitBtn: 'Заказать консультацию',
      successMsg: 'Ваша заявка успешно отправлена! Наш инженер свяжется с вами в течение 15 минут.',
      addressTitle: 'Шоурум и офис',
      addressVal: 'Москва, Кутузовский проспект, 36а, стр. 2',
      phoneTitle: 'Горячая линия',
      emailTitle: 'Отдел продаж'
    }
  },
  EN: {
    brand: 'NAWAS',
    nav: {
      home: 'Main',
      about: 'About',
      products: 'Products',
      certificates: 'Certificates',
      contacts: 'Contacts'
    },
    ctaOrder: 'Order Now',
    hero: {
      tagline: 'Reliable warmth. Modern radiators for your home.',
      exploreBtn: 'Explore Models',
      calcBtn: 'Section Calculator',
      specSheet: 'Technical Specifications'
    },
    about: {
      title: 'Excellence in every detail',
      subtitle: 'Bringing premium engineering solutions into your living space',
      benefit1Title: 'Exceptional Heat Output',
      benefit1Desc: 'Special metal alloys and aerodynamic design provide rapid warming and soft comfortable radiation.',
      benefit2Title: 'Absolute Safety First',
      benefit2Desc: 'Enhanced high-pressure testing ensures outstanding resistance of radiators to utility system pressure spikes up to 50 atm.',
      benefit3Title: 'Premium Modern Design',
      benefit3Desc: 'Premium AkzoNobel powder coating guards the surfaces from fading, scratches and thermal expansion damage.',
      benefit4Title: 'Built to Last Decades',
      benefit4Desc: 'Multi-stage anti-corrosion inner lining gives unmatched durability and confidence for 25+ years of active use.'
    },
    products: {
      title: 'Our Product Linup',
      subtitle: 'Indulge in premium architectural comfort matching your unique interiors',
      selectModel: 'Select preferred model:',
      calcSectionTitle: 'Calculate Recommended Power',
      calcRoomArea: 'Room Area (sq.m)',
      calcCeilingHeight: 'Ceiling Height (m)',
      calcWallType: 'Thermal Insulation Level',
      calcWallType1: 'Poor (single line brick, old drafty windows)',
      calcWallType2: 'Average (standard brick, double glazing)',
      calcWallType3: 'Excellent (high-density insulated walls, triple pane)',
      calcResultPower: 'Recommended Total Heat Output:',
      calcResultSections: 'Recommended Bimetal Sections:',
      calcResultPanels: 'Recommended Panel Dimensions:',
      calcBuyBtn: 'Request Customized Proposal'
    },
    contacts: {
      title: 'Get In Touch',
      subtitle: 'Our heating engineer will call back to guide you through custom designs',
      nameLabel: 'Your name',
      namePlaceholder: 'John Doe',
      phoneLabel: 'Phone number',
      phonePlaceholder: '+1 (555) 000-0000',
      emailLabel: 'Email address',
      emailPlaceholder: 'john@nawas.com',
      messageLabel: 'Your message or project scope',
      messagePlaceholder: 'Need matching heating units for a 150sqm countryside villa...',
      submitBtn: 'Get Professional Consultation',
      successMsg: 'Inquiry received successfuly! Our expert engineer will call you in 15 minutes.',
      addressTitle: 'Headquarters & Showroom',
      addressVal: '36a Kutuzovsky Avenue, Bldg 2, Moscow',
      phoneTitle: 'Support Line',
      emailTitle: 'Corporate Desk'
    }
  }
};
