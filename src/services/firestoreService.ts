
import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp, updateDoc, query, orderBy, where, limit } from 'firebase/firestore';
import type { LogoValues, TextContentValues, BlogPostValues, FooterContentValues, AboutUsContentValues, BantuanContentValues } from '@/lib/schema';

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
export interface BlogPostDocument extends BlogPostValues {
  id: string;
  createdAt?: any; 
  updatedAt?: any; 
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
  const { id, ...postData } = data; // remove client-side id if present
  const docRef = doc(collection(db, BLOG_POSTS_COLLECTION)); 
  await setDoc(docRef, { 
    ...postData, 
    date: new Date().toISOString().split('T')[0], // Set current date in YYYY-MM-DD
    createdAt: serverTimestamp(), 
    updatedAt: serverTimestamp() 
  });
  return docRef.id;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostValues>): Promise<void> {
  const { id: dataId, ...postData } = data; // remove client-side id if present
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await updateDoc(docRef, { 
    ...postData, 
    date: new Date().toISOString().split('T')[0], // Update date on edit
    updatedAt: serverTimestamp() 
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, BLOG_POSTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const q = query(collection(db, BLOG_POSTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => (docSnap.data() as BlogPostValues).slug);
}
