const { db } = require("@vercel/postgres");
require("dotenv").config();

async function seedProfessors(client) {
  try {
    await client.sql`CREATE TABLE IF NOT EXISTS PROFESSORS (
        id SERIAL PRIMARY KEY,
        professor_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        school VARCHAR(255) NOT NULL,
        would_take_again VARCHAR(255) NOT NULL,
        difficulty_level VARCHAR(255) NOT NULL,
        summary TEXT,
        pros TEXT,
        cons TEXT,
        recommendation TEXT,
        email VARCHAR(255)
    )`;
  } catch (error) {
    console.log(error);
  }

  console.log("Table created");
}

async function main() {
  const client = await db.connect();

  await seedProfessors(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
