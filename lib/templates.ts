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

export const TEMPLATES_DATA: Record<string, Decision> = {
  'home-purchase': {
    id: 'home-purchase',
    name: 'Real Estate Purchase',
    description: 'Evaluate properties based on location, price, and features',
    criteria: [
      { id: '1', name: 'Price & Affordability', weight: 25 },
      { id: '2', name: 'Location Quality', weight: 20 },
      { id: '3', name: 'Property Condition', weight: 20 },
      { id: '4', name: 'Neighborhood Safety', weight: 15 },
      { id: '5', name: 'Schools & Amenities', weight: 10 },
      { id: '6', name: 'Investment Potential', weight: 10 },
    ],
    options: [
      { id: 'a', name: 'Property A' },
      { id: 'b', name: 'Property B' },
      { id: 'c', name: 'Property C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
  'college-choice': {
    id: 'college-choice',
    name: 'College/University Selection',
    description: 'Compare universities for your academic future',
    criteria: [
      { id: '1', name: 'Academic Reputation', weight: 22 },
      { id: '2', name: 'Tuition & Financial Aid', weight: 20 },
      { id: '3', name: 'Location & Campus', weight: 15 },
      { id: '4', name: 'Program Quality', weight: 18 },
      { id: '5', name: 'Student Life', weight: 10 },
      { id: '6', name: 'Career Services', weight: 15 },
    ],
    options: [
      { id: 'a', name: 'University A' },
      { id: 'b', name: 'University B' },
      { id: 'c', name: 'University C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
  'vendor-selection': {
    id: 'vendor-selection',
    name: 'Vendor/Supplier Selection',
    description: 'Choose the best vendor for your business needs',
    criteria: [
      { id: '1', name: 'Price Competitiveness', weight: 20 },
      { id: '2', name: 'Quality Standards', weight: 25 },
      { id: '3', name: 'Delivery Reliability', weight: 20 },
      { id: '4', name: 'Customer Support', weight: 15 },
      { id: '5', name: 'Financial Stability', weight: 10 },
      { id: '6', name: 'Scalability', weight: 10 },
    ],
    options: [
      { id: 'a', name: 'Vendor A' },
      { id: 'b', name: 'Vendor B' },
      { id: 'c', name: 'Vendor C' },
    ],
    scores: [],
    createdAt: new Date(),
  },
};

Object.assign(TEMPLATES, TEMPLATES_DATA);

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
    templates: ['business-investment', 'home-purchase', 'vendor-selection'],
  },
  {
    name: 'Education',
    templates: ['college-choice'],
  },
];
