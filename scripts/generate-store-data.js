const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const STORES_PATH = path.join(process.cwd(), 'content/stores');
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/generated-stores.json');

function parseStoreFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(source);
  return { ...data, content };
}

function generateStoreData() {
  if (!fs.existsSync(STORES_PATH)) {
    console.error('content/stores directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(STORES_PATH);

  const stores = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(STORES_PATH, file);
      return parseStoreFile(filePath);
    })
    .filter((store) => store.metadata?.status === 'active')
    .sort((a, b) => a.name.localeCompare(b.name));

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stores, null, 2));
  console.log(`Generated ${stores.length} stores to ${OUTPUT_PATH}`);
}

generateStoreData();
