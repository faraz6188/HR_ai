import React, { useState, useRef } from 'react';
import { FileText, Download, Link as LinkIcon, Upload, AlertCircle } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: JSX.Element;
  url?: string;
  date?: string;
  category?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'articles'>('resources');
  const [newArticle, setNewArticle] = useState({
    title: '',
    url: '',
    description: '',
    category: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Employee Handbook',
      description: 'Complete guide to company policies and procedures',
      type: 'PDF',
      icon: <FileText className="h-6 w-6 text-red-500" />,
    },
    {
      id: '2',
      title: 'Benefits Guide',
      description: 'Overview of health, retirement, and other benefits',
      type: 'PDF',
      icon: <FileText className="h-6 w-6 text-blue-500" />,
    },
    {
      id: '3',
      title: 'Vacation Policy',
      description: 'Details about time off and vacation procedures',
      type: 'PDF',
      icon: <FileText className="h-6 w-6 text-green-500" />,
    },
    {
      id: '4',
      title: 'Performance Review Template',
      description: 'Standard template for performance evaluations',
      type: 'DOC',
      icon: <FileText className="h-6 w-6 text-purple-500" />,
    },
  ];

  const [articles, setArticles] = useState<Resource[]>([
    {
      id: 'a1',
      title: 'Getting Started with Employee Sidekick',
      url: 'https://example.com/getting-started',
      description: 'Learn how to make the most of your Employee Sidekick experience',
      type: 'Article',
      icon: <LinkIcon className="h-6 w-6 text-indigo-500" />,
      date: '2024-03-20',
      category: 'Guide'
    },
    {
      id: 'a2',
      title: 'Best Practices for Team Collaboration',
      url: 'https://example.com/team-collaboration',
      description: 'Tips and tricks for effective team collaboration using Employee Sidekick',
      type: 'Article',
      icon: <LinkIcon className="h-6 w-6 text-indigo-500" />,
      date: '2024-03-19',
      category: 'Tips'
    }
  ]);

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Resource = {
      id: Date.now().toString(),
      ...newArticle,
      type: 'Article',
      icon: <LinkIcon className="h-6 w-6 text-indigo-500" />,
      date: new Date().toISOString().split('T')[0]
    };
    setArticles([...articles, article]);
    setNewArticle({ title: '', url: '', description: '', category: '' });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'application/pdf') {
        setUploadedFiles(prev => [...prev, {
          id: Date.now().toString(),
          name: file.name,
          status: 'error',
          error: 'Only PDF files are supported'
        }]);
        continue;
      }

      const fileId = Date.now().toString();
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        name: file.name,
        status: 'uploading'
      }]);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/process_file', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f
        ));
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Resources & Articles</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'resources'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'articles'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Articles
          </button>
        </div>
      </div>

      {activeTab === 'resources' && (
        <div className="mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
            multiple
          />
          <button
            onClick={triggerFileInput}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload PDF
          </button>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center p-3 rounded-md ${
                    file.status === 'success' ? 'bg-green-50' :
                    file.status === 'error' ? 'bg-red-50' :
                    'bg-gray-50'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="flex-1 text-sm">{file.name}</span>
                  {file.status === 'uploading' && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                  {file.status === 'success' && (
                    <span className="text-sm text-green-600">Uploaded</span>
                  )}
                  {file.status === 'error' && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {file.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'articles' && (
        <form onSubmit={handleAddArticle} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="url"
              placeholder="URL"
              value={newArticle.url}
              onChange={(e) => setNewArticle({...newArticle, url: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newArticle.category}
              onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={newArticle.description}
              onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
              className="border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Article
          </button>
        </form>
      )}

      <div className="space-y-4">
        {(activeTab === 'resources' ? resources : articles).map((item) => (
          <div
            key={item.id}
            className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {item.icon}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {item.type}
                </span>
                {item.category && (
                  <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {item.category}
                  </span>
                )}
                {item.date && (
                  <span className="ml-2 text-xs text-gray-500">
                    {item.date}
                  </span>
                )}
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Read More
                  </a>
                ) : (
                <button className="ml-auto flex items-center text-sm text-indigo-600 hover:text-indigo-500">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;