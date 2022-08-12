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

In this example, the generated file with the "beautiful" keyword was :

## Backend :

The backend is written in python, simply run :
```
python3 app.py
```
The code runs with Flask, firebase_admin and mongo db client.
- Flask is used for the basic API.
- Fireabse admin is used to check if the incomming request is made from an authenticated user. So I used it for security purposes.
- Mongo DB is used to check if the current user is a "premium" user, then he can generate unlimited songs. If he's not, he's a free user and has 10 credits (1 credit = 1 song generated). Mongo db is used to keep track of the tokens used. Why mongo db rather than firebase realtime db or firestore ? Simply because mongo db could be run locally on the same linux machine as the python code so it would be way quicker to do local requests that requests other the internet.

Have fun playing with this code !!!
