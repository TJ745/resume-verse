"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { savePersonalInfo } from "@/actions/builder.actions";
import {
  Field,
  SectionHeading,
  VisibilityToggle,
  inputStyle,
  labelStyle,
} from "./ui";
import type { PersonalInfo } from "@/types/resume";
import { DEFAULT_PERSONAL_INFO } from "@/types/resume";
import Image from "next/image";

interface Props {
  resumeId: string;
  personalInfo: PersonalInfo | null;
  onSave: (p: PersonalInfo) => void;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function Step1PersonalInfo({
  resumeId,
  personalInfo,
  onSave,
}: Props) {
  const [info, setInfo] = useState<PersonalInfo>({
    ...DEFAULT_PERSONAL_INFO,
    ...(personalInfo ?? {}),
  });
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestInfo = useRef(info);
  //   latestInfo.current = info;

  useEffect(() => {
    latestInfo.current = info;
  });

  const persist = useCallback(
    async (data: PersonalInfo) => {
      setStatus("saving");
      try {
        await savePersonalInfo(resumeId, data);
        onSave(data);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    [resumeId, onSave],
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => persist(latestInfo.current), 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [info, persist]);

  function set<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  const inp = inputStyle;

  return (
    <div className="flex flex-col gap-4">
      {/* Save status bar */}
      <div className="flex items-center justify-between">
        <p style={{ fontSize: "0.7rem", color: "var(--rv-muted)", margin: 0 }}>
          Optional fields can be toggled on/off.
        </p>
        <span
          style={{
            fontSize: "0.7rem",
            color:
              status === "error"
                ? "var(--rv-accent)"
                : status === "saving"
                  ? "var(--rv-muted)"
                  : "#2d8a4e",
            opacity: status === "idle" ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {status === "saving"
            ? "Saving…"
            : status === "error"
              ? "Save failed"
              : "Saved ✓"}
        </span>
      </div>

      {/* ── Identity ── */}
      <div>
        <SectionHeading label="Identity" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Full Name">
            <input
              value={info.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Jane Doe"
              style={inp}
            />
          </Field>
          <Field label="Job Title / Headline">
            <input
              value={info.jobTitle}
              onChange={(e) => set("jobTitle", e.target.value)}
              placeholder="Senior Product Designer"
              style={inp}
            />
          </Field>
        </div>
      </div>

      {/* ── Photo ── */}
      <div>
        <SectionHeading
          label="Photo"
          action={
            <VisibilityToggle
              label="Show on resume"
              enabled={info.showPhoto}
              onToggle={() => set("showPhoto", !info.showPhoto)}
            />
          }
        />
        {info.showPhoto && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Field label="Photo URL" optional>
              <input
                value={info.photoUrl}
                onChange={(e) => set("photoUrl", e.target.value)}
                placeholder="https://example.com/photo.jpg"
                style={inp}
              />
            </Field>
            {info.photoUrl && (
              <Image
                src={info.photoUrl}
                alt="Preview"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid var(--rv-border)",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                width={1000}
                height={1000}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Contact ── */}
      <div>
        <SectionHeading label="Contact" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Email">
            <input
              type="email"
              value={info.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@example.com"
              style={inp}
            />
          </Field>
          <Field label="Phone">
            <input
              value={info.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={inp}
            />
          </Field>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label style={labelStyle}>
                Address <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <VisibilityToggle
                label="Show"
                enabled={info.showAddress}
                onToggle={() => set("showAddress", !info.showAddress)}
              />
            </div>
            {info.showAddress && (
              <input
                value={info.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="New York, NY, USA"
                style={inp}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Online Profiles ── */}
      <div>
        <SectionHeading label="Online Profiles" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="LinkedIn">
            <input
              value={info.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="linkedin.com/in/janedoe"
              style={inp}
            />
          </Field>
          <Field label="GitHub">
            <input
              value={info.github}
              onChange={(e) => set("github", e.target.value)}
              placeholder="github.com/janedoe"
              style={inp}
            />
          </Field>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label style={labelStyle}>
                Website <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <VisibilityToggle
                label="Show"
                enabled={info.showWebsite}
                onToggle={() => set("showWebsite", !info.showWebsite)}
              />
            </div>
            {info.showWebsite && (
              <input
                value={info.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="janedoe.dev"
                style={inp}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Personal Details ── */}
      <div>
        <SectionHeading
          label="Personal Details"
          action={
            <VisibilityToggle
              label="Show on resume"
              enabled={info.showMaritalStatus}
              onToggle={() => set("showMaritalStatus", !info.showMaritalStatus)}
            />
          }
        />
        {info.showMaritalStatus && (
          <Field label="Marital Status" optional>
            <select
              value={info.maritalStatus}
              onChange={(e) => set("maritalStatus", e.target.value)}
              style={{ ...inp, cursor: "pointer" }}
            >
              <option value="">Prefer not to say</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </Field>
        )}
      </div>
    </div>
  );
}
