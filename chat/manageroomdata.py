# import json
# import logging

# # Functions to be called from views.py

# def save_as_json(username, roomname):
#     json_file_name = './static/js/roomUsers.json'
#     room_object = {
#        'roomname': roomname, 
#        'users': [username]
#        }
#     with open(json_file_name, 'r') as f:
#       json_data = json.load(f)
      
    
#     for room in json_data:
#       if room['roomname'] == roomname:
#             if username not in room['users']:
#               room['users'].append(username)
#             _dump_to_json(json_file_name, json_data)
            
#             return
#     json_data.append(room_object)
#     _dump_to_json(json_file_name, json_data)
#     return


# def delete_from_json(username, roomname):
#     json_file_name = './static/js/roomUsers.json'

#     with open(json_file_name, 'r') as f:
#       json_data = json.load(f)
    
#     for room in json_data:
#       if room['roomname'] == roomname:
#         for user in room['users']:
#           if user == username:
#             room['users'].remove(username)
#     _dump_to_json(json_file_name, json_data)
#     return


# def _dump_to_json(json_file_name, json_data):
#     with open(json_file_name, 'w') as f:
#       json.dump(json_data, f, indent=2)
#       logging.info('Json saved')

import json
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)

# Get the absolute path to the directory containing the script
script_directory = os.path.dirname(os.path.abspath(__file__))

# Functions to be called from views.py

def save_as_json(username, roomname):
    json_file_name = os.path.join(script_directory, 'static', 'js', 'roomUsers.json')
    room_object = {
        'roomname': roomname,
        'users': [username]
    }

    # Load JSON data
    with open(json_file_name, 'r') as f:
        json_data = json.load(f)

    # Find and update existing room or add a new one
    for room in json_data:
        if room['roomname'] == roomname:
            if username not in room['users']:
                room['users'].append(username)
            _dump_to_json(json_file_name, json_data)
            logging.info(f"User '{username}' added to room '{roomname}'.")
            return

    # Add a new room if it doesn't exist
    json_data.append(room_object)
    _dump_to_json(json_file_name, json_data)
    logging.info(f"Room '{roomname}' created with user '{username}'.")
    return


def delete_from_json(username, roomname):
    json_file_name = os.path.join(script_directory, 'static', 'js', 'roomUsers.json')

    # Load JSON data
    with open(json_file_name, 'r') as f:
        json_data = json.load(f)

    # Find the room and user to delete
    for room in json_data:
        if room['roomname'] == roomname:
            if username in room['users']:
                room['users'].remove(username)
                _dump_to_json(json_file_name, json_data)
                logging.info(f"User '{username}' removed from room '{roomname}'.")
                return

    logging.warning(f"User '{username}' not found in room '{roomname}'.")
    return


def _dump_to_json(json_file_name, json_data):
    with open(json_file_name, 'w') as f:
        json.dump(json_data, f, indent=2)
        logging.info('JSON saved.')