import pool from "./db.js";

const migrateVehicleData = async () => {
  try {
    console.log("🚀 Vehicle data migration started...");

    // 1 Vehicle Types
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);
    await pool.query(`
  ALTER TABLE vehicle_types
  ADD COLUMN IF NOT EXISTS name_tr VARCHAR(50);
`);

    // 2 Brands
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_brands (
        id SERIAL PRIMARY KEY,
        brand_code INT UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL
      );
    `);

    // 3 Models
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_models (
        id SERIAL PRIMARY KEY,
        model_code INT UNIQUE NOT NULL,
        brand_code INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        CONSTRAINT fk_vehicle_model_brand
          FOREIGN KEY (brand_code)
          REFERENCES vehicle_brands(brand_code)
          ON DELETE CASCADE
      );
    `);

    // 4 Model Years
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_model_years (
        id SERIAL PRIMARY KEY,
        model_code INT NOT NULL,
        year INT NOT NULL,
        CONSTRAINT fk_vehicle_year_model
          FOREIGN KEY (model_code)
          REFERENCES vehicle_models(model_code)
          ON DELETE CASCADE,
        UNIQUE (model_code, year)
      );
    `);

    // 5 Vehicle Type <-> Brand Mapping
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_type_brands (
        id SERIAL PRIMARY KEY,
        vehicle_type_id INT NOT NULL,
        brand_code INT NOT NULL,

        CONSTRAINT fk_vtb_type
          FOREIGN KEY (vehicle_type_id)
          REFERENCES vehicle_types(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_vtb_brand
          FOREIGN KEY (brand_code)
          REFERENCES vehicle_brands(brand_code)
          ON DELETE CASCADE,

        UNIQUE (vehicle_type_id, brand_code)
      );
    `);
        // 6 Vehicle Type <-> Model Mapping 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_type_models (
        id SERIAL PRIMARY KEY,
        vehicle_type_id INT NOT NULL,
        model_code INT NOT NULL,

        CONSTRAINT fk_vtm_type
          FOREIGN KEY (vehicle_type_id)
          REFERENCES vehicle_types(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_vtm_model
          FOREIGN KEY (model_code)
          REFERENCES vehicle_models(model_code)
          ON DELETE CASCADE,

        UNIQUE (vehicle_type_id, model_code)
      );
    `);


    console.log("✅ Vehicle data tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Vehicle data migration failed:", err);
    process.exit(1);
  }
};

migrateVehicleData();
