import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Foro Agora supabase" },
      { name: "description", content: "Welcome to Foro Agora supabase" },
    ],
  }),
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Foro Agora supabase</h1>
        <p className="mt-3 text-muted-foreground">Welcome to your new app.</p>
      </div>
    </main>
  );
}
