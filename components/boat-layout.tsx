"use client"

import type { TeamMember } from "@/pages"
import styles from "./boat-layout.module.css"

interface BoatLayoutProps {
  seatedMembers: TeamMember[]
  teamMembers: TeamMember[]
  onAssignSeat: (memberId: string, position: number, side?: "left" | "right") => void
  onRemoveSeat: (memberId: string) => void
  boatSize: 12 | 22
}

export function BoatLayout({ seatedMembers, teamMembers, onAssignSeat, onRemoveSeat, boatSize }: BoatLayoutProps) {
  const getMemberAtPosition = (position: number, side?: "left" | "right") => {
    return seatedMembers.find((member) => member.position === position && (side ? member.side === side : true))
  }

  const SeatSlot = ({
    position,
    side,
    label,
  }: {
    position: number
    side?: "left" | "right"
    label: string
  }) => {
    const currentMember = getMemberAtPosition(position, side)

    // Get all available members (not currently seated anywhere)
    const availableMembers = teamMembers.filter((member) => !seatedMembers.find((seated) => seated.id === member.id))

    const handleMemberSelect = (memberId: string) => {
      if (memberId === "") {
        // Empty selection - remove current member
        if (currentMember) {
          onRemoveSeat(currentMember.id)
        }
      } else {
        // Assign new member
        onAssignSeat(memberId, position, side)
      }
    }

    return (
      <div className={`${styles.seat} ${currentMember ? styles.occupied : styles.empty}`}>
        <div className={styles.seatLabel}>{label}</div>

        <select
          value={currentMember?.id || ""}
          onChange={(e) => handleMemberSelect(e.target.value)}
          className={styles.seatDropdown}
        >
          <option value="">-- Select Member --</option>
          {availableMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.weight}kg)
            </option>
          ))}
          {currentMember && (
            <option key={currentMember.id} value={currentMember.id}>
              {currentMember.name} ({currentMember.weight}kg) ✓
            </option>
          )}
        </select>

        {currentMember && (
          <div className={styles.memberInfo}>
            <div className={styles.memberName}>{currentMember.name}</div>
            <div className={styles.memberStats}>
              <span className={styles.weight}>{currentMember.weight}kg</span>
              <span className={styles.experience}>{currentMember.experience[0].toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const maxPairs = boatSize === 22 ? 10 : 5

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Dragon Boat Layout ({boatSize} seats)</h3>
        <p className={styles.description}>Front of boat is at the top. Select members from dropdowns.</p>
      </div>

      <div className={styles.boatContainer}>
        {/* Drummer */}
        <div className={styles.drummerSection}>
          <SeatSlot position={0} label="Drummer" />
        </div>

        {/* Paddler positions */}
        <div className={styles.paddlerSection}>
          {Array.from({ length: maxPairs }, (_, i) => {
            const pairNumber = i + 1
            const leftPosition = pairNumber * 2 - 1
            const rightPosition = pairNumber * 2

            return (
              <div key={pairNumber} className={styles.pairRow}>
                <SeatSlot position={leftPosition} side="left" label={`${pairNumber}L`} />
                <div className={styles.pairLabel}>Pair {pairNumber}</div>
                <SeatSlot position={rightPosition} side="right" label={`${pairNumber}R`} />
              </div>
            )
          })}
        </div>

        {/* Steerer */}
        <div className={styles.steererSection}>
          <SeatSlot position={21} label="Steerer" />
        </div>
      </div>

      <div className={styles.tips}>
        <h4 className={styles.tipsTitle}>Seating Tips:</h4>
        <ul className={styles.tipsList}>
          <li>Place heavier paddlers in the middle pairs</li>
          <li>Balance weight distribution left to right</li>
          <li>Consider side preferences for comfort</li>
          <li>Experienced paddlers can help guide beginners</li>
          <li>Drummer sets the pace, steerer controls direction</li>
        </ul>
      </div>
    </div>
  )
}
