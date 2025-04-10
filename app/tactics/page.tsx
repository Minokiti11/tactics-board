"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, Share, Trash2, Undo, Download, AlertCircle, RotateCw } from "lucide-react"
import Link from "next/link"
import { SoccerField } from "../components/soccer-field"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Player type definition with position name and direction
type Player = {
  id: string
  team: "home" | "away"
  position: { x: number; y: number }
  number?: number
  positionName: string
  direction: number // angle in degrees
}

// Default 4-4-2 formation for home team with position names
const defaultHomeFormation: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "home", position: { x: 10, y: 50 }, number: 1, positionName: "GK", direction: 0 },
  // Defenders (4)
  { team: "home", position: { x: 20, y: 20 }, number: 2, positionName: "RB", direction: 0 },
  { team: "home", position: { x: 20, y: 40 }, number: 3, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 60 }, number: 4, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 80 }, number: 5, positionName: "LB", direction: 0 },
  // Midfielders (4)
  { team: "home", position: { x: 40, y: 20 }, number: 6, positionName: "RM", direction: 0 },
  { team: "home", position: { x: 40, y: 40 }, number: 7, positionName: "CM", direction: 0 },
  { team: "home", position: { x: 40, y: 60 }, number: 8, positionName: "CM", direction: 0 },
  { team: "home", position: { x: 40, y: 80 }, number: 9, positionName: "LM", direction: 0 },
  // Forwards (2)
  { team: "home", position: { x: 60, y: 35 }, number: 10, positionName: "CF", direction: 0 },
  { team: "home", position: { x: 60, y: 65 }, number: 11, positionName: "CF", direction: 0 },
]

// Default 4-4-2 formation for away team with position names
const defaultAwayFormation: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "away", position: { x: 90, y: 50 }, number: 1, positionName: "GK", direction: 180 },
  // Defenders (4)
  { team: "away", position: { x: 80, y: 20 }, number: 2, positionName: "RB", direction: 180 },
  { team: "away", position: { x: 80, y: 40 }, number: 3, positionName: "CB", direction: 180 },
  { team: "away", position: { x: 80, y: 60 }, number: 4, positionName: "CB", direction: 180 },
  { team: "away", position: { x: 80, y: 80 }, number: 5, positionName: "LB", direction: 180 },
  // Midfielders (4)
  { team: "away", position: { x: 60, y: 20 }, number: 6, positionName: "RM", direction: 180 },
  { team: "away", position: { x: 60, y: 40 }, number: 7, positionName: "CM", direction: 180 },
  { team: "away", position: { x: 60, y: 60 }, number: 8, positionName: "CM", direction: 180 },
  { team: "away", position: { x: 60, y: 80 }, number: 9, positionName: "LM", direction: 180 },
  // Forwards (2)
  { team: "away", position: { x: 40, y: 35 }, number: 10, positionName: "CF", direction: 180 },
  { team: "away", position: { x: 40, y: 65 }, number: 11, positionName: "CF", direction: 180 },
]

// Create initial players with IDs
const createInitialPlayers = (): Player[] => {
  return [
    ...defaultHomeFormation.map((player) => ({
      ...player,
      id: `home-player-${player.number}`,
    })),
    ...defaultAwayFormation.map((player) => ({
      ...player,
      id: `away-player-${player.number}`,
    })),
  ]
}

