const { Client } = require("pg");

// Replace with your DB connection string from
// Supabase → Settings → Database → Connection Info
const connectionString =
  "postgresql://postgres:<YOUR_PASSWORD>@<YOUR_HOST>:5432/postgres?sslmode=require";

// Replace with your Clerk details
const jwksUrl =
  "https://merry-bear-49.clerk.accounts.dev/.well-known/jwks.json";
const issuer = "https://merry-bear-49.clerk.accounts.dev";

(async () => {
  const client = new Client({ connectionString });
  try {
    await client.connect();

    console.log("Connected to database, setting Clerk JWT config...");

    // Run outside transaction
    await client.query(
      `ALTER SYSTEM SET "auth.external.clerk.jwks_url" = '${jwksUrl}'`
    );
    await client.query(
      `ALTER SYSTEM SET "auth.external.clerk.issuer" = '${issuer}'`
    );
    await client.query(`SELECT pg_reload_conf()`);

    console.log("✅ Clerk JWT configuration updated successfully.");
  } catch (err) {
    console.error("❌ Error updating Clerk JWT config:", err);
  } finally {
    await client.end();
  }
})();
