import { createServer } from 'vite';

// Dev server middleware for SPA routing
export default {
  configResolved(config) {
    if (config.command === 'serve') {
      // This is handled by Vite internally with middlewareMode
    }
  },
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // If it's not a file (doesn't have an extension), serve index.html
        if (!req.url.includes('.')) {
          req.url = '/index.html';
        }
        next();
      });
    };
  }
};
