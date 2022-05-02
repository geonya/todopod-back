# todopod

- ultimate project managing app

- [x] Prisma / GraphQL / Apollo Server Setup

## Prisma Schema :

- [x] User Schema
  - username, email, password, avatar, projects, comments,toDos, photos, docs
- [x] Project Schema
  - user, toDos, hashtags, comments, deadline, client
- [x] ToDo Schema
  - user, project, hashtags, work
- [x] HashTag Schema
  - hashtag, projects, toDos
- [x] Comment Schema
  - payload, user, project
- [x] Photo Schema
  - file, caption, hashtags
- [x] Doc Schema
  - user file caption
- [x] Client Schema
  - name, phone, email, bizNumber, sales, memo

## User :

- [x] Create Account
- [x] SeeProfile
- [x] Login
  - [x] sign & verify token
  - [x] getUser -> loggedInUser
  - [x] Protect Resolver
- [ ] Edit Profile
  - [x] username, password, email
  - [ ] avatar upload (AWS S3)
    - **Post error**
- [ ] Change Avatar

## Project :

- [ ] Create Project
- [ ] Edit Project

- [ ] Delete Project
- [ ] See Project
- [ ] See Hashtag
- [ ] Search Project
- [ ] See ToDos
- [ ] See Deadline

## ToDo :

- [ ] Create toDo
- [ ] Edit toDo
- [ ] Delete toDo
