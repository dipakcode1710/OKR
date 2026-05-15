# OKR Management System — Spring Boot

A REST API for managing OKR (Objectives and Key Results) with full CRUD operations, JWT-based authentication, and automatic progress roll-up.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Language   | Java 17                           |
| Framework  | Spring Boot 3.2.4                 |
| Persistence| Spring Data JPA + MySQL 8         |
| Security   | Spring Security + JWT (jjwt 0.11) |
| Mapping    | MapStruct 1.5.5                   |
| Utils      | Lombok 1.18.32                    |

---

## Setup

### 1. Configure Database
Edit `src/main/resources/application.yaml`:
```yaml
  datasource:
    url: jdbc:mysql://localhost:3306/okr_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 2. Build & Run
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```
Server starts at `http://localhost:8080`

---

## Authentication

All `/api/v1/**` endpoints require a JWT Bearer token. Only `/api/auth/**` is public.

### Login
```
POST /api/auth/login
```
**Request**
```json
{ "email": "user@example.com", "password": "secret" }
```
**Response**
```json
{
  "token": "<jwt>",
  "email": "user@example.com",
  "role": "ADMIN",
  "name": "John Doe"
}
```

Pass the token in every subsequent request:
```
Authorization: Bearer <jwt>
```

---

## API Reference

### Teams — `/api/v1/teams`

| Method | Endpoint                    | Description         |
|--------|-----------------------------|---------------------|
| POST   | `/api/v1/teams`             | Create team         |
| GET    | `/api/v1/teams`             | List all teams      |
| GET    | `/api/v1/teams?search=eng`  | Search by name      |
| GET    | `/api/v1/teams/{id}`        | Get team by ID      |
| PUT    | `/api/v1/teams/{id}`        | Update team         |
| DELETE | `/api/v1/teams/{id}`        | Delete team         |

#### Create / Update Team Request
```json
{
  "name": "Engineering",
  "description": "Core engineering team"
}
```

---

