// Script to remove duplicate classifications from database
const pool = require("./database/")

async function removeDuplicates() {
    try {
        console.log("Removing duplicate classifications...\n")

        // Delete duplicates, keeping only the one with the lowest classification_id
        const result = await pool.query(
            `DELETE FROM public.classification 
             WHERE classification_id NOT IN (
                 SELECT MIN(classification_id) 
                 FROM public.classification 
                 GROUP BY classification_name
             )
             RETURNING classification_id, classification_name`
        )

        console.log(`✅ Removed ${result.rows.length} duplicate records:`)
        console.table(result.rows)

        console.log("\nRemaining classifications:")
        const remaining = await pool.query(
            `SELECT classification_id, classification_name 
             FROM public.classification 
             ORDER BY classification_name`
        )
        console.table(remaining.rows)

        console.log("\n✅ Database cleaned successfully!")
        process.exit(0)
    } catch (error) {
        console.error("❌ Error removing duplicates:", error)
        process.exit(1)
    }
}

removeDuplicates()
