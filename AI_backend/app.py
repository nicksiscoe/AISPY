import os
import re
import uuid
from flask import Flask, request
import requests 
app = Flask(__name__)

session_att = "session_ID"
char_att = "char_info"
inworld_key = os.getenv("INWORLD_KEY", "this-is-the-default-key")
workspace_id = "default-tkk203ascvqh3qtjhguk8q"
mandy = "workspaces/default-tkk203ascvqh3qtjhguk8q/characters/mandy"
billy = "workspaces/default-tkk203ascvqh3qtjhguk8q/characters/billy"
gus = "workspaces/default-tkk203ascvqh3qtjhguk8q/characters/gus"
ai_character_list = {"mandy":mandy,"billy": billy, "gus": gus}
session_data = {}
new_header = {"Content-Type": "application/json", "authorization": inworld_key}

# @app.get('/ai/<name>/session/<session_ID>')
# def ai_get_question(name, sessionID):
#     i_want_to_say = "It's time to vote someone out, who do you pick?"
#     character_id = get_full_character(name)
#     myobj = {"character":character_id, "text": i_want_to_say, "endUserFullname":"Sherlock", "endUserId":"221b"}
#     url = f'https://studio.inworld.ai/v1/{character_id}:simpleSendText'
#     response = requests.post(url, json = myobj, headers=get_session_header(sessionID))
#     return response.json().get("textList")

@app.post('/ai/<name>/session/<game_id>')
def ai_post_question(name, game_id):
    i_want_to_say = str(request.data)
    character = session_data[game_id][name]
    character_id = character[char_att].get("character")
    session_id = character[session_att]
    text_obj = {"text": i_want_to_say}
    print
    url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{session_id}/sessionCharacters/{character_id}:sendText'
    response = requests.post(url, json = text_obj, headers=get_session_header(session_id))
    return response.json().get("textList")

@app.get('/new-session/ai-amount/<amount>')
def new_session(amount):
    num_of_players = int(amount)
    new_id = str(uuid.uuid4())
    new_character_list = {}
    #loop for each char
    i = 0
    for key in ai_character_list:
        i = i+1
        character = ai_character_list[key]
        url = f'https://studio.inworld.ai/v1/{character}:openSession'
        myobj = {"name":character}
        response = requests.post(url, json = myobj, headers=new_header)
        ##this data structure is due to a limit of one character per session
        #in the future our session ID would 1:1 InWorlds
        new_character_list[key] = {session_att : response.json().get("name"), 
                                    char_att : response.json().get("sessionCharacters")[0]}
        #endLoop
        if not (i<num_of_players):
            break
    session_data[new_id] = new_character_list
    print(new_character_list)
    return new_id
      
def get_session_header(session_id):
    return {"Content-Type": "application/json", "authorization": inworld_key, "Grpc-Metadata-session-id": session_id}