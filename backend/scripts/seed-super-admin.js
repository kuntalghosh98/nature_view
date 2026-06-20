require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const ROLES = require("../src/constants/roles");
const { createAuditLog } = require("../src/services/audit.service");

async function seedSuperAdmin() {
  await connectDB();

  const name = process.env.SUPER_ADMIN_NAME || "Super Admin";
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) {
    console.log(`Super admin already exists: ${email}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: ROLES.SUPER_ADMIN
  });

  await createAuditLog({
    user: { name: "Seed Script" },
    action: "SEED_SUPER_ADMIN",
    module: "ADMINS",
    entityId: user._id,
    entityTitle: user.email
  });

  console.log(`Super admin created: ${email}`);
  process.exit(0);
}

seedSuperAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
