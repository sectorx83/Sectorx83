import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Activity, AlertTriangle, ArrowUpRight, Ban, Bell, CalendarDays, Check, ChevronLeft, ChevronRight, ExternalLink, Flag, LibraryBig, Lightbulb, Lock, LogOut, MessageCircle, Pencil, Plus, Search, Send, ShieldCheck, ThumbsUp, Users, X } from 'lucide-react'
import { supabase } from './lib/supabase'
import './sectorx83.css'

type Profile = { id: string; username: string; display_name: string; bio: string | null; created_at: string; avatar_url?: string | null; location?: string | null; website_url?: string | null; skills?: string[]; interests?: string[] }
type Post = { id: string; author_id: string; title: string; body: string; category: string; is_announcement: boolean; created_at: string; author?: { username: string; display_name: string } | null }
type PostReaction = { id: string; post_id: string; user_id: string; reaction_type: 'support' | 'insightful' }
type Comment = { id: string; body: string; created_at: string; author?: { username: string; display_name: string } | null }
type ChatMessage = { id: string; author_id: string; body: string; created_at: string; author?: { username: string; display_name: string } | null }
type DirectMessage = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string; read_at: string | null }
type Notification = { id: string; user_id: string; actor_id: string | null; kind: 'direct_message' | 'comment'; entity_id: string; title: string; body: string; created_at: string; read_at: string | null }
type CommunityEvent = { id: string; title: string; description: string; starts_at: string; location: string; created_at: string }
type CommunityResource = { id: string; title: string; description: string; url: string; category: string; created_at: string }
type AuditEntry = { id: number; actor_id: string | null; target_user_id: string | null; action: string; details: string; created_at: string }
type MessageReport = { id: string; reason: string; status: string; created_at: string; reporter?: { username: string } | null; message?: { body: string; sender_id: string; recipient_id: string } | null }
type Report = { id: string; reason: string; status: string; created_at: string; reporter?: { username: string } | null; post?: { title: string } | null }
type Role = { id: string; email: string | null; role: string }
const dateLabel = (value: string) => new Date(value).toLocaleString()
const sections = ['ALL', 'GENERAL', 'DISCUSSION', 'DECLARATIONS', 'ANNOUNCEMENT']

function Crest({ large = false }: { large?: boolean }) {
  return <span className={large ? 'cc-crest cc-crest-large' : 'cc-crest'} role="img" aria-label="State emblem of the Soviet Union">
    <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_arms_of_the_Soviet_Union.svg" alt="USSR state emblem" loading="eager" decoding="async"/>
  </span>
}

