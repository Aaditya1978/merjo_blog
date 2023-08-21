from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from .models import Users
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import validate_email
import os
import jwt

jwt_key = os.environ.get('JWT_KEY')
jwt_algo = os.environ.get('JWT_ALGO')


# Create your views here.

@api_view(['POST'])
def signup(request):
    data = request.data

    if len(data['name']) < 2:
        return Response({'error': 'Name must be at least 2 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    email = data['email']
    try:
        validate_email(email)
    except:
        return Response({'error': 'Enter a valid email'}, status=status.HTTP_400_BAD_REQUEST)
    
    if Users.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(data['password']) < 6:
        return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    password = make_password(data['password'])

    userData = {
        'name': data['name'],
        'email': email,
        'password': password
    }

    serializer = UserSerializer(data=userData)
    if serializer.is_valid():
        serializer.save()
        token = jwt.encode({'id': serializer.data['id']}, jwt_key, algorithm=jwt_algo)
        response = Response({'message': 'User created successfully', 'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
        response.set_cookie(key='jwt', value=token, httponly=True)
        return response
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def login(request):
    data = request.data

    if not Users.objects.filter(email=data['email']).exists():
        return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = Users.objects.get(email=data['email'])
    if user:
        if check_password(data['password'], user.password):
            token = jwt.encode({'id': user.id}, jwt_key, algorithm=jwt_algo)
            response = Response({'message': 'Logged in successfully', 'id': user.id}, status=status.HTTP_200_OK)
            response.set_cookie(key='jwt', value=token, httponly=True)
            return response
        else:
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def logout(request):
    response = Response({'success': 'Logged out successfully'}, status=status.HTTP_200_OK)
    response.delete_cookie('jwt')
    return response


@api_view(['GET'])
def user(request):
    token = request.COOKIES.get('jwt')
    if not token:
        return Response({'error': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algo])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Session expired'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        user = Users.objects.get(id=payload['id'])
    except Users.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializer(user)

    userData = {
        'id': serializer.data['id'],
        'name': serializer.data['name'],
        'email': serializer.data['email']
    }

    return Response(userData, status=status.HTTP_200_OK)