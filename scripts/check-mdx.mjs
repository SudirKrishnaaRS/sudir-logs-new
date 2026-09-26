// Fast pre-build check for lesson MDX files.
// Usage: node scripts/check-mdx.mjs [files...]   (defaults to every .mdx under docs/)
// Checks: MDX compiles, only known components are used, relative .mdx links exist,
// and no em/en dashes slipped in.
import {compile} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import fs from 'node:fs';
import path from 'node:path';

const KNOWN = new Set([
  // src/components/lesson
  'LessonHeader', 'Callout', 'Flow', 'Step', 'Quiz', 'Note', 'AskBox', 'Terms', 'Term',
  'CheatGrid', 'CheatCard', 'JoinVenn', 'UrlAnatomy', 'UrlLegend', 'LoopDiagram',
  'FileTree', 'FileNote', 'Checklist', 'Check', 'Badge', 'TrackProgress',
  // plain HTML that MDX renders fine
  'details', 'summary', 'code', 'br', 'small', 'strong', 'em', 'kbd', 'sup', 'sub',
]);

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : [];
  });
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : walk('docs');
let failed = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const problems = [];

  try {
    await compile(src, {remarkPlugins: [remarkGfm]});
  } catch (e) {
    problems.push(`MDX compile error: ${e.message}`);
  }

  const body = src.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  for (const [, name] of body.matchAll(/<([A-Za-z][A-Za-z0-9]*)[\s/>]/g)) {
    if (!KNOWN.has(name)) problems.push(`unknown component or tag <${name}>`);
  }

  for (const [, link] of src.matchAll(/\]\((\.{1,2}\/[^)#\s]+\.mdx)(#[^)]*)?\)/g)) {
    if (!fs.existsSync(path.resolve(path.dirname(file), link))) problems.push(`broken link ${link}`);
  }

  src.split('\n').forEach((line, i) => {
    if (/[–—]/.test(line)) problems.push(`line ${i + 1}: em/en dash found, use a hyphen`);
  });

  if (problems.length) {
    failed++;
    console.log(`\n✗ ${file}`);
    [...new Set(problems)].forEach((p) => console.log(`  - ${p}`));
  } else {
    console.log(`✓ ${file}`);
  }
}

process.exit(failed ? 1 : 0);
