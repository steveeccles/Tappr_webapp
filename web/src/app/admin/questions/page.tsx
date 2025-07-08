'use client';

import { useState, useEffect } from 'react';
import { 
  validateQuestionBank, 
  getQuestionStats, 
  getBalancedRandomQuestions,
  getQuestionsByCategory,
  CompatibilityQuestion 
} from '@/data/compatibilityQuestions';

export default function QuestionsAdmin() {
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [sampleQuestions, setSampleQuestions] = useState<CompatibilityQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load validation and stats
    const validation = validateQuestionBank();
    setValidation(validation);
    setStats(getQuestionStats());
    setSystemHealth({
      questionBank: validation,
      ready: validation.isValid
    });
    setSampleQuestions(getBalancedRandomQuestions(5));
  }, []);

  const refreshSample = () => {
    setSampleQuestions(getBalancedRandomQuestions(5));
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSampleQuestions(getBalancedRandomQuestions(10));
    } else {
      setSampleQuestions(getQuestionsByCategory(category as any));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Question Bank Admin</h1>
        
        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Health</h2>
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              systemHealth?.ready ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {systemHealth?.ready ? '✅ Ready' : '❌ Issues Found'}
            </div>
            {validation && (
              <span className="text-gray-600">
                {validation.isValid ? 'All validations passed' : `${validation.errors.length} errors found`}
              </span>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {validation && !validation.isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Validation Errors</h3>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-red-700">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Questions</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
            <p className="text-3xl font-bold text-green-600">{stats ? Object.keys(stats.categories).length : 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Options</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats ? stats.averageOptionsPerQuestion.toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Questions by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats && Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 capitalize">{category}</p>
                <p className="text-2xl font-bold text-gray-900">{count as number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sample Questions</h2>
            <div className="flex space-x-2">
              <select 
                value={selectedCategory}
                onChange={(e) => filterByCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {stats && Object.keys(stats.categories).map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={refreshSample}
                className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Refresh Sample
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sampleQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{question.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900">{question.question}</h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded capitalize">
                        {question.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((option, optIndex) => (
                        <span 
                          key={optIndex}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sampleQuestions.length === 0 && (
            <p className="text-gray-500 text-center py-8">No questions found for the selected category.</p>
          )}
        </div>
      </div>
    </div>
  );
} 