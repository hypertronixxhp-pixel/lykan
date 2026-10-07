// Single source of truth for what Lykan offers. Remove or add items here and the
// home page, Services page and contact-form selector all update.
export type CapabilityGroup = { name: string; summary: string; items: string[] };

export const capabilityGroups: CapabilityGroup[] = [
  {
    name: "Strategy & discovery",
    summary: "We start with the business problem: who the product is for, what it must do first, and how to get there without wasted effort.",
    items: [
      "Product strategy and roadmaps",
      "Discovery workshops and requirements",
      "Competitive and market research",
      "Scoping a first release",
    ],
  },
  {
    name: "Design",
    summary: "Interfaces that are clear to use and consistent to build, designed by people who understand how they will be implemented.",
    items: [
      "UI/UX design",
      "Clickable prototypes",
      "Design systems",
      "Branding and visual identity",
    ],
  },
  {
    name: "Build",
    summary: "We design and build applications around the people who use them: dependable backends, thoughtful permissions, and room to grow.",
    items: [
      "Full-stack web applications",
      "Web and mobile development",
      "MVPs and rapid prototyping",
      "New features and modules for existing products",
      "Customer portals and marketplaces",
      "Third-party API, payment, and system integrations",
      "Modernizing and migrating legacy applications",
    ],
  },
  {
    name: "Optimize",
    summary: "We find what is slowing a system down and fix it, so the product stays fast and affordable to run as usage grows.",
    items: [
      "Database optimization: query tuning, indexing, schema review",
      "API optimization: latency, caching, and payload size",
      "Application and front-end performance",
      "Server tuning and resource planning",
      "Infrastructure cost review",
      "Code review and refactoring",
    ],
  },
  {
    name: "Cloud",
    summary: "We build the infrastructure behind the product, from deployment and storage to integrations, monitoring, and the workflows that keep it running.",
    items: [
      "Cloud setup on AWS and Azure",
      "Deployment pipelines (CI/CD) and containers",
      "Monitoring, logging, and alerting",
      "Backups and recovery planning",
      "Server and database migrations",
      "Environment, access, and secrets setup",
    ],
  },
  {
    name: "AI & automation",
    summary: "We add AI where it improves a real task: answering customers, preparing data, checking against rules, or spotting what a person should look at.",
    items: [
      "AI chatbots and support assistants for your website",
      "Workflow and back-office automation",
      "AI agents for repetitive tasks",
      "Policy automation and rule checking",
      "Anomaly detection",
      "Populating and enriching databases with AI",
      "Document processing and field extraction",
      "AI search across your own content",
      "Content generation in your brand voice",
    ],
  },
  {
    name: "Business systems",
    summary: "The tools a team runs on every day: who the customers are, what is selling, and how the business is performing.",
    items: [
      "CRM and sales tools",
      "Management dashboards and reporting",
      "Internal tools and admin panels",
      "Branding and growth support",
    ],
  },
  {
    name: "Security",
    summary: "We look at how a system could be misused and close the gaps, so access is deliberate and problems are noticed early.",
    items: [
      "Security reviews and vulnerability assessment",
      "Authentication and access control",
      "Hardening of applications, servers, and databases",
      "Security monitoring and alerting",
    ],
  },
  {
    name: "Quality & support",
    summary: "We keep working software working: tested before release, fixed quickly when something breaks, and looked after afterwards.",
    items: [
      "Automated and manual testing",
      "Bug fixing and troubleshooting",
      "Help with production issues",
      "Code and architecture audits",
      "Maintenance and support retainers",
      "Documentation and handover",
    ],
  },
];
