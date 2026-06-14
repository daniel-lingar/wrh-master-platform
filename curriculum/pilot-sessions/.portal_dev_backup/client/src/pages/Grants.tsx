import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, ExternalLink } from "lucide-react";

export default function Grants() {
  const [, navigate] = useLocation();
  const { data: grants, isLoading } = trpc.grants.all.useQuery();

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
          <div className="text-xl font-bold text-amber-500">Grant Opportunities</div>
          <div />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Grant Opportunities Tracker</h1>
        <p className="text-slate-300 mb-12">
          Federal and private grant sources aligned with the WRH program mission. All deadlines are post-April 15, 2026.
        </p>

        <div className="space-y-6">
          {grants?.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GrantCard({ grant }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-amber-500 p-6 rounded-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-amber-500 mb-1">{grant.grantName}</h3>
          <p className="text-slate-400 text-sm">{grant.funder}</p>
        </div>
        {grant.url && (
          <a
            href={grant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <div className="text-slate-400 font-bold">Deadline</div>
          <div className="text-slate-200">{grant.deadline}</div>
        </div>
        <div>
          <div className="text-slate-400 font-bold">Funding Amount</div>
          <div className="text-slate-200">{grant.fundingAmount}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-slate-400 font-bold text-sm mb-2">Description</div>
        <p className="text-slate-300 text-sm">{grant.description}</p>
      </div>

      <div>
        <div className="text-slate-400 font-bold text-sm mb-2">WRH Alignment</div>
        <p className="text-slate-300 text-sm border-l-2 border-amber-500 pl-3">
          {grant.alignment}
        </p>
      </div>
    </div>
  );
}
