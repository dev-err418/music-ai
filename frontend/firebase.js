const firebaseConfig = {
    apiKey: "AIzaSyDW7CKvEcTWWI78lwOfgeeydPDlaFTZQQU",
    authDomain: "droplet-music-ai.firebaseapp.com",
    projectId: "droplet-music-ai",
    storageBucket: "droplet-music-ai.appspot.com",
    messagingSenderId: "381120553078",
    appId: "1:381120553078:web:5fdac50f801b8bc4b5bf57",
    measurementId: "G-WCJ3HV72PZ",
};

// Initialize Firebase
const init = () => {
    firebase.initializeApp(firebaseConfig);
}
init()
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", {
    signInOptions: [
        {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            credentialHelper: firebaseui.auth.CredentialHelper.NONE,
            defaultCountry: "USA",
        },
    ],
    //   signInSuccessUrl: `${window.location.origin}/dashboard.html`,
    callbacks: {
        signInSuccess: (currentUser, credential, redirectUrl) => {
            // const userId = currentUser.uid;
            // return false
        }
    }
});

firebase.auth().onAuthStateChanged((u) => {    
    if (!u) {
        console.log("no user")
    } else if (window.location.pathname != "/console" && window.location.pathname != "/console/" && window.location.pathname != "/console.html") {
        window.location.href = "./console"                 
    }
})

export const getUser = () => {        
    firebase.auth().onAuthStateChanged(async (u) => {
        if (!u) {
            //            window.location.href = "./signin.html"
            window.location.href = "./signin"
        } else if (window.location.pathname == "/console.html" || window.location.pathname == "/console" || window.location.pathname == "/console/") {
            const show = document.getElementById("first-container")
            show.style.display = "flex"
            const phone = u["_delegate"]["phoneNumber"]
            const phoneText = document.getElementById("mid-title-phone")
            phoneText.innerText = `Hello ${phone},`

            const token = u["_delegate"]["accessToken"]
            const uid = u["_delegate"]["uid"]
            const usage = await getUsageTokens(uid, token)
            const userText = document.getElementById("user-type")                        

            if( usage == -1) {
                //                this is a premium user
                userText.innerText = "Thanks for being a premium beta user."
            } else {
                //                usage is the remaining tokens
                userText.innerText = `Thanks for being a beta user, ${10 - usage} songs left.`
            }            
        }
    })
}

export const getSong = async (value, length) => {
    const token = getToken()                
    const req = await fetch(`http://127.0.0.1:5000/create/${value}?token=${token}&length=${length}`)
    const parsedData = await req.json()

    if (parsedData.status == "impec !") {
        return parsedData.uid
    } else {
        //        document.location.reload(true)
        return "error"
    }        
}

export const getSameGenre = async (id) => {
    const token = getToken()
    const req = await fetch(`http://127.0.0.1:5000/list/${id}?token=${token}`)
    const parsedData = await req.json()

    if (!parsedData["error"]) {
        const files = parsedData["files"]    
        return files
    } else {
        //        document.location.reload(true)
        return "error"
    }
}

export const getToken = () => {
    const user = firebase.auth().currentUser
    const token = user["_delegate"]["accessToken"]
    return token
}

export const getUsageTokens = async (uid, token) => {
    const req = await fetch(`http://127.0.0.1:5000/tokens/${uid}?token=${token}`)
    const parsedResponse = await req.json()
    const usage = parsedResponse.usage

    return usage
}

export const signOut = () => {
    firebase.auth().signOut()
}