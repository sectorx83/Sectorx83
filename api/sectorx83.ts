import { createHmac, timingSafeEqual } from 'node:crypto'

type Req = { method?: string; headers: { cookie?: string }; body?: unknown }
type Res = { status(n: number): Res; setHeader(k: string, v: string): void; json(v: unknown): void }

const COOKIE = 'sx83_session'
const AGE = 43200
const sign = (exp: string, key: string) => createHmac('sha256', key).update('sx83:' + exp).digest('hex')
const workspace = {
  service: 'SECTORX83 Independent Research Workspace',
  scope: 'Lawful open-source research using public records, primary documents and transparent analysis.',
  access: 'restricted'
}

export default function handler(req: Req, res: Res) {
  const key = process.env.SECTORX83_SOCIETY_PASSWORD
  if (!key) return res.status(503).json({ error: 'Access system is not configured.' })

  if (req.method === 'POST') {
    let body: { password?: string } = {}
    try {
      body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}) as { password?: string }
    } catch {
      return res.status(400).json({ error: 'Invalid request body.' })
    }
    const supplied = Buffer.from(typeof body.password === 'string' ? body.password : '')
    const expected = Buffer.from(key)
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return res.status(401).json({ error: 'Invalid credential.' })
    }
    const exp = String(Math.floor(Date.now() / 1000) + AGE)
    const token = exp + '.' + sign(exp, key)
    res.setHeader('Set-Cookie', COOKIE + '=' + token + '; HttpOnly; Secure; SameSite=Strict; Path=/api/sectorx83; Max-Age=' + AGE)
    return res.status(200).json(workspace)
  }

  if (req.method === 'GET') {
    const token = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1) || ''
    const [exp = '', sig = ''] = token.split('.')
    const expected = sign(exp, key)
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    const valid = /^\\d+$/.test(exp) && Number(exp) >= Date.now() / 1000 && a.length === b.length && timingSafeEqual(a, b)
    return valid ? res.status(200).json(workspace) : res.status(401).json({ error: 'Authentication required.' })
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', COOKIE + '=; HttpOnly; Secure; SameSite=Strict; Path=/api/sectorx83; Max-Age=0')
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed.' })
}
