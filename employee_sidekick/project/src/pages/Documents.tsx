import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Calendar, ArrowUpRight, Star, Bell } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  category: string;
  dateAdded: Date;
  fileSize: string;
  fileType: string;
  starred: boolean;
}

const Documents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [starredDocuments, setStarredDocuments] = useState<string[]>([]);

  const documents: Document[] = [
    {
      id: '1',
      title: 'Employee Handbook 2025',
      category: 'Policies',
      dateAdded: new Date(2025, 0, 15),
      fileSize: '2.4 MB',
      fileType: 'PDF',
      starred: true,
    },
    {
      id: '2',
      title: 'Health Benefits Guide',
      category: 'Benefits',
      dateAdded: new Date(2025, 1, 10),
      fileSize: '3.8 MB',
      fileType: 'PDF',
      starred: false,
    },
    {
      id: '3',
      title: 'Performance Review Template',
      category: 'Performance',
      dateAdded: new Date(2025, 2, 5),
      fileSize: '1.2 MB',
      fileType: 'DOC',
      starred: false,
    },
    {
      id: '4',
      title: 'Vacation Request Form',
      category: 'Time Off',
      dateAdded: new Date(2025, 3, 20),
      fileSize: '0.5 MB',
      fileType: 'PDF',
      starred: true,
    },
    {
      id: '5',
      title: 'Remote Work Agreement',
      category: 'Policies',
      dateAdded: new Date(2025, 4, 12),
      fileSize: '0.8 MB',
      fileType: 'PDF',
      starred: false,
    },
    {
      id: '6',
      title: '401(k) Plan Summary',
      category: 'Benefits',
      dateAdded: new Date(2025, 2, 28),
      fileSize: '1.7 MB',
      fileType: 'PDF',
      starred: false,
    },
    {
      id: '7',
      title: 'Expense Reimbursement Form',
      category: 'Finance',
      dateAdded: new Date(2025, 3, 15),
      fileSize: '0.6 MB',
      fileType: 'XLS',
      starred: false,
    },
    {
      id: '8',
      title: 'Code of Conduct',
      category: 'Policies',
      dateAdded: new Date(2025, 1, 5),
      fileSize: '1.1 MB',
      fileType: 'PDF',
      starred: false,
    },
    {
      id: '9',
      title: 'Learning & Development Catalog',
      category: 'Training',
      dateAdded: new Date(2025, 4, 1),
      fileSize: '4.2 MB',
      fileType: 'PDF',
      starred: true,
    },
    {
      id: '10',
      title: 'Emergency Contact Form',
      category: 'HR Forms',
      dateAdded: new Date(2025, 0, 20),
      fileSize: '0.3 MB',
      fileType: 'DOC',
      starred: false,
    },
  ];

  const categories = ['all', ...new Set(documents.map(doc => doc.category))];

  const toggleStar = (id: string) => {
    if (starredDocuments.includes(id)) {
      setStarredDocuments(starredDocuments.filter(docId => docId !== id));
    } else {
      setStarredDocuments([...starredDocuments, id]);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isStarred = (id: string) => {
    return doc => doc.starred || starredDocuments.includes(id);
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: Record<string, string> = {
      'PDF': 'text-red-500',
      'DOC': 'text-blue-500',
      'XLS': 'text-green-500',
    };
    
    return iconMap[fileType] || 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex-shrink-0 relative w-full md:w-64">
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
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <span className="sr-only">Star</span>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Download</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleStar(doc.id)}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <Star 
                        className={`h-5 w-5 ${(doc.starred || starredDocuments.includes(doc.id)) ? 'text-yellow-500 fill-yellow-500' : ''}`} 
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center ${getFileIcon(doc.fileType)}`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.fileType} file</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {doc.dateAdded.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.fileSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Documents</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
              View All <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <ul className="space-y-4">
            {documents
              .sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())
              .slice(0, 3)
              .map((doc) => (
                <li key={doc.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center ${getFileIcon(doc.fileType)}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.dateAdded.toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Starred Documents</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center">
              View All <ArrowUpRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <ul className="space-y-4">
            {documents
              .filter(doc => doc.starred || starredDocuments.includes(doc.id))
              .slice(0, 3)
              .map((doc) => (
                <li key={doc.id} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center ${getFileIcon(doc.fileType)}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.category}</p>
                  </div>
                </li>
              ))}
            {documents.filter(doc => doc.starred || starredDocuments.includes(doc.id)).length === 0 && (
              <li className="text-sm text-gray-500 text-center py-4">
                No starred documents
              </li>
            )}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Document Updates</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <ul className="space-y-4">
            <li className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">Employee Handbook Updated</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </li>
            <li className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">New Benefits Guide Available</p>
              <p className="text-xs text-gray-500">1 week ago</p>
            </li>
            <li className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="text-sm font-medium text-gray-900">Performance Review Templates Updated</p>
              <p className="text-xs text-gray-500">2 weeks ago</p>
            </li>
          </ul>
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
            <h3 className="text-lg font-medium text-gray-900">Can't find what you're looking for?</h3>
            <p className="mt-1 text-gray-600">
              If you need a specific document that isn't listed here, please ask your HR Assistant or contact the HR department directly.
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Request Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;