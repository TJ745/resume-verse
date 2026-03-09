import { useRef, useCallback } from "react";
import { saveSection, addSection } from "@/actions/builder.actions";
import type {
  ResumeSection,
  SectionType,
  SectionContent,
} from "@/types/resume";

/**
 * Provides stable debounced save and addSection helpers for step components.
 * Timers are stored in refs so they don't reset on every render.
 */
export function useSectionSave(
  resumeId: string,
  sections: ResumeSection[],
  onSectionsChange: (s: ResumeSection[]) => void,
) {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /** Update local state immediately + debounce DB write */
  const updateSection = useCallback(
    (sectionId: string, content: SectionContent) => {
      onSectionsChange(
        sections.map((s) => (s.id === sectionId ? { ...s, content } : s)),
      );
      if (timers.current[sectionId]) clearTimeout(timers.current[sectionId]);
      timers.current[sectionId] = setTimeout(() => {
        saveSection(resumeId, sectionId, content).catch(console.error);
      }, 600);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resumeId, sections, onSectionsChange],
  );

  /**
   * Ensure a section of the given type exists.
   * If it doesn't, creates it via server action and appends to local state.
   * Returns the existing or newly created section.
   */
  const ensureSection = useCallback(
    async (type: SectionType): Promise<ResumeSection> => {
      const existing = sections.find((s) => s.type === type);
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
      onSectionsChange([...sections, newSection]);
      return newSection;
    },
    [resumeId, sections, onSectionsChange],
  );

  return { updateSection, ensureSection };
}
