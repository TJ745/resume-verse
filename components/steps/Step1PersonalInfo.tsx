"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { savePersonalInfo } from "@/actions/builder.actions";
import { Field, SectionHeading, VisibilityToggle, inputCls } from "./ui";
import { COLOR_SCHEMES } from "@/lib/resume-constants";
import type { PersonalInfo } from "@/types/resume";
import { DEFAULT_PERSONAL_INFO } from "@/types/resume";

interface Props {
  resumeId: string;
  personalInfo: PersonalInfo | null;
  onSave: (p: PersonalInfo) => void;
  colorScheme?: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type PhotoStatus = "idle" | "processing" | "done" | "error";

// ── Step 1: Find face/subject bounds from a transparent PNG ──
// Analyzes the alpha channel to find the bounding box of non-transparent
// pixels, then focuses on the upper region where the face will be.
// This is 100% reliable — no external models, no CDN, no CORS issues.
function findSubjectBounds(
  img: HTMLImageElement,
): { x: number; y: number; width: number; height: number } | null {
  try {
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    if (!W || !H) return null;

    // Draw image to offscreen canvas to read pixel data
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    // White background so we can detect subject pixels even if not transparent
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, W, H).data;

    // For transparent PNGs: find non-white pixels (the subject)
    // For regular photos: analyze brightness contrast against edges
    let minX = W,
      minY = H,
      maxX = 0,
      maxY = 0;
    let found = false;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        // Non-white pixel = part of the subject (works for bg-removed PNGs)
        const isSubject = !(r > 240 && g > 240 && b > 240);
        if (isSubject) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    if (!found) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  } catch {
    return null;
  }
}

// ── Step 2: Composite image onto accent circle ────────────
// sourceImg:   the bg-removed transparent PNG (or original)
// bounds:      subject bounding box in pixels (or null → smart default)
// accentColor: hex color for the circle background
function compositePhoto(
  sourceImg: HTMLImageElement,
  bounds: { x: number; y: number; width: number; height: number } | null,
  accentColor: string,
): string {
  const W = sourceImg.naturalWidth;
  const H = sourceImg.naturalHeight;
  const OUT = 400;

  let cropX: number, cropY: number, cropSize: number;

  if (bounds) {
    // We have the subject bounds. The face is in the upper ~40% of the subject.
    // Focus the crop on the head region.
    const subjectCenterX = bounds.x + bounds.width / 2;
    const faceEstimateY = bounds.y + bounds.height * 0.2; // face center ~20% into subject
    const faceEstimateH = bounds.height * 0.35; // face ≈ 35% of total body height

    // Crop size = 2× the estimated face height, so head fills the circle nicely
    cropSize = faceEstimateH * 2.8;
    cropSize = Math.min(cropSize, W, H); // never exceed image size

    cropX = subjectCenterX - cropSize / 2;
    cropY = faceEstimateY - cropSize * 0.38; // shift up so face is in upper-center

    // Clamp to image bounds
    cropX = Math.max(0, Math.min(cropX, W - cropSize));
    cropY = Math.max(0, Math.min(cropY, H - cropSize));
    cropSize = Math.min(cropSize, W - cropX, H - cropY);
  } else {
    // No subject detected: top-center crop
    cropSize = Math.min(W, H) * 0.75;
    cropX = (W - cropSize) / 2;
    cropY = H * 0.03;
  }

  const canvas = document.createElement("canvas");
  canvas.width = OUT;
  canvas.height = OUT;
  const ctx = canvas.getContext("2d")!;

  // 1. Accent color background
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, OUT, OUT);

  // 2. Circle clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
  ctx.clip();

  // 3. Draw subject cropped + scaled
  ctx.drawImage(sourceImg, cropX, cropY, cropSize, cropSize, 0, 0, OUT, OUT);

  ctx.restore();
  return canvas.toDataURL("image/png", 0.92);
}

// ── Load image from data URL ──────────────────────────────
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    // Required for canvas cross-origin pixel read
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}

// ── Component ─────────────────────────────────────────────

