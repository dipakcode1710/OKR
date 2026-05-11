# OKR Manager — React Frontend

Frontend for the OKR application. Same UI as the original monolithic `OkrApp.jsx`,
now split into a proper folder structure and wired to the Spring Boot backend
via the endpoints documented in the Postman collection.

## Stack

- **React 18** + **Vite**
- **Axios** for HTTP
- React Context for global OKR state
- Plain inline styles + CSS variables (theme tokens unchanged)

## Quick start

```bash
# 1. Install
npm install

# 2. Point at your backend (default is http://localhost:8080)
echo "VITE_API_BASE_URL=http://localhost:8080" > .env

# 3. Run dev server
npm run dev
```

Open `http://localhost:5173`.

If the backend is unreachable, the app falls back to the original seed data
so the UI still renders — a small "Offline — showing demo data" pill appears
on the dashboard.

## Folder structure

```
okr-app/
├── index.html
├── package.json
├── vite.config.js
├── .env                          # VITE_API_BASE_URL
└── src/
    ├── main.jsx                  # Vite entry, mounts <OkrProvider><App/>
    ├── App.jsx                   # Top-level screen + modal orchestrator
    ├── index.css                 # Global resets, font
    │
    ├── api/
    │   ├── client.js             # Axios instance + interceptors (envelope unwrap)
    │   └── endpoints.js          # All URL paths in one place
    │
    ├── services/                 # One service per controller
    │   ├── cycleService.js
    │   ├── objectiveService.js
    │   ├── keyResultService.js
    │   ├── initiativeService.js
    │   ├── checkInService.js
    │   ├── teamService.js
    │   └── index.js              # barrel export
    │
    ├── context/
    │   └── OkrContext.jsx        # Loads all data on mount, exposes mutations
    │
    ├── components/
    │   ├── common/               # Avatar, Badge, Btn, HealthDot, Modal,
    │   │                         # ProgressBar, FormControls
    │   ├── layout/               # Sidebar, Topbar
    │   └── modals/               # 6 modals, all wired to API
    │
    ├── screens/                  # Dashboard, Objectives, ObjectiveDetail,
    │                             # KeyResults, InitiativesScreen,
    │                             # CheckInsScreen, CyclesScreen
    │
    ├── utils/
    │   ├── theme.js              # Color tokens + style helpers
    │   └── mappers.js            # Backend DTO <-> UI shape converters
    │
    └── data/
        └── seedData.js           # Fallback demo data if API is down
```

## How the API layer works

1. **`api/client.js`** sets up an axios instance with base URL `${VITE_API_BASE_URL}/api/v1`.
   A response interceptor unwraps the `ApiResponse<T>` envelope so service
   methods return the bare `data` payload.
2. **`api/endpoints.js`** lists every URL path from the Postman collection.
   Nothing else in the codebase concatenates paths by hand.
3. **`services/*.js`** — one file per controller (cycles, objectives, key-results,
   initiatives, check-ins, teams). Each method matches a controller endpoint
   one-for-one.
4. **`utils/mappers.js`** translates between the Java DTO field names
   (`objectiveTitle`, `progressPct`, `keyResultId`, etc.) and the shorter
   UI field names (`title`, `progress`, `krId`, etc.) the components already use.
   This is why **no UI code had to change**.
5. **`context/OkrContext.jsx`** loads cycles, objectives, all KRs, all initiatives,
   and all check-ins on first render. Mutation methods (create/update/delete)
   keep local state in sync after each call.

## Endpoint coverage

Every endpoint in the Postman collection has a matching service method:

| Resource     | Operations                                                                  |
| ------------ | --------------------------------------------------------------------------- |
| Cycles       | list · active · byId · create · update · lock · delete                      |
| Objectives   | list (+filters) · byId · byPublicId · children · aligned · create · update · status · progress · soft/hard delete · restore |
| Key Results  | byObjective · byId · create · update · updateProgress · delete              |
| Initiatives  | byKeyResult · byId · create · update · delete                               |
| Check-ins    | byObjective · byKeyResult · byId · create · update · delete                 |
| Teams        | list (+search) · byId · create · update · delete                            |

## Notes

- Updating a Key Result's progress automatically re-fetches the parent objective
  so the rolled-up progress percentage stays consistent with the backend.
- Cycle lock is a `PATCH` button that flips the `locked` flag in-place.
- All modals show inline error messages if the API call fails — the modal
  stays open so the user can correct and retry.
- The Sidebar's "Cycle pill" is static text from the original design; if you
  want it dynamic, read `cycles[0]?.name` from `useOkr()`.
