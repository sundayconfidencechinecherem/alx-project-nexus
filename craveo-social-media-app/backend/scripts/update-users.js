// backend/scripts/update-users.js
require('dotenv').config();
const mongoose = require('mongoose');

// Path to your User model - adjust if needed
const User = require('../src/graphql/models/user.model').default || 
             require('../src/graphql/models/user.model');

async function updateExistingUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find ALL users
    const users = await User.find({});
    console.log(`Found ${users.length} total users`);

    // Update each user to ensure all required fields exist
    let updatedCount = 0;
    for (const user of users) {
      console.log(`\nChecking user: ${user.username} (${user.email})`);
      
      // Check which fields need updating
      const updates = {};
      const fieldsToCheck = ['isPrivate', 'avatar', 'coverPhoto', 'bio', 'lastLogin'];
      
      fieldsToCheck.forEach(field => {
        const userValue = user[field];
        const needsUpdate = userValue === undefined || 
                           userValue === null || 
                           (typeof userValue === 'string' && userValue.trim() === '');
        
        if (needsUpdate) {
          // Set default values
          if (field === 'isPrivate') {
            updates[field] = false;
          } else if (field === 'avatar') {
            updates[field] = '/images/avatars/default.png';
          } else if (field === 'coverPhoto') {
            updates[field] = '/images/covers/default.jpg';
          } else if (field === 'bio') {
            updates[field] = '';
          } else if (field === 'lastLogin') {
            updates[field] = user.createdAt || new Date();
          }
          console.log(`   ${field}: ${userValue} -> ${updates[field]}`);
        }
      });

      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, { $set: updates });
        updatedCount++;
        console.log(`✅ Updated user: ${user.username}`);
      } else {
        console.log(`✓ User ${user.username} already has all required fields`);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} users`);
    
    // Verify the updates
    const allUsers = await User.find();
    console.log(`\n📊 Verification: Total users in database: ${allUsers.length}`);
    
    // Check for any users still missing required fields
    const usersWithMissingFields = await User.find({
      $or: [
        { isPrivate: { $exists: false } },
        { isPrivate: null },
        { isPrivate: { $type: 'undefined' } },
        { avatar: { $exists: false } },
        { avatar: null },
        { avatar: '' }
      ]
    });
    
    console.log(`Users still with missing fields: ${usersWithMissingFields.length}`);
    
    if (usersWithMissingFields.length === 0) {
      console.log('✅ All users now have all required fields!');
    } else {
      console.log('\nUsers still needing attention:');
      usersWithMissingFields.forEach(u => {
        console.log(`   ${u.username} (${u.email}):`);
        console.log(`     isPrivate: ${u.isPrivate}`);
        console.log(`     avatar: ${u.avatar}`);
      });
    }

    // Show sample of updated users
    console.log('\n📋 Sample of updated users:');
    const sampleUsers = await User.find().limit(3);
    sampleUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   isPrivate: ${user.isPrivate}`);
      console.log(`   isVerified: ${user.isVerified}`);
      console.log(`   avatar: ${user.avatar || 'missing'}`);
      console.log(`   coverPhoto: ${user.coverPhoto || 'missing'}`);
      console.log(`   bio: ${user.bio || 'empty'}`);
      console.log(`   lastLogin: ${user.lastLogin || 'missing'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

updateExistingUsers();