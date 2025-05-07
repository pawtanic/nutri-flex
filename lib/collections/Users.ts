import { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'authJSId',
      type: 'text',
      required: false,
    },
    {
      name: 'roles',
      type: 'select',
      options: ['user', 'admin'],
      defaultValue: 'user',
      required: true,
    },
  ],
};
