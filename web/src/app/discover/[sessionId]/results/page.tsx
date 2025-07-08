'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DiscoveryService, { DiscoverySession, CompatibilityResult } from '@/services/discoveryService';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user } = useAuth();
  
  const [session, setSession] = useState<DiscoverySession | null>(null);
  const [results, setResults] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      const discoverySession = await DiscoveryService.getDiscoverySession(sessionId);
      
      if (!discoverySession) {
        setError('Discovery session not found');
        return;
      }

      if (discoverySession.status !== 'completed') {
        setError('This discovery session is not yet completed');
        return;
      }

      setSession(discoverySession);

      // Calculate results
      const compatibilityResults: CompatibilityResult = {
        score: discoverySession.compatibilityScore || 0,
        matches: discoverySession.questions.map(question => ({
          question: question.question,
          initiatorAnswer: discoverySession.initiatorAnswers[question.id] || '',
          targetAnswer: discoverySession.targetAnswers[question.id] || '',
          isMatch: discoverySession.initiatorAnswers[question.id] === discoverySession.targetAnswers[question.id]
        })),
        insights: generateInsights(discoverySession.compatibilityScore || 0)
      };

      setResults(compatibilityResults);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (score: number): string[] => {
    const insights: string[] = [];

    if (score >= 80) {
      insights.push("🎯 You're incredibly compatible! You share similar values and preferences.");
      insights.push("✨ This strong foundation could lead to great conversations and understanding.");
    } else if (score >= 60) {
      insights.push("✨ Great compatibility! You have a solid foundation with some interesting differences.");
      insights.push("🤝 Your similarities can build connection while differences keep things interesting.");
    } else if (score >= 40) {
      insights.push("🤔 Mixed compatibility. You have some things in common but also unique perspectives.");
      insights.push("💡 Different viewpoints can lead to learning and growth together.");
    } else {
      insights.push("🌈 Different perspectives! You might learn a lot from each other.");
      insights.push("🔍 Sometimes opposites attract and create interesting dynamics.");
    }

    return insights;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎯';
    if (score >= 60) return '✨';
    if (score >= 40) return '🤔';
    return '🌈';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!session || !results) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 inline-block mb-4">
            <h1 className="text-2xl font-bold text-indigo-600">Tappr</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Compatibility Results
          </h2>
          <p className="text-gray-600">
            You and {session.targetUserName} have discovered your compatibility!
          </p>
        </div>

        {/* Compatibility Score */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(results.score)} mb-4`}>
              <div className="text-center">
                <div className="text-3xl mb-1">{getScoreEmoji(results.score)}</div>
                <div className="text-3xl font-bold">{results.score}%</div>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Compatibility Score
          </h3>
          
          <div className="max-w-md mx-auto">
            {results.insights.map((insight, index) => (
              <p key={index} className="text-gray-600 mb-2">
                {insight}
              </p>
            ))}
          </div>
        </div>

        {/* Question by Question Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Question Breakdown</h3>
          
          <div className="space-y-6">
            {results.matches.map((match, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex-1">
                    {match.question}
                  </h4>
                  <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                    match.isMatch 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {match.isMatch ? '✓ Match' : '≠ Different'}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-700 mb-1">
                      {session.initiatorName} said:
                    </div>
                    <div className="text-blue-900">
                      "{match.initiatorAnswer}"
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-green-700 mb-1">
                      {session.targetUserName} said:
                    </div>
                    <div className="text-green-900">
                      "{match.targetAnswer}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">💬 Start Chatting</h4>
              <p className="text-gray-600 mb-4">
                You've got plenty to talk about! Use these questions as conversation starters.
              </p>
              <button 
                onClick={() => {
                  // For now, show alert. In production, this would redirect to chat
                  alert('Chat feature coming soon! For now, share contact info through your profiles.');
                }}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Start Conversation
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">📋 View Full Profile</h4>
              <p className="text-gray-600 mb-4">
                Want to learn more? Check out {session.targetUserName}'s full profile.
              </p>
              <button 
                onClick={() => router.push(`/profile/${session.targetUserName.toLowerCase()}`)}
                className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Share Results */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-3">📤 Share Your Results</h4>
              <p className="text-gray-600 mb-4">
                Want to remember this moment? Share your compatibility results!
              </p>
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Copy Link
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 