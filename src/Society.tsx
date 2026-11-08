import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Activity, AlertTriangle, ArrowUpRight, Ban, Check, Flag, KeyRound, Lock, LogOut, MessageCircle, Plus, Search, ShieldCheck, Users, X } from 'lucide-react'
import { supabase } from './lib/supabase'
import './sectorx83.css'

type Profile = { id: string; username: string; display_name: string; bio: string | null; created_at: string }
type Post = { id: string; author_id: string; title: string; body: string; category: string; is_announcement: boolean; created_at: string; author?: { username: string; display_name: string } | null }
type Comment = { id: string; body: string; created_at: string; author?: { username: string; display_name: string } | null }
type Report = { id: string; reason: string; status: string; created_at: string; reporter?: { username: string } | null; post?: { title: string } | null }
type Role = { id: string; email: string | null; role: string }
type CipherEntry = { id: string; label: string; ciphertext: string; iv: string; salt: string; created_at: string }
const dateLabel = (value: string) => new Date(value).toLocaleString()
const sections = ['ALL', 'GENERAL', 'DISCUSSION', 'DECLARATIONS', 'ANNOUNCEMENT']

function Crest({ large = false }: { large?: boolean }) {
  return <span className={large ? 'cc-crest cc-crest-large' : 'cc-crest'} aria-hidden="true"><svg viewBox="0 0 100 100" fill="none">
    <path className="cc-frame" d="M50 5 88 27v46L50 95 12 73V27L50 5Z"/>
    <path className="cc-inner" d="M50 15 78 31v38L50 85 22 69V31L50 15Z"/>
    <path className="cc-star" d="m50 20 4.4 9 9.9 1.4-7.2 7 1.7 9.8-8.8-4.7-8.8 4.7 1.7-9.8-7.2-7 9.9-1.4L50 20Z"/>
    <path className="cc-tools" d="M34 68 65 42M59 37l11 11M30 63l8 8M39 76c-8-8-8-20 0-28 7-7 18-9 27-4-11-1-19 4-21 12-2 7 1 13 7 18-4 5-8 7-13 8Z"/>
  </svg></span>
}

