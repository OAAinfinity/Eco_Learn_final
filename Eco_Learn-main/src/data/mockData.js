export const mockUsers = [
  {
    id: '1',
    name: 'Arjun Kumar',
    email: 'arjun@student.com',
    role: 'student',
    schoolId: 'school1',
    gradeLevel: 'secondary',
    points: 450,
    reputationScore: 85,
    lastActiveDate: '2025-01-07',
    streakCount: 5,
    level: 3,
    createdAt: '2024-12-01',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    hasCompletedOnboarding: true,
    preferences: {
      interests: ['Tree planting', 'Reducing waste'],
      timeCommitment: '30 mins',
      location: 'Urban',
      ecoFocus: ['Biodiversity', 'Recycling']
    }
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@teacher.com',
    role: 'teacher',
    schoolId: 'school1',
    gradeLevel: 'all',
    points: 1200,
    reputationScore: 95,
    lastActiveDate: '2025-01-07',
    streakCount: 12,
    level: 4,
    createdAt: '2024-11-15',
    hasCompletedOnboarding: true
  },
  {
    id: '3',
    name: 'Dr. Rajesh Verma',
    email: 'rajesh@admin.com',
    role: 'admin',
    schoolId: 'school1',
    gradeLevel: 'all',
    points: 2500,
    reputationScore: 98,
    lastActiveDate: '2025-01-07',
    streakCount: 20,
    level: 5,
    createdAt: '2024-10-01',
    hasCompletedOnboarding: true
  },
  {
    id: '4',
    name: 'Green World NGO',
    email: 'ngo@greenworld.org',
    role: 'ngo',
    schoolId: 'ngo1',
    gradeLevel: 'all',
    points: 5000,
    reputationScore: 99,
    lastActiveDate: '2025-01-07',
    streakCount: 30,
    level: 5,
    createdAt: '2024-09-01',
    hasCompletedOnboarding: true
  }
];

export const mockSchools = [
  {
    id: 'school1',
    name: 'Green Valley International School',
    address: '123 Eco Street, New Delhi',
    schoolCode: 'GVIS2024',
    adminUserId: '3',
    region: 'North Delhi'
  }
];

export const mockInstitutions = [
  {
    id: 'inst1',
    name: 'Green Valley High School',
    type: 'school',
    location: 'Delhi',
    contactEmail: 'info@gvhs.edu',
    contactPhone: '+91-9876543210',
    institutionCode: 'GVHS123',
    createdBy: '2',
    createdAt: '2024-09-21T10:00:00Z',
    updatedAt: '2024-09-21T10:00:00Z',
    board: 'CBSE'
  },
  {
    id: 'inst2',
    name: 'ABC Engineering College',
    type: 'college',
    location: 'Jaipur',
    contactEmail: 'contact@abceng.ac.in',
    contactPhone: '+91-9988776655',
    institutionCode: 'ABCENG2025',
    createdBy: '3',
    createdAt: '2024-09-21T10:05:00Z',
    updatedAt: '2024-09-21T10:05:00Z',
    university: 'Rajasthan Technical University'
  }
];

