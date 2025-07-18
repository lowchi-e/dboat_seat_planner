"use client"

import type { TeamMember } from "@/pages"
import styles from "./seating-stats.module.css"

interface SeatingStatsProps {
  teamMembers: TeamMember[]
  seatedMembers: TeamMember[]
  boatSize: 12 | 22
}

export function SeatingStats({ teamMembers, seatedMembers, boatSize }: SeatingStatsProps) {
  const totalMembers = teamMembers.length
  const seatedCount = seatedMembers.length
  const maxSeats = boatSize
  const seatingProgress = totalMembers > 0 ? (seatedCount / Math.min(totalMembers, maxSeats)) * 100 : 0

  // Weight distribution analysis
  const leftSideMembers = seatedMembers.filter((m) => m.side === "left")
  const rightSideMembers = seatedMembers.filter((m) => m.side === "right")
  const leftWeight = leftSideMembers.reduce((sum, m) => sum + m.weight, 0)
  const rightWeight = rightSideMembers.reduce((sum, m) => sum + m.weight, 0)
  const weightDifference = Math.abs(leftWeight - rightWeight)
  const weightBalance = weightDifference < 10 ? "Excellent" : weightDifference < 20 ? "Good" : "Needs Adjustment"

  // Experience distribution
  const experienceCounts = seatedMembers.reduce(
    (acc, member) => {
      acc[member.experience] = (acc[member.experience] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Gender distribution
  const genderCounts = seatedMembers.reduce(
    (acc, member) => {
      acc[member.gender] = (acc[member.gender] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Side preference satisfaction
  const preferencesSatisfied = seatedMembers.filter(
    (member) => member.sidePreference === "either" || member.sidePreference === member.side,
  ).length
  const preferenceSatisfaction = seatedMembers.length > 0 ? (preferencesSatisfied / seatedMembers.length) * 100 : 0

  return (
    <div className={styles.statsGrid}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Seating Progress</h3>
        <p className={styles.cardDescription}>Team members assigned to positions ({boatSize} seat boat)</p>
        <div className={styles.progressInfo}>
          <span>Seated: {seatedCount}</span>
          <span>Max: {maxSeats}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${seatingProgress}%` }} />
        </div>
        <div className={styles.progressText}>{Math.round(seatingProgress)}% Complete</div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Weight Balance</h3>
        <p className={styles.cardDescription}>Left vs Right side weight distribution</p>
        <div className={styles.weightGrid}>
          <div className={styles.weightSide}>
            <div className={styles.weightValue}>{leftWeight}kg</div>
            <div className={styles.weightLabel}>Left Side</div>
          </div>
          <div className={styles.weightSide}>
            <div className={styles.weightValue}>{rightWeight}kg</div>
            <div className={styles.weightLabel}>Right Side</div>
          </div>
        </div>
        <div className={styles.balanceInfo}>
          <span className={`${styles.balanceBadge} ${styles[weightBalance.toLowerCase().replace(" ", "")]}`}>
            {weightBalance}
          </span>
          <div className={styles.balanceText}>Difference: {weightDifference}kg</div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Preference Satisfaction</h3>
        <p className={styles.cardDescription}>Side preferences being met</p>
        <div className={styles.satisfactionValue}>{Math.round(preferenceSatisfaction)}%</div>
        <div className={styles.satisfactionLabel}>Preferences Satisfied</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${preferenceSatisfaction}%` }} />
        </div>
        <div className={styles.satisfactionText}>
          {preferencesSatisfied} of {seatedMembers.length} members
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Experience Distribution</h3>
        <p className={styles.cardDescription}>Skill level breakdown</p>
        <div className={styles.distributionList}>
          {Object.entries(experienceCounts).map(([level, count]) => (
            <div key={level} className={styles.distributionItem}>
              <span className={styles.distributionLabel}>{level}</span>
              <span className={styles.distributionCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Gender Distribution</h3>
        <p className={styles.cardDescription}>Team composition</p>
        <div className={styles.distributionList}>
          {Object.entries(genderCounts).map(([gender, count]) => (
            <div key={gender} className={styles.distributionItem}>
              <span className={styles.distributionLabel}>{gender}</span>
              <span className={styles.distributionCount}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Key Positions</h3>
        <p className={styles.cardDescription}>Drummer and Steerer assignments</p>
        <div className={styles.distributionList}>
          <div className={styles.distributionItem}>
            <span className={styles.distributionLabel}>Drummer</span>
            <span
              className={`${styles.distributionCount} ${seatedMembers.find((m) => m.position === 0) ? styles.assigned : styles.unassigned}`}
            >
              {seatedMembers.find((m) => m.position === 0)?.name || "Unassigned"}
            </span>
          </div>
          <div className={styles.distributionItem}>
            <span className={styles.distributionLabel}>Steerer</span>
            <span
              className={`${styles.distributionCount} ${seatedMembers.find((m) => m.position === 21) ? styles.assigned : styles.unassigned}`}
            >
              {seatedMembers.find((m) => m.position === 21)?.name || "Unassigned"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
