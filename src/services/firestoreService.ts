
import { db, auth, storage } from '@/config/firebase'; // Added storage
import {
  doc, getDoc, setDoc, collection, getDocs, deleteDoc, serverTimestamp,
  updateDoc, query, orderBy, where, limit, addDoc, writeBatch
} from 'firebase/firestore';
import { 
  ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject 
} from "firebase/storage"; // Added storage imports
import type {
  LogoValues, BlogPostValues, BlogPostDocument, FooterContentValues, AboutUsContentValues,
  BantuanContentValues, FullResumeValues, ResumeDocument,
  AiResumeTemplateValues, AiResumeTemplateDocument
} from '@/lib/schema';

const CMS_COLLECTION = 'cms_content';
const BLOG_POSTS_COLLECTION = 'blog_posts';
const USER_RESUMES_COLLECTION_GROUP = 'resumes'; 
const AI_RESUME_TEMPLATES_COLLECTION = 'ai_resume_templates';
const AI_TEMPLATE_PDF_STORAGE_PATH = 'ai_template_pdfs';


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
    userId, 
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
const uploadFileToStorage = async (file: File, path: string): Promise<{ downloadURL: string, storagePath: string }> => {
  const fileRef = storageRef(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        // Optional: handle progress
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadURL, storagePath: path });
      }
    );
  });
};

const deleteFileFromStorage = async (path: string | null | undefined): Promise<void> => {
  if (!path) return;
  const fileRef = storageRef(storage, path);
  try {
    await deleteObject(fileRef);
  } catch (error: any) {
    // It's okay if the file doesn't exist (e.g., already deleted or path error)
    if (error.code !== 'storage/object-not-found') {
      console.error("Error deleting file from storage:", error);
      // Decide if you want to re-throw or just log
    }
  }
};


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

export async function addAiResumeTemplate(data: AiResumeTemplateValues, file?: File): Promise<string> {
  const { id: RHFId, ...templateData } = data;
  
  let fileDetails: { contentUrl: string | null, contentFileName: string | null, contentStoragePath: string | null } = {
    contentUrl: null,
    contentFileName: null,
    contentStoragePath: null,
  };

  const docRef = doc(collection(db, AI_RESUME_TEMPLATES_COLLECTION)); // Create ref to get ID first

  if (file) {
    const filePath = `${AI_TEMPLATE_PDF_STORAGE_PATH}/${docRef.id}/${file.name}`;
    const { downloadURL, storagePath } = await uploadFileToStorage(file, filePath);
    fileDetails = { contentUrl: downloadURL, contentFileName: file.name, contentStoragePath: storagePath };
  }

  const newTemplateData = {
    ...templateData,
    ...fileDetails,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(docRef, newTemplateData); // Use setDoc with the pre-generated ref
  return docRef.id;
}

export async function updateAiResumeTemplate(
  id: string, 
  data: Partial<AiResumeTemplateValues>, 
  file?: File,
  currentStoragePath?: string | null
): Promise<void> {
  const { id: RHFId, ...templateData } = data;
  const docRef = doc(db, AI_RESUME_TEMPLATES_COLLECTION, id);
  
  let dataToUpdate: Partial<AiResumeTemplateValues> = { ...templateData };

  if (file) { // New file uploaded or replacing existing
    if (currentStoragePath) {
      await deleteFileFromStorage(currentStoragePath);
    }
    const filePath = `${AI_TEMPLATE_PDF_STORAGE_PATH}/${id}/${file.name}`;
    const { downloadURL, storagePath: newStoragePath } = await uploadFileToStorage(file, filePath);
    dataToUpdate.contentUrl = downloadURL;
    dataToUpdate.contentFileName = file.name;
    dataToUpdate.contentStoragePath = newStoragePath;
  } else if (data.contentUrl === null) { // Explicitly removing file (contentUrl set to null by form)
     if (currentStoragePath) {
      await deleteFileFromStorage(currentStoragePath);
    }
    dataToUpdate.contentUrl = null;
    dataToUpdate.contentFileName = null;
    dataToUpdate.contentStoragePath = null;
  }
  // If no new file and contentUrl is not set to null, existing file details remain unchanged.

  await updateDoc(docRef, {
    ...dataToUpdate,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAiResumeTemplate(id: string): Promise<void> {
  const docRef = doc(db, AI_RESUME_TEMPLATES_COLLECTION, id);
  const templateDoc = await getDoc(docRef);
  if (templateDoc.exists()) {
    const data = templateDoc.data() as AiResumeTemplateDocument;
    if (data.contentStoragePath) {
      await deleteFileFromStorage(data.contentStoragePath);
    }
  }
  await deleteDoc(docRef);
}
    
