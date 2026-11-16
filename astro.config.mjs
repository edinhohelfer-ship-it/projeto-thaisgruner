// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://thaisgruner.com.br',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      // Páginas fora do sitemap automático: consultoria (só por link direto), obrigado e páginas internas
      filter: (page) =>
        !['/consultoria', '/obrigado-consultoria', '/obrigado-mentoria', '/design-sistema', '/em-breve']
          .some((rota) => new URL(page).pathname.replace(/\/$/, '') === rota),
    }),
  ],
  adapter: vercel()
});
