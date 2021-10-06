
function signIn() {
    loader(true)
    const signInEmail = document.getElementById('signInEmail').value
    const signInPassword = document.getElementById('signInPassword').value
    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword).then((success) => {
        var uid = success.user.uid;
        firebase.database().ref(`LoginUsers/${uid}`).set(uid)
        setProfileDataToLocalStorage(uid)
    }).catch((error)=>{
        swal({
            title: "Login Fail",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then(()=>{
            loader(false)
          })
    })
}
function signUpSocial(social) {
    loader(true)
    if (social === "facebook") {
        var provider = new firebase.auth.FacebookAuthProvider();
    } else if (social === "google") {
        var provider = new firebase.auth.GoogleAuthProvider();
    }
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let uid = firebase.auth().currentUser.uid
        firebase.database().ref(`LoginUsers/${uid}`).set(uid)
        var name = result.user.displayName;
        var email = result.user.email;
        var profileImgUrl = result.user.photoURL;
        var userObj = {
            email,
            name,
            profileImgUrl,
            uid,
        }
        firebase.database().ref(`userProfiles`).once('value', (e) => {
            let value = e.val();
            var keyArry = []
            for (var key in value) {
                keyArry.push(key);
            }
            if (keyArry.indexOf(uid) === -1) {
                firebase.database().ref(`userProfiles/${uid}/`).set(userObj).then(() => {
                    console.log('successFully add Your Data in database and Login Your account')
                })
            }
            else if (keyArry.indexOf(uid) !== -1) {
                console.log('Login Success fully')
            }
        }).then(() => {
            setProfileDataToLocalStorage(uid)
        })

    }).catch((error)=>{
        swal({
            title: "Login Fail",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then(()=>{
            loader(false)
          })
    });
}

function openSignUpForm() {
    document.getElementById('signInForm').style.display = "none";
    document.getElementById('signUpForm').style.display = "block";
}

function signUp() {
    loader(true)
    const image = document.getElementById('image').files[0];
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const dob = document.getElementById('dob').value;
    const number = document.getElementById('number').value;
    const address = document.getElementById('address').value;
   var flag = formValidate(name, email, password, confirmPassword,image)
    if(flag === true){
        firebase.auth().createUserWithEmailAndPassword(email, password).then((success) => {
            let uid = success.user.uid;
            firebase.storage().ref().child(`ProfileImage/${uid}/`).put(image).then((done) => {
                firebase.storage().ref(`ProfileImage/${uid}`).getDownloadURL().then((url) => {
                    var profileImgUrl = url;
                    var userObj = {
                        uid,
                        name,
                        email,
                        dob,
                        number,
                        address,
                        profileImgUrl,
                        uid,
                    }
                    firebase.database().ref(`userProfiles/${uid}/`).set(userObj).then(() => {
                        swal({
                            title: "SignUp Successfull",
                            text: "Click Continue to go signIn page and Login with Email & password",
                            icon: "success",
                            button: "Continue",
                            closeOnClickOutside: false,
                            closeOnEsc: false,
                        }).then(()=>{
                            loader(false)
                            document.getElementById('signUpForm').style.display = "none";
                            document.getElementById('signInForm').style.display = "block";
                        })
                    })
                })
            })
    }).catch((error)=>{
        swal({
            title: "SignUp fail",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then(()=>{
            loader(false)
        })
    })
}else{
    loader()
}
}

function setProfileDataToLocalStorage(uid) {
    firebase.database().ref(`userProfiles/${uid}`).once('value', (e) => {
        let usrObj = e.val()
        window.localStorage.setItem('userAuth', JSON.stringify(usrObj))
    }).then(() => {
    swal({
        title: "Login Successfull",
        text: "Click Continue to go next page",
        icon: "success",
        button: "Continue",
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(()=>{
        // loader(false)
          window.location = './htmlFiles/profile.html'
      })
    })
}

function logOut(){
    let ui = window.localStorage.getItem('userAuth');
    let dta = JSON.parse(ui)
    let key = dta.uid;
    firebase.database().ref(`LoginUsers`).child(key).remove().then(()=>{
        firebase.auth().signOut().then(()=>{
            window.localStorage.removeItem("userAuth");
        }).then(()=>{
            swal({
                title: "LogOut Successfull",
                text: "Click Continue to go next page",
                icon: "success",
                button: "Continue",
                closeOnClickOutside: false,
                closeOnEsc: false,
              }).then(()=>{
                  window.location = '../index.html'
              })
        })

    })
    // console.log(key)
}

if(window.location.href.search('htmlFiles/profile.html') !== -1 || window.location.href.search('htmlFiles/frndProfile.html')  !== -1 || window.location.href.search('htmlFiles/main.html')  !== -1 || window.location.href.search('htmlFiles/chat.html')  !== -1  ){
    window.addEventListener('load', ()=>{
        if(window.localStorage.getItem('userAuth') === null){
            window.location = '../index.html'
        }
    })
}else if(window.location.href.search('index.html') !== -1){
    window.addEventListener('load', ()=>{
        if(window.localStorage.getItem('userAuth') !== null){
            window.location = './htmlFiles/profile.html'
        }
    })
}

function loader(check){
    if(check){
        document.getElementById('loader').style.display = 'block';
        document.getElementById('disp').style.display = 'none';
    }else{
        document.getElementById('loader').style.display = 'none';
        document.getElementById('disp').style.display = 'block';
    }
}

function formValidate(fullName, email, password, confirmPassword,profileImage) {
    var a, b, c, d;
    if (profileImage === null) {
        swal({
            title: "Error",
            text: 'Pleas Upload your Profile Image first',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        d = 0;
    }
    else if (profileImage === undefined) {
        swal({
            title: "Error",
            text: 'Pleas Upload your Profile Image first',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        d = 0;
    } else {
        d = 1;
    }
    if(password !== confirmPassword){
        swal({
            title: "Error",
            text: 'Password does not match',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        c = 0;
    }else if(password === confirmPassword){

        if (password === "") {
            swal({
                title: "Error",
                text: 'Pleas Enter password',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else if (!password.replace(/\s/g, '').length) {
            swal({
                title: "Error",
                text: 'Pleas Enter Password',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else if (password.length < 7) {
            swal({
                title: "Error",
                text: 'Password lenght must be upto 6',
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false,
                closeOnEsc: false,
            })
            c = 0;
        } else {
            c = 1;
        }
    }
    if (email === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter Email',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else if (!email.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter Valid Email',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        b = 0;
    } else {
        b = 1;
    }
    if (fullName === "") {
        swal({
            title: "Error",
            text: 'Pleas Enter your full name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else if (!fullName.replace(/\s/g, '').length) {
        swal({
            title: "Error",
            text: 'Pleas Enter your full name',
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        a = 0;
    } else {
        a = 1;
    }
    var tst = a + b + c + d;
    if (tst === 4) {
        var flag = true;
    } else {
        var flag = false;
    }
    return (flag);
}
