
# Blog App

A Django + React application for blog application. Users can. securely signup / login with jwt and create, update or read blogs. Also users can create comments on Blog

# Tech Stack

## Backend
Django

Django RestFrameWork

Sqlite

## Frontend
React

BootStrap



# Run Locally

Go to the project directory

```bash
  cd merjo_blog
```

## Backend

Go to backend directory

```bash
  cd backend
```

Install dependencies

```bash
  pip install -r requirements.txt
```

Make Migrations

```
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```

#### Server will be running on http://127.0.0.1:8000/


## Frontend

Go to frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

#### Server will be running on http://127.0.0.1:3000/


# Environment Variables

## backend

you will need to create `.env` file in backend folder add the following environment variables

`JWT_KEY=any_random_key`

`JWT_ALGO=HS256`

`ENV=local`

`DJANGO_SECRET=any_secret_key`

## frontend

you will need to create `.env` file in frontend folder add the following environment variables

`VITE_API_URL=http://127.0.0.1:8000`



# API Reference

## Signup API

```http
  POST /api/users/signup
```

| Body      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`    | `string` | **Required**. Name         |
| `email`   | `string` | **Required**. Email        |
| `password`| `string` | **Required**. Password     |

## Login API

```http
  POST /api/users/login
```

| Body      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`   | `string` | **Required**. Email        |
| `password`| `string` | **Required**. Password     |

## Logout API

```http
  GET /api/users/logout
```

## User Data API

```http
  GET /api/users/user
```

Returns the data of logged In User

## Get All blogs API

```http
  GET /api/blog/get_blogs
```
Returns list of all blogs

## Get Blog by id API

```http
  GET /api/blog/get_blog/:id
```
id - Blog Id

Returns the data of blog by given id

## Get Comments of a Blog API

```http
  GET /api/blog/get_comments/:id
```
id - Blog id

Returns the List of comments of given blog id


## Crate Blog API

```http
  POST /api/blog/create_blog
```

| Body      | Type     | Description                    |
| :-------- | :------- | :-------------------------     |
| `title`    | `string` | **Required**. Title of blog   |
| `content`  | `string` | **Required**. content of Blog |


## Crate Comment on Blog API

```http
  POST /api/blog/create_comment/:id
```

id - id of blog

| Body      | Type     | Description                       |
| :-------- | :------- | :-------------------------        |
| `content`  | `string` | **Required**. content of Comment |


## Update Blog API

```http
  POST /api/blog/update_blog/:id
```

id - id of blog

| Body      | Type     | Description                    |
| :-------- | :------- | :-------------------------     |
| `title`    | `string` | **Optional**. Title of blog   |
| `content`  | `string` | **Optional**. content of Blog |




# Features

- Seure API
- clean Code
- Interactive UI

