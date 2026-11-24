// Pure mapping from Sanity query results to the shapes used in src/data/homeData.js.
// No imports, so it can be tested without Sanity installed.

const strip = (id = '') => id.replace(/^(teamMember|partner|galleryImage|outreach|funFact)-/, '');
const has = (a) => Array.isArray(a) && a.length > 0;

const person = (p) => ({
  id: strip(p._id),
  name: p.name,
  role: p.role,
  image: p.image,
  pattern: p.pattern,
  ...(p.isCutout ? { isCutout: true } : {}),
  ...(p.isLogo ? { isLogo: true } : {}),
  ...(p.externalUrl ? { externalUrl: p.externalUrl } : {}),
  bio: Array.isArray(p.bio) ? p.bio : [],
});

export function mapContent(raw = {}, fallback = {}) {
  const out = {};

  if (has(raw.teamMembers)) out.TEAM_MEMBERS = raw.teamMembers.map(person);
  if (has(raw.partners)) out.PARTNERS = raw.partners.map(person);

  if (has(raw.gallery)) {
    out.GALLERY_IMAGES = raw.gallery
      .filter((g) => g.image)
      .map((g) => ({ id: strip(g._id), image: g.image, src: g.image, alt: g.alt || 'Chresthos Foundation photo' }));
  }

  if (has(raw.outreaches)) {
    out.OUTREACHES = raw.outreaches.map((o, i) => ({ id: i + 1, video: o.video }));
  }

  if (has(raw.funFacts)) {
    const fb = fallback.FUN_FACTS || [];
    out.FUN_FACTS = raw.funFacts.map((f, i) => ({
      prefix: f.prefix,
      stat: f.stat,
      label: f.label,
      maxW: fb[i]?.maxW ?? 347, // layout value, not editable in the CMS
    }));
  }

  if (raw.teenStar) {
    const t = raw.teenStar;
    out.NEXT_TEEN_STAR = {
      name: t.name || '',
      title: t.title || '',
      role: t.role || '',
      image: t.image || fallback.NEXT_TEEN_STAR?.image,
      alt: t.alt || 'The Next Teen Star',
    };
  }

  if (raw.testimonial) {
    const q = raw.testimonial;
    out.TESTIMONIAL = { quote: q.quote, author: q.author, role: q.role, image: q.image, rating: q.rating ?? 5 };
  }

  if (raw.contact) {
    const c = raw.contact;
    out.CONTACT_INFO = {
      address: c.address,
      email: c.email,
      phones: c.phones || [],
      whatsapp: c.whatsapp || [],
      website: c.website,
      copyright: c.copyright,
    };
  }

  return out;
}

// Mutates the existing exported arrays/objects in place, so components that already
// import them from homeData.js see the new content without any changes.
export function applyContent(target, next) {
  for (const [key, value] of Object.entries(next)) {
    const current = target[key];
    if (Array.isArray(current)) current.splice(0, current.length, ...value);
    else if (current && typeof current === 'object') {
      for (const k of Object.keys(current)) delete current[k];
      Object.assign(current, value);
    }
  }
}
