# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DearMe is a personal period-tracking app. The repo contains three parts, only two of which are active:

- **`Frontend/dearme/`** — the current React single-page app (Create React App). This is the active frontend.
- **`Backend/backend/backend/`** — the Spring Boot API (note the intentional 3-level-deep nesting: `Backend/backend/backend/` is the Maven project root, `pom.xml` lives there).
- **`Frontend/`** (`index.html`, `style.css`, `app.js`) — a legacy plain HTML/JS prototype, superseded by the React app. Leave it alone.

## Commands

### Frontend (`Frontend/dearme/`)

```bash
cd Frontend/dearme
npm start        # dev server at http://localhost:3000
npm test         # interactive test watcher (react-scripts test); single test: npm test -- <name>
npm run build    # production build to build/
```

- CRA-style dev flow: page reloads on save, lint errors surface in the console.
- The dev server requires a Clerk publishable key at `Frontend/dearme/.env` as `REACT_APP_CLERK_PUBLISHABLE_KEY=...`. This file is gitignored — a fresh checkout will not run without creating it. The Clerk key is a public (publishable) key, safe to commit if ever needed.

### Backend (`Backend/backend/backend/`)

```bash
cd Backend/backend/backend
./mvnw spring-boot:run   # run the API (default port 8080)
./mvnw test              # run tests
./mvnw package           # build the jar
```

- Requires a local MySQL instance with a `dearme_db` database. Connection settings live in `src/main/resources/application.properties` (username, password, `spring.jpa.hibernate.ddl-auto=update`), which is **gitignored** and must be recreated on a fresh checkout. The tracked `.gitignore` deliberately excludes it — never force-add credentials.
- Java 17, Spring Boot 3.5.16.

## Architecture

### Frontend (React + Clerk)

- **Auth is Clerk**, not custom code. `App.js` wraps everything in `<ClerkProvider>` and sets up `react-router-dom` routes (`/`, `/login`, `/signup`). The publishable key is passed in from `index.js`, which reads `process.env.REACT_APP_CLERK_PUBLISHABLE_KEY`.
- **Route protection is done with `useUser()` from `@clerk/clerk-react`**: `CycleTracker.js` checks `isSignedIn` and renders Clerk's `<SignIn>` component in place of the tracker when logged out. `NavBar.js` conditionally shows the user's name + `<SignOutButton>` vs. login/signup links.
- `Login.js` and `Signup.js` are thin wrappers around Clerk's `<SignIn>` component. Note `Signup.js` also has a hand-rolled name/email/password form that only logs to the console — it does not authenticate; the Clerk `<SignIn>` handles real auth.
- **The frontend currently does NOT call the backend.** `CycleTracker.js` computes the "next period" prediction client-side (start date + 28 days). There is no API client / fetch to the Spring Boot server yet.

### Backend (Spring Boot, layered)

Standard layered structure under package `com.dearme.backend`:

- `entity/CycleEntry.java` — JPA entity: `id`, `startDate`, `endDate` (`LocalDate`).
- `repository/CycleEntryRepository.java` — Spring Data `JpaRepository<CycleEntry, Long>`.
- `controller/CycleEntryController.java` — `@RestController` at `/api/cycles`, exposing `GET` (all entries) and `POST` (create). No service layer yet.
- `BackendApplication.java` — `@SpringBootApplication` entry point.

No authentication/security is wired on the backend; the Clerk session in the frontend is not yet propagated to API requests.
