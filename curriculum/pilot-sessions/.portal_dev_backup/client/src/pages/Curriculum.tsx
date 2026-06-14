import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function Curriculum() {
  const [, navigate] = useLocation();
  const { data: arcs, isLoading } = trpc.curriculum.arcs.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-amber-500">
            ← Back to Home
          </Button>
          <div className="text-xl font-bold text-amber-500">WRH Curriculum</div>
          <div />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">30-Session Curriculum</h1>

        {arcs?.map((arc) => (
          <ArcSection key={arc.id} arc={arc} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

function ArcSection({ arc, navigate }: any) {
  const { data: sessions, isLoading } = trpc.curriculum.sessionsForArc.useQuery({ arcId: arc.id });

  if (isLoading) {
    return (
      <div className="mb-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-amber-500 mb-2">{arc.arcTitle}</h2>
        <p className="text-slate-300">{arc.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions?.map((session: any) => (
          <button
            key={session.id}
            onClick={() => navigate(`/session/${session.sessionNumber}`)}
            className="bg-slate-800 border border-slate-700 hover:border-amber-500 p-6 rounded-lg text-left transition group"
          >
            <div className="text-amber-500 font-bold text-sm mb-2">
              Session {session.sessionNumber.toString().padStart(2, "0")}
            </div>
            <h3 className="text-lg font-bold group-hover:text-amber-500 transition mb-2">
              {session.sessionTitle}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2">
              {session.sessionGoal}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
