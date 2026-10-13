"use client";

import { useState } from "react";
import Link from "next/link";
import { claims } from "@/lib/claims";

type ProjectArchetype = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  defaultModules: string[];
  recommendedStack: {
    experience: string[];
    services: string[];
    data: string[];
    infrastructure: string[];
  };
};

const ARCHETYPES: ProjectArchetype[] = [
  {
    id: "ai-automation",
    name: "AI & Workflow Automation",
    category: "Intelligent Operations",
    tagline: "Replace repetitive operational toil with reliable, supervised automation.",
    description: "Ideal for teams managing high-volume incoming documents, support tickets, dispatch exceptions, or routine operational data transforms.",
    defaultModules: ["arch", "ai-pipeline", "security", "testing"],
    recommendedStack: {
      experience: ["Next.js App Router", "Tailwind CSS UI", "Real-time Event Feed"],
      services: ["Python ML Workers", "Async Task Queue", "LLM Evaluation Guards"],
      data: ["PostgreSQL Storage", "Vector Similarity Index", "Encrypted Object Store"],
      infrastructure: ["Isolated Docker Pods", "Encrypted Webhooks", "Zero-Leak Telemetry"],
    },
  },
  {
    id: "full-stack-web",
    name: "Full-Stack Web Platform",
    category: "Modern Web Systems",
    tagline: "High-speed, scalable web applications built for clarity and conversion.",
    description: "For customer-facing flagships, multi-tenant SaaS products, and portals requiring sub-second page loads and seamless UX.",
    defaultModules: ["arch", "design-system", "api-layer", "perf", "testing"],
    recommendedStack: {
      experience: ["Next.js React 19", "Tailwind Design Tokens", "Edge Prerendering"],
      services: ["Node.js Microservices", "Zod Schema Validation", "REST / GraphQL APIs"],
      data: ["Managed PostgreSQL", "Redis Cache Tier", "Automated Backups"],
      infrastructure: ["Cloudflare / AWS Edge", "CI/CD Deployment Pipelines", "DDoS Mitigation"],
    },
  },
  {
    id: "business-systems",
    name: "Custom ERP & Internal Tooling",
    category: "Operational Software",
    tagline: "Connect disjointed databases, spreadsheets, and departmental tools.",
    description: "Consolidate scattered inventory, billing, dispatch, and administrative workflows into a unified, role-governed back-office system.",
    defaultModules: ["arch", "api-layer", "security", "testing"],
    recommendedStack: {
      experience: ["High-Density Admin UI", "Keyboard-Driven Tables", "Audit Drawers"],
      services: ["Modular Service APIs", "Webhook Ingestion Bus", "State Machine Engine"],
      data: ["Relational Database", "Change Data Capture", "Immutable Audit Log"],
      infrastructure: ["Private VPC Deployment", "Role-Based Access Control", "SSO Integration"],
    },
  },
  {
    id: "cloud-optimization",
    name: "Cloud Modernization & Hardening",
    category: "Infrastructure & DevOps",
    tagline: "Trim infrastructure overhead, optimize database bottlenecks, and secure deployments.",
    description: "Designed for established platforms suffering from slow load times, high cloud provider bills, or architectural complexity.",
    defaultModules: ["arch", "perf", "security", "testing"],
    recommendedStack: {
      experience: ["Asset Optimization", "Static Route Generation", "Cache Warming"],
      services: ["Containerized Microservices", "API Payload Compactor", "Query Optimizer"],
      data: ["Database Index Tuning", "Read-Replica Routing", "Connection Pooling"],
      infrastructure: ["Terraform IaC", "Container Orchestration", "Zero-Downtime Releases"],
    },
  },
];

type ScopeModule = {
  id: string;
  title: string;
  category: string;
  summary: string;
  deliverables: string[];
};

