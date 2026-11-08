import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, BookOpen, Building2, ChevronRight, Database, FileSearch, Globe2, LogOut, LockKeyhole, Network, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react'

type Source = { name: string; publisher: string; url: string; kind: string; note: string }
type CaseFile = { id: string; title: string; area: string; status: string; summary: string; scope: string[]; sources: string[]; confidence: string }

const sources: Source[] = [
  { name: 'SEC EDGAR', publisher: 'U.S. Securities and Exchange Commission', url: 'https://www.sec.gov/edgar/search/', kind: 'Regulatory filings', note: 'Company filings, ownership disclosures, annual reports and material events for SEC-reporting entities.' },
  { name: 'Companies House', publisher: 'UK Government', url: 'https://find-and-update.company-information.service.gov.uk/', kind: 'Corporate registry', note: 'UK company records, officers, filing histories and accounts. Registry filings are not independently verified in every respect.' },
  { name: 'OpenCorporates', publisher: 'OpenCorporates', url: 'https://opencorporates.com/', kind: 'Company data', note: 'Cross-jurisdiction company records sourced from official registers. Treat as an index and verify against the originating registry.' },
  { name: 'FEC data', publisher: 'U.S. Federal Election Commission', url: 'https://www.fec.gov/data/', kind: 'Political finance', note: 'Federal campaign finance data, committees, receipts, disbursements and reported contributors.' },
  { name: 'Lobbying Disclosure', publisher: 'U.S. Senate', url: 'https://lda.senate.gov/', kind: 'Lobbying records', note: 'Federal lobbying registrations and activity reports filed under U.S. disclosure law.' },
  { name: 'USAspending.gov', publisher: 'U.S. Government', url: 'https://www.usaspending.gov/', kind: 'Public spending', note: 'Federal awards, contracts, grants, recipients and spending records.' },
  { name: 'OCCRP Aleph', publisher: 'Organized Crime and Corruption Reporting Project', url: 'https://aleph.occrp.org/', kind: 'Investigative records', note: 'Searchable investigative datasets and documents. Some collections require an application or approved access.' },
  { name: 'GIJN research guides', publisher: 'Global Investigative Journalism Network', url: 'https://gijn.org/resource/researching-corporations-and-their-owners/', kind: 'Research methodology', note: 'Practical guidance for researching corporate ownership, public records, litigation, lobbying and government contracts.' },
  { name: 'World Bank StAR', publisher: 'World Bank / UNODC', url: 'https://star.worldbank.org/', kind: 'Beneficial ownership', note: 'Guidance and resources on asset recovery, beneficial ownership and financial transparency.' },
  { name: 'RBI Database', publisher: 'Reserve Bank of India', url: 'https://data.rbi.org.in/', kind: 'Financial data', note: 'Official Indian banking, monetary and financial statistics.' },
  { name: 'SEBI', publisher: 'Securities and Exchange Board of India', url: 'https://www.sebi.gov.in/', kind: 'Market regulation', note: 'Indian securities regulation, circulars, enforcement orders and market disclosures.' },
  { name: 'CAG Reports', publisher: 'Comptroller and Auditor General of India', url: 'https://cag.gov.in/en/audit-report', kind: 'Public audit', note: 'Audit reports examining public expenditure, programmes and government entities in India.' },
]

