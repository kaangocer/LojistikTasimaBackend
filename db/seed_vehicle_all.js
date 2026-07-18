import pool from "./db.js";

/* =========================
   VEHICLE TYPES
========================= */

const VEHICLE_TYPES = [
  "AUTOMOBILE",
  "TRUCK",
  "VAN",
  "MINIBUS",
  "PICKUP"
];

/* =========================
   BRANDS
========================= */

const BRANDS = [
  { brand_code: 3, name: "ALFA ROMEO" },
  { brand_code: 8, name: "ASTON MARTIN" },
  { brand_code: 9, name: "AUDI" },
  { brand_code: 18, name: "SAAB" },
  { brand_code: 19, name: "SEAT" },
  { brand_code: 21, name: "BMW" },
  { brand_code: 25, name: "BUICK" },
  { brand_code: 27, name: "BMC" },
  { brand_code: 30, name: "DAEWOO" },
  { brand_code: 31, name: "CADILLAC" },
  { brand_code: 32, name: "CHEVROLET" },
  { brand_code: 33, name: "CHRYSLER" },
  { brand_code: 34, name: "CITROEN" },
  { brand_code: 40, name: "DAF" },
  { brand_code: 43, name: "DAIHATSU" },
  { brand_code: 45, name: "DODGE/USA" },
  { brand_code: 50, name: "FERRARI" },
  { brand_code: 52, name: "FIAT" },
  { brand_code: 53, name: "FORD/OTOSAN" },
  { brand_code: 61, name: "HONDA" },
  { brand_code: 66, name: "ISUZU" }
];

/* =========================
   MODELS (OTOMOBİL)
========================= */

const MODELS = [
  { model_code: 1001, brand_code: 3, name: "GIULIETTA 1.4 TB M.AIR 170 TCT PROG.PLU" },
  { model_code: 1002, brand_code: 3, name: "GIULIETTA 1.4 TB M.AIR 170 TCT DISTINCTIVE" },
  { model_code: 1003, brand_code: 3, name: "GIULIETTA 1.4 TB MULTIAIR (170)" },
  { model_code: 1004, brand_code: 3, name: "MITO 1.3 JTD (95) CITY" },
  { model_code: 1005, brand_code: 3, name: "4C LAUNCH EDITION 1.750 TB 240 TCT" },
  { model_code: 1006, brand_code: 3, name: "159 2.4 DIZEL SPORTSWAGON" }
];

/* =========================
   VEHICLE TYPE <-> MODEL
========================= */

const VEHICLE_TYPE_MODELS = {
  AUTOMOBILE: [
  1001,1002,1003,1004,1005,1006,
  9401,9402,9403,9404,9405,9406,
  9407,9408,9409,9410,9411,9412,
  9413,9414,9415,9416,9417,9418,
  9419,9420,9421,9422,9423,9424,
  9425,9426,9427,9428,9429,9430,
  9431,9432,9433,9434
],

TRUCK: [
  9001,9002,9003,9004,9435
],

VAN: [
  9101,9102,9430
],

MINIBUS: [
  9301,9302,9303,9436
],

PICKUP: [
  9201,9202
]
};


/* =========================
   EK MODELLER
========================= */

