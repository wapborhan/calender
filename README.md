# SR Calendar - Schedule & Events

A modern, responsive calendar and event scheduling application built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Lucide Icons**.

## Features

- 📅 **Interactive Calendar**: Navigate through months, select dates, jump to "Today", and view scheduled event indicators.
- 🕒 **Date-wise Meeting View**: Inspect meetings for any selected day sorted chronologically with time ranges and participant avatars.
- 📋 **All Meetings View**: Toggle into "All Meetings" to see all upcoming and past events grouped date-wise.
- 💾 **Local Storage Persistence**: Create and cancel meetings on `localhost`, preserved seamlessly via browser `localStorage`.
- ➕ **Add Meeting Modal**: Easily add new meetings with host names, topics, dates, start/end times, and customizable avatars.
- 🔁 **Weekly & Monthly Recurring Schedules**: Schedule meetings to repeat weekly or monthly for configurable intervals (e.g. 2, 4, 8, 12 weeks/months) with recurring session badges and bulk series cancellation.
- ✏️ **Smart Meeting Editing**: Edit a single day's session independently or update host, title, times, and avatar across an entire recurring series simultaneously.
- 🗂️ **Multi-View Schedule Filter**: Switch between **Day**, **Week**, **Month**, and **All** schedule views with one click.
- 🎨 **Modern UI**: Designed with glassmorphism, gradient accents, smooth transitions, and Lucide React icons.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns v4](https://date-fns.org/)
- **UI Primitives**: [@headlessui/react v2](https://headlessui.com/)

## Getting Started

### 1. Install Dependencies

```bash
yarn
```

### 2. Start Development Server

```bash
yarn dev
```

### 3. Build for Production

```bash
yarn build
```

### 4. Run ESLint

```bash
yarn lint
```
