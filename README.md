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
  - [ ] Relation with Projects
  - [x] Realation with Tasks
  - [ ] Relation with Todos
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
  - [ ] Relation with Task
  - [ ] Relation with Photos
  - [ ] Relation with Estimates
  - [ ] Unit Testing
- [x] Tag Model
  - [x] Create Tag
- [ ] Task Model
  - [x] Task Entity
  - [x] User Relation
  - [x] Project Relaction
  - [ ] CRUD Task
    - [x] Create
    - [x] Get All Tasks with Pagination
    - [ ] Get a Task
    - [ ] Edit Task
    - [ ] Delete Task
- [ ] Todo Model
- [ ] Photo Model
- [ ] Estimate Model
