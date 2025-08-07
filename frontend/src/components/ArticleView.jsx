import React, { useState } from 'react';

function ArticleView({ article, onBack, onMarkAsRead, onDelete }) {
  const [speaking, setSpeaking] = useState(false);

  const speakArticle = () => {
    if (!article) return;
    
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance();
      const textContent = article.content.replace(/<[^>]*>/g, '');
      utterance.text = `${article.title}. ${textContent}`;
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  if (!article) return null;

  return (
    <div className="article-view">
      <div className="article-view-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <div className="article-view-actions">
          <button onClick={speakArticle} className="speak-btn">
            {speaking ? '⏸️ Pause' : '🔊 Listen'}
          </button>
          <button
            onClick={() => onMarkAsRead(article.id, !article.read_status)}
            className="mark-read-btn"
          >
            {article.read_status ? '📖 Read' : '📕 Unread'}
          </button>
          <button
            onClick={() => {
              onDelete(article.id);
              onBack();
            }}
            className="delete-btn"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      <article className="article-content-view">
        <h1>{article.title}</h1>
        {article.author && <p className="article-author">By {article.author}</p>}
        <p className="article-meta">{article.site_name} • {new Date(article.saved_at).toLocaleString()}</p>
        <div 
          className="article-body" 
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}

export default ArticleView;