export const mockChallenges = [
  {
    id: '1',
    title: 'Plant a Tree Challenge',
    description: 'Plant a sapling and upload a photo with GPS location. Take care of it for the next 30 days!',
    type: 'mission',
    points: 50,
    gradeLevels: ['primary', 'secondary', 'senior'],
    validation: 'teacher_approval',
    category: 'Trees & Plantation',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    badgeId: 'badge1',
    sdgTags: ['SDG13', 'SDG15'],
    nepTags: ['Environmental Awareness', 'Experiential Learning'],
    icon: '🌱',
    difficulty: 'easy',
    estimatedTime: '2 hours',
    personalizedFor: ['Tree planting', 'Biodiversity']
  },
  {
    id: '2',
    title: 'Waste Segregation Drive',
    description: 'Organize a 7-day waste segregation activity in your area. Document the process with photos.',
    type: 'project',
    points: 100,
    gradeLevels: ['secondary', 'senior'],
    validation: 'teacher_approval',
    category: 'Waste Management',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    badgeId: 'badge2',
    sdgTags: ['SDG11', 'SDG12'],
    nepTags: ['Community Service', 'Project-based Learning'],
    icon: '♻️',
    difficulty: 'medium',
    estimatedTime: '1 week',
    personalizedFor: ['Reducing waste', 'Recycling']
  },
  {
    id: '3',
    title: 'Water Conservation Quiz',
    description: 'Test your knowledge about water conservation methods and sustainable practices.',
    type: 'quiz',
    points: 25,
    gradeLevels: ['primary', 'secondary', 'senior'],
    validation: 'auto_check',
    category: 'Water Conservation',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    sdgTags: ['SDG6', 'SDG13'],
    nepTags: ['Knowledge Assessment', 'Environmental Science'],
    icon: '💧',
    difficulty: 'easy',
    estimatedTime: '15 minutes',
    personalizedFor: ['Clean water', 'Water']
  },
  {
    id: '4',
    title: 'Daily Energy Saving Habits',
    description: 'Track your daily energy-saving actions like turning off lights, using stairs instead of elevators.',
    type: 'habit',
    points: 10,
    gradeLevels: ['primary', 'secondary', 'senior'],
    validation: 'self_report',
    category: 'Energy Conservation',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    sdgTags: ['SDG7', 'SDG13'],
    nepTags: ['Daily Habits', 'Energy Awareness'],
    icon: '⚡',
    difficulty: 'easy',
    estimatedTime: '5 minutes daily',
    personalizedFor: ['Saving electricity', 'Energy']
  },
  {
    id: '5',
    title: 'Plastic-Free Campus Initiative',
    description: 'Lead a campaign to make your school plastic-free. Create awareness and implement alternatives.',
    type: 'project',
    points: 200,
    gradeLevels: ['senior', 'college'],
    validation: 'ngo_approval',
    category: 'Plastic Reduction',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    badgeId: 'badge3',
    sdgTags: ['SDG12', 'SDG14'],
    nepTags: ['Leadership', 'Innovation'],
    icon: '🚫',
    difficulty: 'hard',
    estimatedTime: '1 month',
    ngoId: 'ngo1',
    personalizedFor: ['Reducing waste', 'Awareness campaigns']
  },
  {
    id: '6',
    title: 'Campus Energy Audit',
    description: 'Conduct a comprehensive energy audit of your campus and propose efficiency improvements.',
    type: 'project',
    points: 150,
    gradeLevels: ['college'],
    validation: 'teacher_approval',
    category: 'Energy Conservation',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    sdgTags: ['SDG7', 'SDG13'],
    nepTags: ['Research', 'Data Analysis'],
    icon: '🔍',
    difficulty: 'hard',
    estimatedTime: '2-3 weeks',
    personalizedFor: ['Energy', 'Climate activism']
  },
  {
    id: '7',
    title: 'Zero Plastic Week Challenge',
    description: 'Go completely plastic-free for one week and document your journey.',
    type: 'habit',
    points: 75,
    gradeLevels: ['secondary', 'senior', 'college'],
    validation: 'self_report',
    category: 'Plastic Reduction',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    sdgTags: ['SDG12', 'SDG14'],
    nepTags: ['Lifestyle Change', 'Awareness'],
    icon: '🚯',
    difficulty: 'medium',
    estimatedTime: '1 week',
    personalizedFor: ['Reducing waste', 'Recycling']
  },
  {
    id: '8',
    title: 'Rural Water Conservation Mission',
    description: 'Implement rainwater harvesting or water conservation techniques in rural areas.',
    type: 'mission',
    points: 120,
    gradeLevels: ['senior', 'college'],
    validation: 'ngo_approval',
    category: 'Water Conservation',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    sdgTags: ['SDG6', 'SDG11'],
    nepTags: ['Community Development', 'Rural Engagement'],
    icon: '🏞️',
    difficulty: 'medium',
    estimatedTime: '1-2 weeks',
    personalizedFor: ['Clean water', 'Water']
  }
];

export const mockBadges = [
  { id: 'badge1', title: 'Tree Guardian', iconUrl: '🌳', conditionJson: { trees_planted: 5 }, description: 'Plant and nurture 5 trees', category: 'Environmental', rarity: 'common' },
  { id: 'badge2', title: 'Waste Warrior', iconUrl: '♻️', conditionJson: { waste_projects: 3 }, description: 'Complete 3 waste management projects', category: 'Environmental', rarity: 'rare' },
  { id: 'badge3', title: 'Eco Innovator', iconUrl: '💡', conditionJson: { innovative_projects: 1 }, description: 'Lead an innovative environmental project', category: 'Leadership', rarity: 'epic' },
  { id: 'badge4', title: 'Knowledge Seeker', iconUrl: '📚', conditionJson: { quizzes_completed: 10 }, description: 'Complete 10 environmental quizzes', category: 'Education', rarity: 'common' },
  { id: 'badge5', title: 'Learning Champion', iconUrl: '🎓', conditionJson: { lessons_completed: 20 }, description: 'Complete 20 learning modules', category: 'Education', rarity: 'rare' }
];

