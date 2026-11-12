export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = any>(): Promise<D1Result<T>>;
}
export interface D1Result<T> {
  results: T[];
  success: boolean;
  meta: any;
}

export interface Env {
  DB: D1Database;
}

const workerHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path === '/api/health' && request.method === 'GET') {
        return Response.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders });
      }

      if (path === '/api/search' && request.method === 'GET') {
        const q = url.searchParams.get('q');
        if (!q) {
          return Response.json({ error: 'Missing query parameter q' }, { status: 400, headers: corsHeaders });
        }

        const { results } = await env.DB.prepare(
          'SELECT * FROM knowledge_entries WHERE normalized_query = ? OR title = ?'
        ).bind(q.trim().toLowerCase(), q.trim()).all();

        if (results && results.length > 0) {
          return Response.json({ found: true, entry: results[0] }, { headers: corsHeaders });
        }

        return Response.json({ found: false, message: 'Not found in D1 shared database' }, { headers: corsHeaders });
      }

      return Response.json({ error: 'Not Found' }, { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
  },
};

export default workerHandler;
