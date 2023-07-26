from .manageroomdata import *
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view


def login_reg_index(request):
    return render(request, "main_log-in-reg.html")


@login_required(login_url='https://*.ondigitalocean.app')
def room(request, room_name):
    return render(request, "room.html", {"room_name": room_name})


@api_view(['POST'])
def register_user(request):
    username = request.data['username']
    password = request.data['password']

    if username and password:
        if User.objects.filter(username=username).exists():
            status_code = 409
            return JsonResponse({'error': 'Username already exists.'}, status=status_code)
        
        user = User.objects.create_user(username=username, password=password)
        user.save()
        return JsonResponse({'success': True, 'username': username})
    return JsonResponse({'error': 'Invalid request'})  


@api_view(['POST'])
def login_user(request):
    username = request.data['username']
    password = request.data['password']
    room = request.data['room']

    if username and password:
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            save_as_json(username, room)
            return JsonResponse({'success': True})
        else:
            status_code = 401
            return JsonResponse({'error': 'Invalid username or password'}, status=status_code)
    return JsonResponse({'error': 'Invalid request'})


@api_view(['POST'])
def logout_user(request):
    room = request.data['room']
    username = request.data['username']

    logout(request)
    delete_from_json(username, room)

    return JsonResponse({'success': True})


@api_view(['POST'])
def change_room(request):
    room = request.data['room']
    username = request.data['username']
    req_type = request.data['type']

    if req_type == 'change_room':
      new_room = request.data['new_room']
      delete_from_json(username, room)
      save_as_json(username, new_room)
      return JsonResponse({'success': True, 'response': 'changing room'})
    
    elif req_type == 'leave_room':
      delete_from_json(username, room)
      return JsonResponse({'success': True, 'response': 'deleted user'})