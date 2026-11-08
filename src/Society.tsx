import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Activity, AlertTriangle, ArrowUpRight, Ban, Check, ChevronLeft, ChevronRight, Flag, Lock, LogOut, MessageCircle, Plus, Search, Send, ShieldCheck, Users, X } from 'lucide-react'
import { supabase } from './lib/supabase'
import './sectorx83.css'

type Profile = { id: string; username: string; display_name: string; bio: string | null; created_at: string }
type Post = { id: string; author_id: string; title: string; body: string; category: string; is_announcement: boolean; created_at: string; author?: { username: string; display_name: string } | null }
type Comment = { id: string; body: string; created_at: string; author?: { username: string; display_name: string } | null }
type ChatMessage = { id: string; author_id: string; body: string; created_at: string; author?: { username: string; display_name: string } | null }
type DirectMessage = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string }
type Report = { id: string; reason: string; status: string; created_at: string; reporter?: { username: string } | null; post?: { title: string } | null }
type Role = { id: string; email: string | null; role: string }
const dateLabel = (value: string) => new Date(value).toLocaleString()
const sections = ['ALL', 'GENERAL', 'DISCUSSION', 'DECLARATIONS', 'ANNOUNCEMENT']

function Crest({ large = false }: { large?: boolean }) {
  return <span className={large ? 'cc-crest cc-crest-large' : 'cc-crest'} aria-hidden="true">
    <svg viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="55" className="cc-frame"/>
      <circle cx="60" cy="60" r="48" className="cc-inner"/>
      <path className="cc-wreath" d="M31 92C13 74 14 43 31 25M89 92c18-18 17-49 0-67"/>
      <path className="cc-wreath-detail" d="M27 82l-9-1 5-8m7 1-10-4 7-7m5-1-9-7 9-4m-1-6-7-9 10-1m-3-7-3-10 10 3M93 82l9-1-5-8m-7 1 10-4-7-7m-5-1 9-7-9-4m1-6 7-9-10-1m3-7 3-10-10 3"/>
      <path className="cc-star" d="m60 13 5.2 10.7 11.8 1.7-8.5 8.3 2 11.7L60 39.9l-10.5 5.5 2-11.7-8.5-8.3 11.8-1.7L60 13Z"/>
      <path className="cc-tools" d="M42 72 76 43M69 38l12 12M37 67l10 10"/>
      <path className="cc-sickle" d="M72 57c9 8 11 20 4 28-7 8-19 8-27 1 10 3 19-1 21-9 2-6 0-12-5-16"/>
      <path className="cc-ribbon" d="M35 91q25 10 50 0l-4 13-21-5-21 5-4-13Z"/>
      <text className="cc-ribbon-type" x="60" y="99" textAnchor="middle">SX83</text>
    </svg>
  </span>
}

