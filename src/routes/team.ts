// Team API Routes for Cloudflare D1

interface Env {
  DB: D1Database;
}

export const teamRoutes = {
  // Get all teams
  async getTeams(env: Env): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          t.id,
          t.team_name,
          t.created_at,
          COUNT(ct.id) as member_count
        FROM teams t
        LEFT JOIN core_team ct ON t.id = ct.team_id
        GROUP BY t.id, t.team_name, t.created_at
        ORDER BY t.id ASC
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
      console.error('Error fetching teams:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch teams',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },

  // Get core team members
  async getCoreTeam(env: Env): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          ct.id,
          ct.name,
          ct.role,
          ct.image_url,
          ct.display_order,
          t.id as team_id,
          t.team_name,
          ct.created_at
        FROM core_team ct
        JOIN teams t ON ct.team_id = t.id
        ORDER BY t.id ASC, ct.display_order ASC
      `).all();

      // Group by team
      const groupedByTeam = (results || []).reduce((acc: any, member: any) => {
        const teamId = member.team_id;
        const teamName = member.team_name;

        if (!acc[teamId]) {
          acc[teamId] = {
            team_id: teamId,
            team_name: teamName,
            members: []
          };
        }

        acc[teamId].members.push({
          id: member.id,
          name: member.name,
          role: member.role,
          image_url: member.image_url,
          display_order: member.display_order
        });

        return acc;
      }, {});

      const formattedData = Object.values(groupedByTeam);

      return new Response(
        JSON.stringify({
          success: true,
          data: formattedData,
          total_members: (results || []).length
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching core team:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch core team',
          error: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  },

  // Get team by ID with members
  async getTeamById(env: Env, teamId: string): Promise<Response> {
    try {
      const { results } = await env.DB.prepare(`
        SELECT
          ct.id,
          ct.name,
          ct.role,
          ct.image_url,
          ct.display_order,
          t.id as team_id,
          t.team_name
        FROM core_team ct
        JOIN teams t ON ct.team_id = t.id
        WHERE t.id = ?
        ORDER BY ct.display_order ASC
      `).bind(parseInt(teamId)).all();

      if (!results || results.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Team not found'
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const team = {
        team_id: results[0].team_id,
        team_name: results[0].team_name,
        members: results.map((member: any) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          image_url: member.image_url,
          display_order: member.display_order
        }))
      };

      return new Response(
        JSON.stringify({
          success: true,
          data: team
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to fetch team',
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
