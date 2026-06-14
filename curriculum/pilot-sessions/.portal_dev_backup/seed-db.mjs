import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Load sessions from the parsed JSON file
const sessionsJsonPath = '/home/ubuntu/wrh_consolidation/sessions.json';
const sessionDataRaw = JSON.parse(fs.readFileSync(sessionsJsonPath, 'utf8'));

const arcData = [
  { num: 1, title: "Arc 1: The Machine", description: "How It Gets Built Into You — Understanding the mechanisms of trauma encoding and the nervous system patterns that drive behavior." },
  { num: 2, title: "Arc 2: The Drivers", description: "What Keeps the Engine Running — Exploring the psychological and behavioral drivers that maintain the pattern and the beliefs that sustain it." },
  { num: 3, title: "Arc 3: The Interrupt & Restore", description: "How You Rewrite the Code — Learning concrete tools to interrupt patterns, restore executive function, and rebuild agency." },
];

const resourceData = [
  {
    type: "checklist",
    title: "Facilitator Readiness Checklist",
    content: fs.readFileSync('/home/ubuntu/wrh_consolidation/WRH-Pilot-Deployment-Package/checklists/Facilitator_Readiness_Checklist.md', 'utf8')
  },
  {
    type: "glossary",
    title: "WRH Glossary",
    content: fs.readFileSync('/home/ubuntu/wrh_consolidation/WRH-Pilot-Deployment-Package/manual/WRH_Glossary.md', 'utf8')
  },
  {
    type: "plan_b",
    title: "Plan B Wallet Card",
    content: fs.readFileSync('/home/ubuntu/wrh_consolidation/WRH-Pilot-Deployment-Package/assets/Plan_B_Wallet_Card.md', 'utf8')
  },
  {
    type: "capability_statement",
    title: "Capability Statement",
    content: fs.readFileSync('/home/ubuntu/wrh_consolidation/WRH-Pilot-Deployment-Package/legal/Capability_Statement.md', 'utf8')
  }
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected to database.');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM sessions');
    await connection.execute('DELETE FROM arcs');
    await connection.execute('DELETE FROM resources');
    await connection.execute('DELETE FROM grants');

    // Seed Arcs
    console.log('Seeding arcs...');
    for (const arc of arcData) {
      await connection.execute(
        'INSERT INTO arcs (arcNumber, arcTitle, description) VALUES (?, ?, ?)',
        [arc.num, arc.title, arc.description]
      );
    }

    // Get Arc IDs
    const [arcs] = await connection.execute('SELECT id, arcNumber FROM arcs');
    const arcMap = {};
    arcs.forEach(a => arcMap[a.arcNumber] = a.id);

    // Seed Sessions
    console.log('Seeding sessions...');
    for (const s of sessionDataRaw) {
      await connection.execute(
        'INSERT INTO sessions (sessionNumber, sessionTitle, arcId, sessionGoal, anchor, hookEpisode, mechanism, mirror, shiftCliffhanger) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          s.sessionNumber, 
          s.sessionTitle, 
          arcMap[s.arcId], 
          s.sessionGoal, 
          s.anchor, 
          s.hookEpisode, 
          s.mechanism, 
          s.mirror, 
          s.shiftCliffhanger
        ]
      );
    }

    // Seed Resources
    console.log('Seeding resources...');
    for (const res of resourceData) {
      await connection.execute(
        'INSERT INTO resources (resourceType, title, content) VALUES (?, ?, ?)',
        [res.type, res.title, res.content]
      );
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();
