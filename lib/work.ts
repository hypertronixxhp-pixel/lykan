// Client work, described by type only. No client names, places, dates, or results.
// Add or remove entries freely; the Work page and home-page teaser both read this list.
export type Project = { title: string; category: string; summary: string; services: string[] };

export const projects: Project[] = [
  {
    title: "Property portal",
    category: "Real estate",
    summary: "A branded property website and portal for a real estate business.",
    services: ["Product design", "Web development", "Branding"],
  },
  {
    title: "Holiday-rental booking platform",
    category: "Hospitality and travel",
    summary: "A direct-booking website connected to the client's property-management system.",
    services: ["Strategy", "Design", "Web development", "System integration"],
  },
  {
    title: "Rental marketplace with back office",
    category: "Hospitality and travel",
    summary: "A multi-region marketplace paired with the internal tools that run it.",
    services: ["Strategy", "Design", "Web development", "System integration"],
  },
  {
    title: "Construction operations software",
    category: "Construction",
    summary: "Internal tools that move a construction business's day-to-day operations into one system.",
    services: ["Workflow automation", "Internal tools"],
  },
  {
    title: "Investment firm flagship site",
    category: "Real estate and investment",
    summary: "The main digital presence for an asset management firm.",
    services: ["Design", "Web development"],
  },
  {
    title: "Architecture studio portfolio",
    category: "Architecture and design",
    summary: "A portfolio website that presents a design studio's work.",
    services: ["Design", "Web development"],
  },
];
