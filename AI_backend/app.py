import uuid
from flask import Flask, request
import requests 
app = Flask(__name__)

session_att = "session_ID"
char_att = "char_info"

workspace_id = "default-tkk203ascvqh3qtjhguk8q"
mandy = "workspaces/default-tkk203ascvqh3qtjhguk8q/characters/mandy"
billy = "workspaces/default-tkk203ascvqh3qtjhguk8q/characters/billy"

session_data = {}
new_header = {"Content-Type": "application/json", "authorization": my_key}

@app.get('/ai/<name>/session/<sessionID>')
def ai_get_question(name, sessionID):
    i_want_to_say = "It's time to vote someone out, who do you pick?"
    character_id = get_full_character(name)
    myobj = {"character":character_id, "text": i_want_to_say, "endUserFullname":"Sherlock", "endUserId":"221b"}
    url = f'https://studio.inworld.ai/v1/{character_id}:simpleSendText'
    response = requests.post(url, json = myobj, headers=get_session_header(sessionID))
    return response.json().get("textList")

@app.post('/ai/<name>/session/<sessionID>')
def ai_post_question(name, session_ID):
    i_want_to_say = str(request.data)
    character = session_data[session_ID][name]
    character_id = character[char_att].get("character")
    sessionID = character[session_att]
    text_obj = {"text": i_want_to_say}
    url = f'https://studio.inworld.ai/v1/workspaces/{workspace_id}/sessions/{get_full_session_ID(sessionID)}/sessionCharacters/{character_id}:sendText'
    response = requests.post(url, json = text_obj, headers=get_session_header(sessionID))
    return response.json().get("textList")

@app.get('/new-session')
def new_session():
    new_id = str(uuid.uuid4())
    new_character_list = {}
    #loop for each char
    name = "billy"
    myobj = {"name":billy}
    character = billy
    url = f'https://studio.inworld.ai/v1/{character}:openSession'
    response = requests.post(url, json = myobj, headers=new_header)
    ##this data structure is due to a limit of one character per session
    #in the future our session ID would 1:1 InWorlds
    new_character_list[name] = {session_att : response.json().get("name"), 
                                char_att : response.json().get("sessionCharacters")[0]}
    #endLoop
    session_data[new_id] = new_character_list
    return new_id

def get_full_character(session_id, name):
    return 
      
def get_session_header(sessionID):
    return {"Content-Type": "application/json", "authorization": my_key, "Grpc-Metadata-session-id": get_full_session_ID(sessionID)}