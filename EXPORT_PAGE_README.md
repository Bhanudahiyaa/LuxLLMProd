# Export Page - Noupe-style Embed Integration

## Overview

The Export page provides a comprehensive solution for embedding AI chatbots on any website or platform, similar to Noupe's embed page. It includes embed code generation, platform-specific integration instructions, and a user-friendly interface.

## Features

### 1. Embed Code Generation

- **Primary Embed Code**: Simple script tag for most platforms
- **Alternative Embed Code**: HTML + JavaScript version for platforms with strict CSP policies
- **Copy to Clipboard**: One-click copying with visual feedback
- **Dynamic Agent ID**: Embed codes automatically include the agent's unique identifier

### 2. Platform Integrations

The page includes detailed setup instructions for 25+ platforms:

#### E-commerce Platforms

- Shopify, BigCommerce, WooCommerce

#### Website Builders

- Wix, Squarespace, Weebly, GoDaddy Website Builder
- Google Sites, Framer, Duda, IM Creator

#### Content Management Systems

- WordPress, Joomla, Drupal, Ghost
- Blogger, Tumblr, LiveJournal

#### Landing Page Builders

- Unbounce, Cargo, Yola, Jigsy

#### Other Platforms

- Piwigo (Gallery), Cargo (Portfolio)

### 3. Integration Modal

- **Step-by-step Instructions**: Clear, numbered setup steps for each platform
- **Platform-specific Guidance**: Tailored instructions for each platform's interface
- **Visual Feedback**: Success indicators and completion messages

### 4. UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Modern Design**: Clean, minimalist interface using TailwindCSS
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Technical Implementation

### Components

- `Export.tsx` - Main export page component
- `IntegrationModal.tsx` - Modal for platform-specific instructions
- `integrations.ts` - Data file containing all platform information

### Technologies Used

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** components for consistent design
- **React Router** for navigation

### State Management

- Local state for modal open/close
- Clipboard copy functionality
- Responsive grid layout

## Usage

### Accessing the Export Page

1. Navigate to `/export` or `/export/:agentId`
2. The page requires authentication (Clerk)
3. Accessible from the sidebar under "Manage" → "Export"

### Using the Embed Codes

1. **Primary Code**: Use for most platforms that support external scripts
2. **Alternative Code**: Use for platforms with strict Content Security Policies
3. Click the copy button to copy the code to clipboard
4. Paste the code into your website's HTML

### Platform Integration

1. Click on any platform card to see setup instructions
2. Follow the step-by-step guide for your specific platform
3. Use the appropriate embed code based on your platform's requirements

## File Structure

```
src/
├── pages/
│   └── Export.tsx              # Main export page
├── components/
│   └── IntegrationModal.tsx    # Platform instructions modal
└── lib/
    └── integrations.ts         # Platform data and instructions
```

## Customization

### Adding New Platforms

To add a new platform, update `src/lib/integrations.ts`:

```typescript
{
  id: "new-platform",
  name: "New Platform",
  icon: "🚀",
  description: "Description of the platform",
  instructions: [
    "Step 1: Do this",
    "Step 2: Do that",
    // ... more steps
  ]
}
```

### Modifying Embed Codes

Update the `embedCode` and `htmlEmbedCode` variables in `Export.tsx` to change the generated code format.

### Styling Changes

Modify the TailwindCSS classes in the components to match your design system.

## Browser Compatibility

- Modern browsers with ES6+ support
- Clipboard API for copy functionality
- CSS Grid and Flexbox for responsive layouts

## Performance

- Lazy loading of platform data
- Optimized animations with Framer Motion
- Minimal bundle size impact

## Security

- Authentication required to access export functionality
- No sensitive data exposed in embed codes
- Secure clipboard operations

## Future Enhancements

- Analytics tracking for embed usage
- Custom embed code customization
- Platform-specific code generation
- Integration with actual chatbot deployment
- A/B testing for different embed formats
