import { Decision } from './decision-engine';

export const TEMPLATES: Record<string, Decision> = {
  'job-offer': {
    id: 'job-offer',
    name: 'Job Offer Evaluation',
    description: 'Compare multiple job offers using key criteria',
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
  'business-investment': {
    id: 'business-investment',
    name: 'Business Investment',
    description: 'Evaluate investment opportunities',
    criteria: [
      { id: '1', name: 'ROI Potential', weight: 30 },
      { id: '2', name: 'Risk Level', weight: 20 },
      { id: '3', name: 'Market Size', weight: 15 },
      { id: '4', name: 'Management Team', weight: 15 },
      { id: '5', name: 'Scalability', weight: 20 },
    ],
    options: [
      { id: 'a', name: 'Opportunity A' },
      { id: 'b', name: 'Opportunity B' },
      { id: 'c', name: 'Opportunity C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
};

export const TEMPLATE_CATEGORIES = [
  {
    name: 'Career',
    templates: ['job-offer'],
  },
  {
    name: 'Technology',
    templates: ['laptop-purchase'],
  },
  {
    name: 'Travel',
    templates: ['travel-destination'],
  },
  {
    name: 'Business',
    templates: ['business-investment'],
  },
];
