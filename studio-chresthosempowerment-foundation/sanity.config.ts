import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure, singletonTypes} from './structure'

export default defineConfig({
  name: 'default',
  title: 'chresthosEmpowerment Foundation',

  projectId: '1bo0kk7l',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // stop the client creating duplicate one-off documents
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.includes(schemaType)),
  },
})
