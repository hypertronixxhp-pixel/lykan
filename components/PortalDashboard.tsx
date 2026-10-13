"use client";

import { useState } from "react";
import Link from "next/link";
import { claims } from "@/lib/claims";

type Tab = "milestones" | "telemetry" | "audit";

type Milestone = {
  id: string;
  phase: string;
  title: string;
  status: "Completed" | "Active" | "Upcoming";
  target: string;
  deliverables: string[];
};

const MILESTONES: Milestone[] = [
  {
    id: "m1",
    phase: "Milestone 01",
    title: "System Blueprint & Schema Contract",
    status: "Completed",
    target: "Sprint 01",
    deliverables: [
      "Entity-relationship schema & database migration script",
      "Typed REST & GraphQL API specifications",
      "Threat model & zero-leak privacy boundary documentation",
    ],
  },
  {
    id: "m2",
    phase: "Milestone 02",
    title: "Design Tokens & Interactive Prototype",
    status: "Completed",
    target: "Sprint 02",
    deliverables: [
      "Accessible Tailwind v4 design system tokens",
      "Interactive high-density operations UI",
      "Mobile-responsive navigation & keyboard shortcuts",
    ],
  },
  {
    id: "m3",
    phase: "Milestone 03",
    title: "Core Pipeline & Asynchronous Workers",
    status: "Active",
    target: "Sprint 03 · In Progress",
    deliverables: [
      "Supervised ML document triage and exception inbox",
      "Zero-downtime database queue synchronization",
      "Role-based authorization and session guards",
    ],
  },
  {
    id: "m4",
    phase: "Milestone 04",
    title: "Regression Shield & Production Launch",
    status: "Upcoming",
    target: "Sprint 04",
    deliverables: [
      "Automated end-to-end regression test suite",
      "Edge caching & Core Web Vitals optimization",
      "Containerized production deployment & monitoring hooks",
    ],
  },
];

type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
  status: "Verified" | "Deployed";
};

const AUDIT_LOG: AuditEntry[] = [
  {
    id: "LOG-409",
    timestamp: "10 minutes ago",
    actor: "CI Test Shield",
    action: "Privacy Scan Verified",
    detail: "Scanned client bundle and built HTML. Zero banned terms or confidential leaks detected.",
    status: "Verified",
  },
  {
    id: "LOG-408",
    timestamp: "1 hour ago",
    actor: "Core Engine Pod",
    action: "Queue Buffer Optimized",
    detail: "Refactored async event worker to batch incoming webhook payloads, reducing p99 latency.",
    status: "Deployed",
  },
  {
    id: "LOG-407",
    timestamp: "3 hours ago",
    actor: "Security Engine",
    action: "RBAC Matrix Enforced",
    detail: "Restricted administrative export actions to verified hardware keys and SSO roles.",
    status: "Verified",
  },
  {
    id: "LOG-406",
    timestamp: "Yesterday",
    actor: "Frontend Pod",
    action: "Static Route Prerendering",
    detail: "Generated 29 static pages with dynamicParams=false for edge deployment.",
    status: "Deployed",
  },
];