export default function TacticsBoard() {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers)
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home")
  const [isDragging, setIsDragging] = useState(false)
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const boardRef = useRef<HTMLDivElement>(null)

  // Add a player to the field
  const addPlayer = (e: React.MouseEvent) => {
    if (!boardRef.current || isDragging) return

    // Count current players for the selected team
    const teamPlayerCount = players.filter((p) => p.team === selectedTeam).length

    // Check if team already has 11 players
    if (teamPlayerCount >= 11) {
      setAlertMessage(`Cannot add more than 11 players to the ${selectedTeam} team.`)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    const rect = boardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Don't add if clicking on an existing player
    if (
      e.target instanceof Element &&
      (e.target.classList.contains("player") || e.target.parentElement?.classList.contains("player"))
    ) {
      return
    }

    // Default direction based on team
    const direction = selectedTeam === "home" ? 0 : 180

    const newPlayer: Player = {
      id: `${selectedTeam}-player-${Date.now()}`,
      team: selectedTeam,
      position: { x, y },
      number: teamPlayerCount + 1,
      positionName: "MF", // Default position name
      direction: direction,
    }

    setPlayers([...players, newPlayer])
  }

  // Start dragging a player
  const startDrag = (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedPlayer(playerId)
  }

  // Handle dragging
  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !draggedPlayer || !boardRef.current) return

    const rect = boardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Update player position
    setPlayers(players.map((player) => (player.id === draggedPlayer ? { ...player, position: { x, y } } : player)))
  }

  // End dragging
  const endDrag = () => {
    setIsDragging(false)
    setDraggedPlayer(null)
  }

  // Rotate a player
  const rotatePlayer = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault() // Prevent default context menu
    e.stopPropagation()

    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          // Rotate by 45 degrees
          const newDirection = (player.direction + 45) % 360
          return { ...player, direction: newDirection }
        }
        return player
      }),
    )
  }

  // Clear all players
  const clearPlayers = () => {
    setPlayers([])
  }

  // Reset to default formation
  const resetToDefault = () => {
    setPlayers(createInitialPlayers())
  }

  // Remove the last added player
  const removeLastPlayer = () => {
    const teamPlayers = players.filter((p) => p.team === selectedTeam)
    if (teamPlayers.length === 0) return

    const lastPlayer = teamPlayers[teamPlayers.length - 1]
    setPlayers(players.filter((p) => p.id !== lastPlayer.id))
  }

  // Check if image loads
  useEffect(() => {
    const img = new Image()
    img.src = "/images/soccer_field.png"
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageLoaded(false)
  }, [])

  // Set up event listeners
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        endDrag()
      }
    }

    // Prevent context menu on the board
    const handleContextMenu = (e: MouseEvent) => {
      if (boardRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("contextmenu", handleContextMenu)

    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [isDragging])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={removeLastPlayer}>
              <Undo className="h-4 w-4 mr-2" />
              Remove Last
            </Button>
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              <Save className="h-4 w-4 mr-2" />
              Reset to 4-4-2
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedTeam === "home" ? "default" : "outline"}
                onClick={() => setSelectedTeam("home")}
                className={selectedTeam === "home" ? "bg-blue-600" : ""}
              >
                Home Team ({players.filter((p) => p.team === "home").length}/11)
              </Button>
              <Button
                variant={selectedTeam === "away" ? "default" : "outline"}
                onClick={() => setSelectedTeam("away")}
                className={selectedTeam === "away" ? "bg-red-600" : ""}
              >
                Away Team ({players.filter((p) => p.team === "away").length}/11)
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearPlayers}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {showAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          {/* Soccer field */}
          <div
            ref={boardRef}
            className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border-2 border-white shadow-lg bg-green-600"
            onClick={addPlayer}
            onMouseMove={handleDrag}
            style={
              imageLoaded
                ? {
                    backgroundImage: "url('/images/soccer_field.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {/* Fallback field markings if image doesn't load */}
            {!imageLoaded && <SoccerField />}

            {/* Players */}
            {players.map((player) => (
              <div
                key={player.id}
                className={`player absolute flex flex-col items-center justify-center cursor-move`}
                style={{
                  left: `calc(${player.position.x}% - 20px)`,
                  top: `calc(${player.position.y}% - 20px)`,
                  touchAction: "none",
                  zIndex: draggedPlayer === player.id ? 10 : 1,
                }}
                onMouseDown={(e) => startDrag(e, player.id)}
                onContextMenu={(e) => rotatePlayer(e, player.id)}
              >
                {/* Direction triangle */}
                <div
                  className={`w-0 h-0 
                    border-l-[10px] border-l-transparent 
                    border-r-[10px] border-r-transparent 
                    border-b-[15px] ${player.team === "home" ? "border-b-blue-600" : "border-b-red-600"}`}
                  style={{
                    transform: `rotate(${player.direction}deg)`,
                    marginBottom: "-5px",
                  }}
                />

                {/* Player circle with number */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${player.team === "home" ? "bg-blue-600" : "bg-red-600"}`}
                >
                  {player.number}
                </div>

                {/* Position name */}
                <div className="mt-1 px-1 text-xs font-bold bg-white/80 rounded">{player.positionName}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-gray-600">
            <p>Click on the field to add players. Drag to move. Right-click to rotate direction.</p>
            <p className="text-sm mt-1">
              <RotateCw className="inline h-3 w-3 mr-1" />
              Player positions: GK (Goalkeeper), CB (Center Back), RB/LB (Right/Left Back), CM (Center Mid), RM/LM
              (Right/Left Mid), CF (Center Forward), WG (Winger)
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
