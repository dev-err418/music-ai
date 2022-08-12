from crypt import methods
from requests import get, post
from time import sleep
from flask import Flask, send_from_directory, request, make_response
from flask_cors import CORS
from os import path
import firebase_admin
from firebase_admin import auth, credentials
from pymongo import MongoClient
from flask_restful import Resource, Api
import sys
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import threading

#init flask app
app = Flask(__name__)
limiter = Limiter(app, key_func=get_remote_address)
CORS(app)
api = Api(app)
port = 5000

if sys.argv.__len__() > 1:
    port = sys.argv[1]


#init mongodb client 
maxUsagePerFreeAcc = 10
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)
client = MongoClient("mongodb+srv://arthur:68CMPqQ4p0xtCafP@cluster0.ga693rb.mongodb.net/?retryWrites=true&w=majority")
db = client.users
users = db.users

#all playlist ids
relou = [{'menu-choice': 'Activities', 'playlist': '3.1.0'}, {'menu-choice': 'Moods', 'playlist': '0.5.2'}, {'menu-choice': 'Moods', 'playlist': '0.5.3'}, {'menu-choice': 'Moods', 'playlist': '0.5.4'}, {'menu-choice': 'Activities', 'playlist': '3.0.0'}, {'menu-choice': 'Activities', 'playlist': '3.0.1'}, {'menu-choice': 'Moods', 'playlist': '0.5.1'}, {'menu-choice': 'Moods', 'playlist': '0.5.5'}, {'menu-choice': 'Activities', 'playlist': '3.0.2'}, {'menu-choice': 'Moods', 'playlist': '0.0.1'}, {'menu-choice': 'Moods', 'playlist': '0.0'}, {'menu-choice': 'Activities', 'playlist': '4.0.0'}, {'menu-choice': 'Activities', 'playlist': '4.1.0'}, {'menu-choice': 'Activities', 'playlist': '4.0.1'}, {'menu-choice': 'Activities', 'playlist': '4.2.0'}, {'menu-choice': 'Activities', 'playlist': '4.3.0'}, {'menu-choice': 'Activities', 'playlist': '7.0.2'}, {'menu-choice': 'Moods', 'playlist': '0.8.1'}, {'menu-choice': 'Activities', 'playlist': '7.0.3'}, {'menu-choice': 'Moods', 'playlist': '0.4.1'}, {'menu-choice': 'Moods', 'playlist': '0.8.0'}, {'menu-choice': 'Activities', 'playlist': '7.0.0'}, {'menu-choice': 'Moods', 'playlist': '0.3.2'}, {'menu-choice': 'Moods', 'playlist': '0.3'}, {'menu-choice': 'Activities', 'playlist': '7.0.1'}, {'menu-choice': 'Moods', 'playlist': '0.3.1'}, {'menu-choice': 'Moods', 'playlist': '0.4.0'}, {'menu-choice': 'Moods', 'playlist': '0.10.0'}, {'menu-choice': 'Activities', 'playlist': '5.1.0'}, {'menu-choice': 'Activities', 'playlist': '5.0.2'}, {'menu-choice': 'Moods', 'playlist': '0.1.4'}, {'menu-choice': 'Activities', 'playlist': '5.0.1'}, {'menu-choice': 'Moods', 'playlist': '0.1.1'}, {'menu-choice': 'Moods', 'playlist': '0.1.5'}, {'menu-choice': 'Moods', 'playlist': '0.1.0'}, {'menu-choice': 'Activities', 'playlist': '5.2.0'}, {'menu-choice': 'Activities', 'playlist': '5.2.2'}, {'menu-choice': 'Activities', 'playlist': '5.2.3'}, {'menu-choice': 'Moods', 'playlist': '0.1.2'}, {'menu-choice': 'Moods', 'playlist': '0.1.6'}, {'menu-choice': 'Activities', 'playlist': '5.0.3'}, {'menu-choice': 'Activities', 'playlist': '5.3.0'}, {'menu-choice': 'Activities', 'playlist': '1.0.0'}, {'menu-choice': 'Genres', 'playlist': '6.4.0'}]

#func to get the number of songs created by a free user
def userUsage(uid):
    try:
        usage = users.find_one({"uid": uid})        
        return usage["usage"]
    except:
        return 0

#func to increment the number of songs create by a free user
def incUser(uid):
    users.update_one({"uid": uid}, {"$inc": {"usage": 1}}, upsert=True)

