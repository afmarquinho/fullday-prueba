import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sin caché incremental por ahora: el catálogo es estático y /api/cotizar calcula en cada pedido.
export default defineCloudflareConfig();
