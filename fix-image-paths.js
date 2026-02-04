// Fix image paths in database to include /vehicles/
const pool = require("./database/")

async function fixImagePaths() {
    try {
        console.log("Updating image paths to include /vehicles/...\n")

        const result = await pool.query(
            `UPDATE public.inventory
             SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
                 inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
             WHERE inv_image NOT LIKE '/images/vehicles/%'
             RETURNING inv_id, inv_make, inv_model, inv_image, inv_thumbnail`
        )

        console.log(`✅ Updated ${result.rows.length} records:\n`)
        console.table(result.rows)

        console.log("\n✅ Image paths fixed successfully!")
        console.log("Refresh your browser to see the images!")

        process.exit(0)
    } catch (error) {
        console.error("❌ Error:", error)
        process.exit(1)
    }
}

fixImagePaths()
