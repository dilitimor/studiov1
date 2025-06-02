
import { db, auth } from '@/config/firebase';
import {
  doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp,
  updateDoc, query, orderBy, where, limit, addDoc, writeBatch
} from 'firebase/firestore';
import type {
  LogoValues, BlogPostValues, BlogPostDocument, FooterContentValues, AboutUsContentValues,
  BantuanContentValues, FullResumeValues, ResumeDocument,
  AiResumeTemplateValues, AiResumeTemplateDocument
} from '@/lib/schema';

const CMS_COLLECTION = 'cms_content';
const BLOG_POSTS_COLLECTION = 'blog_posts';
const USER_RESUMES_COLLECTION_GROUP = 'resumes'; // For user-specific resumes
const AI_RESUME_TEMPLATES_COLLECTION = 'ai_resume_templates';


// Generic function to get CMS document
export async function getCmsDoc<T>(docId: string): Promise<T | null> {
  const docRef = doc(db, CMS_COLLECTION, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return null;
}

// Generic function to set CMS document
export async function setCmsDoc<T>(docId:string, data: T): Promise<void> {
  const docRef = doc(db, CMS_COLLECTION, docId);
  await setDoc(docRef, data, { merge: true });
}

// Logo
export const getLogo = () => getCmsDoc<LogoValues>('logo');
export const updateLogo = (data: LogoValues) => setCmsDoc<LogoValues>('logo', data);

// Tentang Kami
export const getTentangKami = () => getCmsDoc<AboutUsContentValues>('tentangKami');
export const updateTentangKami = (data: AboutUsContentValues) => setCmsDoc<AboutUsContentValues>('tentangKami', data);

// Bantuan (Help/FAQ)
export const getBantuan = () => getCmsDoc<BantuanContentValues>('bantuan');
export const updateBantuan = (data: BantuanContentValues) => setCmsDoc<BantuanContentValues>('bantuan', data);

// Footer
export const getFooterContent = () => getCmsDoc<FooterContentValues>('footer');
export const updateFooterContent = (data: FooterContentValues) => setCmsDoc<FooterContentValues>('footer', data);

// Blog Posts
export async function getBlogPosts(): Promise<BlogPostDocument[]> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  } as BlogPostDocument));
}

export async function getBlogPost(id: string): Promise<BlogPostDocument | null> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPostDocument;
  }
  return null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDocument | null> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), where("slug", "==", slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as BlogPostDocument;
  }
  return null;
}

export async function addBlogPost(data: BlogPostValues): Promise<string> {
  const { id: RHFId, ...postData } = data;
  const newPostData = {
    ...postData,
    date: data.date || new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), newPostData);
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostValues>): Promise<void> {
  const { id: RHFId, ...postData } = data;
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...postData,
    date: data.date || new Date().toISOString().split('T')[0],
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getAllBlogSlugs(): Promise<Array<{ slug: string }>> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    slug: (docSnap.data() as BlogPostValues).slug,
  }));
}

// User Resumes
export async function getUserResumes(userId: string): Promise<ResumeDocument[]> {
  if (!userId) return [];
  const resumesCollectionRef = collection(db, `users/${userId}/${USER_RESUMES_COLLECTION_GROUP}`);
  const q = query(resumesCollectionRef, orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  } as ResumeDocument));
}

export async function getResume(userId: string, resumeId: string): Promise<ResumeDocument | null> {
  if (!userId || !resumeId) return null;
  const resumeDocRef = doc(db, `users/${userId}/${USER_RESUMES_COLLECTION_GROUP}`, resumeId);
  const docSnap = await getDoc(resumeDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ResumeDocument;
  }
  return null;
}

export async function addResume(userId: string, data: FullResumeValues): Promise<string> {
  if (!userId) throw new Error("User ID is required to add a resume.");
  const resumesCollectionRef = collection(db, `users/${userId}/${USER_RESUMES_COLLECTION_GROUP}`);
  const dataToSave = {
    ...data,
    userId, // Ensure userId is part of the document
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(resumesCollectionRef, dataToSave);
  return docRef.id;
}

export async function updateResume(userId: string, resumeId: string, data: Partial<FullResumeValues>): Promise<void> {
  if (!userId || !resumeId) throw new Error("User ID and Resume ID are required to update a resume.");
  const resumeDocRef = doc(db, `users/${userId}/${USER_RESUMES_COLLECTION_GROUP}`, resumeId);
  const dataToUpdate = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(resumeDocRef, dataToUpdate);
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  if (!userId || !resumeId) throw new Error("User ID and Resume ID are required to delete a resume.");
  const resumeDocRef = doc(db, `users/${userId}/${USER_RESUMES_COLLECTION_GROUP}`, resumeId);
  await deleteDoc(resumeDocRef);
}


// AI Resume Templates (Admin)
export async function getAiResumeTemplates(): Promise<AiResumeTemplateDocument[]> {
  const q = query(collection(db, AI_RESUME_TEMPLATES_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  } as AiResumeTemplateDocument));
}

export async function getAiResumeTemplate(id: string): Promise<AiResumeTemplateDocument | null> {
  const docRef = doc(db, AI_RESUME_TEMPLATES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as AiResumeTemplateDocument;
  }
  return null;
}

export async function addAiResumeTemplate(data: AiResumeTemplateValues): Promise<string> {
  const { id: RHFId, ...templateData } = data;
  const newTemplateData = {
    ...templateData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, AI_RESUME_TEMPLATES_COLLECTION), newTemplateData);
  return docRef.id;
}

export async function updateAiResumeTemplate(id: string, data: Partial<AiResumeTemplateValues>): Promise<void> {
  const { id: RHFId, ...templateData } = data;
  const docRef = doc(db, AI_RESUME_TEMPLATES_COLLECTION, id);
  await updateDoc(docRef, {
    ...templateData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAiResumeTemplate(id: string): Promise<void> {
  const docRef = doc(db, AI_RESUME_TEMPLATES_COLLECTION, id);
  await deleteDoc(docRef);
}
    