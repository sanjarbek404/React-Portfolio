import fs from 'fs';

let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

// Replace Typewriter with simple text
content = content.replace(/<Typewriter\s+text=\{([^}]+)\}\s*(?:delay=\{[^}]+\}\s*)?\/>/g, '{$1}');
content = content.replace(/<Typewriter\s+text="([^"]+)"\s*(?:delay=\{[^}]+\}\s*)?\/>/g, '$1');

// Remove original Typewriter component wrapper
content = content.replace(/const Typewriter = \(\{ text, delay = 0, className = "" \}: \{ text: string, delay\?: number, className\?: string \}\) => \{[\s\S]*?return \([\s\S]*?<\/motion\.span>\n  \);\n\};\n\n/g, '');

fs.writeFileSync('src/pages/Portfolio.tsx', content);
console.log('Done!');