function Themis({ large = false }: { large?: boolean }) {
  return <span className={large ? 'cc-themis cc-themis-large' : 'cc-themis'} role="img" aria-label="Themis, Lady Justice, with balanced scales and a sword">
    <svg viewBox="0 0 260 300" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="themis-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8c985"/><stop offset=".52" stopColor="#a97937"/><stop offset="1" stopColor="#65451f"/>
        </linearGradient>
        <linearGradient id="themis-ivory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eee3c9"/><stop offset="1" stopColor="#9f9076"/>
        </linearGradient>
      </defs>
      <circle className="themis-halo" cx="130" cy="143" r="119"/>
      <path className="themis-ornament" d="M27 270V33h206v237M38 259V44h184v215M27 54h14M219 54h14M27 248h14M219 248h14"/>
      <path className="themis-ornament" d="m130 10 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10Z"/>
      <path className="themis-hair" d="M105 73c-6-24 7-43 25-43 22 0 34 18 27 45l-7 28h-38l-7-30Z"/>
      <path className="themis-skin" d="M110 61c0-17 8-26 20-26s20 9 20 26v21c0 17-9 28-20 28s-20-11-20-28V61Z"/>
      <path className="themis-blindfold" d="M107 63c13 5 29 5 46 0l-2 10c-14 6-29 6-42 0l-2-10Z"/>
      <path className="themis-hair" d="M111 49c-12 15-12 35-8 54l-12-12c-4-27 1-49 18-62M150 46c13 14 15 36 9 57l12-12c5-27-2-49-17-62"/>
      <path className="themis-skin" d="M120 108h20v22h-20z"/>
      <path className="themis-robe" d="m113 124 17 11 17-11 22 18 19 111-58 24-58-24 19-111 22-18Z"/>
      <path className="themis-robe-fold" d="m113 129-17 43 22 25-22 67M147 129l17 43-22 25 22 67M130 136v137M75 153l55 34 55-34"/>
      <path className="themis-arm" d="m111 133-42-23-12 7 8 12 47 24M149 133l42-23 12 7-8 12-47 24"/>
      <path className="themis-gold-stroke" d="M130 105v28M51 112h158"/>
      <g className="themis-scale-beam">
        <path d="M51 108h158M130 92l-10 16h20l-10-16Z"/>
        <circle cx="130" cy="108" r="4"/>
      </g>
      <g className="themis-scale-left">
        <path d="m68 111-12 43m12-43 13 43M55 154h27"/>
        <path d="M45 155q23 28 46 0M46 155h44"/>
      </g>
      <g className="themis-scale-right">
        <path d="m192 111-12 43m12-43 13 43m-25 0h27"/>
        <path d="M169 155q23 28 46 0M170 155h44"/>
      </g>
      <path className="themis-sword" d="m202 148 9 9-38 102-10 10 2-15 37-106Z"/>
      <path className="themis-sword-hilt" d="m194 144 17 17m-24-11 17 17"/>
      <path className="themis-base" d="M75 280h110M92 287h76M111 294h38"/>
      <path className="themis-gold-stroke themis-highlight" d="M42 76h9M209 76h9M42 226h9M209 226h9"/>
    </svg>
  </span>
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatDraft, setChatDraft] = useState('')
  const [dmInbox, setDmInbox] = useState<DirectMessage[]>([])
  const [dmThread, setDmThread] = useState<DirectMessage[]>([])
  const [dmDraft, setDmDraft] = useState('')
  const [activeDm, setActiveDm] = useState<Profile | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [adminRefreshing, setAdminRefreshing] = useState(false)
  const [roleLoadError, setRoleLoadError] = useState('')
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

  const role = session?.user?.app_metadata?.role || 'member'
  const admin = role === 'admin'
  const moderator = admin || role === 'moderator'
  const suspended = !!session && banned.includes(session.user.id)
  const nav = [{ id: 'feed', label: 'Dispatches', icon: Activity }, { id: 'chat', label: 'Community Chat', icon: MessageCircle }, { id: 'messages', label: 'Messages', icon: Send }, { id: 'members', label: 'Members', icon: Users }, { id: 'profile', label: 'My Profile', icon: ShieldCheck }, ...(moderator ? [{ id: 'admin', label: 'Command Desk', icon: Flag }] : [])]

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
    if (!supabase || !session) { setProfile(null); setPosts([]); setMembers([]); setBanned([]); return }
    let active = true
    async function load() {
      const [p, f, m, b] = await Promise.all([
        supabase!.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase!.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100),
        supabase!.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
        supabase!.from('banned_members').select('user_id'),
      ])
      if (!active) return
      const loadError = [p.error, f.error, m.error, b.error].find(Boolean)
      if (loadError) throw new Error(loadError.message)
      if (!p.data) throw new Error('Your member profile is missing. Confirm your account and verify that the Sectorx83 database migrations have been applied.')
      setProfile(p.data as Profile); setDisplayName(p.data.display_name || ''); setProfileBio(p.data.bio || '')
      if (f.data) setPosts(f.data as unknown as Post[])
      if (m.data) setMembers(m.data as Profile[])
      if (b.data) setBanned(b.data.map((x: any) => x.user_id))

      if (moderator) {
        const { data: reportData, error: reportError } = await supabase!.from('reports').select('id,reason,status,created_at,reporter:profiles!reports_reporter_id_fkey(username),post:posts!reports_post_id_fkey(title)').order('created_at', { ascending: false })
        if (!active) return
        if (reportError) throw reportError
        if (reportData) setReports(reportData as unknown as Report[])
        if (admin) {
          setRolesLoading(true)
          const { data: roleData, error: roleError } = await supabase!.functions.invoke('manage-member-role', { body: { action: 'list' } })
          if (!active) return
          if (roleError || roleData?.error) {
            setRoleLoadError(roleError?.message || roleData.error)
          } else {
            const normalizedRoles = (roleData?.users || []).map((user: any) => ({
              id: user.id || user.user_id,
              email: user.email ?? null,
              role: user.role || user.app_metadata?.role || 'member',
            })).filter((user: Role) => !!user.id)
            setRoles(normalizedRoles)
            setRoleLoadError('')
          }
          setRolesLoading(false)
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

  useEffect(() => {
    if (!supabase || !session || tab !== 'chat') return
    let active = true
    const loadMessages = async () => {
      const { data, error: chatError } = await supabase!
        .from('community_messages')
        .select('id,author_id,body,created_at,author:profiles!community_messages_author_id_fkey(username,display_name)')
        .order('created_at', { ascending: false })
        .limit(150)
      if (!active) return
      if (chatError) { setError(chatError.message); return }
      setChatMessages(((data || []) as unknown as ChatMessage[]).reverse())
    }
    void loadMessages()
    const channel = supabase.channel('sectorx83-community-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, payload => {
        if (!active) return
        const row = payload.new as ChatMessage
        const knownMember = members.find(member => member.id === row.author_id)
        const author = knownMember
          ? { username: knownMember.username, display_name: knownMember.display_name }
          : row.author_id === session.user.id && profile
            ? { username: profile.username, display_name: profile.display_name }
            : null
        setChatMessages(current => current.some(message => message.id === row.id)
          ? current
          : [...current, { ...row, author }].slice(-150))
      })
      .subscribe()
    return () => { active = false; void supabase!.removeChannel(channel) }
  }, [session?.user?.id, tab, members, profile?.id])

  useEffect(() => {
    if (!supabase || !session || tab !== 'messages') return
    let active = true
    const loadInbox = async () => {
      const { data, error: inboxError } = await supabase!
        .from('direct_messages')
        .select('id,sender_id,recipient_id,body,created_at')
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(300)
      if (!active) return
      if (inboxError) { setError(inboxError.message); return }
      setDmInbox((data || []) as DirectMessage[])
    }
    void loadInbox()
    const channel = supabase.channel(`sectorx83-dm-${session.user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, payload => {
        if (!active) return
        const row = payload.new as DirectMessage
        setDmInbox(current => current.some(message => message.id === row.id)
          ? current
          : [row, ...current].slice(0, 300))
        setDmThread(current => {
          const belongsToOpenThread = activeDm && (
            (row.sender_id === session.user.id && row.recipient_id === activeDm.id) ||
            (row.sender_id === activeDm.id && row.recipient_id === session.user.id)
          )
          return belongsToOpenThread && !current.some(message => message.id === row.id)
            ? [...current, row].sort((a, b) => a.created_at.localeCompare(b.created_at))
            : current
        })
      })
      .subscribe()
    return () => { active = false; void supabase!.removeChannel(channel) }
  }, [session?.user?.id, tab, activeDm?.id])

  const dmConversations = useMemo(() => {
    if (!session) return []
    const seen = new Set<string>()
    return dmInbox.flatMap(message => {
      const peerId = message.sender_id === session.user.id ? message.recipient_id : message.sender_id
      if (seen.has(peerId)) return []
      seen.add(peerId)
      const peer = members.find(member => member.id === peerId)
      return peer ? [{ peer, message }] : []
    })
  }, [dmInbox, members, session?.user?.id])

  useEffect(() => {
    if (!supabase || !session || !activeDm) { setDmThread([]); return }
    let active = true
    const loadThread = async () => {
      const { data, error: threadError } = await supabase!
        .from('direct_messages')
        .select('id,sender_id,recipient_id,body,created_at')
        .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${activeDm.id}),and(sender_id.eq.${activeDm.id},recipient_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true })
        .limit(500)
      if (!active) return
      if (threadError) { setError(threadError.message); return }
      setDmThread((data || []) as DirectMessage[])
    }
    void loadThread()
    return () => { active = false }
  }, [session?.user?.id, activeDm?.id])

  const activeDmMessages = dmThread

  useEffect(() => {
    if (!profile) return
    const tourKey = `sectorx83-tour-v2:${profile.id}`
    if (localStorage.getItem(tourKey)) return
    // Preserve completion from the previous browser-wide tour setting.
    if (localStorage.getItem('sectorx83-tour-v1') === 'complete') {
      localStorage.setItem(tourKey, 'complete')
      return
    }
    setTourStep(0)
  }, [profile?.id])

  const tourSteps = [
    { title: 'Welcome to Sectorx83', body: 'This is a member space for thoughtful discussion, independent work and accountable participation. Start here, then explore at your own pace.', target: 'The network' },
    { title: 'Dispatches', body: 'Long-form posts and announcements live here. Use classifications to browse, publish a considered post and open a dispatch to discuss it.', target: 'Ideas and records' },
    { title: 'Community chat', body: 'A separate live room for short conversations. It is deliberately not mixed into the dispatch feed.', target: 'Real-time conversation' },
    { title: 'Members and identity', body: 'Browse the member register and keep your own public profile accurate. Treat other members with respect.', target: 'People first' },
    { title: 'Governance and moderation', body: 'The Command Desk is restricted to authorised moderators and administrators. Member profiles and posts remain visible to signed-in members.', target: 'Privacy and responsibility' },
  ]

  function finishTour() {
    if (profile) localStorage.setItem(`sectorx83-tour-v2:${profile.id}`, 'complete')
    localStorage.setItem('sectorx83-tour-v1', 'complete')
    setTourStep(null)
  }

  const filtered = useMemo(() => posts.filter(p => (category === 'ALL' || (category === 'ANNOUNCEMENT' ? p.is_announcement : p.category === category)) && (p.title + p.body + (p.author?.username || '')).toLowerCase().includes(search.toLowerCase())), [posts, category, search])

  async function auth(e: FormEvent) {
    e.preventDefault(); if (!supabase) return
    setBusy(true); setError(''); setNotice('')
    try {
      if (mode === 'join') {
        const { data, error: e1 } = await supabase.auth.signUp({ email, password, options: { data: { username: username.trim().toLowerCase(), display_name: displayName.trim() } } })
        if (e1) throw e1
        if (!data.session) setNotice('Registration received. Sign in once your account is ready.')
        else setNotice('Your Sectorx83 membership is ready.')
      } else {
        const { error: e1 } = await supabase.auth.signInWithPassword({ email, password })
        if (e1) throw e1
      }
    } catch (e: any) { setError(e.message || 'Authentication failed.') }
    finally { setBusy(false) }
  }

  async function sendChat(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || suspended || !chatDraft.trim()) return
    setBusy(true)
    setError('')
    const { error: sendError } = await supabase.from('community_messages').insert({
      author_id: session.user.id,
      body: chatDraft.trim(),
    })
    if (sendError) setError(sendError.message)
    else setChatDraft('')
    setBusy(false)
  }

  async function sendDirectMessage(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !activeDm || suspended || !dmDraft.trim()) return
    setBusy(true)
    setError('')
    const { data, error: sendError } = await supabase.from('direct_messages').insert({
      sender_id: session.user.id,
      recipient_id: activeDm.id,
      body: dmDraft.trim(),
    }).select('id,sender_id,recipient_id,body,created_at').single()
    if (sendError) setError(sendError.message)
    else if (data) {
      setDmInbox(current => [data as DirectMessage, ...current.filter(message => message.id !== data.id)].slice(0, 300))
      setDmThread(current => [...current.filter(message => message.id !== data.id), data as DirectMessage].sort((a, b) => a.created_at.localeCompare(b.created_at)))
      setDmDraft('')
    }
    setBusy(false)
  }

  function openDirectMessage(member: Profile) {
    if (!session || member.id === session.user.id) return
    setActiveDm(member)
    setDmDraft('')
    setTab('messages')
    setError('')
    setNotice('')
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

  async function refreshAdminPanel() {
    if (!supabase || !session || !moderator) return
    setAdminRefreshing(true); setError(''); setRoleLoadError('')
    try {
      const [memberResult, postResult, banResult, reportResult] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100),
        supabase.from('banned_members').select('user_id'),
        supabase.from('reports').select('id,reason,status,created_at,reporter:profiles!reports_reporter_id_fkey(username),post:posts!reports_post_id_fkey(title)').order('created_at', { ascending: false }),
      ])
      const firstError = [memberResult.error, postResult.error, banResult.error, reportResult.error].find(Boolean)
      if (firstError) throw firstError
      setMembers((memberResult.data || []) as Profile[])
      setPosts((postResult.data || []) as unknown as Post[])
      setBanned((banResult.data || []).map((row: any) => row.user_id))
      setReports((reportResult.data || []) as unknown as Report[])
      if (admin) {
        setRolesLoading(true)
        const { data, error: fnError } = await supabase.functions.invoke('manage-member-role', { body: { action: 'list' } })
        if (fnError || data?.error) throw new Error(fnError?.message || data.error)
        setRoles((data?.users || []).map((user: any) => ({
          id: user.id || user.user_id, email: user.email ?? null,
          role: user.role || user.app_metadata?.role || 'member',
        })).filter((user: Role) => !!user.id))
      }
      setNotice('Command Desk data refreshed.')
    } catch (e: any) {
      setError(e.message || 'Unable to refresh Command Desk data.')
      if (admin) setRoleLoadError(e.message || 'Role directory unavailable.')
    } finally { setRolesLoading(false); setAdminRefreshing(false) }
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

  if (!ready) return <main className="cc-shell cc-loading"><Crest large/><span>ESTABLISHING SECURE CHANNEL</span><i/></main>
  if (!supabase) return <main className="cc-shell cc-entry"><header className="cc-header"><a className="cc-brand" href="/"><Crest/>SECTORX83</a><a href="/">SECTORX83 ↗</a></header><section className="cc-entry-hero"><Crest large/><p className="cc-kicker">NETWORK CONFIGURATION REQUIRED</p><h1>The network<br/><em>is not connected.</em></h1><p>Add the Sectorx83 Supabase URL and publishable key to Vercel. Setup instructions are included in the repository.</p><a href="https://github.com/sectorx83/Sectorx83/blob/main/SECTORX83_SETUP.md">OPEN SECTORX83 SETUP GUIDE ↗</a></section></main>

  if (!session) return <main className="cc-shell cc-entry">
    <div className="cc-grid-bg"/>
    <header className="cc-header"><a className="cc-brand" href="/"><Crest/><span>SECTORX83<small>PRIVATE MEMBER NETWORK</small></span></a><a className="cc-back" href="/">RETURN TO SECTORX83 ↗</a></header>
    <section className="cc-entry-layout"><div className="cc-manifesto"><p className="cc-kicker">SECTORX83 / THE DIRECTIVE</p><h1>Question deeply.<br/>Build together.<br/><em>Leave a mark.</em></h1><p>Sectorx83 is a member network for independent thinkers and builders. Share considered ideas in Dispatches, talk in the separate community room, meet other members and keep private notes in your own encrypted vault.</p><div className="cc-manifesto-foot">IDENTITY <i/> AUTHORITY <i/> ACCOUNTABILITY</div><div className="cc-emblem"><Themis large/><span>THEMIS / EQUITY · BALANCE · ACCOUNTABILITY</span></div></div>
      <section className="cc-auth-panel"><p className="cc-kicker">ACCESS CONTROL / 00</p><h2>{mode === 'join' ? 'Establish your record.' : 'Your presence is expected.'}</h2><p className="cc-subtitle">{mode === 'join' ? 'Register your identity. Your account remains subject to the rules of the network.' : 'Verify your identity. Proceed only with authorised credentials.'}</p><div className="cc-mode"><button className={mode === 'join' ? 'active' : ''} onClick={() => { setMode('join'); setError(''); setNotice('') }}>CREATE ACCOUNT</button><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setEmail(''); setError(''); setNotice('') }}>SIGN IN</button></div>
      <form onSubmit={auth} className="cc-form">{mode === 'join' && <><label>DISPLAY NAME<input required maxLength={48} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Name displayed on the record"/></label><label>USERNAME<input required minLength={3} maxLength={24} value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} placeholder="Choose your public identifier"/></label></>}
      <label>EMAIL ADDRESS<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Registered email address"/></label><label>PASSWORD<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your account password"/></label>
      {error && <p className="cc-error"><AlertTriangle size={14}/>{error}</p>}{notice && <p className="cc-notice"><Check size={14}/>{notice}</p>}
      <button className="cc-primary" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'join' ? 'CREATE MEMBER RECORD' : 'VERIFY & ENTER'} <ArrowUpRight size={16}/></button></form><small className="cc-auth-note">QUESTION EVERYTHING · PROVE SOMETHING · BUILD WHAT LASTS</small></section>
    </section><footer className="cc-footer"><span>SECTORX83</span><span>ACCESS / VERIFIED IDENTITIES ONLY</span><span>SECTORX83 © {new Date().getFullYear()}</span></footer>
  </main>

  return <main className="cc-shell cc-community">
    <header className="cc-header cc-header-inside"><a className="cc-brand" href="/sectorx83"><Crest/><span>SECTORX83<small>MEMBER NETWORK</small></span></a><div className="cc-header-actions"><div className="cc-user"><span>{profile?.display_name || session.user.email}<small>@{profile?.username || 'member'} · {role.toUpperCase()}</small></span><button onClick={() => { if (supabase) void supabase.auth.signOut() }} aria-label="Sign out"><LogOut size={16}/></button></div></div></header>
    <div className="cc-layout"><aside className="cc-sidebar"><small>SECTORX83 / NAVIGATION</small>{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setSelected(null); if (item.id !== 'messages') setActiveDm(null); setError(''); setNotice('') }}><Icon size={16}/>{item.label}</button> })}<div className="cc-principle"><Crest/><small>COMMUNITY PRINCIPLE</small><strong>Question every claim. Respect every person.</strong><p>Authority is accountable. Evidence outranks status. Disagreement is not disloyalty.</p></div><div className="cc-side-meta">ACCESS / {role.toUpperCase()}<br/>NETWORK / MEMBERS</div></aside>
    <section className="cc-main"><div className="cc-crumb">SECTORX83 <b>/</b> {nav.find(x => x.id === tab)?.label.toUpperCase()}</div>
      {tab === 'feed' && <section className="cc-welcome-strip"><div><p className="cc-kicker">WELCOME TO THE NETWORK</p><strong>Ideas in the feed. Conversation in the chat. People at the centre.</strong><span>A focused member network for discussion, collaboration and accountable participation.</span></div></section>}
      {(error || notice) && <div className={error ? 'cc-alert is-error' : 'cc-alert'}>{error || notice}<button onClick={() => { setError(''); setNotice('') }}><X size={14}/></button></div>}
      {suspended && <div className="cc-alert is-error">Your account is suspended from posting and commenting. Contact an administrator if this is a mistake.</div>}
      {tab === 'feed' && <><div className="cc-heading"><div><p className="cc-kicker">THE DISPATCH / 01</p><h1>Words carry <em>weight.</em></h1><p>No noise. No spectacle. Ideas recorded, challenged and put to work.</p></div><Crest large/></div>
        <div className="cc-toolbar"><div className="cc-categories">{sections.map(s => <button key={s} className={category === s ? 'active' : ''} onClick={() => setCategory(s)}>{s}</button>)}</div><label className="cc-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the record"/></label></div>
        {!suspended && <div className="cc-compose-toggle"><span>Something worth putting on record?</span><button onClick={() => setShowComposer(!showComposer)}><Plus size={15}/> NEW DISPATCH</button></div>}
        {showComposer && <form className="cc-composer" onSubmit={publish}><label>SUBJECT<input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required/></label><label>CLASSIFICATION<select value={postSection} onChange={e => setPostSection(e.target.value)}>{(moderator ? sections.slice(1) : sections.slice(1,4)).map(s => <option key={s}>{s}</option>)}</select></label><label>YOUR CONTRIBUTION<textarea value={body} onChange={e => setBody(e.target.value)} rows={5} maxLength={10000} required/></label><button className="cc-primary" disabled={busy}>SEAL DISPATCH <ArrowUpRight size={15}/></button></form>}
        <div className="cc-posts">{filtered.map(post => <article className={post.is_announcement ? 'cc-post announcement' : 'cc-post'} key={post.id}><div className="cc-post-meta"><span>{post.is_announcement ? 'OFFICIAL DIRECTIVE' : post.category}</span><time>{dateLabel(post.created_at)}</time></div><h2>{post.title}</h2><p>{post.body}</p><div className="cc-post-bottom"><span>{post.author?.display_name || 'Network member'} <small>@{post.author?.username || 'member'}</small></span><div><button onClick={() => setSelected(post)}><MessageCircle size={14}/> DISCUSS</button>{!post.is_announcement && <button onClick={() => setReporting(post)}><Flag size={13}/> REPORT</button>}{(moderator || post.author_id === session.user.id) && <button onClick={() => removePost(post)}><X size={14}/></button>}</div></div></article>)}{!filtered.length && <div className="cc-empty">The record is empty. Make the first statement.</div>}</div>
      </>}
      {tab === 'chat' && <><div className="cc-heading cc-chat-heading"><div><p className="cc-kicker">COMMUNITY CHAT / LIVE ROOM</p><h1>Talk <em>together.</em></h1><p>Short conversations belong here. Dispatches remain separate and searchable.</p></div><div className="cc-chat-live"><i/> MEMBER ROOM</div></div><div className="cc-chat-context"><MessageCircle size={17}/><span><strong>One shared room.</strong> Keep it useful, respectful and on-topic. No private messages or direct-message claims.</span></div><section className="cc-chat-panel"><div className="cc-chat-top"><span>SECTORX83 / COMMUNITY CHANNEL</span><span>{chatMessages.length} RECENT MESSAGES</span></div><div className="cc-chat-messages" aria-live="polite">{chatMessages.map(message => <article className={message.author_id === session.user.id ? 'cc-chat-message is-own' : 'cc-chat-message'} key={message.id}><span className="cc-chat-avatar">{(message.author?.display_name || 'M').slice(0,1).toUpperCase()}</span><div><header><strong>{message.author?.display_name || 'Member'}</strong><small>@{message.author?.username || 'member'} · {dateLabel(message.created_at)}</small></header><p>{message.body}</p></div></article>)}{!chatMessages.length && <div className="cc-chat-empty"><MessageCircle size={24}/><strong>The room is quiet.</strong><span>Start the first conversation.</span></div>}</div>{suspended ? <p className="cc-chat-locked">Posting is disabled while your account is suspended.</p> : <form className="cc-chat-compose" onSubmit={sendChat}><textarea value={chatDraft} onChange={e => setChatDraft(e.target.value)} rows={2} maxLength={2000} placeholder="Write a message to the room…" required/><div><small>{chatDraft.length}/2000 · Messages are visible to signed-in members.</small><button className="cc-primary" disabled={busy || !chatDraft.trim()}>{busy ? 'SENDING…' : 'SEND MESSAGE'} <Send size={14}/></button></div></form>}</section></>}
      {tab === 'messages' && <><div className="cc-heading"><div><p className="cc-kicker">PRIVATE CORRESPONDENCE / MEMBER NETWORK</p><h1>Direct <em>messages.</em></h1><p>One-to-one conversations. Only the two participants can access each conversation.</p></div><div className="cc-chat-live"><Lock size={13}/> PRIVATE</div></div><div className="cc-dm-layout"><aside className="cc-dm-list"><div className="cc-dm-list-head"><strong>CONVERSATIONS</strong><span>{dmConversations.length.toString().padStart(2,'0')}</span></div>{dmConversations.map(({peer,message}) => <button key={peer.id} className={activeDm?.id === peer.id ? 'active' : ''} onClick={() => setActiveDm(peer)}><i>{peer.display_name.slice(0,1).toUpperCase()}</i><span><strong>{peer.display_name}</strong><small>@{peer.username} · {dateLabel(message.created_at)}</small><em>{message.body}</em></span></button>)}{!dmConversations.length && <p className="cc-dm-empty">No conversations yet. Open the member register to start one.</p>}</aside><section className="cc-dm-thread">{activeDm ? <><header className="cc-dm-thread-head"><button onClick={() => setActiveDm(null)} aria-label="Back to conversations"><ChevronLeft size={16}/></button><i>{activeDm.display_name.slice(0,1).toUpperCase()}</i><span><strong>{activeDm.display_name}</strong><small>@{activeDm.username} · PRIVATE CONVERSATION</small></span></header><div className="cc-chat-messages cc-dm-messages" aria-live="polite">{activeDmMessages.map(message => <article className={message.sender_id === session.user.id ? 'cc-chat-message is-own' : 'cc-chat-message'} key={message.id}><span className="cc-chat-avatar">{(message.sender_id === session.user.id ? profile?.display_name : activeDm.display_name)?.slice(0,1).toUpperCase() || 'M'}</span><div><header><strong>{message.sender_id === session.user.id ? 'You' : activeDm.display_name}</strong><small>{dateLabel(message.created_at)}</small></header><p>{message.body}</p></div></article>)}{!activeDmMessages.length && <div className="cc-chat-empty"><MessageCircle size={24}/><strong>Start a conversation.</strong><span>Your messages here are visible only to you and {activeDm.display_name}.</span></div>}</div>{suspended ? <p className="cc-chat-locked">Messaging is disabled while your account is suspended.</p> : <form className="cc-chat-compose" onSubmit={sendDirectMessage}><textarea value={dmDraft} onChange={e => setDmDraft(e.target.value)} rows={2} maxLength={2000} placeholder={`Write privately to ${activeDm.display_name}…`} required/><div><small>{dmDraft.length}/2000 · Private between two members.</small><button className="cc-primary" disabled={busy || !dmDraft.trim()}>{busy ? 'SENDING…' : 'SEND PRIVATELY'} <Send size={14}/></button></div></form>}</> : <div className="cc-dm-no-selection"><MessageCircle size={28}/><strong>Select a conversation</strong><span>Or open the Members register and choose Message on a member profile.</span><button className="cc-primary" onClick={() => setTab('members')}>OPEN MEMBER REGISTER <Users size={14}/></button></div>}</section></div></>}
      {tab === 'members' && <><div className="cc-heading"><div><p className="cc-kicker">THE REGISTER / 02</p><h1>The <em>register.</em></h1><p>Every identity is recorded. Every member is accountable for their conduct.</p></div><strong className="cc-count">{members.length.toString().padStart(2,'0')}<small>MEMBERS</small></strong></div><label className="cc-search cc-member-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the register"/></label><div className="cc-members">{members.filter(m => (m.display_name + m.username).toLowerCase().includes(search.toLowerCase())).map(m => <article key={m.id}><i>{m.display_name.slice(0,1).toUpperCase()}</i><div><strong>{m.display_name}</strong><span>@{m.username}</span><small>MEMBER · JOINED {new Date(m.created_at).toLocaleDateString()}</small>{m.bio && <p>{m.bio}</p>}<button className="cc-member-message" disabled={m.id === session.user.id} onClick={() => openDirectMessage(m)}><MessageCircle size={13}/> MESSAGE</button></div></article>)}</div></>}
      {tab === 'profile' && <><div className="cc-heading"><div><p className="cc-kicker">IDENTITY RECORD / 03</p><h1>Your <em>record.</em></h1><p>Keep your public identity accurate. Your actions remain your responsibility.</p></div></div><form className="cc-composer cc-profile" onSubmit={saveProfile}><label>DISPLAY NAME<input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={48} required/></label><label>ABOUT YOU<textarea rows={4} maxLength={240} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="A short introduction (optional)"/></label><button className="cc-primary">SAVE PROFILE <Check size={15}/></button></form></>}
      {tab === 'admin' && !moderator && <div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>Command <em>desk.</em></h1><p>Restricted authority. Your verified role does not grant permission to enter this command level.</p></div><Lock size={34}/></div>}
      {tab === 'admin' && moderator && <><div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>The <em>council.</em></h1><p>Review violations. Govern access. Preserve the integrity of the network. Every exercise of authority must be justified.</p><p className="cc-admin-identity">AUTHENTICATED AS {session.user.email || 'VERIFIED ADMINISTRATOR'} · {role.toUpperCase()}</p></div><Themis large/></div><div className="cc-admin-toolbar"><span>COMMAND STATUS / {rolesLoading ? 'SYNCING DIRECTORY' : 'LIVE SESSION'}</span><button onClick={refreshAdminPanel} disabled={adminRefreshing}>{adminRefreshing ? 'REFRESHING…' : 'REFRESH COMMAND DATA'} <Activity size={14}/></button></div>{roleLoadError && <div className="cc-alert is-error">Role directory unavailable: {roleLoadError}</div>}{rolesLoading && <div className="cc-muted">Synchronising member privileges…</div>}<div className="cc-admin-stats"><div><strong>{members.length}</strong><small>MEMBERS</small></div><div><strong>{posts.length}</strong><small>POSTS</small></div><div><strong>{reports.filter(r => r.status === 'open').length}</strong><small>OPEN REPORTS</small></div><div><strong>{banned.length}</strong><small>SUSPENDED</small></div></div>
        <section className="cc-admin-section"><h2>Cases awaiting judgment</h2>{reports.length ? reports.map(r => <article key={r.id}><div><small>{r.status.toUpperCase()} · @{r.reporter?.username || 'member'}</small><strong>{r.post?.title || 'Reported comment'}</strong><p>{r.reason}</p></div><div><button onClick={() => reviewReport(r.id,'reviewed')}>REVIEWED</button><button onClick={() => reviewReport(r.id,'resolved')}>RESOLVE</button></div></article>) : <p className="cc-muted">No reports are waiting for review.</p>}</section>
        <section className="cc-admin-section"><h2>Access and rank</h2>{members.map(m => { const matchedRole = roles.find(x => x.id === m.id); const r = matchedRole?.role || 'member'; return <article key={m.id}><div><strong>{m.display_name}</strong><small>@{m.username} · {matchedRole?.email || 'EMAIL NOT RETURNED'} · {banned.includes(m.id) ? 'SUSPENDED' : 'ACTIVE'}</small></div><div className="cc-admin-controls"><select value={r} disabled={!admin || rolesLoading || !!roleLoadError || m.id === session.user.id} onChange={e => changeRole(m.id,e.target.value)}><option value="member">MEMBER</option><option value="moderator">MODERATOR</option><option value="admin">ADMIN</option></select>{banned.includes(m.id) ? <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,false)}>UNBAN</button> : <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,true)}><Ban size={13}/> BAN</button>}</div></article>})}</section>
        <section className="cc-admin-section"><h2>Security status</h2><div className="cc-security-grid"><article><Lock size={18}/><strong>TLS in transit</strong><small>Connections are protected in transit.</small></article><article><ShieldCheck size={18}/><strong>Encrypted database</strong><small>Managed storage encryption at rest.</small></article></div></section>
      </>}
      <footer className="cc-main-footer">SECTORX83 / VERIFIED NETWORK <span>QUESTION · PROVE · BUILD</span></footer>
    </section></div>
    {tourStep !== null && <div className="cc-tour-scrim"><section className="cc-tour-card" role="dialog" aria-modal="true" aria-labelledby="cc-tour-title"><div className="cc-tour-top"><span>SECTORX83 / FIRST VISIT</span><button onClick={finishTour} aria-label="Close tour"><X size={16}/></button></div><div className="cc-tour-progress">{tourSteps.map((_,i)=><i key={i} className={i <= tourStep ? 'is-active' : ''}/>)}</div><p className="cc-kicker">GUIDED INTRODUCTION · 0{tourStep + 1} / 0{tourSteps.length}</p><span className="cc-tour-target">{tourSteps[tourStep].target}</span><h2 id="cc-tour-title">{tourSteps[tourStep].title}</h2><p>{tourSteps[tourStep].body}</p><div className="cc-tour-actions"><button className="cc-tour-skip" onClick={finishTour}>SKIP TOUR</button><div>{tourStep > 0 && <button className="cc-tour-back" onClick={() => setTourStep(step => step === null ? null : Math.max(0,step-1))}><ChevronLeft size={14}/> BACK</button>}<button className="cc-primary" onClick={() => tourStep === tourSteps.length - 1 ? finishTour() : setTourStep(step => step === null ? null : Math.min(tourSteps.length-1,step+1))}>{tourStep === tourSteps.length - 1 ? 'FINISH' : 'NEXT'} <ChevronRight size={14}/></button></div></div></section></div>}
    {selected && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}><section className="cc-thread"><header>DISPATCH RECORD <button onClick={() => setSelected(null)}><X size={17}/></button></header><h2>{selected.title}</h2><p>{selected.body}</p><h3>{comments.length} RESPONSES</h3>{comments.map(c => <article key={c.id}><strong>{c.author?.display_name || 'Member'} <small>@{c.author?.username}</small></strong><p>{c.body}</p><time>{dateLabel(c.created_at)}</time></article>)}{!suspended && <form onSubmit={addComment}><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add evidence. Challenge the argument. Keep it precise." rows={3} required/><button className="cc-primary">POST RESPONSE <MessageCircle size={14}/></button></form>}</section></div>}
    {reporting && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setReporting(null) }}><section className="cc-thread"><header>NETWORK INTEGRITY / REPORT <button onClick={() => setReporting(null)}><X size={17}/></button></header><h2>Report discussion</h2><p>{reporting.title}</p><textarea rows={4} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Explain what needs moderator attention."/><button className="cc-primary" onClick={submitReport}>SUBMIT REPORT <Flag size={14}/></button></section></div>}
  </main>
}
