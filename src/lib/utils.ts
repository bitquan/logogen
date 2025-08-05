export const fonts = [
  { name: 'Inter', category: 'sans-serif', weight: [400, 600, 700] },
  { name: 'Roboto', category: 'sans-serif', weight: [400, 500, 700] },
  { name: 'Montserrat', category: 'sans-serif', weight: [400, 600, 700] },
  { name: 'Poppins', category: 'sans-serif', weight: [400, 600, 700] },
  { name: 'Nunito', category: 'sans-serif', weight: [400, 600, 700] },
  { name: 'Playfair Display', category: 'serif', weight: [400, 600, 700] },
  { name: 'Cormorant Garamond', category: 'serif', weight: [400, 600, 700] },
  { name: 'Dancing Script', category: 'script', weight: [400, 600, 700] }
];

export const colorPalettes = [
  {
    name: 'Classic',
    colors: ['#000000', '#ffffff', '#374151', '#f3f4f6']
  },
  {
    name: 'Ocean',
    colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985']
  },
  {
    name: 'Forest',
    colors: ['#059669', '#047857', '#065f46', '#064e3b']
  },
  {
    name: 'Sunset',
    colors: ['#f59e0b', '#d97706', '#b45309', '#92400e']
  },
  {
    name: 'Purple',
    colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']
  },
  {
    name: 'Rose',
    colors: ['#f43f5e', '#e11d48', '#be123c', '#9f1239']
  }
];

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}