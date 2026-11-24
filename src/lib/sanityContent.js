import { createClient } from '@sanity/client';
import * as homeData from '../data/homeData';
import { mapContent, applyContent } from './mapContent';

const client = createClient({
  projectId: '1bo0kk7l',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
});

// If an image was uploaded in the Studio use its URL, otherwise keep the existing /assets path.
const img = 'coalesce(image.asset->url, legacyImage)';

const person = (type) => `*[_type == "${type}"] | order(order asc) {
  _id, name, role, pattern, isCutout, isLogo, externalUrl, bio, "image": ${img}
}`;

const QUERY = `{
  "teamMembers": ${person('teamMember')},
  "partners": ${person('partner')},
  "gallery": *[_type == "galleryImage"] | order(order asc) { _id, alt, "image": ${img} },
  "outreaches": *[_type == "outreach"] | order(order asc) { _id, video },
  "funFacts": *[_type == "funFact"] | order(order asc) { prefix, stat, label },
  "teenStar": *[_id == "teenStar"][0] { name, title, role, alt, "image": ${img} },
  "testimonial": *[_id == "testimonial"][0] { quote, author, role, rating, "image": ${img} },
  "contact": *[_id == "contactInfo"][0] { address, email, phones, whatsapp, website, copyright }
}`;

const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('Sanity request timed out')), ms))]);

/**
 * Loads content from Sanity and writes it over the defaults in homeData.js.
 * Never throws: if Sanity is slow or unreachable, the site keeps the built-in content.
 */
export async function loadSanityContent(timeoutMs = 4000) {
  try {
    const raw = await withTimeout(client.fetch(QUERY), timeoutMs);
    applyContent(homeData, mapContent(raw, homeData));
  } catch (err) {
    console.warn('Using built-in content (Sanity unavailable):', err.message);
  }
}
