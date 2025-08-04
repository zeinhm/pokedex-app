# Development Setup Guide

## Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (preferred package manager)

```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
node --version  # Should be 18+
pnpm --version  # Should be latest
```

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd pokedex-app

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## Environment Configuration

### .env file is provided

### Environment Variables (.env)

```bash
# Pokemon API (Required)
VITE_POKEMON_API_BASE_URL=https://pokeapi.co/api/v2

# Firebase Configuration (Optional - for auth/favorites)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Firebase Setup (Optional)

The app works without Firebase, but authentication and favorites require it:

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Authentication (Email/Password)
   - Create Firestore database

2. **Firestore Security Rules**:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /favorites/{document} {
         allow read, write: if request.auth != null &&
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

3. **Get Configuration**:
   - Project Settings > General > Web App
   - Copy config values to `.env`

## Package Management

### Dependencies Overview

Based on actual `package.json`:

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.12",
    "@react-router/node": "^7.7.1",
    "@react-router/remix-routes-option-adapter": "^7.7.1",
    "@react-router/serve": "^7.7.1",
    "@tanstack/react-query": "^5.84.1",
    "@tanstack/react-query-devtools": "^5.84.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.0.0",
    "isbot": "^5.1.27",
    "lucide-react": "^0.536.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.62.0",
    "react-router": "^7.7.1",
    "remix-flat-routes": "^0.8.5",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.0.14"
  }
}
```

## Development Scripts

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)

# Building
pnpm build            # Production build
pnpm start            # Start production server

# Testing
pnpm test             # Run tests in watch mode
pnpm test:ui          # Interactive test UI (http://localhost:51204)
pnpm test:run         # Run tests once
pnpm test:coverage    # Generate coverage report
pnpm test:coverage:ui # Coverage with interactive UI

# Type Checking
pnpm typecheck        # Check TypeScript types

# Utilities
pnpm add:component    # Generate new shadcn component (custom script)
```

### Custom Component Generator

```bash
# Generate new component from shadcn with tests and structure
pnpm add:component ShadcnComponentName

# This creates:
# app/shared/components/ComponentName/
# ├── ComponentName.tsx
# ├── ComponentName.test.tsx (with basic tests)
# └── index.ts
```

The script automatically:

- Creates proper folder structure
- Generates component with TypeScript
- Adds basic tests
- Updates exports

## Testing Setup

### Test Configuration (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup/vitest.setup.ts",
    css: true,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist", "build"],
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "app/routes/",
        "app/root.tsx",
        "**/index.ts",
      ],
    },
  },
});
```

### Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI interface
pnpm test:ui
# Then open http://localhost:51204

# Run specific test
pnpm test PokemonCard

# Run tests with coverage
pnpm test:coverage

# View coverage in browser
pnpm test:coverage:ui
```

## TypeScript Configuration

### Path Mapping (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"],
      "@components/*": ["./app/shared/components/*"],
      "@features/*": ["./app/features/*"],
      "@shared/*": ["./app/shared/*"],
      "@providers/*": ["./app/providers/*"],
      "@lib/*": ["./app/lib/*"]
    }
  }
}
```

### Clean Imports

```typescript
// Instead of relative imports
import { Button } from "../../../shared/components/Button";
import { usePokemon } from "../../pokemon/hooks/usePokemon";

// Use clean path mappings
import { Button } from "@components/Button";
import { usePokemon } from "@features/pokemon/hooks/usePokemon";
```

### Type Checking

```bash
# Check types without running app
pnpm typecheck

# Should show no errors in production-ready code
```

## Debugging & Troubleshooting

### Common Issues & Solutions

#### Port Already in Use

```bash
# use different port
pnpm dev --port 3001
```

#### TypeScript Errors

```bash
# Check for type errors
pnpm typecheck

# Common fixes:
# 1. Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart"
# 2. Clear cache: rm -rf node_modules/.vite
# 3. Check tsconfig.json paths
```

#### Test Failures

```bash
# Verbose test output
pnpm test --reporter=verbose

# Clear test cache
pnpm test --run --no-cache

# Update snapshots (if using)
pnpm test -u
```

#### Firebase Connection Issues

```bash
# Check environment variables
echo $VITE_FIREBASE_API_KEY

# Verify Firebase config in browser console
# Should see "Firebase initialized" message

# Check Firebase project settings - ensure domain is authorized
```

#### Build Issues

```bash
# Clear build cache
rm -rf build dist .vite

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for TypeScript errors first
pnpm typecheck
```

### Development Workflow

```bash
# 1. Start development
pnpm dev

# 2. In another terminal, run tests
pnpm test

# 3. Check types periodically
pnpm typecheck

# 4. Generate components when needed
pnpm add:component NewComponent

# 5. Build before committing
pnpm build
```

## Git Workflow

### Pre-commit Checklist

- [ ] Tests pass: `pnpm test:run`
- [ ] Types check: `pnpm typecheck`
- [ ] Build works: `pnpm build`
- [ ] No console errors in browser
- [ ] Feature works in development and build

### Technology Documentation

- **React 19**: [Official Docs](https://react.dev/)
- **React Router v7**: [Guide](https://reactrouter.com/)
- **TanStack Query**: [Docs](https://tanstack.com/query/latest)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **Vitest**: [Testing Guide](https://vitest.dev/)
- **Firebase**: [Web Guide](https://firebase.google.com/docs/web/setup)
