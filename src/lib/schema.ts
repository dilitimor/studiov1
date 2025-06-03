
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
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Gender wajib dipilih" }),
  photoUrl: z.string().optional().or(z.literal('')),
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
  id: z.string().optional(), // for useFieldArray
  level: z.string().min(1, "Jenjang Pendidikan wajib diisi"),
  institution: z.string().min(1, "Nama Institusi wajib diisi"),
  major: z.string().min(1, "Jurusan / Program Studi wajib diisi"),
  yearRange: z.string().min(1, "Tahun Masuk – Lulus wajib diisi"),
  gpa: z.string().optional(),
  achievements: z.string().optional(),
});
export type EducationEntryValues = z.infer<typeof EducationEntrySchema>;

export const ExperienceEntrySchema = z.object({
  id: z.string().optional(), // for useFieldArray
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
  mainSkills: z.string().optional(),
  foreignLanguages: z.string().optional(),
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
  hobbiesList: z.string().optional(),
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
  id: z.string().optional(), // for useFieldArray
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
  userId: z.string().optional(), 
  targetPosition: TargetPositionSchema,
  biodata: BiodataSchema,
  shortProfile: ShortProfileSchema,
  education: z.array(EducationEntrySchema).min(1, "Minimal satu riwayat pendidikan wajib diisi."),
  experience: z.array(ExperienceEntrySchema).optional(),
  skills: SkillsSchema,
  hobbies: HobbiesSchema,
  references: ReferencesSchema,
  createdAt: z.any().optional(), 
  updatedAt: z.any().optional(), 
});
export type FullResumeValues = z.infer<typeof FullResumeSchema>;

export interface ResumeDocument extends FullResumeValues {
  id: string; 
}


// CMS Schemas
export const LogoSchema = z.object({
  dataUri: z.string().optional().nullable(),
});
export type LogoValues = z.infer<typeof LogoSchema>;

export const AboutUsContentSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong").default("Tentang CVBeres.id"),
  content: z.string().min(1, "Konten tidak boleh kosong").default("CVBeres.id adalah platform inovatif yang dirancang untuk membantu Anda membuat resume profesional dengan mudah dan cepat. Kami percaya bahwa setiap orang berhak mendapatkan kesempatan terbaik dalam karir mereka, dan resume yang kuat adalah langkah pertama menuju kesuksesan.\n\nMisi kami adalah memberdayakan pencari kerja dengan alat yang canggih namun intuitif, menggabungkan desain modern dengan teknologi AI terkini untuk menghasilkan resume yang menonjol.\n\nTim kami terdiri dari para profesional di bidang HR, desain, dan teknologi, yang berkolaborasi untuk memberikan pengalaman terbaik bagi pengguna kami."),
  imageUrl: z.string().url("URL gambar tidak valid").or(z.literal("")).optional(),
  imageAlt: z.string().optional(),
  dataAiHint: z.string().max(40, "Petunjuk AI maksimal 2 kata, dipisah spasi").optional(),
});
export type AboutUsContentValues = z.infer<typeof AboutUsContentSchema>;


export const BantuanContentSchema = z.object({
  mainTitle: z.string().min(1, "Judul utama tidak boleh kosong.").default("Pusat Bantuan CVBeres.id"),
  introText: z.string().min(1, "Teks perkenalan tidak boleh kosong.").default("Kami siap membantu Anda! Temukan jawaban atas pertanyaan umum di bawah ini, atau hubungi kami jika Anda memerlukan bantuan lebih lanjut."),
  faqTitle: z.string().min(1, "Judul FAQ tidak boleh kosong.").default("Pertanyaan Umum (FAQ)"),
  faqs: z.array(z.object({
    question: z.string().min(1, "Pertanyaan tidak boleh kosong"),
    answer: z.string().min(1, "Jawaban tidak boleh kosong"),
  })).min(1, "Minimal satu FAQ harus ada."),
  contactTitle: z.string().min(1, "Judul Kontak tidak boleh kosong.").default("Hubungi Kami"),
  contactIntroText: z.string().min(1, "Teks perkenalan kontak tidak boleh kosong.").default("Jika Anda tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi tim dukungan kami:"),
  contactEmail: z.string().email("Format email tidak valid.").optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  contactHours: z.string().optional().or(z.literal("")).default("(Jam Kerja)"),
});
export type BantuanContentValues = z.infer<typeof BantuanContentSchema>;


export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format slug tidak valid (gunakan huruf kecil, angka, dan tanda hubung)"),
  content: z.string().min(1, "Konten wajib diisi"),
  imageUrl: z.string().url("URL gambar tidak valid").or(z.literal("")).optional(),
  imageAlt: z.string().optional(),
  dataAiHint: z.string().max(40, "Petunjuk AI maksimal 2 kata, dipisah spasi").optional(),
  date: z.string().optional(),
});
export type BlogPostValues = z.infer<typeof BlogPostSchema>;
export interface BlogPostDocument extends BlogPostValues {
  id: string; 
  createdAt?: any;
  updatedAt?: any;
}

export const FooterContentSchema = z.object({
  text: z.string().min(1, "Teks footer tidak boleh kosong").default(`© ${new Date().getFullYear()} CVBeres.id. All rights reserved.`),
});
export type FooterContentValues = z.infer<typeof FooterContentSchema>;

// Schema for AI Resume Templates (Admin)
export const AiResumeTemplateSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(1, "Nama template wajib diisi"),
  description: z.string().min(1, "Deskripsi template wajib diisi"),
  contentPdfDataUri: z.string().optional().nullable(), // Stores PDF as base64 Data URI
  contentPdfFileName: z.string().optional().nullable(), // Stores the original file name
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});
export type AiResumeTemplateValues = z.infer<typeof AiResumeTemplateSchema>;
export interface AiResumeTemplateDocument extends AiResumeTemplateValues {
  id: string;
}
    
