# MP2-Zinema-Gr-02

Zinema is a web-based movie streaming platform that allows users to explore, play, and rate films in a modern, responsive, and accessible environment. The system provides complete account management, enabling users to interact with the movie catalog through favorites, ratings, comments, and subtitle controls.

## Development Team - InnoJI Software Development

| Role | Name | Responsibilities |
|------|------|------------------|
| **Product Owner** | Jonathan Aristizabal | Product management and requirements |
| **Backend Developer** | Jhorman Gomez | Server and API development |
| **Frontend Developer** | Jonathan Aristizabal | User interface development |
| **Database Specialist** | Jose Martinez | Database design and management |
| **VCS & Project Manager** | Isabella Ruiz | Version control and project management |
# Zinema Frontend

Frontend for the Zinema platform (movies/series). Built with Vite + React + TypeScript and styled with SASS. The app consumes the backend via Fetch API, follows clean code practices, and includes basic accessibility improvements.

## Tech Stack

- **Vite** (build tool and dev server)
- **React** + **TypeScript**
- **SASS/SCSS** modules
- **Fetch API** (no extra HTTP libs)
- **A11y**: landmarks, labels, focus styles; WCAG improvements in progress
- **JSDoc**: inline documentation for key components and utilities

## Project Structure (frontend)

```
Zinema-frontend/
├── public/                 # Static assets (images, icons, logos)
├── src/
│   ├── lib/api/            # API client (apiFetch)
│   ├── modules/            # Features (landing, auth, app)
│   ├── shared/components/  # Reusable UI (Toast, provider)
│   └── styles/             # Global tokens, base, mixins
└── README.md
```


## Getting Started

```bash
cd Zinema-frontend
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```


