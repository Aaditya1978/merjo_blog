from django.urls import path, include
from .views import get_blogs, get_blog, get_comments, create_blog, create_comment, update_blog

urlpatterns = [
    path('get_blogs', get_blogs),
    path('get_blog/<int:blog_id>', get_blog),
    path('get_comments/<int:blog_id>', get_comments),
    path('create_blog', create_blog),
    path('create_comment/<int:blog_id>', create_comment),
    path('update_blog/<int:blog_id>', update_blog),
]