const MODULES: ScopeModule[] = [
  {
    id: "arch",
    title: "System Blueprint & Scoping Specification",
    category: "Architecture",
    summary: "Clear data models, interface boundaries, and operational failure modes documented before code is written.",
    deliverables: ["Entity-relationship schema", "API boundary contract", "Security threat analysis"],
  },
  {
    id: "design-system",
    title: "Design System & Responsive Interface",
    category: "Experience",
    summary: "High-contrast, accessible UI components with calibrated typography and micro-interactions.",
    deliverables: ["Accessible design tokens", "Component library", "Mobile-responsive layouts"],
  },
  {
    id: "ai-pipeline",
    title: "AI Integration & Workflow Orchestration",
    category: "Intelligence",
    summary: "Supervised inference pipelines with human-in-the-loop review gates and hallucination shields.",
    deliverables: ["Async parsing queue", "Structured output validator", "Reviewer interface drawer"],
  },
  {
    id: "api-layer",
    title: "Typed APIs & Service Integrations",
    category: "Backend",
    summary: "Resilient backend services with strict validation, retry mechanisms, and third-party webhook sinks.",
    deliverables: ["Zod-validated endpoints", "Webhook handlers", "Error recovery workflows"],
  },
  {
    id: "security",
    title: "Security Shield & Confidentiality Safeguards",
    category: "Governance",
    summary: "Role-based authorization, encrypted storage, and automated privacy scans in the build pipeline.",
    deliverables: ["Zero-leak scan runner", "RBAC policy enforcement", "Encrypted secrets management"],
  },
  {
    id: "perf",
    title: "Performance Tuning & Core Web Vitals",
    category: "Speed",
    summary: "Sub-second initial paint, optimized bundle delivery, and query caching for reduced hosting costs.",
    deliverables: ["Edge asset compression", "Database query optimization", "Core Web Vitals verification"],
  },
  {
    id: "testing",
    title: "Automated Regression & Test Harness",
    category: "Reliability",
    summary: "Comprehensive automated test suites running on every commit to guard against regressions.",
    deliverables: ["End-to-end integration tests", "Static schema verification", "Automated link and crawl tests"],
  },
];

type StageOption = {
  id: string;
  label: string;
  description: string;
};

const STAGES: StageOption[] = [
  { id: "greenfield", label: "Greenfield Product", description: "Building a new platform from inception to production deployment." },
  { id: "augmentation", label: "Team Augmentation", description: "Partnering alongside your existing engineering team to accelerate milestones." },
  { id: "refactor", label: "Modernization & Refactor", description: "Re-architecting an existing production system to improve speed and reduce overhead." },
];

