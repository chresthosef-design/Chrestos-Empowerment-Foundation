// Turns the app's src/data/homeData.js into import.ndjson for `sanity dataset import`.
// Usage (from the Studio folder):
//   node scripts/make-import.mjs ../chresthos-empowerment-foundation/src/data/homeData.js import.ndjson
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {pathToFileURL} from 'node:url'

const src = process.argv[2] ?? '../chresthos-empowerment-foundation/src/data/homeData.js'
const out = process.argv[3] ?? 'import.ndjson'

// homeData.js is ESM but the app's package.json may not say "type": "module", so import a .mjs copy.
const tmp = path.join(os.tmpdir(), `homeData-${Date.now()}.mjs`)
fs.copyFileSync(src, tmp)
const d = await import(pathToFileURL(tmp).href)
fs.unlinkSync(tmp)

const docs = []
const clean = (s) => (typeof s === 'string' ? s.trim() : s)
const bioArr = (b) => (Array.isArray(b) ? b.map(clean).filter(Boolean) : b ? [clean(String(b))] : [])

// NOTE: ids use hyphens only. Ids containing a dot are treated as private by Sanity.
const people = (type, list) =>
  list.forEach((p, i) =>
    docs.push({
      _id: `${type}-${p.id}`,
      _type: type,
      name: clean(p.name),
      role: p.role,
      legacyImage: p.image,
      pattern: p.pattern,
      isCutout: !!p.isCutout,
      isLogo: !!p.isLogo,
      ...(p.externalUrl ? {externalUrl: p.externalUrl} : {}),
      bio: bioArr(p.bio),
      order: i + 1,
    }),
  )

people('teamMember', d.TEAM_MEMBERS)
people('partner', d.PARTNERS)

d.GALLERY_IMAGES.forEach((g, i) =>
  docs.push({_id: `galleryImage-${g.id}`, _type: 'galleryImage', legacyImage: g.image, alt: g.alt, order: i + 1}),
)
d.OUTREACHES.forEach((o, i) => docs.push({_id: `outreach-${o.id}`, _type: 'outreach', video: o.video, order: i + 1}))
d.FUN_FACTS.forEach((f, i) =>
  docs.push({_id: `funFact-${i + 1}`, _type: 'funFact', prefix: f.prefix, stat: f.stat, label: f.label, order: i + 1}),
)

const t = d.NEXT_TEEN_STAR
docs.push({
  _id: 'teenStar',
  _type: 'teenStar',
  name: clean(t.name),
  title: clean(t.title),
  role: clean(t.role),
  legacyImage: t.image,
  alt: t.alt,
})

const q = d.TESTIMONIAL
docs.push({
  _id: 'testimonial',
  _type: 'testimonial',
  quote: q.quote,
  author: clean(q.author),
  role: clean(q.role),
  legacyImage: q.image,
  rating: q.rating,
})

const c = d.CONTACT_INFO
docs.push({
  _id: 'contactInfo',
  _type: 'contactInfo',
  address: c.address,
  email: c.email,
  phones: c.phones,
  whatsapp: c.whatsapp,
  website: c.website,
  copyright: c.copyright,
})

fs.writeFileSync(out, docs.map((x) => JSON.stringify(x)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to ${out}`)