const cases: CaseFile[] = [
  { id: 'SX-001', title: 'Rothschild family: documented history and institutions', area: 'Historical finance', status: 'RESEARCH FRAMEWORK', summary: 'A source-led examination of the family’s documented banking history, philanthropic institutions, archival records and present-day entities. The project does not presume a single coordinated family organisation or infer control from a surname.', scope: ['Trace historical banking houses through dated archival and corporate records.', 'Separate branches, generations, trusts, foundations and independently managed entities.', 'Verify present-day roles through current filings and institutional disclosures.', 'Record disputed claims as claims, never as established facts without evidence.'], sources: ['GIJN research guides', 'OpenCorporates', 'Companies House', 'OCCRP Aleph'] , confidence: 'No substantive finding published yet' },
  { id: 'SX-002', title: 'Rockefeller family: foundations, business history and public influence', area: 'Philanthropy & institutions', status: 'RESEARCH FRAMEWORK', summary: 'A documented review of historical business interests, family philanthropy, foundations, archives and public institutional roles. A foundation grant, board position or historical association is not by itself evidence of improper influence.', scope: ['Use foundation annual reports and official archive collections for historical claims.', 'Map grants and board roles only where published records support the connection.', 'Distinguish family members from organisations that have separate governance.', 'Include counter-evidence and the limits of available records.'], sources: ['GIJN research guides', 'SEC EDGAR', 'OpenCorporates'] , confidence: 'No substantive finding published yet' },
  { id: 'SX-003', title: 'Corporate ownership and beneficial control', area: 'Corporate power', status: 'OPEN RESEARCH TRACK', summary: 'A comparative research track for tracing companies, directors, shareholders and beneficial owners through registries and regulatory filings. Registry data can be incomplete or self-reported, so each important relationship requires corroboration.', scope: ['Identify the legal entity and jurisdiction before drawing connections.', 'Trace directors, shareholders and beneficial owners to original filings.', 'Record ownership percentages, dates and source limitations.', 'Do not treat shared addresses, names or indirect associations as proof of control.'], sources: ['SEC EDGAR', 'Companies House', 'OpenCorporates', 'World Bank StAR'], confidence: 'Method established; entity-specific findings require review' },
  { id: 'SX-004', title: 'Political finance, lobbying and public procurement', area: 'Government influence', status: 'OPEN RESEARCH TRACK', summary: 'A records-based framework for examining disclosed political contributions, lobbying activity, public contracts and grants. The data is jurisdiction-specific and does not establish a quid pro quo on its own.', scope: ['Compare disclosures with the applicable reporting period and legal definitions.', 'Link awards and lobbying reports to the original filing or contract record.', 'Distinguish reported contributions from independent expenditures and other flows.', 'Require separate evidence before alleging a conflict, favour or causal influence.'], sources: ['FEC data', 'Lobbying Disclosure', 'USAspending.gov', 'CAG Reports'], confidence: 'Method established; jurisdiction-specific analysis pending' },
  { id: 'SX-005', title: 'Financial institutions and systemic concentration', area: 'Financial systems', status: 'OPEN RESEARCH TRACK', summary: 'A framework for analysing market concentration, institutional interconnections, regulatory oversight and systemic risk using official statistical and regulatory publications.', scope: ['Use regulator and central-bank data with clear reporting dates.', 'Distinguish assets, market capitalisation, deposits, credit exposure and ownership.', 'Document the metric and denominator behind every comparison.', 'Avoid treating size or interconnectedness as proof of secret coordination.'], sources: ['RBI Database', 'SEBI', 'SEC EDGAR'], confidence: 'Method established; data collection required' },
  { id: 'SX-006', title: 'Surveillance, privacy and information governance', area: 'Technology & rights', status: 'OPEN RESEARCH TRACK', summary: 'An examination of laws, oversight mechanisms, procurement, published technical capabilities and documented privacy impacts. Claims about specific surveillance activity require attributable evidence.', scope: ['Start with statutes, court judgments, oversight reports and procurement records.', 'Separate legal authority, technical capability and demonstrated deployment.', 'Record affected populations and jurisdictional limits carefully.', 'Do not publish private personal data or operationally sensitive details.'], sources: ['CAG Reports', 'GIJN research guides'], confidence: 'Method established; country-specific sources required' },
]

const tabs = [
  { id: 'overview', label: 'Command overview', icon: Activity },
  { id: 'files', label: 'Investigation files', icon: FileSearch },
  { id: 'registry', label: 'Influence registry', icon: Network },
  { id: 'sources', label: 'Source library', icon: Database },
  { id: 'doctrine', label: 'Research doctrine', icon: ShieldCheck },
] as const
type Tab = typeof tabs[number]['id']

