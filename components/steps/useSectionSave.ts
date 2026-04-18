import { useRef, useCallback } from "react";
import { saveSection, addSection } from "@/actions/builder.actions";
import type { ResumeSection, SectionType, SectionContent } from "@/types/resume";

export function useSectionSave(
  resumeId: string,
  sections: ResumeSection[],
  onSectionsChange: (s: ResumeSection[]) => void
) {
  // Always hold the latest sections in a ref so async callbacks never go stale
  const sectionsRef = useRef<ResumeSection[]>(sections);
  sectionsRef.current = sections;

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /** Update local state immediately + debounce DB write */
  const updateSection = useCallback(
    (sectionId: string, content: SectionContent) => {
      const updated = sectionsRef.current.map((s) =>
        s.id === sectionId ? { ...s, content } : s
      );
      onSectionsChange(updated);

      if (timers.current[sectionId]) clearTimeout(timers.current[sectionId]);
      timers.current[sectionId] = setTimeout(() => {
        saveSection(resumeId, sectionId, content).catch(console.error);
      }, 600);
    },
    [resumeId, onSectionsChange]
  );

  /**
   * Ensure a section exists, then immediately set its content atomically.
   * Both the new section AND its initial content are published in a single
   * onSectionsChange call — so the component re-renders exactly once and
   * sees the section with content immediately, no refresh needed.
   */
  const ensureSectionWithContent = useCallback(
    async (type: SectionType, initialContent: SectionContent): Promise<ResumeSection> => {
      // If section already exists, just update its content
      const existing = sectionsRef.current.find((s) => s.type === type);
      if (existing) {
        updateSection(existing.id, initialContent);
        return { ...existing, content: initialContent };
      }

      // Create section in DB
      const created = await addSection(resumeId, type);
      const newSection: ResumeSection = {
        id:       created.id,
        resumeId: created.resumeId,
        type:     created.type as SectionType,
        title:    created.title,
        content:  initialContent,          // use our content, not the DB default
        order:    created.order,
      };

      // Publish new section WITH content in one atomic update
      // This is the key fix: ref + state updated together so no stale read
      const next = [...sectionsRef.current, newSection];
      sectionsRef.current = next;           // update ref immediately before onSectionsChange
      onSectionsChange(next);

      // Persist content to DB (debounced)
      if (timers.current[created.id]) clearTimeout(timers.current[created.id]);
      timers.current[created.id] = setTimeout(() => {
        saveSection(resumeId, created.id, initialContent).catch(console.error);
      }, 600);

      return newSection;
    },
    [resumeId, onSectionsChange, updateSection]
  );

  /**
   * Ensure a section of the given type exists (no content update).
   * Used by summary which only needs the section to exist.
   */
  const ensureSection = useCallback(
    async (type: SectionType): Promise<ResumeSection> => {
      const existing = sectionsRef.current.find((s) => s.type === type);
      if (existing) return existing;

      const created = await addSection(resumeId, type);
      const newSection: ResumeSection = {
        id:       created.id,
        resumeId: created.resumeId,
        type:     created.type as SectionType,
        title:    created.title,
        content:  created.content as SectionContent,
        order:    created.order,
      };

      const next = [...sectionsRef.current, newSection];
      sectionsRef.current = next;           // update ref immediately
      onSectionsChange(next);
      return newSection;
    },
    [resumeId, onSectionsChange]
  );

  return { updateSection, ensureSection, ensureSectionWithContent };
}