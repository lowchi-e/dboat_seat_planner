"use client"

import type { TeamMember } from "@/pages"
import styles from "./team-roster.module.css"

interface TeamRosterProps {
  teamMembers: TeamMember[]
  onRemoveMember: (id: string) => void
}

export function TeamRoster({ teamMembers, onRemoveMember }: TeamRosterProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Team Roster</h3>
        <p className={styles.description}>Manage your team members and their details</p>
      </div>

      {teamMembers.length === 0 ? (
        <div className={styles.emptyState}>No team members added yet. Use the form to add your first member.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Weight</th>
                <th>Side Pref</th>
                <th>Gender</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td className={styles.nameCell}>{member.name}</td>
                  <td>{member.weight}kg</td>
                  <td>
                    <span className={`${styles.badge} ${styles[member.sidePreference]}`}>{member.sidePreference}</span>
                  </td>
                  <td>
                    <span className={styles.badge}>{member.gender}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[member.experience]}`}>{member.experience}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className={styles.deleteButton}
                      title="Remove member"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
