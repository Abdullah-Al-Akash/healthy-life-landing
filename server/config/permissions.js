// রোল বেজড পারমিশন ডিফাইন
const permissions = {
  developer: {
    routes: ['*'], // সব রাউট
    methods: ['*'], // সব মেথড
  },
  super_admin: {
    routes: ['*'],
    methods: ['*'],
  },
  admin: {
    routes: [
      '/api/products',
      '/api/orders',
      '/api/users',
    ],
    methods: ['GET', 'POST', 'PUT'],
  },
};

// নির্দিষ্ট ইউজারের জন্য কাস্টম পারমিশন সেট করার ফাংশন
const setCustomPermissions = async (userId, customRoutes, customMethods) => {
  const { getDB } = require('./db');
  const db = getDB();
  const { ObjectId } = require('mongodb');
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { 
      $set: { 
        customPermissions: {
          routes: customRoutes,
          methods: customMethods,
        },
        hasCustomPermissions: true,
      } 
    }
  );
};

// পারমিশন চেক ফাংশন
const checkPermission = (user, route, method) => {
  // ডেভেলপার ও সুপার এডমিনের সব পারমিশন
  if (user.role === 'developer' || user.role === 'super_admin') {
    return true;
  }
  
  // কাস্টম পারমিশন থাকলে সেটা চেক
  if (user.hasCustomPermissions) {
    const routeMatch = user.customPermissions.routes.includes('*') || 
                       user.customPermissions.routes.some(r => route.startsWith(r));
    const methodMatch = user.customPermissions.methods.includes('*') || 
                        user.customPermissions.methods.includes(method);
    return routeMatch && methodMatch;
  }
  
  // ডিফল্ট অ্যাডমিন পারমিশন
  const rolePerm = permissions[user.role];
  if (!rolePerm) return false;
  
  const routeMatch = rolePerm.routes.includes('*') || 
                     rolePerm.routes.some(r => route.startsWith(r));
  const methodMatch = rolePerm.methods.includes('*') || 
                      rolePerm.methods.includes(method);
  
  return routeMatch && methodMatch;
};

module.exports = { permissions, checkPermission, setCustomPermissions };