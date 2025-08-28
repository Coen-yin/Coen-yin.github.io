# Overview

Talkie Gen is a professional AI chat interface application that provides users with an advanced conversational AI experience. The application features a sleek, responsive web interface built with vanilla JavaScript, HTML, and CSS, integrating with the Groq API to deliver intelligent chat responses. The project emphasizes user experience with features like voice input/output, theme switching, conversation persistence, message management, real-time typing indicators, and an improved design using the official Talkie Gen logo.

# User Preferences

Preferred communication style: Simple, everyday language.
Design preferences: Clean, professional design with original Talkie Gen logo, voice features enabled, improved user experience without scrolling issues.

# System Architecture

## Frontend Architecture
The application follows a component-based architecture using vanilla JavaScript with a single main class `TalkieGen` that manages the entire application state and UI interactions. The design implements a modern glassmorphism aesthetic with CSS custom properties for comprehensive theme management.

**Key Design Patterns:**
- **State Management**: Centralized state management within the TalkieGen class, handling conversation history, typing states, and UI elements
- **Event-Driven Architecture**: DOM event listeners manage user interactions, API responses, and UI updates
- **Progressive Enhancement**: Core functionality works without JavaScript, with enhanced features added progressively

## UI/UX Design Decisions
- **Theme System**: Dual light/dark theme support using CSS custom properties and data attributes
- **Responsive Design**: Mobile-first approach with fluid layouts and touch-friendly interfaces
- **Real-time Feedback**: Typing indicators, loading states, and toast notifications for enhanced user experience
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

## Data Management
- **Local Storage**: Conversation history persisted in browser's localStorage for session continuity
- **Memory Management**: In-memory conversation history with automatic cleanup and export capabilities
- **Message Structure**: Structured message objects with unique IDs, timestamps, and metadata

## API Integration Architecture
- **HTTP Client**: Native fetch API for REST communication with Groq's OpenAI-compatible endpoint
- **Error Handling**: Comprehensive error handling with user-friendly error messages and retry mechanisms
- **Rate Limiting**: Built-in safeguards to prevent API abuse and manage request frequency

# External Dependencies

## AI Service Integration
- **Groq API**: Primary AI service using the `openai/gpt-oss-120b` model via Groq's OpenAI-compatible endpoint
- **API Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Authentication**: API key-based authentication (currently hardcoded for development)

## External Libraries
- **Google Fonts**: Inter font family for consistent typography across the application
- **Font Awesome**: Icon library (v6.4.0) for UI iconography and visual elements
- **No Framework Dependencies**: Pure vanilla JavaScript implementation without external frameworks

## Browser APIs
- **Local Storage API**: For conversation persistence and user preferences
- **Fetch API**: For HTTP requests to the AI service
- **DOM APIs**: For dynamic UI manipulation and event handling
- **CSS Custom Properties**: For dynamic theme switching and style management

## Development Considerations
- **No Build Process**: Direct browser compatibility without transpilation or bundling
- **CDN Dependencies**: External resources loaded via CDN for faster development iteration
- **Progressive Enhancement**: Core functionality accessible without external dependencies