// Client work, described by type only. Results are qualitative; there are no client names, places, dates or figures.
// Add or remove entries freely; the Work page, home-page teaser and case pages all read this list.
// Case text is qualitative on purpose: no digits, no names, no slogans.
import type { ServiceSlug } from "./services";

export type CaseSections = {
  summary?: string;
  client?: string;
  challenge?: string;
  solution?: string;
  results?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  industry: string;
  summary: string;
  scope: string[];
  highlights: string[];
  sections: CaseSections;
  relatedServices: ServiceSlug[];
};

export const projects: Project[] = [
  {
    slug: "property-portal",
    title: "Property portal",
    category: "Real estate",
    industry: "Real estate",
    summary: "A branded property website and portal for an advisory firm serving international buyers.",
    scope: ["Branding", "Web design", "Web development"],
    highlights: ["Multilingual", "Quick-to-publish listings", "Built for buyers in other countries"],
    sections: {
      summary:
        "A new identity and a property website for a real estate advisory firm that helps international buyers and investors find and compare homes. The site replaced a patchwork of manual updates with one clear, fast place to browse and enquire.",
      client:
        "A premium real estate advisory firm that serves international buyers and investors, many of whom are buying from abroad.",
      challenge:
        "Listings were hard to compare, fast-moving inventory had to be updated by hand, and buyers got little guidance in their own languages. Larger portals were winning leads the firm should have kept.",
      solution:
        "We created a new brand identity, then built a site around area guides, quick-to-publish listings and a multilingual layer. A dedicated enquiry flow was designed for buyers in other countries.",
      results:
        "The site became the firm's primary sales channel and enquiries rose. Agents spend less time assembling material for each buyer because the guides and listings already tell the story.",
    },
    relatedServices: ["design", "build", "strategy-discovery", "business-systems"],
  },
  {
    slug: "holiday-rental-booking",
    title: "Holiday-rental booking platform",
    category: "Hospitality",
    industry: "Hospitality",
    summary: "A direct-booking website for a rental operator, connected to its property-management system.",
    scope: ["Branding", "Web design", "Web development", "System integration"],
    highlights: ["Distinctive positioning", "Real-time availability", "Editorial storytelling"],
    sections: {
      summary:
        "A direct-booking platform for a rental operator. It pairs a refined visual identity with live availability and a connection to the operator's property-management system.",
      client: "An operator of premium holiday rentals that wants guests to book with them directly.",
      challenge:
        "Browsing felt generic and marketplace-like, and high-intent guests were leaking to the large booking platforms before they ever reached the operator's own site.",
      solution:
        "We defined a distinctive positioning and designed refined property cards, location-led storytelling and editorial content. Booking is quick and uses real availability, with the property-management system integrated behind it.",
      results:
        "Direct bookings rose after launch. The platform can take on new properties without a redesign, so growth no longer means rebuilding the site.",
    },
    relatedServices: ["design", "build", "strategy-discovery", "business-systems"],
  },
  {
    slug: "rental-marketplace",
    title: "Rental marketplace with back office",
    category: "Travel and hospitality",
    industry: "Travel and hospitality",
    summary: "A multi-destination rental marketplace paired with the ERP back office that runs it.",
    scope: ["Branding", "Web design", "Web development", "ERP"],
    highlights: ["End-to-end marketplace", "Back office included", "Ready for several destinations"],
    sections: {
      summary:
        "An end-to-end rental marketplace together with an ERP back office. Guests book directly against real availability while the team runs inventory, bookings and guest communication from one system.",
      client: "A rental business operating across several destinations that had outgrown manual ways of working.",
      challenge:
        "Inventory lived in spreadsheets, bookings arrived by phone and were confirmed by hand, and growing across several destinations was not possible with that setup.",
      solution:
        "We built the marketplace with direct booking against real availability, and an ERP back office for inventory, bookings and guest communication. Brand and design were developed alongside so the public side and the internal tools feel like one product.",
      results:
        "The whole portfolio now runs from one platform, so the team can add inventory and destinations without adding spreadsheets or phone calls.",
    },
    relatedServices: ["build", "business-systems", "design", "cloud"],
  },
  {
    slug: "investment-platform",
    title: "Investment platform flagship",
    category: "Real estate investment",
    industry: "Real estate investment",
    summary: "A flagship website and ERP layer that give several lines of business one credible brand.",
    scope: ["Branding", "Web design", "Web development", "ERP"],
    highlights: ["Investor-journey design", "Editorial content for each line of business", "Operations linked to enquiries"],
    sections: {
      summary:
        "A flagship digital presence and an operational layer for an investment business. The site is organised around the investor journey, and the ERP connects inventory to incoming enquiries.",
      client: "An investment business with several lines of business that needed to present itself and operate as one organisation.",
      challenge:
        "Several lines of business needed one credible brand, plus an operational layer so that enquiries and inventory were not handled in separate places.",
      solution:
        "We designed the flagship around how investors actually evaluate an opportunity, with editorial content for each line of business. An ERP links inventory to enquiries so the front of the business and its operations stay in step.",
      results:
        "The business now presents coherently and operates from one system, rather than as a set of disconnected parts.",
    },
    relatedServices: ["build", "business-systems", "design"],
  },
  {
    slug: "design-studio-portfolio",
    title: "Design studio portfolio",
    category: "Architecture and design",
    industry: "Architecture and design",
    summary: "A portfolio-first website that gives each discipline of a design studio its own space.",
    scope: ["Branding", "Web design", "Web development"],
    highlights: ["Portfolio-first", "A space for every discipline", "Photography-led"],
    sections: {
      summary:
        "A portfolio-first website for a design studio with several disciplines. Each discipline has its own space, and project pages are led by photography.",
      client: "A multi-disciplinary architecture and design studio with a distinctive point of view and standout projects.",
      challenge:
        "Multiple disciplines had been flattened into a generic site, and the studio's standout projects and the story behind them were under-weighted.",
      solution:
        "We built a portfolio-first experience that gives every discipline its own space and presents projects through photography-led pages. The studio's story sits where visitors expect to find it.",
      results:
        "The site is now the studio's primary credentials piece when pursuing new business, and the team can publish new work on its own without developer help.",
    },
    relatedServices: ["design", "build"],
  },
  {
    slug: "construction-operations",
    title: "Construction operations software",
    category: "Construction",
    industry: "Construction",
    summary: "Internal tools and workflow automation for a construction business.",
    scope: ["Workflow automation", "Internal tools"],
    highlights: [],
    sections: {
      summary:
        "Internal tools and workflow automation for a construction business.",
    },
    relatedServices: ["build", "ai-automation", "business-systems"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
