import React from 'react';
import { Calendar, Award, FileText, Heart } from 'lucide-react';
import ChatContainer from '../components/ChatContainer';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Vacation Days', value: '15', icon: <Calendar className="h-8 w-8 text-blue-500" />, color: 'bg-blue-100' },
    { name: 'Next Review', value: 'Jun 15', icon: <Award className="h-8 w-8 text-violet-500" />, color: 'bg-violet-100' },
    { name: 'Policy Updates', value: '3', icon: <FileText className="h-8 w-8 text-emerald-500" />, color: 'bg-emerald-100' },
    { name: 'Benefits', value: '100%', icon: <Heart className="h-8 w-8 text-rose-500" />, color: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white shadow-sm rounded-lg p-5 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask HR Assistant</h2>
        <p className="text-gray-600 mb-6">
          Ask about policies, benefits, time off, or your upcoming performance review. You can type or use voice recognition.
        </p>
        <div className="h-[600px]">
          <ChatContainer />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <ul className="space-y-3">
            <li className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-medium">Team Meeting</p>
              <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
            </li>
            <li className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-medium">Quarterly Review</p>
              <p className="text-sm text-gray-500">June 15, 2:00 PM</p>
            </li>
            <li className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-medium">Benefits Enrollment</p>
              <p className="text-sm text-gray-500">Starts July 1</p>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Resources</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors">
              <FileText className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Employee Handbook</span>
            </button>
            <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Benefits Guide</span>
            </button>
            <button className="p-4 bg-emerald-50 rounded-lg text-center hover:bg-emerald-100 transition-colors">
              <Calendar className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Time Off Request</span>
            </button>
            <button className="p-4 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors">
              <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-800">Performance Tips</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;