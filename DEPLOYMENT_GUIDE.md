# 🚀 Deployment Guide: Embed System to Vercel

## 📋 **Prerequisites**

- ✅ Vercel account connected to your GitHub
- ✅ Your website already deployed at [https://lux-llm-prod.vercel.app/](https://lux-llm-prod.vercel.app/)
- ✅ OpenRouter API key ready
- ✅ Supabase database configured

## 🔧 **Step 1: Set Up Vercel Environment Variables**

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

### **Required Environment Variables:**

```bash
# AI API Configuration
OPENROUTER_API_KEY=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

# Supabase Configuration
SUPABASE_URL=https://cvetvxgzgfmiqdxdimzn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZXR2eGd6Z2ZtaXFkeGRpbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk0NTYsImV4cCI6MjA2OTk5NTQ1Nn0.pgNeUr3T2LQNL0qno1bxST6HgqbdIrCkJrkb-wOL5SE

# Server Configuration
NODE_ENV=production
```

## 🚀 **Step 2: Deploy to Vercel**

### **Option A: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **Option B: Deploy via GitHub Integration**

1. Push your code to GitHub
2. Vercel will automatically detect changes
3. Deploy will trigger automatically

## 🌐 **Step 3: Test Production Deployment**

After deployment, test these endpoints:

### **Health Check:**

```
https://lux-llm-prod.vercel.app/health
```

### **Test Embed:**

```
https://lux-llm-prod.vercel.app/embed/test-embed
```

### **Embed Script:**

```
https://lux-llm-prod.vercel.app/embed/test-embed.js
```

### **API Endpoint:**

```
https://lux-llm-prod.vercel.app/api/public-chat
```

## 🎯 **Step 4: Create Real Embeds**

### **1. Set Up Database Tables**

Run this SQL in your Supabase dashboard:

```sql
-- Copy the contents of supabase_embeds_schema.sql
-- This creates all necessary tables and policies
```

### **2. Create Your First Embed**

Use your Export page to create embeds with:

- **Custom Name**: "LuxLLM Support Bot"
- **Description**: "AI-powered customer support chatbot"
- **Rate Limiting**: 100 requests/hour, 1000/day
- **Theme**: Match your website colors
- **System Prompt**: Customize AI behavior

### **3. Get Embed Code**

After creation, you'll get an embed code like:

```html
<script src="https://lux-llm-prod.vercel.app/embed/your-embed-code.js"></script>
```

## 🔗 **Step 5: Integrate with Your Website**

### **Add to Your Main Website:**

```html
<!-- Add this to your HTML head or before closing body -->
<script src="https://lux-llm-prod.vercel.app/embed/your-embed-code.js"></script>
```

### **Customize Appearance:**

The chatbot will automatically:

- ✅ Match your website's theme
- ✅ Position in bottom-right corner
- ✅ Use your custom AI personality
- ✅ Track conversations and analytics

## 📊 **Step 6: Monitor & Analytics**

### **View Analytics in Supabase:**

- **Conversations**: Track user engagement
- **Messages**: Monitor AI performance
- **Rate Limits**: Prevent abuse
- **User Behavior**: Understand usage patterns

### **Vercel Analytics:**

- **Performance**: Monitor API response times
- **Usage**: Track request volumes
- **Errors**: Catch and fix issues quickly

## 🎉 **Success! Your Embed System is Live**

### **What You Now Have:**

- ✅ **Production-ready embed system** at your domain
- ✅ **Real AI responses** via OpenRouter API
- ✅ **Professional chatbot** that matches your brand
- ✅ **Scalable architecture** for multiple embeds
- ✅ **Analytics and monitoring** for insights

### **Test URLs:**

- **Main Site**: [https://lux-llm-prod.vercel.app/](https://lux-llm-prod.vercel.app/)
- **Embed Preview**: `https://lux-llm-prod.vercel.app/embed/[your-code]`
- **Health Check**: `https://lux-llm-prod.vercel.app/health`

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Environment Variables Not Working**

- Check Vercel dashboard → Environment Variables
- Ensure variables are set for Production environment
- Redeploy after adding variables

#### **2. Database Connection Issues**

- Verify Supabase URL and key
- Check RLS policies are correct
- Test connection in Supabase dashboard

#### **3. AI API Errors**

- Verify OpenRouter API key is valid
- Check API rate limits
- Monitor Vercel function logs

### **Need Help?**

- Check Vercel function logs in dashboard
- Monitor Supabase logs for database issues
- Test endpoints individually to isolate problems

## 🔮 **Next Steps**

### **Enhance Your System:**

1. **Custom Themes**: Match your brand colors
2. **Multiple Bots**: Create specialized AI assistants
3. **Advanced Analytics**: Track conversion rates
4. **A/B Testing**: Optimize AI responses
5. **Integration**: Connect with your CRM/helpdesk

### **Scale Up:**

- **Multiple Websites**: Use same embed system
- **Enterprise Features**: Advanced rate limiting
- **Custom Models**: Fine-tune AI behavior
- **White-label**: Resell to clients

---

**🎯 Your embed system is now production-ready and integrated with your website at [https://lux-llm-prod.vercel.app/](https://lux-llm-prod.vercel.app/)!**
