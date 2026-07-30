import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

async function main() {
  try {
    const { runETL } = await import("../etl");

    const filePath = path.resolve(process.cwd(), "input.csv");

    console.log("=====================================");
    console.log(" Procurement ETL");
    console.log("=====================================");
    console.log(`Input : ${filePath}`);
    console.log("");

    const result = await runETL(filePath);

    console.log("ETL Finished");
    console.log("------------------------------");
    console.log(`Total Records : ${result.total}`);
    console.log(`Valid Records : ${result.valid}`);
    console.log(`Invalid       : ${result.invalid}`);
    console.log(`Uploaded      : ${result.load.total}`);

    if (result.errors.length > 0) {
      console.log("");
      console.log("Validation Errors");

      result.errors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.errors.join(", ")}`);
      });
    }

    console.log("");
    console.log("Done.");
  } catch (error) {
    console.error("ETL Failed");
    console.error(error);

    process.exit(1);
  }
}

main();