export default function Estimator() {
  const [archetypeId, setArchetypeId] = useState<string>("ai-automation");
  const [selectedModules, setSelectedModules] = useState<string[]>(
    ARCHETYPES[0].defaultModules
  );
  const [stageId, setStageId] = useState<string>("greenfield");

  const currentArchetype = ARCHETYPES.find((a) => a.id === archetypeId) ?? ARCHETYPES[0];

  const handleSelectArchetype = (arch: ProjectArchetype) => {
    setArchetypeId(arch.id);
    setSelectedModules(arch.defaultModules);
  };

  const toggleModule = (modId: string) => {
    setSelectedModules((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const activeModules = MODULES.filter((m) => selectedModules.includes(m.id));

  // Determine delivery rhythm based on active module count
  const complexityLevel =
    selectedModules.length <= 3
      ? "Focused Sprint Cycle"
      : selectedModules.length <= 5
      ? "Standard Engineering Engagement"
      : "Comprehensive Enterprise Architecture";

  const currentStage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const ENDPOINT =
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
    (typeof window !== "undefined" &&
    (window.location.hostname.includes("github.io") || window.location.hostname.includes("lykan.studio"))
      ? "https://formsubmit.co/ajax/hypertroixx.hp@gmail.com"
      : "/api/contact");

  const handleSubmitScope = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Please enter a valid work email";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitState("sending");

    const assembledMessage = [
      `Scoped Project Architecture Submission:`,
      `Archetype: ${currentArchetype.name} (${currentArchetype.category})`,
      `Operational Stage: ${currentStage.label}`,
      `Selected Capabilities (${activeModules.length}):`,
      ...activeModules.map((m) => `- ${m.title}`),
      ``,
      `Recommended Architecture Stack:`,
      `- Experience: ${currentArchetype.recommendedStack.experience.join(", ")}`,
      `- Services: ${currentArchetype.recommendedStack.services.join(", ")}`,
      `- Data: ${currentArchetype.recommendedStack.data.join(", ")}`,
      `- Deployment: ${currentArchetype.recommendedStack.infrastructure.join(", ")}`,
      ``,
      `Additional Project Context / Requirements:`,
      userNotes.trim() ? userNotes.trim() : "None provided.",
    ].join("\n");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          topic: currentArchetype.name,
          message: assembledMessage,
          _subject: `New Scoped Architecture Inquiry: ${currentArchetype.name} from ${name.trim()}`,
          _captcha: "false",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send scope");
      }
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  const contactQuery = encodeURIComponent(
    `Archetype: ${currentArchetype.name} | Stage: ${stageId} | Modules: ${activeModules.map((m) => m.title).join(", ")}`
  );

  return (
    <div className="space-y-12">
      {/* Step 1: Select Project Archetype */}
      <section aria-labelledby="step-archetype-heading">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal">Step 01</span>
            <h2 id="step-archetype-heading" className="text-xl font-semibold text-white sm:text-2xl">
              Choose your product archetype
            </h2>
          </div>
          <span className="text-xs text-slate-400">Select the primary system focus</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ARCHETYPES.map((arch) => {
            const isSelected = arch.id === archetypeId;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleSelectArchetype(arch)}
                className={`relative flex flex-col items-start rounded-xl border p-5 text-left transition-all ${
                  isSelected
                    ? "border-teal bg-ink-2 ring-1 ring-teal"
                    : "border-line bg-ink-2/60 hover:border-slate-600 hover:bg-ink-2"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-medium text-steel">{arch.category}</span>
                  {isSelected && (
                    <span className="inline-flex items-center rounded bg-teal/20 px-2 py-0.5 text-xs font-medium text-teal">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{arch.name}</h3>
                <p className="mt-1 text-xs font-medium text-slate-300">{arch.tagline}</p>
                <p className="mt-3 text-xs text-slate-400">{arch.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Configure Scope Modules */}
      <section aria-labelledby="step-modules-heading">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal">Step 02</span>
            <h2 id="step-modules-heading" className="text-xl font-semibold text-white sm:text-2xl">
              Select technical capabilities &amp; scope
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {selectedModules.length} module{selectedModules.length === 1 ? "" : "s"} selected
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const checked = selectedModules.includes(mod.id);
            return (
              <label
                key={mod.id}
                className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
                  checked
                    ? "border-teal/70 bg-ink-2 ring-1 ring-teal/50"
                    : "border-line bg-ink-2/40 hover:border-slate-600 hover:bg-ink-2/80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-steel">{mod.category}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModule(mod.id)}
                      className="mt-0.5 h-4 w-4 rounded border-line bg-ink text-teal accent-teal focus:ring-teal"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">{mod.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{mod.summary}</p>
                </div>
                <div className="mt-4 border-t border-line/60 pt-3">
                  <span className="text-[11px] font-medium text-slate-400">Key Deliverables:</span>
                  <ul className="mt-1 space-y-0.5">
                    {mod.deliverables.map((deliv) => (
                      <li key={deliv} className="text-[11px] text-slate-300">
                        • {deliv}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* Step 3: Operational Stage */}
      <section aria-labelledby="step-stage-heading">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal">Step 03</span>
            <h2 id="step-stage-heading" className="text-xl font-semibold text-white sm:text-2xl">
              Select operational stage
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STAGES.map((s) => {
            const active = s.id === stageId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageId(s.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-teal bg-ink-2 ring-1 ring-teal"
                    : "border-line bg-ink-2/60 hover:border-slate-600 hover:bg-ink-2"
                }`}
              >
                <h3 className="text-sm font-semibold text-white">{s.label}</h3>
                <p className="mt-1 text-xs text-slate-400">{s.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Generated Blueprint & Scope Synthesis */}
      <section
        aria-labelledby="blueprint-heading"
        className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal">
              System Architecture &amp; Delivery Blueprint
            </span>
            <h2 id="blueprint-heading" className="mt-1 text-2xl font-semibold text-white">
              {currentArchetype.name} Blueprint
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
              {complexityLevel}
            </span>
          </div>
        </div>

        {/* Recommended Stack Matrix */}
        <div className="mt-8">
          <h3 className="text-xs font-mono uppercase tracking-wider text-steel">
            Recommended Architecture Stack
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-line/80 bg-ink/70 p-4">
              <span className="text-xs font-medium text-teal">Experience Layer</span>
              <ul className="mt-2 space-y-1">
                {currentArchetype.recommendedStack.experience.map((item) => (
                  <li key={item} className="text-xs text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line/80 bg-ink/70 p-4">
              <span className="text-xs font-medium text-teal">Services &amp; APIs</span>
              <ul className="mt-2 space-y-1">
                {currentArchetype.recommendedStack.services.map((item) => (
                  <li key={item} className="text-xs text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line/80 bg-ink/70 p-4">
              <span className="text-xs font-medium text-teal">Data &amp; State</span>
              <ul className="mt-2 space-y-1">
                {currentArchetype.recommendedStack.data.map((item) => (
                  <li key={item} className="text-xs text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-line/80 bg-ink/70 p-4">
              <span className="text-xs font-medium text-teal">Deployment &amp; Cloud</span>
              <ul className="mt-2 space-y-1">
                {currentArchetype.recommendedStack.infrastructure.map((item) => (
                  <li key={item} className="text-xs text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Milestone Breakdown */}
        <div className="mt-8 border-t border-line pt-6">
          <h3 className="text-xs font-mono uppercase tracking-wider text-steel">
            Engineering Milestones &amp; Handoff Stages
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-4 rounded-lg border border-line/60 bg-ink/40 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal/20 text-xs font-mono font-medium text-teal">
                M1
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">System Specification &amp; Schema Contract</h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  Detailed technical brief, entity relationships, API surface definitions, and privacy boundaries.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-line/60 bg-ink/40 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal/20 text-xs font-mono font-medium text-teal">
                M2
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Foundation, UI Systems &amp; Core Pipeline</h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  Initial working prototype with responsive layout, mock data endpoints, and container setup.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-line/60 bg-ink/40 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal/20 text-xs font-mono font-medium text-teal">
                M3
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Full-Stack Integration &amp; Automated Verification</h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  Integration of active modules ({activeModules.length} selected), regression shields, and zero-leak privacy scans.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-line/60 bg-ink/40 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal/20 text-xs font-mono font-medium text-teal">
                M4
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Production Deployment &amp; Operational Handoff</h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  Deployment verification, performance benchmark audits, observability hooks, and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Guarantees Banner & Fallback Link */}
        <div className="mt-8 rounded-xl border border-steel/30 bg-[#162238] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Confidential &amp; Direct Execution</p>
              <p className="mt-1 text-xs text-slate-300">
                {claims.timeline} {claims.cost}
              </p>
            </div>
            <Link
              href={`/contact?topic=ai-automation&notes=${contactQuery}`}
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-teal/40 bg-teal/10 px-4 py-2 text-xs font-medium text-teal transition-colors hover:bg-teal hover:text-ink"
            >
              Discuss this scope privately
            </Link>
          </div>
        </div>
      </section>

      {/* Step 4: Transmit Scoped Requirements with Email & Details */}
      <section
        aria-labelledby="submit-scope-heading"
        className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col justify-between gap-2 border-b border-line pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-teal">Step 04</span>
            <h2 id="submit-scope-heading" className="text-xl font-semibold text-white sm:text-2xl">
              Send your scoped requirements
            </h2>
          </div>
          <span className="text-xs text-slate-400">Direct transmission to engineering leads</span>
        </div>

        {submitState === "success" ? (
          <div role="status" className="rounded-xl border border-teal/40 bg-teal/10 p-6 text-center">
            <h3 className="text-lg font-semibold text-white">Scoped Requirements Received</h3>
            <p className="mt-2 text-sm text-slate-300">
              Thank you. We have received your selected architecture stack and project details. Our
              engineering team will review your scope under strict confidentiality and follow up
              directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitState("idle");
                setName("");
                setEmail("");
                setCompany("");
                setUserNotes("");
              }}
              className="mt-5 rounded-md border border-line bg-ink px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Configure another scope
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitScope} noValidate className="space-y-5">
            <div className="rounded-lg border border-line/60 bg-ink/60 p-4 text-xs text-slate-300">
              <span className="font-semibold text-white">Selected Scope Summary: </span>
              {currentArchetype.name} ({currentStage.label}) · {activeModules.length} technical capabilities
              selected.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="est-name" className="text-xs font-medium text-slate-300">
                  Your Name <span className="text-teal">*</span>
                </label>
                <input
                  id="est-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Miller"
                  className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white focus:border-teal focus:outline-none"
                  aria-invalid={!!formErrors.name}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="est-email" className="text-xs font-medium text-slate-300">
                  Work Email <span className="text-teal">*</span>
                </label>
                <input
                  id="est-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white focus:border-teal focus:outline-none"
                  aria-invalid={!!formErrors.email}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="est-company" className="text-xs font-medium text-slate-300">
                Company or Organization (optional)
              </label>
              <input
                id="est-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white focus:border-teal focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="est-notes" className="text-xs font-medium text-slate-300">
                Project Context &amp; Details (optional)
              </label>
              <textarea
                id="est-notes"
                rows={3}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Share any specific requirements, current tech stack, or operational challenges..."
                className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white focus:border-teal focus:outline-none"
              />
            </div>

            {submitState === "error" && (
              <p role="alert" className="text-xs text-red-400">
                Could not transmit requirements. Please try again or reach out through our contact page.
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-xs text-slate-400">
                Transmitted under strict confidentiality. Zero data shared with third parties.
              </p>
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="inline-flex items-center justify-center rounded-md bg-teal px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-[#5fd6d3] disabled:opacity-50"
              >
                {submitState === "sending" ? "Transmitting Scope..." : "Send Scoped Architecture & Details"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