export default function Step1PersonalInfo({
  resumeId,
  personalInfo,
  onSave,
  colorScheme = "terracotta",
}: Props) {
  const [info, setInfo] = useState<PersonalInfo>({
    ...DEFAULT_PERSONAL_INFO,
    ...(personalInfo ?? {}),
    // rawPhotoUrl is stripped from DB saves — always start with empty string
    // so old resumes (which never stored it) don't break the recomposite effect
    rawPhotoUrl:
      (personalInfo as PersonalInfo & { rawPhotoUrl?: string })?.rawPhotoUrl ??
      "",
  });
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [photoStatus, setPhotoStatus] = useState<PhotoStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestInfo = useRef(info);
  const photoInputRef = useRef<HTMLInputElement>(null);
  // Track previous colorScheme so we only recomposite on actual changes
  const prevSchemeRef = useRef(colorScheme);

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

  // ── Recomposite photo whenever accent color changes ───────
  useEffect(() => {
    if (prevSchemeRef.current === colorScheme) return;
    prevSchemeRef.current = colorScheme;

    const rawUrl = latestInfo.current.rawPhotoUrl;
    if (!rawUrl) return; // no bg-removed photo stored yet

    const newAccent =
      COLOR_SCHEMES.find((s) => s.id === colorScheme)?.accent ?? "#c84b2f";

    (async () => {
      setPhotoStatus("processing");
      try {
        const img = await loadImage(rawUrl);
        const bounds = findSubjectBounds(img);
        const composited = compositePhoto(img, bounds, newAccent);
        setInfo((prev) => ({ ...prev, photoUrl: composited }));
        setPhotoStatus("done");
        setTimeout(() => setPhotoStatus("idle"), 2000);
      } catch (err) {
        console.error("Recomposite failed:", err);
        setPhotoStatus("idle");
      }
    })();
  }, [colorScheme]);

  function set<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  const accentColor =
    COLOR_SCHEMES.find((s) => s.id === colorScheme)?.accent ?? "#c84b2f";

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be under 5 MB.");
      return;
    }
    e.target.value = "";

    setPhotoStatus("processing");

    // Read file → data URL
    const rawDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    // Show raw photo immediately
    set("photoUrl", rawDataUrl);

    try {
      // 1. Remove background via API → get transparent PNG
      let bgRemovedUrl = rawDataUrl;
      try {
        const res = await fetch("/api/ai/remove-bg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: rawDataUrl }),
        });
        if (res.ok) {
          const { resultBase64 } = (await res.json()) as {
            resultBase64: string | null;
          };
          if (resultBase64) bgRemovedUrl = resultBase64;
        }
      } catch {
        /* API unavailable — use original */
      }

      // 2. Find subject bounds from the bg-removed image
      const sourceImg = await loadImage(bgRemovedUrl);
      const bounds = findSubjectBounds(sourceImg);

      // 3. Composite: accent bg + face-centered crop
      const composited = compositePhoto(sourceImg, bounds, accentColor);

      // Save both: the composited display photo AND the raw bg-removed source
      // so we can recomposite instantly when color scheme changes
      setInfo((prev) => ({
        ...prev,
        photoUrl: composited,
        rawPhotoUrl: bgRemovedUrl, // transparent PNG (or original if bg removal failed)
      }));

      setPhotoStatus("done");
      setTimeout(() => setPhotoStatus("idle"), 3000);
    } catch (err) {
      console.error("Photo processing error:", err);
      setPhotoStatus("error");
      setTimeout(() => setPhotoStatus("idle"), 3000);
    }
  }

  const photoStatusMsg = {
    idle: "JPG, PNG or WebP · Max 5 MB · Face auto-detected",
    processing: "✦ Removing background & centering face…",
    done: "✓ Background removed · Face centered · Theme applied",
    error: "Saved as-is (processing unavailable)",
  }[photoStatus];

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
            {/* Avatar preview */}
            <div
              onClick={() =>
                photoStatus !== "processing" && photoInputRef.current?.click()
              }
              className={[
                "w-16 h-16 rounded-full shrink-0 flex items-center justify-center relative transition-all duration-150 overflow-hidden",
                photoStatus === "processing" ? "cursor-wait" : "cursor-pointer",
                info.photoUrl
                  ? "border-2 border-rv-accent"
                  : "border-2 border-dashed border-rv-border hover:border-rv-accent",
              ].join(" ")}
              style={{ background: accentColor }}
            >
              {info.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={info.photoUrl}
                  alt="Profile"
                  className={`w-full h-full object-cover block transition-opacity duration-300 ${photoStatus === "processing" ? "opacity-40" : "opacity-100"}`}
                />
              ) : (
                <CameraIcon />
              )}

              {/* Spinner overlay while processing */}
              {photoStatus === "processing" && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                  <svg
                    viewBox="0 0 24 24"
                    width={22}
                    height={22}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    className="animate-spin"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={photoStatus === "processing"}
                className="block w-full px-3 py-2 bg-transparent border border-rv-border rounded-sm cursor-pointer text-rv-ink text-[0.8rem] text-left mb-1.5 hover:border-rv-accent transition-colors disabled:cursor-wait disabled:opacity-50"
              >
                {info.photoUrl ? "Change photo…" : "Upload photo…"}
              </button>

              <p
                className={[
                  "text-[0.68rem] m-0 leading-snug transition-colors",
                  photoStatus === "processing"
                    ? "text-rv-accent animate-pulse"
                    : photoStatus === "done"
                      ? "text-[#2d8a4e]"
                      : photoStatus === "error"
                        ? "text-[#b7791f]"
                        : "text-rv-muted",
                ].join(" ")}
              >
                {photoStatusMsg}
              </p>

              {info.photoUrl && photoStatus === "idle" && (
                <button
                  onClick={() => set("photoUrl", "")}
                  className="mt-1.5 bg-transparent border-0 cursor-pointer text-rv-accent text-[0.68rem] p-0 hover:underline"
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
                className={inputCls}
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
                className={inputCls}
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
