import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-amber-500">WRH Portal</div>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate("/curriculum")} className="hover:text-amber-500 transition">Curriculum</button>
            <button onClick={() => navigate("/resources")} className="hover:text-amber-500 transition">Resources</button>
            <button onClick={() => navigate("/grants")} className="hover:text-amber-500 transition">Grants</button>
            <button onClick={() => navigate("/review")} className="hover:text-amber-500 transition">Review</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              What Really Happened
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              A trauma-informed psychoeducational program for veterans and justice-involved adults. Learn the mechanisms of trauma, understand your nervous system, and reclaim executive function.
            </p>
            <p className="text-slate-400 mb-8">
              <strong>30 sessions. 3 arcs. One mission:</strong> Teach the system. Build the tools. Restore agency.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/curriculum")} className="bg-amber-600 hover:bg-amber-700 text-white">
                Explore Curriculum
              </Button>
              <Button onClick={() => navigate("/resources")} variant="outline" className="border-amber-600 text-amber-500 hover:bg-amber-950">
                Facilitator Resources
              </Button>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg">
            <div className="space-y-4 text-slate-300">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-bold text-amber-500 mb-2">Target Populations</h3>
                <p className="text-sm">Veterans with complex trauma histories, justice-involved adults, reentry participants, high-risk populations</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-bold text-amber-500 mb-2">Delivery Model</h3>
                <p className="text-sm">Group-based, non-exposure, psychoeducational (not clinical therapy)</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-bold text-amber-500 mb-2">Core Outcomes</h3>
                <p className="text-sm">Improved self-regulation, reduced avoidant noncompliance, enhanced executive function, increased program engagement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Arcs Section */}
      <section className="bg-slate-900 border-y border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">The Three Arcs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
              <div className="text-amber-500 font-bold text-sm mb-2">ARC 1</div>
              <h3 className="text-xl font-bold mb-3">The Machine</h3>
              <p className="text-slate-300 text-sm mb-4">
                Sessions 0–10: How It Gets Built Into You. Understanding the mechanisms of trauma encoding and the nervous system patterns that drive behavior.
              </p>
              <Button onClick={() => navigate("/curriculum")} variant="ghost" className="text-amber-500 hover:text-amber-400 p-0">
                View Sessions →
              </Button>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
              <div className="text-amber-500 font-bold text-sm mb-2">ARC 2</div>
              <h3 className="text-xl font-bold mb-3">The Drivers</h3>
              <p className="text-slate-300 text-sm mb-4">
                Sessions 11–20: What Keeps the Engine Running. Exploring the psychological and behavioral drivers that maintain the pattern and the beliefs that sustain it.
              </p>
              <Button onClick={() => navigate("/curriculum")} variant="ghost" className="text-amber-500 hover:text-amber-400 p-0">
                View Sessions →
              </Button>
            </div>
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
              <div className="text-amber-500 font-bold text-sm mb-2">ARC 3</div>
              <h3 className="text-xl font-bold mb-3">The Interrupt & Restore</h3>
              <p className="text-slate-300 text-sm mb-4">
                Sessions 21–30: How You Rewrite the Code. Learning concrete tools to interrupt patterns, restore executive function, and rebuild agency.
              </p>
              <Button onClick={() => navigate("/curriculum")} variant="ghost" className="text-amber-500 hover:text-amber-400 p-0">
                View Sessions →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capitol Contracts Branding */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-amber-500">Capitol Contracts LLC</h3>
          <p className="text-slate-300 mb-4">
            Federal contracting firm specializing in trauma-informed psychoeducational programming for high-risk populations. The WRH program is deployment-ready for federal contracting, VA partnerships, and justice-involved reentry initiatives.
          </p>
          <p className="text-slate-400 text-sm">
            <strong>NAICS Code:</strong> 611710 (Educational Support Services) | <strong>SAM.gov Status:</strong> Active
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 text-center text-slate-400 text-sm">
        <p>© 2026 Capitol Contracts LLC. What Really Happened (WRH) Pilot Deployment Program.</p>
      </footer>
    </div>
  );
}
