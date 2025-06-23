import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Search, ExternalLink, Upload, AlertCircle, X } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: 'document' | 'article' | 'link';
  url: string;
  filename?: string;
  icon: JSX.Element;
}

interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

// Define initial non-document resources separately
const initialNonDocumentResources: Resource[] = [
    {
      id: '3',
      title: 'Capton Repository',
      description: "Ohio family's focus on grating has served business well",
      type: 'Article',
      category: 'article',
      url: 'https://www.cantonrep.com/story/news/2017/01/15/ohio-family-s-focus-on/22669207007/',
      icon: <FileText className="h-6 w-6 text-green-500" />,
    },
    {
      id: '4',
      title: 'Mental Health Resources',
      description: 'WHO Support services and wellness programs',
      type: 'Link',
      category: 'link',
      url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work',
      icon: <ExternalLink className="h-6 w-6 text-purple-500" />,
    },
  ];

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'document' | 'article' | 'link'>('all');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // State for managing only uploaded document resources
  const [uploadedDocumentResources, setUploadedDocumentResources] = useState<Resource[]>([]);

  // State for managing non-document resources (articles, links) that can be removed
  const [currentNonDocumentResources, setCurrentNonDocumentResources] = useState<Resource[]>(initialNonDocumentResources);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch already uploaded files on component mount
  useEffect(() => {
    const fetchUploadedDocuments = async () => {
      console.log('[ResourcesPage] Attempting to fetch uploaded files...');
      try {
        const response = await fetch('http://localhost:5000/api/uploaded_files');
        if (!response.ok) {
          console.error('[ResourcesPage] Failed to fetch uploaded files, status:', response.status);
          throw new Error('Failed to fetch uploaded files');
        }

        const files = await response.json();
        console.log('[ResourcesPage] Successfully fetched files:', files);
        
        const fetchedDocumentResources: Resource[] = files.map((file: any) => ({
          id: file.filename, // Use filename as ID for uploaded files
          title: file.original_name ? file.original_name.replace('.pdf', '') : file.filename.replace('.pdf', ''), // Use original name if available, otherwise filename
          description: 'Uploaded document',
          type: 'PDF',
          category: 'document',
          url: file.url, // Use the backend provided download URL
          filename: file.filename,
          icon: <FileText className="h-6 w-6 text-indigo-500" />,
        }));

        // Set the uploaded document resources state
        console.log('[ResourcesPage] Setting uploaded document resources:', fetchedDocumentResources);
        setUploadedDocumentResources(fetchedDocumentResources);

      } catch (error) {
        console.error('[ResourcesPage] Error fetching uploaded files:', error);
        // Optionally set an error state or display a message
      }
    };

    fetchUploadedDocuments();
  }, []); // Empty dependency array ensures this runs only once on mount

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

        const result = await response.json();
        
        // Add the newly uploaded file to the uploadedDocumentResources state
        setUploadedDocumentResources(prevResources => {
          const newResource: Resource = {
            id: result.filename, // Use filename as ID for uploaded files (includes .pdf)
            title: result.original_name ? result.original_name.replace('.pdf', '') : result.filename.replace('.pdf', ''), // Use original name if available
            description: 'Uploaded document',
            type: 'PDF',
            category: 'document',
            url: `/api/download/${result.filename}`, // Use the backend provided download URL
            filename: result.filename, // Ensure filename includes .pdf
            icon: <FileText className="h-6 w-6 text-indigo-500" />,
          };

          // Prevent duplicates (though backend provides unique filenames)
          if (prevResources.some(res => res.id === newResource.id)) {
            return prevResources; 
          } else {
            return [...prevResources, newResource];
          }
        });

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

  const dismissUploadNotification = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Construct the full URL using the base URL of the backend
      const fullUrl = `http://localhost:5000${url}`; // Assuming backend is on localhost:5000
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Combine initial and uploaded documents for filtering and display
  const allResources = [...currentNonDocumentResources, ...uploadedDocumentResources];

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRemoveResource = async (id: string, category: 'document' | 'article' | 'link') => {
    if (category === 'document') {
      // For uploaded documents, remove from uploadedDocumentResources state
      setUploadedDocumentResources(prevResources => prevResources.filter(resource => resource.id !== id));
      console.log(`Removed uploaded document ${id} temporarily from frontend display.`);
    } else {
      // For other resource types (articles, links), remove from the combined list for display
      // Note: This only removes from the current view, not the initial hardcoded list
      setCurrentNonDocumentResources(prevResources => prevResources.filter(resource => resource.id !== id));
      console.log(`Removed non-document resource ${id} from frontend display.`);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'document' | 'article' | 'link')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
          >
            <option value="all">All Resources</option>
            <option value="document">Documents</option>
            <option value="article">Articles</option>
            <option value="link">Links</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {resource.icon}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
                <div className="mt-4 flex items-center">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {resource.type}
                  </span>
                  {resource.category === 'document' ? (
                    <button 
                      onClick={() => handleDownload(resource.url, resource.title + '.pdf')}
                      className="ml-auto flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  ) : (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  )}
                  <button 
                    onClick={() => handleRemoveResource(resource.id, resource.category)}
                    className="ml-2 flex items-center text-sm text-red-600 hover:text-red-500"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Add New Resource</h2>
            <p className="mt-1 text-sm text-gray-500">
              Upload PDF documents or share helpful links with your team
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
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
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full md:w-auto"
            >
            <Upload className="h-4 w-4 mr-2" />
              Upload PDF
          </button>
          </div>
        </div>
        
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
                <button
                  onClick={() => dismissUploadNotification(file.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;