# Project Management SaaS - Software Design Document (Version 1.0)

---

# 1. Project Overview

## Project Type

Modern Project Management SaaS for individuals and small teams.

## Problem Statement

Help individuals and small teams organize projects and track tasks using an intuitive Kanban board interface with a clean, modern, and fast user experience.

## Target Users

* Small teams (1–10 members)
* Developers
* Freelancers
* Students
* Startups

---

# 2. Product Goals

The application should allow users to:

* Register and log in
* Create multiple workspaces
* Invite team members
* Create projects
* Create multiple boards inside projects
* Organize work using Kanban boards
* Create and manage tasks
* Drag and drop tasks between lists
* Search tasks
* Manage user roles and permissions

---

# 3. MVP Features

## Authentication

* Register
* Login
* Logout
* JWT Authentication

---

## Workspace

* Create workspace
* Edit workspace
* Delete workspace
* Workspace settings
* Invite members using invite links

---

## Members

Roles:

* Owner
* Admin
* Member

---

## Projects

* Create
* Edit
* Delete
* Archive

---

## Boards

* Multiple boards per project
* Create
* Rename
* Delete

---

## Lists

* Create
* Rename
* Delete
* Reorder

Default Lists

* To Do
* In Progress
* Done

---

## Tasks

* Create
* Edit
* Delete
* Assign members
* Priority
* Labels
* Due Date
* Drag & Drop
* Search

---

## User Profile

* Update name
* Update avatar

---

# 4. Features Excluded From MVP

* Real-time collaboration
* Notifications
* Comments
* File attachments
* Rich text editor
* Calendar view
* AI features
* Email invitations
* Time tracking
* Analytics
* Mobile application

---

# 5. High-Level Architecture

```
React (Client)

↓

REST API

↓

Express Server

↓

MongoDB
```

---

# 6. Core Entities

* User
* Workspace
* WorkspaceMember
* Project
* Board
* List
* Task

---

# 7. Entity Hierarchy

```
User

↓

Workspace

↓

Project

↓

Board

↓

List

↓

Task
```

WorkspaceMember connects Users and Workspaces.

---

# 8. Relationship Design

## User ↔ Workspace

Many-to-Many

Implemented using WorkspaceMember.

---

## Workspace → Project

One-to-Many

Project stores:

workspaceId

---

## Project → Board

One-to-Many

Board stores:

projectId

---

## Board → List

One-to-Many

List stores:

boardId

---

## List → Task

One-to-Many

Task stores:

listId

---

# 9. Referencing vs Embedding

## Referenced Collections

* WorkspaceMember
* Project
* Board
* List
* Task

Reason:

Independent lifecycle and scalability.

---

## Embedded Data

Workspace Labels

Example

```
Workspace

labels

- Bug
- Feature
- Backend
- Frontend
```

Reason:

Small dataset

Rarely changes

Shared by every project

---

# 10. Collections

## User

* name
* email
* password
* avatar
* createdAt
* updatedAt

---

## Workspace

* name
* description
* logo
* ownerId
* labels
* createdAt
* updatedAt

---

## WorkspaceMember

* workspaceId
* userId
* role
* joinedAt

---

## Project

* workspaceId
* name
* description
* archived
* createdBy
* createdAt
* updatedAt

---

## Board

* projectId
* name
* description
* position
* createdAt
* updatedAt

---

## List

* boardId
* name
* position
* createdAt
* updatedAt

---

## Task

* listId
* title
* description
* assigneeId
* createdBy
* priority
* labels
* dueDate
* position
* createdAt
* updatedAt

---

# 11. Database Indexes

## User

* email (unique)

---

## WorkspaceMember

* userId
* workspaceId
* compound(workspaceId,userId) unique

---

## Project

* workspaceId

---

## Board

* projectId

---

## List

* boardId

---

## Task

* listId
* assigneeId
* dueDate
* compound(listId,position)

---

# 12. Roles

Owner

Admin

Member

---

# 13. Permission Matrix

## Workspace

| Action | Owner | Admin | Member |
| ------ | :---: | :---: | :----: |
| View   |   ✅   |   ✅   |    ✅   |
| Edit   |   ✅   |   ✅   |    ❌   |
| Delete |   ✅   |   ❌   |    ❌   |
| Leave  |   ✅*  |   ✅   |    ✅   |

*Owner must transfer ownership before leaving if they are the only owner.

---

## Members

| Action             | Owner | Admin | Member |
| ------------------ | :---: | :---: | :----: |
| Invite             |   ✅   |   ✅   |    ❌   |
| Remove             |   ✅   |   ✅   |    ❌   |
| Change Role        |   ✅   |   ❌   |    ❌   |
| Transfer Ownership |   ✅   |   ❌   |    ❌   |

---

## Projects

| Action  | Owner | Admin | Member |
| ------- | :---: | :---: | :----: |
| Create  |   ✅   |   ✅   |    ✅   |
| Edit    |   ✅   |   ✅   |    ✅   |
| Archive |   ✅   |   ✅   |    ❌   |
| Delete  |   ✅   |   ✅   |    ❌   |

---

## Boards

