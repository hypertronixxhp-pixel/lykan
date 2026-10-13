import type { Metadata } from "next";
import { ClosingCta, Eyebrow } from "@/components/ui";
import PortalDashboard from "@/components/PortalDashboard";

export const metadata: Metadata = {
  title: "Client Portal & Telemetry Dashboard",
  description:
    "Real-time milestone tracking, system health telemetry, automated test suite shields, and encrypted audit trails for active client engagements.",
};

export default function PortalPage() {
  return (
    <>
      <section className="py-20">
        <div className="wrap">
          <Eyebrow>Transparent Engineering Telemetry</Eyebrow>
          <h1 className="h-display max-w-3xl text-4xl sm:text-5xl">
            Client Portal &amp; System Telemetry
          </h1>
          <p className="measure mt-6 text-slate-300">
            A live look into our delivery cadence. Clients receive dedicated access to real-time milestone
            verification, edge performance telemetry, and an immutable audit log of verified deployments.
          </p>

          <div className="mt-12">
            <PortalDashboard />
          </div>
        </div>
      </section>

      <ClosingCta
        title="Ready to launch your dedicated engineering pod?"
        text="Discuss your roadmap and requirements under strict confidentiality. We can explore custom SLAs and deployment options."
        button="Discuss your project"
      />
    </>
  );
}
