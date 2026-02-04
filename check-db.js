// Quick script to check database for duplicate classifications
const pool = require("./database/")

async function checkDatabase() {
    try {
        console.log("Checking for duplicate classifications...\n")

        // Check for duplicates
        const duplicates = await pool.query(
            `SELECT classification_name, COUNT(*) as count
             FROM public.classification
             GROUP BY classification_name
             HAVING COUNT(*) > 1`
        )

        if (duplicates.rows.length > 0) {
            console.log("❌ DUPLICATES FOUND:")
            console.table(duplicates.rows)
        } else {
            console.log("✅ No duplicates found")
        }

        console.log("\nAll classifications in database:")
        const all = await pool.query(
            `SELECT classification_id, classification_name 
             FROM public.classification 
             ORDER BY classification_name, classification_id`
        )
        console.table(all.rows)

        process.exit(0)
    } catch (error) {
        console.error("Error checking database:", error)
        process.exit(1)
    }
}

checkDatabase()
