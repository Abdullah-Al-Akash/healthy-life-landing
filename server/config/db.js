const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGO_URI;
let db;

const createDefaultUsers = async (db) => {
  const usersCollection = db.collection('users');
  
  // ডিফল্ট ইউজার চেক
  const developerExists = await usersCollection.findOne({ email: process.env.DEVELOPER_EMAIL });
  const superAdminExists = await usersCollection.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
  
  // ডেভেলপার তৈরি (হিডেন রোল)
  if (!developerExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.DEVELOPER_PASSWORD, salt);
    
    await usersCollection.insertOne({
      name: 'Developer',
      email: process.env.DEVELOPER_EMAIL,
      password: hashedPassword,
      role: 'developer',
      isHidden: true, // UI তে দেখাবে না
      permissions: ['*'], // সব permissions
      createdAt: new Date(),
    });
    console.log('✅ Developer user created');
  }
  
  // সুপার এডমিন তৈরি
  if (!superAdminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);
    
    await usersCollection.insertOne({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: 'super_admin',
      isHidden: false,
      permissions: ['*'], // সব permissions
      createdAt: new Date(),
    });
    console.log('✅ Super Admin user created');
  }
};

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db('herbalcare');
    
    // ডিফল্ট ইউজার তৈরি
    await createDefaultUsers(db);
    
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports = { connectDB, getDB };