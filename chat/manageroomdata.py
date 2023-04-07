import json
from rest_framework.decorators import api_view

# Functions to be called from views.py

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