const EXTRA_MODELS = [
  // TRUCK
  { model_code: 9001, brand_code: 40, name: "DAF XF 480" },
  { model_code: 9002, brand_code: 27, name: "BMC PRO 827" },

  // VAN
  { model_code: 9101, brand_code: 52, name: "FIAT DUCATO" },
  { model_code: 9102, brand_code: 53, name: "FORD TRANSIT" },

  // PICKUP
  { model_code: 9201, brand_code: 66, name: "ISUZU D-MAX" },
  { model_code: 9202, brand_code: 53, name: "FORD RANGER" },

  // ASTON MARTIN
{ model_code: 9401, brand_code: 8, name: "DB11" },
{ model_code: 9402, brand_code: 8, name: "VANTAGE" },

// AUDI
{ model_code: 9403, brand_code: 9, name: "A3" },
{ model_code: 9404, brand_code: 9, name: "Q5" },

// SAAB
{ model_code: 9405, brand_code: 18, name: "9-3" },
{ model_code: 9406, brand_code: 18, name: "9-5" },

// SEAT
{ model_code: 9407, brand_code: 19, name: "IBIZA" },
{ model_code: 9408, brand_code: 19, name: "LEON" },

// BMW
{ model_code: 9409, brand_code: 21, name: "320I" },
{ model_code: 9410, brand_code: 21, name: "X5" },

// BUICK
{ model_code: 9411, brand_code: 25, name: "ENCORE" },
{ model_code: 9412, brand_code: 25, name: "ENVISION" },

// DAEWOO
{ model_code: 9413, brand_code: 30, name: "MATIZ" },
{ model_code: 9414, brand_code: 30, name: "NEXIA" },

// CADILLAC
{ model_code: 9415, brand_code: 31, name: "ESCALADE" },
{ model_code: 9416, brand_code: 31, name: "XT5" },

// CHEVROLET
{ model_code: 9417, brand_code: 32, name: "CRUZE" },
{ model_code: 9418, brand_code: 32, name: "MALIBU" },

// CHRYSLER
{ model_code: 9419, brand_code: 33, name: "300C" },
{ model_code: 9420, brand_code: 33, name: "PACIFICA" },

// CITROEN
{ model_code: 9421, brand_code: 34, name: "C3" },
{ model_code: 9422, brand_code: 34, name: "C4" },

// DAIHATSU
{ model_code: 9423, brand_code: 43, name: "SIRION" },
{ model_code: 9424, brand_code: 43, name: "TERIOS" },

// DODGE
{ model_code: 9425, brand_code: 45, name: "CHARGER" },
{ model_code: 9426, brand_code: 45, name: "CHALLENGER" },

// FERRARI
{ model_code: 9427, brand_code: 50, name: "488 GTB" },
{ model_code: 9428, brand_code: 50, name: "F8 TRIBUTO" },

// FIAT
{ model_code: 9429, brand_code: 52, name: "EGEA" },
{ model_code: 9430, brand_code: 52, name: "DOBLO" },

// FORD
{ model_code: 9431, brand_code: 53, name: "FOCUS" },
{ model_code: 9432, brand_code: 53, name: "FIESTA" },

// HONDA
{ model_code: 9433, brand_code: 61, name: "CIVIC" },
{ model_code: 9434, brand_code: 61, name: "ACCORD" },

// ISUZU
{ model_code: 9435, brand_code: 66, name: "NPR" },
{ model_code: 9436, brand_code: 66, name: "NOVOCITI" },

{ model_code: 9003, brand_code: 53, name: "FORD CARGO 1833" },
{ model_code: 9004, brand_code: 66, name: "ISUZU NPR HD" },
{ model_code: 9301, brand_code: 53, name: "FORD TRANSIT MINIBUS" },
{ model_code: 9302, brand_code: 27, name: "BMC NEOBUS" },
{ model_code: 9303, brand_code: 66, name: "ISUZU NOVOCITI LIFE" }
];

/* =========================
   MODEL YEARS
========================= */

const MODEL_YEARS = [
  { model_code: 1001, year: 2012 },
  { model_code: 1001, year: 2013 },
  { model_code: 1002, year: 2012 },
  { model_code: 1002, year: 2013 },
  { model_code: 1002, year: 2014 },
  { model_code: 1002, year: 2015 },
  { model_code: 1003, year: 2012 },
  { model_code: 1004, year: 2012 },
  { model_code: 1004, year: 2013 },
  { model_code: 1004, year: 2014 },
  { model_code: 1005, year: 2014 },
  { model_code: 1005, year: 2015 },
  { model_code: 1006, year: 2009 },

  // EK
  { model_code: 9001, year: 2020 },
  { model_code: 9002, year: 2019 },
  { model_code: 9101, year: 2021 },
  { model_code: 9102, year: 2022 },
  { model_code: 9201, year: 2020 },
  { model_code: 9202, year: 2021 },
  { model_code: 9401, year: 2020 },
{ model_code: 9401, year: 2021 },

{ model_code: 9402, year: 2021 },
{ model_code: 9402, year: 2022 },

{ model_code: 9403, year: 2019 },
{ model_code: 9403, year: 2020 },

{ model_code: 9404, year: 2021 },
{ model_code: 9404, year: 2022 },

{ model_code: 9405, year: 2017 },
{ model_code: 9405, year: 2018 },

{ model_code: 9406, year: 2018 },
{ model_code: 9406, year: 2019 },

{ model_code: 9407, year: 2020 },
{ model_code: 9407, year: 2021 },

{ model_code: 9408, year: 2021 },
{ model_code: 9408, year: 2022 },

{ model_code: 9003, year: 2020 },
{ model_code: 9003, year: 2021 },

{ model_code: 9004, year: 2021 },
{ model_code: 9004, year: 2022 },

{ model_code: 9301, year: 2020 },
{ model_code: 9301, year: 2021 },

{ model_code: 9302, year: 2021 },
{ model_code: 9302, year: 2022 },

{ model_code: 9303, year: 2022 },
{ model_code: 9303, year: 2023 }
];

