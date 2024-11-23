const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const app = express();
app.use(cors());

// Database connection setup
const pool = new Pool({
    user: 'hbodnar',
    host: '/cloudsql/policy-posse-gt-v01:us-central1:policy-database-v1',
    database: 'PolicyPosse-DB',
    password: 'hiphop',
    port: 5432,
});

// Serve static HTML file at the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint for states
app.get("/api/us_states", async (req, res) => {
    try {
        const cachedStates = cache.get("states");
        if (cachedStates) {
            console.log("Serving states from cache...");
            return res.json({ states: cachedStates });
        }

        // Fetch states data
        console.log("Fetching states from database...");
        const client = await pool.connect();
        const statesData = await client.query('SELECT statefp, stusps, name, state_party, ST_AsGeoJSON(geometry) AS geometry FROM us_states;');
        client.release();

        cache.set("states", statesData.rows);
        res.json({ states: statesData.rows });
    } catch (error) {
        console.error("Error during processing:", error);
        res.status(500).json({ error: error.message});
    }
});

// Endpoint for congressional districts
app.get("/api/congressional_districts", async (req, res) => {
    try {
        const cachedDistricts = cache.get("districts");
        if (cachedDistricts) {
            console.log("Serving districts from cache...");
            return res.json({ districts: cachedDistricts });
        }
        const client = await pool.connect();
        const districtsData = await client.query(
            'SELECT statefp20, cd118fp, office_id, listing_name, website_url, party, district, committee_assignments, ST_AsGeoJSON(ST_Simplify(geometry, 0.001)) AS geometry FROM congressional_districts;'
        )
        client.release();

        cache.set("districts", districtsData.rows);
        res.json({ districts: districtsData.rows });
    } catch (error) {
        console.error("Error during processing districts:", error);
        res.status(500).json({ error: error.message});
    }
});

// Endpoint for congressional members
app.get("/api/congress_members", async (req, res) => {
    try {
        const cachedMembers = cache.get("members");
        if (cachedMembers) {
            console.log("Serving members from cache...");
            return res.json({ members: cachedMembers });
        }
        const client = await pool.connect();
        const membersData = await client.query(
            'SELECT * FROM congress_members;'
        )
        client.release();

        cache.set("members", membersData.rows);
        res.json({ members: membersData.rows });
    } catch (error) {
        console.error("Error during processing members:", error);
        res.status(500).json({ error: error.message});
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
