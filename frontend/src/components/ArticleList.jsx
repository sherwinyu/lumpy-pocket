import React from 'react';

function ArticleList({ articles, onSelect, onMarkAsRead, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="article-list">
      {articles.length === 0 ? (
        <p className="empty-state">No saved articles yet. Add one above!</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} className={`article-item ${article.read_status ? 'read' : ''}`}>
            <div className="article-content" onClick={() => onSelect(article.id)}>
              <h3>{article.title}</h3>
              <p className="article-meta">
                {article.site_name} • {formatDate(article.saved_at)}
              </p>
              {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
            </div>
            <div className="article-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(article.id, !article.read_status);
                }}
                className="mark-read-btn"
              >
                {article.read_status ? '📖' : '📕'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(article.id);
                }}
                className="delete-btn"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ArticleList;