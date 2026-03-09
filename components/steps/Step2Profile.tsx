"use client";

import { useSectionSave } from "./useSectionSave";
import AIGenerateButton from "@/ai/AIGenerateButton";
import {
  SectionHeading,
  AddButton,
  ItemCard,
  Field,
  IconRemove,
  inputStyle,
} from "./ui";
import type {
  ResumeSection,
  SummaryContent,
  SkillsContent,
  CertificationItem,
  LanguageItem,
} from "@/types/resume";

interface Props {
  resumeId: string;
  jobTitle: string;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

const PROFICIENCY = [
  "Native",
  "Fluent",
  "Professional",
  "Conversational",
  "Basic",
] as const;

export default function Step2Profile({
  resumeId,
  jobTitle,
  sections,
  onSectionsChange,
}: Props) {
  const { updateSection, ensureSection } = useSectionSave(
    resumeId,
    sections,
    onSectionsChange,
  );

  // ── Read directly from sections (single source of truth) ──
  const summarySection = sections.find((s) => s.type === "summary");
  const skillsSection = sections.find((s) => s.type === "skills");
  const certsSection = sections.find((s) => s.type === "certifications");
  const langsSection = sections.find((s) => s.type === "languages");

  const summaryText =
    (summarySection?.content as SummaryContent | undefined)?.text ?? "";
  const skillCats =
    (skillsSection?.content as SkillsContent | undefined)?.categories ?? [];
  const certItems =
    (certsSection?.content as CertificationItem[] | undefined) ?? [];
  const langItems = (langsSection?.content as LanguageItem[] | undefined) ?? [];

  // ── Updaters ─────────────────────────────────────────────

  function handleSummaryChange(text: string) {
    if (summarySection) updateSection(summarySection.id, { text });
  }

  function handleSkillsChange(cats: SkillsContent["categories"]) {
    if (skillsSection) updateSection(skillsSection.id, { categories: cats });
  }

  function handleCertsChange(items: CertificationItem[]) {
    if (certsSection) updateSection(certsSection.id, items);
  }

  function handleLangsChange(items: LanguageItem[]) {
    if (langsSection) updateSection(langsSection.id, items);
  }

  const inp = inputStyle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Summary ── */}
      <div>
        <SectionHeading
          label="Professional Summary"
          action={
            summarySection ? (
              <AIGenerateButton
                type="summary"
                label="Generate"
                prefillContext={{ jobTitle }}
                contextFields={[
                  {
                    key: "jobTitle",
                    label: "Job title",
                    placeholder: "Senior Engineer",
                  },
                  {
                    key: "background",
                    label: "Background",
                    placeholder: "5 years building…",
                    multiline: true,
                  },
                ]}
                onAccept={handleSummaryChange}
              />
            ) : undefined
          }
        />
        {summarySection ? (
          <textarea
            value={summaryText}
            onChange={(e) => handleSummaryChange(e.target.value)}
            rows={5}
            placeholder="Write 2–4 sentences about your background and key strengths…"
            style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
          />
        ) : (
          <AddButton
            label="Add Summary"
            onClick={() => ensureSection("summary")}
          />
        )}
      </div>

