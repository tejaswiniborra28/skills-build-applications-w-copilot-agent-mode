const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Import models from compiled dist
    const { User } = require('./dist/models/User');
    const { Team } = require('./dist/models/Team');
    const { Activity } = require('./dist/models/Activity');
    const { Leaderboard } = require('./dist/models/Leaderboard');
    const { Workout } = require('./dist/models/Workout');

    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Leaderboard.deleteMany({});
    await Workout.deleteMany({});

    console.log('👤 Creating users...');
    const users = await User.create([
      { username: 'alice_runner', email: 'alice@example.com', password: 'hashedPassword123' },
      { username: 'bob_cyclist', email: 'bob@example.com', password: 'hashedPassword456' },
      { username: 'carol_swimmer', email: 'carol@example.com', password: 'hashedPassword789' },
      { username: 'dave_lifter', email: 'dave@example.com', password: 'hashedPasswordABC' },
      { username: 'eva_yogi', email: 'eva@example.com', password: 'hashedPasswordDEF' },
    ]);
    console.log(`  ✓ Created ${users.length} users`);

    console.log('🏆 Creating teams...');
    const teams = await Team.create([
      { name: 'Morning Runners', description: 'Early bird runners getting fit before work', leader: users[0]._id, members: [users[0]._id, users[1]._id] },
      { name: 'Cycling Club', description: 'Weekend bike enthusiasts', leader: users[1]._id, members: [users[1]._id, users[2]._id, users[3]._id] },
      { name: 'Fitness Warriors', description: 'Dedicated strength training group', leader: users[3]._id, members: [users[3]._id, users[4]._id] },
    ]);
    console.log(`  ✓ Created ${teams.length} teams`);

    console.log('🏃 Creating activities...');
    const activities = await Activity.create([
      { userId: users[0]._id, type: 'running', duration: 45, caloriesBurned: 520, date: new Date('2026-07-05'), description: 'Morning run in the park' },
      { userId: users[0]._id, type: 'running', duration: 60, caloriesBurned: 650, date: new Date('2026-07-06'), description: 'Long distance run' },
      { userId: users[1]._id, type: 'cycling', duration: 90, caloriesBurned: 720, date: new Date('2026-07-05'), description: 'Mountain bike trail' },
      { userId: users[1]._id, type: 'cycling', duration: 120, caloriesBurned: 850, date: new Date('2026-07-06'), description: 'Long-distance road cycling' },
      { userId: users[2]._id, type: 'swimming', duration: 50, caloriesBurned: 480, date: new Date('2026-07-05'), description: 'Lap swimming session' },
      { userId: users[3]._id, type: 'weightlifting', duration: 75, caloriesBurned: 580, date: new Date('2026-07-05'), description: 'Upper body strength training' },
      { userId: users[3]._id, type: 'weightlifting', duration: 60, caloriesBurned: 520, date: new Date('2026-07-06'), description: 'Lower body workout' },
      { userId: users[4]._id, type: 'yoga', duration: 60, caloriesBurned: 250, date: new Date('2026-07-05'), description: 'Vinyasa flow class' },
    ]);
    console.log(`  ✓ Created ${activities.length} activities`);

    console.log('📊 Creating leaderboard entries...');
    const leaderboardEntries = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userActivities = await Activity.find({ userId: user._id });
      const totalCalories = userActivities.reduce((sum, act) => sum + act.caloriesBurned, 0);
      const activityCount = userActivities.length;
      leaderboardEntries.push({
        userId: user._id,
        username: user.username,
        totalCalories,
        activityCount,
        rank: 0,
      });
    }
    leaderboardEntries.sort((a, b) => b.totalCalories - a.totalCalories);
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    await Leaderboard.create(leaderboardEntries);
    console.log(`  ✓ Created ${leaderboardEntries.length} leaderboard entries`);

    console.log('\n🎯 Current Leaderboard:');
    leaderboardEntries.forEach((entry) => {
      console.log(`  ${entry.rank}. ${entry.username}: ${entry.totalCalories} calories (${entry.activityCount} activities)`);
    });

    console.log('\n💪 Creating workouts...');
    const workouts = await Workout.create([
      { userId: users[0]._id, name: 'Beginner 5K Training', description: 'Perfect for those starting their running journey', type: 'cardio', difficulty: 'beginner', duration: 30, targetCalories: 300, exercises: ['Warm-up jog', 'Interval training', 'Cool-down walk'] },
      { userId: users[0]._id, name: 'Advanced Marathon Prep', description: 'Build endurance for long-distance running', type: 'cardio', difficulty: 'advanced', duration: 120, targetCalories: 1200, exercises: ['Long run', 'Pace work', 'Stretching'] },
      { userId: users[1]._id, name: 'Mountain Biking Basics', description: 'Learn trail techniques and build confidence', type: 'cardio', difficulty: 'intermediate', duration: 60, targetCalories: 600, exercises: ['Trail warm-up', 'Technical sections', 'Downhill practice'] },
      { userId: users[3]._id, name: 'Full Body Strength', description: 'Complete workout targeting all major muscle groups', type: 'strength', difficulty: 'intermediate', duration: 60, targetCalories: 450, exercises: ['Squats', 'Bench press', 'Deadlifts', 'Rows', 'Core work'] },
      { userId: users[3]._id, name: 'Power Lifting Program', description: 'Advanced strength building for serious lifters', type: 'strength', difficulty: 'advanced', duration: 90, targetCalories: 650, exercises: ['Olympic lifts', 'Heavy compounds', 'Accessory work', 'Cooldown'] },
      { userId: users[4]._id, name: 'Morning Yoga Flow', description: 'Energizing yoga to start your day', type: 'flexibility', difficulty: 'beginner', duration: 45, targetCalories: 200, exercises: ['Sun salutations', 'Standing poses', 'Savasana'] },
      { userId: users[4]._id, name: 'Power Yoga', description: 'Challenging yoga for strength and flexibility', type: 'flexibility', difficulty: 'intermediate', duration: 60, targetCalories: 350, exercises: ['Arm balances', 'Inversions', 'Core work', 'Deep stretches'] },
    ]);
    console.log(`  ✓ Created ${workouts.length} workouts`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Teams: ${teams.length}`);
    console.log(`   - Activities: ${activities.length}`);
    console.log(`   - Leaderboard Entries: ${leaderboardEntries.length}`);
    console.log(`   - Workouts: ${workouts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
