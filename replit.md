# Overview

WellnessHub is an AI-driven employee wellbeing and productivity dashboard designed for enterprise use. The application helps organizations monitor and improve employee mental health, work habits, and engagement through data collection, analysis, and personalized recommendations. It serves three user roles: employees (self-monitoring), managers (team oversight), and HR administrators (organizational insights).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and design tokens
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Authentication Flow**: Protected routes with role-based access control

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **API Design**: RESTful API endpoints with role-based access control
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Authentication**: OpenID Connect (OIDC) integration with Replit's authentication system using Passport.js

## Database Schema Design
- **Users Table**: Stores user profiles with role-based permissions (employee, manager, hr_admin)
- **Wellbeing Metrics**: Tracks stress levels, mood scores, and work-life balance indicators
- **Productivity Metrics**: Monitors task completion rates, focus time, and performance indicators
- **Recommendations**: AI-generated personalized suggestions for improving wellbeing and productivity
- **Sessions Table**: Manages user authentication sessions

## Data Architecture
- **Hierarchical User Structure**: Manager-employee relationships for team analytics
- **Time-series Data**: Historical tracking of metrics with date-based queries
- **Role-based Data Access**: Different data visibility based on user roles
- **Aggregation Support**: Team-level analytics and summary calculations

## Security Architecture
- **Authentication**: OIDC-based authentication with secure session management
- **Authorization**: Role-based access control with middleware protection
- **Data Privacy**: User data isolation with manager hierarchy respect
- **Session Security**: HTTP-only cookies with secure configuration
- **Environment Variables**: Sensitive configuration stored in environment variables

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Database Migrations**: Drizzle Kit for schema management and migrations

## Authentication Services
- **Replit Authentication**: OIDC provider for user authentication and identity management
- **OpenID Connect**: Standard protocol for secure authentication flows

## Frontend Libraries
- **Chart.js**: Client-side charting library loaded via CDN for wellbeing and productivity visualizations
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities

## Development Tools
- **Vite**: Development server and build tool with hot module replacement
- **ESBuild**: Fast bundling for production builds
- **TypeScript**: Type checking and development experience enhancement

## Styling and UI
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

## Deployment Platform
- **Replit**: Cloud development and hosting platform with integrated authentication
- **Environment Configuration**: Platform-specific optimizations and development tooling