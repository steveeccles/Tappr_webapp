'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DiscoveryService, { DiscoverySession } from '@/services/discoveryService';
import { CompatibilityQuestion } from '@/data/compatibilityQuestions';

export default function DiscoveryPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const { user } = useAuth();
  
  const [session, setSession] = useState<DiscoverySession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const discoverySession = await DiscoveryService.getDiscoverySession(sessionId);
      
      if (!discoverySession) {
        setError('Discovery session not found');
        return;
      }

      // Check if session is expired
      if (discoverySession.expiresAt < new Date()) {
        setError('This discovery session has expired');
        return;
      }

      // Check if user is authorized to view this session
      if (!user) {
        // Anonymous user, they should be the initiator
        if (discoverySession.status !== 'pending_initiator') {
          setError('This session is not available');
          return;
        }
      } else {
        // Authenticated user, check if they're part of this session
        if (user.uid !== discoverySession.initiatorId && user.uid !== discoverySession.targetUserId) {
          setError('You are not authorized to view this session');
          return;
        }
      }

      setSession(discoverySession);
    } catch (error) {
      console.error('Error loading session:', error);
      setError('Failed to load discovery session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < session!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!session) return;

    try {
      setSubmitting(true);
      
      await DiscoveryService.submitInitiatorAnswers(sessionId, answers);
      
      // Navigate to waiting page
      router.push(`/discover/${sessionId}/waiting`);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    const currentQuestion = session?.questions[currentQuestionIndex];
    return currentQuestion && answers[currentQuestion.id];
  };

  const allQuestionsAnswered = () => {
    if (!session) return false;
    return session.questions.every(q => answers[q.id]);
  };

  const getProgressPercentage = () => {
    if (!session) return 0;
    const answeredCount = session.questions.filter(q => answers[q.id]).length;
    return (answeredCount / session.questions.length) * 100;
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

  if (!session) return null;

  const currentQuestion = session.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 inline-block mb-4">
            <h1 className="text-2xl font-bold text-indigo-600">Tappr</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Compatibility Discovery
          </h2>
          <p className="text-gray-600">
            Answer these questions to see how compatible you are with {session.targetUserName}!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">{currentQuestion.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentQuestion.question}
            </h3>
            <p className="text-sm text-gray-500 capitalize">
              {currentQuestion.category} • Question {currentQuestionIndex + 1}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-colors ${
                  answers[currentQuestion.id] === option
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[currentQuestion.id] === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered() || submitting}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </button>
          )}
        </div>

        {/* Question Overview */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-5 gap-2">
            {session.questions.map((question, index) => (
              <div
                key={question.id}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  answers[question.id]
                    ? 'bg-green-100 text-green-700'
                    : index === currentQuestionIndex
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {answers[question.id] ? '✓' : index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 