export interface LogoTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  config: {
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    iconType?: string;
    layout: 'horizontal' | 'vertical' | 'stacked';
  };
}

export const logoTemplates: LogoTemplate[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimalist',
    category: 'general',
    preview: '/templates/modern-minimal.svg',
    config: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      fontFamily: 'Inter',
      fontSize: 32,
      layout: 'horizontal'
    }
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    category: 'tech',
    preview: '/templates/tech-startup.svg',
    config: {
      backgroundColor: '#1e293b',
      textColor: '#00d4ff',
      fontFamily: 'Roboto',
      fontSize: 28,
      iconType: 'circuit',
      layout: 'horizontal'
    }
  },
  {
    id: 'restaurant-food',
    name: 'Restaurant & Food',
    category: 'food',
    preview: '/templates/restaurant-food.svg',
    config: {
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      fontFamily: 'Dancing Script',
      fontSize: 36,
      iconType: 'chef-hat',
      layout: 'stacked'
    }
  },
  {
    id: 'fitness-health',
    name: 'Fitness & Health',
    category: 'fitness',
    preview: '/templates/fitness-health.svg',
    config: {
      backgroundColor: '#dcfce7',
      textColor: '#166534',
      fontFamily: 'Montserrat',
      fontSize: 30,
      iconType: 'dumbbell',
      layout: 'horizontal'
    }
  },
  {
    id: 'creative-design',
    name: 'Creative & Design',
    category: 'creative',
    preview: '/templates/creative-design.svg',
    config: {
      backgroundColor: '#fdf4ff',
      textColor: '#7c3aed',
      fontFamily: 'Nunito',
      fontSize: 32,
      iconType: 'palette',
      layout: 'vertical'
    }
  },
  {
    id: 'corporate-professional',
    name: 'Corporate & Professional',
    category: 'business',
    preview: '/templates/corporate-professional.svg',
    config: {
      backgroundColor: '#f8fafc',
      textColor: '#334155',
      fontFamily: 'Playfair Display',
      fontSize: 28,
      iconType: 'briefcase',
      layout: 'horizontal'
    }
  },
  {
    id: 'ecommerce-retail',
    name: 'E-commerce & Retail',
    category: 'retail',
    preview: '/templates/ecommerce-retail.svg',
    config: {
      backgroundColor: '#fff7ed',
      textColor: '#ea580c',
      fontFamily: 'Poppins',
      fontSize: 30,
      iconType: 'shopping-bag',
      layout: 'stacked'
    }
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    category: 'beauty',
    preview: '/templates/beauty-wellness.svg',
    config: {
      backgroundColor: '#fdf2f8',
      textColor: '#be185d',
      fontFamily: 'Cormorant Garamond',
      fontSize: 34,
      iconType: 'flower',
      layout: 'vertical'
    }
  }
];

export const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'general', name: 'General' },
  { id: 'tech', name: 'Technology' },
  { id: 'food', name: 'Food & Restaurant' },
  { id: 'fitness', name: 'Fitness & Health' },
  { id: 'creative', name: 'Creative & Design' },
  { id: 'business', name: 'Business & Corporate' },
  { id: 'retail', name: 'Retail & E-commerce' },
  { id: 'beauty', name: 'Beauty & Wellness' }
];