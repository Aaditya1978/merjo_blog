from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import BlogSerializer, CommentSerializer
from .models import Blog, Comment
from users.models import Users
from users.serializers import UserSerializer
import os
import jwt

jwt_key = os.environ.get('JWT_KEY')
jwt_algo = os.environ.get('JWT_ALGO')


# Create your views here.

@api_view(['GET'])
def get_blogs(request):
    blogs = Blog.objects.all()
    serializer = BlogSerializer(blogs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_blog(request, blog_id):
    blog = Blog.objects.get(id=blog_id)
    serializer = BlogSerializer(blog)
    author = Users.objects.get(id=blog.author.id)
    authorSerializer = UserSerializer(author)
    return Response({'blog': serializer.data, 'author': authorSerializer.data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_comments(request, blog_id):
    comments = Comment.objects.filter(blog=blog_id)
    serializer = CommentSerializer(comments, many=True)
    commentData = serializer.data
    for comment in commentData:
        author = Users.objects.get(id=comment['author'])
        authorSerializer = UserSerializer(author)
        comment['author_name'] = authorSerializer.data['name']
    return Response(commentData, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_blog(request):
    data = request.data
    token = request.COOKIES.get('jwt')
    if not token:
        return Response({'error': 'Please login to create a blog'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algo])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Please login to create a blog'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.exceptions.DecodeError:
        return Response({'error': 'Please login to create a blog'}, status=status.HTTP_401_UNAUTHORIZED)

    if len(data['title']) < 5:
        return Response({'error': 'Title must be at least 5 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(data['content']) < 10:
        return Response({'error': 'Content must be at least 10 characters'}, status=status.HTTP_400_BAD_REQUEST)

    blogData = {
        'title': data['title'],
        'content': data['content'],
        'author': payload['id']
    }

    serializer = BlogSerializer(data=blogData)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def create_comment(request, blog_id):
    data = request.data
    token = request.COOKIES.get('jwt')
    if not token:
        return Response({'error': 'Please login to create a comment'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algo])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Please login to create a comment'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.exceptions.DecodeError:
        return Response({'error': 'Please login to create a comment'}, status=status.HTTP_401_UNAUTHORIZED)

    if len(data['content']) < 5:
        return Response({'error': 'Content must be at least 5 characters'}, status=status.HTTP_400_BAD_REQUEST)

    commentData = {
        'content': data['content'],
        'blog': blog_id,
        'author': payload['id']
    }

    serializer = CommentSerializer(data=commentData)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def update_blog(request, blog_id):
    data = request.data
    token = request.COOKIES.get('jwt')
    if not token:
        return Response({'error': 'Please login to update a blog'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        payload = jwt.decode(token, jwt_key, algorithms=[jwt_algo])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Please login to update a blog'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.exceptions.DecodeError:
        return Response({'error': 'Please login to update a blog'}, status=status.HTTP_401_UNAUTHORIZED)
    
    blog = Blog.objects.get(id=blog_id)
    if blog.author.id != payload['id']:
        return Response({'error': 'You are not authorized to update this blog'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # check if data contains title and content
    if 'title' in data and len (data['title']) < 5:
        return Response({'error': 'Title must be at least 5 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    if 'content' in data and len(data['content']) < 10:
        return Response({'error': 'Content must be at least 10 characters'}, status=status.HTTP_400_BAD_REQUEST)

    blogData = {
        'title': 'title' in data and data['title'] or blog.title,
        'content': 'content' in data and data['content'] or blog.content,
        'author': payload['id']
    }

    serializer = BlogSerializer(blog, data=blogData)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)