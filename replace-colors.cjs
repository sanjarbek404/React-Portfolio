const fs = require('fs');

const colorMap = {
  'bg-white': 'bg-[#ffffff]',
  'text-white': 'text-[#ffffff]',
  'border-white/20': 'border-[#ffffff]/20',
  'bg-white/10': 'bg-[#ffffff]/10',
  'text-white/50': 'text-[#ffffff]/50',
  'text-white/90': 'text-[#ffffff]/90',
  'border-white/10': 'border-[#ffffff]/10',
  
  'bg-gray-100': 'bg-[#f3f4f6]',
  'bg-gray-200': 'bg-[#e5e7eb]',
  'bg-gray-300': 'bg-[#d1d5db]',
  'bg-gray-900': 'bg-[#111827]',
  
  'text-gray-400': 'text-[#9ca3af]',
  'text-gray-500': 'text-[#6b7280]',
  'text-gray-600': 'text-[#4b5563]',
  'text-gray-700': 'text-[#374151]',
  'text-gray-800': 'text-[#1f2937]',
  'text-gray-900': 'text-[#111827]',
  
  'border-gray-100': 'border-[#f3f4f6]',
  'border-gray-200': 'border-[#e5e7eb]',
  'border-gray-300': 'border-[#d1d5db]',
  'border-gray-900': 'border-[#111827]',
  
  'text-blue-400': 'text-[#60a5fa]',
  'text-blue-600': 'text-[#2563eb]',
  'bg-blue-50': 'bg-[#eff6ff]',
  'bg-blue-100': 'bg-[#dbeafe]',
  'bg-blue-600': 'bg-[#2563eb]',
};

let content = fs.readFileSync('src/pages/CVBuilder.tsx', 'utf-8');

// Match only inside the Templates section
const startIndex = content.indexOf('const ModernTemplate');
const endIndex = content.indexOf('const ConfirmModal', startIndex);

if (startIndex === -1) {
    console.log("Could not find ModernTemplate");
    process.exit(1);
}

let templatesCode = content.substring(startIndex, endIndex !== -1 ? endIndex : content.length);

for (const [tailwindClass, hexClass] of Object.entries(colorMap)) {
  const regex = new RegExp(`\\b${tailwindClass}\\b`, 'g');
  templatesCode = templatesCode.replace(regex, hexClass);
}

const finalContent = content.substring(0, startIndex) + templatesCode + (endIndex !== -1 ? content.substring(endIndex) : '');

fs.writeFileSync('src/pages/CVBuilder.tsx', finalContent);
console.log('Replaced colors successfully.');
