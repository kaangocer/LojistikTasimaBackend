import pool from "../db/db.js";

/* =========================
   VEHICLE TYPES
========================= */

export const getVehicleTypes = async () => {
  const { rows } = await pool.query(`
    SELECT id, name, name_tr
    FROM vehicle_types
    ORDER BY name_tr
  `);

  return rows;
};


/* =========================
   BRANDS BY TYPE
========================= */

export const getBrandsByType = async (vehicleType) => {
  const { rows } = await pool.query(
    `
    SELECT DISTINCT b.brand_code, b.name
    FROM vehicle_type_brands vtb
    JOIN vehicle_types vt ON vt.id = vtb.vehicle_type_id
    JOIN vehicle_brands b ON b.brand_code = vtb.brand_code
    WHERE vt.name = $1
    ORDER BY b.name
    `,
    [vehicleType]
  );

  return rows;
};


/* =========================
   MODELS BY BRAND + TYPE 
========================= */

export const getModelsByBrand = async (brandCode, vehicleType) => {
  const { rows } = await pool.query(
    `
    SELECT vm.model_code, vm.name
    FROM vehicle_models vm
    JOIN vehicle_type_models vtm
      ON vm.model_code = vtm.model_code
    JOIN vehicle_types vt
      ON vt.id = vtm.vehicle_type_id
    WHERE vm.brand_code = $1
      AND vt.name = $2
    ORDER BY vm.name
    `,
    [brandCode, vehicleType]
  );

  return rows;
};


/* =========================
   YEARS BY MODEL
========================= */

export const getYearsByModel = async (modelCode) => {
  const { rows } = await pool.query(
    `
    SELECT year
    FROM vehicle_model_years
    WHERE model_code = $1
    ORDER BY year DESC
    `,
    [modelCode]
  );

  return rows.map(r => r.year);
};
