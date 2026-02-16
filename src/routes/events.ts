// Events API Routes for Cloudflare D1

interface Env {
  DB: D1Database;
}

export const eventRoutes = {
  // Get all events
  async getEvents(env: Env): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          e.id,
          e.event_name,
          e.description,
          e.fee,
          e.event_type,
          e.is_mega_event,
          e.department_id,
          d.department_name,
          e.created_at
        FROM events e
        JOIN departments d ON e.department_id = d.id
        ORDER BY e.created_at DESC
      `).all();

      return new Response(
        JSON.stringify({
          success: true,
          data: results || [],
          count: (results || []).length
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching events:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch events',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },

  // Get events by department
  async getEventsByDepartment(env: Env, departmentId: string): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          e.id,
          e.event_name,
          e.description,
          e.fee,
          e.event_type,
          e.is_mega_event,
          e.department_id,
          d.department_name,
          e.created_at
        FROM events e
        JOIN departments d ON e.department_id = d.id
        WHERE e.department_id = ?
        ORDER BY e.event_name ASC
      `).bind(parseInt(departmentId)).all();

      return new Response(
        JSON.stringify({
          success: true,
          data: results || [],
          count: (results || []).length,
          departmentId: parseInt(departmentId)
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching events by department:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch events by department',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },

  // Get mega events only
  async getMegaEvents(env: Env): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          e.id,
          e.event_name,
          e.description,
          e.fee,
          e.event_type,
          e.is_mega_event,
          e.department_id,
          d.department_name,
          e.created_at
        FROM events e
        JOIN departments d ON e.department_id = d.id
        WHERE e.is_mega_event = 1
        ORDER BY e.fee DESC
      `).all();

      return new Response(
        JSON.stringify({
          success: true,
          data: results || [],
          count: (results || []).length,
          type: 'mega_events'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching mega events:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch mega events',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};
