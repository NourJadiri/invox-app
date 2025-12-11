# Invox

**Invox** is a lightweight student CRM (Customer Relationship Management) system designed specifically for tutors and educators. It streamlines the management of students, lessons, schedules, and invoices, helping tutors focus more on teaching and less on administrative tasks.

## 📋 What Does Invox Do?

Invox provides a comprehensive solution for tutors to manage their tutoring business with the following core features:

### 🎓 Student Management
- Create, view, edit, and delete student profiles
- Store essential student information including:
  - First and last name
  - Email address and phone number
  - Custom notes for each student
- Track all lessons and invoices associated with each student
- Quick search and filtering capabilities

### 📅 Schedule Management
- Visual calendar interface for managing lessons and appointments
- Create and edit lesson entries with:
  - Customizable titles
  - Start and end times
  - Price tracking
  - Color-coded lessons for easy identification
  - Custom notes for each lesson
- Support for recurring lessons with automatic instance generation
- **Google Calendar Integration**:
  - Two-way sync with Google Calendar
  - OAuth2 authentication for secure access
  - Automatic token refresh handling
  - Create, update, and delete events in Google Calendar
  - Stay synchronized across all your devices

### 💰 Invoice Generation
- Create professional invoices for students
- Specify date ranges for billing periods
- Automatically calculate totals based on lessons
- Associate multiple students with a single invoice
- **PDF Export**: Generate downloadable PDF invoices with a clean, professional layout
- Track invoice history and records

## 🛠️ Tech Stack

Invox is built with modern web technologies for performance, scalability, and developer experience:

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Big Calendar](https://github.com/jquense/react-big-calendar)** - Calendar component
- **[Motion](https://motion.dev/)** - Animation library

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** - Serverless API endpoints
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[SQLite](https://www.sqlite.org/)** with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - Embedded database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication with Google OAuth
- **[Puppeteer](https://pptr.dev/)** - PDF generation for invoices
- **[Google APIs](https://github.com/googleapis/google-api-nodejs-client)** - Google Calendar integration

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit linting

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NourJadiri/invox-app.git
   cd invox-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` or `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"

   # Google OAuth (for authentication and Calendar sync)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

   **Getting Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID and Client Secret to your `.env` file

   **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   This will:
   - Generate the Prisma Client
   - Create the SQLite database with all necessary tables

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the Students page after the welcome screen.

## 📖 Usage Guide

### First Time Setup

1. **Sign in with Google** (optional but recommended for Calendar sync)
   - Click the Google sign-in button in the Schedule page
   - Grant necessary permissions for Calendar access

2. **Add Your First Student**
   - Navigate to the "Students" page
   - Click "Add Student" button
   - Fill in student information
   - Save the student profile

3. **Schedule a Lesson**
   - Go to the "Schedule" page
   - Click on a time slot or use "Add Lesson" button
   - Select a student, set time, price, and other details
   - Optionally enable recurring lessons
   - If signed in with Google, the lesson will sync to your Google Calendar

4. **Generate an Invoice**
   - Navigate to the "Invoice" page
   - Set the date range for the billing period
   - Select the student(s) to invoice
   - Review the calculated total
   - Generate and download a PDF invoice

## 🏗️ Project Structure

```
invox-app/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── invoice/       # Invoice API (PDF generation)
│   │   │   ├── invoices/      # Invoice CRUD operations
│   │   │   ├── lessons/       # Lesson CRUD operations
│   │   │   └── students/      # Student CRUD operations
│   │   ├── invoice/           # Invoice page
│   │   ├── schedule/          # Schedule page
│   │   ├── students/          # Students page
│   │   ├── layout.tsx         # Root layout with navbar
│   │   └── page.tsx           # Home/welcome page
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn/Radix UI components
│   │   ├── navbar.tsx         # Navigation bar
│   │   └── providers.tsx      # Context providers
│   ├── features/              # Feature-specific modules
│   │   ├── invoice/           # Invoice feature logic
│   │   ├── schedule/          # Schedule feature logic
│   │   └── students/          # Students feature logic
│   ├── lib/                   # Utility libraries
│   │   ├── google-calendar.ts # Google Calendar API integration
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── utils.ts           # Helper functions
│   ├── services/              # Data access layer
│   │   ├── invoices.ts        # Invoice service
│   │   ├── lessons.ts         # Lesson service
│   │   └── students.ts        # Student service
│   ├── styles/                # Global styles
│   └── types/                 # TypeScript type definitions
├── .gitignore
├── components.json            # Shadcn UI configuration
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔧 Development

### Available Scripts

- **`npm run dev`** - Start the development server
- **`npm run build`** - Build the application for production
- **`npm run start`** - Start the production server
- **`npm run lint`** - Run ESLint to check code quality

### Database Management

- **View database**: Use Prisma Studio
  ```bash
  npx prisma studio
  ```

- **Create migration**: After changing `schema.prisma`
  ```bash
  npx prisma migrate dev --name your-migration-name
  ```

- **Reset database**: Clear all data and reset
  ```bash
  npx prisma migrate reset
  ```

### Code Quality

The project uses Husky and lint-staged to automatically lint code before commits:
- Pre-commit hook runs ESLint on staged files
- Automatic formatting and error fixing

## 🔐 Security & Privacy

- **Authentication**: Secure OAuth2 flow with Google
- **Data Storage**: All data stored locally in SQLite database
- **API Security**: NextAuth.js handles session management
- **Token Refresh**: Automatic OAuth token refresh for Google Calendar

## 📝 Database Schema

The application uses the following main models:

- **Student**: Store student contact information
- **Lesson**: Track lessons with pricing, scheduling, and Google Calendar sync
- **Invoice**: Generate and manage billing records
- **User/Account/Session**: NextAuth.js authentication models

## 🤝 Contributing

This is an early prototype. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is part of a personal portfolio. Please check with the repository owner for licensing details.

## 🙏 Acknowledgments

Built with [Next.js](https://nextjs.org/), deployed with care for tutors everywhere.
