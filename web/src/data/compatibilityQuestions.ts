export interface CompatibilityQuestion {
  id: string;
  question: string;
  category: 'lifestyle' | 'values' | 'entertainment' | 'food' | 'social' | 'goals' | 'personality' | 'preferences';
  options: string[];
  emoji: string;
}

export const compatibilityQuestions: CompatibilityQuestion[] = [
  // Lifestyle (20 questions)
  {
    id: 'lifestyle_1',
    question: 'Perfect weekend morning?',
    category: 'lifestyle',
    options: ['Sleep in until noon', 'Early morning workout', 'Coffee and newspaper', 'Outdoor adventure'],
    emoji: '🌅'
  },
  {
    id: 'lifestyle_2', 
    question: 'Ideal living situation?',
    category: 'lifestyle',
    options: ['City apartment', 'Suburban house', 'Rural farmhouse', 'Beach house'],
    emoji: '🏠'
  },
  {
    id: 'lifestyle_3',
    question: 'Morning fuel of choice?',
    category: 'lifestyle', 
    options: ['Coffee (lots of it)', 'Tea (zen vibes)', 'Energy drinks', 'Just water'],
    emoji: '☕'
  },
  {
    id: 'lifestyle_4',
    question: 'Favorite season?',
    category: 'lifestyle',
    options: ['Spring (new beginnings)', 'Summer (beach days)', 'Fall (cozy vibes)', 'Winter (snow magic)'],
    emoji: '🍂'
  },
  {
    id: 'lifestyle_5',
    question: 'Daily routine preference?',
    category: 'lifestyle',
    options: ['Strict schedule', 'Loose structure', 'Go with the flow', 'Chaos is fun'],
    emoji: '📅'
  },
  {
    id: 'lifestyle_6',
    question: 'Workout style?',
    category: 'lifestyle',
    options: ['Gym beast mode', 'Yoga and mindfulness', 'Outdoor activities', 'What workout?'],
    emoji: '💪'
  },
  {
    id: 'lifestyle_7',
    question: 'Pet preference?',
    category: 'lifestyle',
    options: ['Dog person', 'Cat person', 'Exotic pets', 'No pets please'],
    emoji: '🐕'
  },
  {
    id: 'lifestyle_8',
    question: 'Shopping approach?',
    category: 'lifestyle',
    options: ['Plan and list', 'Browse and discover', 'Quick in and out', 'Online only'],
    emoji: '🛒'
  },
  {
    id: 'lifestyle_9',
    question: 'Car vs other transport?',
    category: 'lifestyle',
    options: ['Love driving', 'Public transport', 'Bike everywhere', 'Walk when possible'],
    emoji: '🚗'
  },
  {
    id: 'lifestyle_10',
    question: 'Technology relationship?',
    category: 'lifestyle',
    options: ['Early adopter', 'Practical user', 'Minimal tech', 'What smartphone?'],
    emoji: '📱'
  },
  {
    id: 'lifestyle_11',
    question: 'Cleaning habits?',
    category: 'lifestyle',
    options: ['Everything has a place', 'Clean as needed', 'Organized chaos', 'Minimalist life'],
    emoji: '🧹'
  },
  {
    id: 'lifestyle_12',
    question: 'Money approach?',
    category: 'lifestyle',
    options: ['Save and budget', 'Invest for future', 'Spend on experiences', 'Live for today'],
    emoji: '💰'
  },
  {
    id: 'lifestyle_13',
    question: 'Climate preference?',
    category: 'lifestyle',
    options: ['Always warm', 'Four seasons', 'Cool and crisp', 'Doesn\'t matter'],
    emoji: '🌡️'
  },
  {
    id: 'lifestyle_14',
    question: 'News consumption?',
    category: 'lifestyle',
    options: ['Daily news junkie', 'Weekly summaries', 'Social media only', 'Ignorance is bliss'],
    emoji: '📰'
  },
  {
    id: 'lifestyle_15',
    question: 'Fashion approach?',
    category: 'lifestyle',
    options: ['Trendy and stylish', 'Classic and timeless', 'Comfort first', 'Whatever\'s clean'],
    emoji: '👕'
  },
  {
    id: 'lifestyle_16',
    question: 'Health approach?',
    category: 'lifestyle',
    options: ['Strict healthy living', 'Balance is key', 'Enjoy life fully', 'Wing it'],
    emoji: '🍎'
  },
  {
    id: 'lifestyle_17',
    question: 'Learning preference?',
    category: 'lifestyle',
    options: ['Books and courses', 'Hands-on experience', 'YouTube tutorials', 'Trial and error'],
    emoji: '📚'
  },
  {
    id: 'lifestyle_18',
    question: 'Vacation planning?',
    category: 'lifestyle',
    options: ['Months in advance', 'Few weeks ahead', 'Last minute deals', 'Spontaneous trips'],
    emoji: '✈️'
  },
  {
    id: 'lifestyle_19',
    question: 'Photography style?',
    category: 'lifestyle',
    options: ['Instagram everything', 'Special moments only', 'Candid shots', 'Live in the moment'],
    emoji: '📸'
  },
  {
    id: 'lifestyle_20',
    question: 'Sleep schedule?',
    category: 'lifestyle',
    options: ['Early to bed/rise', 'Night owl life', 'Whatever works', 'Sleep is overrated'],
    emoji: '😴'
  },

  // Values & Personality (20 questions)
  {
    id: 'values_1',
    question: 'Decision making style?',
    category: 'values',
    options: ['Think it through', 'Trust gut instinct', 'Ask for advice', 'Flip a coin'],
    emoji: '🤔'
  },
  {
    id: 'values_2',
    question: 'Conflict resolution?',
    category: 'values',
    options: ['Talk it out calmly', 'Give space first', 'Address immediately', 'Avoid if possible'],
    emoji: '🤝'
  },
  {
    id: 'values_3',
    question: 'Risk tolerance?',
    category: 'values',
    options: ['Adventure seeker', 'Calculated risks', 'Play it safe', 'Risk? No thanks'],
    emoji: '🎲'
  },
  {
    id: 'values_4',
    question: 'Honesty approach?',
    category: 'values',
    options: ['Brutal honesty', 'Kind but truthful', 'White lies okay', 'Feelings first'],
    emoji: '💯'
  },
  {
    id: 'values_5',
    question: 'Time management?',
    category: 'values',
    options: ['Always early', 'Right on time', 'Fashionably late', 'Time is relative'],
    emoji: '⏰'
  },
  {
    id: 'values_6',
    question: 'Change adaptation?',
    category: 'values',
    options: ['Love change', 'Adapt quickly', 'Need time', 'Resist change'],
    emoji: '🔄'
  },
  {
    id: 'values_7',
    question: 'Loyalty approach?',
    category: 'values',
    options: ['Ride or die', 'Earned over time', 'Depends on person', 'Everyone\'s different'],
    emoji: '🛡️'
  },
  {
    id: 'values_8',
    question: 'Ambition level?',
    category: 'values',
    options: ['Sky\'s the limit', 'Steady progress', 'Work to live', 'Simple pleasures'],
    emoji: '🎯'
  },
  {
    id: 'values_9',
    question: 'Forgiveness style?',
    category: 'values',
    options: ['Forgive quickly', 'Takes time', 'Depends on situation', 'Never forget'],
    emoji: '🕊️'
  },
  {
    id: 'values_10',
    question: 'Justice vs mercy?',
    category: 'values',
    options: ['Rules are rules', 'Context matters', 'Second chances', 'Compassion wins'],
    emoji: '⚖️'
  },
  {
    id: 'values_11',
    question: 'Independence level?',
    category: 'values',
    options: ['Fiercely independent', 'Like some space', 'Better together', 'Need connection'],
    emoji: '🗽'
  },
  {
    id: 'values_12',
    question: 'Optimism meter?',
    category: 'values',
    options: ['Glass half full', 'Realistic optimist', 'Cautious outlook', 'Expect the worst'],
    emoji: '🌈'
  },
  {
    id: 'values_13',
    question: 'Competitiveness?',
    category: 'values',
    options: ['Must win everything', 'Healthy competition', 'Just for fun', 'Avoid competing'],
    emoji: '🏆'
  },
  {
    id: 'values_14',
    question: 'Perfectionism level?',
    category: 'values',
    options: ['Everything perfect', 'High standards', 'Good enough works', 'Embrace imperfection'],
    emoji: '✨'
  },
  {
    id: 'values_15',
    question: 'Spontaneity vs planning?',
    category: 'values',
    options: ['Totally spontaneous', 'Mix of both', 'Like to plan', 'Everything scheduled'],
    emoji: '📋'
  },
  {
    id: 'values_16',
    question: 'Emotional expression?',
    category: 'values',
    options: ['Wear heart on sleeve', 'Open with close ones', 'Keep it private', 'What emotions?'],
    emoji: '❤️'
  },
  {
    id: 'values_17',
    question: 'Learning from failure?',
    category: 'values',
    options: ['Failure is teaching', 'Learn and move on', 'Avoid if possible', 'Failure isn\'t option'],
    emoji: '📈'
  },
  {
    id: 'values_18',
    question: 'Helping others?',
    category: 'values',
    options: ['Always help', 'When I can', 'Close friends only', 'Help yourself first'],
    emoji: '🤲'
  },
  {
    id: 'values_19',
    question: 'Tradition importance?',
    category: 'values',
    options: ['Love traditions', 'Some are nice', 'Make new ones', 'Traditions are outdated'],
    emoji: '🎭'
  },
  {
    id: 'values_20',
    question: 'Privacy level?',
    category: 'values',
    options: ['Open book', 'Share with friends', 'Keep some private', 'Very private person'],
    emoji: '🔒'
  },

  // Entertainment (20 questions)
  {
    id: 'entertainment_1',
    question: 'Movie night preference?',
    category: 'entertainment',
    options: ['Action adventure', 'Rom-com feels', 'Mind-bending thriller', 'Documentary deep dive'],
    emoji: '🎬'
  },
  {
    id: 'entertainment_2',
    question: 'Music discovery?',
    category: 'entertainment', 
    options: ['Mainstream hits', 'Indie discoveries', 'Vintage classics', 'Whatever\'s on'],
    emoji: '🎵'
  },
  {
    id: 'entertainment_3',
    question: 'Reading preference?',
    category: 'entertainment',
    options: ['Fiction escape', 'Non-fiction learning', 'Magazines/articles', 'Audiobooks only'],
    emoji: '📖'
  },
  {
    id: 'entertainment_4',
    question: 'Gaming style?',
    category: 'entertainment',
    options: ['Hardcore gamer', 'Casual mobile games', 'Board game nights', 'Not into games'],
    emoji: '🎮'
  },
  {
    id: 'entertainment_5',
    question: 'TV binging approach?',
    category: 'entertainment',
    options: ['Binge entire seasons', 'Episode per night', 'Background noise', 'What TV?'],
    emoji: '📺'
  },
  {
    id: 'entertainment_6',
    question: 'Concert preference?',
    category: 'entertainment',
    options: ['Front row energy', 'Mid-crowd vibes', 'Back with space', 'Streaming at home'],
    emoji: '🎤'
  },
  {
    id: 'entertainment_7',
    question: 'Comedy style?',
    category: 'entertainment',
    options: ['Slapstick funny', 'Witty wordplay', 'Dark humor', 'Clean and wholesome'],
    emoji: '😂'
  },
  {
    id: 'entertainment_8',
    question: 'Art appreciation?',
    category: 'entertainment',
    options: ['Museums and galleries', 'Street art exploration', 'Create my own', 'Not really my thing'],
    emoji: '🎨'
  },
  {
    id: 'entertainment_9',
    question: 'Theater experience?',
    category: 'entertainment',
    options: ['Broadway musicals', 'Indie productions', 'Comedy shows', 'Skip the theater'],
    emoji: '🎭'
  },
  {
    id: 'entertainment_10',
    question: 'Podcast preference?',
    category: 'entertainment',
    options: ['True crime obsessed', 'Comedy podcasts', 'Educational content', 'Music only'],
    emoji: '🎧'
  },
  {
    id: 'entertainment_11',
    question: 'Party entertainment?',
    category: 'entertainment',
    options: ['Dance all night', 'Deep conversations', 'Games and activities', 'Observe from corner'],
    emoji: '🎉'
  },
  {
    id: 'entertainment_12',
    question: 'Sports involvement?',
    category: 'entertainment',
    options: ['Play competitive', 'Casual recreation', 'Watch on TV', 'Not into sports'],
    emoji: '⚽'
  },
  {
    id: 'entertainment_13',
    question: 'Horror movie tolerance?',
    category: 'entertainment',
    options: ['Bring on the scares', 'Light suspense okay', 'Only with others', 'Absolutely not'],
    emoji: '👻'
  },
  {
    id: 'entertainment_14',
    question: 'Reality TV opinion?',
    category: 'entertainment',
    options: ['Guilty pleasure', 'Some shows okay', 'Not my style', 'Complete trash'],
    emoji: '📱'
  },
  {
    id: 'entertainment_15',
    question: 'Social media usage?',
    category: 'entertainment',
    options: ['Constant scrolling', 'Daily check-ins', 'Weekly browse', 'Barely use it'],
    emoji: '📲'
  },
  {
    id: 'entertainment_16',
    question: 'News consumption style?',
    category: 'entertainment',
    options: ['Multiple sources', 'One trusted outlet', 'Social media summaries', 'Avoid the news'],
    emoji: '📰'
  },
  {
    id: 'entertainment_17',
    question: 'YouTube rabbit holes?',
    category: 'entertainment',
    options: ['Hours of deep dives', 'Specific interests only', 'Quick videos', 'Don\'t use YouTube'],
    emoji: '📹'
  },
  {
    id: 'entertainment_18',
    question: 'Festival experience?',
    category: 'entertainment',
    options: ['Music festival life', 'Food festivals', 'Art and culture', 'Too crowded for me'],
    emoji: '🎪'
  },
  {
    id: 'entertainment_19',
    question: 'Karaoke confidence?',
    category: 'entertainment',
    options: ['Microphone hog', 'With liquid courage', 'Duets only', 'Never happening'],
    emoji: '🎤'
  },
  {
    id: 'entertainment_20',
    question: 'Board game nights?',
    category: 'entertainment',
    options: ['Strategic war games', 'Party games', 'Classic favorites', 'Digital games only'],
    emoji: '🎲'
  },

  // Food & Dining (15 questions)
  {
    id: 'food_1',
    question: 'Cuisine adventure level?',
    category: 'food',
    options: ['Try anything once', 'Familiar with twist', 'Stick to favorites', 'Plain and simple'],
    emoji: '🍜'
  },
  {
    id: 'food_2',
    question: 'Cooking enthusiasm?',
    category: 'food',
    options: ['Master chef wannabe', 'Decent home cook', 'Basic survival', 'Takeout expert'],
    emoji: '👨‍🍳'
  },
  {
    id: 'food_3',
    question: 'Spice tolerance?',
    category: 'food',
    options: ['Bring the heat', 'Medium spice', 'Mild please', 'No spice at all'],
    emoji: '🌶️'
  },
  {
    id: 'food_4',
    question: 'Restaurant choice?',
    category: 'food',
    options: ['Fine dining experience', 'Local hidden gems', 'Reliable chains', 'Fast and convenient'],
    emoji: '🍽️'
  },
  {
    id: 'food_5',
    question: 'Breakfast importance?',
    category: 'food',
    options: ['Most important meal', 'Quick fuel up', 'Coffee counts', 'Skip to lunch'],
    emoji: '🥞'
  },
  {
    id: 'food_6',
    question: 'Dessert approach?',
    category: 'food',
    options: ['Always room for dessert', 'Special occasions', 'Share a bite', 'Not a sweet tooth'],
    emoji: '🍰'
  },
  {
    id: 'food_7',
    question: 'Food shopping style?',
    category: 'food',
    options: ['Meal plan and list', 'Fresh ingredients daily', 'Stock up weekly', 'Whatever\'s on sale'],
    emoji: '🛒'
  },
  {
    id: 'food_8',
    question: 'Dietary preferences?',
    category: 'food',
    options: ['Plant-based', 'Balanced omnivore', 'Protein focused', 'No restrictions'],
    emoji: '🥗'
  },
  {
    id: 'food_9',
    question: 'Coffee shop order?',
    category: 'food',
    options: ['Complex specialty drink', 'Classic with variations', 'Simple black coffee', 'Tea instead'],
    emoji: '☕'
  },
  {
    id: 'food_10',
    question: 'Food presentation?',
    category: 'food',
    options: ['Instagram worthy', 'Neat and tidy', 'Function over form', 'Who cares how it looks'],
    emoji: '📸'
  },
  {
    id: 'food_11',
    question: 'Snacking habits?',
    category: 'food',
    options: ['Healthy snacks only', 'Sweet tooth cravings', 'Salty and crunchy', 'Three meals enough'],
    emoji: '🍿'
  },
  {
    id: 'food_12',
    question: 'Wine/drink knowledge?',
    category: 'food',
    options: ['Connoisseur level', 'Know what I like', 'Open to learning', 'Not much interest'],
    emoji: '🍷'
  },
  {
    id: 'food_13',
    question: 'Food waste attitude?',
    category: 'food',
    options: ['Use every bit', 'Reasonable portions', 'Sometimes wasteful', 'Abundance mindset'],
    emoji: '♻️'
  },
  {
    id: 'food_14',
    question: 'Meal timing?',
    category: 'food',
    options: ['Scheduled meal times', 'When hungry', 'Social eating', 'Constant grazing'],
    emoji: '🕐'
  },
  {
    id: 'food_15',
    question: 'Food sharing?',
    category: 'food',
    options: ['Family style everything', 'Share appetizers', 'Taste each other\'s', 'Keep your own'],
    emoji: '🍽️'
  },

  // Social & Relationships (15 questions)
  {
    id: 'social_1',
    question: 'Party energy level?',
    category: 'social',
    options: ['Life of the party', 'Social butterfly', 'Selective socializing', 'Prefer small groups'],
    emoji: '🎉'
  },
  {
    id: 'social_2',
    question: 'Friend group size?',
    category: 'social',
    options: ['Large social circle', 'Core group of friends', 'Few close friends', 'Quality over quantity'],
    emoji: '👥'
  },
  {
    id: 'social_3',
    question: 'Meeting new people?',
    category: 'social',
    options: ['Love new connections', 'Open to introductions', 'Warm up slowly', 'Stick with known friends'],
    emoji: '🤝'
  },
  {
    id: 'social_4',
    question: 'Communication style?',
    category: 'social',
    options: ['Text constantly', 'Calls and voice messages', 'Face to face preferred', 'Minimal communication'],
    emoji: '💬'
  },
  {
    id: 'social_5',
    question: 'Social media sharing?',
    category: 'social',
    options: ['Share everything', 'Highlights only', 'Private moments', 'Rarely post'],
    emoji: '📱'
  },
  {
    id: 'social_6',
    question: 'Alone time needs?',
    category: 'social',
    options: ['Need daily solitude', 'Weekly recharge', 'Occasionally', 'Always want company'],
    emoji: '🧘'
  },
  {
    id: 'social_7',
    question: 'Conflict in groups?',
    category: 'social',
    options: ['Address it directly', 'Mediate peacefully', 'Stay out of it', 'Remove myself'],
    emoji: '🕊️'
  },
  {
    id: 'social_8',
    question: 'Birthday celebration style?',
    category: 'social',
    options: ['Big party bash', 'Dinner with friends', 'Intimate gathering', 'Low key or ignore'],
    emoji: '🎂'
  },
  {
    id: 'social_9',
    question: 'Gift giving approach?',
    category: 'social',
    options: ['Thoughtful and personal', 'Practical and useful', 'Experiences over things', 'Keep it simple'],
    emoji: '🎁'
  },
  {
    id: 'social_10',
    question: 'Social event planning?',
    category: 'social',
    options: ['Love organizing', 'Help when asked', 'Just show up', 'Prefer others plan'],
    emoji: '📋'
  },
  {
    id: 'social_11',
    question: 'Networking comfort?',
    category: 'social',
    options: ['Natural networker', 'Professional necessity', 'Awkward but try', 'Avoid networking'],
    emoji: '🤵'
  },
  {
    id: 'social_12',
    question: 'Group decision making?',
    category: 'social',
    options: ['Take charge', 'Offer input', 'Go with majority', 'Whatever others want'],
    emoji: '🗳️'
  },
  {
    id: 'social_13',
    question: 'Social energy recovery?',
    category: 'social',
    options: ['More people = more energy', 'Balance social and alone', 'Need downtime after', 'Drained by crowds'],
    emoji: '🔋'
  },
  {
    id: 'social_14',
    question: 'Loyalty in friendships?',
    category: 'social',
    options: ['Friends for life', 'Evolve naturally', 'Seasonal friendships', 'Practical connections'],
    emoji: '🤗'
  },
  {
    id: 'social_15',
    question: 'Support style?',
    category: 'social',
    options: ['Emotional support', 'Practical solutions', 'Distraction and fun', 'Give space'],
    emoji: '💪'
  },

  // Goals & Aspirations (10 questions)
  {
    id: 'goals_1',
    question: 'Career motivation?',
    category: 'goals',
    options: ['Passion and purpose', 'Financial security', 'Work-life balance', 'Make a difference'],
    emoji: '💼'
  },
  {
    id: 'goals_2',
    question: 'Success definition?',
    category: 'goals',
    options: ['Personal happiness', 'Professional achievement', 'Family and relationships', 'Impact on world'],
    emoji: '🏆'
  },
  {
    id: 'goals_3',
    question: 'Learning approach?',
    category: 'goals',
    options: ['Always growing', 'Practical skills', 'Formal education', 'Life experience'],
    emoji: '📚'
  },
  {
    id: 'goals_4',
    question: 'Risk vs security?',
    category: 'goals',
    options: ['Take big risks', 'Calculated chances', 'Secure foundation', 'Play it safe'],
    emoji: '⚖️'
  },
  {
    id: 'goals_5',
    question: 'Future planning?',
    category: 'goals',
    options: ['Detailed life plan', 'General direction', 'Flexible goals', 'Live in present'],
    emoji: '🗺️'
  },
  {
    id: 'goals_6',
    question: 'Legacy importance?',
    category: 'goals',
    options: ['Leave lasting impact', 'Inspire others', 'Support family', 'Enjoy the journey'],
    emoji: '🌟'
  },
  {
    id: 'goals_7',
    question: 'Challenge approach?',
    category: 'goals',
    options: ['Seek challenges', 'Rise when needed', 'Prefer stability', 'Avoid difficulties'],
    emoji: '⛰️'
  },
  {
    id: 'goals_8',
    question: 'Time vs money?',
    category: 'goals',
    options: ['Time is precious', 'Financial freedom', 'Balance both', 'Depends on situation'],
    emoji: '💰'
  },
  {
    id: 'goals_9',
    question: 'Impact scope?',
    category: 'goals',
    options: ['Change the world', 'Help community', 'Support family/friends', 'Focus on self'],
    emoji: '🌍'
  },
  {
    id: 'goals_10',
    question: 'Retirement dreams?',
    category: 'goals',
    options: ['Travel the world', 'Relaxed simple life', 'New career/hobby', 'Never retire'],
    emoji: '🏖️'
  }
];

