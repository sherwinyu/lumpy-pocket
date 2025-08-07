const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const cheerio = require('cheerio');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./lumpy.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    author TEXT,
    site_name TEXT,
    image_url TEXT,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT 0
  )`);
});

async function extractArticleContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    
    if (!article) {
      const $ = cheerio.load(response.data);
      return {
        title: $('title').text() || url,
        content: $('body').text() || '',
        excerpt: $('meta[name="description"]').attr('content') || '',
        author: $('meta[name="author"]').attr('content') || '',
        siteName: $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname,
        imageUrl: $('meta[property="og:image"]').attr('content') || ''
      };
    }
    
    return {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.byline,
      siteName: article.siteName || new URL(url).hostname,
      imageUrl: ''
    };
  } catch (error) {
    console.error('Error extracting content:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
}

app.post('/api/articles', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    const articleData = await extractArticleContent(url);
    
    db.run(
      `INSERT OR REPLACE INTO articles (url, title, content, excerpt, author, site_name, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [url, articleData.title, articleData.content, articleData.excerpt, 
       articleData.author, articleData.siteName, articleData.imageUrl],
      function(err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save article' });
        }
        res.json({ 
          id: this.lastID, 
          url,
          title: articleData.title,
          excerpt: articleData.excerpt,
          saved: true 
        });
      }
    );
  } catch (error) {
    console.error('Failed to process URL:', url);
    res.status(500).json({ 
      error: 'Failed to extract article content', 
      details: error.message,
      url: url 
    });
  }
});

app.get('/api/articles', (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  
  db.all(
    `SELECT id, url, title, excerpt, author, site_name, image_url, saved_at, read_status 
     FROM articles 
     ORDER BY saved_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch articles' });
      }
      res.json(rows);
    }
  );
});

app.get('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT * FROM articles WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch article' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json(row);
    }
  );
});

app.patch('/api/articles/:id/read', (req, res) => {
  const { id } = req.params;
  const { read_status } = req.body;
  
  db.run(
    `UPDATE articles SET read_status = ? WHERE id = ?`,
    [read_status ? 1 : 0, id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update read status' });
      }
      res.json({ success: true });
    }
  );
});

app.delete('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(
    `DELETE FROM articles WHERE id = ?`,
    [id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete article' });
      }
      res.json({ success: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});