# 🚀 LuxLLM Embed System Setup Guide

This guide will walk you through setting up the complete embeddable chatbot system.

## 📋 **What We've Built**

✅ **Database Schema** - Tables for embeds, conversations, messages, and analytics  
✅ **Public Chat API** - Handles chat requests from embedded chatbots  
✅ **Embed Service** - Manages embed creation and configuration  
✅ **Script Generator** - Creates personalized embed scripts  
✅ **Express Server** - Serves API endpoints and embed files  
✅ **Updated Export Page** - UI for creating and managing embeds

## 🗄️ **Step 1: Set Up Database**

### 1.1 Run the Database Schema

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Copy and paste the contents of supabase_embeds_schema.sql
-- This creates all necessary tables and functions
```

### 1.2 Verify Tables Created

You should see these new tables:

- `public_embeds` - Embed configurations
- `public_conversations` - Chat sessions
- `public_messages` - Individual messages
- `public_analytics` - Usage statistics

## 🖥️ **Step 2: Set Up Express Server**

### 2.1 Install Dependencies

```bash
# Navigate to your project directory
cd /Users/bhanudahiya/t3dotgg-launchpad

# Install server dependencies
npm install express cors

# Install dev dependencies (optional)
npm install --save-dev nodemon
```

### 2.2 Start the Server

```bash
# Start the server
node server.js

# Or for development with auto-restart
npx nodemon server.js
```

### 2.3 Verify Server is Running

You should see:

```
🚀 Server running on port 3001
📡 Public Chat API: http://localhost:3001/api/public-chat
📦 Embed Files: http://localhost:3001/embed/[embedCode].js
👀 Health Check: http://localhost:3001/health
```

## 🔧 **Step 3: Test the System**

### 3.1 Create an Embed

1. Go to your app's Export page
2. Fill in the embed configuration:
   - **Name**: "My Website Chatbot"
   - **Description**: "Customer support chatbot"
   - **Max Requests/Hour**: 100
   - **Max Requests/Day**: 1000
3. Click "Create Embed"
4. Copy the generated embed code

### 3.2 Test the Embed

1. Create a simple HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Chatbot Test</title>
  </head>
  <body>
    <h1>Welcome to my website</h1>
    <p>This is where your chatbot will appear.</p>

    <!-- Add your embed script here -->
    <script src="http://localhost:3001/embed/YOUR_EMBED_CODE.js"></script>
  </body>
</html>
```

2. Open the HTML file in a browser
3. Look for the floating chat button
4. Click it and test the chat functionality

## 🌐 **Step 4: Deploy to Production**

### 4.1 Update API URLs

In your production environment, update these URLs:

**In `server.js`:**

```javascript
// Change from localhost to your domain
const API_BASE_URL = "https://your-domain.com";
```

**In `src/lib/dynamicEmbedGenerator.ts`:**

```typescript
// Update the fetch URL
const response = await fetch("https://your-domain.com/api/public-chat", {
  // ... rest of the code
});
```

### 4.2 Environment Variables

Set these environment variables on your server:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
PORT=3001  # or whatever port you prefer
```

### 4.3 Deploy Options

**Option A: Vercel (Recommended)**

1. Create a new Vercel project
2. Upload your server files
3. Set environment variables in Vercel dashboard
4. Deploy

**Option B: DigitalOcean/AWS**

1. Set up a VPS or EC2 instance
2. Install Node.js
3. Upload your files
4. Use PM2 or similar to run the server
5. Set up nginx as reverse proxy

**Option C: Railway/Render**

1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically

## 🔍 **Step 5: Monitor and Debug**

### 5.1 Check Server Logs

```bash
# View server logs
tail -f server.log

# Check for errors
grep "ERROR" server.log
```

### 5.2 Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Test public chat (replace with actual data)
curl -X POST http://localhost:3001/api/public-chat \
  -H "Content-Type: application/json" \
  -d '{
    "embedCode": "your-embed-code",
    "message": "Hello",
    "sessionId": "test-session"
  }'
```

### 5.3 Check Database

In Supabase dashboard:

1. Go to Table Editor
2. Check `public_embeds` table for your embeds
3. Check `public_conversations` for chat sessions
4. Check `public_messages` for individual messages

## 🚨 **Common Issues & Solutions**

### Issue 1: "Embed not found or inactive"

**Solution**: Check that:

- Embed code exists in `public_embeds` table
- `is_active` is set to `true`
- Agent exists and is properly linked

### Issue 2: "Rate limit exceeded"

**Solution**:

- Increase rate limits in embed configuration
- Check if you're hitting the default limits (100/hour, 1000/day)

### Issue 3: "AI API error"

**Solution**:

- Verify `VITE_OPENROUTER_API_KEY` is set
- Check OpenRouter API quota
- Ensure the model `openai/gpt-oss-20b` is available

### Issue 4: CORS errors

**Solution**: The server is configured to allow all origins (`*`). If you need to restrict:

```javascript
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://anotherdomain.com"],
    // ... other options
  })
);
```

## 📊 **Analytics & Monitoring**

### View Embed Statistics

The system automatically tracks:

- Total conversations per embed
- Total messages per embed
- Unique visitors (by IP)
- Last activity timestamp

### Custom Analytics

You can extend the analytics by:

1. Adding more fields to `public_analytics` table
2. Implementing the `/api/embed-analytics` endpoint
3. Adding conversion tracking
4. Integrating with Google Analytics

## 🔐 **Security Considerations**

### Rate Limiting

- Each embed has configurable hourly/daily limits
- Prevents abuse and controls costs
- Can be adjusted per embed

### CORS Configuration

- Currently allows all origins for maximum compatibility
- Can be restricted to specific domains in production

### Data Privacy

- Visitor IPs are stored for abuse prevention
- User agents are logged for analytics
- All data is stored in your Supabase instance

## 🚀 **Next Steps**

### 1. Test Everything

- Create multiple embeds with different configurations
- Test on different websites
- Verify rate limiting works
- Check analytics are being recorded

### 2. Customize Further

- Modify the chatbot UI design
- Add more configuration options
- Implement advanced analytics
- Add A/B testing capabilities

### 3. Scale Up

- Monitor server performance
- Add load balancing if needed
- Implement caching for embed files
- Set up monitoring and alerting

## 📞 **Support**

If you encounter issues:

1. Check the server logs first
2. Verify database connections
3. Test API endpoints individually
4. Check environment variables
5. Review this setup guide

## 🎉 **You're All Set!**

Your embeddable chatbot system is now fully functional! Users can:

- Embed chatbots on any website
- Chat with AI-powered responses
- Experience personalized chatbot designs
- Stay within rate limits
- Generate analytics data

The system automatically handles:

- ✅ Chat processing
- ✅ Rate limiting
- ✅ Analytics tracking
- ✅ Abuse prevention
- ✅ Session management

Happy embedding! 🚀
