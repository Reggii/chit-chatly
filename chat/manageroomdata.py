import json
import logging

# Functions to be called from views.py

def save_as_json(username, roomname):
    room_object = {
       'roomname': roomname, 
       'users': [username]
       }
    with open('./static/js/roomUsers.json') as f:
      json_data = json.load(f.read())
      
    
    for room in json_data:
      if room['roomname'] == roomname:
            if username not in room['users']:
              room['users'].append(username)
            _dump_to_json('./static/js/roomUsers.json', json_data)
            
            return
    json_data.append(room_object)
    _dump_to_json('./static/js/roomUsers.json', json_data)
    return


def delete_from_json(username, roomname):
    json_file_name = './static/js/roomUsers.json'

    with open('./static/js/roomUsers.json') as f:
      json_data = json.load(f.read())
    
    for room in json_data:
      if room['roomname'] == roomname:
        for user in room['users']:
          if user == username:
            room['users'].remove(username)
    _dump_to_json(json_file_name, json_data)
    return


def _dump_to_json(json_file_name, json_data):
    with open('./static/js/roomUsers.json', 'w') as f:
      json.dump(json_data, f, indent=2)
      logging.info('Json saved')