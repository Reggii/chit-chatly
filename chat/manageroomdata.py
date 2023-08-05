import json
import logging

# Functions to be called from views.py

def save_as_json(username, roomname):
    json_file_name = './static/js/newFile.json'
    data = {
       'name': 'sam'
    }
    with open(json_file_name, "w") as file:
        json.dump(data, file)
        logging.info('json created')
    # room_object = {
    #    'roomname': roomname, 
    #    'users': [username]
    #    }
    # with open(json_file_name, 'r') as f:
    #   json_data = json.load(f)
      
    
    # for room in json_data:
    #   if room['roomname'] == roomname:
    #         if username not in room['users']:
    #           room['users'].append(username)
    #         _dump_to_json(json_file_name, json_data)
            
    #         return
    # json_data.append(room_object)
    # _dump_to_json(json_file_name, json_data)
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
    _dump_to_json(json_file_name, json_data)
    return


def _dump_to_json(json_file_name, json_data):
    with open(json_file_name, 'w') as f:
      json.dump(json_data, f, indent=2)
      logging.info('Json saved')
      logging.info(json_data)
      logging.info(json_file_name)