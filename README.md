# 🚀 LuxLLM - AI Chatbot Embed System

A complete AI-powered chatbot embed system with React frontend and Vercel serverless functions, designed to work both locally and in production.

## ✨ Features

- **🤖 AI-Powered Chatbots**: Integration with OpenRouter API for intelligent responses
- **🌐 Embeddable Widgets**: Easy-to-integrate chatbot scripts for any website
- **📱 React Frontend**: Modern, responsive UI for managing chatbots
- **⚡ Serverless Backend**: Vercel serverless functions for scalable API
- **🗄️ Supabase Database**: PostgreSQL database with Row Level Security
- **🚀 Vercel Deployment**: Production-ready deployment configuration
- **🎨 Customizable Themes**: Beautiful, customizable chatbot designs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │ Vercel Serverless│    │   Supabase      │
│   (Frontend)    │◄──►│   Functions     │◄──►│   (Database)    │
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

```bash
# Start React development server
npm run dev
```

### 4. Production Build

```bash
npm run build
```

## 🌐 Development URLs

- **React App**: http://localhost:8080
- **Export Page**: http://localhost:8080/export
- **Health Check**: http://localhost:8080/health (after deployment)

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
- **Chat API**: https://lux-llm-prod.vercel.app/api/public-chat
- **Health Check**: https://lux-llm-prod.vercel.app/health
- **Embed Scripts**: https://lux-llm-prod.vercel.app/api/embed/[code].js
- **Embed Preview**: https://lux-llm-prod.vercel.app/api/embed/[code]

## 📁 Project Structure

```
├── src/                    # React source code
│   ├── pages/             # Page components
│   │   ├── Export.tsx     # Chatbot export page
│   │   ├── Index.tsx      # Home page
│   │   └── ...            # Other pages
│   ├── components/        # Reusable components
│   └── lib/              # Utilities and services
├── api/                   # Vercel serverless functions
│   ├── public-chat.js     # Chat API endpoint
│   ├── health.js          # Health check endpoint
│   └── embed/             # Embed-related endpoints
│       ├── [embedCode].js # Dynamic embed script
│       └── [embedCode]/   # Dynamic embed preview
│           index.js
├── public/                # Static assets
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start React development server  |
| `npm run build`   | Build React app for production  |
| `npm run preview` | Preview production build        |
| `npm run start`   | Start production preview server |
| `npm run lint`    | Run ESLint                      |

## 🗄️ Database Setup

1. **Run the schema script** in your Supabase SQL editor:

```sql
-- Run supabase_embeds_schema.sql
```

2. **Create your first embed** using the Export page

3. **Test the embed** by visiting `/api/embed/[your-embed-code]`

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
GET /api/embed/[embedCode].js
```

### Embed Preview

```
GET /api/embed/[embedCode]
```

### Health Check

```
GET /api/health
```

## 🎨 Customization

### Chatbot Themes

The embed scripts are dynamically generated with customizable:

- Colors and styling
- Position and size
- Welcome messages
- Typing indicators

### AI Behavior

Update the system prompt in the Export page or modify the API functions for:

- Different AI personalities
- Response styles
- Context handling

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot GET /" Error**

   - Ensure Vercel is configured to serve React app for main routes
   - Check that `vercel.json` has correct routing

2. **Embed Script Not Loading**

   - Verify the serverless functions are deployed
   - Check CORS headers in production
   - Ensure embed code exists in database

3. **AI Responses Not Working**
   - Verify OpenRouter API key is set in Vercel
   - Check API rate limits
   - Ensure network connectivity

### Development Debugging

```bash
# Check React app logs
npm run dev

# Test API endpoints (after deployment)
curl https://your-domain.vercel.app/api/health
```

## 🚀 Serverless Functions

The system now uses Vercel's serverless functions instead of a traditional Express server:

- **`/api/public-chat.js`**: Handles AI chat requests
- **`/api/health.js`**: System health monitoring
- **`/api/embed/[code].js`**: Dynamic embed script generation
- **`/api/embed/[code]/index.js`**: Embed preview pages

This approach provides:

- ✅ **Better scalability** - Automatic scaling based on demand
- ✅ **Cost efficiency** - Pay only for actual usage
- ✅ **Simpler deployment** - No server management needed
- ✅ **Global edge** - Faster response times worldwide

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
