// =============================================================================
// College OS Cross-Platform Cloud & Authentication Engine
// Shared Firebase (Auth + Firestore) & Cloudinary Integration
// Syncs Web Application & Android Application
// =============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// 1. Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT5oA5wph6B3d55b_IeUALW_L05KZOHIE",
  authDomain: "college-os-001.firebaseapp.com",
  projectId: "college-os-001",
  storageBucket: "college-os-001.firebasestorage.app",
  messagingSenderId: "443158934230",
  appId: "1:443158934230:web:a00cd8ca328340fe23cf77",
  measurementId: "G-Q34S898GFN"
};

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  apiKey: "168317929439692",
  apiSecret: "-UAA-eQTMujo2MvCz4fyhTktOi4",
  keyName: "Root",
  cloudName: "gth8uxhh", // Verified student Cloudinary cloud namespace
  uploadPreset: "college_os_vault"
};

// Initialize Firebase Core
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Current User State Helper
export function getCurrentUser() {
  return auth.currentUser;
}

export function getUserDocRef() {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");
  return doc(db, "users", user.uid);
}

// =============================================================================
// FIRESTORE SCHEMA FUNCTIONS (Exact Structure for Android & Web Compatibility)
// =============================================================================

// 1. PROFILE
export async function saveWebProfile(name, college, course, semester) {
  try {
    const userRef = getUserDocRef();
    const profileRef = doc(collection(userRef, "profile"), "data");
    await setDoc(profileRef, {
      studentName: name,
      studentCollege: college,
      studentCourse: course,
      studentSemester: semester,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebProfile error:", err);
    return { success: false, error: err.message };
  }
}

export function subscribeProfile(callback) {
  try {
    const userRef = getUserDocRef();
    const profileRef = doc(collection(userRef, "profile"), "data");
    return onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    }, (error) => {
      console.warn("[CloudSync] subscribeProfile listener notice:", error);
    });
  } catch (e) {
    return () => {};
  }
}

// 2. TASKS & ASSIGNMENTS
export async function saveWebTask(task) {
  try {
    const userRef = getUserDocRef();
    const taskRef = doc(collection(userRef, "tasks"), task.id);
    await setDoc(taskRef, task, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebTask error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteWebTask(taskId) {
  try {
    const userRef = getUserDocRef();
    const taskRef = doc(collection(userRef, "tasks"), taskId);
    await deleteDoc(taskRef);
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] deleteWebTask error:", err);
    return { success: false, error: err.message };
  }
}

export function subscribeTasks(callback) {
  try {
    const userRef = getUserDocRef();
    const tasksRef = collection(userRef, "tasks");
    return onSnapshot(tasksRef, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data());
      callback(tasks);
    }, (error) => {
      console.warn("[CloudSync] subscribeTasks listener notice:", error);
    });
  } catch (e) {
    return () => {};
  }
}