export default function Society() {
  const [session, setSession] = useState<any>(null)
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<'join' | 'signin'>('join')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [profileBio, setProfileBio] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [members, setMembers] = useState<Profile[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [banned, setBanned] = useState<string[]>([])
  const [tab, setTab] = useState('feed')
  const [category, setCategory] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [postSection, setPostSection] = useState('GENERAL')
  const [comment, setComment] = useState('')
  const [reportReason, setReportReason] = useState('')
  const [reporting, setReporting] = useState<Post | null>(null)
  const [showComposer, setShowComposer] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [cipherEntries, setCipherEntries] = useState<CipherEntry[]>([])
  const [cipherLabel, setCipherLabel] = useState('')
  const [cipherText, setCipherText] = useState('')
  const [cipherPassphrase, setCipherPassphrase] = useState('')
  const [decryptedEntry, setDecryptedEntry] = useState<{ id: string; text: string } | null>(null)

  const role = session?.user?.app_metadata?.role || 'member'
  const admin = role === 'admin'
  const moderator = admin || role === 'moderator'
  const suspended = !!session && banned.includes(session.user.id)
  const nav = [{ id: 'feed', label: 'The Dispatches', icon: Activity }, { id: 'members', label: 'The Register', icon: Users }, { id: 'cipher', label: 'Cipher Vault', icon: Lock }, { id: 'profile', label: 'Identity Record', icon: ShieldCheck }, { id: 'admin', label: 'Command Desk', icon: Flag }]

  useEffect(() => {
    if (!supabase) { setReady(true); return }
    let active = true
    supabase.auth.getSession()
      .then(({ data }) => { if (active) { setSession(data.session); setReady(true) } })
      .catch((e: any) => { if (active) { setError(e?.message || 'Unable to restore your session.'); setReady(true) } })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => { if (active) { setSession(next); setError(''); setNotice('') } })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setProfile(null); setPosts([]); setMembers([]); setBanned([]); setCipherEntries([]); setDecryptedEntry(null); return }
    let active = true
    async function load() {
      const [p, f, m, b, v] = await Promise.all([
        supabase!.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase!.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100),
        supabase!.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
        supabase!.from('banned_members').select('user_id'),
        supabase!.from('cipher_vault').select('id,label,ciphertext,iv,salt,created_at').eq('owner_id', session.user.id).order('created_at', { ascending: false }),
      ])
      if (!active) return
      const loadError = [p.error, f.error, m.error, b.error, v.error].find(Boolean)
      if (loadError) throw new Error(loadError.message)
      if (!p.data) throw new Error('Your member profile is missing. Confirm your account and verify that the Sectorx83 database migrations have been applied.')
      setProfile(p.data as Profile); setDisplayName(p.data.display_name || ''); setProfileBio(p.data.bio || '')
      if (f.data) setPosts(f.data as unknown as Post[])
      if (m.data) setMembers(m.data as Profile[])
      if (b.data) setBanned(b.data.map((x: any) => x.user_id))
      if (v.data) setCipherEntries(v.data as CipherEntry[]);

      if (moderator) {
        const { data: reportData, error: reportError } = await supabase!.from('reports').select('id,reason,status,created_at,reporter:profiles!reports_reporter_id_fkey(username),post:posts!reports_post_id_fkey(title)').order('created_at', { ascending: false })
        if (!active) return
        if (reportError) throw reportError
        if (reportData) setReports(reportData as unknown as Report[])
        if (admin) {
          const { data: roleData, error: roleError } = await supabase!.functions.invoke('manage-member-role', { body: { action: 'list' } })
          if (!active) return
          if (roleError || roleData?.error) throw new Error(roleError?.message || roleData.error)
          if (roleData?.users) setRoles(roleData.users as Role[])
        }
      }
    }
    load().catch(e => { if (active) setError(e.message || 'Unable to load community data.') })
    return () => { active = false }
  }, [session?.user?.id, role])

  useEffect(() => {
    if (!supabase || !session || !selected) { setComments([]); return }
    let active = true
    supabase.from('comments').select('id,body,created_at,author:profiles!comments_author_id_fkey(username,display_name)').eq('post_id', selected.id).order('created_at')
      .then(({ data }) => { if (active) setComments((data || []) as unknown as Comment[]) })
    return () => { active = false }
  }, [session?.user?.id, selected?.id])

  const filtered = useMemo(() => posts.filter(p => (category === 'ALL' || (category === 'ANNOUNCEMENT' ? p.is_announcement : p.category === category)) && (p.title + p.body + (p.author?.username || '')).toLowerCase().includes(search.toLowerCase())), [posts, category, search])

  async function auth(e: FormEvent) {
    e.preventDefault(); if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    try {
      if (mode === 'join') {
        const { data, error: e1 } = await supabase.auth.signUp({ email, password, options: { data: { username: username.trim().toLowerCase(), display_name: displayName.trim() } } })
        if (e1) throw e1
        if (!data.session) setNotice('Registration received. Confirm your email, then sign in.')
        else setNotice('Your Sectorx83 membership is ready.')
      } else {
        const { error: e1 } = await supabase.auth.signInWithPassword({ email, password })
        if (e1) throw e1
      }
    } catch (e: any) { setError(e.message || 'Authentication failed.') }
    finally { setBusy(false) }
  }

  async function refreshPosts() {
    if (!supabase) return
    const { data, error: refreshError } = await supabase.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100)
    if (refreshError) { setError(refreshError.message); return }
    if (data) setPosts(data as unknown as Post[])
  }

  async function publish(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session || suspended) return
    setBusy(true)
    const announcement = postSection === 'ANNOUNCEMENT'
    const { error: e1 } = await supabase.from('posts').insert({ author_id: session.user.id, title: title.trim(), body: body.trim(), category: announcement ? 'GENERAL' : postSection, is_announcement: announcement })
    if (e1) setError(e1.message)
    else { setTitle(''); setBody(''); setPostSection('GENERAL'); setShowComposer(false); await refreshPosts() }
    setBusy(false)
  }

  async function addComment(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session || !selected || suspended) return
    const { error: e1 } = await supabase.from('comments').insert({ post_id: selected.id, author_id: session.user.id, body: comment.trim() })
    if (e1) setError(e1.message)
    else { setComment(''); const { data } = await supabase.from('comments').select('id,body,created_at,author:profiles!comments_author_id_fkey(username,display_name)').eq('post_id', selected.id).order('created_at'); setComments((data || []) as unknown as Comment[]) }
  }

  async function removePost(post: Post) {
    if (!supabase || !confirm('Delete this community post?')) return
    const { error: e1 } = await supabase.from('posts').delete().eq('id', post.id)
    if (e1) setError(e1.message); else { setSelected(null); await refreshPosts() }
  }

  async function submitReport() {
    if (!supabase || !session || !reporting || reportReason.trim().length < 5) return
    const { error: e1 } = await supabase.from('reports').insert({ reporter_id: session.user.id, post_id: reporting.id, reason: reportReason.trim() })
    if (e1) setError(e1.message); else { setReporting(null); setReportReason(''); setNotice('Report sent to the moderation team.') }
  }

  async function banMember(id: string, ban: boolean) {
    if (!supabase || !session || !admin || id === session.user.id) return
    const result = ban ? await supabase.from('banned_members').insert({ user_id: id, banned_by: session.user.id, reason: 'Community rules violation' }) : await supabase.from('banned_members').delete().eq('user_id', id)
    if (result.error) setError(result.error.message); else setBanned(old => ban ? [...old, id] : old.filter(x => x !== id))
  }

  async function changeRole(id: string, next: string) {
    if (!supabase || !admin || id === session.user.id) return
    const { data, error: e1 } = await supabase.functions.invoke('manage-member-role', { body: { user_id: id, role: next } })
    if (e1 || data?.error) setError(e1?.message || data.error)
    else setRoles(old => old.map(x => x.id === id ? { ...x, role: next } : x))
  }

  async function reviewReport(id: string, status: string) {
    if (!supabase || !moderator) return
    const { error: e1 } = await supabase.from('reports').update({ status, reviewed_by: session.user.id, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (e1) setError(e1.message); else setReports(old => old.map(x => x.id === id ? { ...x, status } : x))
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session) return
    const { error: e1 } = await supabase.from('profiles').update({ display_name: displayName.trim(), bio: profileBio.trim().slice(0,240) }).eq('id', session.user.id)
    if (e1) setError(e1.message); else { setNotice('Profile updated.'); setProfile(old => old ? { ...old, display_name: displayName.trim(), bio: profileBio.trim().slice(0,240) } : old) }
  }

  const toBase64 = (bytes: Uint8Array) => btoa(Array.from(bytes, value => String.fromCharCode(value)).join(''))
  const fromBase64 = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0))
  const asArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
    const copy = new Uint8Array(bytes.byteLength)
    copy.set(bytes)
    return copy.buffer
  }
  async function deriveVaultKey(passphrase: string, salt: Uint8Array) {
    const material = await crypto.subtle.importKey('raw', asArrayBuffer(new TextEncoder().encode(passphrase)), 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: asArrayBuffer(salt), iterations: 310000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  }
  async function sealCipherEntry(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !cipherText.trim() || cipherPassphrase.length < 12) { setError('Use a passphrase with at least 12 characters.'); return }
    setBusy(true); setError('')
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveVaultKey(cipherPassphrase, salt)
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: asArrayBuffer(iv) }, key, asArrayBuffer(new TextEncoder().encode(cipherText.trim())))
      const { data, error: e1 } = await supabase.from('cipher_vault').insert({
        owner_id: session.user.id, label: cipherLabel.trim().slice(0,60) || 'Sealed note',
        ciphertext: toBase64(new Uint8Array(encrypted)), iv: toBase64(iv), salt: toBase64(salt),
      }).select('id,label,ciphertext,iv,salt,created_at').single()
      if (e1) throw e1
      setCipherEntries(old => [data as CipherEntry, ...old]); setCipherLabel(''); setCipherText(''); setCipherPassphrase(''); setNotice('Encrypted entry sealed. Your passphrase was not saved.')
    } catch (e: any) { setError(e.message || 'Unable to encrypt this entry.') }
    finally { setBusy(false) }
  }
  async function openCipherEntry(entry: CipherEntry) {
    if (cipherPassphrase.length < 12) { setError('Enter the passphrase used when this entry was sealed.'); return }
    setError('')
    try {
      const key = await deriveVaultKey(cipherPassphrase, fromBase64(entry.salt))
      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: asArrayBuffer(fromBase64(entry.iv)) }, key, asArrayBuffer(fromBase64(entry.ciphertext)))
      setDecryptedEntry({ id: entry.id, text: new TextDecoder().decode(plaintext) })
      setCipherPassphrase('')
    } catch { setError('That passphrase did not unlock this entry. Nothing was changed.') }
  }
  async function deleteCipherEntry(id: string) {
    if (!supabase || !confirm('Permanently delete this encrypted entry?')) return
    const { error: e1 } = await supabase.from('cipher_vault').delete().eq('id', id)
    if (e1) setError(e1.message)
    else { setCipherEntries(old => old.filter(entry => entry.id !== id)); if (decryptedEntry?.id === id) setDecryptedEntry(null) }
  }

  if (!ready) return <main className="cc-shell cc-loading"><Crest large/><span>ESTABLISHING SECURE CHANNEL</span><i/></main>
  if (!supabase) return <main className="cc-shell cc-entry"><header className="cc-header"><a className="cc-brand" href="/"><Crest/>SECTORX83</a><a href="/">SECTORX83 ↗</a></header><section className="cc-entry-hero"><Crest large/><p className="cc-kicker">NETWORK CONFIGURATION REQUIRED</p><h1>The network<br/><em>is not connected.</em></h1><p>Add the Sectorx83 Supabase URL and publishable key to Vercel. Setup instructions are included in the repository.</p><a href="https://github.com/sectorx83/Sectorx83/blob/main/SECTORX83_SETUP.md">OPEN SECTORX83 SETUP GUIDE ↗</a></section></main>

  if (!session) return <main className="cc-shell cc-entry">
    <div className="cc-grid-bg"/>
    <header className="cc-header"><a className="cc-brand" href="/"><Crest/><span>SECTORX83<small>PRIVATE MEMBER NETWORK</small></span></a><a className="cc-back" href="/">RETURN TO SECTORX83 ↗</a></header>
    <section className="cc-entry-layout"><div className="cc-manifesto"><p className="cc-kicker">SECTORX83 / THE DIRECTIVE</p><h1>No spectators.<br/>No empty words.<br/><em>Only the work.</em></h1><p>A private network for minds that question, builders who execute, and members who stand behind what they say. Access is earned. Trust is maintained. Every idea must withstand scrutiny.</p><div className="cc-manifesto-foot">IDENTITY <i/> AUTHORITY <i/> ACCOUNTABILITY</div><div className="cc-emblem"><Crest large/><span>QUESTION · PROVE · BUILD</span></div></div>
      <section className="cc-auth-panel"><p className="cc-kicker">ACCESS CONTROL / 00</p><h2>{mode === 'join' ? 'Establish your record.' : 'Your presence is expected.'}</h2><p className="cc-subtitle">{mode === 'join' ? 'Register your identity. Your account remains subject to the rules of the network.' : 'Verify your identity. Proceed only with authorised credentials.'}</p><div className="cc-mode"><button className={mode === 'join' ? 'active' : ''} onClick={() => { setMode('join'); setError(''); setNotice('') }}>CREATE ACCOUNT</button><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setEmail('9562230818@gmail.com'); setError(''); setNotice('') }}>SIGN IN</button></div>
      <form onSubmit={auth} className="cc-form">{mode === 'join' && <><label>DISPLAY NAME<input required maxLength={48} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Name displayed on the record"/></label><label>USERNAME<input required minLength={3} maxLength={24} value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} placeholder="Choose your public identifier"/></label></>}
      <label>EMAIL ADDRESS<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Registered email address"/></label><label>PASSWORD<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your account password"/></label>
      {error && <p className="cc-error"><AlertTriangle size={14}/>{error}</p>}{notice && <p className="cc-notice"><Check size={14}/>{notice}</p>}
      <button className="cc-primary" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'join' ? 'CREATE MEMBER RECORD' : 'VERIFY & ENTER'} <ArrowUpRight size={16}/></button></form><small className="cc-auth-note">QUESTION EVERYTHING · PROVE SOMETHING · BUILD WHAT LASTS</small></section>
    </section><footer className="cc-footer"><span>SECTORX83</span><span>ACCESS / VERIFIED IDENTITIES ONLY</span><span>SECTORX83 © {new Date().getFullYear()}</span></footer>
  </main>

  return <main className="cc-shell cc-community">
    <header className="cc-header cc-header-inside"><a className="cc-brand" href="/sectorx83"><Crest/><span>SECTORX83<small>PRIVATE MEMBER NETWORK</small></span></a><div className="cc-user"><span>{profile?.display_name || session.user.email}<small>@{profile?.username || 'member'} · {role.toUpperCase()}</small></span><button onClick={() => { if (supabase) void supabase.auth.signOut() }} aria-label="Sign out"><LogOut size={16}/></button></div></header>
    <div className="cc-layout"><aside className="cc-sidebar"><small>SECTORX83 / NAVIGATION</small>{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setSelected(null); setError(''); setNotice('') }}><Icon size={16}/>{item.label}</button> })}<div className="cc-principle"><Crest/><small>COMMUNITY PRINCIPLE</small><strong>Question every claim. Respect every person.</strong><p>Authority is accountable. Evidence outranks status. Disagreement is not disloyalty.</p></div><div className="cc-side-meta">ACCESS / {role.toUpperCase()}<br/>NETWORK / MEMBERS</div></aside>
    <section className="cc-main"><div className="cc-crumb">SECTORX83 <b>/</b> {nav.find(x => x.id === tab)?.label.toUpperCase()}</div>
      {(error || notice) && <div className={error ? 'cc-alert is-error' : 'cc-alert'}>{error || notice}<button onClick={() => { setError(''); setNotice('') }}><X size={14}/></button></div>}
      {suspended && <div className="cc-alert is-error">Your account is suspended from posting and commenting. Contact an administrator if this is a mistake.</div>}
      {tab === 'feed' && <><div className="cc-heading"><div><p className="cc-kicker">THE DISPATCH / 01</p><h1>Words carry <em>weight.</em></h1><p>No noise. No spectacle. Ideas recorded, challenged and put to work.</p></div><Crest large/></div>
        <div className="cc-toolbar"><div className="cc-categories">{sections.map(s => <button key={s} className={category === s ? 'active' : ''} onClick={() => setCategory(s)}>{s}</button>)}</div><label className="cc-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the record"/></label></div>
        {!suspended && <div className="cc-compose-toggle"><span>Something worth putting on record?</span><button onClick={() => setShowComposer(!showComposer)}><Plus size={15}/> NEW DISPATCH</button></div>}
        {showComposer && <form className="cc-composer" onSubmit={publish}><label>SUBJECT<input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required/></label><label>CLASSIFICATION<select value={postSection} onChange={e => setPostSection(e.target.value)}>{(moderator ? sections.slice(1) : sections.slice(1,4)).map(s => <option key={s}>{s}</option>)}</select></label><label>YOUR CONTRIBUTION<textarea value={body} onChange={e => setBody(e.target.value)} rows={5} maxLength={10000} required/></label><button className="cc-primary" disabled={busy}>SEAL DISPATCH <ArrowUpRight size={15}/></button></form>}
        <div className="cc-posts">{filtered.map(post => <article className={post.is_announcement ? 'cc-post announcement' : 'cc-post'} key={post.id}><div className="cc-post-meta"><span>{post.is_announcement ? 'OFFICIAL DIRECTIVE' : post.category}</span><time>{dateLabel(post.created_at)}</time></div><h2>{post.title}</h2><p>{post.body}</p><div className="cc-post-bottom"><span>{post.author?.display_name || 'Network member'} <small>@{post.author?.username || 'member'}</small></span><div><button onClick={() => setSelected(post)}><MessageCircle size={14}/> DISCUSS</button>{!post.is_announcement && <button onClick={() => setReporting(post)}><Flag size={13}/> REPORT</button>}{(moderator || post.author_id === session.user.id) && <button onClick={() => removePost(post)}><X size={14}/></button>}</div></div></article>)}{!filtered.length && <div className="cc-empty">The record is empty. Make the first statement.</div>}</div>
      </>}
      {tab === 'members' && <><div className="cc-heading"><div><p className="cc-kicker">THE REGISTER / 02</p><h1>The <em>register.</em></h1><p>Every identity is recorded. Every member is accountable for their conduct.</p></div><strong className="cc-count">{members.length.toString().padStart(2,'0')}<small>MEMBERS</small></strong></div><label className="cc-search cc-member-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the register"/></label><div className="cc-members">{members.filter(m => (m.display_name + m.username).toLowerCase().includes(search.toLowerCase())).map(m => <article key={m.id}><i>{m.display_name.slice(0,1).toUpperCase()}</i><div><strong>{m.display_name}</strong><span>@{m.username}</span><small>MEMBER · JOINED {new Date(m.created_at).toLocaleDateString()}</small>{m.bio && <p>{m.bio}</p>}</div></article>)}</div></>}
      {tab === 'profile' && <><div className="cc-heading"><div><p className="cc-kicker">IDENTITY RECORD / 03</p><h1>Your <em>record.</em></h1><p>Keep your public identity accurate. Your actions remain your responsibility.</p></div></div><form className="cc-composer cc-profile" onSubmit={saveProfile}><label>DISPLAY NAME<input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={48} required/></label><label>ABOUT YOU<textarea rows={4} maxLength={240} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="A short introduction (optional)"/></label><button className="cc-primary">SAVE PROFILE <Check size={15}/></button></form></>}
      {tab === 'admin' && !moderator && <div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>Command <em>desk.</em></h1><p>Restricted authority. Your verified role does not grant permission to enter this command level.</p></div><Lock size={34}/></div>}
      {tab === 'admin' && moderator && <><div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>The <em>council.</em></h1><p>Review violations. Govern access. Preserve the integrity of the network. Every exercise of authority must be justified.</p></div><ShieldCheck size={34}/></div><div className="cc-admin-stats"><div><strong>{members.length}</strong><small>MEMBERS</small></div><div><strong>{posts.length}</strong><small>POSTS</small></div><div><strong>{reports.filter(r => r.status === 'open').length}</strong><small>OPEN REPORTS</small></div><div><strong>{banned.length}</strong><small>SUSPENDED</small></div></div>
        <section className="cc-admin-section"><h2>Cases awaiting judgment</h2>{reports.length ? reports.map(r => <article key={r.id}><div><small>{r.status.toUpperCase()} · @{r.reporter?.username || 'member'}</small><strong>{r.post?.title || 'Reported comment'}</strong><p>{r.reason}</p></div><div><button onClick={() => reviewReport(r.id,'reviewed')}>REVIEWED</button><button onClick={() => reviewReport(r.id,'resolved')}>RESOLVE</button></div></article>) : <p className="cc-muted">No reports are waiting for review.</p>}</section>
        <section className="cc-admin-section"><h2>Access and rank</h2>{members.map(m => { const r = roles.find(x => x.id === m.id)?.role || 'member'; return <article key={m.id}><div><strong>{m.display_name}</strong><small>@{m.username} · {banned.includes(m.id) ? 'SUSPENDED' : 'ACTIVE'}</small></div><div className="cc-admin-controls"><select value={r} disabled={!admin || m.id === session.user.id} onChange={e => changeRole(m.id,e.target.value)}><option value="member">MEMBER</option><option value="moderator">MODERATOR</option><option value="admin">ADMIN</option></select>{banned.includes(m.id) ? <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,false)}>UNBAN</button> : <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,true)}><Ban size={13}/> BAN</button>}</div></article>})}</section>
        <section className="cc-admin-section"><h2>Security status</h2><div className="cc-security-grid"><article><Lock size={18}/><strong>TLS in transit</strong><small>Connections are protected in transit.</small></article><article><ShieldCheck size={18}/><strong>Encrypted database</strong><small>Managed storage encryption at rest.</small></article><article><KeyRound size={18}/><strong>AES-256-GCM vault</strong><small>Private entries are encrypted in the browser before upload.</small></article></div><p className="cc-muted">The vault is client-side encrypted. Feed posts and comments are not end-to-end encrypted.</p></section>
      </>}
      {tab === 'cipher' && <><div className="cc-heading"><div><p className="cc-kicker">CIPHER ARCHIVE / 04</p><h1>The <em>cipher archive.</em></h1><p>Private records are sealed in your browser before transmission. The key remains yours.</p></div><Lock size={34}/></div><div className="cc-cipher-explainer"><Lock size={18}/><div><strong>AES-256-GCM · PBKDF2-SHA-256</strong><p>Each entry gets a fresh random salt and IV. Your passphrase is never stored. Losing it means the entry cannot be recovered. These entries are private to your account; this is not group end-to-end encryption.</p></div></div><form className="cc-composer cc-cipher-form" onSubmit={sealCipherEntry}><label>ENTRY LABEL<input value={cipherLabel} onChange={e => setCipherLabel(e.target.value)} maxLength={60} placeholder="A short label"/></label><label>PRIVATE CONTENT<textarea value={cipherText} onChange={e => setCipherText(e.target.value)} rows={5} maxLength={12000} required placeholder="Write a private note. It is encrypted before upload."/></label><label>VAULT PASSPHRASE<input type="password" minLength={12} value={cipherPassphrase} onChange={e => setCipherPassphrase(e.target.value)} required placeholder="At least 12 characters"/></label><button className="cc-primary" disabled={busy}>{busy ? 'SEALING…' : 'ENCRYPT & SEAL'} <Lock size={15}/></button></form><div className="cc-admin-section"><h2>Sealed entries</h2>{cipherEntries.length ? cipherEntries.map(entry => <article key={entry.id}><div><strong>{entry.label}</strong><small>SEALED · {dateLabel(entry.created_at)}</small></div><div><button onClick={() => openCipherEntry(entry)}><KeyRound size={13}/> UNSEAL</button><button onClick={() => deleteCipherEntry(entry.id)}><X size={13}/> DELETE</button></div></article>) : <p className="cc-muted">No encrypted entries yet.</p>}{decryptedEntry && <div className="cc-decrypted"><div><strong>UNSEALED CONTENT</strong><button onClick={() => setDecryptedEntry(null)}><X size={14}/></button></div><p>{decryptedEntry.text}</p></div>}</div></>}
      <footer className="cc-main-footer">SECTORX83 / VERIFIED NETWORK <span>QUESTION · PROVE · BUILD</span></footer>
    </section></div>
    {selected && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}><section className="cc-thread"><header>DISPATCH RECORD <button onClick={() => setSelected(null)}><X size={17}/></button></header><h2>{selected.title}</h2><p>{selected.body}</p><h3>{comments.length} RESPONSES</h3>{comments.map(c => <article key={c.id}><strong>{c.author?.display_name || 'Member'} <small>@{c.author?.username}</small></strong><p>{c.body}</p><time>{dateLabel(c.created_at)}</time></article>)}{!suspended && <form onSubmit={addComment}><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add evidence. Challenge the argument. Keep it precise." rows={3} required/><button className="cc-primary">POST RESPONSE <MessageCircle size={14}/></button></form>}</section></div>}
    {reporting && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setReporting(null) }}><section className="cc-thread"><header>NETWORK INTEGRITY / REPORT <button onClick={() => setReporting(null)}><X size={17}/></button></header><h2>Report discussion</h2><p>{reporting.title}</p><textarea rows={4} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Explain what needs moderator attention."/><button className="cc-primary" onClick={submitReport}>SUBMIT REPORT <Flag size={14}/></button></section></div>}
  </main>
}
