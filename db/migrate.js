// db/migrate.js
import pool from "./db.js";

const migrate = async () => {
  try {
    // 0) extension (gen_random_uuid için)
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    console.log("✅ pgcrypto extension hazır");

    // 1) users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tc_no VARCHAR(11) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password TEXT NOT NULL;
`);
// email kolonu
await pool.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
`);
    console.log("✅ users tablosu oluşturuldu (veya zaten mevcut)");

    // 2) roles tablosu 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_name VARCHAR(50) UNIQUE NOT NULL
      );
    `);
    console.log("✅ roles tablosu oluşturuldu (veya zaten mevcut)");

    // 3) Insert roles 
    await pool.query(`
      INSERT INTO roles (role_name)
      VALUES ('admin'), ('user')
      ON CONFLICT (role_name) DO NOTHING;
    `);
    console.log("✅ roles: admin,user eklendi veya zaten vardı");

    // 4) users.tablosuna role_id ekle (eğer yoksa) — AFTER roles exists
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id) ON DELETE SET NULL;
    `);
    console.log("✅ users.role_id eklendi (ve roles.id ile FK)");

    // 5) vehicles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plate_number VARCHAR(20) UNIQUE NOT NULL,
        vehicle_type VARCHAR(50) NOT NULL,
        capacity_ton NUMERIC,
        has_fuel_card BOOLEAN DEFAULT false,
        brand VARCHAR(50),
        model VARCHAR(50),
        year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ vehicles tablosu oluşturuldu (veya zaten mevcut)");

    // 6) loads
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,

  origin_city TEXT NOT NULL,
  origin_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_address TEXT NOT NULL,

  pickup_time TIMESTAMP WITH TIME ZONE,
  delivery_time TIMESTAMP WITH TIME ZONE,

  price NUMERIC,

  required_vehicle_type TEXT,

  tonnage NUMERIC,              -- ağırlık
  quantity NUMERIC,             -- miktar
  quantity_unit VARCHAR(20),    -- adet | palet | koli | varil
  volume_m3 NUMERIC,            -- hacim (m3)

  fuel_included BOOLEAN DEFAULT false,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
      
    console.log("✅ loads tablosu oluşturuldu (veya zaten mevcut)");

    // 7) offers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        load_id UUID NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
        carrier_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
        offer_price NUMERIC,
        estimated_pickup TIMESTAMP,
        estimated_delivery TIMESTAMP,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (load_id, carrier_id)
      );
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_offers_load_id ON offers(load_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_offers_carrier_id ON offers(carrier_id);`);
    console.log("✅ offers tablosu oluşturuldu (veya zaten mevcut)");

    // users.role kolonunu kaldır (artık role_id kullanıyoruz)
await pool.query(`
  ALTER TABLE users
  DROP COLUMN IF EXISTS role;
`);
console.log("🧹 users.role kolonu kaldırıldı");

    // 8) trips
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
        offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
        carrier_id UUID REFERENCES users(id) ON DELETE SET NULL,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        status TEXT DEFAULT 'accepted',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_load_id ON trips(load_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_carrier_id ON trips(carrier_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);`);
    console.log("✅ trips tablosu oluşturuldu (veya zaten mevcut)");
// 9) notifications
await pool.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT NOW()
  );
`);

await pool.query(`
  CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON notifications(user_id);
`);

console.log("✅ notifications tablosu oluşturuldu (veya zaten mevcut)");
    console.log("🎉 Tüm migrationlar başarılı.");
    process.exitCode = 0;
  } catch (err) {
    console.error("❌ Migration hatası:", err);
    process.exitCode = 1;
  } finally {
    try { await pool.end(); } catch(e){ }
  }
};

migrate();