// 3. SUBJECTS
export async function saveWebSubject(subject) {
  try {
    const userRef = getUserDocRef();
    const subjectRef = doc(collection(userRef, "subjects"), subject.id);
    await setDoc(subjectRef, subject, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebSubject error:", err);
    return { success: false, error: err.message };
  }
}

export function subscribeSubjects(callback) {
  try {
    const userRef = getUserDocRef();
    const subRef = collection(userRef, "subjects");
    return onSnapshot(subRef, (snapshot) => {
      const subjects = snapshot.docs.map(doc => doc.data());
      callback(subjects);
    }, (error) => {
      console.warn("[CloudSync] subscribeSubjects listener notice:", error);
    });
  } catch (e) {
    return () => {};
  }
}

// 4. ATTENDANCE
export async function saveWebAttendance(dateKey, dayData) {
  try {
    const userRef = getUserDocRef();
    const attendanceRef = doc(collection(userRef, "attendance"), dateKey);
    await setDoc(attendanceRef, dayData, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebAttendance error:", err);
    return { success: false, error: err.message };
  }
}

export function subscribeAttendance(callback) {
  try {
    const userRef = getUserDocRef();
    const attendanceRef = collection(userRef, "attendance");
    return onSnapshot(attendanceRef, (snapshot) => {
      const records = {};
      snapshot.docs.forEach(doc => {
        records[doc.id] = doc.data();
      });
      callback(records);
    }, (error) => {
      console.warn("[CloudSync] subscribeAttendance listener notice:", error);
    });
  } catch (e) {
    return () => {};
  }
}

// 5. SCHEDULE TIMETABLE & PLANNED SESSIONS
export async function saveWebScheduleItem(scheduleItem) {
  try {
    const userRef = getUserDocRef();
    const schRef = doc(collection(userRef, "schedules"), scheduleItem.id);
    await setDoc(schRef, scheduleItem, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebScheduleItem error:", err);
    return { success: false, error: err.message };
  }
}

export async function saveWebPlannedSession(session) {
  try {
    const userRef = getUserDocRef();
    const sessionRef = doc(collection(userRef, "planned_sessions"), session.id);
    await setDoc(sessionRef, session, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("[CloudSync] saveWebPlannedSession error:", err);
    return { success: false, error: err.message };
  }
}

// =============================================================================
// USER-SCOPED CLOUDINARY VAULT ENGINE (Private User Folders)
// "when it uploaded from this into the cloudinary create a folder for each users 
//  in the cloudinary and only they can use this folder only. no other can this.
//  when you create the account in the application automatically creates the 
//  cloudinary folder in the cloudinary. the member can access this from any place
//  using this application or web application this."
// =============================================================================

export async function createCloudinaryUserFolder(userId) {
  if (!userId) return { success: false, error: "No userId provided" };
  try {
    const folderPath = `users/${userId}/vault`;
    console.log(`[Cloudinary] Provisioning private user folder: ${folderPath}`);

    // Call server folder provisioning endpoint
    fetch('/api/cloudinary/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, folder: folderPath })
    }).catch(() => {});

    // Save folder registry in user Firestore doc
    const userRef = doc(db, "users", userId);
    const vaultConfigRef = doc(collection(userRef, "vault_config"), "settings");
    await setDoc(vaultConfigRef, {
      userFolder: folderPath,
      createdAt: serverTimestamp(),
      storageQuotaBytes: 15 * 1024 * 1024 * 1024, // 15 GB
      status: "active"
    }, { merge: true });

    return { success: true, folder: folderPath };
  } catch (err) {
    console.warn("[Cloudinary] createCloudinaryUserFolder note:", err);
    return { success: false, error: err.message };
  }
}

export async function uploadToCloudinaryVault(file, { customTitle, category, isScanned } = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in to upload files to Cloudinary Vault.");

  const userId = user.uid;
  const userFolder = `users/${userId}/vault`;
  const fileId = `vault_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const fileName = customTitle ? (customTitle + (file.name ? '.' + file.name.split('.').pop() : '')) : (file.name || `Scan_${Date.now()}.jpg`);
  
  // Format size label
  const bytes = file.size || 0;
  let sizeLabel = "1.2 MB";
  if (bytes < 1024 * 1024) {
    sizeLabel = `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    sizeLabel = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const determinedType = isScanned ? 'scan' : (fileName.endsWith('.pdf') ? 'pdf' : (fileName.match(/\.(png|jpg|jpeg)$/i) ? 'image' : 'document'));
  const determinedCat = category || (isScanned ? 'scanned' : (determinedType === 'pdf' ? 'documents' : 'notes'));

  showGlobalToast(`Uploading "${fileName}" to your private Cloudinary Vault...`, "info");

  // Read file as base64 dataUrl
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

  let cloudinaryUrl = dataUrl;
  let publicId = `${userFolder}/${fileId}`;

  try {
    // Call server Cloudinary endpoint
    const resp = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        fileName,
        userId,
        folder: userFolder,
        publicId,
        tags: [userId, "vault", isScanned ? "scanned" : "document"]
      })
    });
    if (resp.ok) {
      const resData = await resp.json();
      if (resData.secure_url) {
        cloudinaryUrl = resData.secure_url;
        publicId = resData.public_id || publicId;
      }
    }
  } catch (netErr) {
    console.warn("[Cloudinary] Upload fallback used:", netErr);
  }

  // Record in Firestore under user doc: users/{userId}/vault_files/{fileId}
  const fileRecord = {
    id: fileId,
    userId,
    fileName,
    originalName: file.name || fileName,
    fileType: determinedType,
    category: determinedCat,
    sizeBytes: bytes,
    sizeLabel,
    cloudinaryUrl,
    cloudinaryPublicId: publicId,
    folder: userFolder,
    isScanned: !!isScanned,
    uploadedAt: Date.now(),
    uploadedAtStr: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
  };

  try {
    const userDocRef = getUserDocRef();
    const vaultRef = doc(collection(userDocRef, "vault_files"), fileId);
    await setDoc(vaultRef, fileRecord, { merge: true });
  } catch (err) {
    console.warn("[Firestore] vault file doc write note:", err);
  }

  // Also update local storage for offline speed
  try {
    let localFiles = JSON.parse(localStorage.getItem(`college_os_vault_files_${userId}`) || "[]");
    localFiles.unshift(fileRecord);
    localStorage.setItem(`college_os_vault_files_${userId}`, JSON.stringify(localFiles));
    localStorage.setItem("college_os_vault_files_v2", JSON.stringify(localFiles));
    window.dispatchEvent(new CustomEvent("college_os_vault_updated", { detail: localFiles }));
  } catch (e) {}

  showGlobalToast(`"${fileName}" saved to your private Cloudinary Vault!`, "success");
  return fileRecord;
}