export const mockSubmissions = [
  {
    id: '1', userId: '1', challengeId: '1', proofUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg', latitude: 28.6139, longitude: 77.2090, timestamp: '2025-01-06T10:30:00Z', status: 'pending', pointsAwarded: 0, exifData: { camera: 'iPhone 12', timestamp: '2025-01-06T10:30:00Z' }, verificationFlags: ['gps_verified', 'timestamp_valid']
  },
  {
    id: '2', userId: '1', challengeId: '2', proofUrl: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg', timestamp: '2025-01-05T14:20:00Z', status: 'approved', verifierId: '2', comments: 'Excellent work! Great documentation.', pointsAwarded: 100, similarityScore: 0.95
  }
];

export const mockPhotos = [
  { id: '1', userId: '1', title: 'My First Tree Plantation', caption: 'Planted a mango sapling in school garden! 🌱', mediaUrl: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg', tags: ['tree', 'plantation', 'school'], challengeId: '1', createdAt: '2025-01-06T10:35:00Z', likes: 15, visibility: 'school', location: 'School Garden', isModerated: true, moderatedBy: '2', comments: [ { id: 'c1', userId: '2', content: 'Great work! Keep it up!', createdAt: '2025-01-06T11:00:00Z', likes: 3 } ] },
  { id: '2', userId: '1', title: 'Community Clean-up Drive', caption: 'Organized waste segregation in our locality! ♻️', mediaUrl: 'https://images.pexels.com/photos/2382894/pexels-photo-2382894.jpeg', tags: ['waste', 'community', 'teamwork'], challengeId: '2', createdAt: '2025-01-05T16:00:00Z', likes: 23, visibility: 'public', isModerated: true, moderatedBy: '2' }
];

export const mockBlogs = [
  { id: '1', userId: '1', title: 'My Journey to Becoming an Eco Warrior', body: 'When I first joined EcoLearn, I had no idea how much impact small actions could make. Starting with simple daily habits like turning off lights and using stairs, I gradually moved to bigger projects like organizing community clean-up drives. The most rewarding experience was planting my first tree and watching it grow day by day. Each challenge taught me something new about environmental conservation and made me realize that every individual action counts toward a sustainable future.', mediaUrls: ['https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg'], tags: ['personal journey', 'environment', 'sustainability'], createdAt: '2025-01-04T18:30:00Z', likes: 42, visibility: 'public', isApproved: true, approvedBy: '2', comments: [ { id: 'bc1', userId: '2', content: 'Inspiring story! Thanks for sharing.', createdAt: '2025-01-04T19:00:00Z', likes: 5 } ] }
];

export const mockCampaigns = [
  { id: 'camp1', ngoId: '4', title: 'Green Delhi Mission 2025', description: 'Join us in making Delhi greener by planting 10,000 trees across the city', goals: [ { metric: 'Trees Planted', target: 10000 }, { metric: 'Schools Engaged', target: 100 }, { metric: 'Students Participating', target: 5000 } ], startDate: '2025-01-01', endDate: '2025-12-31', challengeIds: ['1', '5'], status: 'active' }
];

export const mockCompetitions = [
  { id: 'comp1', title: 'Eco Champions Cup 2025', description: 'Inter-school competition to find the most eco-friendly school', type: 'school', startDate: '2025-01-01', endDate: '2025-03-31', prizes: ['Trophy + ₹50,000', 'Certificate + ₹25,000', 'Certificate + ₹10,000'], participantIds: ['school1'], status: 'active' }
];

export const levelThresholds = [
  { level: 1, minPoints: 0, title: 'Green Cadet', color: '#10B981' },
  { level: 2, minPoints: 100, title: 'Eco Learner', color: '#3B82F6' },
  { level: 3, minPoints: 300, title: 'Eco Practitioner', color: '#8B5CF6' },
  { level: 4, minPoints: 700, title: 'Climate Ambassador', color: '#F59E0B' },
  { level: 5, minPoints: 1500, title: 'Eco Leader', color: '#EF4444' }
];

export const mockLessons = [
  { id: 'lesson1', title: 'Air Around Us - Primary Level', content: 'Learn about the air we breathe!...', type: 'micro-lesson', quiz: [ { q: 'Which gas is essential for breathing?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answer: 'Oxygen' }, { q: 'Can we see air?', options: ['Yes', 'No'], answer: 'No' } ], gradeLevels: ['primary'], ncertTheme: 'Air', nepTags: ['Experiential Learning', 'Environmental Awareness'], sdgTags: ['SDG13'], mediaUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', estimatedTime: '15 minutes', points: 10, createdBy: '2', createdAt: '2024-12-01T10:00:00Z' },
  { id: 'lesson2', title: 'Water Conservation Basics', content: 'Water is precious!...', type: 'micro-lesson', quiz: [ { q: 'Which of these saves water?', options: ['Running tap while brushing', 'Turning tap off while brushing', 'Using more soap'], answer: 'Turning tap off while brushing' }, { q: 'Why should we save water?', options: ['It is expensive', 'It is limited resource', 'Both'], answer: 'Both' } ], gradeLevels: ['secondary'], ncertTheme: 'Water', nepTags: ['Daily Habits', 'Sustainability'], sdgTags: ['SDG6'], mediaUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg', estimatedTime: '20 minutes', points: 15, createdBy: '2', createdAt: '2024-12-02T10:00:00Z' },
  { id: 'lesson3', title: 'Climate Change and Its Impact', content: 'Understanding climate change...', type: 'micro-lesson', quiz: [ { q: 'What is the main cause of climate change?', options: ['Natural disasters', 'Human activities', 'Solar radiation'], answer: 'Human activities' }, { q: 'Which gas contributes most to greenhouse effect?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen'], answer: 'Carbon Dioxide' } ], gradeLevels: ['senior'], ncertTheme: 'Climate', nepTags: ['Critical Thinking', 'Global Awareness'], sdgTags: ['SDG13'], mediaUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', estimatedTime: '30 minutes', points: 20, createdBy: '3', createdAt: '2024-12-03T10:00:00Z' },
  { id: 'lesson4', title: 'Sustainable Development and Innovation', content: 'Explore advanced concepts...', type: 'micro-lesson', quiz: [ { q: 'What is circular economy?', options: ['Linear production model', 'Waste-to-resource model', 'Traditional economy'], answer: 'Waste-to-resource model' }, { q: 'Which is the fastest growing renewable energy source?', options: ['Solar', 'Wind', 'Hydro'], answer: 'Solar' } ], gradeLevels: ['college'], ncertTheme: 'Sustainability', nepTags: ['Innovation', 'Research Skills'], sdgTags: ['SDG7', 'SDG9', 'SDG13'], mediaUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', estimatedTime: '45 minutes', points: 25, createdBy: '3', createdAt: '2024-12-04T10:00:00Z' }
];

export const mockStudentLessons = [
  { id: 'sl1', userId: '1', lessonId: 'lesson1', status: 'completed', score: 100, completedAt: '2025-01-05T14:30:00Z', timeSpent: 18 },
  { id: 'sl2', userId: '1', lessonId: 'lesson2', status: 'in_progress', timeSpent: 12 }
];

export const onboardingQuestions = [
  { id: 'interests', question: 'What excites you most? 🌱', type: 'multiple', options: [ { id: 'tree_planting', label: 'Tree planting', icon: '🌳' }, { id: 'saving_electricity', label: 'Saving electricity', icon: '⚡' }, { id: 'reducing_waste', label: 'Reducing waste', icon: '♻️' }, { id: 'clean_water', label: 'Clean water', icon: '💧' }, { id: 'awareness_campaigns', label: 'Awareness campaigns', icon: '📢' } ] },
  { id: 'time_commitment', question: 'How much time can you give weekly?', type: 'single', options: [ { id: '15_mins', label: '15 minutes', icon: '⏰' }, { id: '30_mins', label: '30 minutes', icon: '⏱️' }, { id: '1_hour_plus', label: '1 hour+', icon: '⏳' } ] },
  { id: 'location', question: 'Where do you live?', type: 'single', options: [ { id: 'urban', label: 'Urban', icon: '🏙️' }, { id: 'semi_urban', label: 'Semi-urban', icon: '🏘️' }, { id: 'rural', label: 'Rural', icon: '🏞️' } ] },
  { id: 'eco_focus', question: 'Choose your eco-interests:', type: 'multiple', options: [ { id: 'biodiversity', label: 'Biodiversity', icon: '🦋' }, { id: 'recycling', label: 'Recycling', icon: '♻️' }, { id: 'energy', label: 'Energy', icon: '⚡' }, { id: 'water', label: 'Water', icon: '💧' }, { id: 'climate_activism', label: 'Climate activism', icon: '🌍' } ] }
];