| Action | Owner | Admin | Member |
| ------ | :---: | :---: | :----: |
| Create |   ✅   |   ✅   |    ✅   |
| Rename |   ✅   |   ✅   |    ✅   |
| Delete |   ✅   |   ✅   |    ❌   |

---

## Lists

| Action | Owner | Admin | Member |
| ------ | :---: | :---: | :----: |
| Create |   ✅   |   ✅   |    ✅   |
| Rename |   ✅   |   ✅   |    ✅   |
| Delete |   ✅   |   ✅   |    ❌   |

---

## Tasks

| Action | Owner | Admin | Member |
| ------ | :---: | :---: | :----: |
| Create |   ✅   |   ✅   |    ✅   |
| Edit   |   ✅   |   ✅   |    ✅   |
| Move   |   ✅   |   ✅   |    ✅   |
| Assign |   ✅   |   ✅   |    ✅   |
| Delete |   ✅   |   ✅   |    ✅   |

---

# 14. Authentication Flow

```
User Login

↓

JWT Generated

↓

Protected Route

↓

JWT Verification

↓

Authenticated User
```

---

# 15. Authorization Flow

```
Request

↓

Authenticate JWT

↓

Find WorkspaceMember

↓

Read Role

↓

Permission Check

↓

Allow or Reject
```

---

# 16. API Design

Architecture

REST API

---

## Resource Naming

```
/users

/workspaces

/projects

/boards

/lists

/tasks
```

Use HTTP methods instead of verbs.

---

## Response Format

Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

## Status Codes

200

201

204

400

401

403

404

409

500

---

## Pagination

```
?page=1

&limit=20
```

---

## Filtering

```
?priority=high

?assignee=id

?label=bug
```

---

## Sorting

```
?sort=dueDate

?sort=createdAt

?sort=priority
```

---

## Search

```
?search=login
```

---

# 17. Frontend Architecture

## Public Routes

```
/

/login

/register

/forgot-password

/reset-password/:token
```

---

## Protected Routes

```
/overview

/workspaces

/workspaces/:workspaceId

/workspaces/:workspaceId/settings

/workspaces/:workspaceId/members

/workspaces/:workspaceId/projects/:projectId

/workspaces/:workspaceId/projects/:projectId/boards/:boardId

/profile

/settings
```

---

## Layouts

RootLayout

↓

PublicLayout

↓

DashboardLayout

---

## UI Components

* Button
* Input
* Dialog
* Badge
* Avatar
* Tooltip
* Dropdown
* Skeleton
* Spinner

---

## Shared Components

* Sidebar
* Header
* Search Bar
* Breadcrumb
* Theme Toggle
* Empty State
* Confirm Dialog

---

## Feature Components

Each feature owns its components.

Example:

Task

* TaskCard
* TaskDialog
* TaskLabels
* TaskPriority
* TaskMenu

---

# 18. State Management

## RTK Query

Server State

* Users
* Workspaces
* Projects
* Boards
* Lists
* Tasks

---

## Redux Toolkit

Global UI State

* Sidebar
* Current Workspace
* Command Palette

---

## Local State

* Dialogs
* Dropdowns
* Forms
* Hover States

---

# 19. Data Flow

```
User Action

↓

RTK Query

↓

REST API

↓

MongoDB

↓

Updated Response

↓

Automatic Cache Update

↓

UI Re-render
```

---

# 20. Performance Strategy

* Route lazy loading
* RTK Query caching
* Skeleton loading
* Error boundaries
* Bundle splitting
* Memoization only when necessary
* Responsive images where applicable

---

# 21. Project Structure

```
project-management-saas/

client/

server/

docs/

README.md
```

---

## Client

```
src/

app/

assets/

components/

features/

hooks/

lib/

pages/

routes/

services/

store/

types/

utils/

constants/

validations/

styles/
```

---

## Server

```
src/

config/

controllers/

middleware/

models/

routes/

services/

repositories/

validators/

utils/

constants/

errors/

database/

uploads/
```

---

# 22. Environment Variables

## Client

```
VITE_API_URL
```

---

## Server

```
PORT

NODE_ENV

MONGODB_URI

JWT_SECRET

JWT_EXPIRES_IN

CLIENT_URL
```

---

# 23. Development Principles

* Design before implementation.
* Child entities store parent references.
* Avoid unnecessary data duplication.
* Keep controllers thin.
* Place business logic in services.
* Use repositories for database access.
* Keep APIs consistent.
* Build reusable UI components.
* Optimize only after identifying real bottlenecks.
* Follow feature-based organization.
* Write meaningful Git commits.
* Build for maintainability, scalability, accessibility, security, and performance.

---

# 24. Implementation Roadmap

1. Initialize client and server
2. Configure development environment
3. Backend foundation
4. Frontend foundation
5. Authentication
6. Workspaces
7. Members & Roles
8. Projects
9. Boards
10. Lists
11. Tasks
12. Drag & Drop
13. Search & Filters
14. Polish & Performance
15. Deployment
16. Documentation
17. Final Testing

---

# Project Vision

> Build a modern, scalable, production-quality project management SaaS for individuals and small teams using React, Express, MongoDB, Redux Toolkit, RTK Query, Tailwind CSS, and shadcn/ui, following real-world software engineering principles from planning through deployment.
