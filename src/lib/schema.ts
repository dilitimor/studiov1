import * as z from 'zod';

export const BiodataSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  age: z.coerce.number().min(1, "Umur wajib diisi").positive("Umur harus positif"),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Gender wajib dipilih" }),
});
export type BiodataValues = z.infer<typeof BiodataSchema>;

export const EducationEntrySchema = z.object({
  id: z.string().optional(), // For client-side keying
  institution: z.string().min(1, "Nama Lembaga Pendidikan wajib diisi"),
  gpa: z.string().min(1, "Nilai/IPK wajib diisi"), // Can be string to accommodate "Baik", "Sangat Baik" or numeric
  major: z.string().min(1, "Jurusan wajib diisi"),
  skills: z.string().min(1, "Keahlian wajib diisi"), // Could be comma-separated or a textarea
});
export type EducationEntryValues = z.infer<typeof EducationEntrySchema>;

export const EducationSchema = z.object({
  entries: z.array(EducationEntrySchema).min(1, "Minimal satu riwayat pendidikan"),
});
export type EducationValues = z.infer<typeof EducationSchema>;


export const ExperienceEntrySchema = z.object({
  id: z.string().optional(), // For client-side keying
  company: z.string().min(1, "Nama Perusahaan wajib diisi"),
  department: z.string().min(1, "Nama Bagian/Departemen wajib diisi"),
  position: z.string().min(1, "Posisi Pekerjaan wajib diisi"),
  tasks: z.string().min(1, "Tugas Pekerjaan wajib diisi"),
  year: z.string().min(4, "Tahun minimal 4 digit").max(4, "Tahun maksimal 4 digit").regex(/^\d{4}$/, "Format tahun tidak valid"),
  month: z.string().min(1, "Bulan wajib diisi"), // Could be dropdown later
});
export type ExperienceEntryValues = z.infer<typeof ExperienceEntrySchema>;

export const ExperienceSchema = z.object({
  entries: z.array(ExperienceEntrySchema).min(1, "Minimal satu pengalaman kerja/magang"),
});
export type ExperienceValues = z.infer<typeof ExperienceSchema>;

export const FullResumeSchema = z.object({
  biodata: BiodataSchema,
  education: z.array(EducationEntrySchema),
  experience: z.array(ExperienceEntrySchema),
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