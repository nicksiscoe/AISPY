from flask import Flask, request
import os
import uuid
import requests 
import random
app = Flask(__name__)

session_att = "session_ID"
char_att = "char_info"

inworld_key = os.getenv("INWORLD_KEY", "this-is-the-default-key")
workspace_id = "eye_spy_ai"
billy = "workspaces/eye_spy_ai/characters/billy"
gus = "workspaces/eye_spy_ai/characters/gus"
mandy = "workspaces/eye_spy_ai/characters/mandy"
ai_character_list = {"billy": billy, "mandy":mandy, "gus":gus}


session_data = {}
new_header = {"Content-Type": "application/json", "authorization": inworld_key}

@app.get('/ai/<name>/session/<game_id>')
def ai_get_question(name, game_id):
    i_want_to_say = "Please state the question you would ask to see if someone might be an AI"
    character = session_data[game_id][name]
    character_id = character[char_att].get("character")
    session_id = character[session_att]
    text_obj = {"text": i_want_to_say}
    url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{session_id}/sessionCharacters/{character_id}:sendText'
    response = requests.post(url, json = text_obj, headers=get_session_header(session_id))
    return response.json().get("textList")

@app.post('/ai/<name>/session/<game_id>')
def ai_post_question(name, game_id):
    i_want_to_say = str(request.data)
    character = session_data[game_id][name]
    character_id = character[char_att].get("character")
    session_id = character[session_att]
    text_obj = {"text": i_want_to_say}
    url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{session_id}/sessionCharacters/{character_id}:sendText'
    response = requests.post(url, json = text_obj, headers=get_session_header(session_id))
    return response.json().get("textList")

@app.post('/session/<game_id>/elminated')
def ai_someone_elimated(game_id):
    player = str(request.get_json().get("player"))
    i_want_to_say = player+" has been elminated from the game."
    for key in session_data[game_id]:
        character = session_data[game_id][key]
        character_id = character[char_att].get("character")
        session_id = character[session_att]
        text_obj = {"text": i_want_to_say}
        url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{session_id}/sessionCharacters/{character_id}:sendText'
        response = requests.post(url, json = text_obj, headers=get_session_header(session_id))
        print(response.json().get("textList"))
    return ""

@app.post('/new-session/ai-amount/<amount>')
def new_session(amount):
    num_of_players = int(amount)
    new_id = str(uuid.uuid4())
    new_character_list = {}
    player_list = list(request.get_json().get("player_list"))
    ai_list = list(ai_character_list.keys())
    random.shuffle(ai_list)
    print(list(ai_character_list.keys()))
    #loop for each char
    i = 0
    for key in ai_character_list:
        character = ai_character_list[ai_list[i]]
        url = f'https://studio.inworld.ai/v1/{character}:openSession'
        myobj = {"name":character}
        response = requests.post(url, json = myobj, headers=new_header)
        ##this data structure is due to a limit of one character per session
        #in the future our session ID would 1:1 InWorlds
        new_character_list[ai_list[i]] = {session_att : response.json().get("name"), 
                                    char_att : response.json().get("sessionCharacters")[0]}
        give_AI_starter_context(new_character_list[ai_list[i]], 4+num_of_players, player_list)
        #endLoop
        i = i+1
        if not (i<num_of_players):
            break
    global session_data
    session_data[new_id] = new_character_list
    print(session_data)
    return {"session_id":new_id, "ai_players":list(new_character_list.keys())}

def give_AI_starter_context(character, num_players, name_list):
    text = "There are " +str(num_players)+ " players, "
    for name in name_list:
        text = text + name + ", "
    text = text + " and you."
    character_id = character[char_att].get("character")
    session_id = character[session_att]
    text_obj = {"text": text}
    url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{session_id}/sessionCharacters/{character_id}:sendText'
    requests.post(url, json = text_obj, headers=get_session_header(session_id))
      
def get_session_header(session_id):
    return {"Content-Type": "application/json", "authorization": inworld_key, "Grpc-Metadata-session-id": session_id}