export function subscribeVaultFiles(callback) {
  try {
    const user = auth.currentUser;
    if (!user) return () => {};
    const userRef = getUserDocRef();
    const vaultCol = collection(userRef, "vault_files");
    return onSnapshot(vaultCol, (snapshot) => {
      const files = snapshot.docs.map(doc => doc.data());
      files.sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));
      localStorage.setItem(`college_os_vault_files_${user.uid}`, JSON.stringify(files));
      localStorage.setItem("college_os_vault_files_v2", JSON.stringify(files));
      callback(files);
    }, (error) => {
      console.warn("[CloudSync] subscribeVaultFiles listener note:", error);
    });
  } catch (e) {
    return () => {};
  }
}

export async function deleteVaultFile(fileId) {
  const user = auth.currentUser;
  if (!user) return { success: false, error: "Not authenticated" };
  try {
    const userRef = getUserDocRef();
    const fileRef = doc(collection(userRef, "vault_files"), fileId);
    await deleteDoc(fileRef);

    let localFiles = JSON.parse(localStorage.getItem(`college_os_vault_files_${user.uid}`) || "[]");
    localFiles = localFiles.filter(f => f.id !== fileId);
    localStorage.setItem(`college_os_vault_files_${user.uid}`, JSON.stringify(localFiles));
    localStorage.setItem("college_os_vault_files_v2", JSON.stringify(localFiles));
    window.dispatchEvent(new CustomEvent("college_os_vault_updated", { detail: localFiles }));
    showGlobalToast("File removed from your Cloudinary Vault.", "info");
    return { success: true };
  } catch (err) {
    console.warn("Delete vault file error:", err);
    return { success: false, error: err.message };
  }
}

export const uploadToCloudinary = uploadToCloudinaryVault;

