import json
import os 
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view


def login_reg_index(request):
    return render(request, "main_log-in-reg.html")


@login_required(login_url='http://127.0.0.1:8000/')
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


def logout_user(request):
    room = request.data['room']
    username = request.data['username']
    logout(request)
    delete_from_json(username, room)
    return JsonResponse({'success': True})


def save_as_json(username, roomname):
    json_file_name = './static/js/roomUsers.json'
    room_object = {
       'roomname': roomname, 
       'users': [username]
       }
    with open(json_file_name, 'r') as f:
      json_data = json.load(f)
    
    for room in json_data:
      if room['roomname'] == roomname:
            if username not in room['users']:
              room['users'].append(username)
            dump_to_json(json_file_name, json_data)
            return
    json_data.append(room_object)
    dump_to_json(json_file_name, json_data)
    return

def delete_from_json(username, roomname):
    json_file_name = './static/js/roomUsers.json'

    with open(json_file_name, 'r') as f:
      json_data = json.load(f)
    
    for room in json_data:
      if room['roomname'] == roomname:
        for user in room['users']:
          if user == username:
            room['users'].remove(username)
    dump_to_json(json_file_name, json_data)
    return

def dump_to_json(json_file_name, json_data):
    with open(json_file_name, 'w') as f:
      json.dump(json_data, f, indent=2)