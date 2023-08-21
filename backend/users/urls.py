from django.urls import path, include
from .views import signup, login, logout, user

urlpatterns = [
    path('signup', signup),
    path('login', login),
    path('logout', logout),
    path('user', user),
]