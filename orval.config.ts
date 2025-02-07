import { defineConfig } from 'orval';

export default defineConfig({
  'files-storage': {
    input: './generated-swagger.json',
    output: {
      mode: 'tags-split',
      target: './packages/rest-client/src/generated',
      schemas: './packages/rest-client/src/generated/model',
      client: 'react-query',
    },
  },
});
