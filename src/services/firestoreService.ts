import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, updateDoc, query, orderBy } from 'firebase/firestore';
import type { LogoValues, TextContentValues, BlogPostValues, FooterContentValues } from '@/lib/schema';

const CMS_COLLECTION = 'cms_content';
const BLOG_POSTS_COLLECTION = 'blog_posts';

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
  await setDoc(docRef, data, { merge: true }); // merge: true to update existing fields or create if not exists
}

// Logo
export const getLogo = () => getCmsDoc<LogoValues>('logo');
export const updateLogo = (data: LogoValues) => setCmsDoc<LogoValues>('logo', data);

// Tentang Kami
export const getTentangKami = () => getCmsDoc<TextContentValues>('tentangKami');
export const updateTentangKami = (data: TextContentValues) => setCmsDoc<TextContentValues>('tentangKami', data);

// Bantuan
export const getBantuan = () => getCmsDoc<TextContentValues>('bantuan');
export const updateBantuan = (data: TextContentValues) => setCmsDoc<TextContentValues>('bantuan', data);

// Footer
export const getFooterContent = () => getCmsDoc<FooterContentValues>('footer');
export const updateFooterContent = (data: FooterContentValues) => setCmsDoc<FooterContentValues>('footer', data);

// Blog Posts
export interface BlogPostDocument extends BlogPostValues {
  id: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export async function getBlogPosts(): Promise<BlogPostDocument[]> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as BlogPostDocument));
}

export async function getBlogPost(id: string): Promise<BlogPostDocument | null> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPostDocument;
  }
  return null;
}

export async function addBlogPost(data: BlogPostValues): Promise<string> {
  const docRef = doc(collection(db, BLOG_POSTS_COLLECTION)); // Auto-generate ID
  await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostValues>): Promise<void> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await deleteDoc(docRef);
}