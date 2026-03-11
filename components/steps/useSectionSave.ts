import { useRef, useCallback } from "react";
import { saveSection, addSection } from "@/actions/builder.actions";
import type {
  ResumeSection,
  SectionType,
  SectionContent,
} from "@/types/resume";

export function useSectionSave(
  resumeId: string,
  sections: ResumeSection[],
  onSectionsChange: (s: ResumeSection[]) => void,
) {
  // Always hold the latest sections in a ref so async callbacks never go stale
  const sectionsRef = useRef<ResumeSection[]>(sections);
  sectionsRef.current = sections;

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /** Update local state immediately + debounce DB write */
  const updateSection = useCallback(
    (sectionId: string, content: SectionContent) => {
      // Use ref so we always map over the freshest list
      const updated = sectionsRef.current.map((s) =>
        s.id === sectionId ? { ...s, content } : s,
      );
      onSectionsChange(updated);

      if (timers.current[sectionId]) clearTimeout(timers.current[sectionId]);
      timers.current[sectionId] = setTimeout(() => {
        saveSection(resumeId, sectionId, content).catch(console.error);
      }, 600);
    },
    // onSectionsChange and resumeId are stable — sectionsRef is a ref so no dep needed
    [resumeId, onSectionsChange],
  );

  /**
   * Ensure a section of the given type exists.
   * Returns the existing or newly-created section.
   * Always reads from sectionsRef so it never goes stale.
   */
  const ensureSection = useCallback(
    async (type: SectionType): Promise<ResumeSection> => {
      // Check ref for latest state — avoids stale closure bug
      const existing = sectionsRef.current.find((s) => s.type === type);
      if (existing) return existing;

      const created = await addSection(resumeId, type);
      const newSection: ResumeSection = {
        id: created.id,
        resumeId: created.resumeId,
        type: created.type as SectionType,
        title: created.title,
        content: created.content as SectionContent,
        order: created.order,
      };
      // Append to latest sections via ref
      onSectionsChange([...sectionsRef.current, newSection]);
      return newSection;
    },
    [resumeId, onSectionsChange],
  );

  return { updateSection, ensureSection };
}
