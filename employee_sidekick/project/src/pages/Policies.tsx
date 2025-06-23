import React, { useState } from 'react';
import { Search, Filter, FileText, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  category: string;
  lastUpdated: Date;
  content: string;
}

const Policies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const policies: Policy[] = [
    {
      id: '1',
      title: 'Remote Work Policy',
      category: 'Work Arrangements',
      lastUpdated: new Date(2025, 4, 10),
      content: 'Employees may work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented and reviewed quarterly. All employees must be available during core hours (10am-3pm) and maintain productivity expectations.',
    },
    {
      id: '2',
      title: 'Annual Leave Policy',
      category: 'Time Off',
      lastUpdated: new Date(2025, 3, 15),
      content: 'Full-time employees accrue 20 days of annual leave per year. Leave requests must be submitted at least 2 weeks in advance for periods exceeding 3 days. Unused leave can be carried over with a maximum of 5 days per year.',
    },
    {
      id: '3',
      title: 'Sick Leave Policy',
      category: 'Time Off',
      lastUpdated: new Date(2025, 2, 20),
      content: 'Employees receive 10 sick days per year. Doctor\'s note required for absences exceeding 3 consecutive days. Unused sick leave does not carry over to the following year.',
    },
    {
      id: '4',
      title: 'Workplace Conduct',
      category: 'Behavior',
      lastUpdated: new Date(2024, 11, 5),
      content: 'All employees must maintain professional conduct in the workplace. Harassment of any kind is not tolerated. Report any misconduct to HR immediately. Violations may result in disciplinary action up to and including termination.',
    },
    {
      id: '5',
      title: 'Health and Safety Guidelines',
      category: 'Workplace',
      lastUpdated: new Date(2025, 1, 12),
      content: 'Employees must follow all safety protocols. Report unsafe conditions immediately. First aid kits are located on each floor. Emergency evacuation plans are posted near all exits. Annual safety training is mandatory for all employees.',
    },
    {
      id: '6',
      title: 'Travel Expense Policy',
      category: 'Finance',
      lastUpdated: new Date(2025, 4, 25),
      content: 'All business travel must be pre-approved. Expenses must be submitted within 14 days of trip completion with receipts. Per diem rates apply based on location. Personal expenses will not be reimbursed.',
    },
    {
      id: '7',
      title: 'Information Security Policy',
      category: 'Security',
      lastUpdated: new Date(2025, 5, 1),
      content: 'All employees must use strong passwords and change them quarterly. Company data should never be shared on personal devices. Report any security incidents immediately. Annual security training is required.',
    },
  ];

  const categories = ['all', ...new Set(policies.map(policy => policy.category))];

  const toggleExpand = (id: string) => {
    if (expandedPolicy === id) {
      setExpandedPolicy(null);
    } else {
      setExpandedPolicy(id);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         policy.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Company Policies</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex-shrink-0 relative w-full md:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 capitalize"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
              <div key={policy.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  onClick={() => toggleExpand(policy.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{policy.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs capitalize mr-3">
                          {policy.category}
                        </span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Updated {policy.lastUpdated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {expandedPolicy === policy.id ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                </div>
                
                {expandedPolicy === policy.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{policy.content}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium px-3 py-1">
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No policies found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Need a specific policy?</h3>
            <p className="mt-1 text-gray-600">
              If you're looking for a policy that isn't listed here, you can request it from HR or ask your HR Assistant.
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Request Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;