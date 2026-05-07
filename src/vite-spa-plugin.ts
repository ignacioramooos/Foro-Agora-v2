// SPA routing plugin for Vite dev server
export default {
  name: 'spa-router',
  configureServer(server: any) {
    return () => {
      server.middlewares.use((req: any, res: any, next: any) => {
        // Skip if it's an API or has a file extension
        if (req.url.includes('/api') || /\.\w+$/.test(req.url) || req.url.includes('__vite')) {
          return next();
        }
        
        // Rewrite all other requests to index.html so React Router handles them
        req.url = '/index.html';
        next();
      });
    };
  }
};
