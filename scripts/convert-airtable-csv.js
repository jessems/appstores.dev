#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read and parse CSV
const csvPath = process.argv[2] || "/Users/jmscdch/Downloads/Store Hackers-Grid view.csv";
const outputDir = path.join(__dirname, "../content/stores");

function parseCSV(content) {
  const lines = content.split("\n");
  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      rows.push(row);
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferCategory(row) {
  const name = (row.app_marketplace_name || row.ecosystem_host || "").toLowerCase();
  const vertical = (row.market_vertical || "").toLowerCase();

  if (name.includes("play store") || name.includes("app store") || name.includes("microsoft store")) {
    return "official";
  }
  if (name.includes("samsung") || name.includes("huawei") || name.includes("amazon")) {
    return "manufacturer";
  }
  if (vertical.includes("gaming") || name.includes("steam") || name.includes("epic")) {
    return "gaming";
  }
  if (row.business_model_b2b_b2c === "B2B" || row.business_model_b2b_b2c === "B2B (Enterprise)") {
    return "enterprise";
  }
  if (name.includes("f-droid") || name.includes("open")) {
    return "open-source";
  }
  return "third-party";
}

function inferPlatforms(row) {
  const name = (row.app_marketplace_name || row.ecosystem_host || "").toLowerCase();
  const product = (row.primary_product || "").toLowerCase();
  const langs = (row.programming_language || "").toLowerCase();
  const platforms = [];

  if (name.includes("android") || product.includes("android") || name.includes("play store")) {
    platforms.push("android");
  }
  if (name.includes("ios") || name.includes("apple") || product.includes("ios") || langs.includes("swift")) {
    platforms.push("ios");
  }
  if (name.includes("mac") || product.includes("mac")) {
    platforms.push("macos");
  }
  if (name.includes("windows") || name.includes("microsoft store")) {
    platforms.push("windows");
  }
  if (name.includes("chrome") || name.includes("firefox") || name.includes("browser")) {
    platforms.push("web");
  }
  if (name.includes("linux")) {
    platforms.push("linux");
  }

  // Default to web/cross-platform for SaaS marketplaces
  if (platforms.length === 0) {
    platforms.push("web");
  }

  return platforms;
}

function inferPricingModels(row) {
  const pricingModel = (row.pricing_model || "").toLowerCase();
  const models = [];

  if (pricingModel.includes("free")) {
    models.push("free");
  }
  if (pricingModel.includes("subscription") || pricingModel.includes("monthly") || pricingModel.includes("yearly")) {
    models.push("subscription");
  }
  if (pricingModel.includes("usage")) {
    models.push("freemium");
  }
  if (pricingModel.includes("license") || pricingModel.includes("one-time")) {
    models.push("one-time");
  }
  if (pricingModel.includes("in-app")) {
    models.push("freemium");
  }

  if (models.length === 0) {
    models.push("free");
    models.push("paid");
  }

  return [...new Set(models)];
}

function convertRowToMDX(row, existingSlugs) {
  // Determine the name
  let name = row.app_marketplace_name || row.ecosystem_host;
  if (!name || name.trim() === "") {
    return null; // Skip rows without a name
  }

  name = name.trim();

  // Clean up names like "Play Store" -> "Google Play Store"
  const nameMapping = {
    "Play Store": "Google Play Store",
    "App Store": "Apple App Store",
    "Chrome Store": "Chrome Web Store",
  };
  name = nameMapping[name] || name;

  // Create slug
  let slug = slugify(name);

  // Skip if slug already exists (duplicate)
  if (existingSlugs.has(slug)) {
    console.log(`Skipping duplicate: ${name} (${slug})`);
    return null;
  }
  existingSlugs.add(slug);

  // Skip entries with no meaningful URL
  const url = row.app_marketplace_url || "";
  if (!url || url.trim() === "") {
    console.log(`Skipping ${name}: no URL`);
    return null;
  }

  // Parse company info
  const company = row.ecosystem_parent_company || row.ecosystem_host || name;

  // Determine if has API/SDK
  const hasApi = !!(row.documentation_url || row.developer_platform_url);
  const hasSdk = !!row.interface_methods;

  // Parse description
  let description = row.ecosystem_description || "";
  if (!description) {
    description = `${name} is a marketplace for ${row.primary_product || "apps and extensions"}.`;
  }

  // Create tagline
  let tagline = "";
  if (row.market_vertical) {
    tagline = `${row.market_vertical} marketplace`;
  } else if (row.primary_product) {
    tagline = `App marketplace for ${row.primary_product}`;
  } else {
    tagline = `${company} app marketplace`;
  }

  const platforms = inferPlatforms(row);
  const category = inferCategory(row);
  const pricingModels = inferPricingModels(row);

  // Build the MDX content
  const mdx = `---
id: "${slug}"
name: "${name}"
slug: "${slug}"
tagline: "${tagline.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"').replace(/\n/g, " ")}"
url: "${url}"
logo: "/images/stores/${slug}.svg"
category: "${category}"
platforms:
${platforms.map((p) => `  - "${p}"`).join("\n")}
company:
  name: "${company}"
${row.ecosystem_release_date ? `  foundedYear: ${new Date(row.ecosystem_release_date).getFullYear()}` : ""}
  website: "${row.developer_platform_url || url}"
metrics:
  appCount: null
fees:
  commissionTiers:
    - percentage: 30
      description: "Standard commission"
technical:
  hasApi: ${hasApi}
${hasApi && row.documentation_url ? `  apiDocumentationUrl: "${row.documentation_url}"` : ""}
  hasSdk: ${hasSdk}
${row.programming_language ? `  sdkPlatforms:\n${row.programming_language.split(",").map((l) => `    - "${l.trim()}"`).join("\n")}` : ""}
  supportsInAppPurchases: true
  supportsSubscriptions: true
  supportsAds: false
monetization:
  models:
${pricingModels.map((m) => `    - "${m}"`).join("\n")}
submission:
${row.documentation_url ? `  guidelinesUrl: "${row.documentation_url}"` : ""}
  hasAutomatedReview: false
  hasHumanReview: true
  requiresApproval: ${row.partner_program_approval_required === "yes"}
geographic:
  availableRegions:
    - "Global"
features:
  hasEditorialContent: false
  hasAppBundles: false
  hasPreRegistration: false
  hasBetaTesting: ${row.sandbox_environment === "yes" || !!row.sandbox_environment}
  hasAnalyticsDashboard: false
  hasABTesting: false
  hasUserReviews: true
  hasRatings: true
metadata:
  featured: false
  verified: false
  lastUpdated: "${new Date().toISOString().split("T")[0]}"
  dateAdded: "${new Date().toISOString().split("T")[0]}"
  status: "active"
---

## Overview

${name} is ${description || `a marketplace provided by ${company}.`}

${row.primary_product ? `### Primary Products\n\n${row.primary_product}\n` : ""}
${row.developer_community ? `### Developer Community\n\n[Developer Community](${row.developer_community})\n` : ""}
${row.success_stories ? `### Success Stories\n\n[View Success Stories](${row.success_stories})\n` : ""}
`;

  return { slug, content: mdx };
}

// Main execution
const csvContent = fs.readFileSync(csvPath, "utf-8");
const rows = parseCSV(csvContent);

console.log(`Parsed ${rows.length} rows from CSV\n`);

// Get existing slugs from the stores directory
const existingFiles = fs.readdirSync(outputDir).filter((f) => f.endsWith(".mdx"));
const existingSlugs = new Set(existingFiles.map((f) => f.replace(".mdx", "")));

console.log(`Found ${existingSlugs.size} existing stores\n`);

let created = 0;
let skipped = 0;

for (const row of rows) {
  const result = convertRowToMDX(row, existingSlugs);
  if (result) {
    const filePath = path.join(outputDir, `${result.slug}.mdx`);
    fs.writeFileSync(filePath, result.content);
    console.log(`Created: ${result.slug}.mdx`);
    created++;
  } else {
    skipped++;
  }
}

console.log(`\n✅ Created ${created} new store files`);
console.log(`⏭️  Skipped ${skipped} entries (duplicates or missing data)`);
