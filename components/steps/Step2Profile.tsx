"use client";

import { useSectionSave } from "./useSectionSave";
import AIGenerateButton from "@/ai/AIGenerateButton";
import {
  SectionHeading,
  AddButton,
  ItemCard,
  Field,
  IconRemove,
  inputCls,
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
  const { updateSection, ensureSection, ensureSectionWithContent } =
    useSectionSave(resumeId, sections, onSectionsChange);

  // ── Derive from sections prop (single source of truth) ───
  const summarySection = sections.find((s) => s.type === "summary");
  const skillsSection = sections.find((s) => s.type === "skills");
  const certsSection = sections.find((s) => s.type === "certifications");
  const langsSection = sections.find((s) => s.type === "languages");

  const summaryText =
    (summarySection?.content as SummaryContent | undefined)?.text ?? "";

  const rawSkills = skillsSection?.content;
  const skillCats: SkillsContent["categories"] =
    rawSkills &&
    typeof rawSkills === "object" &&
    !Array.isArray(rawSkills) &&
    "categories" in rawSkills
      ? (rawSkills as SkillsContent).categories
      : [];

  const certItems: CertificationItem[] = Array.isArray(certsSection?.content)
    ? (certsSection!.content as CertificationItem[])
    : [];

  const langItems: LanguageItem[] = Array.isArray(langsSection?.content)
    ? (langsSection!.content as LanguageItem[])
    : [];

  // ── Updaters — always read fresh from sections prop ──────

  function handleSkillsChange(cats: SkillsContent["categories"]) {
    const s = sections.find((sec) => sec.type === "skills");
    if (s) updateSection(s.id, { categories: cats });
  }

  function handleCertsChange(items: CertificationItem[]) {
    const s = sections.find((sec) => sec.type === "certifications");
    if (s) updateSection(s.id, items);
  }

  function handleLangsChange(items: LanguageItem[]) {
    const s = sections.find((sec) => sec.type === "languages");
    if (s) updateSection(s.id, items);
  }

  // ── Add functions — atomic: section created + content set in one render ──

  async function addSkillCategory() {
    const newCat = { id: crypto.randomUUID(), name: "", skills: "" };
    if (skillsSection) {
      // Section exists — just append
      updateSection(skillsSection.id, { categories: [...skillCats, newCat] });
    } else {
      // Section doesn't exist — create it WITH the first category atomically
      await ensureSectionWithContent("skills", { categories: [newCat] });
    }
  }

  async function addLanguage() {
    const newLang: LanguageItem = {
      id: crypto.randomUUID(),
      language: "",
      proficiency: "Professional",
    };
    if (langsSection) {
      updateSection(langsSection.id, [...langItems, newLang]);
    } else {
      await ensureSectionWithContent("languages", [newLang]);
    }
  }

  async function addCertification() {
    const newCert: CertificationItem = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    if (certsSection) {
      updateSection(certsSection.id, [...certItems, newCert]);
    } else {
      await ensureSectionWithContent("certifications", [newCert]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
                onAccept={(text) =>
                  summarySection && updateSection(summarySection.id, { text })
                }
              />
            ) : undefined
          }
        />
        {summarySection ? (
          <textarea
            value={summaryText}
            onChange={(e) =>
              updateSection(summarySection.id, { text: e.target.value })
            }
            rows={5}
            placeholder="Write 2–4 sentences about your background and key strengths…"
            className={`${inputCls} w-full resize-y leading-relaxed`}
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
                    placeholder: "Built React apps…",
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
        {/* Mirror Step3 pattern: show "Add section" until section exists */}
        {!skillsSection ? (
          <AddButton label="Add Skills section" onClick={addSkillCategory} />
        ) : (
          <div className="flex flex-col gap-2">
            {skillCats.map((cat) => (
              <div key={cat.id} className="flex gap-2 items-center">
                {/* Fixed widths: category name 35%, skills fills rest */}
                <input
                  value={cat.name}
                  onChange={(e) =>
                    handleSkillsChange(
                      skillCats.map((c) =>
                        c.id === cat.id ? { ...c, name: e.target.value } : c,
                      ),
                    )
                  }
                  placeholder="Category (e.g. Frontend)"
                  className={`${inputCls} w-[35%] shrink-0 min-w-0`}
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
                  placeholder="React, TypeScript, Next.js…"
                  className={`${inputCls} flex-1 min-w-0`}
                />
                <IconRemove
                  onClick={() =>
                    handleSkillsChange(skillCats.filter((c) => c.id !== cat.id))
                  }
                />
              </div>
            ))}
            <AddButton label="Add skill category" onClick={addSkillCategory} />
          </div>
        )}
      </div>

      {/* ── Languages ── */}
      <div>
        <SectionHeading label="Languages" />
        {!langsSection ? (
          <AddButton label="Add Languages section" onClick={addLanguage} />
        ) : (
          <div className="flex flex-col gap-2">
            {langItems.map((lang) => (
              <div key={lang.id} className="flex gap-2 items-center">
                <input
                  value={lang.language}
                  onChange={(e) =>
                    handleLangsChange(
                      langItems.map((l) =>
                        l.id === lang.id
                          ? { ...l, language: e.target.value }
                          : l,
                      ),
                    )
                  }
                  placeholder="e.g. Arabic"
                  className={`${inputCls} flex-1`}
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
                  className={`${inputCls} w-auto cursor-pointer`}
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
            <AddButton label="Add language" onClick={addLanguage} />
          </div>
        )}
      </div>

      {/* ── Certifications ── */}
      <div>
        <SectionHeading label="Certifications" />
        {!certsSection ? (
          <AddButton
            label="Add Certifications section"
            onClick={addCertification}
          />
        ) : (
          <div className="flex flex-col">
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
                    className={inputCls}
                  />
                </Field>
                <div className="flex gap-2">
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
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      value={cert.date}
                      onChange={(e) =>
                        handleCertsChange(
                          certItems.map((c) =>
                            c.id === cert.id
                              ? { ...c, date: e.target.value }
                              : c,
                          ),
                        )
                      }
                      placeholder="2024"
                      className={`${inputCls} w-full`}
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
                    className={inputCls}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton label="Add certification" onClick={addCertification} />
          </div>
        )}
      </div>
    </div>
  );
}
