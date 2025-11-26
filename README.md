# Handcrafted Haven - Development Setup Guide

Welcome to Handcrafted Haven! This guide will walk you through setting up the project on your computer step by step.

## Prerequisites

Before you start, you'll need to install these programs on your computer:

### 1. Install Docker Desktop

Docker helps us run our database and application during development.

#### For Windows:
1. Go to [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Download and run the installer
3. Follow the installation wizard
4. Restart your computer when prompted
5. Open Docker Desktop and make sure it's running (you'll see a whale icon in your system tray)

#### For Mac:
1. Go to [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
2. Download the appropriate version (Intel or Apple Silicon)
3. Drag Docker to your Applications folder
4. Open Docker Desktop and follow the setup
5. Make sure Docker Desktop is running (you'll see a whale icon in your menu bar)

#### For Linux:
1. Follow the instructions for your distribution at [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)

### 2. Install Git (if not already installed)
- **Windows:** Download from [git-scm.com](https://git-scm.com/download/win)
- **Mac:** Install via Homebrew: `brew install git` or download from [git-scm.com](https://git-scm.com/download/mac)
- **Linux:** Use your package manager: `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

## Getting Started

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/douglasgreyling/handcrafted-haven.git
cd handcrafted-haven
```

### Step 2: Start the Application with Docker

This command will build and start both the database and the web application:

```bash
docker compose up
```

**What this does:**
- Downloads and sets up a PostgreSQL database
- Builds the Next.js application
- Runs database migrations
- Seeds the database with sample data
- Starts the web server

**First time setup will take a few minutes** as Docker downloads all the necessary files.

### Step 3: Access the Application

Once you've run the commend above you'll be able to access the application.

Open your web browser and go to: **http://localhost:3000**

You can login using the seeded user account:
- **Username:** tester
- **Email:** test@example.com
- **Password:** foobarbazA1

If at any point you need to stop the application, return to your terminal and press `CTRL + C`.

## Development Commands

### Starting the Application
```bash
# Start everything (database + app + prisma studio)
docker compose up
```

### Stopping the Application
```bash
# Stop everything (database + app + prisma studio)
docker compose down
```

### Database Operations

#### Running Migrations

If new changes are made to the Prisma database schema, you'll need to run migrations to update your local database.

```bash
# Run any migrations
docker compose run --rm app npm run migrate
```

#### Seeding the Database

To get some sample data in your database for testing, you can run the seed script.

To add sample data to the database:
```bash
# Seed the database
docker compose run --rm app npm run seed
```

#### Reset Database (Fresh Start)

If for any reason you need to completely reset your database and start fresh, you can do so with the following commands:

If you need to completely reset your database:
```bash
docker compose down -v
docker compose up --build
```

## Working with the Database

We use **Prisma** as our database toolkit. Here are the most important resources:

### Using Prisma Studio (Database GUI)

Prisma Studio provides a visual interface to view and edit your database data. It's included in your Docker setup and runs automatically.

#### Accessing Prisma Studio:
1. Make sure your containers are running: `docker compose up`
2. Open your browser and go to: **http://localhost:5555**
3. You'll see a web interface where you can:
   - View all your database tables
   - Browse and edit data
   - Add new records
   - Delete records

#### Prisma Studio Features:
- **Visual data browser** - See all your tables and relationships
- **Data editing** - Add, update, or delete records directly
- **Real-time updates** - Changes appear immediately in your app
- **Safe interface** - Built-in validation prevents data corruption

### Essential Prisma Documentation:
- **[Prisma Getting Started](https://www.prisma.io/docs/getting-started)** - Basic concepts
- **[Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)** - How to define database models
- **[Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)** - How to query the database in code
- **[Database Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)** - How to change the database structure
- **[Prisma Studio Guide](https://www.prisma.io/docs/concepts/components/prisma-studio)** - Complete Prisma Studio documentation

### Database Schema Location:

- The database structure is defined in: `prisma/schema.prisma`
- Sample data is in: `prisma/seed.js`

# Handcrafted Haven

## Project Summary

**Handcrafted Haven** is an innovative web application designed to provide a platform for artisans and crafters to showcase and sell their unique handcrafted items. By connecting talented creators with conscious consumers, Handcrafted Haven fosters a sense of community, supports local artisans, and promotes sustainable consumption.

The application provides a seamless experience for both sellers and buyers, emphasizing usability, accessibility, and customization while maintaining a secure e-commerce platform.

## Project Kanban

https://github.com/users/douglasgreyling/projects/1/views/1

## Project Goals

1. **Develop Software Development Skills:** We need to build a full-stack web application collaboratively using modern technologies and deploy it to the cloud.
2. **Develop as an Effective Group Member:** We need to improve teamwork and professional collaboration skills.
3. **Teach One Another:** We need to strengthen our understanding of concepts by sharing knowledge and learning from teammates.

## Features

### Seller Profiles

- Authenticated sellers have dedicated profiles.
- Showcase craftsmanship, personal stories, and curated product collections.
- Add product descriptions and manage inventory.

### Product Listings

- List handcrafted items with images, pricing, and detailed descriptions.
- Users can browse and filter products by category, price, and other criteria.

### Reviews and Ratings

- Users can leave ratings and written reviews for products.

## Design

### Color Scheme / Theme

- **Primary:** #4A4A4A (Charcoal Gray – for text, main headings)
- **Secondary:** #F5F5F5 (Light Gray – background panels and sections)
- **Accent:** #A0A0A0 (Medium Gray – buttons, highlights)
- **Highlight / CTA:** #6C63FF (Muted Indigo – call-to-action buttons, links)
- **Neutral:** #FFFFFF (White – background and spacing areas)

### Typography

- **Headings:** Montserrat, sans-serif, bold
- **Body:** Roboto, sans-serif, regular
- **Buttons / accents:** Montserrat Medium

### Layout / Graphical Elements

- Clean, minimalist layout with plenty of white space
- Product cards with subtle shadows for depth
- Hover effects on buttons and images for interactivity
- Responsive grid layout for catalog and seller pages

### Graphical Elements

- Product image cards with hover effects
- Consistent button styles (rounded edges, primary accent color)
- Responsive grid layout for catalog

## Technology Stack

- **Front-End:** HTML, CSS, JavaScript, Next.js
- **Back-End:** Node.js, database (PostgreSQL)
- **Project Management:** GitHub Boards
- **Code Management:** Git, GitHub Repository
- **Deployment / Cloud Platform:** Vercel

## User Stories & Work Items

1. **As a seller, I want to create a profile** so I can showcase my artisan identity and products.
2. **As a seller, I want to add product listings** so that users can browse and purchase my items.
3. **As a buyer, I want to browse products by category** so I can find items I’m interested in.
4. **As a buyer, I want to filter products by price range** to find items within my budget.
5. **As a user, I want to leave reviews and ratings** to provide feedback on products I purchase.
6. **As a site visitor, I want a responsive website layout** so I can use it on both desktop and mobile devices.
7. **As a user, I want accessible navigation** to ensure the platform is usable regardless of disability.
8. **As a developer, I want a version-controlled GitHub repository** to manage code collaboratively.
9. **As a team member, I want tasks tracked in GitHub Boards** to monitor progress and assign responsibilities.
10. **As a developer, I want the app deployed on Vercel** so it is accessible publicly and supports scalability.
