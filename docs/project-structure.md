# Project Structure Guide

## Complete Directory Structure

```
pokedex-app/
├── app/                          # Main application code
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                 # Authentication feature
│   │   │   ├── components/       # LoginForm, RegisterForm, etc.
│   │   │   ├── context/          # auth.context.tsx
│   │   │   ├── hooks/            # useAuth, etc.
│   │   │   ├── services/         # auth.service.ts
│   │   │   ├── types/            # auth.types.ts
│   │   │   └── __tests__/        # All auth tests
│   │   │
│   │   ├── pokemon/              # Pokemon browsing & details
│   │   │   ├── components/       # Pokemon UI components
│   │   │   │   ├── PokemonCard.tsx
│   │   │   │   ├── PokemonList.tsx
│   │   │   │   ├── PokemonDetailDesktopView.tsx
│   │   │   │   ├── PokemonDetailMobileView.tsx
│   │   │   │   ├── StatusBar.tsx
│   │   │   │   ├── PokemonInfo.tsx
│   │   │   │   └── PokemonAbility.tsx
│   │   │   ├── hooks/            # usePokemon, usePokemonList
│   │   │   │   └── usePokemon.ts
│   │   │   ├── services/         # API integration
│   │   │   │   └── pokemon.service.ts
│   │   │   ├── types/            # TypeScript definitions
│   │   │   │   └── pokemon.types.ts
│   │   │   └── __tests__/        # Pokemon feature tests
│   │   │
│   │   ├── favorites/            # Favorites management
│   │   │   ├── components/
│   │   │   │   ├── FavoriteCard.tsx
│   │   │   │   └── AuthPrompt.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useFavorites.ts
│   │   │   ├── services/
│   │   │   │   └── favorites.services.ts
│   │   │   ├── pages/
│   │   │   │   └── FavoritesPage.tsx
│   │   │   └── __tests__/        # Comprehensive test suite
│   │   │       ├── components/   # Component tests
│   │   │       ├── hooks/        # Hook tests
│   │   │       ├── services/     # Service tests
│   │   │       ├── pages/        # Page tests
│   │   │       └── integration/  # Integration tests
│   │   │
│   │   └── home/                 # Homepage feature
│   │       ├── components/
│   │       │   ├── HeroSection.tsx
│   │       │   ├── FeaturesGrid.tsx
│   │       │   └── StatusIndicator.tsx
│   │       ├── pages/
│   │       │   └── HomePage.tsx
│   │       ├── __tests__/
│   │       └── index.ts
│   │
│   ├── shared/                   # Shared resources
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Badge/
│   │   │   ├── Tabs/
│   │   │   ├── Progress/
│   │   │   ├── Skeleton/
│   │   │   └── NavigationMenu/
│   │   │
│   │   ├── services/             # Shared services
│   │   │   ├── http-service.ts   # HTTP client with error handling
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── pokemon.utils.ts  # Pokemon-specific utilities
│   │   │   └── index.ts
│   │   │
│   │   ├── config/               # Configuration files
│   │   │   ├── firebase.config.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/            # App constants
│   │   │   ├── api.constants.ts  # API endpoints
│   │   │   └── index.ts
│   │   │
│   │   └── types/                # Shared TypeScript types
│   │       └── index.ts
│   │
│   ├── routes/                   # React Router v7 with flat routes
│   │
│   ├── providers/                # App providers
│   │
│   ├── root.tsx                  # Root component
│
├── tests/                        # Test configuration
│   ├── setup/
│   │   └── vitest.setup.ts       # Vitest test setup
│   └── __mocks__/                # Global mocks
│
├── scripts/                      # Utility scripts
│   └── add-component.js          # Shadcn component generator script
│
├── public/                       # Static assets
│   ├── favicon.ico
│   └── manifest.json
│
├── docs/                         # Documentation (this directory)
│   ├── project-structure.md
│   ├── api-documentation.md
│   └── development-setup.md
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies and scripts
├── pnpm-lock.yaml               # Lock file
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS config
└── README.md                    # Basic project overview
```

### File Naming Patterns

- **Components**: `PascalCase.tsx` (e.g., `PokemonCard.tsx`)
- **Pages**: `PascalCase.tsx` (e.g., `FavoritesPage.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `usePokemon.ts`)
- **Services**: `camelCase.service.ts` (e.g., `pokemon.api.ts`)
- **Types**: `camelCase.types.ts` (e.g., `pokemon.types.ts`)
- **Tests**: `ComponentName.test.tsx` or `hookName.test.ts`
- **Utilities**: `camelCase.utils.ts` (e.g., `pokemon.utils.ts`)

### Directory Naming

- **Features**: `lowercase` (e.g., `pokemon`, `auth`, `favorites`)
- **Components**: `PascalCase` directories for complex components
- **Files**: Consistent with their content type

This structure promotes maintainability, testability, and team collaboration while keeping the codebase organized and scalable.
