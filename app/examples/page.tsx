import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Tactical Examples</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example) => (
              <div key={example.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div
                  className="h-48 bg-green-600 relative"
                  style={{
                    backgroundColor: "#4CAF50", // Fallback green color
                    backgroundImage: "url('/images/soccer_field.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* This would show a preview of the tactic */}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{example.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{example.description}</p>
                  <Button asChild size="sm">
                    <Link href={`/tactics?template=${example.id}`}>Use This Template</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

const examples = [
  {
    id: "4-4-2",
    title: "4-4-2 Formation",
    description: "Classic formation with four defenders, four midfielders, and two strikers",
  },
  {
    id: "4-3-3",
    title: "4-3-3 Formation",
    description: "Attacking formation with four defenders, three midfielders, and three forwards",
  },
  {
    id: "3-5-2",
    title: "3-5-2 Formation",
    description: "Formation with three defenders, five midfielders, and two strikers",
  },
  {
    id: "corner-kick",
    title: "Corner Kick Strategy",
    description: "Positioning and movement for an offensive corner kick",
  },
  {
    id: "counter-attack",
    title: "Counter Attack",
    description: "Quick transition from defense to attack after winning possession",
  },
  {
    id: "high-press",
    title: "High Press",
    description: "Aggressive pressing strategy in the opponent's half",
  },
]
