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
  inputCls,
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
  jobTitle: _jobTitle,
  sections,
  onSectionsChange,
}: Props) {
  const { updateSection, ensureSection } = useSectionSave(
    resumeId,
    sections,
    onSectionsChange,
  );

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

  return (
    <div className="flex flex-col gap-7">
      {/* ── Work Experience ── */}
      <div>
        <SectionHeading label="Work Experience" />
        {!expSection ? (
          <AddButton
            label="Add Experience section"
            onClick={() => ensureSection("experience")}
          />
        ) : (
          <div className="flex flex-col">
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
                <div className="flex gap-2">
                  <Field label="Job Title">
                    <input
                      value={exp.role}
                      onChange={(e) =>
                        updateExp(exp.id, "role", e.target.value)
                      }
                      placeholder="Software Engineer"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={exp.company}
                      onChange={(e) =>
                        updateExp(exp.id, "company", e.target.value)
                      }
                      placeholder="Acme Inc."
                      className={inputCls}
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
                    className={inputCls}
                  />
                </Field>

                <div className="flex gap-2 items-end">
                  <Field label="Start Date">
                    <input
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExp(exp.id, "startDate", e.target.value)
                      }
                      placeholder="Jan 2022"
                      className={`${inputCls} w-full`}
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
                        className={`${inputCls} w-full`}
                      />
                    </Field>
                  )}
                  <div className="pb-1.5">
                    <Checkbox
                      label="Current"
                      checked={exp.current}
                      onChange={(v) => updateExp(exp.id, "current", v)}
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[0.7rem] font-semibold text-rv-muted tracking-[0.04em]">
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
                    <div key={i} className="flex gap-1.5 mb-1.5 items-start">
                      <span className="text-rv-accent text-[0.7rem] pt-2.5 shrink-0">
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
                        className={`${inputCls} flex-1 resize-y text-[0.78rem] w-full`}
                      />
                      <div className="pt-2">
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
                    className="bg-transparent border-0 cursor-pointer text-rv-muted text-[0.75rem] p-0 transition-colors hover:text-rv-accent"
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
          <div className="flex flex-col">
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
                    className={inputCls}
                  />
                </Field>
                <Field label="Technologies">
                  <input
                    value={proj.technologies}
                    onChange={(e) =>
                      updateProj(proj.id, "technologies", e.target.value)
                    }
                    placeholder="Next.js, Prisma, OpenAI"
                    className={inputCls}
                  />
                </Field>
                <Field label="Project URL" optional>
                  <input
                    value={proj.url ?? ""}
                    onChange={(e) => updateProj(proj.id, "url", e.target.value)}
                    placeholder="https://github.com/…"
                    className={inputCls}
                  />
                </Field>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[0.7rem] font-semibold text-rv-muted tracking-[0.04em]">
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
                    className={`${inputCls} resize-y w-full`}
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
