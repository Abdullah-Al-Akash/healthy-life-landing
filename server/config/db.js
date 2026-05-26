const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

let db;
let client;

const createDefaultUsers = async (database) => {
  try {
    const usersCollection = database.collection('users');
    
    // ডেভেলপার চেক
    if (process.env.DEVELOPER_EMAIL && process.env.DEVELOPER_PASSWORD) {
      const developerExists = await usersCollection.findOne({ email: process.env.DEVELOPER_EMAIL });
      if (!developerExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.DEVELOPER_PASSWORD, salt);
        
        await usersCollection.insertOne({
          name: 'Developer',
          email: process.env.DEVELOPER_EMAIL,
          password: hashedPassword,
          role: 'developer',
          isHidden: true,
          permissions: ['*'],
          createdAt: new Date(),
        });
        console.log('✅ Developer user created');
      }
    }
    
    // সুপার এডমিন চেক
    if (process.env.SUPER_ADMIN_EMAIL && process.env.SUPER_ADMIN_PASSWORD) {
      const superAdminExists = await usersCollection.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
      if (!superAdminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);
        
        await usersCollection.insertOne({
          name: 'Super Admin',
          email: process.env.SUPER_ADMIN_EMAIL,
          password: hashedPassword,
          role: 'super_admin',
          isHidden: false,
          permissions: ['*'],
          createdAt: new Date(),
        });
        console.log('✅ Super Admin user created');
      }
    }
  } catch (error) {
    console.error('❌ Error creating default users:', error.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined');
    }
    
    console.log('🔌 Connecting to MongoDB...');
    console.log('MongoDB URI exists:', !!mongoUri);
    
    client = new MongoClient(mongoUri, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });
    
    await client.connect();
    console.log('✅ MongoDB Client connected');
    
    // ডাটাবেস নির্বাচন
    const dbName = process.env.DB_NAME || 'herbalcare';
    db = client.db(dbName);
    
    console.log(`✅ Using database: ${dbName}`);
    
    // ডিফল্ট ইউজার তৈরি
    await createDefaultUsers(db);
    
    // টেস্ট কুয়েরি
    await db.command({ ping: 1 });
    console.log('✅ MongoDB ping successful');
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
};

module.exports = { connectDB, getDB, closeDB };