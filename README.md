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

- [x] Create Project _220503_
  - [x] connect or create Client _220503_
- [x] Edit Project _220503_
- [x] Delete Project _220503_
- [x] See Project _220503_
- [x] Search Projects _220504_
  - [x] using contains
  - [ ] `previewFeatures = ["fullTextSearch"]` ?

## ToDo :

- [x] Create toDo _220503_
- [x] Edit toDo _220503_
- [x] Delete toDo _220504_
- [x] See ToDos _220504_
- [x] See ToDo _220504_

## Hashtag

- [x] Create hashtag
  - [x] makeHashtags utility function _220504_
  - [x] project description _220504_
  - [x] todo work _220504_
  - [x] photo caption _220504_
- [x] See hashtag _220504_
- [x] See hashtags _220504_
- [ ] hashtag data(projects, todos, photos) pagination ?

## Photo :

- [x] Upload Photo to AWS S3 _220504_
- [x] See Photo _220504_
- [x] Edit Photo _220504_
- [x] Delete Photo & AWS S3 cascade delete (avatars, photos) _220504_
      https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property

## Document :

- [ ] Upload Photo to AWS S3
- [ ] See Doc
- [ ] Edit Doc
- [ ] Delete Doc & AWS S3 cascade delete

## Comment :

- [ ] Create Comment
- [ ] Edit Comment
- [ ] Delete Comment
- [ ] See Comments
- [ ] See Comment
