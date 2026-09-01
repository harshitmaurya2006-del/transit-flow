import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db.js";

// Manually load .env.local variables
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && match[1] && match[2]) {
        process.env[match[1]] = match[2];
      }
    });
  }
} catch {
  // Continue if env already populated
}

async function runVerification() {
  console.log("\n🔍 Starting MongoDB Database Connection Verification...\n");

  try {
    const db = await connectToDatabase();
    const state = mongoose.connection.readyState;
    const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    console.log(`📡 Connection Status: ${states[state] || "Unknown"} (Code ${state})`);
    console.log(`🗄️ Database Name: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);

    if (state === 1) {
      // Perform a write test
      const TestSchema = new mongoose.Schema({ test: String, timestamp: Date });
      const TestModel =
        mongoose.models["VerificationTest"] ||
        mongoose.model("VerificationTest", TestSchema);

      const created = await TestModel.create({
        test: "SIH Database Connection Verification",
        timestamp: new Date(),
      });
      console.log(`✅ WRITE TEST: Created document (ID: ${created._id})`);

      // Perform a read test
      const retrieved = await TestModel.findById(created._id);
      console.log(`✅ READ TEST: Retrieved document successfully ("${retrieved?.test}")`);

      // Cleanup
      await TestModel.deleteOne({ _id: created._id });
      console.log(`✅ DELETE TEST: Cleaned up test document`);

      console.log("\n🎉 SUCCESS: Your MongoDB Database is 100% Connected & Functional!\n");
    } else {
      console.error("❌ Database connection is not active.");
    }
  } catch (error) {
    console.error("❌ Connection failed with error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runVerification();
