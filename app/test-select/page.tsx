"use client"
import { Select, SelectItem } from "@heroui/react"
import { useState } from "react"
export default function TestPage() {
  const [val, setVal] = useState("")
  return (
    <div>
      <Select 
        label="Test Select" 
        onChange={(e) => {
          setVal(e.target.value)
          console.log("Selected value:", e.target.value)
        }}
        data-testid="select-obj"
      >
        <SelectItem key="Event Coordinator - 영사관 기획팀">Event Coordinator - 영사관 기획팀</SelectItem>
      </Select>
      <div id="output" data-val={val}>{val}</div>
    </div>
  )
}
