export type Solution = {
  slug: string;
  name: string;
  category: string;
  cloud: "AWS" | "Azure";
  stack: string;
  short: string;
  headline: string;
  intro: string;
  serves: string[];
  challenge: string;
  journey: { title: string; text: string }[];
  structure: { area: string; features: string }[];
  ai: string[];
  honesty: string;
  architecture: { label: string; nodes: string[] }[];
  decisions: string[];
  control: string[];
  cta: string;
};

export const solutions: Solution[] = [
  {
    slug: "logistics-control-platform",
    name: "Logistics Control Platform",
    category: "Operations software",
    cloud: "AWS",
    stack: "Next.js · NestJS · Python ML service · PostgreSQL",
    short: "Coordinate deliveries and resolve exceptions.",
    headline: "One workspace for deliveries that need attention.",
    intro:
      "A platform designed for dispatch teams, drivers, and operations managers. The system brings together shipment tracking, route visibility, proof of delivery, exception handling, and reporting.",
    serves: ["Dispatchers coordinating live routes", "Drivers updating stops and uploading proof of delivery", "Operations managers reviewing patterns and performance"],
    challenge:
      "Updates arrive from drivers, customers, and tracking feeds in separate places. A dispatcher spends the morning stitching them together, and a late shipment is often noticed after it matters.",
    journey: [
      { title: "Too many disconnected updates", text: "The operations overview consolidates active deliveries, delayed shipments, and open exceptions." },
      { title: "One view of routes and exceptions", text: "The route board shows a map, route list, filters, assigned drivers, and stop sequence together." },
      { title: "An at-risk shipment, with context", text: "The shipment record shows its status timeline, customer instructions, documents, and predicted arrival." },
      { title: "Evidence reviewed, response assigned", text: "An exception drawer opens without losing route context, with ownership, priority, notes, and a next action." },
      { title: "The decision is recorded", text: "Resolution history feeds analytics on delay patterns and exception categories." },
    ],
    structure: [
      { area: "Operations overview", features: "Active deliveries, delayed shipments, exceptions, regional performance" },
      { area: "Route board", features: "Map, route list, filters, assigned drivers, stop sequence" },
      { area: "Shipment record", features: "Status timeline, customer instructions, documents, predicted arrival" },
      { area: "Exception inbox", features: "Ownership, priority, notes, next action, resolution history" },
      { area: "Driver view", features: "Assigned stops, status updates, proof-of-delivery uploads" },
      { area: "Analytics", features: "Delay patterns, exception categories, delivery trends" },
      { area: "Administration", features: "Users, roles, service regions, alert rules" },
    ],
    ai: [
      "ETA prediction from historical delivery and route signals.",
      "Exception summaries that bring recent events into a short dispatcher briefing.",
      "Image triage that flags a proof-of-delivery photo for human review when it may show a problem.",
    ],
    honesty: "An AI flag is a review prompt and an ETA is a prediction. The person on the team makes the operational decision.",
    architecture: [
      { label: "Experience", nodes: ["Next.js frontend"] },
      { label: "Services", nodes: ["NestJS APIs", "Python ETA service", "LLM summary integration"] },
      { label: "Data", nodes: ["PostgreSQL on Amazon RDS", "Amazon S3 (delivery files)", "Background queue"] },
    ],
    decisions: [
      "Prediction runs as its own Python service so models can change without touching the core API.",
      "Background processing keeps uploads and summaries off the dispatcher's critical path.",
      "Containerized services; hosting chosen for the actual workload during scoping.",
    ],
    control: ["Every AI output is labelled and can be dismissed", "Role-based access by region and function", "Event history and owner on every detail page"],
    cta: "Building an operations platform? Let's talk.",
  },
  {
    slug: "procurement-intelligence-workspace",
    name: "Procurement Intelligence Workspace",
    category: "Document and approval workflows",
    cloud: "Azure",
    stack: "Nuxt · FastAPI · Azure SQL",
    short: "Review documents and route decisions.",
    headline: "Every figure traceable to its source document.",
    intro:
      "A workspace designed for procurement teams handling vendor agreements, purchase orders, invoices, and approvals. It connects document viewing, extracted information, search, and a recorded human decision.",
    serves: ["Analysts reviewing invoices and agreements", "Approvers who need context before deciding", "Finance and legal teams who need an audit trail"],
    challenge:
      "Invoices, purchase orders, and contracts live in different places. Checking one against another is manual, and the reasoning behind an approval is rarely recorded.",
    journey: [
      { title: "A document enters the queue", text: "The review queue shows assigned documents, due dates, status, and priority." },
      { title: "Fields are extracted, one item flagged", text: "The system extracts key fields and identifies a potential mismatch for review." },
      { title: "The analyst checks the source", text: "Source document beside extracted fields, with supporting contract language highlighted." },
      { title: "Resolve or comment", text: "The analyst resolves the mismatch or returns it for correction with a comment." },
      { title: "A visible approval flow", text: "The item moves through approval with decision history always in view." },
    ],
    structure: [
      { area: "Review queue", features: "Assigned documents, due dates, status, priority" },
      { area: "Document workspace", features: "Source document beside extracted fields" },
      { area: "Match review", features: "Invoice, PO, and vendor information compared" },
      { area: "Contract library", features: "Search, versions, vendor grouping, key dates" },
      { area: "Question panel", features: "Answers linked to supporting passages" },
      { area: "Approval flow", features: "Comments, decisions, return for correction" },
      { area: "Audit view", features: "Who changed or approved what, and when" },
    ],
    ai: [
      "Extract key fields from invoices and agreements.",
      "Identify potential mismatches for review.",
      "Search contracts by meaning as well as keyword.",
      "Answer a question from the available documents, with a link to the relevant passage.",
    ],
    honesty: "The reviewer can always inspect the original document beside an AI-produced answer. The decision is theirs and is recorded.",
    architecture: [
      { label: "Experience", nodes: ["Nuxt frontend"] },
      { label: "Services", nodes: ["FastAPI services", "Azure AI Document Intelligence", "Azure AI Search + language model"] },
      { label: "Data", nodes: ["Azure SQL (workflow data)", "Azure Blob Storage (source files)"] },
    ],
    decisions: [
      "Answers are generated from retrieved passages, so each one carries a link to its source.",
      "Workflow state lives in a relational store, separate from the search index.",
      "Hosting and access controls are chosen during project scoping.",
    ],
    control: ["Source always visible next to AI output", "Return-for-correction path on every approval", "Audit view of every change and decision"],
    cta: "Reviewing documents at scale? Let's talk.",
  },
  {
    slug: "media-operations-hub",
    name: "Media Operations Hub",
    category: "Media management and collaboration",
    cloud: "AWS",
    stack: "SvelteKit · Go APIs · Python processing functions · DynamoDB",
    short: "Search, organize, and review video assets.",
    headline: "Find the moment. Build the clip. Get it approved.",
    intro:
      "A workspace designed for organizations with large video libraries. Teams upload assets, find spoken or visual moments, collect clips, and coordinate reviews.",
    serves: ["Editors and producers searching archives", "Reviewers approving selected clips", "Administrators managing access and asset policies"],
    challenge:
      "Hours of recordings sit in folders, findable only by filename. Reviews happen in email threads with timecodes typed by hand.",
    journey: [
      { title: "A large library of recordings", text: "Collections, tags, permissions, and processing status in one library." },
      { title: "Search a phrase or topic", text: "Results show matching text, thumbnails, and timestamps." },
      { title: "Open at the matching moment", text: "The video workspace jumps to the timestamp, with transcript following playback." },
      { title: "Select a range and save", text: "The clip builder captures start and end points, a title, and a draft." },
      { title: "Comment at a timestamp, approve", text: "Reviewers comment on moments, not in a generic thread, and set approval state." },
    ],
    structure: [
      { area: "Media library", features: "Collections, tags, permissions, processing status" },
      { area: "Video workspace", features: "Player, transcript, scene timeline, metadata" },
      { area: "Search", features: "Matching text, thumbnails, timestamps" },
      { area: "Clip builder", features: "Start and end points, title, save a draft" },
      { area: "Review", features: "Time-stamped comments and approval state" },
      { area: "Processing view", features: "Upload, transcription, analysis, ready, error" },
      { area: "Administration", features: "Team access and asset policies" },
    ],
    ai: [
      "Speech transcription with timestamps.",
      "Visual scene and object labels.",
      "Searchable moments assembled from transcripts and metadata.",
      "Draft titles and summaries for selected clips.",
    ],
    honesty: "AI suggestions are marked as suggestions. Nothing becomes a title, label, or approved clip until a person accepts it.",
    architecture: [
      { label: "Experience", nodes: ["SvelteKit frontend"] },
      { label: "Services", nodes: ["Go APIs", "AWS Step Functions", "Python processing functions"] },
      { label: "Data & AI", nodes: ["DynamoDB (metadata, reviews)", "Amazon S3 (media)", "Transcribe · Rekognition Video · Bedrock"] },
    ],
    decisions: [
      "Media analysis is asynchronous, orchestrated by Step Functions so jobs can retry and report status.",
      "Python functions normalize service output into one searchable moment format.",
      "DynamoDB suits the access patterns: asset lookups and time-anchored comments.",
    ],
    control: ["Team and asset-level permissions", "Suggestions visually distinct from accepted content", "Approval state tracked per clip"],
    cta: "Managing a large media library? Let's talk.",
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);
