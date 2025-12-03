# 📚 AI-Based Learning Aggregator

> **Search once. Learn smarter. Let AI organize everything.**

---

## 🔷 Overview

The **AI-Based Learning Aggregator** is an AI-powered educational web platform designed to collect, evaluate, filter, summarize, and organize learning resources from across the internet into one unified workspace.

Students today struggle to learn effectively due to scattered resources, inconsistent quality, and overwhelming information overload. Searching manually across YouTube, blogs, and PDFs wastes time and often leads to poorly structured or irrelevant resources. This platform solves that challenge using Artificial Intelligence to automatically rank content and deliver **high-quality, topic-specific study packages instantly** along with summaries, transcripts, tutoring, concept mapping, and progress tracking.

---

## 🚀 Features

### 🔎 Intelligent Resource Aggregation
Aggregates learning materials from:
- YouTube videos & playlists
- Blogs and articles
- Public educational PDFs

AI ranking parameters:
- Popularity (views, likes, engagement)
- Relevance to topic
- Creator credibility
- Content quality and depth
- Duration suitability
- Content recency

---

### 🧠 AI Transcription & Summarization
- Automatic transcript generation for videos.
- AI-generated summaries:
  - Bullet note format
  - Paragraph format
  - Ultra-short revision format.
- Key-point extraction and redundancy removal.

---

### 💬 Topic-Specific AI Tutor
Chat-based tutor for each learning topic:
- Answers doubts
- Explains concepts simply
- Conducts quizzes
- Simplifies summaries

---

### 🗺 Concept Map Generator
- Automatic generation of topic trees.
- Visual mapping of subtopics.
- Interactive exploration of learning pathways.

---

### 🧑‍💼 Personalized Learning Workspace
- Saved learning sessions
- Bookmarked material
- Topic clustering
- Resume from prior sessions

---

### 📈 Learning Progress Tracker
- Daily learning streak monitoring
- Completed topic stats
- Learning-duration analytics
- Resource usage tracking

---

### ⚙ Content Filtering & Sorting
- **Difficulty:** Beginner | Intermediate | Advanced  
- **Duration:** Short | Medium | Long  
- **Format:** Videos | PDFs | Articles  
- **Sorting:** Relevance | Popularity | AI Quality | Newest

---

---

## 🏗 System Architecture

```text
User Query
    |
    v
Data Collection Layer
(YouTube API, Web Scraping, PDFs)
    |
    v
Metadata Analysis Engine
    |
    v
AI Ranking & Filtering Model
    |
    v
Transcript & NLP Summarization Pipeline
    |
    v
Concept Map Generator + AI Tutor
    |
    v
Personalized Learning Workspace



View your app in AI Studio: https://ai.studio/apps/drive/1Oqw1Q2Ef9jtMedjR_jYlaqFVgoiGg0QU

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