export default function PortalDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("milestones");
  const [simulationRole, setSimulationRole] = useState<"client" | "tech">("client");

  return (
    <div className="space-y-8">
      {/* Top Bar: Overview & Status */}
      <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live Project Environment
              </span>
              <span className="text-xs text-slate-400">Project Reference: LYK-9024</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Enterprise Operations Platform
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Confidential client environment · Encrypted private execution
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-line bg-ink/70 p-1">
              <button
                type="button"
                onClick={() => setSimulationRole("client")}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  simulationRole === "client"
                    ? "bg-teal text-ink font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Executive View
              </button>
              <button
                type="button"
                onClick={() => setSimulationRole("tech")}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  simulationRole === "tech"
                    ? "bg-teal text-ink font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Technical Deep-Dive
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Health & Performance Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-line/80 bg-ink/60 p-4">
            <span className="text-xs text-steel">Milestone Status</span>
            <div className="mt-2 text-2xl font-bold text-white">Milestone 03</div>
            <p className="mt-1 text-xs text-slate-400">Core Pipeline &amp; Async Workers</p>
          </div>

          <div className="rounded-xl border border-line/80 bg-ink/60 p-4">
            <span className="text-xs text-steel">Test Shield Verification</span>
            <div className="mt-2 text-2xl font-bold text-emerald-400">All Passed</div>
            <p className="mt-1 text-xs text-slate-400">Automated build &amp; privacy suites</p>
          </div>

          <div className="rounded-xl border border-line/80 bg-ink/60 p-4">
            <span className="text-xs text-steel">Average Edge Latency</span>
            <div className="mt-2 text-2xl font-bold text-teal font-mono">142 ms</div>
            <p className="mt-1 text-xs text-slate-400">Global response time</p>
          </div>

          <div className="rounded-xl border border-line/80 bg-ink/60 p-4">
            <span className="text-xs text-steel">System Availability</span>
            <div className="mt-2 text-2xl font-bold text-white font-mono">99.99%</div>
            <p className="mt-1 text-xs text-slate-400">Uptime across active clusters</p>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="flex border-b border-line">
        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "milestones"
              ? "border-teal text-teal"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Delivery Milestones
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("telemetry")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "telemetry"
              ? "border-teal text-teal"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          System Telemetry &amp; Uptime
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === "audit"
              ? "border-teal text-teal"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Audit Log &amp; Verified Changes
        </button>
      </div>

      {/* Tab 1: Delivery Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-ink-2 p-6">
            <h3 className="text-lg font-semibold text-white">Sprint Roadmap &amp; Deliverables</h3>
            <p className="mt-1 text-xs text-slate-300">
              Each milestone represents an autonomous engineering cycle with tangible deliverables.
            </p>

            <div className="mt-6 space-y-4">
              {MILESTONES.map((m) => {
                const statusStyles = {
                  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                  Active: "bg-teal/10 text-teal border-teal/40 animate-pulse",
                  Upcoming: "bg-slate-500/10 text-slate-400 border-slate-700",
                }[m.status];

                return (
                  <div
                    key={m.id}
                    className="rounded-xl border border-line/80 bg-ink/70 p-5 transition-colors hover:border-slate-600"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <span className="text-xs font-mono text-steel">{m.phase}</span>
                        <h4 className="text-base font-semibold text-white">{m.title}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{m.target}</span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles}`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-line/60 pt-3">
                      <span className="text-xs font-medium text-slate-400">Shipped Deliverables:</span>
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {m.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-teal">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: System Telemetry */}
      {activeTab === "telemetry" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Edge Performance */}
          <div className="rounded-xl border border-line bg-ink-2 p-6">
            <h3 className="text-base font-semibold text-white">Edge Response Latency (24h)</h3>
            <p className="mt-1 text-xs text-slate-400">Global requests served from closest edge point.</p>
            <div className="mt-6 flex h-40 items-end gap-2 border-b border-line pb-2">
              {[124, 138, 142, 131, 145, 139, 148, 142, 136, 140, 142, 139].map((val, idx) => {
                const heightPercent = Math.round((val / 180) * 100);
                return (
                  <div key={idx} className="group relative flex-1 flex flex-col items-center">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-t bg-teal/60 transition-all group-hover:bg-teal"
                    />
                    <span className="mt-2 text-[10px] text-slate-500 font-mono">
                      {idx * 2}h
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400 font-mono">
              <span>Min: 124 ms</span>
              <span>Avg: 142 ms</span>
              <span>p99: 168 ms</span>
            </div>
          </div>

          {/* Test Shield & Privacy Status */}
          <div className="rounded-xl border border-line bg-ink-2 p-6">
            <h3 className="text-base font-semibold text-white">Automated Privacy &amp; Build Shield</h3>
            <p className="mt-1 text-xs text-slate-400">Guaranteed regression protection on every deployment.</p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-line/60 bg-ink/50 p-3">
                <span className="text-xs text-slate-300">Confidentiality &amp; Banned-Term Scanner</span>
                <span className="text-xs font-semibold text-emerald-400">0 Leaks Detected</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-line/60 bg-ink/50 p-3">
                <span className="text-xs text-slate-300">TypeScript Static Strict Checking</span>
                <span className="text-xs font-semibold text-emerald-400">Pass (0 Errors)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-line/60 bg-ink/50 p-3">
                <span className="text-xs text-slate-300">Internal Broken Link Crawler</span>
                <span className="text-xs font-semibold text-emerald-400">100% Valid (200 OK)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-line/60 bg-ink/50 p-3">
                <span className="text-xs text-slate-300">Accessibility &amp; Keyboard Controls</span>
                <span className="text-xs font-semibold text-emerald-400">WCAG AA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Log */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-line bg-ink-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Verified Audit Trail</h3>
              <p className="mt-1 text-xs text-slate-400">
                Immutable change history and verification sign-offs.
              </p>
            </div>
            <span className="text-xs font-mono text-teal">Encrypted Ledger</span>
          </div>

          <div className="mt-6 space-y-3">
            {AUDIT_LOG.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-line/60 bg-ink/50 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-steel">{entry.id}</span>
                    <span className="text-xs text-slate-500">· {entry.timestamp}</span>
                    <span className="text-xs font-medium text-slate-300">[{entry.actor}]</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-white">{entry.action}</h4>
                  <p className="mt-0.5 text-xs text-slate-400">{entry.detail}</p>
                </div>
                <span className="inline-flex shrink-0 items-center rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Confidentiality Footer */}
      <div className="rounded-xl border border-steel/30 bg-[#162238] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Need custom telemetry or enterprise SSO?</p>
            <p className="mt-1 text-xs text-slate-300">
              {claims.speed} {claims.hosting}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-teal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-[#5fd6d3]"
          >
            Request dedicated pod access
          </Link>
        </div>
      </div>
    </div>
  );
}