// Helper function to get random questions
export function getRandomQuestions(count: number = 5): CompatibilityQuestion[] {
  const shuffled = [...compatibilityQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByCategory(category: CompatibilityQuestion['category']): CompatibilityQuestion[] {
  return compatibilityQuestions.filter(q => q.category === category);
}

// New utility functions for better question management
export function getBalancedRandomQuestions(count: number = 5): CompatibilityQuestion[] {
  const categories: CompatibilityQuestion['category'][] = [
    'lifestyle', 'values', 'entertainment', 'food', 'social', 'goals', 'personality', 'preferences'
  ];
  
  const questionsPerCategory = Math.floor(count / categories.length);
  const remainder = count % categories.length;
  
  let selectedQuestions: CompatibilityQuestion[] = [];
  
  // Get questions from each category
  categories.forEach((category, index) => {
    const categoryQuestions = getQuestionsByCategory(category);
    const numToTake = questionsPerCategory + (index < remainder ? 1 : 0);
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, numToTake));
  });
  
  // Shuffle the final selection
  return selectedQuestions.sort(() => 0.5 - Math.random());
}

export function validateQuestionBank(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for duplicate IDs
  const ids = compatibilityQuestions.map(q => q.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('Duplicate question IDs found');
  }
  
  // Check question structure
  compatibilityQuestions.forEach((q, index) => {
    if (!q.id || !q.question || !q.category || !q.options || !q.emoji) {
      errors.push(`Question at index ${index} is missing required fields`);
    }
    
    if (q.options.length < 2) {
      errors.push(`Question "${q.id}" has less than 2 options`);
    }
    
    if (q.options.length > 6) {
      errors.push(`Question "${q.id}" has more than 6 options (may not display well)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getQuestionStats() {
  const categories = compatibilityQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: compatibilityQuestions.length,
    categories,
    averageOptionsPerQuestion: compatibilityQuestions.reduce((sum, q) => sum + q.options.length, 0) / compatibilityQuestions.length
  };
} 