import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({
  integrations: [
    react(),
    {
      name: 'local-motion-lab',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (command === 'dev') {
            injectRoute({
              pattern: '/handoff-review',
              entrypoint: './src/labs/handoff-review/HandoffReview.astro',
            });
            injectRoute({
              pattern: '/motion-lab',
              entrypoint: './src/labs/system-core/MotionLab.astro',
            });
          }
        },
      },
    },
  ],
  output: 'static',
  devToolbar: { enabled: false },
});
