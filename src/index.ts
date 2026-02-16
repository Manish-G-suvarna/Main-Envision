// Cloudflare Workers API Handler
import { eventRoutes } from './routes/events';
import { teamRoutes } from './routes/team';

// Type definitions
interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

// Simple router function
function parseUrl(url: string): { pathname: string; params: Record<string, string> } {
  const urlObj = new URL(url);
  return { pathname: urlObj.pathname, params: {} };
}

// Main fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      const { pathname } = new URL(request.url);
      let response: Response;

      // Route handling
      if (pathname === '/api/health') {
        response = new Response(
          JSON.stringify({
            status: 'Server is running',
            timestamp: new Date(),
            environment: 'production',
            version: '2.0.0 (Cloudflare D1)'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else if (pathname === '/api/events') {
        response = await eventRoutes.getEvents(env);
      } else if (pathname.startsWith('/api/events/')) {
        const departmentId = pathname.split('/')[3];
        response = await eventRoutes.getEventsByDepartment(env, departmentId);
      } else if (pathname === '/api/team') {
        response = await teamRoutes.getTeams(env);
      } else if (pathname === '/api/team/core') {
        response = await teamRoutes.getCoreTeam(env);
      } else {
        response = new Response(
          JSON.stringify({ message: 'Endpoint not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Add CORS headers to response
      const newResponse = new Response(response.body, response);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });

      return newResponse;
    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },
};
