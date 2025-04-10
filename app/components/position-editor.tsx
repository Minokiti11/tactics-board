"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type PositionEditorProps = {
  playerId: string
  currentPosition: string
  onPositionChange: (playerId: string, newPosition: string) => void
}

const positionOptions = [
  { value: "GK", label: "Goalkeeper (GK)" },
  { value: "CB", label: "Center Back (CB)" },
  { value: "RB", label: "Right Back (RB)" },
  { value: "LB", label: "Left Back (LB)" },
  { value: "CM", label: "Center Midfielder (CM)" },
  { value: "RM", label: "Right Midfielder (RM)" },
  { value: "LM", label: "Left Midfielder (LM)" },
  { value: "DM", label: "Defensive Midfielder (DM)" },
  { value: "AM", label: "Attacking Midfielder (AM)" },
  { value: "CF", label: "Center Forward (CF)" },
  { value: "ST", label: "Striker (ST)" },
  { value: "WG", label: "Winger (WG)" },
]

export function PositionEditor({ playerId, currentPosition, onPositionChange }: PositionEditorProps) {
  const [position, setPosition] = useState(currentPosition)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    onPositionChange(playerId, position)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs font-bold bg-white/80 rounded px-1 hover:bg-white">{currentPosition}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Player Position</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={position} onValueChange={setPosition} className="grid grid-cols-2 gap-2">
            {positionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Position</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
