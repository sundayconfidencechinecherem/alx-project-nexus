// backend/scripts/update-users-direct.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function updateUsersDirect() {
  let client;
  
  try {
    console.log('🚀 Starting direct user update...\n');
    
    // Get MongoDB URI from environment
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${users.length} users in the database\n`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      console.log(`👤 Processing: ${user.username || user.email} (${user._id})`);
      
      const updates = {};
      let needsUpdate = false;
      
      // Check isPrivate field
      if (user.isPrivate === undefined || user.isPrivate === null) {
        updates.isPrivate = false;
        needsUpdate = true;
        console.log(`   ➕ Setting isPrivate: false (was: ${user.isPrivate})`);
      }
      
      // Check isVerified field
      if (user.isVerified === undefined || user.isVerified === null) {
        updates.isVerified = false;
        needsUpdate = true;
        console.log(`   ➕ Setting isVerified: false (was: ${user.isVerified})`);
      }
      
      // Check avatar field
      if (!user.avatar || user.avatar === null || user.avatar === undefined) {
        updates.avatar = '/images/avatars/default.png';
        needsUpdate = true;
        console.log(`   ➕ Setting avatar: /images/avatars/default.png (was: ${user.avatar})`);
      }
      
      // Check coverPhoto field
      if (!user.coverPhoto || user.coverPhoto === null || user.coverPhoto === undefined) {
        updates.coverPhoto = '/images/covers/default.jpg';
        needsUpdate = true;
        console.log(`   ➕ Setting coverPhoto: /images/covers/default.jpg (was: ${user.coverPhoto})`);
      }
      
      // Check bio field
      if (user.bio === undefined || user.bio === null) {
        updates.bio = '';
        needsUpdate = true;
        console.log(`   ➕ Setting bio: '' (was: ${user.bio})`);
      }
      
      // Check lastLogin field
      if (!user.lastLogin || user.lastLogin === null || user.lastLogin === undefined) {
        updates.lastLogin = user.createdAt || new Date();
        needsUpdate = true;
        console.log(`   ➕ Setting lastLogin: ${updates.lastLogin} (was: ${user.lastLogin})`);
      }
      
      if (needsUpdate) {
        try {
          const result = await usersCollection.updateOne(
            { _id: user._id },
            { $set: updates }
          );
          
          if (result.modifiedCount > 0) {
            updatedCount++;
            console.log(`   ✅ Updated successfully\n`);
          } else {
            console.log(`   ⚠️  No changes made (maybe already updated)\n`);
          }
        } catch (updateError) {
          console.log(`   ❌ Update failed: ${updateError.message}\n`);
        }
      } else {
        console.log(`   ✓ All fields are OK\n`);
      }
    }
    
    console.log('='.repeat(50));
    console.log('📊 UPDATE SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total users processed: ${users.length}`);
    console.log(`Users updated: ${updatedCount}`);
    console.log(`Users already correct: ${users.length - updatedCount}`);
    console.log('='.repeat(50));
    
    // Verification
    console.log('\n🔍 Verifying updates...\n');
    
    const updatedUsers = await usersCollection.find({}).toArray();
    const problematicUsers = updatedUsers.filter(u => 
      u.isPrivate === undefined || 
      u.isPrivate === null ||
      u.isVerified === undefined ||
      u.isVerified === null ||
      !u.avatar ||
      u.avatar === null
    );
    
    console.log(`Users checked: ${updatedUsers.length}`);
    console.log(`Users still with issues: ${problematicUsers.length}`);
    
    if (problematicUsers.length === 0) {
      console.log('🎉 SUCCESS! All users have been fixed.\n');
    } else {
      console.log('\n⚠️  Users still needing attention:');
      problematicUsers.slice(0, 5).forEach(u => {
        console.log(`\n   ${u.username || u.email}:`);
        console.log(`     isPrivate: ${u.isPrivate}`);
        console.log(`     isVerified: ${u.isVerified}`);
        console.log(`     avatar: ${u.avatar}`);
      });
      
      if (problematicUsers.length > 5) {
        console.log(`\n   ... and ${problematicUsers.length - 5} more`);
      }
    }
    
    // Show sample
    console.log('\n📋 SAMPLE USERS (first 3):\n');
    const sample = updatedUsers.slice(0, 3);
    sample.forEach((user, i) => {
      console.log(`User ${i + 1}: ${user.username || user.email}`);
      console.log(`  isPrivate: ${user.isPrivate} (type: ${typeof user.isPrivate})`);
      console.log(`  isVerified: ${user.isVerified} (type: ${typeof user.isVerified})`);
      console.log(`  avatar: ${user.avatar}`);
      console.log(`  coverPhoto: ${user.coverPhoto}`);
      console.log(`  bio: ${user.bio}`);
      console.log(`  lastLogin: ${user.lastLogin}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 MongoDB connection closed');
    }
  }
}

// Run the update
updateUsersDirect();