
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

you will need to add the following environment variables to your .env file

`JWT_KEY=any_random_key`

`JWT_ALGO=HS256`

`ENV=local`

`DJANGO_SECRET=any_secret_key`

## frontend

you will need to add the following environment variables to your .env file

`VITE_API_URL=http://127.0.0.1:8000`


# Features

- Seure API
- clean Code
- Interactive UI

