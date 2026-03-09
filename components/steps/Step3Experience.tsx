"use client";

import { useSectionSave } from "./useSectionSave";
import AIGenerateButton from "@/ai/AIGenerateButton";
import {
  SectionHeading,
  AddButton,
  ItemCard,
  Field,
  Checkbox,
  IconRemove,
  inputStyle,
} from "./ui";
import type {
  ResumeSection,
  ExperienceItem,
  ProjectItem,
} from "@/types/resume";

interface Props {
  resumeId: string;
  jobTitle: string;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

export default function Step3Experience({
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

  // ── Single source of truth: read from sections prop ──────
  const expSection = sections.find((s) => s.type === "experience");
  const projSection = sections.find((s) => s.type === "projects");

  const expItems = (expSection?.content as ExperienceItem[] | undefined) ?? [];
  const projItems = (projSection?.content as ProjectItem[] | undefined) ?? [];

  function handleExpChange(items: ExperienceItem[]) {
    if (expSection) updateSection(expSection.id, items);
  }

  function updateExp<K extends keyof ExperienceItem>(
    id: string,
    key: K,
    val: ExperienceItem[K],
  ) {
    handleExpChange(
      expItems.map((e) => (e.id === id ? { ...e, [key]: val } : e)),
    );
  }

  function handleProjChange(items: ProjectItem[]) {
    if (projSection) updateSection(projSection.id, items);
  }

  function updateProj<K extends keyof ProjectItem>(
    id: string,
    key: K,
    val: ProjectItem[K],
  ) {
    handleProjChange(
      projItems.map((p) => (p.id === id ? { ...p, [key]: val } : p)),
    );
  }

  const inp = inputStyle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Work Experience ── */}
      <div>
        <SectionHeading label="Work Experience" />
        {!expSection ? (
          <AddButton
            label="Add Experience section"
            onClick={() => ensureSection("experience")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {expItems.map((exp) => (
              <ItemCard
                key={exp.id}
                title={
                  exp.role
                    ? `${exp.role}${exp.company ? ` @ ${exp.company}` : ""}`
                    : "New Position"
                }
                onRemove={() =>
                  handleExpChange(expItems.filter((e) => e.id !== exp.id))
                }
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Field label="Job Title">
                    <input
                      value={exp.role}
                      onChange={(e) =>
                        updateExp(exp.id, "role", e.target.value)
                      }
                      placeholder="Software Engineer"
                      style={inp}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={exp.company}
                      onChange={(e) =>
                        updateExp(exp.id, "company", e.target.value)
                      }
                      placeholder="Acme Inc."
                      style={inp}
                    />
                  </Field>
                </div>

                <Field label="Location" optional>
                  <input
                    value={exp.location}
                    onChange={(e) =>
                      updateExp(exp.id, "location", e.target.value)
                    }
                    placeholder="New York, NY"
                    style={inp}
                  />
                </Field>

                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
                >
                  <Field label="Start Date">
                    <input
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExp(exp.id, "startDate", e.target.value)
                      }
                      placeholder="Jan 2022"
                      style={inp}
                    />
                  </Field>
                  {!exp.current && (
                    <Field label="End Date">
                      <input
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExp(exp.id, "endDate", e.target.value)
                        }
                        placeholder="Dec 2024"
                        style={inp}
                      />
                    </Field>
                  )}
                  <div style={{ paddingBottom: 6 }}>
                    <Checkbox
                      label="Current"
                      checked={exp.current}
                      onChange={(v) => updateExp(exp.id, "current", v)}
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--rv-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Bullet Points
                    </label>
                    <AIGenerateButton
                      type="experience_bullets"
                      label="Generate"
                      prefillContext={{ role: exp.role, company: exp.company }}
                      contextFields={[
                        {
                          key: "role",
                          label: "Job Title",
                          placeholder: "Software Engineer",
                        },
                        {
                          key: "company",
                          label: "Company",
                          placeholder: "Acme Inc.",
                        },
                        {
                          key: "context",
                          label: "What did you do?",
                          placeholder: "Built REST APIs…",
                          multiline: true,
                        },
                      ]}
                      onAccept={(text) => {
                        const lines = text
                          .split("\n")
                          .map((l) => l.replace(/^[-•*]\s*/, "").trim())
                          .filter(Boolean);
                        updateExp(exp.id, "bullets", lines);
                      }}
                    />
                  </div>

                  {exp.bullets.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 6,
                        marginBottom: 6,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--rv-accent)",
                          fontSize: "0.7rem",
                          paddingTop: 10,
                          flexShrink: 0,
                        }}
                      >
                        •
                      </span>
                      <textarea
                        value={b}
                        rows={2}
                        onChange={(e) =>
                          updateExp(
                            exp.id,
                            "bullets",
                            exp.bullets.map((x, j) =>
                              j === i ? e.target.value : x,
                            ),
                          )
                        }
                        placeholder="Led a team of 5 engineers to ship…"
                        style={{
                          ...inp,
                          flex: 1,
                          resize: "vertical",
                          fontSize: "0.78rem",
                        }}
                      />
                      <div style={{ paddingTop: 8 }}>
                        <IconRemove
                          onClick={() =>
                            updateExp(
                              exp.id,
                              "bullets",
                              exp.bullets.filter((_, j) => j !== i),
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      updateExp(exp.id, "bullets", [...exp.bullets, ""])
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--rv-muted)",
                      fontFamily: "inherit",
                      fontSize: "0.75rem",
                      padding: 0,
                      transition: "color 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--rv-accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--rv-muted)")
                    }
                  >
                    + Add bullet
                  </button>
                </div>
              </ItemCard>
            ))}

            <AddButton
              label="Add position"
              onClick={() => {
                const newItem: ExperienceItem = {
                  id: crypto.randomUUID(),
                  company: "",
                  role: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  bullets: [""],
                };
                handleExpChange([...expItems, newItem]);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Projects ── */}
      <div>
        <SectionHeading label="Projects" />
        {!projSection ? (
          <AddButton
            label="Add Projects section"
            onClick={() => ensureSection("projects")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {projItems.map((proj) => (
              <ItemCard
                key={proj.id}
                title={proj.name || "New Project"}
                onRemove={() =>
                  handleProjChange(projItems.filter((p) => p.id !== proj.id))
                }
              >
                <Field label="Project Name">
                  <input
                    value={proj.name}
                    onChange={(e) =>
                      updateProj(proj.id, "name", e.target.value)
                    }
                    placeholder="ResumeVerse"
                    style={inp}
                  />
                </Field>
                <Field label="Technologies">
                  <input
                    value={proj.technologies}
                    onChange={(e) =>
                      updateProj(proj.id, "technologies", e.target.value)
                    }
                    placeholder="Next.js, Prisma, OpenAI"
                    style={inp}
                  />
                </Field>
                <Field label="Project URL" optional>
                  <input
                    value={proj.url ?? ""}
                    onChange={(e) => updateProj(proj.id, "url", e.target.value)}
                    placeholder="https://github.com/…"
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
                    <label
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--rv-muted)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Description
                    </label>
                    <AIGenerateButton
                      type="project_description"
                      label="Generate"
                      prefillContext={{
                        name: proj.name,
                        technologies: proj.technologies,
                      }}
                      contextFields={[
                        {
                          key: "name",
                          label: "Project name",
                          placeholder: "ResumeVerse",
                        },
                        {
                          key: "technologies",
                          label: "Technologies",
                          placeholder: "Next.js, Prisma, OpenAI",
                        },
                        {
                          key: "context",
                          label: "What did you build?",
                          placeholder: "AI resume builder…",
                          multiline: true,
                        },
                      ]}
                      onAccept={(text) =>
                        updateProj(proj.id, "description", text)
                      }
                    />
                  </div>
                  <textarea
                    value={proj.description}
                    rows={3}
                    onChange={(e) =>
                      updateProj(proj.id, "description", e.target.value)
                    }
                    placeholder="Describe what you built and its impact…"
                    style={{ ...inp, resize: "vertical" }}
                  />
                </div>
              </ItemCard>
            ))}

            <AddButton
              label="Add project"
              onClick={() => {
                const newItem: ProjectItem = {
                  id: crypto.randomUUID(),
                  name: "",
                  description: "",
                  url: "",
                  technologies: "",
                };
                handleProjChange([...projItems, newItem]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
