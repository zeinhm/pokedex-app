# Pokedex App

A modern Pokemon explorer built with React, TypeScript, and Firebase. Browse Pokemon, save favorites, and explore detailed stats in a responsive, user-friendly interface.

## Prerequisites

- **Node.js** 18+
- **pnpm** (preferred package manager)

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:3000
```

## Features

- **Pokemon Browse**: Infinite scroll through 1000+ Pokemon with smooth loading
- **Search & Filter**: Find Pokemon by name, type, or generation (coming soon)
- **Detailed Views**: Complete stats, abilities, and high-quality artwork
- **Favorites System**: Save and manage your favorite Pokemon (requires account)
- **User Authentication**: Register/login with Firebase Auth
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Favorites sync across devices instantly

## Tech Stack

### Core

- **React 19** with **TypeScript** for type-safe development
- **React Router v7** with flat-routes for file-based routing
- **Vite** for fast builds and hot reload

### State & Data

- **TanStack Query** (React Query) for server state management
- **Firebase Auth** for authentication
- **Firestore** for user data and favorites
- **Pokemon API** (PokeAPI) for Pokemon data

### UI & Styling

- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **Lucide React** for icons

### Forms & Validation

- **React Hook Form** for form handling
- **Zod** for schema validation
- **Custom error handling** with user-friendly messages

### Testing

- **Vitest** as test runner
- **React Testing Library** for component testing
- **Jest DOM** for DOM assertions

## Project Structure

```
app/
├── features/          # Feature-based modules
│   ├── auth/          # Authentication (login, register)
│   ├── pokemon/       # Pokemon browsing and details
│   └── favorites/     # Favorites management
├── shared/            # Shared utilities and components
│   ├── components/    # Reusable UI components
│   ├── services/      # API services and HTTP client
│   └── utils/         # Helper functions
├── routes/            # File-based routing (flat routes)
└── providers/         # App providers
```

## Available Scripts

### 1. Start the Application

```bash
pnpm install
pnpm dev
# App will be available at http://localhost:3000
```

### 2. Explore Features

```bash
# While the app is running, open these URLs:
# http://localhost:3000           - Homepage
# http://localhost:3000/pokemon   - Pokemon list page with infinite scroll
# http://localhost:3000/login     - Authentication form
# http://localhost:3000/favorites - Favorites (requires login)
```

### 3. Test Code Quality

```bash
# Run the full test suite
pnpm test:run

# Check test coverage
pnpm test:coverage

# View coverage in browser
pnpm test:coverage:ui

# Check TypeScript types
pnpm typecheck
```

### 4. Interactive Testing

```bash
# Open Vitest UI for interactive testing
pnpm test:ui
# Then visit http://localhost:51204

# Test specific components
pnpm test --grep "PokemonCard"
pnpm test --grep "authentication"
pnpm test --grep "LoginForm"
```

### 5. Performance Check

```bash
# Build and check bundle size
pnpm build

# Start production server to test performance
pnpm start
# Visit http://localhost:3000 and check network/performance tab in dev tools
```

## Key Implementation Highlights

- **Infinite Scrolling**: Uses Intersection Observer API for performance
- **Real-time Favorites**: Firestore subscriptions with React Query integration
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Image Optimization**: Progressive loading with fallback states
- **Form Validation**: Complex validation rules with proper error messages
- **Testing Strategy**: Component, integration, and hook testing
- **TypeScript**: Full type coverage with strict configuration

## Testing the App

1. **Browse Pokemon**: Visit the homepage to see the infinite scroll in action
2. **Search**: Try searching for specific Pokemon names (coming soon)
3. **Authentication**: Register a new account or login
4. **Favorites**: Add/remove favorites (requires login)
5. **Responsive**: Test on different screen sizes
6. **Performance**: Check network tab for efficient API calls

## Troubleshooting

### Common Issues

```bash
# Port already in use
pnpm dev --port 3001

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# TypeScript errors
pnpm typecheck
# Fix any type errors before running tests

# Test failures
pnpm test --reporter=verbose
# Get detailed test output
```

### Development Environment

```bash
# Check Node version (requires Node 18+)
node --version

# Check pnpm version
pnpm --version

# Verify all dependencies installed
pnpm list --depth=0
```

### Firebase Setup (Optional)

```bash
# The app works without Firebase, but authentication/favorites require it
# If you see Firebase errors, the Pokemon browsing will still work
# To set up Firebase:
# 1. Create .env file with Firebase config
# 2. Restart dev server: pnpm dev
```

### Code Quality

- **TypeScript Coverage**: Run `pnpm typecheck` - zero errors
- **Test Coverage**: Run `pnpm test:coverage` - aiming to >80% coverage
- **Component Testing**: Check `app/features/*/components/*.test.tsx`
- **Hook Testing**: Check `app/features/*/hooks/*.test.tsx`

### Architecture Patterns

- **Feature-based Structure**: Each feature is self-contained
- **Custom Hooks**: Business logic separated from UI components
- **Error Boundaries**: Graceful error handling throughout
- **Query Key Management**: Hierarchical cache invalidation strategy

### Performance Features

- **Infinite Scroll**: Intersection Observer implementation
- **Image Loading**: Progressive loading with skeleton states
- **API Optimization**: React Query caching and background sync
- **Bundle Size**: Check with `pnpm build`

### UI/UX Details

- **A bit fancy design**: As the Pokedex App intentionally for the entertainment purpose
- **Responsive Design**: Test on mobile/desktop
- **Loading States**: Skeleton loading, spinners
- **Error States**: Network errors, empty states, retry mechanisms
- **Accessibility**: Proper ARIA labels, keyboard navigation

## Additional Documentation

Detailed architectural decisions, component documentation, and deployment guides can be found in `/docs`.

---

**Note**: This project demonstrates modern React development practices, scalable architecture patterns, and production-ready code quality suitable for enterprise applications.