/* =========================
   VEHICLE TYPE <-> BRAND
========================= */

const VEHICLE_TYPE_BRANDS = {
  AUTOMOBILE: [3, 8, 9, 19, 21, 31, 32, 33, 34, 43, 50, 52, 53, 61],
  TRUCK: [27, 40, 53, 66],
  VAN: [52, 53, 66],
  MINIBUS: [27, 53, 66],
  PICKUP: [53, 66]
};




/* =========================
   SEED
========================= */

const seedAllVehicleData = async () => {
  try {
    console.log("🚀 Vehicle full seed started");

    // 1 TYPES
    for (const type of VEHICLE_TYPES) {
      await pool.query(
        `INSERT INTO vehicle_types (name)
         VALUES ($1)
         ON CONFLICT (name) DO NOTHING`,
        [type]
      );
    }

    // 2 BRANDS
    for (const brand of BRANDS) {
      await pool.query(
        `INSERT INTO vehicle_brands (brand_code, name)
         VALUES ($1, $2)
         ON CONFLICT (brand_code) DO NOTHING`,
        [brand.brand_code, brand.name]
      );
    }

    // 3 MODELS
    for (const model of [...MODELS, ...EXTRA_MODELS]) {
      await pool.query(
        `INSERT INTO vehicle_models (model_code, brand_code, name)
         VALUES ($1, $2, $3)
         ON CONFLICT (model_code) DO NOTHING`,
        [model.model_code, model.brand_code, model.name]
      );
    }

    // 4 YEARS
    for (const item of MODEL_YEARS) {
      await pool.query(
        `INSERT INTO vehicle_model_years (model_code, year)
         VALUES ($1, $2)
         ON CONFLICT (model_code, year) DO NOTHING`,
        [item.model_code, item.year]
      );
    }

    // 5 TYPE <-> BRAND
    for (const [typeName, brandCodes] of Object.entries(VEHICLE_TYPE_BRANDS)) {
      const { rows } = await pool.query(
        `SELECT id FROM vehicle_types WHERE name = $1`,
        [typeName]
      );
      if (!rows.length) continue;

      for (const brandCode of brandCodes) {
        await pool.query(
          `INSERT INTO vehicle_type_brands (vehicle_type_id, brand_code)
           VALUES ($1, $2)
           ON CONFLICT (vehicle_type_id, brand_code) DO NOTHING`,
          [rows[0].id, brandCode]
        );
      }
    }
    // 6 TYPE <-> MODEL MAPPING
    for (const [typeName, modelCodes] of Object.entries(VEHICLE_TYPE_MODELS)) {

      const { rows } = await pool.query(
        `SELECT id FROM vehicle_types WHERE name = $1`,
        [typeName]
      );

      if (!rows.length) continue;

      const typeId = rows[0].id;

      for (const modelCode of modelCodes) {
        await pool.query(
          `INSERT INTO vehicle_type_models (vehicle_type_id, model_code)
           VALUES ($1, $2)
           ON CONFLICT (vehicle_type_id, model_code) DO NOTHING`,
          [typeId, modelCode]
        );
      }
    }



    console.log("🎉 ALL VEHICLE DATA SEEDED SUCCESSFULLY");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedAllVehicleData();
