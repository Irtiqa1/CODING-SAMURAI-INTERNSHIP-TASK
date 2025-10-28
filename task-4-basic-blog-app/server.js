require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(ejsLayouts);

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Routes

// GET all posts (Homepage)
app.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.render('index', { 
      posts,
      activePage: 'home',
      title: 'BlogSphere - Your Space for Thoughts and Ideas'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET all posts page (dedicated page)
app.get('/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.render('posts', { 
      posts,
      activePage: 'posts',
      title: 'All Posts | BlogSphere'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET about page
app.get('/about', async (req, res) => {
  try {
    const postsCount = await BlogPost.countDocuments();
    res.render('about', { 
      posts: [], // We don't need posts for about page, but keeping structure
      postsCount,
      activePage: 'about',
      title: 'About BlogSphere | Share Your Stories'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET new post form
app.get('/posts/new', (req, res) => {
  res.render('new', { 
    activePage: 'new',
    title: 'Create New Post | BlogSphere'
  });
});

// POST create new post
app.post('/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new BlogPost({ title, content, author });
    await newPost.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET single post
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('show', { 
      post,
      activePage: 'posts',
      title: `${post.title} | BlogSphere`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET edit post form
app.get('/posts/:id/edit', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('edit', { 
      post,
      activePage: 'edit',
      title: `Edit: ${post.title} | BlogSphere`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// PUT update post
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );
    if (!updatedPost) {
      return res.status(404).send('Post not found');
    }
    res.redirect(`/posts/${updatedPost._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// DELETE post
app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`BlogSphere running on http://localhost:${PORT}`);
});