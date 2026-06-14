import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function SessionDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/session/:sessionNumber");
  const sessionNumber = params ? parseInt(params.sessionNumber) : 0;

  const { data: session, isLoading } = trpc.curriculum.sessionByNumber.useQuery({
    sessionNumber,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Button onClick={() => navigate("/curriculum")} variant="ghost" className="text-amber-500">
              ← Back to Curriculum
            </Button>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <p className="text-slate-400">Session not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/curriculum")} variant="ghost" className="text-amber-500">
            ← Back to Curriculum
          </Button>
          <div className="text-center">
            <div className="text-amber-500 font-bold text-sm">Session {session.sessionNumber.toString().padStart(2, "0")}</div>
            <div className="text-lg font-bold">{session.sessionTitle}</div>
          </div>
          <div />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Session Goal */}
        <div className="bg-slate-800 border border-amber-500 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Session Goal</h2>
          <p className="text-slate-200 text-lg">{session.sessionGoal}</p>
        </div>

        {/* Tactical Cockpit Segments */}
        <div className="space-y-12">
          {/* Anchor */}
          <TacticalSegment
            title="Anchor"
            content={session.anchor}
            description="Re-establish safety and control"
          />

          {/* Hook/Episode */}
          <TacticalSegment
            title="Hook / Episode"
            content={session.hookEpisode}
            description="Core concept illustrated through narrative"
          />

          {/* Mechanism */}
          <TacticalSegment
            title="Mechanism (Whiteboard Blueprint)"
            content={session.mechanism}
            description="Visual mapping of the pattern or concept"
          />

          {/* Mirror */}
          <TacticalSegment
            title="Mirror"
            content={session.mirror}
            description="Recognition without forced disclosure"
          />

          {/* Shift/Cliffhanger */}
          <TacticalSegment
            title="Shift / Cliffhanger"
            content={session.shiftCliffhanger}
            description="Bridge to next session"
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-16 justify-between">
          {session.sessionNumber > 0 && (
            <Button
              onClick={() => navigate(`/session/${session.sessionNumber - 1}`)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              ← Previous Session
            </Button>
          )}
          <Button
            onClick={() => navigate("/curriculum")}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            All Sessions
          </Button>
          {session.sessionNumber < 30 && (
            <Button
              onClick={() => navigate(`/session/${session.sessionNumber + 1}`)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Next Session →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TacticalSegment({ title, content, description }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-amber-500 mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-slate-300 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