### OKR Cycles — `/api/v1/cycles`

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/v1/cycles`            | Create cycle             |
| GET    | `/api/v1/cycles`            | List all cycles          |
| GET    | `/api/v1/cycles/active`     | List active cycles only  |
| GET    | `/api/v1/cycles/{id}`       | Get cycle by ID          |
| PUT    | `/api/v1/cycles/{id}`       | Update cycle             |
| PATCH  | `/api/v1/cycles/{id}/lock`  | Lock cycle (no body)     |
| DELETE | `/api/v1/cycles/{id}`       | Delete cycle             |

#### Create / Update Cycle Request
```json
{
  "cycleName": "Q1 2026",
  "cycleCode": "Q1-2026",
  "cycleType": "quarterly",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "createdBy": 1
}
```

---

### OKR Objectives — `/api/v1/objectives`

| Method | Endpoint                            | Description                    |
|--------|-------------------------------------|--------------------------------|
| POST   | `/api/v1/objectives`                | Create objective               |
| GET    | `/api/v1/objectives`                | List all (non-deleted)         |
| GET    | `/api/v1/objectives?cycleId=1`      | Filter by cycle                |
| GET    | `/api/v1/objectives?employeeId=1`   | Filter by owner employee       |
| GET    | `/api/v1/objectives?teamId=1`       | Filter by owner team           |
| GET    | `/api/v1/objectives?status=active`  | Filter by status               |
| GET    | `/api/v1/objectives/{id}`           | Get by ID                      |
| GET    | `/api/v1/objectives/public/{uid}`   | Get by UUID public_id          |
| GET    | `/api/v1/objectives/{id}/children`  | Get child objectives           |
| GET    | `/api/v1/objectives/{id}/aligned`   | Get strategically aligned      |
| PUT    | `/api/v1/objectives/{id}`           | Full update (bumps version_no) |
| PATCH  | `/api/v1/objectives/{id}/status`    | Update status only             |
| PATCH  | `/api/v1/objectives/{id}/progress`  | Update progress + confidence   |
| DELETE | `/api/v1/objectives/{id}`           | Soft delete (sets deleted_at)  |
| DELETE | `/api/v1/objectives/{id}/hard`      | Hard / permanent delete        |
| PATCH  | `/api/v1/objectives/{id}/restore`   | Restore soft-deleted objective |

#### Create Objective Request
```json
{
  "cycleId": 1,
  "ownerEmployeeId": 10,
  "ownerTeamId": 2,
  "objectiveTitle": "Improve customer retention by 20%",
  "objectiveDescription": "Focus on onboarding and support",
  "objectiveScope": "team",
  "objectiveType": "committed",
  "goalCategory": "objective",
  "status": "active",
  "progressPct": 0,
  "confidenceScore": 8,
  "scoringMethod": "weighted_kr_average",
  "checkInFrequency": "weekly",
  "startDate": "2025-01-01",
  "dueDate": "2025-03-31"
}
```

#### Status Update
```json
{ "status": "at_risk" }
```

#### Progress Update
```json
{ "progressPct": 65, "confidenceScore": 7 }
```

---

### Key Results — `/api/v1/key-results`

| Method | Endpoint                                      | Description                              |
|--------|-----------------------------------------------|------------------------------------------|
| GET    | `/api/v1/objectives/{objectiveId}/key-results`| List KRs for an objective                |
| GET    | `/api/v1/key-results/{id}`                    | Get KR by ID                             |
| POST   | `/api/v1/key-results`                         | Create KR                                |
| PUT    | `/api/v1/key-results/{id}`                    | Update KR                                |
| PATCH  | `/api/v1/key-results/{id}/progress`           | Update progress (rolls up to objective)  |
| DELETE | `/api/v1/key-results/{id}`                    | Delete KR                                |

#### Create / Update Key Result Request
```json
{
  "objectiveId": 1,
  "keyResultTitle": "Reduce churn rate to 5%",
  "keyResultDescription": "Track monthly cohort churn",
  "metricName": "Churn Rate",
  "measurementUnit": "%",
  "baselineValue": 12.0,
  "targetValue": 5.0,
  "measurementType": "percentage",
  "weightPct": 50,
  "createdBy": 1
}
```

#### Progress Update
```json
{ "progressPct": 40, "confidenceScore": 7 }
```

---

### Initiatives — `/api/v1/initiatives`

| Method | Endpoint                                         | Description                    |
|--------|--------------------------------------------------|--------------------------------|
| GET    | `/api/v1/key-results/{keyResultId}/initiatives`  | List initiatives for a KR      |
| GET    | `/api/v1/initiatives/{id}`                       | Get initiative by ID           |
| POST   | `/api/v1/initiatives`                            | Create initiative              |
| PUT    | `/api/v1/initiatives/{id}`                       | Update initiative              |
| DELETE | `/api/v1/initiatives/{id}`                       | Delete initiative              |

#### Create / Update Initiative Request
```json
{
  "keyResultId": 3,
  "initiativeTitle": "Launch re-engagement email campaign",
  "initiativeDescription": "Automated drip for inactive users",
  "ownerEmployeeId": 5,
  "initiativeStatus": "planned",
  "priority": "high",
  "completionPct": 0,
  "blockerNote": null,
  "startDate": "2025-01-10",
  "dueDate": "2025-02-28",
  "sortOrder": 1,
  "createdBy": 1
}
```

---

### Check-ins — `/api/v1/check-ins`

| Method | Endpoint                                          | Description                        |
|--------|---------------------------------------------------|------------------------------------|
| GET    | `/api/v1/objectives/{objectiveId}/check-ins`      | List check-ins for an objective    |
| GET    | `/api/v1/key-results/{keyResultId}/check-ins`     | List check-ins for a KR            |
| GET    | `/api/v1/check-ins/{id}`                          | Get check-in by ID                 |
| POST   | `/api/v1/check-ins`                               | Create check-in                    |
| PUT    | `/api/v1/check-ins/{id}`                          | Update check-in                    |
| DELETE | `/api/v1/check-ins/{id}`                          | Delete check-in                    |

#### Create / Update Check-in Request
```json
{
  "objectiveId": 1,
  "keyResultId": 3,
  "employeeId": 5,
  "checkInDate": "2025-01-15",
  "weekNumber": 3,
  "updateType": "progress_update",
  "summary": "Good progress this week",
  "details": "Completed email template designs",
  "progressPct": 25,
  "healthStatus": "green",
  "wins": "Finished design review",
  "blockers": null,
  "nextSteps": "Start development sprint"
}
```

---

## Enum Values

### Objective
| Field               | Values                                                                  |
|---------------------|-------------------------------------------------------------------------|
| `objectiveScope`    | `personal`, `team`, `department`, `company`                            |
| `objectiveType`     | `committed`, `aspirational`, `learning`                                |
| `goalCategory`      | `objective`, `initiative`, `operational`                               |
| `status`            | `draft`, `active`, `at_risk`, `completed`, `cancelled`, `archived`     |
| `scoringMethod`     | `manual`, `weighted_kr_average`, `binary`, `milestone_based`           |
| `checkInFrequency`  | `weekly`, `biweekly`, `monthly`                                        |

### Cycle
| Field       | Values                                           |
|-------------|--------------------------------------------------|
| `cycleType` | `monthly`, `quarterly`, `half_yearly`, `yearly`, `custom` |

### Key Result
| Field             | Values                                                   |
|-------------------|----------------------------------------------------------|
| `measurementType` | `percentage`, `count`, `currency`, `boolean_type`, `custom` |
| `reviewStatus`    | `draft`, `submitted`, `approved`, `closed`               |

### Initiative
| Field               | Values                                            |
|---------------------|---------------------------------------------------|
| `initiativeStatus`  | `planned`, `active`, `blocked`, `completed`, `cancelled` |
| `priority`          | `low`, `medium`, `high`, `critical`               |

### Check-in
| Field          | Values                                                    |
|----------------|-----------------------------------------------------------|
| `updateType`   | `progress_update`, `milestone`, `risk`, `blocker`, `general` |
| `healthStatus` | `green`, `amber`, `red`                                   |

---

## Response Format

All `/api/v1/**` endpoints return a standard envelope:
```json
{
  "success": true,
  "message": "Objective created",
  "data": { ... },
  "timestamp": "2025-05-09T10:00:00"
}
```

The `POST /api/auth/login` endpoint returns a flat `LoginResponse` (no envelope).
