import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";

export default function Resources() {
  const [, navigate] = useLocation();
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const { data: resources, isLoading } = trpc.resources.all.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const resourceList = resources || [];
  const selected = selectedResource
    ? resourceList.find((r) => r.resourceType === selectedResource)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-amber-500">
            ← Back to Home
          </Button>
          <div className="text-xl font-bold text-amber-500">Facilitator Resources</div>
          <div />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Facilitator Resources</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Resource List */}
          <div className="lg:col-span-1">
            <div className="space-y-2 sticky top-20">
              {resourceList.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource.resourceType)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    selectedResource === resource.resourceType
                      ? "bg-amber-600 border-amber-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500"
                  }`}
                >
                  <div className="font-bold text-sm">{resource.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resource Content */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-amber-500 mb-6">{selected.title}</h2>
                <div className="prose prose-invert max-w-none">
                  <Streamdown>{selected.content}</Streamdown>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg text-center">
                <p className="text-slate-400">Select a resource to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
