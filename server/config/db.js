const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ─── Log connection attempt for debugging ─────────────────────────────────
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined in .env file');
    }
    
    console.log('🔄 Attempting MongoDB connection...');
    console.log(`   URI (first 60 chars): ${mongoURI.substring(0, 60)}...`);

    // ─── Connection options with error handling ───────────────────────────────
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      // Use Google DNS to avoid resolution issues
      family: 4, // Use IPv4
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    // ─── Diagnostic suggestions ──────────────────────────────────────────────
    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.error('\n⚠️  DIAGNOSIS: DNS/Network issue or IP whitelist problem');
      console.error('   FIX 1: Add your IP to MongoDB Atlas Network Access');
      console.error('   FIX 2: Use 0.0.0.0/0 (allow all IPs) in Network Access');
      console.error('   FIX 3: Switch to Google DNS (8.8.8.8)');
      console.error('   FIX 4: Try fallback connection string (see FALLBACK_MONGO_URI in .env)');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  DIAGNOSIS: Wrong credentials');
      console.error('   FIX: Check username/password in MONGO_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n⚠️  DIAGNOSIS: DNS cannot resolve hostname');
      console.error('   FIX: Update system DNS to 8.8.8.8 and 8.8.4.4');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
