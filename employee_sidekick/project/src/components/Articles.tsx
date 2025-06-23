import React, { useState } from 'react';

interface Article {
  id: string;
  title: string;
  url: string;
  description: string;
  date: string;
  category: string;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Getting Started with Employee Sidekick',
      url: 'https://example.com/getting-started',
      description: 'Learn how to make the most of your Employee Sidekick experience',
      date: '2024-03-20',
      category: 'Guide'
    },
    {
      id: '2',
      title: 'Best Practices for Team Collaboration',
      url: 'https://example.com/team-collaboration',
      description: 'Tips and tricks for effective team collaboration using Employee Sidekick',
      date: '2024-03-19',
      category: 'Tips'
    }
  ]);

  const [newArticle, setNewArticle] = useState({
    title: '',
    url: '',
    description: '',
    category: ''
  });

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Article = {
      id: Date.now().toString(),
      ...newArticle,
      date: new Date().toISOString().split('T')[0]
    };
    setArticles([...articles, article]);
    setNewArticle({ title: '', url: '', description: '', category: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Articles & Resources</h2>
      
      {/* Add new article form */}
      <form onSubmit={handleAddArticle} className="mb-8 bg-white p-4 rounded-lg shadow">
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
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Article
        </button>
      </form>

      {/* Articles list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                {article.category}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{article.description}</p>
            <div className="flex justify-between items-center">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                Read More →
              </a>
              <span className="text-sm text-gray-500">{article.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles; 