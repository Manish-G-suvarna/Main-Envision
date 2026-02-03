import express from "express";
import db  from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  const query = `
    SELECT 
      core_team.id,
      core_team.name,
      core_team.role,
      core_team.image_url,
      teams.team_name
    FROM core_team
    JOIN teams ON core_team.team_id = teams.id
    ORDER BY teams.team_name, core_team.display_order
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

export default router;