#check if user is allowed to access db (if token exists and the UID too)
def isAllowed(token, shouldInc=False):
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        user = auth.get_user(uid)
        if user.custom_claims.get("paid"):
#            user is premium
            return -1        
        else:
            usage = userUsage(uid)            
            if usage < maxUsagePerFreeAcc:  
                if shouldInc:
                    incUser(uid)
                return 0                
            else:
                return 1
    except:
        return 2

    

#should be limited

@app.route("/tokens/<path:uid>", methods=["GET"])  
@limiter.limit("1/s")
def getTokens(uid):
    token = request.args.get("token")
    allowed = isAllowed(token)
    if allowed == 2:
#        an error appended
        return {"error": "an error occured"}

    user = auth.get_user(uid)
    if user.custom_claims.get("paid"):
        return {"usage": -1}
    else: 
        usage = userUsage(uid)
        return {"usage": usage}
    
#    return {"usage": tokens}

#should be limited
@app.route("/list/<path:id>", methods=["GET"])
@limiter.limit("1/s")
def getList(id):
    token = request.args.get("token")
    allowed = isAllowed(token)
    if allowed == 2:
#        an error appended
        return {"error": "an error occured"}
    
    id = int(id)
    
    files = []
    
    for file in os.listdir(str(id)):
        if file.endswith(".mp3"):
            if len(files) < 10:
                files.append(file)
            else:
                break
    
    return {"files": files}        

#should be limited
@app.route("/create/<path:id>", methods=["GET"])
@limiter.limit("1/s")
def create(id):
    token = request.args.get("token")
    length = request.args.get("length")
#    print(token)
    
    try:
        length = int(length)
        if length < 10:
#            song too short
            return {"error": "an error occured "}
        elif length > 295:
#            song too long
            return {"error": "an error occured "}
    except:
#        the length element is not a number then its not the awaited arg
        return {"error": "an error occured "}
    
    allowed = isAllowed(token, True)  
    if allowed == 2:
#        an error happended
        return {"error": "an error occured"}
    elif allowed == 1:
#        all tokens used
        return {"error": "all tokens used"}    
        
    
    id = int(id)
    req_get_cookie = get("https://mubert.com/")
    cookie = req_get_cookie.headers["set-cookie"]
    print("got cookie")
    req_post_session = post("https://mubert.com/v1/TrackCreate", headers={"cookie": cookie}, params={"duration": length, "menu-choice": relou[id]["menu-choice"], "playlist": relou[id]["playlist"], "track_type": "track"})
    session_id = req_post_session.json()["data"]["session_id"]
    print("got session id")
    status_mp3 = 0    
    while status_mp3 == 0:
        req_get_song = get("https://mubert.com/v1?method=TrackInfo&session_id=%s&url_type=all" % session_id, headers={"cookie": cookie, "authority": "mubert.com", "method": "GET", "scheme": "https", "accept": "*/*", "accept-encoding":"gzip, deflate, br", "accept-language": "en-US,en;q=0.9", "cache-control": "no-cache", "content-type": "application/json", "dnt": "1", "origin": "https://mubert.com", "pragma": "no-cacher", "referer": "htpps://mubert.com/render", "sec-fetch-dest":"empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "sec-gpc": "1"}) 
        status_mp3 = req_get_song.json()["data"]["track"]["status_mp3"]        
        print(".")
        sleep(1)

    req_get_uri = get("https://static.gcp.mubert.com/backend_content/render/prod/tracks/mp3/%s.mp3" % session_id)
    if (req_get_uri.status_code == 200):            
        print(session_id, "generated")
        file_name = str(id) + "/" + session_id + ".mp3"
        open(file_name, "wb").write(req_get_uri.content)
        return {"status": "impec !", "uid": session_id}


@app.route("/download/<path:filename>", methods=["GET"])
@limiter.limit("10/s")
def download(filename):
    token = request.args.get("token")
    allowed = isAllowed(token)
    if allowed == 2:
#        an error appended
        return {"error": "an error occured"}

#    return send_from_directory(app.root_path, filename)
    r = make_response(send_from_directory(app.root_path, filename))
    r.headers.set("Content-Disposition", "attachment")

    return r


if __name__ == '__main__':
    threading.Thread(target=lambda: app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)).start()
#    app.run(host="0.0.0.0", port=port, threaded=True)