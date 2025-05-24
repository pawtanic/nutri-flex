// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './lib/collections/Users';
import { Media } from './lib/collections/Media';
import { Exercises } from './lib/collections/Exercises';
import { Workouts } from './lib/collections/Workouts';
import { Recipes } from './lib/collections/Recipes';
import { MealPlans } from './lib/collections/MealPlans';
import { UserProfiles } from './lib/collections/UserProfiles';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // example of custom date format
  // dateFormat: 'YYYY-MM-DD',

  // example of allowed urls to access payload
  cors: ['http://localhost:3000', process.env.NEXT_PUBLIC_PAYLOAD_URL!],
  // example of allowed urls to send cookies
  csrf: ['http://localhost:3000', process.env.NEXT_PUBLIC_PAYLOAD_URL!],
  // example of custom upload limits
  // upload: {
  //   limits: {
  //     fileSize: 1024 * 1024 * 10, // 10MB
  //   },
  // },
  collections: [Users, Media, Exercises, Workouts, Recipes, MealPlans, UserProfiles],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...(defaultFeatures || []), FixedToolbarFeature()],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  hooks: {
    afterError:
      process.env.NODE_ENV !== 'production'
        ? [
            async ({ error, req }) => {
              console.error('Error:', error);
              console.error('Request:', req);
            },
          ]
        : [],
  },
});