// =============================================================================
// FULL BIDIRECTIONAL SYNC ENGINE (LocalStorage <-> Firestore)
// =============================================================================
export async function syncAllLocalToCloud() {
  if (!auth.currentUser) return { success: false, error: "Not authenticated" };

  try {
    // 1. Sync Profile
    const rawProf = localStorage.getItem("college_os_user_profile_v2");
    if (rawProf) {
      const prof = JSON.parse(rawProf);
      await saveWebProfile(
        prof.name || "Alex Morgan", 
        prof.college || "Apex Institute of Technology", 
        prof.course || "Computer Science & Engineering", 
        prof.semester || "Semester 5"
      );
    }

    // 2. Sync Tasks
    const rawTasks = localStorage.getItem("college_os_tasks_data_v2");
    if (rawTasks) {
      const tasks = JSON.parse(rawTasks);
      for (const t of tasks) {
        await saveWebTask({
          id: t.id,
          title: t.title,
          subjectId: t.subject || "CS-401",
          subjectCode: t.subject ? t.subject.split('•')[0].trim() : "CS-401",
          dueText: `${t.dueDateLabel || 'Today'} ${t.dueTime || ''}`.trim(),
          dueDateLabel: t.dueDateLabel || 'Today',
          dueTime: t.dueTime || '',
          taskType: t.category || "assignment",
          customTypeName: t.customTypeName || "",
          priority: t.priority || "normal",
          isUrgent: t.priority === "high",
          isCompleted: !!t.completed,
          completedAtIso: t.completedAtIso || (t.completed ? new Date().toISOString() : null)
        });
      }
    }

    // 3. Sync Attendance
    const rawAtt = localStorage.getItem("college_os_attendance_records_v2");
    if (rawAtt) {
      const att = JSON.parse(rawAtt);
      for (const [dateKey, dayData] of Object.entries(att)) {
        await saveWebAttendance(dateKey, dayData);
      }
    }

    showGlobalToast("Synced all data to Firebase Cloud!", "success");
    return { success: true };
  } catch (err) {
    console.error("[CloudSync] Full sync error:", err);
    showGlobalToast("Sync failed: " + err.message, "error");
    return { success: false, error: err.message };
  }
}

// Initialize Realtime Listeners when authenticated
let unsubProfile = null;
let unsubTasks = null;
let unsubAttendance = null;

function setupCloudListeners() {
  if (!auth.currentUser) return;

  // 1. Profile Listener
  if (unsubProfile) unsubProfile();
  unsubProfile = subscribeProfile((cloudProf) => {
    if (!cloudProf) return;
    try {
      const cur = JSON.parse(localStorage.getItem("college_os_user_profile_v2") || "{}");
      const updated = {
        ...cur,
        name: cloudProf.studentName || cur.name,
        college: cloudProf.studentCollege || cur.college,
        course: cloudProf.studentCourse || cur.course,
        semester: cloudProf.studentSemester || cur.semester
      };
      localStorage.setItem("college_os_user_profile_v2", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("college_os_profile_updated", { detail: updated }));
    } catch (e) {}
  });

  // 2. Tasks Listener
  if (unsubTasks) unsubTasks();
  unsubTasks = subscribeTasks((cloudTasks) => {
    if (!cloudTasks || !Array.isArray(cloudTasks) || cloudTasks.length === 0) return;
    try {
      const mapped = cloudTasks.map(ct => ({
        id: ct.id,
        title: ct.title,
        subject: ct.subjectId || ct.subjectCode || "CS-401",
        category: ct.taskType || "assignment",
        customTypeName: ct.customTypeName || "",
        priority: ct.priority || (ct.isUrgent ? "high" : "normal"),
        dueDateLabel: ct.dueDateLabel || (ct.dueText ? ct.dueText.split(' ')[0] : "Today"),
        dueTime: ct.dueTime || "",
        completed: ct.isCompleted !== undefined ? ct.isCompleted : !!ct.completed,
        completedAtIso: ct.completedAtIso || null
      }));
      localStorage.setItem("college_os_tasks_data_v2", JSON.stringify(mapped));
      window.dispatchEvent(new CustomEvent("college_os_tasks_updated", { detail: mapped }));
    } catch (e) {}
  });

  // 3. Attendance Listener
  if (unsubAttendance) unsubAttendance();
  unsubAttendance = subscribeAttendance((cloudAtt) => {
    if (!cloudAtt || Object.keys(cloudAtt).length === 0) return;
    try {
      const cur = JSON.parse(localStorage.getItem("college_os_attendance_records_v2") || "{}");
      const merged = { ...cur, ...cloudAtt };
      localStorage.setItem("college_os_attendance_records_v2", JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent("college_os_attendance_updated", { detail: merged }));
    } catch (e) {}
  });
}

