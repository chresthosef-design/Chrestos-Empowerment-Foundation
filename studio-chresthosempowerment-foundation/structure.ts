import type {StructureResolver} from 'sanity/structure'

// One-off documents: the client edits these in place and cannot create duplicates.
const singletons = [
  {id: 'teenStar', type: 'teenStar', title: 'The Next Teen Star (winner)'},
  {id: 'testimonial', type: 'testimonial', title: 'Testimonial'},
  {id: 'contactInfo', type: 'contactInfo', title: 'Contact info'},
]

const orderedList = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{field: 'order', direction: 'asc'}]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      ...singletons.map((s) =>
        S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.type).documentId(s.id)),
      ),
      S.divider(),
      orderedList(S, 'teamMember', 'Team members'),
      orderedList(S, 'partner', 'Partners'),
      orderedList(S, 'galleryImage', 'Gallery'),
      orderedList(S, 'outreach', 'Outreach videos'),
      orderedList(S, 'funFact', 'Fun facts'),
    ])

export const singletonTypes = singletons.map((s) => s.type)
