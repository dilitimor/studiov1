
'use server';
/**
 * @fileOverview AI agent to generate a full resume.
 *
 * - generateFullResume - Generates a resume based on user data, selected type, and a reference template.
 * - GenerateFullResumeInput - Input type for the generateFullResume function.
 * - GenerateFullResumeOutput - Output type for the generateFullResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FullResumeValues, ResumeType } from '@/lib/schema';
import { getAiResumeTemplates } from '@/services/firestoreService'; // To fetch templates

// Define Zod schemas for complex types within FullResumeValues
// This is important for Genkit to understand the structure of the input.

const TargetPositionSchemaZod = z.object({
  applyingForPosition: z.boolean(),
  positionName: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
});

const BiodataSchemaZod = z.object({
  name: z.string(),
  address: z.string(),
  contactNumber: z.string(),
  birthPlaceDate: z.string(),
  gender: z.string(), // Keep as string for simplicity in prompt, can be enum if needed
  photoUrl: z.string().optional().nullable(),
});

const ShortProfileSchemaZod = z.object({
  background: z.string(),
  strengths: z.string(),
  careerGoals: z.string(),
  teamValue: z.string(),
});

const EducationEntrySchemaZod = z.object({
  level: z.string(),
  institution: z.string(),
  major: z.string(),
  yearRange: z.string(),
  gpa: z.string().optional(),
  achievements: z.string().optional(),
});

const ExperienceEntrySchemaZod = z.object({
  company: z.string(),
  position: z.string(),
  location: z.string(),
  period: z.string(),
  tasks: z.string(),
  achievements: z.string().optional(),
});

const SkillsSchemaZod = z.object({
  hasSkills: z.boolean(),
  mainSkills: z.string().optional(),
  foreignLanguages: z.string().optional(),
});

const HobbiesSchemaZod = z.object({
  hasHobbies: z.boolean(),
  hobbiesList: z.string().optional(),
});

const ReferenceEntrySchemaZod = z.object({
  fullName: z.string(),
  position: z.string(),
  company: z.string(),
  contactNumber: z.string(),
  email: z.string().optional().nullable(),
  relationship: z.string(),
});

const ReferencesSchemaZod = z.object({
  hasReferences: z.boolean(),
  entries: z.array(ReferenceEntrySchemaZod).optional(),
});

const FullResumeDataSchemaZod = z.object({
  targetPosition: TargetPositionSchemaZod.optional(),
  biodata: BiodataSchemaZod.optional(),
  shortProfile: ShortProfileSchemaZod.optional(),
  education: z.array(EducationEntrySchemaZod).optional(),
  experience: z.array(ExperienceEntrySchemaZod).optional(),
  skills: SkillsSchemaZod.optional(),
  hobbies: HobbiesSchemaZod.optional(),
  references: ReferencesSchemaZod.optional(),
});

const GenerateFullResumeInputSchema = z.object({
  resumeData: FullResumeDataSchemaZod.describe("The complete resume data input by the user."),
  selectedResumeType: z.string().describe("The type of resume selected by the user (e.g., 'lulusan_baru', 'profesional', 'ganti_karier'). This dictates the style and tone."),
  referenceTemplatePdfUri: z.string().optional().describe("Optional. A Data URI of a PDF template to be used as a style and tone reference. Format: 'data:application/pdf;base64,<encoded_data>'."),
});
export type GenerateFullResumeInput = z.infer<typeof GenerateFullResumeInputSchema>;

const GenerateFullResumeOutputSchema = z.object({
  generatedResumeText: z.string().describe("The generated resume content as a text or markdown string."),
});
export type GenerateFullResumeOutput = z.infer<typeof GenerateFullResumeOutputSchema>;

export async function generateFullResume(input: GenerateFullResumeInput): Promise<GenerateFullResumeOutput> {
  return generateFullResumeFlow(input);
}

const systemPrompt = `You are an expert resume writer. Your task is to generate a complete, professional resume based on the provided user data, the selected resume type, and an optional reference PDF template for style and tone.

The resume should be well-structured, concise, and tailored to the selected resume type.
- For 'Lulusan Baru' (Fresh Graduate): Emphasize education, skills, relevant projects, and potential. Use an enthusiastic and proactive tone.
- For 'Profesional' (Professional): Highlight achievements, quantifiable results, and career progression. Use a confident and experienced tone.
- For 'Ganti Karier' (Career Changer): Focus on transferable skills, adaptability, and how past experiences relate to the new career path. Use a motivated and forward-looking tone.

Format the output as a clean, readable text or markdown that can be easily copied and pasted. Use clear headings for sections like "Biodata", "Profil Singkat", "Pendidikan", "Pengalaman Kerja", "Keahlian", etc.

If a reference PDF is provided, analyze its style, layout, and tone, and try to emulate it in the generated resume's structure and language, while still using the user's data. Do not simply copy the template.

User's Selected Resume Type: {{selectedResumeType}}
`;

// Helper function to format resume data for the prompt
function formatResumeDataForPrompt(data: FullResumeValues): string {
  let promptText = "\n\n## User Resume Data:\n\n";

  if (data.targetPosition && data.targetPosition.applyingForPosition) {
    promptText += `### Posisi Dilamar\n`;
    promptText += `- Posisi: ${data.targetPosition.positionName || 'N/A'}\n`;
    if (data.targetPosition.companyName) promptText += `- Perusahaan: ${data.targetPosition.companyName}\n`;
    if (data.targetPosition.industry) promptText += `- Industri: ${data.targetPosition.industry}\n\n`;
  }

  if (data.biodata) {
    promptText += `### Biodata Diri\n`;
    promptText += `- Nama: ${data.biodata.name || 'N/A'}\n`;
    promptText += `- Alamat: ${data.biodata.address || 'N/A'}\n`;
    promptText += `- Kontak: ${data.biodata.contactNumber || 'N/A'}\n`;
    promptText += `- Tempat/Tgl Lahir: ${data.biodata.birthPlaceDate || 'N/A'}\n`;
    promptText += `- Gender: ${data.biodata.gender || 'N/A'}\n\n`;
  }

  if (data.shortProfile) {
    promptText += `### Profil Singkat\n`;
    promptText += `- Latar Belakang: ${data.shortProfile.background || 'N/A'}\n`;
    promptText += `- Kekuatan Utama: ${data.shortProfile.strengths || 'N/A'}\n`;
    promptText += `- Tujuan Karier: ${data.shortProfile.careerGoals || 'N/A'}\n`;
    promptText += `- Nilai untuk Tim: ${data.shortProfile.teamValue || 'N/A'}\n\n`;
  }

  if (data.education && data.education.length > 0) {
    promptText += `### Pendidikan\n`;
    data.education.forEach(edu => {
      promptText += `- ${edu.level} ${edu.major} di ${edu.institution} (${edu.yearRange})\n`;
      if (edu.gpa) promptText += `  - IPK: ${edu.gpa}\n`;
      if (edu.achievements) promptText += `  - Prestasi: ${edu.achievements}\n`;
    });
    promptText += "\n";
  }

  if (data.experience && data.experience.length > 0) {
    promptText += `### Pengalaman Kerja\n`;
    data.experience.forEach(exp => {
      promptText += `- ${exp.position} di ${exp.company} (${exp.location}, ${exp.period})\n`;
      promptText += `  - Tugas: ${exp.tasks}\n`;
      if (exp.achievements) promptText += `  - Pencapaian: ${exp.achievements}\n`;
    });
    promptText += "\n";
  }

  if (data.skills && data.skills.hasSkills) {
    promptText += `### Keahlian\n`;
    if (data.skills.mainSkills) promptText += `- Utama: ${data.skills.mainSkills}\n`;
    if (data.skills.foreignLanguages) promptText += `- Bahasa Asing: ${data.skills.foreignLanguages}\n`;
    promptText += "\n";
  }

  if (data.hobbies && data.hobbies.hasHobbies) {
    if (data.hobbies.hobbiesList) promptText += `### Hobi\n- ${data.hobbies.hobbiesList}\n\n`;
  }

  if (data.references && data.references.hasReferences && data.references.entries && data.references.entries.length > 0) {
    promptText += `### Referensi\n`;
    data.references.entries.forEach(ref => {
      promptText += `- ${ref.fullName}, ${ref.position} di ${ref.company} (Kontak: ${ref.contactNumber})\n`;
      if(ref.email) promptText += `  Email: ${ref.email}\n`;
      promptText += `  Hubungan: ${ref.relationship}\n`;
    });
    promptText += "\n";
  }
  return promptText;
}


const generateResumePrompt = ai.definePrompt({
  name: 'generateFullResumePrompt',
  system: systemPrompt,
  input: { schema: GenerateFullResumeInputSchema },
  output: { schema: GenerateFullResumeOutputSchema },
  prompt: (input: GenerateFullResumeInput) => {
    let fullPrompt = formatResumeDataForPrompt(input.resumeData as FullResumeValues);
    if (input.referenceTemplatePdfUri) {
      fullPrompt += `\n\n## Referensi Template Gaya dan Nada (PDF):\n{{media url="${input.referenceTemplatePdfUri}"}}\n\nInstruksi Tambahan: Harap perhatikan gaya penulisan, struktur bagian, dan nada keseluruhan dari dokumen PDF referensi yang dilampirkan. Gunakan sebagai panduan untuk menghasilkan resume yang sesuai, namun tetap utamakan konten dari data pengguna.`;
    } else {
      fullPrompt += "\n\nTidak ada template PDF referensi yang diberikan. Buat resume berdasarkan tipe yang dipilih dan data pengguna saja.";
    }
    return fullPrompt;
  },
  config: {
    // Adjust temperature for creativity vs. fidelity. Lower for more factual.
    temperature: 0.4,
  }
});

const generateFullResumeFlow = ai.defineFlow(
  {
    name: 'generateFullResumeFlow',
    inputSchema: GenerateFullResumeInputSchema,
    outputSchema: GenerateFullResumeOutputSchema,
  },
  async (input) => {
    const { output } = await generateResumePrompt(input);
    if (!output) {
        throw new Error("AI failed to generate resume content.");
    }
    return output;
  }
);

