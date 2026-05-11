import { CollectionConfig } from 'payload/types'

export const Proyectos: CollectionConfig = {
  slug: 'proyectos',
  admin: {
    useAsTitle: 'titulo',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'descripcion',
      type: 'richText',
    },
    {
      name: 'categoria',
      type: 'select',
      options: ['Motion Graphics', 'Flyer Design', 'Branding', 'Video'],
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'videoUrl',
      type: 'text',
    },
    {
      name: 'fecha',
      type: 'date',
    },
  ],
}
