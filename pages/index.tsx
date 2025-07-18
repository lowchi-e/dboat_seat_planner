import { useEffect } from "react"
import { useState } from "react"
import { TeamMemberForm } from "@/components/team-member-form"
import { BoatLayout } from "@/components/boat-layout"
import { TeamRoster } from "@/components/team-roster"
import { SeatingStats } from "@/components/seating-stats"
import styles from "./../styles/page.module.css"

export interface TeamMember {
  id: string
  name: string
  weight: number
  sidePreference: "left" | "right" | "either"
  gender: "male" | "female" | "other"
  experience: "beginner" | "intermediate" | "advanced"
  position?: number // 1-20 for paddler positions, 0 for drummer, 21 for steerer
  side?: "left" | "right" // actual assigned side
}

function encodeState(data: TeamMember[]) {
  return encodeURIComponent(btoa(JSON.stringify(data)))
}

function decodeState(param: string) {
  try {
    return JSON.parse(atob(decodeURIComponent(param)))
  } catch (e) {
    console.error("Invalid URL param", e)
    return []
  }
}


export default function DragonBoatSeatingPlan() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [seatedMembers, setSeatedMembers] = useState<TeamMember[]>([])
  const [activeTab, setActiveTab] = useState<"planner" | "roster" | "stats">("planner")
  const [boatSize, setBoatSize] = useState<12 | 22>(22)

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const teamData = params.get("team")
  const seatedData = params.get("seated")

  if (teamData) {
    const decodedTeam = decodeState(teamData)
    setTeamMembers(decodedTeam)
  }
  if (seatedData) {
    const decodedSeated = decodeState(seatedData)
    setSeatedMembers(decodedSeated)
  }
}, [])


  const addTeamMember = (member: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
    }
    setTeamMembers((prev) => [...prev, newMember])
  }

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id))
    setSeatedMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const assignSeat = (memberId: string, position: number, side?: "left" | "right") => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    // Remove member from current position if any
    setSeatedMembers((prev) => prev.filter((m) => m.id !== memberId))

    // Add member to new position
    const updatedMember = { ...member, position, side }
    setSeatedMembers((prev) => [...prev, updatedMember])
  }

  const removeSeat = (memberId: string) => {
    setSeatedMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const clearAllSeats = () => {
    setSeatedMembers([])
  }

  const changeBoatSize = (newSize: 12 | 22) => {
    setBoatSize(newSize)
    // Clear seats that don't exist in the new boat size
    if (newSize === 12) {
      // Remove positions beyond pair 5 (positions 11-20)
      setSeatedMembers((prev) =>
        prev.filter((member) => {
          if (member.position === 0 || member.position === 21) return true // Keep drummer and steerer
          return member.position && member.position <= 10 // Keep only positions 1-10 (pairs 1-5)
        }),
      )
    }
  }

  const autoArrange = () => {
    const availableMembers = teamMembers.filter((member) => !seatedMembers.find((seated) => seated.id === member.id))
    const sortedByWeight = [...availableMembers].sort((a, b) => b.weight - a.weight)
    const newSeatedMembers: TeamMember[] = []

    // Assign drummer (lightest experienced person)
    const drummer = availableMembers.filter((m) => m.experience !== "beginner").sort((a, b) => a.weight - b.weight)[0]
    if (drummer) {
      newSeatedMembers.push({ ...drummer, position: 0 })
    }

    // Assign steerer (experienced person)
    const steerer = availableMembers
      .filter((m) => m.id !== drummer?.id && m.experience !== "beginner")
      .sort((a, b) => b.weight - a.weight)[0]
    if (steerer) {
      newSeatedMembers.push({ ...steerer, position: 21 })
    }

    // Assign paddlers based on boat size
    const paddlers = sortedByWeight.filter((m) => m.id !== drummer?.id && m.id !== steerer?.id)
    const maxPairs = boatSize === 22 ? 10 : 5
    const positionOrder =
      boatSize === 22
        ? [5, 6, 7, 8, 4, 9, 3, 10, 2, 11, 1, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        : [3, 4, 2, 5, 1, 6, 7, 8, 9, 10] // For 12-seat boat

    paddlers.slice(0, maxPairs * 2).forEach((member, index) => {
      const position = positionOrder[Math.floor(index / 2)]
      const side = member.sidePreference !== "either" ? member.sidePreference : index % 2 === 0 ? "left" : "right"

      if (position) {
        newSeatedMembers.push({ ...member, position, side })
      }
    })

    setSeatedMembers(newSeatedMembers)
  }

  const availableMembers = teamMembers.filter((member) => !seatedMembers.find((seated) => seated.id === member.id))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dragon Boat Seating Planner</h1>
        <p className={styles.subtitle}>Organize your team for optimal performance</p>
      </div>

      <div className={styles.boatSizeSelector}>
        <label className={styles.boatSizeLabel}>Boat Size:</label>
        <select
          value={boatSize}
          onChange={(e) => changeBoatSize(Number(e.target.value) as 12 | 22)}
          className={styles.boatSizeSelect}
        >
          <option value={12}>12 Seats (5 pairs + drummer + steerer)</option>
          <option value={22}>22 Seats (10 pairs + drummer + steerer)</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button onClick={autoArrange} className={styles.primaryButton}>
          Auto Arrange
        </button>
        <button onClick={clearAllSeats} className={styles.secondaryButton}>
          Clear All Seats
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "planner" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("planner")}
        >
          Seating Planner
        </button>
        <button
          className={`${styles.tab} ${activeTab === "roster" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("roster")}
        >
          Team Roster
        </button>
        <button
          className={`${styles.tab} ${activeTab === "stats" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
      </div>

<button
  onClick={() => {
    const teamEncoded = encodeState(teamMembers)
    const seatedEncoded = encodeState(seatedMembers)
    const baseUrl = `${window.location.origin}${window.location.pathname}`
    const shareUrl = `${baseUrl}?team=${teamEncoded}&seated=${seatedEncoded}`
    navigator.clipboard.writeText(shareUrl)
    alert("Sharable URL copied to clipboard!")
  }}
  className={styles.secondaryButton}
>
  Copy Shareable URL
</button>


      <div className={styles.content}>
        {activeTab === "planner" && (
          <div className={styles.plannerLayout}>
            <div className={styles.boatSection}>
              <BoatLayout
                seatedMembers={seatedMembers}
                teamMembers={teamMembers}
                onAssignSeat={assignSeat}
                onRemoveSeat={removeSeat}
                boatSize={boatSize}
              />
            </div>
            <div className={styles.sidePanel}>
              <TeamMemberForm onAddMember={addTeamMember} />
              <div className={styles.availableMembers}>
                <h3>Available Members ({availableMembers.length})</h3>
                <div className={styles.membersList}>
                  {availableMembers.map((member) => (
                    <div key={member.id} className={styles.memberCard}>
                      <div className={styles.memberName}>{member.name}</div>
                      <div className={styles.memberDetails}>
                        {member.weight}kg • {member.sidePreference} • {member.experience}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roster" && <TeamRoster teamMembers={teamMembers} onRemoveMember={removeTeamMember} />}

        {activeTab === "stats" && (
          <SeatingStats teamMembers={teamMembers} seatedMembers={seatedMembers} boatSize={boatSize} />
        )}
      </div>
    </div>
  )
}