      {/* ── Skills ── */}
      <div>
        <SectionHeading
          label="Skills"
          action={
            skillsSection ? (
              <AIGenerateButton
                type="skills"
                label="Generate"
                contextFields={[
                  {
                    key: "jobTitle",
                    label: "Job title",
                    placeholder: "Full Stack Developer",
                  },
                  {
                    key: "experience",
                    label: "Experience",
                    placeholder: "Built React apps, Node APIs…",
                    multiline: true,
                  },
                ]}
                onAccept={(text) => {
                  const cats = text
                    .split("\n")
                    .filter(Boolean)
                    .map((line) => {
                      const ci = line.indexOf(":");
                      return ci > -1
                        ? {
                            id: crypto.randomUUID(),
                            name: line.slice(0, ci).trim(),
                            skills: line.slice(ci + 1).trim(),
                          }
                        : {
                            id: crypto.randomUUID(),
                            name: "",
                            skills: line.trim(),
                          };
                    });
                  handleSkillsChange(cats);
                }}
              />
            ) : undefined
          }
        />
        {skillsSection ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {skillCats.map((cat) => (
              <div
                key={cat.id}
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <input
                  value={cat.name}
                  onChange={(e) =>
                    handleSkillsChange(
                      skillCats.map((c) =>
                        c.id === cat.id ? { ...c, name: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="Category"
                  style={{ ...inp, width: "30%", flexShrink: 0 }}
                />
                <input
                  value={cat.skills}
                  onChange={(e) =>
                    handleSkillsChange(
                      skillCats.map((c) =>
                        c.id === cat.id ? { ...c, skills: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="React, TypeScript…"
                  style={{ ...inp, flex: 1 }}
                />
                <IconRemove
                  onClick={() =>
                    handleSkillsChange(skillCats.filter((c) => c.id !== cat.id))
                  }
                />
              </div>
            ))}
            <AddButton
              label="Add skill category"
              onClick={() =>
                handleSkillsChange([
                  ...skillCats,
                  { id: crypto.randomUUID(), name: "", skills: "" },
                ])
              }
            />
          </div>
        ) : (
          <AddButton
            label="Add Skills"
            onClick={() => ensureSection("skills")}
          />
        )}
      </div>

      {/* ── Languages ── */}
      <div>
        <SectionHeading label="Languages" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {langItems.map((lang) => (
            <div
              key={lang.id}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <input
                value={lang.language}
                onChange={(e) =>
                  handleLangsChange(
                    langItems.map((l) =>
                      l.id === lang.id ? { ...l, language: e.target.value } : l,
                    ),
                  )
                }
                placeholder="Language"
                style={{ ...inp, flex: 1 }}
              />
              <select
                value={lang.proficiency}
                onChange={(e) =>
                  handleLangsChange(
                    langItems.map((l) =>
                      l.id === lang.id
                        ? { ...l, proficiency: e.target.value }
                        : l,
                    ),
                  )
                }
                style={{ ...inp, width: "auto", cursor: "pointer" }}
              >
                {PROFICIENCY.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <IconRemove
                onClick={() =>
                  handleLangsChange(langItems.filter((l) => l.id !== lang.id))
                }
              />
            </div>
          ))}
          <AddButton
            label="Add language"
            onClick={async () => {
              const s = langsSection ?? (await ensureSection("languages"));
              const current =
                (s.content as LanguageItem[] | undefined) ?? langItems;
              const updated: LanguageItem[] = [
                ...current,
                {
                  id: crypto.randomUUID(),
                  language: "",
                  proficiency: "Professional",
                },
              ];
              updateSection(s.id, updated);
            }}
          />
        </div>
      </div>

      {/* ── Certifications ── */}
      <div>
        <SectionHeading label="Certifications" />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {certItems.map((cert) => (
            <ItemCard
              key={cert.id}
              title={cert.name || "New Certification"}
              onRemove={() =>
                handleCertsChange(certItems.filter((c) => c.id !== cert.id))
              }
            >
              <Field label="Certification Name">
                <input
                  value={cert.name}
                  onChange={(e) =>
                    handleCertsChange(
                      certItems.map((c) =>
                        c.id === cert.id ? { ...c, name: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="AWS Solutions Architect"
                  style={inp}
                />
              </Field>
              <div style={{ display: "flex", gap: 8 }}>
                <Field label="Issuing Organization">
                  <input
                    value={cert.issuer}
                    onChange={(e) =>
                      handleCertsChange(
                        certItems.map((c) =>
                          c.id === cert.id
                            ? { ...c, issuer: e.target.value }
                            : c,
                        ),
                      )
                    }
                    placeholder="Amazon Web Services"
                    style={inp}
                  />
                </Field>
                <Field label="Date">
                  <input
                    value={cert.date}
                    onChange={(e) =>
                      handleCertsChange(
                        certItems.map((c) =>
                          c.id === cert.id ? { ...c, date: e.target.value } : c,
                        ),
                      )
                    }
                    placeholder="2024"
                    style={{ ...inp, width: 80 }}
                  />
                </Field>
              </div>
              <Field label="Credential URL" optional>
                <input
                  value={cert.url ?? ""}
                  onChange={(e) =>
                    handleCertsChange(
                      certItems.map((c) =>
                        c.id === cert.id ? { ...c, url: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="https://credential.net/…"
                  style={inp}
                />
              </Field>
            </ItemCard>
          ))}
          <AddButton
            label="Add certification"
            onClick={async () => {
              const s = certsSection ?? (await ensureSection("certifications"));
              const current =
                (s.content as CertificationItem[] | undefined) ?? certItems;
              const updated: CertificationItem[] = [
                ...current,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  issuer: "",
                  date: "",
                  url: "",
                },
              ];
              updateSection(s.id, updated);
            }}
          />
        </div>
      </div>
    </div>
  );
}
