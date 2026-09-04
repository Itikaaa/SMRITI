/* Quiet Garden design: one calm caregiver workspace with clear ownership, warm surfaces, and gentle action feedback. */
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileHeart, Leaf, LogOut, Upload, UserRound, ShieldCheck, Image as ImageIcon, Mic2, FileText, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const languages = ["Assamese", "Bengali", "Bodo", "Manipuri", "Mizo", "Khasi", "Hindi", "English", "Kokborok"];
const purposes = [
  { value: "memory-photo", label: "Memory photo", icon: ImageIcon },
  { value: "voice-note", label: "Voice note", icon: Mic2 },
  { value: "care-document", label: "Care document", icon: FileText },
  { value: "other", label: "Other", icon: FileHeart },
] as const;

type Purpose = (typeof purposes)[number]["value"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const profileQuery = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const filesQuery = trpc.files.list.useQuery(undefined, { enabled: isAuthenticated });
  const saveProfile = trpc.profile.save.useMutation({
    onSuccess: () => {
      profileQuery.refetch();
      toast.success("Patient profile saved", { description: "SMRITI will use this information in future sessions." });
    },
    onError: (error) => toast.error("Could not save profile", { description: error.message }),
  });
  const uploadFile = trpc.files.upload.useMutation({
    onSuccess: () => {
      filesQuery.refetch();
      setSelectedFile(null);
      setConsentConfirmed(false);
      setConsentNote("");
      toast.success("File stored securely", { description: "Only your caregiver account can access this file." });
    },
    onError: (error) => toast.error("Upload could not be completed", { description: error.message }),
  });
  const updateFile = trpc.files.update.useMutation({
    onSuccess: () => { filesQuery.refetch(); toast.success("File details updated"); },
    onError: (error) => toast.error("Could not update file", { description: error.message }),
  });
  const removeFile = trpc.files.remove.useMutation({
    onSuccess: () => { filesQuery.refetch(); toast.success("File removed from the library"); },
    onError: (error) => toast.error("Could not remove file", { description: error.message }),
  });

  const [preferredName, setPreferredName] = useState("Ma");
  const [age, setAge] = useState("74");
  const [language, setLanguage] = useState("English");
  const [background, setBackground] = useState("Retired school teacher who enjoys morning walks and familiar songs.");
  const [childrenNames, setChildrenNames] = useState("Anita, Rohan");
  const [favouriteThings, setFavouriteThings] = useState("Jasmine, fish curry, old film songs");
  const [purpose, setPurpose] = useState<Purpose>("memory-photo");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [consentNote, setConsentNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profileQuery.data) return;
    setPreferredName(profileQuery.data.preferredName);
    setAge(profileQuery.data.age?.toString() ?? "");
    setLanguage(profileQuery.data.language);
    setBackground(profileQuery.data.background ?? "");
    setChildrenNames(profileQuery.data.childrenNames ?? "");
    setFavouriteThings(profileQuery.data.favouriteThings ?? "");
  }, [profileQuery.data]);

  const profileReady = useMemo(() => preferredName.trim().length > 0 && Number(age) > 0, [preferredName, age]);

  async function handleUpload() {
    if (!selectedFile) return;
    if (selectedFile.size > 8 * 1024 * 1024) {
      toast.error("Please choose a file under 8 MB");
      return;
    }
    const dataBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(selectedFile);
    });
    uploadFile.mutate({ filename: selectedFile.name, mimeType: selectedFile.type || "application/octet-stream", sizeBytes: selectedFile.size, dataBase64, purpose, patientProfileId: profileQuery.data?.id ?? null, consentStatus: consentConfirmed ? "confirmed" : "pending", consentNote: consentNote || null });
  }

  if (loading) return <div className="loading-screen"><div className="listening-orb small"><Leaf /></div><p>Opening your care room…</p></div>;

  if (!isAuthenticated) {
    return (
      <main className="auth-landing">
        <div className="auth-card">
          <div className="brand-lockup"><span className="brand-mark"><Leaf /></span><span>SMRITI</span></div>
          <p className="eyebrow">A gentle memory companion</p>
          <h1>Care that feels like a familiar conversation.</h1>
          <p className="lede">Save the small details that make your loved one feel known. SMRITI keeps caregiver notes and memory media in one private, calm place.</p>
          <Button className="primary-button" onClick={() => startLogin()}>Enter caregiver room</Button>
          <p className="privacy-note"><ShieldCheck size={15} /> Your caregiver room is protected by secure sign-in.</p>
        </div>
        <div className="auth-art"><img src="/manus-storage/smriti-care-hero_65097b78.jpg" alt="A sunlit table with a water glass and care notes" /></div>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><span className="brand-mark"><Leaf /></span><span>SMRITI</span></div>
        <p className="sidebar-caption">A care room for<br />the everyday moments.</p>
        <nav className="side-nav" aria-label="Caregiver navigation">
          <a className="active" href="#overview"><span>01</span> Overview</a>
          <a href="#patient"><span>02</span> Patient profile</a>
          <a href="#memory-library"><span>03</span> Memory library</a>
          <a href="#privacy"><span>04</span> Privacy & access</a>
        </nav>
        <div className="sidebar-footer"><div className="mini-avatar">{user?.name?.charAt(0) ?? "C"}</div><div><strong>{user?.name || "Caregiver"}</strong><small>{user?.email || "Signed in"}</small></div><button className="icon-button" aria-label="Sign out" onClick={logout}><LogOut size={16} /></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">Thursday · Caregiver room</p><h2 id="overview">Good morning, {user?.name?.split(" ")[0] || "there"}.</h2></div><div className="topbar-status"><span className="status-dot" /> Storage protected <span className="divider" /> <span>Last saved just now</span></div></header>

        <section className="hero-grid">
          <div className="hero-copy"><p className="eyebrow accent">The little things matter</p><h1>A small moment of memory, together.</h1><p>Set up a gentle, personal starting point for <strong>{preferredName || "your loved one"}</strong>. SMRITI uses these details to make future voice sessions feel familiar.</p><div className="hero-actions"><a className="text-link" href="#patient">Complete profile <span>→</span></a><span className="saved-chip"><CheckCircle2 size={16} /> {profileReady ? "Profile ready" : "A few details needed"}</span></div></div>
          <div className="hero-image"><img src="/manus-storage/smriti-care-hero_65097b78.jpg" alt="Care items on a sunlit table" /><div className="image-caption"><span>Today’s care note</span><strong>Familiar voices create comfort.</strong></div></div>
        </section>

        <section className="metric-row" aria-label="Care room summary"><div className="metric"><span className="metric-label">Patient</span><strong>{preferredName || "Not set"}</strong><small>{age ? `${age} years old` : "Age not set"}</small></div><div className="metric"><span className="metric-label">Session language</span><strong>{language}</strong><small>Voice prompts follow this choice</small></div><div className="metric"><span className="metric-label">Memory library</span><strong>{filesQuery.data?.length ?? 0} items</strong><small>Private to your care room</small></div><div className="metric metric-note"><Leaf size={24} /><div><strong>Go gently</strong><small>There is no need to hurry an answer.</small></div></div></section>

        <section id="patient" className="workspace-grid"><div className="section-card profile-card"><div className="section-heading"><div><p className="eyebrow">01 · Patient profile</p><h3>Help SMRITI know them.</h3></div><UserRound size={22} /></div><p className="section-intro">These notes stay with the caregiver account and shape personal introductions, family questions, and memory prompts.</p>{profileQuery.isError && <p className="inline-error">We could not load the saved profile. You can still edit locally, then try saving again.</p>}<div className="form-grid"><label>What should SMRITI call them?<Input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} placeholder="e.g. Ma, Dadu, Aita" /></label><label>Age<Input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} /></label><label>Conversation language<select value={language} onChange={(e) => setLanguage(e.target.value)}>{languages.map((item) => <option key={item}>{item}</option>)}</select></label><label>Family names<textarea value={childrenNames} onChange={(e) => setChildrenNames(e.target.value)} placeholder="Names they may enjoy hearing" /></label><label className="span-two">Background and familiar routines<Textarea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="A few gentle details about their life…" /></label><label className="span-two">Favourite foods, flowers, songs<Textarea value={favouriteThings} onChange={(e) => setFavouriteThings(e.target.value)} placeholder="Things that help the conversation feel personal" /></label></div><div className="form-footer"><span className="small-note"><ShieldCheck size={15} /> Stored privately with your profile</span><Button className="primary-button" disabled={!profileReady || saveProfile.isPending} onClick={() => saveProfile.mutate({ preferredName: preferredName.trim(), age: Number(age), language, background: background || null, childrenNames: childrenNames || null, favouriteThings: favouriteThings || null })}>{saveProfile.isPending ? "Saving…" : "Save patient details"}</Button></div></div><div className="section-card preview-card"><p className="eyebrow">A softer start</p><div className="preview-orb listening-orb"><Leaf /></div><h3>“Hello, {preferredName || "friend"}.”</h3><p>SMRITI will greet them in <strong>{language}</strong>, speak slowly, listen for their answer, and offer a text fallback if their device does not support voice recognition.</p><div className="preview-rule" /><span className="small-note">Female voice · Gentle pace · No rushed taps</span></div></section>

        <section id="memory-library" className="section-card library-card"><div className="section-heading"><div><p className="eyebrow">03 · Memory library</p><h3>Keep familiar things close.</h3></div><span className="secure-label"><ShieldCheck size={16} /> Private storage</span></div><div className="library-layout"><div className="upload-panel"><div className="dropzone" onClick={() => fileInputRef.current?.click()} onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()} role="button" tabIndex={0}><Upload size={24} /><strong>{selectedFile ? selectedFile.name : "Choose a memory file"}</strong><span>{selectedFile ? `${formatBytes(selectedFile.size)} · Ready to store` : "Photos, voice notes, or care documents · up to 8 MB"}</span><input ref={fileInputRef} type="file" accept="image/*,audio/*,.pdf,.txt" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} hidden /></div><div className="purpose-row" aria-label="File purpose">{purposes.map(({ value, label, icon: Icon }) => <button key={value} className={purpose === value ? "purpose active" : "purpose"} onClick={() => setPurpose(value)}><Icon size={16} /> {label}</button>)}</div><label className="consent-check"><input type="checkbox" checked={consentConfirmed} onChange={(e) => setConsentConfirmed(e.target.checked)} /><span>I have consent to keep this memory item in the care room.</span></label><input className="consent-note" value={consentNote} onChange={(e) => setConsentNote(e.target.value)} placeholder="Optional consent note or source" /><Button className="secondary-button upload-button" disabled={!selectedFile || uploadFile.isPending} onClick={handleUpload}>{uploadFile.isPending ? "Storing securely…" : "Store in memory library"}</Button><p className="small-note">Files are associated with {preferredName || "the patient profile"}; only metadata is kept in the database.</p></div><div className="file-list">{filesQuery.isLoading ? <p className="empty-state">Loading your library…</p> : filesQuery.isError ? <p className="empty-state"><strong>We could not load the memory library.</strong><span>Try refreshing the page or check your connection.</span></p> : filesQuery.data?.length ? filesQuery.data.slice(0, 4).map((file) => <div className="file-row" key={file.id}><a className="file-main" href={file.fileUrl} target="_blank" rel="noreferrer"><span className="file-icon"><FileHeart size={18} /></span><span><strong>{file.filename}</strong><small>{file.purpose.replace("-", " ")} · {formatBytes(file.sizeBytes)} · {file.consentStatus === "confirmed" ? "consent confirmed" : "consent pending"}</small></span><span className="file-arrow">↗</span></a><select className="file-association" aria-label={`Patient association for ${file.filename}`} value={file.patientProfileId ?? "none"} onChange={(e) => updateFile.mutate({ id: file.id, patientProfileId: e.target.value === "none" ? null : Number(e.target.value) })}><option value="none">Unassigned</option>{profileQuery.data && <option value={profileQuery.data.id}>{preferredName || "Patient"}</option>}</select><div className="file-actions"><button onClick={() => updateFile.mutate({ id: file.id, purpose: file.purpose === "memory-photo" ? "other" : "memory-photo" })} title="Reclassify file">↻</button><button onClick={() => removeFile.mutate({ id: file.id })} title="Remove file">×</button></div></div>) : <div className="empty-state"><Leaf size={24} /><strong>Your memory library is waiting.</strong><span>Start with one familiar photo, song, or note.</span></div>}</div></div></section>

        <section id="privacy" className="privacy-banner"><ShieldCheck size={26} /><div><strong>Built for trust.</strong><p>SMRITI keeps caregiver-owned metadata separate from stored file bytes. Add only what the family has consented to share, and avoid uploading sensitive medical documents until your production privacy policy is in place.</p></div><span className="privacy-pill">Caregiver owned</span></section>
        <footer className="app-footer">SMRITI · A gentle companion for everyday care <span>Full-stack storage is active</span></footer>
      </main>
    </div>
  );
}
