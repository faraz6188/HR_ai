import React, { useState } from 'react';
import { Heart, Shield, Activity, Gift, BarChart, Globe, Users, ChevronRight, Search } from 'lucide-react';

interface Benefit {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const Benefits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const benefits: Benefit[] = [
    {
      id: '1',
      title: 'Medical Insurance',
      category: 'health',
      description: 'Comprehensive health insurance with coverage for preventive care, hospitalization, and prescription drugs. $500 annual deductible with 90% coverage after deductible.',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: '2',
      title: 'Dental Coverage',
      category: 'health',
      description: 'Dental insurance covering preventive care, basic procedures, and major procedures. Includes two annual check-ups with no co-pay.',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: '3',
      title: 'Vision Care',
      category: 'health',
      description: 'Vision insurance covering annual eye exams, frames, lenses, and contacts. $150 allowance for frames every two years.',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: '4',
      title: 'Life Insurance',
      category: 'insurance',
      description: 'Company-paid life insurance equal to 2x annual salary. Optional supplemental coverage available for employee and dependents.',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: '5',
      title: 'Disability Insurance',
      category: 'insurance',
      description: 'Short-term and long-term disability coverage. Short-term provides 60% of salary for up to 12 weeks. Long-term provides 60% of salary until age 65.',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: '6',
      title: 'Retirement Plan (401k)',
      category: 'financial',
      description: 'Company matches 100% of first 4% of employee contributions. Immediate vesting for employee contributions, 3-year vesting for employer match.',
      icon: <BarChart className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: '7',
      title: 'Employee Stock Purchase Plan',
      category: 'financial',
      description: 'Purchase company stock at 15% discount through payroll deductions. Enrollment periods in January and July.',
      icon: <BarChart className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: '8',
      title: 'Fitness Program',
      category: 'wellness',
      description: '$50 monthly allowance for gym membership or fitness classes. Free access to online fitness programs and resources.',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: '9',
      title: 'Mental Health Support',
      category: 'wellness',
      description: 'Employee Assistance Program with 6 free counseling sessions per issue per year. 24/7 crisis hotline access.',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: '10',
      title: 'Tuition Reimbursement',
      category: 'development',
      description: 'Up to $5,000 per year for job-related courses or degree programs. Requires minimum grade of B for reimbursement.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: '11',
      title: 'Professional Development',
      category: 'development',
      description: '$2,000 annual budget for conferences, workshops, and certifications. Requires manager approval.',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: '12',
      title: 'Paid Parental Leave',
      category: 'worklife',
      description: '12 weeks of paid leave for primary caregivers, 4 weeks for secondary caregivers. Available after 1 year of employment.',
      icon: <Gift className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: '13',
      title: 'Remote Work Options',
      category: 'worklife',
      description: 'Flexible work arrangements including hybrid and remote options based on role and manager approval.',
      icon: <Gift className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: '14',
      title: 'Travel Insurance',
      category: 'travel',
      description: 'Coverage for business travel including emergency medical, trip cancellation, and lost baggage.',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Benefits', icon: <Gift className="h-5 w-5" /> },
    { id: 'health', name: 'Health', icon: <Heart className="h-5 w-5" /> },
    { id: 'insurance', name: 'Insurance', icon: <Shield className="h-5 w-5" /> },
    { id: 'financial', name: 'Financial', icon: <BarChart className="h-5 w-5" /> },
    { id: 'wellness', name: 'Wellness', icon: <Activity className="h-5 w-5" /> },
    { id: 'development', name: 'Development', icon: <Users className="h-5 w-5" /> },
    { id: 'worklife', name: 'Work-Life', icon: <Gift className="h-5 w-5" /> },
    { id: 'travel', name: 'Travel', icon: <Globe className="h-5 w-5" /> },
  ];

  const filteredBenefits = benefits.filter(benefit => {
    const matchesSearch = benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          benefit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || benefit.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Health Benefits & Perks</h1>
      
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg shadow-md p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Benefits Package</h2>
            <p className="text-indigo-100 mb-4">
              Explore our comprehensive benefits designed to support your health, financial security, and work-life balance.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-indigo-100">Plan Type</p>
                <p className="font-semibold">Premium Plus</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-indigo-100">Coverage</p>
                <p className="font-semibold">Employee + Family</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-indigo-100">Effective Date</p>
                <p className="font-semibold">Jan 1, 2025</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-indigo-100">Next Enrollment</p>
                <p className="font-semibold">Nov 1-15, 2025</p>
              </div>
            </div>
            <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
              Download Benefits Guide
            </button>
          </div>
          <div className="hidden md:block">
            <div className="aspect-square max-w-xs mx-auto flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Abstract graphic representation of benefits */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full opacity-80"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-purple-500 rounded-full opacity-80"></div>
                <div className="absolute top-2/5 left-2/5 w-1/5 h-1/5 bg-white rounded-full opacity-90"></div>
                {/* Icon overlays */}
                <div className="absolute top-1/6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <div className="absolute top-1/2 right-1/6 bg-white rounded-full p-2 shadow-lg">
                  <Gift className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Browse Benefits</h2>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-3 py-2 rounded-lg whitespace-nowrap ${
                  activeCategory === category.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredBenefits.length > 0 ? (
            filteredBenefits.map((benefit) => (
              <div key={benefit.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${benefit.color}`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{benefit.title}</h3>
                      <p className="mt-1 text-gray-500 line-clamp-3">{benefit.description}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                  <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No benefits found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Benefit Events</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <p className="font-medium text-gray-800">Open Enrollment</p>
                <p className="text-sm text-gray-500">November 1-15, 2025</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Upcoming</span>
            </li>
            <li className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <p className="font-medium text-gray-800">Benefits Webinar</p>
                <p className="text-sm text-gray-500">July 15, 2025</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Registration Open</span>
            </li>
            <li className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Wellness Challenge</p>
                <p className="text-sm text-gray-500">August 1-31, 2025</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Coming Soon</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-4">
            Ask your HR Assistant about benefits, coverage details, or claim procedures. You can also contact HR directly.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50">
              Contact HR
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Ask Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;