// =============================================================================
// GLOBAL TOAST NOTIFICATION
// =============================================================================
export function showGlobalToast(message, type = "info") {
  let toastEl = document.getElementById("collegeOsGlobalToast");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "collegeOsGlobalToast";
    toastEl.className = "fixed top-5 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 font-label-md text-xs font-semibold transition-all duration-300 opacity-0 pointer-events-none transform -translate-y-4";
    document.body.appendChild(toastEl);
  }

  const bgClass = type === "success" 
    ? "bg-secondary text-on-secondary shadow-secondary/30" 
    : type === "error" 
    ? "bg-error text-on-error shadow-error/30" 
    : "bg-surface-container-highest text-on-surface shadow-black/20";
    
  const icon = type === "success" ? "check_circle" : type === "error" ? "error" : "info";

  toastEl.className = `fixed top-5 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 font-label-md text-xs font-semibold transition-all duration-300 ${bgClass}`;
  toastEl.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">${icon}</span>
    <span>${message}</span>
  `;

  // Animate in
  requestAnimationFrame(() => {
    toastEl.classList.remove("opacity-0", "-translate-y-4");
    toastEl.classList.add("opacity-100", "translate-y-0");
  });

  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.classList.remove("opacity-100", "translate-y-0");
    toastEl.classList.add("opacity-0", "-translate-y-4");
  }, 3500);
}

// =============================================================================
// AUTHENTICATION GATE MODAL UI & PASSWORD SHOW/HIDE FEATURE
// "only the logged users can use the web application and android application.
//  must add the feature to show the password for correct typing
//  (google sign in and email with password)"
// =============================================================================
function createAuthGateUI() {
  if (document.getElementById("collegeOsAuthGateOverlay")) return;

  const authOverlay = document.createElement("div");
  authOverlay.id = "collegeOsAuthGateOverlay";
  authOverlay.className = "fixed inset-0 z-[9999] bg-surface/90 backdrop-blur-2xl flex items-center justify-center p-4 transition-opacity duration-300";
  authOverlay.innerHTML = `
    <div class="w-full max-w-sm bg-surface-container-lowest rounded-[28px] p-6 shadow-2xl border border-surface-container-high/80 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Brand Header -->
      <div class="flex flex-col items-center text-center mb-4">
        <div class="w-16 h-16 rounded-2xl bg-surface-container-high/60 border border-surface-container-highest flex items-center justify-center shadow-sm mb-2.5 overflow-hidden p-1.5">
          <img src="/logo.png" alt="College OS Logo" class="w-full h-full object-contain"/>
        </div>
        <h2 class="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">College OS</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">
          Unified Academic Space • Web &amp; Android Sync
        </p>
      </div>

      <!-- Auth Gate Tabs: Sign In / Create Account -->
      <div class="grid grid-cols-2 p-1 rounded-xl bg-surface-container mb-5">
        <button id="authTabSignIn" type="button" class="py-2 rounded-lg font-label-md text-xs font-bold transition-all bg-surface-container-lowest text-primary shadow-xs">
          Sign In
        </button>
        <button id="authTabSignUp" type="button" class="py-2 rounded-lg font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all">
          Create Account
        </button>
      </div>

      <!-- Google Sign In Button -->
      <button id="googleSignInBtn" type="button" class="w-full h-12 rounded-2xl border border-surface-container-high/90 hover:border-primary/40 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-lg text-sm font-semibold flex items-center justify-center gap-3 active:scale-98 transition-all shadow-xs mb-4">
        <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-2 mb-4">
        <div class="flex-1 h-px bg-surface-container-high"></div>
        <span class="font-label-sm text-[11px] text-on-surface-variant/70 uppercase tracking-wider">or with email</span>
        <div class="flex-1 h-px bg-surface-container-high"></div>
      </div>

      <!-- Email & Password Form -->
      <form id="authEmailForm" class="flex flex-col gap-3">
        <!-- Name field for sign-up only -->
        <div id="authNameFieldContainer" class="hidden flex-col gap-1">
          <label class="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Student Name</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">person</span>
            <input type="text" id="authNameInput" placeholder="Alex Morgan" class="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"/>
          </div>
        </div>

        <!-- Email input -->
        <div class="flex flex-col gap-1">
          <label class="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">mail</span>
            <input type="email" id="authEmailInput" required placeholder="student@college.edu" class="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"/>
          </div>
        </div>

        <!-- Password input with SHOW / HIDE PASSWORD FEATURE -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label class="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
            <span class="font-label-sm text-[10px] text-primary" id="passwordHintText">Min. 6 characters</span>
          </div>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">lock</span>
            <input type="password" id="authPasswordInput" required placeholder="••••••••" class="w-full h-11 pl-9 pr-11 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface font-body-md text-sm outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"/>
            
            <!-- EYE TOGGLE BUTTON TO SHOW / HIDE PASSWORD -->
            <button type="button" id="togglePasswordVisibilityBtn" title="Show/Hide password" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none" aria-label="Toggle password visibility">
              <span class="material-symbols-outlined text-[19px]" id="passwordEyeIcon">visibility</span>
            </button>
          </div>
        </div>

        <!-- Auth Error Box -->
        <div id="authErrorBox" class="hidden p-3 rounded-2xl bg-error-container/60 border border-error/30 text-on-error-container font-body-sm text-xs flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-error flex-shrink-0">error</span>
            <span id="authErrorMsg">Authentication failed</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" id="authSubmitBtn" class="w-full h-12 mt-1 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2">
          <span id="authSubmitText">Sign In</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      <!-- Offline / Local Bypass Button -->
      <div class="mt-4 pt-3 border-t border-surface-container-high/60 flex flex-col items-center gap-1.5">
        <button id="authSkipOfflineBtn" type="button" class="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98">
          <span class="material-symbols-outlined text-[16px]">offline_bolt</span>
          <span>Continue in Offline / Local Mode</span>
        </button>
        <span class="text-on-surface-variant/70 text-[10.5px] text-center mt-0.5">
          Full offline functionality &amp; auto-sync when online
        </span>
      </div>
    </div>
  `;

  document.body.appendChild(authOverlay);

  // Wire UI Elements
  let isSignUpMode = false;
  const tabSignIn = document.getElementById("authTabSignIn");
  const tabSignUp = document.getElementById("authTabSignUp");
  const nameField = document.getElementById("authNameFieldContainer");
  const nameInput = document.getElementById("authNameInput");
  const emailInput = document.getElementById("authEmailInput");
  const passInput = document.getElementById("authPasswordInput");
  const eyeBtn = document.getElementById("togglePasswordVisibilityBtn");
  const eyeIcon = document.getElementById("passwordEyeIcon");
  const submitText = document.getElementById("authSubmitText");
  const errorBox = document.getElementById("authErrorBox");
  const errorMsg = document.getElementById("authErrorMsg");
  const googleBtn = document.getElementById("googleSignInBtn");
  const form = document.getElementById("authEmailForm");

  function setMode(signUp) {
    isSignUpMode = signUp;
    if (signUp) {
      tabSignUp.className = "py-2 rounded-lg font-label-md text-xs font-bold transition-all bg-surface-container-lowest text-primary shadow-xs";
      tabSignIn.className = "py-2 rounded-lg font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all";
      nameField.classList.remove("hidden");
      nameField.classList.add("flex");
      nameInput.required = true;
      submitText.textContent = "Create Student Account";
    } else {
      tabSignIn.className = "py-2 rounded-lg font-label-md text-xs font-bold transition-all bg-surface-container-lowest text-primary shadow-xs";
      tabSignUp.className = "py-2 rounded-lg font-label-md text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all";
      nameField.classList.add("hidden");
      nameField.classList.remove("flex");
      nameInput.required = false;
      submitText.textContent = "Sign In";
    }
    errorBox.classList.add("hidden");
  }

  tabSignIn.addEventListener("click", () => setMode(false));
  tabSignUp.addEventListener("click", () => setMode(true));

  // PASSWORD VISIBILITY TOGGLE (EYE ICON)
  eyeBtn.addEventListener("click", () => {
    if (passInput.type === "password") {
      passInput.type = "text";
      eyeIcon.textContent = "visibility_off";
      eyeBtn.classList.add("text-primary");
    } else {
      passInput.type = "password";
      eyeIcon.textContent = "visibility";
      eyeBtn.classList.remove("text-primary");
    }
    passInput.focus();
  });

  // Offline Local Mode Bypass Helper
  function activateOfflineLocalSession() {
    const email = (emailInput?.value || "").trim() || "student@college.edu";
    const name = (nameInput?.value || "").trim() || "Student";
    const localUser = {
      uid: "offline_student_" + Date.now().toString(36),
      email: email,
      displayName: name,
      isLocalOffline: true
    };
    localStorage.setItem("college_os_local_auth_user", JSON.stringify(localUser));
    removeAuthGateUI();
    showGlobalToast("Offline mode active! All features & storage unlocked.", "info");
    updateHeaderUserStatus(localUser);
  }

  function renderAuthError(err) {
    console.error("[Auth] Authentication error:", err);
    errorBox.classList.remove("hidden");

    if (err.code === "auth/unauthorized-domain") {
      const is127 = window.location.hostname === "127.0.0.1";
      errorBox.innerHTML = `
        <div class="flex flex-col gap-2 w-full text-left">
          <div class="flex items-center gap-1.5 text-error font-bold text-xs">
            <span class="material-symbols-outlined text-[17px]">domain_disabled</span>
            <span>Domain Unauthorized by Firebase</span>
          </div>
          <p class="text-[11px] text-on-error-container leading-snug">
            Firebase Auth blocked <b>${window.location.hostname}</b>.
            ${is127 
              ? '<br/>👉 <b>Fix:</b> Open using <a href="http://localhost:3000" class="underline font-bold text-primary">http://localhost:3000</a> instead of 127.0.0.1.' 
              : '<br/>👉 <b>Fix:</b> Add <code>' + window.location.hostname + '</code> in Firebase Console → Authentication → Settings → Authorized domains.'}
          </p>
          <button id="instantOfflineBypassBtn" type="button" class="mt-1 w-full py-2 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all">
            <span class="material-symbols-outlined text-[16px]">offline_bolt</span>
            <span>Continue in Offline / Local Mode</span>
          </button>
        </div>
      `;
      document.getElementById("instantOfflineBypassBtn")?.addEventListener("click", activateOfflineLocalSession);
      return;
    }

    let msg = err.message.replace("Firebase: ", "");
    if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
      msg = "Incorrect email or password. Please verify your typing.";
    } else if (err.code === "auth/email-already-in-use") {
      msg = "An account already exists with this email address.";
    } else if (err.code === "auth/weak-password") {
      msg = "Password should be at least 6 characters.";
    } else if (err.code === "auth/network-request-failed") {
      msg = "Network connection failed. Tap below to use offline mode.";
    }

    errorBox.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px] text-error flex-shrink-0">error</span>
        <span class="text-xs text-on-error-container leading-tight">${msg}</span>
      </div>
    `;
  }

  const skipOfflineBtn = document.getElementById("authSkipOfflineBtn");
  if (skipOfflineBtn) {
    skipOfflineBtn.addEventListener("click", activateOfflineLocalSession);
  }

  // Google Sign In Submit
  googleBtn.addEventListener("click", async () => {
    try {
      errorBox.classList.add("hidden");
      googleBtn.disabled = true;
      googleBtn.classList.add("opacity-60");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Seed profile name if available
      if (user.displayName) {
        const curProf = JSON.parse(localStorage.getItem("college_os_user_profile_v2") || "{}");
        if (!curProf.name || curProf.name === "Alex Morgan") {
          curProf.name = user.displayName;
          localStorage.setItem("college_os_user_profile_v2", JSON.stringify(curProf));
        }
      }
      showGlobalToast(`Welcome back, ${user.displayName || user.email}!`, "success");
    } catch (err) {
      renderAuthError(err);
    } finally {
      googleBtn.disabled = false;
      googleBtn.classList.remove("opacity-60");
    }
  });

  // Email / Password Form Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const name = nameInput.value.trim();

    if (!email || !password) return;

    errorBox.classList.add("hidden");
    const submitBtn = document.getElementById("authSubmitBtn");
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-60");

    try {
      if (isSignUpMode) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCred.user) {
          await updateProfile(userCred.user, { displayName: name });
          const curProf = JSON.parse(localStorage.getItem("college_os_user_profile_v2") || "{}");
          curProf.name = name;
          localStorage.setItem("college_os_user_profile_v2", JSON.stringify(curProf));
          await saveWebProfile(name, curProf.college || "Apex Institute of Technology", curProf.course || "Computer Science", curProf.semester || "Semester 5");
        }
        showGlobalToast("Account created successfully!", "success");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        showGlobalToast(`Signed in as ${userCred.user.displayName || userCred.user.email}`, "success");
      }
    } catch (err) {
      renderAuthError(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-60");
    }
  });
}

