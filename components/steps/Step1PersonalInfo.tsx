"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { savePersonalInfo } from "@/actions/builder.actions";
import { Field, SectionHeading, VisibilityToggle, inputCls } from "./ui";
import type { PersonalInfo } from "@/types/resume";
import { DEFAULT_PERSONAL_INFO } from "@/types/resume";

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
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo must be under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("photoUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Save status */}
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] text-rv-muted m-0">
          Optional fields can be toggled on/off.
        </p>
        <span
          className={[
            "text-[0.7rem] transition-opacity duration-300",
            status === "idle" ? "opacity-0" : "opacity-100",
            status === "error"
              ? "text-rv-accent"
              : status === "saving"
                ? "text-rv-muted"
                : "text-[#2d8a4e]",
          ].join(" ")}
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
        <div className="flex flex-col gap-2.5">
          <Field label="Full Name">
            <input
              value={info.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Jane Doe"
              className={inputCls}
            />
          </Field>
          <Field label="Job Title / Headline">
            <input
              value={info.jobTitle}
              onChange={(e) => set("jobTitle", e.target.value)}
              placeholder="Senior Product Designer"
              className={inputCls}
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
          <div className="flex items-center gap-3.5">
            {/* Avatar circle */}
            <div
              onClick={() => photoInputRef.current?.click()}
              className={[
                "w-16 h-16 rounded-full overflow-hidden cursor-pointer shrink-0 flex items-center justify-center bg-rv-cream transition-colors duration-150",
                info.photoUrl
                  ? "border-2 border-rv-accent"
                  : "border-2 border-dashed border-rv-border hover:border-rv-accent",
              ].join(" ")}
            >
              {info.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover object-top block"
                />
              ) : (
                <CameraIcon />
              )}
            </div>

            <div className="flex-1">
              <button
                onClick={() => photoInputRef.current?.click()}
                className="block w-full px-3 py-2 bg-transparent border border-rv-border rounded-sm cursor-pointer text-rv-ink text-[0.8rem] text-left mb-1 hover:border-rv-accent transition-colors"
              >
                {info.photoUrl ? "Change photo…" : "Upload photo…"}
              </button>
              <p className="text-[0.7rem] text-rv-muted m-0">
                JPG, PNG or WebP · Max 2 MB
              </p>
              {info.photoUrl && (
                <button
                  onClick={() => set("photoUrl", "")}
                  className="mt-1 bg-transparent border-0 cursor-pointer text-rv-accent text-[0.72rem] p-0 hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        )}
      </div>

      {/* ── Contact ── */}
      <div>
        <SectionHeading label="Contact" />
        <div className="flex flex-col gap-2.5">
          <Field label="Email">
            <input
              type="email"
              value={info.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              value={info.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputCls}
            />
          </Field>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[0.7rem] font-semibold text-rv-muted tracking-[0.04em]">
                Address <span className="font-normal">(optional)</span>
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
                className={`${inputCls} w-full`}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Online Profiles ── */}
      <div>
        <SectionHeading label="Online Profiles" />
        <div className="flex flex-col gap-2.5">
          <Field label="LinkedIn">
            <input
              value={info.linkedin}
              onChange={(e) => set("linkedin", e.target.value)}
              placeholder="linkedin.com/in/janedoe"
              className={inputCls}
            />
          </Field>
          <Field label="GitHub">
            <input
              value={info.github}
              onChange={(e) => set("github", e.target.value)}
              placeholder="github.com/janedoe"
              className={inputCls}
            />
          </Field>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[0.7rem] font-semibold text-rv-muted tracking-[0.04em]">
                Website <span className="font-normal">(optional)</span>
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
                className={`${inputCls} w-full`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5.5 h-5.5 stroke-rv-muted fill-none"
      strokeWidth={1.5}
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
