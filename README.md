# Todopod Backend

_220805_ ~ _220830_

- Nest.js, Apollo-Server, GraphQL

## Setup

- [x] nest model setup
- [x] typeorm setup
- [x] postgres setup
- [x] config setup
- [x] schema validation setup (joi)
- [x] graphql setup
- [x] common core entity
- [x] common output dto
- [x] user model / service / resolver testing

## Modeling

- [ ] User Model
  - [x] User Entity
    - [x] User Role
  - [x] Init User Service / Resolver
  - [x] Create Account Mutation
  - [x] Login Mutation
  - [x] Edit Account Mutation
  - [x] Delete Account Mutation
  - [x] User Service Unit Testing
  - [x] Email Validation (mailgun) 220817
  - [x] Relation with Projects
  - [x] Realation with Tasks
  - [x] Relation with Todos
  - [ ] Relation with Photos
  - [ ] Relation with Estimates
  - [ ] Unit Testing
- [ ] Project Model
  - [x] Project Entity
  - [x] User Relation
  - [x] Create Project
  - [x] Get Project
  - [x] Get Projects
    - [x] Pagination
  - [x] Edit Project
  - [x] Delete Project
  - [x] Relation with Task
  - [x] Relation with Photos
  - [ ] Relation with Estimates
  - [x] Comment Entity
    - [ ] Relation with User
  - [ ] Unit Testing
- [x] Tag Model
  - [x] Create Tag
- [ ] Task Model
  - [x] Task Entity
  - [x] Relation with User
  - [x] Relation with Project
  - [x] CRUD Task
    - [x] Create
    - [x] Get All Tasks with Pagination
    - [x] Get a Task
    - [x] Edit Task
    - [x] Delete Task
  - [ ] Relation with Todo
- [ ] Todo Model

  - [x] Todo entity
  - [x] Relation with User
  - [x] Relation with Task
  - X Relation with Photo
  - [x] CRUD Todo
    - [x] Create
    - [x] Get Todos in Task with Pagination
    - [x] Get Todo
    - [x] Edit Todo
      - [x] Edit Progress (Pending, Doing, Done)
    - [x] Delete Todo

- [ ] Photo Model

  - [x] Model Setup
  - [x] User / Project / Task Relation
  - [x] AWS S3 upload setup
  - [x] CRUD
    - [x] Edit Photo
    - [x] Delete Photo + Delete AWS S3 Bucket Object

- [ ] Team

  - [x] Members : Users Relation
  - [x] invite / withdraw member
  - [ ] Project Relation
  - [ ] Task Relation

- [ ] Estimate
  - [ ] MODEL / CRUD Estimate
  - [ ] EXCEL/PDF Manager
