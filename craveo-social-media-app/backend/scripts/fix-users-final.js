// backend/scripts/fix-users-final.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import the User model from the correct path
const User = require('../src/models/User.model').default;

async function fixUsers() {
  try {
    console.log('🚀 Starting user data fix...\n');
    
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users\n`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        console.log(`👤 Processing: ${user.username} (${user.email})`);
        
        // Convert user to plain object to check fields
        const userObj = user.toObject();
        const updates = {};
        let needsUpdate = false;
        
        // Check each field
        const checks = [
          { field: 'isPrivate', defaultValue: false },
          { field: 'isVerified', defaultValue: false },
          { field: 'avatar', defaultValue: '/images/avatars/default.png' },
          { field: 'coverPhoto', defaultValue: '/images/covers/default.jpg' },
          { field: 'bio', defaultValue: '' }
        ];
        
        checks.forEach(({ field, defaultValue }) => {
          const currentValue = userObj[field];
          const isMissing = currentValue === undefined || 
                           currentValue === null ||
                           (typeof currentValue === 'string' && currentValue.trim() === '');
          
          if (isMissing) {
            updates[field] = defaultValue;
            needsUpdate = true;
            console.log(`   ➕ ${field}: ${currentValue} → ${defaultValue}`);
          }
        });
        
        // Special check for lastLogin
        if (!userObj.lastLogin || userObj.lastLogin === null) {
          updates.lastLogin = userObj.createdAt || new Date();
          needsUpdate = true;
          console.log(`   ➕ lastLogin: ${userObj.lastLogin} → ${updates.lastLogin}`);
        }
        
        if (needsUpdate) {
          // Apply updates
          Object.keys(updates).forEach(key => {
            user[key] = updates[key];
          });
          
          await user.save();
          updatedCount++;
          console.log(`   ✅ Saved updates\n`);
        } else {
          console.log(`   ✓ All fields are OK\n`);
        }
        
      } catch (userError) {
        errorCount++;
        console.log(`   ❌ Error processing user: ${userError.message}\n`);
      }
    }
    
    console.log('='.repeat(50));
    console.log('📊 FIX COMPLETE');
    console.log('='.repeat(50));
    console.log(`Total users: ${users.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('='.repeat(50));
    
    // Verification
    console.log('\n🔍 Verifying fixes...\n');
    
    const allUsers = await User.find({}).lean();
    const problematicUsers = allUsers.filter(u => 
      u.isPrivate === undefined || 
      u.isPrivate === null ||
      u.isVerified === undefined ||
      u.isVerified === null ||
      !u.avatar ||
      u.avatar === null
    );
    
    if (problematicUsers.length === 0) {
      console.log('🎉 SUCCESS! All users have been fixed.\n');
    } else {
      console.log(`⚠️  Still ${problematicUsers.length} users with issues:\n`);
      problematicUsers.forEach(u => {
        console.log(`   ${u.username}:`);
        console.log(`     isPrivate: ${u.isPrivate}`);
        console.log(`     isVerified: ${u.isVerified}`);
        console.log(`     avatar: ${u.avatar}`);
        console.log('');
      });
    }
    
    // Show a sample
    console.log('\n📋 SAMPLE (first 2 users):\n');
    const sample = allUsers.slice(0, 2);
    sample.forEach((user, i) => {
      console.log(`User ${i + 1}: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  isPrivate: ${user.isPrivate} (type: ${typeof user.isPrivate})`);
      console.log(`  isVerified: ${user.isVerified} (type: ${typeof user.isVerified})`);
      console.log(`  avatar: ${user.avatar}`);
      console.log(`  coverPhoto: ${user.coverPhoto}`);
      console.log(`  bio: ${user.bio}`);
      console.log(`  lastLogin: ${user.lastLogin}`);
      console.log('');
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the fix
fixUsers();