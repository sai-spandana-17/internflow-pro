import { createFileRoute } from "@tanstack/react-router";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternFlow — Internship Application Tracking" },
      { name: "description", content: "Mission-control dashboard for tracking internship applications, interviews, and offers." },
      { property: "og:title", content: "InternFlow — Internship Application Tracking" },
      { property: "og:description", content: "Mission-control dashboard for tracking internship applications, interviews, and offers." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
