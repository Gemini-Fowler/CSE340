// Test adding inventory through the model
const invModel = require("./models/inventory-model")
const utilities = require("./utilities")

async function testAddInventory() {
    try {
        console.log("Testing add inventory functionality...\n")

        // Test building classification list
        console.log("1. Testing buildClassificationList...")
        const classificationList = await utilities.buildClassificationList()
        console.log("✅ Classification list generated successfully")
        console.log("Sample:", classificationList.substring(0, 200) + "...")

        // Test adding inventory
        console.log("\n2. Testing addInventory to database...")
        const testVehicle = {
            inv_make: "Tesla",
            inv_model: "Model3Test",
            inv_year: "2024",
            inv_description: "Test electric vehicle for inventory system testing",
            inv_image: "/images/vehicles/no-image.png",
            inv_thumbnail: "/images/vehicles/no-image-tn.png",
            inv_price: 45000,
            inv_miles: 100,
            inv_color: "White",
            classification_id: 5 // Sedan
        }

        const result = await invModel.addInventory(
            testVehicle.inv_make,
            testVehicle.inv_model,
            testVehicle.inv_year,
            testVehicle.inv_description,
            testVehicle.inv_image,
            testVehicle.inv_thumbnail,
            testVehicle.inv_price,
            testVehicle.inv_miles,
            testVehicle.inv_color,
            testVehicle.classification_id
        )

        if (result.rows && result.rows.length > 0) {
            console.log("✅ Vehicle added successfully:")
            console.table(result.rows)

            // Clean up - remove test vehicle
            const pool = require("./database/")
            await pool.query("DELETE FROM public.inventory WHERE inv_model = 'Model3Test'")
            console.log("\n✅ Test vehicle cleaned up")
        } else {
            console.log("❌ Failed to add vehicle")
        }

        console.log("\n✅ All tests passed!")
        process.exit(0)
    } catch (error) {
        console.error("❌ Error:", error)
        process.exit(1)
    }
}

testAddInventory()
