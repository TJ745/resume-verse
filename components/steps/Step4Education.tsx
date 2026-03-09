"use client";

import { useSectionSave } from "./useSectionSave";
import {
  SectionHeading,
  AddButton,
  ItemCard,
  Field,
  Checkbox,
  inputStyle,
} from "./ui";
import type {
  ResumeSection,
  EducationItem,
  AwardItem,
  VolunteerItem,
} from "@/types/resume";

interface Props {
  resumeId: string;
  sections: ResumeSection[];
  onSectionsChange: (s: ResumeSection[]) => void;
}

export default function Step4Education({
  resumeId,
  sections,
  onSectionsChange,
}: Props) {
  const { updateSection, ensureSection } = useSectionSave(
    resumeId,
    sections,
    onSectionsChange,
  );

  // ── Single source of truth: read from sections prop ──────
  const eduSection = sections.find((s) => s.type === "education");
  const awardSection = sections.find((s) => s.type === "awards");
  const volSection = sections.find((s) => s.type === "volunteer");

  const eduItems = (eduSection?.content as EducationItem[] | undefined) ?? [];
  const awardItems = (awardSection?.content as AwardItem[] | undefined) ?? [];
  const volItems = (volSection?.content as VolunteerItem[] | undefined) ?? [];

  function handleEduChange(items: EducationItem[]) {
    if (eduSection) updateSection(eduSection.id, items);
  }
  function updateEdu<K extends keyof EducationItem>(
    id: string,
    key: K,
    val: EducationItem[K],
  ) {
    handleEduChange(
      eduItems.map((e) => (e.id === id ? { ...e, [key]: val } : e)),
    );
  }

  function handleAwardsChange(items: AwardItem[]) {
    if (awardSection) updateSection(awardSection.id, items);
  }
  function updateAward<K extends keyof AwardItem>(
    id: string,
    key: K,
    val: AwardItem[K],
  ) {
    handleAwardsChange(
      awardItems.map((a) => (a.id === id ? { ...a, [key]: val } : a)),
    );
  }

  function handleVolChange(items: VolunteerItem[]) {
    if (volSection) updateSection(volSection.id, items);
  }
  function updateVol<K extends keyof VolunteerItem>(
    id: string,
    key: K,
    val: VolunteerItem[K],
  ) {
    handleVolChange(
      volItems.map((v) => (v.id === id ? { ...v, [key]: val } : v)),
    );
  }

  const inp = inputStyle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* ── Education ── */}
      <div>
        <SectionHeading label="Education" />
        {!eduSection ? (
          <AddButton
            label="Add Education section"
            onClick={() => ensureSection("education")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {eduItems.map((edu) => (
              <ItemCard
                key={edu.id}
                title={edu.institution || "New Education"}
                onRemove={() =>
                  handleEduChange(eduItems.filter((e) => e.id !== edu.id))
                }
              >
                <Field label="Institution">
                  <input
                    value={edu.institution}
                    onChange={(e) =>
                      updateEdu(edu.id, "institution", e.target.value)
                    }
                    placeholder="Massachusetts Institute of Technology"
                    style={inp}
                  />
                </Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <Field label="Degree">
                    <input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEdu(edu.id, "degree", e.target.value)
                      }
                      placeholder="Bachelor of Science"
                      style={inp}
                    />
                  </Field>
                  <Field label="Field">
                    <input
                      value={edu.field}
                      onChange={(e) =>
                        updateEdu(edu.id, "field", e.target.value)
                      }
                      placeholder="Computer Science"
                      style={inp}
                    />
                  </Field>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Field label="Start">
                    <input
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEdu(edu.id, "startDate", e.target.value)
                      }
                      placeholder="Sep 2018"
                      style={inp}
                    />
                  </Field>
                  <Field label="End">
                    <input
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEdu(edu.id, "endDate", e.target.value)
                      }
                      placeholder="Jun 2022"
                      style={inp}
                    />
                  </Field>
                  <Field label="GPA" optional>
                    <input
                      value={edu.gpa ?? ""}
                      onChange={(e) => updateEdu(edu.id, "gpa", e.target.value)}
                      placeholder="3.8"
                      style={{ ...inp, width: 64 }}
                    />
                  </Field>
                </div>
              </ItemCard>
            ))}
            <AddButton
              label="Add education"
              onClick={() => {
                const newItem: EducationItem = {
                  id: crypto.randomUUID(),
                  institution: "",
                  degree: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  gpa: "",
                };
                handleEduChange([...eduItems, newItem]);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Awards ── */}
      <div>
        <SectionHeading label="Awards & Achievements" />
        {!awardSection ? (
          <AddButton
            label="Add Awards section"
            onClick={() => ensureSection("awards")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {awardItems.map((award) => (
              <ItemCard
                key={award.id}
                title={award.title || "New Award"}
                onRemove={() =>
                  handleAwardsChange(
                    awardItems.filter((a) => a.id !== award.id),
                  )
                }
              >
                <Field label="Award / Achievement Title">
                  <input
                    value={award.title}
                    onChange={(e) =>
                      updateAward(award.id, "title", e.target.value)
                    }
                    placeholder="Best Innovation Award"
                    style={inp}
                  />
                </Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <Field label="Issuer / Organization">
                    <input
                      value={award.issuer}
                      onChange={(e) =>
                        updateAward(award.id, "issuer", e.target.value)
                      }
                      placeholder="Google"
                      style={inp}
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      value={award.date}
                      onChange={(e) =>
                        updateAward(award.id, "date", e.target.value)
                      }
                      placeholder="2023"
                      style={{ ...inp, width: 90 }}
                    />
                  </Field>
                </div>
                <Field label="Description" optional>
                  <textarea
                    value={award.description}
                    rows={2}
                    onChange={(e) =>
                      updateAward(award.id, "description", e.target.value)
                    }
                    placeholder="Brief context about this achievement…"
                    style={{ ...inp, resize: "vertical" }}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton
              label="Add award"
              onClick={() => {
                const newItem: AwardItem = {
                  id: crypto.randomUUID(),
                  title: "",
                  issuer: "",
                  date: "",
                  description: "",
                };
                handleAwardsChange([...awardItems, newItem]);
              }}
            />
          </div>
        )}
      </div>

      {/* ── Volunteer ── */}
      <div>
        <SectionHeading label="Volunteer Work" />
        {!volSection ? (
          <AddButton
            label="Add Volunteer section"
            onClick={() => ensureSection("volunteer")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {volItems.map((vol) => (
              <ItemCard
                key={vol.id}
                title={vol.organization || "New Volunteer Role"}
                onRemove={() =>
                  handleVolChange(volItems.filter((v) => v.id !== vol.id))
                }
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Field label="Organization">
                    <input
                      value={vol.organization}
                      onChange={(e) =>
                        updateVol(vol.id, "organization", e.target.value)
                      }
                      placeholder="Red Cross"
                      style={inp}
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      value={vol.role}
                      onChange={(e) =>
                        updateVol(vol.id, "role", e.target.value)
                      }
                      placeholder="Event Coordinator"
                      style={inp}
                    />
                  </Field>
                </div>
                <div
                  style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
                >
                  <Field label="Start Date">
                    <input
                      value={vol.startDate}
                      onChange={(e) =>
                        updateVol(vol.id, "startDate", e.target.value)
                      }
                      placeholder="Mar 2021"
                      style={inp}
                    />
                  </Field>
                  {!vol.current && (
                    <Field label="End Date">
                      <input
                        value={vol.endDate}
                        onChange={(e) =>
                          updateVol(vol.id, "endDate", e.target.value)
                        }
                        placeholder="Dec 2022"
                        style={inp}
                      />
                    </Field>
                  )}
                  <div style={{ paddingBottom: 6 }}>
                    <Checkbox
                      label="Ongoing"
                      checked={vol.current}
                      onChange={(v) => updateVol(vol.id, "current", v)}
                    />
                  </div>
                </div>
                <Field label="Description" optional>
                  <textarea
                    value={vol.description}
                    rows={2}
                    onChange={(e) =>
                      updateVol(vol.id, "description", e.target.value)
                    }
                    placeholder="What did you do and what impact did it have?"
                    style={{ ...inp, resize: "vertical" }}
                  />
                </Field>
              </ItemCard>
            ))}
            <AddButton
              label="Add volunteer role"
              onClick={() => {
                const newItem: VolunteerItem = {
                  id: crypto.randomUUID(),
                  organization: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  current: false,
                  description: "",
                };
                handleVolChange([...volItems, newItem]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
