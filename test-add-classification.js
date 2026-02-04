// Test adding a classification
const invModel = require("./models/inventory-model")

async function testAddClassification() {
    try {
        console.log("Testing add classification...\n")

        // Test with valid name
        const testName = "TestClass" + Date.now()
        console.log(`Adding classification: ${testName}`)

        const result = await invModel.addClassification(testName)

        if (result.rows && result.rows.length > 0) {
            console.log("✅ Classification added successfully:")
            console.table(result.rows)

            // Get all classifications to verify
            const allClassifications = await invModel.getClassifications()
            console.log("\nAll classifications now:")
            console.table(allClassifications.rows)
        } else {
            console.log("❌ Failed to add classification")
        }

        process.exit(0)
    } catch (error) {
        console.error("❌ Error:", error)
        process.exit(1)
    }
}

testAddClassification()
