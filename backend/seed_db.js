import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'envision_db',
    multipleStatements: true // Important for executing dump file
};

async function seedDatabase() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);

        console.log('Dropping existing tables...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DROP TABLE IF EXISTS events');
        await connection.query('DROP TABLE IF EXISTS core_team');
        await connection.query('DROP TABLE IF EXISTS departments');
        await connection.query('DROP TABLE IF EXISTS teams');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Tables dropped.');

        console.log('Reading SQL dump file...');
        const dumpPath = path.join(__dirname, 'envision_db (1).sql');
        const sqlDump = fs.readFileSync(dumpPath, 'utf8');

        console.log('Executing SQL dump...');
        await connection.query(sqlDump);
        console.log('Database restored from dump.');

        console.log('Adding new event: Line Followers...');

        // Fetch Dept ID for 'EEE' (Department 1)
        const [deptRows] = await connection.query('SELECT id FROM departments WHERE department_name = ?', ['EEE']);
        let deptId = 1; // Default to EEE
        if (deptRows.length > 0) {
            deptId = deptRows[0].id;
        } else {
            console.warn("Department 'EEE' not found, using ID 1 fallback.");
        }

        const newEvent = {
            department_id: deptId,
            event_name: 'Line Followers',
            description: 'Build a robot that follows a black line on a white surface. Fastest completion wins.',
            fee: 200.00,
            event_type: 'Technical',
            is_mega_event: 0
        };

        const [result] = await connection.query(
            'INSERT INTO events (department_id, event_name, description, fee, event_type, is_mega_event) VALUES (?, ?, ?, ?, ?, ?)',
            [newEvent.department_id, newEvent.event_name, newEvent.description, newEvent.fee, newEvent.event_type, newEvent.is_mega_event]
        );

        console.log(`Event 'Line Followers' added with ID: ${result.insertId}`);
        console.log('Database seeding completed successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

seedDatabase();
