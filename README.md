# Generate music with AI !

Simple use : choose a genre/type of song you want the AI to create, and in one click boom, you have it.

![Screenshot 2022-08-12 at 16 58 10](https://user-images.githubusercontent.com/59390256/184383562-d750b3c3-715c-42cb-bff2-22b27c861fe2.png)

## How does it work ?

This website runs with **firebase** for authentication (phone auth). But for local use, auth could be removed. Once signed in, simply select a genre and a song length. Click on "generate" and it's done.

Authentication build with firebaseUI :

![Screenshot 2022-08-12 at 17 05 33](https://user-images.githubusercontent.com/59390256/184384916-4fc7afda-8011-49d8-a7e8-89f53eb2184d.png)

Song genre selection : 

![list](https://user-images.githubusercontent.com/59390256/184385621-19beec71-8467-4f6a-b4ab-72e844f92f06.gif)

Once the "create" button clicked, wait for few seconds for the file to generate and load. When the song is loaded, you can listent it directly on the website or listen to other songs that people generated with the same genre by clicking on the "other generations" button or download the file.

![other-songs](https://user-images.githubusercontent.com/59390256/184386266-8bead899-2749-4833-b466-6aca898057d7.gif)

Here are few songs generated with the "beautiful" keyword (it's impossible to upload .mp3 files on GH that's why those files are .mp4, the original files or on the root of the GH project) :

https://user-images.githubusercontent.com/59390256/184392320-4d288c6c-73d9-4619-a910-57893e9c01fd.mp4

https://user-images.githubusercontent.com/59390256/184392356-092232bb-9159-423d-834a-704b4530da46.mp4

https://user-images.githubusercontent.com/59390256/184392738-0e861ecb-0995-41be-b7db-f3ab5eedd2c1.mp4

https://user-images.githubusercontent.com/59390256/184392763-083a5972-e45c-4619-858f-8959ba690e6e.mp4

https://user-images.githubusercontent.com/59390256/184392781-20815fa1-0746-4576-afea-f0e96690bcd5.mp4

## Backend :

The backend is written in python, simply run :
```
python3 app.py
```
The code runs with Flask, firebase_admin and mongo db client.
- Flask is used for the basic API.
- Fireabse admin is used to check if the incomming request is made from an authenticated user. So I used it for security purposes.
- Mongo DB is used to check if the current user is a "premium" user, then he can generate unlimited songs. If he's not, he's a free user and has 10 credits (1 credit = 1 song generated). Mongo db is used to keep track of the tokens used. Why mongo db rather than firebase realtime db or firestore ? Simply because mongo db could be run locally on the same linux machine as the python code so it would be way quicker to do local requests that requests other the internet.

The ai part is not done by the python scrit. It's requesting to mubert.com to do all the process. Moobert will generate the song and then the api will grab it to send it to the web app. **See it as a reverse engineering of the mubert api.**

Have fun playing with this code !!!
