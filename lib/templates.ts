import { Decision } from './decision-engine';

export const TEMPLATES: Record<string, Decision> = {
  'job-offer': {
    id: 'job-offer',
    name: 'Job Offer Evaluation',
    description: 'Compare multiple job offers using key criteria',
    category: 'career',
    criteria: [
      { id: '1', name: 'Salary & Benefits', weight: 25 },
      { id: '2', name: 'Work-Life Balance', weight: 20 },
      { id: '3', name: 'Career Growth', weight: 20 },
      { id: '4', name: 'Company Culture', weight: 15 },
      { id: '5', name: 'Location & Commute', weight: 10 },
      { id: '6', name: 'Team & Leadership', weight: 10 },
    ],
    options: [
      { id: 'a', name: 'Offer A' },
      { id: 'b', name: 'Offer B' },
      { id: 'c', name: 'Offer C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
  'laptop-purchase': {
    id: 'laptop-purchase',
    name: 'Laptop Purchase Decision',
    description: 'Evaluate laptops for your specific needs',
    category: 'technology',
    criteria: [
      { id: '1', name: 'Performance', weight: 25 },
      { id: '2', name: 'Price', weight: 20 },
      { id: '3', name: 'Battery Life', weight: 15 },
      { id: '4', name: 'Display Quality', weight: 15 },
      { id: '5', name: 'Build Quality', weight: 15 },
      { id: '6', name: 'Warranty & Support', weight: 10 },
    ],
    options: [
      { id: 'a', name: 'Model A' },
      { id: 'b', name: 'Model B' },
      { id: 'c', name: 'Model C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
  'travel-destination': {
    id: 'travel-destination',
    name: 'Vacation Destination',
    description: 'Choose your next travel destination',
    category: 'travel',
    criteria: [
      { id: '1', name: 'Cost', weight: 20 },
      { id: '2', name: 'Weather', weight: 15 },
      { id: '3', name: 'Attractions', weight: 20 },
      { id: '4', name: 'Food & Dining', weight: 15 },
      { id: '5', name: 'Safety', weight: 15 },
      { id: '6', name: 'Accessibility', weight: 15 },
    ],
    options: [
      { id: 'a', name: 'Destination A' },
      { id: 'b', name: 'Destination B' },
      { id: 'c', name: 'Destination C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
  'purchase-decision': {
    id: 'purchase-decision',
    name: 'Purchase Decision',
    description: 'Evaluate any major purchase or investment',
    category: 'general',
    criteria: [
      { id: '1', name: 'Price & Value', weight: 25 },
      { id: '2', name: 'Quality & Durability', weight: 20 },
      { id: '3', name: 'Features & Functionality', weight: 20 },
      { id: '4', name: 'Brand Reputation', weight: 15 },
      { id: '5', name: 'Warranty & Support', weight: 10 },
      { id: '6', name: 'Personal Preference', weight: 10 },
    ],
    options: [
      { id: 'a', name: 'Option A' },
      { id: 'b', name: 'Option B' },
      { id: 'c', name: 'Option C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
};

export const TEMPLATE_CATEGORIES = [
  {
    name: 'Career',
    icon: 'briefcase',
    templates: ['job-offer'],
    description: 'Job opportunities and career decisions'
  },
  {
    name: 'Technology',
    icon: 'laptop',
    templates: ['laptop-purchase'],
    description: 'Technology purchases and selections'
  },
  {
    name: 'Travel',
    icon: 'map-pin',
    templates: ['travel-destination'],
    description: 'Travel planning and destination choices'
  },
  {
    name: 'General',
    icon: 'shopping-cart',
    templates: ['purchase-decision'],
    description: 'General purchases and investments'
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): Decision[] {
  const categoryData = TEMPLATE_CATEGORIES.find(cat => cat.name.toLowerCase() === category.toLowerCase());
  if (!categoryData) return [];
  
  return categoryData.templates.map(templateId => TEMPLATES[templateId]).filter(Boolean);
}

// Helper function to get all templates as array
export function getAllTemplates(): Decision[] {
  return Object.values(TEMPLATES);
}

// Helper function to search templates
export function searchTemplates(query: string): Decision[] {
  const searchTerm = query.toLowerCase();
  return getAllTemplates().filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.category?.toLowerCase().includes(searchTerm)
  );
}
