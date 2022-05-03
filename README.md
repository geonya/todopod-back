# todopod backend

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
- [x] Edit Profile
  - [x] username, password, email
  - [x] avatar upload (AWS S3)
    - **Post error** :: pkg GraphQL-upload problem
- [x] Change Avatar

## Project :

- [x] Create Project
  - [x] connect or create Client
- [x] Edit Project
- [x] Delete Project
- [x] See Project
- [ ] See Hashtag
- [ ] Search Project
- [ ] See ToDos
- [ ] See Deadline

## ToDo :

- [x] Create toDo
- [x] Edit toDo
- [ ] Delete toDo

## Photo :

- [ ] Upload Photo

## Hashtag :

- [ ] Create Hashtag
