# 🔥 Hono TypeScript API Starter

A modern, bare-bones REST API starter built with **Hono**, **TypeScript**, **pnpm**,
**Vitest**, **ESLint 9** (flat config), and **Prettier**.

## ✨ Features

- 🚀 **Lightning-fast** [Hono](https://hono.dev/) framework
- 📘 **TypeScript** with strict mode enabled
- ✅ **Zod** for runtime validation
- 🧪 **Vitest** for unit testing with coverage
- 🎨 **Prettier** for consistent code formatting
- 🔍 **ESLint 9** with flat config and modern rules
- 📦 **pnpm** for efficient package management
- 🔥 **Hot reload** with tsx watch mode
- 🎯 **Type-safe** request/response handling

## 📋 Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9+

## 🚀 Quick Start

### 1. Install Dependencies

pnpm install

### 2. Set Up Environment

cp .env.example .env

Edit `.env` with your configuration (default port is 3000).

### 3. Start Development Server

pnpm dev

The API will be available at `http://localhost:3000`

## 📂 Project Structure

.
├── src/
│ ├── routes/ # API route handlers
│ │ └── users.ts # User CRUD operations
│ └── app.ts # Application entry point
├── `__tests__`/ # Unit tests
│ ├── app.test.ts # Tests for app routes
│ └── users.test.ts # Tests for user CRUD operations
├── dist/ # Compiled output (generated)
├── .env.example # Environment variables template
├── .gitignore # Git ignore patterns
├── .prettierrc # Prettier configuration
├── .prettierignore # Prettier ignore patterns
├── eslint.config.js # ESLint 9 flat config
├── vitest.config.ts # Vitest configuration
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── README.md # This file

## 🛠️ Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start development server with hot reload |
| `pnpm build`         | Compile TypeScript to JavaScript         |
| `pnpm start`         | Run production build                     |
| `pnpm test`          | Run unit tests                           |
| `pnpm test:watch`    | Run tests in watch mode                  |
| `pnpm test:coverage` | Run tests with coverage report           |
| `pnpm lint`          | Check code with ESLint                   |
| `pnpm lint:fix`      | Fix ESLint issues automatically          |
| `pnpm format`        | Format code with Prettier                |
| `pnpm format:check`  | Check code formatting                    |
| `pnpm type-check`    | Run TypeScript type checking             |

## 🔌 API Endpoints

### Root

- `GET /` - API welcome message with available endpoints

### Health Check

- `GET /health` - Server health status

### Users (CRUD)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Example Requests

**Create a user:**
curl -X POST <http://localhost:3000/api/users> \
 -H "Content-Type: application/json" \
 -d '{"name": "John Doe", "email": "<john@example.com>"}'

**Get all users:**
curl <http://localhost:3000/api/users>

**Get user by ID:**
curl <http://localhost:3000/api/users/{id}>

**Update user:**
curl -X PUT <http://localhost:3000/api/users/{id}> \
 -H "Content-Type: application/json" \
 -d '{"name": "Jane Doe"}'

**Delete user:**
curl -X DELETE <http://localhost:3000/api/users/{id}>

## 🎯 Code Quality

This project uses modern tooling for code quality:

### ESLint 9 (Flat Config)

The project uses ESLint 9's new flat config system with:

- TypeScript ESLint recommended rules
- Prettier integration
- Strict unused variable checks
- Modern ES2023+ support

Run linting:
pnpm lint # Check for issues
pnpm lint:fix # Auto-fix issues

### Prettier

Consistent code formatting with:

- Double quotes
- 2-space indentation
- 100 character line width
- ES5 trailing commas

Run formatting:
pnpm format # Format all files
pnpm format:check # Check formatting

### TypeScript

Strict TypeScript configuration with:

- Strict mode enabled
- No unused locals/parameters
- No implicit returns
- Force consistent casing

Run type checking:
pnpm type-check

### Testing with Vitest

The project uses [Vitest](https://vitest.dev/) for fast unit testing:

- Fast test execution with ESM support
- Built-in TypeScript support
- Coverage reporting with v8
- Watch mode for development

Run tests:
pnpm test # Run tests once
pnpm test:watch # Run tests in watch mode
pnpm test:coverage # Generate coverage report

Test files are located in the `__tests__/` directory:

- `app.test.ts` - Tests for root and health endpoints
- `users.test.ts` - Comprehensive tests for user CRUD operations

The test suite covers:

- ✅ Route handlers and responses
- ✅ Request validation with Zod
- ✅ Error handling (404, 400)
- ✅ Edge cases and validation boundaries

## 🔒 Validation with Zod

All request bodies are validated using Zod schemas. Example from `src/routes/users.ts`:

const createUserSchema = z.object({
name: z.string().min(2).max(100),
email: z.string().email(),
});

users.post('/', zValidator('json', createUserSchema), c => {
const data = c.req.valid('json'); // Fully typed!
// ... handle request
});

## 🚢 Production Deployment

### Build for Production

pnpm build

This compiles TypeScript to JavaScript in the `dist/` directory.

### Run Production Build

pnpm start

### Environment Variables

Set these in your production environment:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (production/development)

## 📝 Development Tips

### Adding New Routes

1. Create a new file in `src/routes/`
2. Define your routes using Hono's router
3. Add Zod validation schemas
4. Import and mount in `src/app.ts`

Example:
// src/routes/posts.ts
import { Hono } from 'hono';

const posts = new Hono();

posts.get('/', c => {
return c.json({ posts: [] });
});

export { posts };

// src/app.ts
import { posts } from './routes/posts';
app.route('/api/posts', posts);

### Adding Middleware

Hono has built-in middleware for common tasks:

import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { jwt } from 'hono/jwt';

app.use('_', cors());
app.use('_', logger());
app.use('/api/\*', jwt({ secret: 'your-secret' }));

### Database Integration

Replace the in-memory `userStore` array with a real database:

**With Prisma:**
pnpm add @prisma/client
pnpm add -D prisma

**With Drizzle ORM:**
pnpm add drizzle-orm
pnpm add -D drizzle-kit

## 📄 License

MIT

## 🔗 Resources

- [Hono Documentation](https://hono.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
