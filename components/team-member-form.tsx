"use client"

import type React from "react"

import { useState } from "react"
import type { TeamMember } from "@/pages"
import styles from "./team-member-form.module.css"

interface TeamMemberFormProps {
  onAddMember: (member: Omit<TeamMember, "id">) => void
}

export function TeamMemberForm({ onAddMember }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    sidePreference: "either" as "left" | "right" | "either",
    gender: "male" as "male" | "female" | "other",
    experience: "intermediate" as "beginner" | "intermediate" | "advanced",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.weight) return

    onAddMember({
      name: formData.name,
      weight: Number.parseFloat(formData.weight),
      sidePreference: formData.sidePreference,
      gender: formData.gender,
      experience: formData.experience,
    })

    setFormData({
      name: "",
      weight: "",
      sidePreference: "either",
      gender: "male",
      experience: "intermediate",
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Add Team Member</h3>
        <p className={styles.description}>Enter member details for seating arrangement</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter name"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="weight" className={styles.label}>
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
            placeholder="Enter weight"
            min="40"
            max="150"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Side Preference</label>
          <select
            value={formData.sidePreference}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sidePreference: e.target.value as "left" | "right" | "either" }))
            }
            className={styles.select}
          >
            <option value="left">Left (Port)</option>
            <option value="right">Right (Starboard)</option>
            <option value="either">Either Side</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gender: e.target.value as "male" | "female" | "other" }))
            }
            className={styles.select}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Experience Level</label>
          <select
            value={formData.experience}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                experience: e.target.value as "beginner" | "intermediate" | "advanced",
              }))
            }
            className={styles.select}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Member
        </button>
      </form>
    </div>
  )
}
