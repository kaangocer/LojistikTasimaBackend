import pool from "./db.js";

const resetVehicleTypes = async () => {
  try {
    console.log("🗑 vehicle_types tablosu siliniyor...");

    await pool.query(`
      DROP TABLE IF EXISTS vehicle_types CASCADE;
    `);

    console.log("vehicle_types yeniden oluşturuluyor...");

    await pool.query(`
      CREATE TABLE vehicle_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        name_tr VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Seed verileri ekleniyor...");

    const types = [
      { name: "AUTOMOBILE", name_tr: "Otomobil" },
      { name: "TRUCK", name_tr: "Kamyon" },
      { name: "VAN", name_tr: "Van" },
      { name: "MINIBUS", name_tr: "Minibüs" },
      { name: "PICKUP", name_tr: "Pickup" },
    ];

    for (const t of types) {
      await pool.query(
        `
        INSERT INTO vehicle_types (name, name_tr)
        VALUES ($1, $2);
        `,
        [t.name, t.name_tr]
      );
    }

    console.log("✅ vehicle_types tamamen resetlendi ve seed edildi");
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    process.exit();
  }
};

resetVehicleTypes();