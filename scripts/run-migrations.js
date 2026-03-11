// Script to run SQL migrations via Supabase REST API
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://ygkonqhpoorvqqbwiumj.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('Usage: node run-migrations.js <service_role_key>');
  process.exit(1);
}

async function runSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    // Try alternative: use the pg endpoint
    const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!pgResponse.ok) {
      const error = await response.text();
      throw new Error(`SQL execution failed: ${error}`);
    }
    return pgResponse.json();
  }

  return response.json();
}

async function main() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      try {
        await runSQL(sql);
        console.log(`✓ ${file} completed`);
      } catch (error) {
        console.error(`✗ ${file} failed:`, error.message);
        // Continue with next migration
      }
    }
  }
}

main().catch(console.error);
