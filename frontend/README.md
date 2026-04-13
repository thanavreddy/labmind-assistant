# LabMind — Guided AI Lab Completion System

LabMind is an AI-powered lab completion platform designed for college students. It guides learners through a structured **3-step workflow** — **Learn → Verify → Record** — transforming how students approach laboratory coursework.

## What is LabMind?

Traditional lab completion is fragmented: students juggle textbooks, copy-paste from the internet, and submit poorly understood records. LabMind solves this by embedding AI guidance directly into the workflow, ensuring students actually *understand* concepts before documenting them.

### The 3-Step Workflow

1. **Learn with AI** — Ask the AI assistant any concept question. Get clear, structured explanations with code examples and step-by-step walkthroughs.
2. **Prove You Understand** — Complete a short comprehension quiz with paste-disabled inputs. No shortcuts — demonstrate genuine understanding before moving on.
3. **Draft Your Record** — Generate a structured lab record with all required sections: Aim, Theory, Algorithm, Code, Output, and Conclusion.

## Features

### 🤖 AI Chat Assistant
A full-width conversational interface where students can ask concept questions, request code walkthroughs, and get instant explanations. Uses JetBrains Mono for code blocks and supports multi-turn conversations.

### 📝 Concept Check (Comprehension Quiz)
A 3–5 question verification step with paste-disabled text inputs, ensuring students articulate concepts in their own words. A progress bar tracks completion.

### 📄 Lab Record Editor
A structured template editor with labeled sections — Aim, Theory, Algorithm, Code, Output, and Conclusion. The code section uses a Monaco-style editor for syntax-aware input.

### 📊 Student Dashboard
Experiment cards with status chips (Pending / In Progress / Done) and progress rings showing completion per experiment. Students can track their journey across multiple courses.

### 👩‍🏫 Professor Dashboard
A table-based view for instructors to track student progress, review completion statistics, and assign experiments. Sapphire-accented action buttons for quick management.

### 👤 Guest Mode
Explore the full LabMind workflow without creating an account. Try the AI assistant, browse experiments, and see how the platform works before committing.

## Supported Courses

- Data Structures
- Operating Systems
- Database Systems
- Algorithms (more being added)

## Design

LabMind follows a **"Dark Academic meets Modern SaaS"** aesthetic, inspired by Notion, Linear, and Vercel.

- **Color Palette**: Deep Navy (`#000926`), Sapphire (`#0F52BA`), Ice Blue (`#D6E6F3`), Powder Blue (`#A6C5D7`)
- **Typography**: DM Sans for headings, JetBrains Mono for code and labels
- **Dark/Light Mode**: Light mode defaults to a warm Notion-style white; dark mode uses deep navy with glassmorphism cards and sapphire glows
- **Animations**: Staggered fade-ins, scroll-triggered reveals, count-up stats, infinite marquee strips, and smooth accordion transitions

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — fast dev server and builds
- **Tailwind CSS** — utility-first styling with custom design tokens
- **shadcn/ui** — accessible, composable UI components
- **React Router** — client-side routing
- **Recharts** — data visualization
- **Lucide React** — icon library

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd labmind

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
src/
├── components/       # Shared UI components (AppLayout, Sidebar, ThemeToggle, etc.)
│   └── ui/           # shadcn/ui primitives
├── contexts/         # React context providers (ThemeContext)
├── hooks/            # Custom hooks (useScrollReveal, useCountUp, useMobile)
├── pages/            # Route-level page components
│   ├── Landing.tsx
│   ├── AIAssistant.tsx
│   ├── ConceptCheck.tsx
│   ├── LabRecordEditor.tsx
│   ├── StudentDashboard.tsx
│   └── ProfessorDashboard.tsx
└── lib/              # Utilities
```

## License

© 2026 LabMind. All rights reserved.
