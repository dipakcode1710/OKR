# OKR Management System — Spring Boot

A REST API for managing OKR (Objectives and Key Results) with full CRUD operations.

---

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- Spring Data JPA
- MySQL 8
- Lombok

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

## API Reference

### Teams — `/api/v1/teams`

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/v1/teams`     | Create team          |
| GET    | `/api/v1/teams`     | List all teams       |
| GET    | `/api/v1/teams?search=eng` | Search by name  |
| GET    | `/api/v1/teams/{id}`| Get team by ID       |
| PUT    | `/api/v1/teams/{id}`| Update team          |
| DELETE | `/api/v1/teams/{id}`| Delete team          |

#### Create / Update Team Request
```json
{
  "name": "Engineering",
  "description": "Core engineering team"
}
```

---

### OKR Objectives — `/api/v1/objectives`

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | `/api/v1/objectives`              | Create objective                   |
| GET    | `/api/v1/objectives`              | List all (non-deleted)             |
| GET    | `/api/v1/objectives?cycleId=1`    | Filter by cycle                    |
| GET    | `/api/v1/objectives?employeeId=1` | Filter by owner employee           |
| GET    | `/api/v1/objectives?teamId=1`     | Filter by owner team               |
| GET    | `/api/v1/objectives?status=active`| Filter by status                   |
| GET    | `/api/v1/objectives/{id}`         | Get by ID                          |
| GET    | `/api/v1/objectives/public/{uid}` | Get by UUID public_id              |
| GET    | `/api/v1/objectives/{id}/children`| Get child objectives               |
| GET    | `/api/v1/objectives/{id}/aligned` | Get strategically aligned          |
| PUT    | `/api/v1/objectives/{id}`         | Full update (bumps version_no)     |
| PATCH  | `/api/v1/objectives/{id}/status`  | Update status only                 |
| PATCH  | `/api/v1/objectives/{id}/progress`| Update progress + confidence       |
| DELETE | `/api/v1/objectives/{id}`         | Soft delete (sets deleted_at)      |
| DELETE | `/api/v1/objectives/{id}/hard`    | Hard / permanent delete            |
| PATCH  | `/api/v1/objectives/{id}/restore` | Restore soft-deleted objective     |

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

## Enum Values

| Field               | Values                                                    |
|---------------------|-----------------------------------------------------------|
| `objectiveScope`    | `personal`, `team`, `department`, `company`              |
| `objectiveType`     | `committed`, `aspirational`, `learning`                  |
| `goalCategory`      | `objective`, `initiative`, `operational`                 |
| `status`            | `draft`, `active`, `at_risk`, `completed`, `cancelled`, `archived` |
| `scoringMethod`     | `manual`, `weighted_kr_average`, `binary`, `milestone_based` |
| `checkInFrequency`  | `weekly`, `biweekly`, `monthly`                          |

---

## Response Format
All endpoints return a standard envelope:
```json
{
  "success": true,
  "message": "Objective created",
  "data": { ... },
  "timestamp": "2025-05-09T10:00:00"
}
```
