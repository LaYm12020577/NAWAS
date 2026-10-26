export interface RadiatorSpecs {
  output: string;      // thermal power in watts or per section
  pressure: string;    // max test pressure or working pressure
  material: string;    // material description
  dimensions: string;  // height, width, depth details
  weightSection?: string; // weight details
}

export interface Radiator {
  id: string;
  name: string;
  modelCode: string;
  subtitle: string;
  description: string;
  image: string;
  accentGlowColor: string; // Tailwind glow or custom hex shadow
  specs: RadiatorSpecs;
  price: string;
  category: 'bimetal' | 'aluminum' | 'panel' | 'boiler' | 'fancoil' | 'pump' | 'other'; 
}

export type SectionType = 'home' | 'about' | 'products' | 'certificates' | 'contacts';
