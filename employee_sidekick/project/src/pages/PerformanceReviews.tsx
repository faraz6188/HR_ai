import React from 'react';
import { Calendar, Award, ArrowUpRight, FileText, CheckCircle } from 'lucide-react';

const PerformanceReviews: React.FC = () => {
  const upcomingReview = {
    date: new Date(2025, 5, 15),
    type: 'Quarterly',
    manager: 'Sarah Johnson',
    status: 'Scheduled',
  };

  const pastReviews = [
    {
      id: 1,
      date: new Date(2025, 2, 15),
      type: 'Quarterly',
      rating: 4.5,
      summary: 'Excellent performance with strong communication skills. Met all objectives for the quarter.',
      goals: ['Improve technical skills', 'Take on more project leadership', 'Mentor a junior team member'],
    },
    {
      id: 2,
      date: new Date(2024, 11, 15),
      type: 'Quarterly',
      rating: 4.2,
      summary: 'Very good performance with consistent delivery. Helped team overcome challenges on Project X.',
      goals: ['Work on presentation skills', 'Complete advanced certification', 'Contribute to documentation'],
    },
  ];

  const resources = [
    { id: 1, title: 'Performance Review Guide', type: 'PDF', icon: <FileText className="h-5 w-5 text-indigo-500" /> },
    { id: 2, title: 'Self-Assessment Template', type: 'DOC', icon: <FileText className="h-5 w-5 text-blue-500" /> },
    { id: 3, title: 'Goal Setting Workshop', type: 'Video', icon: <FileText className="h-5 w-5 text-emerald-500" /> },
    { id: 4, title: 'Feedback Framework', type: 'PDF', icon: <FileText className="h-5 w-5 text-purple-500" /> },
  ];

  const preparationSteps = [
    { id: 1, title: 'Complete self-assessment', completed: true },
    { id: 2, title: 'Review quarterly goals', completed: true },
    { id: 3, title: 'Gather peer feedback', completed: false },
    { id: 4, title: 'Prepare discussion topics', completed: false },
    { id: 5, title: 'Update skills & achievements list', completed: false },
  ];

  const remainingDays = Math.floor((upcomingReview.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Performance Reviews</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-indigo-800 text-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Upcoming Review</h2>
                <p className="text-indigo-200 text-sm mb-4">Prepare for your next performance discussion</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">Date</p>
                    <p className="text-lg font-medium flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {upcomingReview.date.toLocaleDateString('en-US', { 
                        year: 'numeric',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">Type</p>
                    <p className="text-lg font-medium flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      {upcomingReview.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">Manager</p>
                    <p className="text-lg font-medium">{upcomingReview.manager}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-xs mb-1">Time Remaining</p>
                    <p className="text-lg font-medium">{remainingDays} days</p>
                  </div>
                </div>
                
                <button className="bg-white text-indigo-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors">
                  Prepare Now
                </button>
              </div>
              
              <div className="bg-indigo-700 rounded-full h-24 w-24 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">{remainingDays}</p>
                  <p className="text-xs text-indigo-200">days left</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preparation Checklist</h2>
            <ul className="space-y-3">
              {preparationSteps.map((step) => (
                <li key={step.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100 text-green-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 ${step.completed ? 'text-gray-800' : 'text-gray-600'}`}>
                    {step.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Past Reviews</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {pastReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.type} Review</p>
                      <p className="text-sm text-gray-500">
                        {review.date.toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {review.rating}/5
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{review.summary}</p>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Goals:</p>
                    <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                      {review.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">Communication</p>
                  <p className="text-sm font-medium text-gray-700">4.5/5</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">Technical Skills</p>
                  <p className="text-sm font-medium text-gray-700">4.2/5</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">Leadership</p>
                  <p className="text-sm font-medium text-gray-700">3.8/5</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">Initiative</p>
                  <p className="text-sm font-medium text-gray-700">4.0/5</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {resource.icon}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{resource.title}</p>
                    <p className="text-xs text-gray-500">{resource.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Need Assistance?</h2>
            <p className="text-indigo-100 text-sm mb-4">
              Contact HR for help with your review process or ask your HR Assistant directly.
            </p>
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
              Contact HR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviews;