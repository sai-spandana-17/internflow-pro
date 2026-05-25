export interface Company { name: string; industry: string; location: string; }
export const COMPANIES: Company[] = [
  { name: "Stripe", industry: "Fintech", location: "San Francisco, CA" },
  { name: "Vercel", industry: "Developer Tools", location: "San Francisco, CA" },
  { name: "Anthropic", industry: "AI Research", location: "San Francisco, CA" },
  { name: "OpenAI", industry: "AI Research", location: "San Francisco, CA" },
  { name: "Figma", industry: "Design Tools", location: "San Francisco, CA" },
  { name: "Notion", industry: "Productivity", location: "San Francisco, CA" },
  { name: "Linear", industry: "Developer Tools", location: "Remote" },
  { name: "Airbnb", industry: "Travel", location: "San Francisco, CA" },
  { name: "Spotify", industry: "Audio", location: "Stockholm, SE" },
  { name: "Shopify", industry: "E-commerce", location: "Ottawa, CA" },
  { name: "NVIDIA", industry: "Hardware / AI", location: "Santa Clara, CA" },
  { name: "Apple", industry: "Consumer Tech", location: "Cupertino, CA" },
  { name: "Google", industry: "Search / Cloud", location: "Mountain View, CA" },
  { name: "Meta", industry: "Social", location: "Menlo Park, CA" },
  { name: "Microsoft", industry: "Cloud / Productivity", location: "Redmond, WA" },
  { name: "Databricks", industry: "Data Platform", location: "San Francisco, CA" },
  { name: "Snowflake", industry: "Data Cloud", location: "Bozeman, MT" },
  { name: "Coinbase", industry: "Crypto", location: "Remote" },
  { name: "Discord", industry: "Communications", location: "San Francisco, CA" },
  { name: "Cloudflare", industry: "Edge Networking", location: "San Francisco, CA" },
];
export const ROLES = [
  "Software Engineering", "Frontend Engineering", "Backend Engineering",
  "ML Research", "Data Science", "Product Design", "Product Management",
  "DevOps / SRE", "Security Engineering", "Mobile Engineering",
];
