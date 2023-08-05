from django.apps import AppConfig
import json
import logging

class ChatConfig(AppConfig):
    name = 'chat'
    verbose_name = "Chit Chatly"
    def ready(self):
        json_file_name = './static/js/newFile.json'
        data = {
        'name': 'sam'
        }
        with open(json_file_name, "w") as file:
            json.dump(data, file)
            logging.info('json created')
        return