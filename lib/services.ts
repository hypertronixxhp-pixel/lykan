import { claims } from "./claims";

// Single source of truth for what Lykan offers. Remove or add items here and the
// home page, Services page, contact-form selector and service detail pages all update.
export type FigureMotif = "compass" | "layers" | "stack" | "gauge" | "cloud" | "network" | "chart" | "shield" | "check";

export type CapabilityGroup = {
  slug: string;
  name: string;
  summary: string;
  items: string[];
  standOut: { title: string; text: string }[];
  inPractice: string;
  faqs: { q: string; a: string }[];
  figure: { n: number; title: string; motif: FigureMotif };
};

export const capabilityGroups: CapabilityGroup[] = [
  {
    slug: "strategy-discovery",
    name: "Strategy & discovery",
    summary: "We start with the business problem: who the product is for, what it must do first, and how to get there without wasted effort.",
    items: [
      "Product strategy and roadmaps",
      "Discovery workshops and requirements",
      "Competitive and market research",
      "Scoping a first release",
    ],
    standOut: [
      {
        title: "Problem before solution",
        text: "We write down the problem and who has it before anyone proposes features. That keeps the work pointed at an outcome rather than a wish list.",
      },
      {
        title: "Plain-language findings",
        text: "Research and recommendations come back in words your whole team can read. Nobody has to decode jargon to take part in the decision.",
      },
      {
        title: "A small first release",
        text: "We look for the smallest version that proves the idea and still feels complete. Everything else waits on a roadmap you can reorder.",
      },
      {
        title: "Honest trade-offs",
        text: "Every option has a cost, and we say so openly. You choose with the downsides in view, not after they surface.",
      },
    ],
    inPractice: "A founder arrives with a long feature list, and we leave the first workshop with one clear user, one core task and a short, ordered plan for building it.",
    faqs: [
      {
        q: "Do we need a finished idea before we talk?",
        a: "No. Many engagements begin with a rough problem statement and a few questions. Discovery exists to turn that into something concrete enough to build.",
      },
      {
        q: "What do we get at the end of discovery?",
        a: "Usually a written summary of the problem, the people affected, the proposed scope and the main risks. The exact format depends on the project and is agreed at the start.",
      },
      {
        q: "Can discovery work continue into a build?",
        a: "Yes, and it often does. The same people who shaped the plan can carry it into design and development, though you are free to take the plan elsewhere.",
      },
    ],
    figure: { n: 1, title: "Finding the direction", motif: "compass" },
  },
  {
    slug: "design",
    name: "Design",
    summary: "Interfaces that are clear to use and consistent to build, designed by people who understand how they will be implemented.",
    items: [
      "UI/UX design",
      "Clickable prototypes",
      "Design systems",
      "Branding and visual identity",
    ],
    standOut: [
      {
        title: "Built to be built",
        text: "Designers and engineers talk early, so layouts respect what the code can do well. What you approve is close to what ships.",
      },
      {
        title: "Clarity over decoration",
        text: "Each screen has one main job and the interface makes that job obvious. Visual flourishes are added only when they help people understand.",
      },
      {
        title: "Test with real tasks",
        text: "We put prototypes in front of people and ask them to complete ordinary tasks. What they struggle with tells us what to change.",
      },
      {
        title: "Reusable by design",
        text: "Colors, type and components are defined once and reused everywhere. New screens come together faster and stay consistent.",
      },
    ],
    inPractice: "Before a line of production code is written, the team clicks through a prototype of the main journey and points to exactly where it feels confusing.",
    faqs: [
      {
        q: "Do you design for mobile as well as desktop?",
        a: "Yes. Layouts are planned for small screens and large ones together, so one does not become an afterthought of the other.",
      },
      {
        q: "Can you work with our existing brand?",
        a: "Usually, yes. We can build on the colors, type and tone you already have, or help refresh them if they no longer fit.",
      },
      {
        q: "Will we own the design files?",
        a: "Ownership of deliverables is spelled out in the agreement for each project. We aim to hand over files in a form your team can keep working with.",
      },
    ],
    figure: { n: 2, title: "Layers of an interface", motif: "layers" },
  },
  {
    slug: "build",
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
    standOut: [
      {
        title: "Working software early",
        text: "We ship usable slices as we go instead of saving everything for one reveal. You see progress and can steer while change is still cheap.",
      },
      {
        title: "Permissions from day one",
        text: "Who can see and change what is designed alongside the features, not bolted on afterwards. Roles stay understandable as the product grows.",
      },
      {
        title: "Readable, tested code",
        text: "We write code the next developer can follow, with tests around the parts that matter most. That keeps future changes safe.",
      },
      {
        title: "Room to grow",
        text: "Structure is chosen for where the product is heading, not only where it stands today. Adding a feature should not mean rewriting the base.",
      },
    ],
    inPractice: "A first version goes live for a small group of real users, and what they actually do shapes what gets built next.",
    faqs: [
      {
        q: "Can you build on top of what we already have?",
        a: "Often, yes. We review the existing code first and tell you honestly whether extending it makes sense or whether a different approach would serve you better.",
      },
      {
        q: "Do we keep the source code?",
        a: "Ownership is set out in the agreement for each project. Our aim is that you are never locked out of software you paid to have built.",
      },
      {
        q: "How do we stay involved while you build?",
        a: "You get regular working demos and a clear place to leave feedback. Decisions that affect scope are brought to you rather than made quietly.",
      },
    ],
    figure: { n: 3, title: "From screen to database", motif: "stack" },
  },
  {
    slug: "optimize",
    name: "Optimize",
    summary: "We find what is slowing a system down and fix it, so the product stays fast and affordable to run as usage grows.",
    items: [
      "Database optimization: query tuning, indexing, schema review",
      "API optimization: latency, caching, and payload size",
      "Application and front-end performance",
      "Website speed and Core Web Vitals",
      "SEO optimization (technical SEO, content structure, search visibility)",
      "Server tuning and resource planning",
      "Hosting and production cost reduction",
      "Code review and refactoring",
    ],
    standOut: [
      {
        title: "Measure first",
        text: "We start by measuring where time and money actually go. Fixes target real bottlenecks, not hunches.",
      },
      {
        title: "Fix the cause",
        text: "A slow page is often a symptom of a heavy query or an oversized response. We trace it back and repair the source instead of masking it.",
      },
      {
        title: "Visible to search",
        text: "Fast, well-structured pages are easier for people and search engines to use. Technical clean-up and clear content structure go together.",
      },
      {
        title: "Keep the gains",
        text: "We leave behind checks and notes so improvements are not undone by the next release. Performance becomes a habit rather than a one-off project.",
      },
    ],
    inPractice: `We profile the busiest pages, remove what slows them down and set up checks that flag any regression. ${claims.speed}`,
    faqs: [
      {
        q: "Can you help our site rank better?",
        a: "We can improve the technical foundations of search visibility, such as structure, markup, page speed and content organization. Rankings depend on many factors outside any one team's control, so we focus on what can be improved and measured.",
      },
      {
        q: "How do you decide what to speed up first?",
        a: "We measure real usage and rank problems by how much they affect your users and your costs. The largest, cheapest wins usually come first.",
      },
      {
        q: "Will optimizing change how the product looks?",
        a: "Generally not. The work focuses on how the system behaves underneath, and any visible change is discussed with you before it is made.",
      },
    ],
    figure: { n: 4, title: "Reading the dials", motif: "gauge" },
  },
  {
    slug: "cloud",
    name: "Cloud",
    summary: "We build the infrastructure behind the product, from deployment and storage to integrations, monitoring, and the workflows that keep it running.",
    items: [
      "Cloud setup on AWS and Azure",
      "Deployment pipelines (CI/CD) and containers",
      "Monitoring, logging, and alerting",
      "Backups and recovery planning",
      "Server and database migrations",
      "Right-sizing infrastructure to cut hosting and production costs",
      "Environment, access, and secrets setup",
    ],
    standOut: [
      {
        title: "Repeatable by default",
        text: "Environments are described in code so they can be rebuilt on demand. That removes guesswork and one-off setups nobody remembers.",
      },
      {
        title: "Small, safe releases",
        text: "Automated pipelines test and deploy changes in small steps. Rolling back is a normal, rehearsed action.",
      },
      {
        title: "Plan for failure",
        text: "We assume something will eventually break and prepare for it with backups, alerts and written recovery steps.",
      },
      {
        title: "Pay for what you use",
        text: "Capacity is matched to real demand and reviewed over time. Cost is treated as part of the design, not a surprise on the invoice.",
      },
    ],
    inPractice: `We map what each service actually needs, resize what is oversized and add alerts for spending that drifts. ${claims.hosting}`,
    faqs: [
      {
        q: "How do you reduce hosting costs?",
        a: "We review what is running, how much of it is used and where capacity sits idle, then right-size or retire what is not needed. Savings vary with the setup you start from, so we look at your own usage before suggesting changes.",
      },
      {
        q: "Can you move us from one provider to another?",
        a: "Migrations are possible, and we plan them to limit downtime and risk. We will discuss whether moving is worthwhile before recommending it.",
      },
      {
        q: "Who controls the accounts and access?",
        a: "Your organization should own its cloud accounts. We work through scoped access that can be reviewed and removed whenever you choose.",
      },
    ],
    figure: { n: 5, title: "Infrastructure that scales", motif: "cloud" },
  },
  {
    slug: "ai-automation",
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
    standOut: [
      {
        title: "A task, not a trend",
        text: "We begin with a concrete job that costs your team time and ask whether AI is the right tool. Sometimes plain automation does it better.",
      },
      {
        title: "People stay in charge",
        text: "Automated steps are built so a person can review, correct or override them. Higher-stakes decisions keep a human in the loop.",
      },
      {
        title: "Grounded in your content",
        text: "Assistants draw on your own documents and data, and are designed to say when they do not know. That limits invented answers.",
      },
      {
        title: "Checked and monitored",
        text: "We test outputs against real examples before launch and keep watching quality afterwards. Models drift, so the checking does not stop.",
      },
    ],
    inPractice: "A support assistant answers routine questions from your own help content and hands anything unusual to a person with the conversation attached.",
    faqs: [
      {
        q: "Will AI replace our team?",
        a: "Our aim is to take repetitive work off people so they can spend time on judgment and relationships. How roles change is your decision, and we design the tools to support your team rather than sideline it.",
      },
      {
        q: "How do you handle sensitive data?",
        a: "We limit what data is shared with any AI service and discuss storage and access up front. Requirements around privacy are agreed before any build begins.",
      },
      {
        q: "How accurate will it be?",
        a: "Accuracy depends on the task and the quality of the source material. We test against real examples and report honestly on where results are strong and where review is still needed.",
      },
    ],
    figure: { n: 6, title: "Connected workflows", motif: "network" },
  },
  {
    slug: "business-systems",
    name: "Business systems",
    summary: "The tools a team runs on every day: who the customers are, what is selling, and how the business is performing.",
    items: [
      "CRM and sales tools",
      "Management dashboards and reporting",
      "Internal tools and admin panels",
      "Conversion and revenue growth support",
      "Branding and growth support",
    ],
    standOut: [
      {
        title: "Shaped to your process",
        text: "We model the way your team already works rather than forcing it into a generic template. Tools feel familiar from the first day.",
      },
      {
        title: "One version of the truth",
        text: "Customer, sales and operations data is brought together so people stop reconciling spreadsheets. Everyone looks at the same numbers.",
      },
      {
        title: "Numbers that prompt action",
        text: "Dashboards show what to do next, not just what happened. We choose a few measures that matter over a wall of charts.",
      },
      {
        title: "Simple for busy teams",
        text: "Internal tools are built for daily speed, with fewer clicks and clear defaults. The people using them every day guide the design.",
      },
    ],
    inPractice: `A sales team sees every lead, its stage and its next step in one place, and managers see the pipeline without asking for a report. ${claims.revenue}`,
    faqs: [
      {
        q: "Can you connect to the tools we already use?",
        a: "In many cases, yes, through the integrations those tools offer. We check what is available early so there are no surprises later.",
      },
      {
        q: "Do we need a custom system or an off-the-shelf one?",
        a: "That depends on how unusual your process is. We will tell you plainly if an existing product would serve you well enough.",
      },
      {
        q: "How do you support growth work?",
        a: "We look at where visitors drop out and which steps in your journey can be improved. We make changes in measured steps and compare results, because outcomes depend on your market and offer.",
      },
    ],
    figure: { n: 7, title: "Business at a glance", motif: "chart" },
  },
  {
    slug: "security",
    name: "Security",
    summary: "We look at how a system could be misused and close the gaps, so access is deliberate and problems are noticed early.",
    items: [
      "Security reviews and vulnerability assessment",
      "Authentication and access control",
      "Hardening of applications, servers, and databases",
      "Security monitoring and alerting",
    ],
    standOut: [
      {
        title: "Think like an intruder",
        text: "We review a system the way someone trying to misuse it would. That surfaces weaknesses that ordinary testing misses.",
      },
      {
        title: "Least access needed",
        text: "People and services get only the permissions their job requires. A single stolen login then cannot open every door.",
      },
      {
        title: "Layers, not one wall",
        text: "No single control is trusted to hold alone. Several modest protections working together are harder to get past.",
      },
      {
        title: "Noticed quickly",
        text: "Logging and alerts are set up so unusual activity is seen early. Fast awareness limits how far a problem can spread.",
      },
    ],
    inPractice: "A review turns up an overly broad admin role and a forgotten test endpoint, and both are closed before anyone outside the team finds them.",
    faqs: [
      {
        q: "Can you make our system completely secure?",
        a: "No honest team can. We reduce risk by finding and fixing weaknesses and by setting up detection, and we are clear about what a review does and does not cover.",
      },
      {
        q: "Do you review software you did not build?",
        a: "Yes. We can assess existing applications, servers and databases and report what we find in plain terms with suggested next steps.",
      },
      {
        q: "What happens with the findings?",
        a: "You receive a written summary that ranks issues by how much they matter. You decide what to fix, and we can help with the repairs if you want.",
      },
    ],
    figure: { n: 8, title: "Defense in layers", motif: "shield" },
  },
  {
    slug: "quality-support",
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
    standOut: [
      {
        title: "Tested before it ships",
        text: "Automated checks run on every change, backed by careful hands-on testing of the flows people rely on. Problems are caught while they are small.",
      },
      {
        title: "Calm under pressure",
        text: "When something breaks in production, we focus on restoring service first and understanding the cause second. Then we write down what happened.",
      },
      {
        title: "Fix the pattern",
        text: "A repeated bug points to a deeper weakness. We look for the underlying cause so the same fault does not keep returning.",
      },
      {
        title: "Knowledge that transfers",
        text: "We document decisions and setup as we go. Whoever looks after the software next can pick it up without starting from scratch.",
      },
    ],
    inPractice: "A reported bug is reproduced, fixed, covered by a new test and noted in the handover document, so it stays fixed.",
    faqs: [
      {
        q: "Do you support software you did not write?",
        a: "Often, yes, after an initial audit of the code and setup. We will say candidly if the condition of the software makes ongoing support impractical.",
      },
      {
        q: "What does a support retainer cover?",
        a: "The scope is agreed per client and typically covers fixes, small changes and monitoring. Specifics are written into the agreement so expectations are clear on both sides.",
      },
      {
        q: "Can you review our code before we release?",
        a: "Yes. A pre-release review of code, tests and architecture can highlight risks worth addressing first. We report what we find and leave the decisions with you.",
      },
    ],
    figure: { n: 9, title: "Checked and kept steady", motif: "check" },
  },
];

export function getGroup(slug: string): CapabilityGroup | undefined {
  return capabilityGroups.find((g) => g.slug === slug);
}