export default function Society() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(cases[0].id)
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    fetch('/api/sectorx83').then(r => { if (r.ok) setAuthenticated(true) }).catch(() => {}).finally(() => setSessionReady(true))
  }, [])

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const r = await fetch('/api/sectorx83', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (!r.ok) throw new Error('Access denied')
      setAuthenticated(true); setPassword('')
    } catch { setError('ACCESS DENIED / CREDENTIAL NOT RECOGNISED') }
    finally { setBusy(false) }
  }
  async function logout() {
    await fetch('/api/sectorx83', { method: 'DELETE' }).catch(() => {})
    setAuthenticated(false); setTab('overview')
  }

  const filteredCases = useMemo(() => cases.filter(item => [item.id,item.title,item.area,item.summary].join(' ').toLowerCase().includes(query.toLowerCase())), [query])
  const filteredSources = useMemo(() => sources.filter(item => (sourceFilter === 'ALL' || item.kind === sourceFilter) && [item.name,item.publisher,item.note,item.kind].join(' ').toLowerCase().includes(query.toLowerCase())), [query, sourceFilter])
  const activeCase = cases.find(item => item.id === selected) || cases[0]
  const categories = ['ALL', ...Array.from(new Set(sources.map(item => item.kind)))]

  if (!sessionReady) return <main className="sx-shell sx-loading"><span className="sx-kicker">SECTORX83 / SECURE RESEARCH WORKSPACE</span><div className="sx-loader-line"/></main>
  if (!authenticated) return <main className="sx-shell sx-auth">
    <div className="sx-auth-grid"/>
    <header className="sx-topline"><a href="/">SECTORX83 <span>/ INDEPENDENT RESEARCH</span></a><span>PUBLIC SITE / PRIVATE WORKSPACE</span></header>
    <section className="sx-auth-panel">
      <div className="sx-insignia"><span>SX</span><b>83</b></div>
      <p className="sx-kicker">RESTRICTED RESEARCH WORKSPACE</p>
      <h1>POWER MUST<br/><i>REMAIN OPEN</i><br/>TO QUESTION.</h1>
      <p className="sx-auth-copy">An independent research workspace examining institutions, concentrated power, financial systems and networks of influence through verifiable records.</p>
      <form className="sx-login" onSubmit={login}>
        <label htmlFor="sx-password">ACCESS CREDENTIAL</label>
        <div><LockKeyhole size={16}/><input id="sx-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter workspace credential" required/><button disabled={busy||!password}>{busy?'CHECKING':'AUTHENTICATE ↗'}</button></div>
        {error && <p className="sx-error">{error}</p>}
      </form>
      <p className="sx-auth-foot">INDEPENDENT PROJECT · NOT A GOVERNMENT AGENCY · NO CLAIM OF CLASSIFIED ACCESS</p>
    </section>
  </main>

  return <main className="sx-shell">
    <div className="sx-grid-bg"/>
    <header className="sx-header">
      <a className="sx-brand" href="/"><span className="sx-brand-mark">SX<span>83</span></span><span>SECTORX83<small>INDEPENDENT RESEARCH DIRECTORATE</small></span></a>
      <div className="sx-header-meta"><span><i/> WORKSPACE ACTIVE</span><span>OPEN-SOURCE RESEARCH / OSINT</span><button onClick={logout}><LogOut size={14}/> EXIT</button></div>
    </header>
    <div className="sx-layout">
      <aside className="sx-sidebar">
        <div className="sx-side-label">WORKSPACE NAVIGATION</div>
        {tabs.map(item => { const Icon=item.icon; return <button key={item.id} className={tab===item.id?'sx-nav-item is-active':'sx-nav-item'} onClick={()=>{setTab(item.id);setQuery('')}}><Icon size={16}/><span>{item.label}</span><ChevronRight size={13}/></button> })}
        <div className="sx-side-card"><span className="sx-side-label">RESEARCH STANDARD</span><strong>Evidence before inference.</strong><p>Every material claim must lead back to a traceable source.</p><span className="sx-side-status"><i/> SOURCE-LED WORKFLOW</span></div>
        <div className="sx-side-bottom">NODE / WEB-01<br/>SESSION / PRIVATE<br/>CLASSIFICATION / PUBLIC RECORDS</div>
      </aside>
      <section className="sx-content">
        <div className="sx-breadcrumb"><span>SECTORX83</span><b>/</b><strong>{tabs.find(t=>t.id===tab)?.label.toUpperCase()}</strong><span className="sx-breadcrumb-right">INDEPENDENT · NON-STATE · NON-PARTISAN</span></div>
        {tab==='overview' && <>
          <div className="sx-page-heading"><div><p className="sx-kicker">RESEARCH DIRECTORATE / 00</p><h1>Power, examined.</h1><p>Investigate institutions. Follow documented relationships. Preserve the record.</p></div><div className="sx-seal-large">SX<span>83</span><small>RESEARCH / VERIFY / ARCHIVE</small></div></div>
          <div className="sx-principle-banner"><span>CORE DIRECTIVE</span><strong>POWER MUST REMAIN OPEN TO QUESTION.</strong><p>We investigate systems of influence using public records, primary documents and transparent methods. We do not invent access, facts or conclusions.</p></div>
          <div className="sx-metric-grid"><article><span>RESEARCH FILES</span><strong>06</strong><small>Frameworks and open tracks</small></article><article><span>REFERENCE SOURCES</span><strong>12</strong><small>Official and specialist resources</small></article><article><span>METHOD</span><strong>OSINT</strong><small>Lawful open-source research</small></article><article><span>HEADQUARTERS</span><strong>UNDECLARED</strong><small>No physical facility claimed</small></article></div>
          <div className="sx-section-head"><div><span className="sx-kicker">01 / PRIORITY INVESTIGATIONS</span><h2>Research tracks</h2></div><button onClick={()=>setTab('files')}>OPEN ALL FILES <ArrowUpRight size={14}/></button></div>
          <div className="sx-feature-grid">{cases.slice(0,3).map(item=><button className="sx-feature" key={item.id} onClick={()=>{setSelected(item.id);setTab('files')}}><span>{item.id} / {item.area.toUpperCase()}</span><strong>{item.title}</strong><p>{item.summary}</p><em>{item.status} <ArrowUpRight size={13}/></em></button>)}</div>
          <div className="sx-section-head"><div><span className="sx-kicker">02 / VERIFIED RESEARCH INFRASTRUCTURE</span><h2>Source network</h2></div><button onClick={()=>setTab('sources')}>BROWSE LIBRARY <ArrowUpRight size={14}/></button></div>
          <div className="sx-source-strip">{sources.slice(0,6).map(s=><a key={s.name} href={s.url} target="_blank" rel="noreferrer"><span>{s.kind}</span><strong>{s.name}</strong><ArrowUpRight size={13}/></a>)}</div>
          <div className="sx-notice"><ShieldCheck size={17}/><p><strong>Scope and integrity notice.</strong> SECTORX83 is an independent research project, not a registered intelligence service, government body or law-enforcement organisation. This workspace currently contains research frameworks and curated source links, not a claim of completed investigations or live intelligence feeds.</p></div>
        </>}
        {tab==='files' && <><div className="sx-page-heading sx-page-heading--compact"><div><p className="sx-kicker">RESEARCH DIVISION / 01</p><h1>Investigation files.</h1><p>Documented scope, research questions, evidence standards and open work.</p></div></div><div className="sx-workbench"><div className="sx-file-list"><div className="sx-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search case files..."/></div>{filteredCases.map(item=><button key={item.id} className={selected===item.id?'sx-file-row is-selected':'sx-file-row'} onClick={()=>setSelected(item.id)}><span>{item.id}</span><strong>{item.title}</strong><small>{item.area} · {item.status}</small><ChevronRight size={15}/></button>)}{filteredCases.length===0&&<p className="sx-empty">No files match this search.</p>}</div><article className="sx-case-detail"><div className="sx-case-top"><span>{activeCase.id} / CASE RECORD</span><span className="sx-status">{activeCase.status}</span></div><p className="sx-kicker">{activeCase.area.toUpperCase()}</p><h2>{activeCase.title}</h2><p className="sx-case-summary">{activeCase.summary}</p><h3>RESEARCH SCOPE</h3><ul>{activeCase.scope.map((s,i)=><li key={s}><span>0{i+1}</span>{s}</li>)}</ul><div className="sx-confidence"><span>ASSESSMENT</span><strong>{activeCase.confidence}</strong></div><h3>RELEVANT SOURCE REGISTRY</h3><div className="sx-case-sources">{activeCase.sources.map(name=>{const s=sources.find(x=>x.name===name);return s?<a key={name} href={s.url} target="_blank" rel="noreferrer">{name}<ArrowUpRight size={13}/></a>:null})}</div><p className="sx-case-foot">REVIEW STATE: FRAMEWORK ONLY · NO UNSOURCED FINDINGS PUBLISHED</p></article></div></>}
        {tab==='registry' && <><div className="sx-page-heading sx-page-heading--compact"><div><p className="sx-kicker">ENTITY RESEARCH / 02</p><h1>Influence registry.</h1><p>A structured way to map institutions and relationships without implying guilt or coordination.</p></div></div><div className="sx-registry-intro"><Network size={22}/><div><strong>No fabricated connection graphs.</strong><p>Relationships are added only when a dated source supports the exact link. This registry currently defines the entity classes to research; it does not claim that any unverified links exist.</p></div></div><div className="sx-registry-grid">{[{n:'01',t:'Individuals & families',d:'Documented biographies, public roles, archival records, disclosed interests and sourced relationships.'},{n:'02',t:'Companies & ownership',d:'Legal entities, subsidiaries, directors, shareholders and beneficial ownership disclosures.'},{n:'03',t:'Government institutions',d:'Departments, regulators, public agencies, oversight bodies and published decisions.'},{n:'04',t:'Financial institutions',d:'Banks, asset managers, insurers, central banks and systemic-risk disclosures.'},{n:'05',t:'Foundations & NGOs',d:'Governance, annual reports, grants, board memberships and public filings.'},{n:'06',t:'Lobbying & procurement',d:'Disclosed lobbying, public contracts, grants, tenders and reported political finance.'}].map(x=><article key={x.n}><span>{x.n}</span><h3>{x.t}</h3><p>{x.d}</p><small>ENTITY CLASS / RESEARCH TEMPLATE</small></article>)}</div><div className="sx-notice"><ShieldCheck size={17}/><p><strong>Relationship rule.</strong> Shared names, family ties, board overlap, donations or business relationships do not independently prove control, collusion or wrongdoing. Each edge needs its own source, date and context.</p></div></>}
        {tab==='sources' && <><div className="sx-page-heading sx-page-heading--compact"><div><p className="sx-kicker">REFERENCE ARCHIVE / 03</p><h1>Source library.</h1><p>Start with the original record. Secondary research is context, not a substitute.</p></div></div><div className="sx-search sx-source-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search publishers, records or topics..."/><SlidersHorizontal size={15}/></div><div className="sx-filter-row">{categories.map(c=><button key={c} className={sourceFilter===c?'is-active':''} onClick={()=>setSourceFilter(c)}>{c}</button>)}</div><div className="sx-source-list">{filteredSources.map((s,i)=><a key={s.name} className="sx-source-item" href={s.url} target="_blank" rel="noreferrer"><span className="sx-source-number">0{i+1}</span><span className="sx-source-main"><small>{s.publisher} · {s.kind}</small><strong>{s.name}</strong><em>{s.note}</em></span><ArrowUpRight size={16}/></a>)}{filteredSources.length===0&&<p className="sx-empty">No sources match this search.</p>}</div><p className="sx-source-disclaimer">External resources are operated by their respective publishers. Access, coverage, update frequency and licensing vary. Verify important records at the originating authority.</p></>}
        {tab==='doctrine' && <><div className="sx-page-heading sx-page-heading--compact"><div><p className="sx-kicker">FOUNDATION / 04</p><h1>Research doctrine.</h1><p>Rules that govern what is collected, what is published and what is left unclaimed.</p></div></div><div className="sx-doctrine-list">{[{n:'01',t:'Primary sources first',d:'Prefer original filings, legislation, court judgments, official statistics, archives and first-party documents. Secondary reporting provides context and leads.'},{n:'02',t:'Evidence is not implication',d:'A connection is not proof of coordination. A donation is not proof of a favour. A family relationship is not proof of shared control.'},{n:'03',t:'Trace every material claim',d:'Record publisher, title, publication date, access date, exact URL, relevant passage and the specific proposition the source supports.'},{n:'04',t:'Separate fact from analysis',d:'Label verified facts, attributed claims, interpretation, uncertainty and unanswered questions distinctly.'},{n:'05',t:'Show limitations and conflicts',d:'Record missing records, self-reported data, incomplete coverage, contradictory evidence and alternative explanations.'},{n:'06',t:'Protect people and privacy',d:'Use lawful public-interest research. Do not publish private addresses, credentials, sensitive personal data or instructions that enable harm.'},{n:'07',t:'Correct the record',d:'Keep a revision history. Correct material errors transparently and preserve the original context where necessary.'}].map(x=><article key={x.n}><span>{x.n}</span><div><h3>{x.t}</h3><p>{x.d}</p></div><ShieldCheck size={17}/></article>)}</div><div className="sx-doctrine-footer"><BookOpen size={18}/><p>Methodology is informed by investigative research guidance from the Global Investigative Journalism Network and public-sector beneficial ownership guidance from the World Bank / UNODC StAR initiative.</p></div></>}
        <footer className="sx-footer"><span>SECTORX83 / INDEPENDENT RESEARCH</span><span>PUBLIC RECORDS · OPEN SOURCES · TRACEABLE CLAIMS</span><span>© {new Date().getFullYear()}</span></footer>
      </section>
    </div>
  </main>
}
