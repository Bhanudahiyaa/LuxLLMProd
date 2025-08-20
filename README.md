# 🚀 LuxLLM - AI Chatbot Embed System

A complete AI-powered chatbot embed system with React frontend and Express backend, designed to work both locally and in production on Vercel.

## ✨ Features

- **🤖 AI-Powered Chatbots**: Integration with OpenRouter API for intelligent responses
- **🌐 Embeddable Widgets**: Easy-to-integrate chatbot scripts for any website
- **📱 React Frontend**: Modern, responsive UI for managing chatbots
- **🔧 Express Backend**: Robust API server for chatbot functionality
- **🗄️ Supabase Database**: PostgreSQL database with Row Level Security
- **🚀 Vercel Deployment**: Production-ready deployment configuration
- **🎨 Customizable Themes**: Beautiful, customizable chatbot designs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Express API    │    │   Supabase      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Export Page   │    │ • Chat API      │    │ • Embed Configs │
│ • Chatbot UI    │    │ • Embed Scripts │    │ • Conversations │
│ • Settings      │    │ • Analytics     │    │ • Messages      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenRouter API key

### 1. Clone & Install

```bash
git clone <your-repo>
cd t3dotgg-launchpad
npm install
```

### 2. Environment Setup

Create a `.env.local` file in your project root:

```bash
# AI API Configuration
VITE_OPENROUTER_API_KEY=your_openrouter_api_key

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Development Mode

#### Option A: Run Everything Together
```bash
npm run dev:all
```
This starts both the React app and embed API server simultaneously.

#### Option B: Run Separately
```bash
# Terminal 1: React App (Vite dev server)
npm run dev

# Terminal 2: Embed API Server
npm run dev:server
```

### 4. Production Build

```bash
npm run build
```

## 🌐 Development URLs

- **React App**: http://localhost:8080
- **Embed API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Embed Preview**: http://localhost:3001/embed/test-embed

## 🚀 Production Deployment

### Vercel Deployment

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

2. **Deploy to Vercel**:
```bash
vercel --prod
```

3. **Set Environment Variables** in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NODE_ENV=production`

### Production URLs

- **Main Website**: https://lux-llm-prod.vercel.app/
- **Export Page**: https://lux-llm-prod.vercel.app/export
- **Embed API**: https://lux-llm-prod.vercel.app/api/public-chat
- **Health Check**: https://lux-llm-prod.vercel.app/health

## 📁 Project Structure

```
├── src/                    # React source code
│   ├── pages/             # Page components
│   │   ├── Export.tsx     # Chatbot export page
│   │   ├── Index.tsx      # Home page
│   │   └── ...            # Other pages
│   ├── components/        # Reusable components
│   └── lib/              # Utilities and services
├── public/                # Static assets
│   └── embed-template.js  # Chatbot embed template
├── server.js              # Express API server
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start React development server |
| `npm run dev:server` | Start embed API server |
| `npm run dev:all` | Start both servers simultaneously |
| `npm run build` | Build React app for production |
| `npm run preview` | Preview production build |
| `npm run start` | Start production preview server |
| `npm run start:server` | Start production embed API server |

## 🗄️ Database Setup

1. **Run the schema script** in your Supabase SQL editor:
```sql
-- Run supabase_embeds_schema.sql
```

2. **Create your first embed** using the Export page

3. **Test the embed** by visiting `/embed/[your-embed-code]`

## 🔌 API Endpoints

### Public Chat API
```
POST /api/public-chat
Content-Type: application/json

{
  "embedCode": "your-embed-code",
  "message": "Hello, how are you?",
  "sessionId": "unique-session-id"
}
```

### Embed Scripts
```
GET /embed/[embedCode].js
```

### Health Check
```
GET /health
```

## 🎨 Customization

### Chatbot Themes
Modify the embed template in `public/embed-template.js` to customize:
- Colors and styling
- Position and size
- Welcome messages
- Typing indicators

### AI Behavior
Update the system prompt in the Export page or modify `server.js` for:
- Different AI personalities
- Response styles
- Context handling

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot GET /" Error**
   - Ensure Vercel is configured to serve React app for main routes
   - Check that `vercel.json` has correct routing

2. **Embed Script Not Loading**
   - Verify the embed API server is running
   - Check CORS headers in production
   - Ensure embed code exists in database

3. **AI Responses Not Working**
   - Verify OpenRouter API key is set
   - Check API rate limits
   - Ensure network connectivity

### Development Debugging

```bash
# Check server logs
npm run dev:server

# Check React app logs
npm run dev

# Test API endpoints
curl http://localhost:3001/health
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [React Router](https://reactrouter.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally and in production
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Made with ❤️ by LuxLLM Team**
