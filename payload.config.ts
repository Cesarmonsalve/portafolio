import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Media } from './src/collections/Media'
import { Proyectos } from './src/collections/Proyectos'
import { SobreMi } from './src/collections/SobreMi'
import { Arsenal } from './src/collections/Arsenal'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
  },
  collections: [
    Media,
    Proyectos,
    SobreMi,
    Arsenal,
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
  typescript: {
    outputFile: './payload-types.ts',
  },
  graphQL: {
    schemaOutputFile: './graphql/schema.graphql',
  },
  plugins: [],
})