function Themis({ large = false }: { large?: boolean }) {
  return <span className={large ? 'cc-themis cc-themis-large' : 'cc-themis'} role="img" aria-label="Themis, Greek goddess of justice">
    <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Statue_of_Themis_at_the_National_Archaeological_Museum_of_Athens_(1-31-2023).jpg?width=1000" alt="Ancient Pentelic marble statue of Themis from Rhamnous, circa 300 BCE" loading={large ? 'eager' : 'lazy'} decoding="async"/>
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
  const [profileAvatar, setProfileAvatar] = useState('')
  const [profileLocation, setProfileLocation] = useState('')
  const [profileWebsite, setProfileWebsite] = useState('')
  const [profileSkills, setProfileSkills] = useState('')
  const [profileInterests, setProfileInterests] = useState('')
  const [memberSort, setMemberSort] = useState<'newest' | 'name'>('newest')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventStartsAt, setEventStartsAt] = useState('')
  const [eventLocation, setEventLocation] = useState('Online')
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceDescription, setResourceDescription] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceCategory, setResourceCategory] = useState('REFERENCE')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [postReactions, setPostReactions] = useState<PostReaction[]>([])
  const [draftLoadedFor, setDraftLoadedFor] = useState('')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [members, setMembers] = useState<Profile[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatDraft, setChatDraft] = useState('')
  const [dmInbox, setDmInbox] = useState<DirectMessage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [resources, setResources] = useState<CommunityResource[]>([])
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])
  const [dmThread, setDmThread] = useState<DirectMessage[]>([])
  const [dmDraft, setDmDraft] = useState('')
  const [dmSearch, setDmSearch] = useState('')
  const [blockedMembers, setBlockedMembers] = useState<string[]>([])
  const [reportingMessage, setReportingMessage] = useState<DirectMessage | null>(null)
  const [messageReportReason, setMessageReportReason] = useState('')
  const [messageReports, setMessageReports] = useState<MessageReport[]>([])
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
  const nav = [{ id: 'feed', label: 'Dispatches', icon: Activity }, { id: 'chat', label: 'Community Chat', icon: MessageCircle }, { id: 'messages', label: 'Messages', icon: Send }, { id: 'members', label: 'Members', icon: Users }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'events', label: 'Events', icon: CalendarDays }, { id: 'library', label: 'Library', icon: LibraryBig }, { id: 'profile', label: 'My Profile', icon: ShieldCheck }, ...(moderator ? [{ id: 'admin', label: 'Command Desk', icon: Flag }] : [])]
  const unreadNotificationCount = notifications.filter(item => !item.read_at).length
  const unreadMessageCount = dmInbox.filter(message => message.recipient_id === session?.user?.id && !message.read_at).length

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
    if (!supabase || !session) { setProfile(null); setPosts([]); setMembers([]); setBanned([]); setPostReactions([]); return }
    let active = true
    async function load() {
      const [p, f, m, b, eventResult, resourceResult, blockResult] = await Promise.all([
        supabase!.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase!.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100),
        supabase!.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
        supabase!.from('banned_members').select('user_id'),
        supabase!.from('community_events').select('*').order('starts_at', { ascending: true }).limit(100),
        supabase!.from('community_resources').select('*').order('created_at', { ascending: false }).limit(200),
        supabase!.from('member_blocks').select('blocked_id'),
      ])
      if (!active) return
      const loadError = [p.error, f.error, m.error, b.error, eventResult.error, resourceResult.error, blockResult.error].find(Boolean)
      if (loadError) throw new Error(loadError.message)
      if (!p.data) throw new Error('Your member profile is missing. Confirm your account and verify that the Sectorx83 database migrations have been applied.')
      setProfile(p.data as Profile); setDisplayName(p.data.display_name || ''); setProfileBio(p.data.bio || '')
      setProfileAvatar(p.data.avatar_url || ''); setProfileLocation(p.data.location || ''); setProfileWebsite(p.data.website_url || '')
      setProfileSkills((p.data.skills || []).join(', ')); setProfileInterests((p.data.interests || []).join(', '))
      if (f.data) setPosts(f.data as unknown as Post[])
      if (m.data) setMembers(m.data as Profile[])
      if (b.data) setBanned(b.data.map((x: any) => x.user_id))
      setEvents((eventResult.data || []) as CommunityEvent[])
      setResources((resourceResult.data || []) as CommunityResource[])
      setBlockedMembers((blockResult.data || []).map((row: any) => row.blocked_id))

      if (moderator) {
        const { data: reportData, error: reportError } = await supabase!.from('reports').select('id,reason,status,created_at,reporter:profiles!reports_reporter_id_fkey(username),post:posts!reports_post_id_fkey(title)').order('created_at', { ascending: false })
        if (!active) return
        if (reportError) throw reportError
        if (reportData) setReports(reportData as unknown as Report[])
        const { data: auditData, error: auditError } = await supabase!.from('moderation_audit_log').select('*').order('created_at', { ascending: false }).limit(100)
        if (auditError) throw auditError
        setAuditLog((auditData || []) as AuditEntry[])
        const { data: messageReportData, error: messageReportError } = await supabase!.from('message_reports').select('id,reason,status,created_at,reporter:profiles!message_reports_reporter_id_fkey(username),message:direct_messages!message_reports_message_id_fkey(body,sender_id,recipient_id)').order('created_at', { ascending: false })
        if (messageReportError) throw messageReportError
        setMessageReports((messageReportData || []) as unknown as MessageReport[])
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
    if (!supabase || !session) return
    let active = true
    supabase.from('post_reactions').select('id,post_id,user_id,reaction_type').limit(1000).then(({ data, error: reactionError }) => {
      if (!active) return
      if (reactionError) setError(reactionError.message)
      else setPostReactions((data || []) as PostReaction[])
    })
    return () => { active = false }
  }, [session?.user?.id])

  useEffect(() => {
    if (!session) { setDraftLoadedFor(''); return }
    const key = `sectorx83-dispatch-draft:${session.user.id}`
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const draft = JSON.parse(saved)
        setTitle(typeof draft.title === 'string' ? draft.title : '')
        setBody(typeof draft.body === 'string' ? draft.body : '')
        setPostSection(typeof draft.postSection === 'string' ? draft.postSection : 'GENERAL')
        if (draft.title || draft.body) setShowComposer(true)
      }
    } catch { localStorage.removeItem(key) }
    setDraftLoadedFor(session.user.id)
  }, [session?.user?.id])

  useEffect(() => {
    if (!session || draftLoadedFor !== session.user.id) return
    localStorage.setItem(`sectorx83-dispatch-draft:${session.user.id}`, JSON.stringify({ title, body, postSection }))
  }, [session?.user?.id, draftLoadedFor, title, body, postSection])

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
        .select('id,sender_id,recipient_id,body,created_at,read_at')
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
        const incomingToOpenThread = !!activeDm && row.sender_id === activeDm.id && row.recipient_id === session.user.id
        const normalizedRow = incomingToOpenThread ? { ...row, read_at: new Date().toISOString() } : row
        if (incomingToOpenThread) void supabase!.from('direct_messages').update({ read_at: normalizedRow.read_at }).eq('id', row.id)
        setDmInbox(current => current.some(message => message.id === row.id)
          ? current.map(message => message.id === row.id ? normalizedRow : message)
          : [normalizedRow, ...current].slice(0, 300))
        setDmThread(current => {
          const belongsToOpenThread = activeDm && (
            (row.sender_id === session.user.id && row.recipient_id === activeDm.id) ||
            (row.sender_id === activeDm.id && row.recipient_id === session.user.id)
          )
          return belongsToOpenThread && !current.some(message => message.id === row.id)
            ? [...current, normalizedRow].sort((a, b) => a.created_at.localeCompare(b.created_at))
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
        .select('id,sender_id,recipient_id,body,created_at,read_at')
        .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${activeDm.id}),and(sender_id.eq.${activeDm.id},recipient_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true })
        .limit(500)
      if (!active) return
      if (threadError) { setError(threadError.message); return }
      const messages = (data || []) as DirectMessage[]
      const unreadIds = messages.filter(message => message.recipient_id === session.user.id && !message.read_at).map(message => message.id)
      if (unreadIds.length) {
        const readAt = new Date().toISOString()
        const { error: readError } = await supabase!.from('direct_messages').update({ read_at: readAt }).in('id', unreadIds)
        if (readError) setError(readError.message)
        else {
          messages.forEach(message => { if (unreadIds.includes(message.id)) message.read_at = readAt })
          setDmInbox(current => current.map(message => unreadIds.includes(message.id) ? { ...message, read_at: readAt } : message))
        }
      }
      setDmThread(messages)
    }
    void loadThread()
    return () => { active = false }
  }, [session?.user?.id, activeDm?.id])

  const activeDmMessages = dmThread

  useEffect(() => {
    if (!supabase || !session) { setNotifications([]); return }
    let active = true
    const loadNotifications = async () => {
      const { data, error: notificationError } = await supabase!.from('notifications').select('*').order('created_at', { ascending: false }).limit(100)
      if (!active) return
      if (notificationError) { setError(notificationError.message); return }
      setNotifications((data || []) as Notification[])
    }
    void loadNotifications()
    const channel = supabase.channel(`sectorx83-notifications-${session.user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` }, payload => {
        if (!active) return
        const row = payload.new as Notification
        setNotifications(current => current.some(item => item.id === row.id) ? current : [row, ...current].slice(0,100))
      })
      .subscribe()
    return () => { active = false; void supabase!.removeChannel(channel) }
  }, [session?.user?.id, tab === 'notifications'])

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
  const filteredMembers = useMemo(() => members.filter(member => (member.display_name + member.username + (member.bio || '') + (member.location || '') + (member.skills || []).join(' ') + (member.interests || []).join(' ')).toLowerCase().includes(search.toLowerCase())).sort((a,b) => memberSort === 'name' ? a.display_name.localeCompare(b.display_name) : b.created_at.localeCompare(a.created_at)), [members, search, memberSort])

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
    }).select('id,sender_id,recipient_id,body,created_at,read_at').single()
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
    setDmSearch('')
    setDmDraft('')
    setTab('messages')
    setError('')
    setNotice('')
  }

  async function markNotificationsRead() {
    if (!supabase || !session) return
    const unreadIds = notifications.filter(item => !item.read_at).map(item => item.id)
    if (!unreadIds.length) return
    const readAt = new Date().toISOString()
    const { error: readError } = await supabase.from('notifications').update({ read_at: readAt }).in('id', unreadIds)
    if (readError) setError(readError.message)
    else setNotifications(current => current.map(item => unreadIds.includes(item.id) ? { ...item, read_at: readAt } : item))
  }

  async function openNotification(item: Notification) {
    if (!supabase) return
    if (!item.read_at) {
      const readAt = new Date().toISOString()
      const { error: readError } = await supabase.from('notifications').update({ read_at: readAt }).eq('id', item.id)
      if (!readError) setNotifications(current => current.map(n => n.id === item.id ? { ...n, read_at: readAt } : n))
    }
    if (item.kind === 'direct_message' && item.actor_id) {
      const peer = members.find(member => member.id === item.actor_id)
      if (peer) openDirectMessage(peer)
      else setTab('messages')
      return
    }
    const { data } = await supabase.from('comments').select('post_id').eq('id', item.entity_id).maybeSingle()
    const post = posts.find(candidate => candidate.id === data?.post_id)
    setTab('feed')
    if (post) setSelected(post)
  }

  async function createEvent(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !moderator || !eventTitle.trim() || !eventStartsAt) return
    const { data, error: createError } = await supabase.from('community_events').insert({ title: eventTitle.trim(), description: eventDescription.trim(), starts_at: new Date(eventStartsAt).toISOString(), location: eventLocation.trim() || 'Online', created_by: session.user.id }).select('*').single()
    if (createError) setError(createError.message)
    else { setEvents(current => [...current, data as CommunityEvent].sort((a,b) => a.starts_at.localeCompare(b.starts_at))); setEventTitle(''); setEventDescription(''); setEventStartsAt(''); setEventLocation('Online'); setNotice('Event published.') }
  }

  async function createResource(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !moderator || !resourceTitle.trim() || !resourceUrl.startsWith('https://')) return
    const { data, error: createError } = await supabase.from('community_resources').insert({ title: resourceTitle.trim(), description: resourceDescription.trim(), url: resourceUrl.trim(), category: resourceCategory, created_by: session.user.id }).select('*').single()
    if (createError) setError(createError.message)
    else { setResources(current => [data as CommunityResource, ...current]); setResourceTitle(''); setResourceDescription(''); setResourceUrl(''); setResourceCategory('REFERENCE'); setNotice('Resource added to the library.') }
  }

  async function removeEvent(id: string) {
    if (!supabase || !moderator || !confirm('Delete this event?')) return
    const { error: removeError } = await supabase.from('community_events').delete().eq('id', id)
    if (removeError) setError(removeError.message); else setEvents(current => current.filter(event => event.id !== id))
  }

  async function removeResource(id: string) {
    if (!supabase || !moderator || !confirm('Remove this library resource?')) return
    const { error: removeError } = await supabase.from('community_resources').delete().eq('id', id)
    if (removeError) setError(removeError.message); else setResources(current => current.filter(resource => resource.id !== id))
  }

  async function toggleMemberBlock(member: Profile) {
    if (!supabase || !session || member.id === session.user.id) return
    const isBlocked = blockedMembers.includes(member.id)
    const result = isBlocked
      ? await supabase.from('member_blocks').delete().eq('blocker_id', session.user.id).eq('blocked_id', member.id)
      : await supabase.from('member_blocks').insert({ blocker_id: session.user.id, blocked_id: member.id })
    if (result.error) setError(result.error.message)
    else {
      setBlockedMembers(current => isBlocked ? current.filter(id => id !== member.id) : [...current, member.id])
      setNotice(isBlocked ? `Messages from ${member.display_name} are unblocked.` : `You blocked ${member.display_name}. They cannot message you, and you cannot message them.`)
    }
  }

  async function submitMessageReport() {
    if (!supabase || !session || !reportingMessage || messageReportReason.trim().length < 5) return
    const { error: reportError } = await supabase.from('message_reports').insert({ reporter_id: session.user.id, message_id: reportingMessage.id, reason: messageReportReason.trim() })
    if (reportError) setError(reportError.message)
    else { setReportingMessage(null); setMessageReportReason(''); setNotice('Private message report sent to moderators.') }
  }

  async function reviewMessageReport(id: string, status: string) {
    if (!supabase || !moderator) return
    const { error: reviewError } = await supabase.from('message_reports').update({ status, reviewed_by: session.user.id, reviewed_at: new Date().toISOString() }).eq('id', id)
    if (reviewError) setError(reviewError.message)
    else {
      setMessageReports(current => current.map(item => item.id === id ? { ...item, status } : item))
      const { data } = await supabase.from('moderation_audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      if (data) setAuditLog(data as AuditEntry[])
    }
  }

  async function refreshPosts() {
    if (!supabase) return
    const { data, error: refreshError } = await supabase.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100)
    if (refreshError) { setError(refreshError.message); return }
    if (data) setPosts(data as unknown as Post[])
  }

  async function toggleReaction(post: Post, reactionType: 'support' | 'insightful') {
    if (!supabase || !session || suspended) return
    const existing = postReactions.find(reaction => reaction.post_id === post.id && reaction.user_id === session.user.id)
    if (existing?.reaction_type === reactionType) {
      const { error: reactionError } = await supabase.from('post_reactions').delete().eq('id', existing.id)
      if (reactionError) setError(reactionError.message)
      else setPostReactions(current => current.filter(reaction => reaction.id !== existing.id))
      return
    }
    if (existing) {
      const { error: removeError } = await supabase.from('post_reactions').delete().eq('id', existing.id)
      if (removeError) { setError(removeError.message); return }
      setPostReactions(current => current.filter(reaction => reaction.id !== existing.id))
    }
    const { data, error: addError } = await supabase.from('post_reactions').insert({ post_id: post.id, user_id: session.user.id, reaction_type: reactionType }).select('id,post_id,user_id,reaction_type').single()
    if (addError) setError(addError.message)
    else if (data) setPostReactions(current => [...current.filter(reaction => reaction.post_id !== post.id || reaction.user_id !== session.user.id), data as PostReaction])
  }

  function beginEditPost(post: Post) {
    setEditingPost(post)
    setEditTitle(post.title)
    setEditBody(post.body)
  }

  async function savePostEdit(e: FormEvent) {
    e.preventDefault()
    if (!supabase || !session || !editingPost || !editTitle.trim() || !editBody.trim()) return
    const { error: editError } = await supabase.from('posts').update({ title: editTitle.trim(), body: editBody.trim() }).eq('id', editingPost.id)
    if (editError) setError(editError.message)
    else {
      const updated = { ...editingPost, title: editTitle.trim(), body: editBody.trim() }
      setPosts(current => current.map(post => post.id === updated.id ? updated : post))
      if (selected?.id === updated.id) setSelected(updated)
      setEditingPost(null)
      setNotice('Dispatch updated.')
    }
  }

  async function publish(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session || suspended) return
    setBusy(true)
    const announcement = postSection === 'ANNOUNCEMENT'
    const { error: e1 } = await supabase.from('posts').insert({ author_id: session.user.id, title: title.trim(), body: body.trim(), category: announcement ? 'GENERAL' : postSection, is_announcement: announcement })
    if (e1) setError(e1.message)
    else { setTitle(''); setBody(''); setPostSection('GENERAL'); setShowComposer(false); localStorage.removeItem(`sectorx83-dispatch-draft:${session.user.id}`); await refreshPosts() }
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
    if (result.error) setError(result.error.message); else {
      setBanned(old => ban ? [...old, id] : old.filter(x => x !== id))
      const { data } = await supabase.from('moderation_audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      if (data) setAuditLog(data as AuditEntry[])
    }
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
      const [memberResult, postResult, banResult, reportResult, messageReportResult, auditResult] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('posts').select('id,author_id,title,body,category,is_announcement,created_at,author:profiles!posts_author_id_fkey(username,display_name)').order('is_announcement', { ascending: false }).order('created_at', { ascending: false }).limit(100),
        supabase.from('banned_members').select('user_id'),
        supabase.from('reports').select('id,reason,status,created_at,reporter:profiles!reports_reporter_id_fkey(username),post:posts!reports_post_id_fkey(title)').order('created_at', { ascending: false }),
        supabase.from('message_reports').select('id,reason,status,created_at,reporter:profiles!message_reports_reporter_id_fkey(username),message:direct_messages!message_reports_message_id_fkey(body,sender_id,recipient_id)').order('created_at', { ascending: false }),
        supabase.from('moderation_audit_log').select('*').order('created_at', { ascending: false }).limit(100),
      ])
      const firstError = [memberResult.error, postResult.error, banResult.error, reportResult.error, messageReportResult.error, auditResult.error].find(Boolean)
      if (firstError) throw firstError
      setMembers((memberResult.data || []) as Profile[])
      setPosts((postResult.data || []) as unknown as Post[])
      setBanned((banResult.data || []).map((row: any) => row.user_id))
      setReports((reportResult.data || []) as unknown as Report[])
      setMessageReports((messageReportResult.data || []) as unknown as MessageReport[])
      setAuditLog((auditResult.data || []) as AuditEntry[])
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
    if (e1) setError(e1.message); else {
      setReports(old => old.map(x => x.id === id ? { ...x, status } : x))
      const { data } = await supabase.from('moderation_audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      if (data) setAuditLog(data as AuditEntry[])
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session) return
    const skills = [...new Set(profileSkills.split(',').map(value => value.trim()).filter(Boolean))].slice(0,12)
    const interests = [...new Set(profileInterests.split(',').map(value => value.trim()).filter(Boolean))].slice(0,12)
    const avatar = profileAvatar.trim() || null
    const website = profileWebsite.trim() || null
    const location = profileLocation.trim() || null
    const { error: e1 } = await supabase.from('profiles').update({ display_name: displayName.trim(), bio: profileBio.trim().slice(0,240), avatar_url: avatar, location, website_url: website, skills, interests }).eq('id', session.user.id)
    if (e1) setError(e1.message); else { setNotice('Profile updated.'); setProfile(old => old ? { ...old, display_name: displayName.trim(), bio: profileBio.trim().slice(0,240), avatar_url: avatar, location, website_url: website, skills, interests } : old); setMembers(old => old.map(member => member.id === session.user.id ? { ...member, display_name: displayName.trim(), bio: profileBio.trim().slice(0,240), avatar_url: avatar, location, website_url: website, skills, interests } : member)) }
  }

  if (!ready) return <main className="cc-shell cc-loading"><Crest large/><span>ESTABLISHING SECURE CHANNEL</span><i/></main>
  if (!supabase) return <main className="cc-shell cc-entry"><header className="cc-header"><a className="cc-brand" href="/"><Crest/>SECTORX83</a><a href="/">SECTORX83 ↗</a></header><section className="cc-entry-hero"><Crest large/><p className="cc-kicker">NETWORK CONFIGURATION REQUIRED</p><h1>The network<br/><em>is not connected.</em></h1><p>Add the Sectorx83 Supabase URL and publishable key to Vercel. Setup instructions are included in the repository.</p><a href="https://github.com/sectorx83/Sectorx83/blob/main/SECTORX83_SETUP.md">OPEN SECTORX83 SETUP GUIDE ↗</a></section></main>

  if (!session) return <main className="cc-shell cc-entry">
    <div className="cc-grid-bg"/>
    <header className="cc-header"><a className="cc-brand" href="/"><Crest/><span>SECTORX83<small>PRIVATE MEMBER NETWORK</small></span></a><a className="cc-back" href="/">RETURN TO SECTORX83 ↗</a></header>
    <section className="cc-entry-layout"><div className="cc-manifesto"><p className="cc-kicker">SECTORX83 / THE DIRECTIVE</p><h1>Question deeply.<br/>Build together.<br/><em>Leave a mark.</em></h1><p>Sectorx83 is a member network for independent thinkers and builders. Share considered ideas in Dispatches, talk in the separate community room, meet other members and build a useful record together.</p><div className="cc-manifesto-foot">IDENTITY <i/> AUTHORITY <i/> ACCOUNTABILITY</div><div className="cc-emblem"><Themis large/><span>THEMIS / EQUITY · BALANCE · ACCOUNTABILITY<small>Photograph: <a href="https://commons.wikimedia.org/wiki/File:Statue_of_Themis_at_the_National_Archaeological_Museum_of_Athens_(1-31-2023).jpg" target="_blank" rel="noreferrer">George E. Koronaios · CC BY-SA 4.0</a></small></span></div></div>
      <section className="cc-auth-panel"><p className="cc-kicker">ACCESS CONTROL / 00</p><h2>{mode === 'join' ? 'Establish your record.' : 'Your presence is expected.'}</h2><p className="cc-subtitle">{mode === 'join' ? 'Register your identity. Your account remains subject to the rules of the network.' : 'Verify your identity. Proceed only with authorised credentials.'}</p><div className="cc-mode"><button className={mode === 'join' ? 'active' : ''} onClick={() => { setMode('join'); setError(''); setNotice('') }}>CREATE ACCOUNT</button><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setEmail(''); setError(''); setNotice('') }}>SIGN IN</button></div>
      <form onSubmit={auth} className="cc-form">{mode === 'join' && <><label>DISPLAY NAME<input required maxLength={48} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Name displayed on the record"/></label><label>USERNAME<input required minLength={3} maxLength={24} value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} placeholder="Choose your public identifier"/></label></>}
      <label>EMAIL ADDRESS<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Registered email address"/></label><label>PASSWORD<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your account password"/></label>
      {error && <p className="cc-error"><AlertTriangle size={14}/>{error}</p>}{notice && <p className="cc-notice"><Check size={14}/>{notice}</p>}
      <button className="cc-primary" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'join' ? 'CREATE MEMBER RECORD' : 'VERIFY & ENTER'} <ArrowUpRight size={16}/></button></form><small className="cc-auth-note">QUESTION EVERYTHING · PROVE SOMETHING · BUILD WHAT LASTS</small></section>
    </section><footer className="cc-footer"><span>SECTORX83</span><span>ACCESS / VERIFIED IDENTITIES ONLY</span><span>SECTORX83 © {new Date().getFullYear()}</span></footer>
  </main>

  return <main className="cc-shell cc-community">
    <header className="cc-header cc-header-inside"><a className="cc-brand" href="/sectorx83"><Crest/><span>SECTORX83<small>MEMBER NETWORK</small></span></a><div className="cc-header-actions"><div className="cc-user"><span>{profile?.display_name || session.user.email}<small>@{profile?.username || 'member'} · {role.toUpperCase()}</small></span><button onClick={() => { if (supabase) void supabase.auth.signOut() }} aria-label="Sign out"><LogOut size={16}/></button></div></div></header>
    <div className="cc-layout">
    <section className="cc-main"><div className="cc-crumb">SECTORX83 <b>/</b> {nav.find(x => x.id === tab)?.label.toUpperCase()}</div>
      {tab === 'feed' && <section className="cc-welcome-strip"><div><p className="cc-kicker">WELCOME TO THE NETWORK</p><strong>Ideas in the feed. Conversation in the chat. People at the centre.</strong><span>A focused member network for discussion, collaboration and accountable participation.</span></div></section>}
      {(error || notice) && <div className={error ? 'cc-alert is-error' : 'cc-alert'}>{error || notice}<button onClick={() => { setError(''); setNotice('') }}><X size={14}/></button></div>}
      {suspended && <div className="cc-alert is-error">Your account is suspended from posting and commenting. Contact an administrator if this is a mistake.</div>}
      {tab === 'feed' && <><div className="cc-heading"><div><p className="cc-kicker">THE DISPATCH / 01</p><h1>Words carry <em>weight.</em></h1><p>No noise. No spectacle. Ideas recorded, challenged and put to work.</p></div><Crest large/></div>
        <div className="cc-toolbar"><div className="cc-categories">{sections.map(s => <button key={s} className={category === s ? 'active' : ''} onClick={() => setCategory(s)}>{s}</button>)}</div><label className="cc-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search the record"/></label></div>
        {!suspended && <div className="cc-compose-toggle"><span>Something worth putting on record?</span><button onClick={() => setShowComposer(!showComposer)}><Plus size={15}/> NEW DISPATCH</button></div>}
        {showComposer && <form className="cc-composer" onSubmit={publish}><p className="cc-draft-status">DRAFT AUTO-SAVES ON THIS DEVICE</p><label>SUBJECT<input value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required/></label><label>CLASSIFICATION<select value={postSection} onChange={e => setPostSection(e.target.value)}>{(moderator ? sections.slice(1) : sections.slice(1,4)).map(s => <option key={s}>{s}</option>)}</select></label><label>YOUR CONTRIBUTION<textarea value={body} onChange={e => setBody(e.target.value)} rows={5} maxLength={10000} required/></label><button className="cc-primary" disabled={busy}>SEAL DISPATCH <ArrowUpRight size={15}/></button></form>}
        <div className="cc-posts">{filtered.map(post => <article className={post.is_announcement ? 'cc-post announcement' : 'cc-post'} key={post.id}><div className="cc-post-meta"><span>{post.is_announcement ? 'OFFICIAL DIRECTIVE' : post.category}</span><time>{dateLabel(post.created_at)}</time></div><h2>{post.title}</h2><p>{post.body}</p><div className="cc-post-reactions"><button className={postReactions.some(reaction => reaction.post_id === post.id && reaction.user_id === session.user.id && reaction.reaction_type === 'support') ? 'active' : ''} onClick={() => toggleReaction(post,'support')} disabled={suspended}><ThumbsUp size={13}/> SUPPORT <b>{postReactions.filter(reaction => reaction.post_id === post.id && reaction.reaction_type === 'support').length}</b></button><button className={postReactions.some(reaction => reaction.post_id === post.id && reaction.user_id === session.user.id && reaction.reaction_type === 'insightful') ? 'active' : ''} onClick={() => toggleReaction(post,'insightful')} disabled={suspended}><Lightbulb size={13}/> INSIGHTFUL <b>{postReactions.filter(reaction => reaction.post_id === post.id && reaction.reaction_type === 'insightful').length}</b></button></div><div className="cc-post-bottom"><span>{post.author?.display_name || 'Network member'} <small>@{post.author?.username || 'member'}</small></span><div><button onClick={() => setSelected(post)}><MessageCircle size={14}/> DISCUSS</button>{!post.is_announcement && <button onClick={() => setReporting(post)}><Flag size={13}/> REPORT</button>}{(moderator || post.author_id === session.user.id) && <button onClick={() => beginEditPost(post)} aria-label="Edit dispatch"><Pencil size={13}/></button>}{(moderator || post.author_id === session.user.id) && <button onClick={() => removePost(post)}><X size={14}/></button>}</div></div></article>)}{!filtered.length && <div className="cc-empty">The record is empty. Make the first statement.</div>}</div>
      </>}
      {tab === 'chat' && <><div className="cc-heading cc-chat-heading"><div><p className="cc-kicker">COMMUNITY CHAT / LIVE ROOM</p><h1>Talk <em>together.</em></h1><p>Short conversations belong here. Dispatches remain separate and searchable.</p></div><div className="cc-chat-live"><i/> MEMBER ROOM</div></div><div className="cc-chat-context"><MessageCircle size={17}/><span><strong>One shared room.</strong> Keep it useful, respectful and on-topic. No private messages or direct-message claims.</span></div><section className="cc-chat-panel"><div className="cc-chat-top"><span>SECTORX83 / COMMUNITY CHANNEL</span><span>{chatMessages.length} RECENT MESSAGES</span></div><div className="cc-chat-messages" aria-live="polite">{chatMessages.map(message => <article className={message.author_id === session.user.id ? 'cc-chat-message is-own' : 'cc-chat-message'} key={message.id}><span className="cc-chat-avatar">{(message.author?.display_name || 'M').slice(0,1).toUpperCase()}</span><div><header><strong>{message.author?.display_name || 'Member'}</strong><small>@{message.author?.username || 'member'} · {dateLabel(message.created_at)}</small></header><p>{message.body}</p></div></article>)}{!chatMessages.length && <div className="cc-chat-empty"><MessageCircle size={24}/><strong>The room is quiet.</strong><span>Start the first conversation.</span></div>}</div>{suspended ? <p className="cc-chat-locked">Posting is disabled while your account is suspended.</p> : <form className="cc-chat-compose" onSubmit={sendChat}><textarea value={chatDraft} onChange={e => setChatDraft(e.target.value)} rows={2} maxLength={2000} placeholder="Write a message to the room…" required/><div><small>{chatDraft.length}/2000 · Messages are visible to signed-in members.</small><button className="cc-primary" disabled={busy || !chatDraft.trim()}>{busy ? 'SENDING…' : 'SEND MESSAGE'} <Send size={14}/></button></div></form>}</section></>}
      {tab === 'messages' && <><div className="cc-heading"><div><p className="cc-kicker">PRIVATE CORRESPONDENCE / MEMBER NETWORK</p><h1>Direct <em>messages.</em></h1><p>One-to-one conversations. Only the two participants can access each conversation.</p></div><div className="cc-chat-live"><Lock size={13}/> PRIVATE</div></div><div className="cc-dm-layout"><aside className="cc-dm-list"><div className="cc-dm-list-head"><strong>CONVERSATIONS</strong><span>{dmConversations.length.toString().padStart(2,'0')}</span></div><label className="cc-search cc-dm-search"><Search size={13}/><input value={dmSearch} onChange={e => setDmSearch(e.target.value)} placeholder="Search conversations"/></label>{dmConversations.filter(({peer,message}) => (peer.display_name + peer.username + message.body).toLowerCase().includes(dmSearch.toLowerCase())).map(({peer,message}) => <button key={peer.id} className={activeDm?.id === peer.id ? 'active' : ''} onClick={() => setActiveDm(peer)}><i>{peer.display_name.slice(0,1).toUpperCase()}</i><span><strong>{peer.display_name}</strong><small>@{peer.username} · {dateLabel(message.created_at)}</small><em>{message.body}</em>{dmInbox.filter(item => item.sender_id === peer.id && item.recipient_id === session.user.id && !item.read_at).length > 0 && <b className="cc-dm-unread">{dmInbox.filter(item => item.sender_id === peer.id && item.recipient_id === session.user.id && !item.read_at).length}</b>}</span></button>)}{!dmConversations.length && <p className="cc-dm-empty">No conversations yet. Open the member register to start one.</p>}</aside><section className="cc-dm-thread">{activeDm ? <><header className="cc-dm-thread-head"><button onClick={() => setActiveDm(null)} aria-label="Back to conversations"><ChevronLeft size={16}/></button><i>{activeDm.display_name.slice(0,1).toUpperCase()}</i><span><strong>{activeDm.display_name}</strong><small>@{activeDm.username} · PRIVATE CONVERSATION</small></span><button className="cc-dm-block" onClick={() => toggleMemberBlock(activeDm)}>{blockedMembers.includes(activeDm.id) ? 'UNBLOCK' : 'BLOCK'}</button></header><div className="cc-chat-messages cc-dm-messages" aria-live="polite">{activeDmMessages.map(message => <article className={message.sender_id === session.user.id ? 'cc-chat-message is-own' : 'cc-chat-message'} key={message.id}><span className="cc-chat-avatar">{(message.sender_id === session.user.id ? profile?.display_name : activeDm.display_name)?.slice(0,1).toUpperCase() || 'M'}</span><div><header><strong>{message.sender_id === session.user.id ? 'You' : activeDm.display_name}</strong><small>{dateLabel(message.created_at)}</small></header><p>{message.body}</p>{message.sender_id !== session.user.id && <button className="cc-message-report" onClick={() => { setReportingMessage(message); setMessageReportReason('') }}><Flag size={11}/> REPORT MESSAGE</button>}</div></article>)}{!activeDmMessages.length && <div className="cc-chat-empty"><MessageCircle size={24}/><strong>Start a conversation.</strong><span>Your messages here are visible only to you and {activeDm.display_name}.</span></div>}</div>{blockedMembers.includes(activeDm.id) ? <p className="cc-chat-locked">You blocked this member. Unblock them to send another message.</p> : suspended ? <p className="cc-chat-locked">Messaging is disabled while your account is suspended.</p> : <form className="cc-chat-compose" onSubmit={sendDirectMessage}><textarea value={dmDraft} onChange={e => setDmDraft(e.target.value)} rows={2} maxLength={2000} placeholder={`Write privately to ${activeDm.display_name}…`} required/><div><small>{dmDraft.length}/2000 · Private between two members.</small><button className="cc-primary" disabled={busy || !dmDraft.trim()}>{busy ? 'SENDING…' : 'SEND PRIVATELY'} <Send size={14}/></button></div></form>}</> : <div className="cc-dm-no-selection"><MessageCircle size={28}/><strong>Select a conversation</strong><span>Or open the Members register and choose Message on a member profile.</span><button className="cc-primary" onClick={() => setTab('members')}>OPEN MEMBER REGISTER <Users size={14}/></button></div>}</section></div></>}
      {tab === 'members' && <><div className="cc-heading"><div><p className="cc-kicker">THE REGISTER / 02</p><h1>The <em>register.</em></h1><p>Every identity is recorded. Every member is accountable for their conduct.</p></div><strong className="cc-count">{members.length.toString().padStart(2,'0')}<small>MEMBERS</small></strong></div><div className="cc-member-tools"><label className="cc-search cc-member-search"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, skill, interest or location"/></label><select value={memberSort} onChange={e => setMemberSort(e.target.value as 'newest' | 'name')} aria-label="Sort members"><option value="newest">NEWEST MEMBERS</option><option value="name">NAME A–Z</option></select></div><div className="cc-members">{filteredMembers.map(m => <article key={m.id}><i>{m.avatar_url ? <img src={m.avatar_url} alt={`${m.display_name} avatar`} loading="lazy"/> : m.display_name.slice(0,1).toUpperCase()}</i><div><strong>{m.display_name}</strong><span>@{m.username}</span><small>MEMBER · JOINED {new Date(m.created_at).toLocaleDateString()}{m.location ? ` · ${m.location}` : ''}</small>{m.bio && <p>{m.bio}</p>}{!!m.skills?.length && <div className="cc-member-tags">{m.skills.map(skill => <button key={skill} onClick={() => setSearch(skill)}>{skill}</button>)}</div>}{!!m.interests?.length && <small className="cc-member-interests">INTERESTS · {m.interests.join(' / ')}</small>}{m.website_url && <a className="cc-member-site" href={m.website_url} target="_blank" rel="noreferrer">WEBSITE <ExternalLink size={11}/></a>}<button className="cc-member-message" disabled={m.id === session.user.id} onClick={() => openDirectMessage(m)}><MessageCircle size={13}/> MESSAGE</button></div></article>)}{!filteredMembers.length && <div className="cc-empty">No members match this search.</div>}</div></>}
      {tab === 'notifications' && <><div className="cc-heading"><div><p className="cc-kicker">ACTIVITY / MEMBER ALERTS</p><h1>Your <em>notifications.</em></h1><p>Private messages and responses to your dispatches appear here.</p></div><div className="cc-chat-live"><Bell size={13}/> {unreadNotificationCount} UNREAD</div></div><div className="cc-notification-toolbar"><span>{notifications.length} RECENT ALERTS</span><button onClick={markNotificationsRead} disabled={!unreadNotificationCount}>MARK ALL READ <Check size={13}/></button></div><div className="cc-notification-list">{notifications.map(item => <button key={item.id} className={!item.read_at ? 'is-unread' : ''} onClick={() => openNotification(item)}><i>{item.kind === 'direct_message' ? <Send size={15}/> : <MessageCircle size={15}/>}</i><span><strong>{item.title}</strong><small>{item.body}</small><time>{dateLabel(item.created_at)}</time></span>{!item.read_at && <b>NEW</b>}</button>)}{!notifications.length && <div className="cc-empty">No notifications yet. New messages and responses will appear here.</div>}</div></>}
      {tab === 'events' && <><div className="cc-heading"><div><p className="cc-kicker">NETWORK CALENDAR / 04</p><h1>Upcoming <em>events.</em></h1><p>Member briefings, meetups and scheduled community sessions.</p></div><CalendarDays size={34}/></div>{moderator && <form className="cc-composer cc-feature-form" onSubmit={createEvent}><p className="cc-kicker">COUNCIL / PUBLISH EVENT</p><label>EVENT TITLE<input value={eventTitle} onChange={e => setEventTitle(e.target.value)} maxLength={120} required/></label><label>DATE AND TIME<input type="datetime-local" value={eventStartsAt} onChange={e => setEventStartsAt(e.target.value)} required/></label><label>LOCATION<input value={eventLocation} onChange={e => setEventLocation(e.target.value)} maxLength={160} placeholder="Online or venue"/></label><label>DETAILS<textarea value={eventDescription} onChange={e => setEventDescription(e.target.value)} maxLength={3000} rows={3}/></label><button className="cc-primary">PUBLISH EVENT <CalendarDays size={14}/></button></form>}<div className="cc-event-list">{events.filter(event => new Date(event.starts_at).getTime() >= Date.now() - 86400000).map(event => <article key={event.id}><div className="cc-event-date"><strong>{new Date(event.starts_at).toLocaleDateString(undefined,{day:'2-digit'})}</strong><small>{new Date(event.starts_at).toLocaleDateString(undefined,{month:'short',year:'numeric'})}</small></div><div><p className="cc-kicker">{new Date(event.starts_at).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})} · {event.location}</p><h2>{event.title}</h2>{event.description && <p>{event.description}</p>}</div>{moderator && <button className="cc-icon-button" onClick={() => removeEvent(event.id)} aria-label="Delete event"><X size={15}/></button>}</article>)}{!events.some(event => new Date(event.starts_at).getTime() >= Date.now() - 86400000) && <div className="cc-empty">No upcoming events are scheduled.</div>}</div></>}
      {tab === 'library' && <><div className="cc-heading"><div><p className="cc-kicker">REFERENCE DESK / 05</p><h1>Resource <em>library.</em></h1><p>Useful documents, guides, policies and external references for members.</p></div><LibraryBig size={34}/></div>{moderator && <form className="cc-composer cc-feature-form" onSubmit={createResource}><p className="cc-kicker">COUNCIL / ADD RESOURCE</p><label>RESOURCE TITLE<input value={resourceTitle} onChange={e => setResourceTitle(e.target.value)} maxLength={120} required/></label><label>SECURE HTTPS URL<input type="url" value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} placeholder="https://…" required/></label><label>CLASSIFICATION<select value={resourceCategory} onChange={e => setResourceCategory(e.target.value)}><option value="REFERENCE">REFERENCE</option><option value="DOCUMENT">DOCUMENT</option><option value="GUIDE">GUIDE</option><option value="POLICY">POLICY</option></select></label><label>DESCRIPTION<textarea value={resourceDescription} onChange={e => setResourceDescription(e.target.value)} maxLength={1000} rows={3}/></label><button className="cc-primary">ADD TO LIBRARY <Plus size={14}/></button></form>}<div className="cc-resource-list">{resources.map(resource => <article key={resource.id}><i><LibraryBig size={18}/></i><div><p className="cc-kicker">{resource.category} · ADDED {new Date(resource.created_at).toLocaleDateString()}</p><h2>{resource.title}</h2>{resource.description && <p>{resource.description}</p>}<a href={resource.url} target="_blank" rel="noreferrer">OPEN RESOURCE <ExternalLink size={13}/></a></div>{moderator && <button className="cc-icon-button" onClick={() => removeResource(resource.id)} aria-label="Remove resource"><X size={15}/></button>}</article>)}{!resources.length && <div className="cc-empty">The library is empty. Council members can add the first reference.</div>}</div></>}
      {tab === 'profile' && <><div className="cc-heading"><div><p className="cc-kicker">IDENTITY RECORD / 03</p><h1>Your <em>record.</em></h1><p>Keep your public identity accurate. Your actions remain your responsibility.</p></div></div><div className="cc-profile-session"><div><strong>SESSION SECURITY</strong><small>End your current session on this device or revoke all active sessions.</small></div><button type="button" onClick={async () => { if (!supabase || !confirm('Sign out of Sectorx83 on every device?')) return; const { error: signOutError } = await supabase.auth.signOut({ scope: 'global' }); if (signOutError) setError(signOutError.message) }}>SIGN OUT ALL DEVICES <Lock size={13}/></button></div><form className="cc-composer cc-profile" onSubmit={saveProfile}><div className="cc-profile-preview">{profileAvatar ? <img src={profileAvatar} alt="Profile preview"/> : <i>{displayName.slice(0,1).toUpperCase() || 'M'}</i>}<span><strong>{displayName || 'Your name'}</strong><small>@{profile?.username || 'member'} · PUBLIC MEMBER PROFILE</small></span></div><label>DISPLAY NAME<input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={48} required/></label><label>AVATAR IMAGE URL<input type="url" value={profileAvatar} onChange={e => setProfileAvatar(e.target.value)} placeholder="https://…"/></label><label>LOCATION<input value={profileLocation} onChange={e => setProfileLocation(e.target.value)} maxLength={80} placeholder="City or region (optional)"/></label><label>WEBSITE URL<input type="url" value={profileWebsite} onChange={e => setProfileWebsite(e.target.value)} placeholder="https://…"/></label><label>ABOUT YOU<textarea rows={4} maxLength={240} value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="A short introduction (optional)"/></label><label>SKILLS <small>COMMA-SEPARATED · UP TO 12</small><input value={profileSkills} onChange={e => setProfileSkills(e.target.value)} placeholder="TypeScript, design, research"/></label><label>INTERESTS <small>COMMA-SEPARATED · UP TO 12</small><input value={profileInterests} onChange={e => setProfileInterests(e.target.value)} placeholder="Technology, history, science"/></label><button className="cc-primary">SAVE PROFILE <Check size={15}/></button></form></>}
      {tab === 'admin' && !moderator && <div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>Command <em>desk.</em></h1><p>Restricted authority. Your verified role does not grant permission to enter this command level.</p></div><Lock size={34}/></div>}
      {tab === 'admin' && moderator && <><div className="cc-heading"><div><p className="cc-kicker">RESTRICTED ACCESS / 05</p><h1>The <em>council.</em></h1><p>Review violations. Govern access. Preserve the integrity of the network. Every exercise of authority must be justified.</p><p className="cc-admin-identity">AUTHENTICATED AS {session.user.email || 'VERIFIED ADMINISTRATOR'} · {role.toUpperCase()}</p></div><Themis large/></div><div className="cc-admin-toolbar"><span>COMMAND STATUS / {rolesLoading ? 'SYNCING DIRECTORY' : 'LIVE SESSION'}</span><button onClick={refreshAdminPanel} disabled={adminRefreshing}>{adminRefreshing ? 'REFRESHING…' : 'REFRESH COMMAND DATA'} <Activity size={14}/></button></div>{roleLoadError && <div className="cc-alert is-error">Role directory unavailable: {roleLoadError}</div>}{rolesLoading && <div className="cc-muted">Synchronising member privileges…</div>}<div className="cc-admin-stats"><div><strong>{members.length}</strong><small>MEMBERS</small></div><div><strong>{posts.length}</strong><small>POSTS</small></div><div><strong>{reports.filter(r => r.status === 'open').length}</strong><small>OPEN REPORTS</small></div><div><strong>{banned.length}</strong><small>SUSPENDED</small></div></div>
        <section className="cc-admin-section"><h2>Cases awaiting judgment</h2>{reports.length ? reports.map(r => <article key={r.id}><div><small>{r.status.toUpperCase()} · @{r.reporter?.username || 'member'}</small><strong>{r.post?.title || 'Reported comment'}</strong><p>{r.reason}</p></div><div><button onClick={() => reviewReport(r.id,'reviewed')}>REVIEWED</button><button onClick={() => reviewReport(r.id,'resolved')}>RESOLVE</button></div></article>) : <p className="cc-muted">No reports are waiting for review.</p>}</section>
        <section className="cc-admin-section"><h2>Access and rank</h2>{members.map(m => { const matchedRole = roles.find(x => x.id === m.id); const r = matchedRole?.role || 'member'; return <article key={m.id}><div><strong>{m.display_name}</strong><small>@{m.username} · {matchedRole?.email || 'EMAIL NOT RETURNED'} · {banned.includes(m.id) ? 'SUSPENDED' : 'ACTIVE'}</small></div><div className="cc-admin-controls"><select value={r} disabled={!admin || rolesLoading || !!roleLoadError || m.id === session.user.id} onChange={e => changeRole(m.id,e.target.value)}><option value="member">MEMBER</option><option value="moderator">MODERATOR</option><option value="admin">ADMIN</option></select>{banned.includes(m.id) ? <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,false)}>UNBAN</button> : <button disabled={!admin || m.id === session.user.id} onClick={() => banMember(m.id,true)}><Ban size={13}/> BAN</button>}</div></article>})}</section>
        <section className="cc-admin-section"><h2>Private message reports</h2>{messageReports.length ? messageReports.map(report => <article key={report.id}><div><small>{report.status.toUpperCase()} · @{report.reporter?.username || 'member'}</small><strong>{report.message?.body || 'Message unavailable'}</strong><p>{report.reason}</p></div><div><button onClick={() => reviewMessageReport(report.id,'reviewed')}>REVIEWED</button><button onClick={() => reviewMessageReport(report.id,'resolved')}>RESOLVE</button></div></article>) : <p className="cc-muted">No private message reports are waiting for review.</p>}</section>
        <section className="cc-admin-section"><h2>Moderation audit trail</h2>{auditLog.length ? <div className="cc-audit-list">{auditLog.map(entry => <article key={entry.id}><span>{entry.action.replace(/_/g,' ').toUpperCase()}</span><strong>{entry.details}</strong><time>{dateLabel(entry.created_at)}</time></article>)}</div> : <p className="cc-muted">No moderation actions have been recorded yet.</p>}</section>
        <section className="cc-admin-section"><h2>Security status</h2><div className="cc-security-grid"><article><Lock size={18}/><strong>TLS in transit</strong><small>Connections are protected in transit.</small></article><article><ShieldCheck size={18}/><strong>Encrypted database</strong><small>Managed storage encryption at rest.</small></article></div></section>
      </>}
      <footer className="cc-main-footer">SECTORX83 / VERIFIED NETWORK <span>QUESTION · PROVE · BUILD</span></footer>
    </section></div>
    <nav className="cc-bottom-nav" aria-label="Main navigation">{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} aria-current={tab === item.id ? 'page' : undefined} onClick={() => { setTab(item.id); setSelected(null); if (item.id !== 'messages') setActiveDm(null); setError(''); setNotice('') }}><Icon size={18}/><span>{item.id === 'messages' ? 'Inbox' : item.id === 'notifications' ? 'Alerts' : item.id === 'events' ? 'Events' : item.id === 'library' ? 'Library' : item.id === 'admin' ? 'Council' : item.id === 'profile' ? 'Profile' : item.id === 'members' ? 'Members' : item.id === 'chat' ? 'Chat' : 'Feed'}</span>{item.id === 'messages' && unreadMessageCount > 0 && <b className="cc-nav-count">{unreadMessageCount > 99 ? '99+' : unreadMessageCount}</b>}{item.id === 'notifications' && unreadNotificationCount > 0 && <b className="cc-nav-count">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</b>}</button> })}</nav>
    {tourStep !== null && <div className="cc-tour-scrim"><section className="cc-tour-card" role="dialog" aria-modal="true" aria-labelledby="cc-tour-title"><div className="cc-tour-top"><span>SECTORX83 / FIRST VISIT</span><button onClick={finishTour} aria-label="Close tour"><X size={16}/></button></div><div className="cc-tour-progress">{tourSteps.map((_,i)=><i key={i} className={i <= tourStep ? 'is-active' : ''}/>)}</div><p className="cc-kicker">GUIDED INTRODUCTION · 0{tourStep + 1} / 0{tourSteps.length}</p><span className="cc-tour-target">{tourSteps[tourStep].target}</span><h2 id="cc-tour-title">{tourSteps[tourStep].title}</h2><p>{tourSteps[tourStep].body}</p><div className="cc-tour-actions"><button className="cc-tour-skip" onClick={finishTour}>SKIP TOUR</button><div>{tourStep > 0 && <button className="cc-tour-back" onClick={() => setTourStep(step => step === null ? null : Math.max(0,step-1))}><ChevronLeft size={14}/> BACK</button>}<button className="cc-primary" onClick={() => tourStep === tourSteps.length - 1 ? finishTour() : setTourStep(step => step === null ? null : Math.min(tourSteps.length-1,step+1))}>{tourStep === tourSteps.length - 1 ? 'FINISH' : 'NEXT'} <ChevronRight size={14}/></button></div></div></section></div>}
    {editingPost && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setEditingPost(null) }}><form className="cc-thread cc-edit-thread" onSubmit={savePostEdit}><header>EDIT DISPATCH <button type="button" onClick={() => setEditingPost(null)}><X size={17}/></button></header><label>SUBJECT<input value={editTitle} onChange={e => setEditTitle(e.target.value)} maxLength={120} required/></label><label>YOUR CONTRIBUTION<textarea value={editBody} onChange={e => setEditBody(e.target.value)} rows={8} maxLength={10000} required/></label><button className="cc-primary" disabled={!editTitle.trim() || !editBody.trim()}>SAVE CHANGES <Check size={14}/></button></form></div>}
    {selected && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}><section className="cc-thread"><header>DISPATCH RECORD <button onClick={() => setSelected(null)}><X size={17}/></button></header><h2>{selected.title}</h2><p>{selected.body}</p><h3>{comments.length} RESPONSES</h3>{comments.map(c => <article key={c.id}><strong>{c.author?.display_name || 'Member'} <small>@{c.author?.username}</small></strong><p>{c.body}</p><time>{dateLabel(c.created_at)}</time></article>)}{!suspended && <form onSubmit={addComment}><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add evidence. Challenge the argument. Keep it precise." rows={3} required/><button className="cc-primary">POST RESPONSE <MessageCircle size={14}/></button></form>}</section></div>}
    {reportingMessage && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setReportingMessage(null) }}><section className="cc-thread"><header>NETWORK INTEGRITY / PRIVATE MESSAGE REPORT <button onClick={() => setReportingMessage(null)}><X size={17}/></button></header><h2>Report private message</h2><p>{reportingMessage.body}</p><textarea rows={4} value={messageReportReason} onChange={e => setMessageReportReason(e.target.value)} placeholder="Explain why this message requires moderator attention."/><button className="cc-primary" disabled={messageReportReason.trim().length < 5} onClick={submitMessageReport}>SUBMIT REPORT <Flag size={14}/></button></section></div>}
    {reporting && <div className="cc-overlay" onClick={e => { if (e.target === e.currentTarget) setReporting(null) }}><section className="cc-thread"><header>NETWORK INTEGRITY / REPORT <button onClick={() => setReporting(null)}><X size={17}/></button></header><h2>Report discussion</h2><p>{reporting.title}</p><textarea rows={4} value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Explain what needs moderator attention."/><button className="cc-primary" onClick={submitReport}>SUBMIT REPORT <Flag size={14}/></button></section></div>}
  </main>
}
