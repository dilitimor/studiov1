
import * as z from 'zod';

export const TargetPositionSchema = z.object({
  applyingForPosition: z.boolean().default(false),
  positionName: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
}).refine(data => {
  if (data.applyingForPosition) {
    return !!data.positionName && data.positionName.trim() !== '';
  }
  return true;
}, {
  message: "Posisi yang dilamar wajib diisi jika Anda memilih 'Ya'",
  path: ["positionName"],
});
export type TargetPositionValues = z.infer<typeof TargetPositionSchema>;

export const BiodataSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  contactNumber: z.string().min(1, "Nomor Kontak wajib diisi").regex(/^[0-9+ -]+$/, "Format Nomor Kontak tidak valid"),
  birthPlaceDate: z.string().min(1, "Tempat & Tanggal Lahir wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan", "Lainnya"], { required_error: "Gender wajib dipilih" }),
  photoUrl: z.string().url("URL foto tidak valid").optional().or(z.literal('')),
});
export type BiodataValues = z.infer<typeof BiodataSchema>;

export const ShortProfileSchema = z.object({
  background: z.string().min(1, "Latar belakang wajib diisi"),
  strengths: z.string().min(1, "Kekuatan utama wajib diisi"),
  careerGoals: z.string().min(1, "Tujuan karier wajib diisi"),
  teamValue: z.string().min(1, "Nilai yang dibawa ke tim/perusahaan wajib diisi"),
});
export type ShortProfileValues = z.infer<typeof ShortProfileSchema>;

export const EducationEntrySchema = z.object({
  id: z.string().optional(),
  level: z.string().min(1, "Jenjang Pendidikan wajib diisi"),
  institution: z.string().min(1, "Nama Institusi wajib diisi"),
  major: z.string().min(1, "Jurusan / Program Studi wajib diisi"),
  yearRange: z.string().min(1, "Tahun Masuk – Lulus wajib diisi"),
  gpa: z.string().optional(),
  achievements: z.string().optional(),
});
export type EducationEntryValues = z.infer<typeof EducationEntrySchema>;

export const ExperienceEntrySchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Nama Perusahaan wajib diisi"),
  position: z.string().min(1, "Posisi / Jabatan wajib diisi"),
  location: z.string().min(1, "Lokasi Kerja wajib diisi"),
  period: z.string().min(1, "Periode Kerja wajib diisi"),
  tasks: z.string().min(1, "Tugas & Tanggung Jawab wajib diisi"),
  achievements: z.string().optional(),
});
export type ExperienceEntryValues = z.infer<typeof ExperienceEntrySchema>;

export const SkillsSchema = z.object({
  hasSkills: z.boolean().default(false),
  mainSkills: z.string().optional(), // Comma-separated
  foreignLanguages: z.string().optional(), // Comma-separated
}).refine(data => {
  if (data.hasSkills) {
    return !!data.mainSkills && data.mainSkills.trim() !== '';
  }
  return true;
}, {
  message: "Daftar Keahlian Utama wajib diisi jika Anda memilih 'Ya'",
  path: ["mainSkills"],
});
export type SkillsValues = z.infer<typeof SkillsSchema>;

export const HobbiesSchema = z.object({
  hasHobbies: z.boolean().default(false),
  hobbiesList: z.string().optional(), // Comma-separated
}).refine(data => {
  if (data.hasHobbies) {
    return !!data.hobbiesList && data.hobbiesList.trim() !== '';
  }
  return true;
}, {
  message: "Daftar Hobi wajib diisi jika Anda memilih 'Ya'",
  path: ["hobbiesList"],
});
export type HobbiesValues = z.infer<typeof HobbiesSchema>;

export const ReferenceEntrySchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, "Nama Lengkap wajib diisi"),
  position: z.string().min(1, "Posisi / Jabatan wajib diisi"),
  company: z.string().min(1, "Nama Perusahaan / Institusi wajib diisi"),
  contactNumber: z.string().min(1, "Nomor Telepon wajib diisi").regex(/^[0-9+ -]+$/, "Format Nomor Telepon tidak valid"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal('')),
  relationship: z.string().min(1, "Hubungan Profesional wajib diisi"),
});
export type ReferenceEntryValues = z.infer<typeof ReferenceEntrySchema>;

export const ReferencesSchema = z.object({
  hasReferences: z.boolean().default(false),
  entries: z.array(ReferenceEntrySchema).optional(),
}).refine(data => {
  if (data.hasReferences) {
    return !!data.entries && data.entries.length > 0;
  }
  return true;
}, {
  message: "Minimal satu referensi wajib diisi jika Anda memilih 'Ya'",
  path: ["entries"],
});
export type ReferencesValues = z.infer<typeof ReferencesSchema>;


export const FullResumeSchema = z.object({
  targetPosition: TargetPositionSchema,
  biodata: BiodataSchema,
  shortProfile: ShortProfileSchema,
  education: z.array(EducationEntrySchema).min(1, "Minimal satu riwayat pendidikan wajib diisi."),
  experience: z.array(ExperienceEntrySchema).optional(),
  skills: SkillsSchema,
  hobbies: HobbiesSchema,
  references: ReferencesSchema,
});
export type FullResumeValues = z.infer<typeof FullResumeSchema>;


// CMS Schemas
export const LogoSchema = z.object({
  url: z.string().url("URL logo tidak valid").or(z.literal("")),
});
export type LogoValues = z.infer<typeof LogoSchema>;

export const TextContentSchema = z.object({
  content: z.string().min(1, "Konten tidak boleh kosong"),
});
export type TextContentValues = z.infer<typeof TextContentSchema>;

export const BlogPostSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid"),
  content: z.string().min(1, "Konten wajib diisi"),
  imageUrl: z.string().url("URL gambar tidak valid").or(z.literal("")),
  imageAlt: z.string().optional(),
  dataAiHint: z.string().optional(),
});
export type BlogPostValues = z.infer<typeof BlogPostSchema>;

export const FooterContentSchema = z.object({
  text: z.string().min(1, "Teks footer tidak boleh kosong"),
});
export type FooterContentValues = z.infer<typeof FooterContentSchema>;

    