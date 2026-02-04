// Check what image paths are stored in the database
const pool = require("./database/")

async function checkImagePaths() {
    try {
        console.log("Image paths in database:\n")

        const result = await pool.query(
            `SELECT inv_id, inv_make, inv_model, inv_image, inv_thumbnail 
             FROM public.inventory 
             ORDER BY inv_id
             LIMIT 10`
        )

        console.table(result.rows)

        process.exit(0)
    } catch (error) {
        console.error("Error:", error)
        process.exit(1)
    }
}

checkImagePaths()
