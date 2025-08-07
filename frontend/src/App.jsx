import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import AddArticle from './components/AddArticle';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleAddArticle = async (url) => {
    setLoading(true);
    try {
      await axios.post('/api/articles', { url });
      await fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Failed to add article');
    }
    setLoading(false);
  };

  const handleSelectArticle = async (id) => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      setSelectedArticle(response.data);
      setView('article');
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const handleMarkAsRead = async (id, readStatus) => {
    try {
      await axios.patch(`/api/articles/${id}/read`, { read_status: readStatus });
      await fetchArticles();
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await axios.delete(`/api/articles/${id}`);
        await fetchArticles();
        if (selectedArticle?.id === id) {
          setSelectedArticle(null);
          setView('list');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => setView('list')}>Lumpy Pocket</h1>
        <AddArticle onAdd={handleAddArticle} loading={loading} />
      </header>
      
      <main className="app-main">
        {view === 'list' ? (
          <ArticleList 
            articles={articles}
            onSelect={handleSelectArticle}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        ) : (
          <ArticleView 
            article={selectedArticle}
            onBack={() => setView('list')}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;