// // ── Section type union ────────────────────────────────────

// export type SectionType =
//   | "summary"
//   | "experience"
//   | "education"
//   | "skills"
//   | "projects"
//   | "certifications"
//   | "languages"
//   | "awards"
//   | "volunteer";

// // ── Personal info (stored on Resume model) ─────────────────

// export interface PersonalInfo {
//   fullName: string;
//   jobTitle: string;
//   email: string;
//   phone: string;
//   address: string;
//   linkedin: string;
//   github: string;
//   website: string;
//   photoUrl: string;
//   maritalStatus: string;
//   // visibility toggles for optional fields
//   showPhoto: boolean;
//   showMaritalStatus: boolean;
//   showWebsite: boolean;
//   showAddress: boolean;
// }

// export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
//   fullName: "",
//   jobTitle: "",
//   email: "",
//   phone: "",
//   address: "",
//   linkedin: "",
//   github: "",
//   website: "",
//   photoUrl: "",
//   maritalStatus: "",
//   showPhoto: false,
//   showMaritalStatus: false,
//   showWebsite: false,
//   showAddress: true,
// };

// // ── Per-section content shapes ────────────────────────────

// export interface SummaryContent {
//   text: string;
// }

// export interface ExperienceItem {
//   id: string;
//   company: string;
//   role: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   current: boolean;
//   bullets: string[];
// }

// export interface EducationItem {
//   id: string;
//   institution: string;
//   degree: string;
//   field: string;
//   startDate: string;
//   endDate: string;
//   gpa?: string;
// }

// export interface SkillsContent {
//   categories: { id: string; name: string; skills: string }[];
// }

// export interface ProjectItem {
//   id: string;
//   name: string;
//   description: string;
//   url?: string;
//   technologies: string;
// }

// export interface CertificationItem {
//   id: string;
//   name: string;
//   issuer: string;
//   date: string;
//   url?: string;
// }

// export interface LanguageItem {
//   id: string;
//   language: string;
//   proficiency: string;
// }

// export interface AwardItem {
//   id: string;
//   title: string;
//   issuer: string;
//   date: string;
//   description: string;
// }

// export interface VolunteerItem {
//   id: string;
//   organization: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   current: boolean;
//   description: string;
// }

// export type SectionContent =
//   | SummaryContent
//   | ExperienceItem[]
//   | EducationItem[]
//   | SkillsContent
//   | ProjectItem[]
//   | CertificationItem[]
//   | LanguageItem[]
//   | AwardItem[]
//   | VolunteerItem[];

// // ── Resume section row ────────────────────────────────────

// export interface ResumeSection {
//   id: string;
//   resumeId: string;
//   type: SectionType;
//   title: string;
//   content: SectionContent;
//   order: number;
// }

// // ── Full resume shape ─────────────────────────────────────

// export interface ResumeData {
//   id: string;
//   title: string;
//   template: string;
//   colorScheme: string;
//   jobTitle: string | null;
//   personalInfo: PersonalInfo | null;
//   sections: ResumeSection[];
// }

// // ── Parsed upload shape (from AI parsing) ────────────────

// export interface ParsedResumeUpload {
//   personalInfo: PersonalInfo | null;
//   sections: Array<{
//     type: SectionType;
//     title: string;
//     content: SectionContent;
//   }>;
// }

// ── Section type union ────────────────────────────────────

export type SectionType =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "volunteer";

// ── Personal info (stored on Resume model) ─────────────────

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  photoUrl: string; // base64 data URL or empty string
  // visibility toggles
  showPhoto: boolean;
  showWebsite: boolean;
  showAddress: boolean;
}

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  website: "",
  photoUrl: "",
  showPhoto: false,
  showWebsite: false,
  showAddress: true,
};

// ── Per-section content shapes ────────────────────────────

export interface SummaryContent {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface SkillsContent {
  categories: { id: string; name: string; skills: string }[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export type SectionContent =
  | SummaryContent
  | ExperienceItem[]
  | EducationItem[]
  | SkillsContent
  | ProjectItem[]
  | CertificationItem[]
  | LanguageItem[]
  | AwardItem[]
  | VolunteerItem[];

// ── Resume section row ────────────────────────────────────

export interface ResumeSection {
  id: string;
  resumeId: string;
  type: SectionType;
  title: string;
  content: SectionContent;
  order: number;
}

// ── Full resume shape ─────────────────────────────────────

export interface ResumeData {
  id: string;
  title: string;
  template: string;
  colorScheme: string;
  jobTitle: string | null;
  personalInfo: PersonalInfo | null;
  sections: ResumeSection[];
}

// ── Parsed upload shape (from AI parsing) ────────────────

export interface ParsedResumeUpload {
  personalInfo: PersonalInfo | null;
  sections: Array<{
    type: SectionType;
    title: string;
    content: SectionContent;
  }>;
}