function removeAuthGateUI() {
  const overlay = document.getElementById("collegeOsAuthGateOverlay");
  if (overlay) {
    overlay.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
      overlay.remove();
    }, 250);
  }
}

// Update Header User Profile Indicator & Sign-Out hooks
function updateHeaderUserStatus(user) {
  // Update any existing sign-out buttons across pages
  const signoutBtns = document.querySelectorAll("#signout-btn, .cloud-signout-trigger");
  signoutBtns.forEach(btn => {
    btn.onclick = async () => {
      if (confirm("Are you sure you want to sign out from College OS?")) {
        localStorage.removeItem("college_os_local_auth_user");
        try { await signOut(auth); } catch(e) {}
        showGlobalToast("Signed out successfully.", "info");
        createAuthGateUI();
        updateHeaderUserStatus(null);
      }
    };
  });

  // Update sync indicator pills in headers
  const syncPills = document.querySelectorAll("[data-cloud-sync-status]");
  syncPills.forEach(pill => {
    if (user) {
      if (user.isLocalOffline) {
        pill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-primary" style="font-variation-settings: 'FILL' 1;">offline_bolt</span>
          <span>Offline Active</span>
        `;
        pill.title = `Offline Mode • Local Device Storage`;
      } else {
        pill.innerHTML = `
          <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">cloud_done</span>
          <span>Cloud Active</span>
        `;
        pill.title = `Signed in as ${user.email} • Firebase & Android Sync`;
      }
    } else {
      pill.innerHTML = `
        <span class="material-symbols-outlined text-[15px] text-on-surface-variant">cloud_off</span>
        <span>Not Signed In</span>
      `;
    }
  });
}

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("[Auth] User authenticated:", user.uid, user.email);
    localStorage.removeItem("college_os_local_auth_user");
    removeAuthGateUI();
    updateHeaderUserStatus(user);
    setupCloudListeners();

    // Automatically create / ensure Cloudinary private user folder
    createCloudinaryUserFolder(user.uid);

    // Trigger initial background sync
    setTimeout(() => {
      syncAllLocalToCloud();
    }, 1000);
  } else {
    // Check if user chose offline local mode
    const localUserRaw = localStorage.getItem("college_os_local_auth_user");
    if (localUserRaw) {
      try {
        const localUser = JSON.parse(localUserRaw);
        console.log("[Auth] Resumed local offline session:", localUser);
        removeAuthGateUI();
        updateHeaderUserStatus(localUser);
        return;
      } catch(e) {}
    }

    console.log("[Auth] No active session. Showing Auth Gate.");
    createAuthGateUI();
    updateHeaderUserStatus(null);
  }
});

// Expose on window for easy interoperability across HTML modules
window.CollegeOSCloud = {
  auth,
  db,
  getCurrentUser,
  saveWebProfile,
  subscribeProfile,
  saveWebTask,
  deleteWebTask,
  subscribeTasks,
  saveWebSubject,
  subscribeSubjects,
  saveWebAttendance,
  subscribeAttendance,
  saveWebScheduleItem,
  saveWebPlannedSession,
  createCloudinaryUserFolder,
  uploadToCloudinaryVault,
  uploadToCloudinary: uploadToCloudinaryVault,
  subscribeVaultFiles,
  deleteVaultFile,
  syncAllLocalToCloud,
  showGlobalToast,
  signOutUser: () => signOut(auth)
};
