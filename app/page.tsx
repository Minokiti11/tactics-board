import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero section with soccer field background */}
      <div
        className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-8"
        style={{
          backgroundColor: "#4CAF50", // Fallback green color
          backgroundImage: "url('/images/soccer_field.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Soccer Tactics Board</h1>
          <p className="text-xl text-white/90 mb-8">
            Plan your strategies, visualize formations, and share tactics with your team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/tactics">Create Tactics</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-black border-white hover:bg-white/10">
              <Link href="/examples">View Examples</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Interactive Board"
              description="Drag and drop players to create formations and set pieces"
              icon="layout-grid"
            />
            <FeatureCard
              title="Animation Tools"
              description="Create movement paths to demonstrate plays and strategies"
              icon="move"
            />
            <FeatureCard
              title="Share & Export"
              description="Share your tactics with your team or export as images"
              icon="share"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-green-600">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
