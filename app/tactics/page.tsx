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

// 4-4-2 formation for home team
const formation442Home: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "home", position: { x: 5, y: 50 }, number: 1, positionName: "GK", direction: 0 },
  // Defenders (4)
  { team: "home", position: { x: 20, y: 20 }, number: 2, positionName: "RSB", direction: 0 },
  { team: "home", position: { x: 20, y: 40 }, number: 3, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 60 }, number: 4, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 80 }, number: 5, positionName: "LSB", direction: 0 },
  // Midfielders (4)
  { team: "home", position: { x: 33, y: 20 }, number: 6, positionName: "RMF", direction: 0 },
  { team: "home", position: { x: 33, y: 40 }, number: 7, positionName: "CMF", direction: 0 },
  { team: "home", position: { x: 33, y: 60 }, number: 8, positionName: "CMF", direction: 0 },
  { team: "home", position: { x: 33, y: 80 }, number: 9, positionName: "LMF", direction: 0 },
  // Forwards (2)
  { team: "home", position: { x: 46, y: 40 }, number: 10, positionName: "CF", direction: 0 },
  { team: "home", position: { x: 46, y: 60 }, number: 11, positionName: "CF", direction: 0 },
]

// 4-3-3 formation for home team
const formation433Home: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "home", position: { x: 5, y: 50 }, number: 1, positionName: "GK", direction: 0 },
  // Defenders (4)
  { team: "home", position: { x: 20, y: 20 }, number: 2, positionName: "RSB", direction: 0 },
  { team: "home", position: { x: 20, y: 40 }, number: 3, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 60 }, number: 4, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 80 }, number: 5, positionName: "LSB", direction: 0 },
  // Midfielders (3)
  { team: "home", position: { x: 30, y: 35 }, number: 6, positionName: "CMF", direction: 0 },
  { team: "home", position: { x: 30, y: 50 }, number: 7, positionName: "CMF", direction: 0 },
  { team: "home", position: { x: 30, y: 65 }, number: 8, positionName: "CMF", direction: 0 },
  // Forwards (3)
  { team: "home", position: { x: 40, y: 20 }, number: 9, positionName: "LWG", direction: 0 },
  { team: "home", position: { x: 47, y: 50 }, number: 10, positionName: "CF", direction: 0 },
  { team: "home", position: { x: 40, y: 80 }, number: 11, positionName: "RWG", direction: 0 },
]

// 4-2-3-1 formation for home team
const formation4231Home: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "home", position: { x: 5, y: 50 }, number: 1, positionName: "GK", direction: 0 },
  // Defenders (4)
  { team: "home", position: { x: 20, y: 20 }, number: 2, positionName: "RSB", direction: 0 },
  { team: "home", position: { x: 20, y: 40 }, number: 3, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 60 }, number: 4, positionName: "CB", direction: 0 },
  { team: "home", position: { x: 20, y: 80 }, number: 5, positionName: "LSB", direction: 0 },
  // Defensive Midfielders (2)
  { team: "home", position: { x: 30, y: 40 }, number: 6, positionName: "DMF", direction: 0 },
  { team: "home", position: { x: 30, y: 60 }, number: 7, positionName: "DMF", direction: 0 },
  // Attacking Midfielders (3)
  { team: "home", position: { x: 38, y: 20 }, number: 8, positionName: "LMF", direction: 0 },
  { team: "home", position: { x: 38, y: 50 }, number: 9, positionName: "OMF", direction: 0 },
  { team: "home", position: { x: 38, y: 80 }, number: 10, positionName: "RMF", direction: 0 },
  // Forward (1)
  { team: "home", position: { x: 47, y: 50 }, number: 11, positionName: "CF", direction: 0 },
]

// 4-4-2 formation for away team
const formation442Away: Omit<Player, "id">[] = [
  // Goalkeeper
  { team: "away", position: { x: 95, y: 50 }, number: 1, positionName: "GK", direction: 180 },
  // Defenders (4)
  { team: "away", position: { x: 80, y: 20 }, number: 2, positionName: "RSB", direction: 180 },
  { team: "away", position: { x: 80, y: 40 }, number: 3, positionName: "CB", direction: 180 },
  { team: "away", position: { x: 80, y: 60 }, number: 4, positionName: "CB", direction: 180 },
  { team: "away", position: { x: 80, y: 80 }, number: 5, positionName: "LSB", direction: 180 },
  // Midfielders (4)
  { team: "away", position: { x: 67, y: 20 }, number: 6, positionName: "RMF", direction: 180 },
  { team: "away", position: { x: 67, y: 40 }, number: 7, positionName: "CMF", direction: 180 },
  { team: "away", position: { x: 67, y: 60 }, number: 8, positionName: "CMF", direction: 180 },
  { team: "away", position: { x: 67, y: 80 }, number: 9, positionName: "LMF", direction: 180 },
  // Forwards (2)
  { team: "away", position: { x: 54, y: 40 }, number: 10, positionName: "CF", direction: 180 },
  { team: "away", position: { x: 54, y: 60 }, number: 11, positionName: "CF", direction: 180 },
]

// Create initial players with IDs
const createInitialPlayers = (): Player[] => {
  return [
    ...formation442Home.map((player) => ({
      ...player,
      id: `home-player-${player.number}`,
    })),
    ...formation442Away.map((player) => ({
      ...player,
      id: `away-player-${player.number}`,
    })),
  ]
}

// フォーメーションの型定義を追加
type Formation = "4-4-2" | "4-3-3" | "4-2-3-1"

export default function TacticsBoard() {
  const [players, setPlayers] = useState<Player[]>(createInitialPlayers)
  const [selectedTeam, setSelectedTeam] = useState<"home" | "away">("home")
  const [selectedFormation, setSelectedFormation] = useState<Formation>("4-4-2")
  const [isDragging, setIsDragging] = useState(false)
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const boardRef = useRef<HTMLDivElement>(null)

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

  // フォーメーションを切り替える関数
  const changeFormation = (formation: Formation) => {
    setSelectedFormation(formation)
    const homeFormation = formation === "4-4-2" ? formation442Home :
                         formation === "4-3-3" ? formation433Home :
                         formation4231Home
    const awayFormation = formation442Away // 現在は4-4-2のみ

    setPlayers([
      ...homeFormation.map((player) => ({
        ...player,
        id: `home-player-${player.number}`,
      })),
      ...awayFormation.map((player) => ({
        ...player,
        id: `away-player-${player.number}`,
      })),
    ])
  }

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
              
              {/* フォーメーション選択ドロップダウン */}
              <select
                value={selectedFormation}
                onChange={(e) => changeFormation(e.target.value as Formation)}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="4-4-2">4-4-2</option>
                <option value="4-3-3">4-3-3</option>
                <option value="4-2-3-1">4-2-3-1</option>
              </select>
            </div>

            <div className="flex gap-2">
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

                {/* Player circle with number */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${player.team === "home" ? "bg-blue-600" : "bg-red-600"}`}
                >
                  {player.positionName}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-gray-600">
            <p>Drag to move.</p>
            <p className="text-sm mt-1">
              <RotateCw className="inline h-3 w-3 mr-1" />
              Player positions: GK (Goalkeeper), CB (Center Back), RSB/LSB (Right/Left Back), CMF (Center Mid), RMF/LMF
              (Right/Left Mid), CF (Center Forward), WG (Winger)
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
