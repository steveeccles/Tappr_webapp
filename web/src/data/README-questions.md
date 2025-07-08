# Question Bank Management

## Current Implementation ✅

### Static Question Bank
- **Location**: `web/src/data/compatibilityQuestions.ts`
- **Questions**: 100 curated compatibility questions across 8 categories
- **Storage**: Static TypeScript array (version controlled)
- **Performance**: Zero latency, no Firebase read costs

### Categories (100 questions total)
- **Lifestyle** (20 questions) - Daily habits, preferences, living situations
- **Values** (20 questions) - Core beliefs, decision-making, personality traits  
- **Entertainment** (20 questions) - Movies, music, gaming, social media
- **Food** (15 questions) - Cuisine, cooking, dining preferences
- **Social** (remaining) - Relationships, communication, social settings
- **Goals** - Future aspirations, ambitions
- **Personality** - Behavioral patterns, emotional expression
- **Preferences** - General likes/dislikes

### User Sessions in Firebase 🔥
- **Collection**: `discoverySessions`
- **Contains**: 5 random questions per session + both users' answers
- **Lifecycle**: 48-hour expiration, real-time sync
- **Data**: Session metadata, compatibility scores, timestamps

## Features

### Smart Question Selection
- **Balanced Random**: `getBalancedRandomQuestions()` ensures variety across categories
- **Category Filtering**: `getQuestionsByCategory()` for targeted selection
- **Validation**: `validateQuestionBank()` checks for duplicates and structural issues

### Admin Dashboard
- **URL**: `/admin/questions`
- **Features**: 
  - Question bank validation & health check
  - Category breakdowns and statistics
  - Sample question preview with filtering
  - Real-time question bank testing

### Firebase Integration
- Discovery sessions stored with full question set
- User answers preserved for compatibility calculation
- Real-time sync for session status updates

## Benefits of Current Approach

✅ **Performance**: Instant loading, no network requests  
✅ **Reliability**: No dependency on Firebase for core functionality  
✅ **Version Control**: Questions tracked with code changes  
✅ **Simplicity**: Easy to maintain during development  
✅ **Cost Effective**: No Firebase read costs for questions  

## Future Migration Path

### When to Consider Firebase Migration

**Migrate when you need:**
- Frequent question updates without deployments
- A/B testing different question sets
- Personalized questions by user demographics
- Multi-language support
- Non-technical team members to manage questions
- Question performance analytics

### Migration Strategy

1. **Phase 1**: Keep current static bank as fallback
2. **Phase 2**: Add Firebase question collection alongside static
3. **Phase 3**: Implement admin CRUD interface
4. **Phase 4**: Add question analytics and A/B testing
5. **Phase 5**: Full migration with static as emergency backup

### Implementation Notes

```typescript
// Future Firebase structure
interface QuestionBankConfig {
  id: string;
  version: string;
  questions: CompatibilityQuestion[];
  isActive: boolean;
  createdAt: Date;
  metadata: {
    targetAudience?: string;
    language: string;
    testGroup?: string;
  };
}
```

## Development Workflow

### Adding New Questions
1. Edit `compatibilityQuestions.ts`
2. Follow existing ID pattern: `category_number`
3. Ensure 2-4 options per question
4. Add appropriate emoji
5. Test via admin dashboard

### Testing Questions
1. Visit `/admin/questions`
2. Check validation status
3. Preview random samples
4. Test category filtering
5. Verify balanced selection

### Quality Guidelines
- Keep questions concise (< 50 characters)
- Use relatable, everyday language
- Avoid controversial topics
- Ensure clear option differences
- Test cross-culturally when possible

---

*Current approach optimized for development speed and reliability. Migration path ready when scaling requirements emerge.* 