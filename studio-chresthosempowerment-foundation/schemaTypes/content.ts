import {defineField, defineType} from 'sanity'

const patterns = ['stripes', 'prisms', 'circles', 'diamonds']

const photoFields = (label = 'Photo') => [
  defineField({
    name: 'image',
    title: `${label} (upload)`,
    type: 'image',
    options: {hotspot: true},
    description: 'Upload a new image here. If this is empty, the existing site image is used.',
  }),
  defineField({
    name: 'legacyImage',
    title: 'Existing image path',
    type: 'string',
    description: 'Leave this alone. It is only used until an image is uploaded above.',
  }),
]

const byOrder = [{name: 'order', title: 'Display order', by: [{field: 'order', direction: 'asc' as const}]}]

const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers show first.',
})

const personType = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
      defineField({name: 'role', type: 'string', description: 'Shown under the name (capital letters are used on the site).'}),
      ...photoFields(),
      defineField({
        name: 'pattern',
        title: 'Background pattern',
        type: 'string',
        options: {list: patterns},
        initialValue: 'stripes',
      }),
      defineField({name: 'isCutout', title: 'Photo is a cutout', type: 'boolean', initialValue: true}),
      defineField({name: 'isLogo', title: 'Image is a logo', type: 'boolean', initialValue: false}),
      defineField({name: 'externalUrl', title: 'Website link', type: 'url'}),
      defineField({
        name: 'bio',
        title: 'Biography (one item per paragraph)',
        type: 'array',
        of: [{type: 'text', rows: 4}],
      }),
      orderField,
    ],
    orderings: byOrder,
    preview: {select: {title: 'name', subtitle: 'role', media: 'image'}},
  })

export const teamMember = personType('teamMember', 'Team member')
export const partner = personType('partner', 'Partner')

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'document',
  fields: [...photoFields('Image'), defineField({name: 'alt', title: 'Description (alt text)', type: 'string'}), orderField],
  orderings: byOrder,
  preview: {select: {title: 'alt', media: 'image'}},
})

export const outreach = defineType({
  name: 'outreach',
  title: 'Outreach video',
  type: 'document',
  fields: [
    defineField({
      name: 'video',
      title: 'YouTube embed link',
      type: 'url',
      description: 'Use the embed form, for example https://www.youtube.com/embed/VIDEO_ID',
      validation: (r) => r.required(),
    }),
    orderField,
  ],
  orderings: byOrder,
  preview: {select: {title: 'video'}},
})

export const funFact = defineType({
  name: 'funFact',
  title: 'Fun fact',
  type: 'document',
  fields: [
    defineField({name: 'prefix', type: 'string', description: 'For example: Over'}),
    defineField({name: 'stat', type: 'string', description: 'For example: 200+'}),
    defineField({name: 'label', type: 'string'}),
    orderField,
  ],
  orderings: byOrder,
  preview: {select: {title: 'stat', subtitle: 'label'}},
})

export const teenStar = defineType({
  name: 'teenStar',
  title: 'The Next Teen Star (winner)',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', description: 'Winner name. Leave empty if not chosen yet.'}),
    defineField({name: 'title', type: 'string', description: 'For example: WINNER TNTS, 2026'}),
    defineField({name: 'role', type: 'string', description: 'Optional alternative to the title.'}),
    ...photoFields('Winner photo'),
    defineField({name: 'alt', title: 'Description (alt text)', type: 'string'}),
  ],
  preview: {select: {title: 'name', subtitle: 'title', media: 'image'}},
})

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'quote', type: 'text', rows: 6}),
    defineField({name: 'author', type: 'string'}),
    defineField({name: 'role', type: 'string'}),
    ...photoFields(),
    defineField({name: 'rating', type: 'number', validation: (r) => r.min(1).max(5)}),
  ],
  preview: {select: {title: 'author', subtitle: 'role', media: 'image'}},
})

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Contact info',
  type: 'document',
  fields: [
    defineField({name: 'address', type: 'text', rows: 3}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'phones', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'whatsapp', title: 'WhatsApp numbers', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'website', type: 'string'}),
    defineField({name: 'copyright', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'Contact info'})},
})

export const allTypes = [teamMember, partner, galleryImage, outreach, funFact, teenStar, testimonial, contactInfo]
