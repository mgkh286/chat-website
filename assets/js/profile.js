let dataforProfile = window.localStorage.getItem('userAuth');
let profile = JSON.parse(dataforProfile);

let pImg = document.getElementById('pImg');
let pName = document.getElementById('name');
let pEmail = document.getElementById('email');
let pNumber = document.getElementById('num');
let pDob = document.getElementById('dob');
let pAddress = document.getElementById('address');
if (window.location.href.search('profile.html') !== -1) {
    window.addEventListener('load', () => {
        pImg.setAttribute('src', profile.profileImgUrl)
        pName.innerHTML = profile.name
        pEmail.innerHTML = "Email : " + profile.email
        if (profile.number === undefined) { pNumber.innerHTML = "Contect Number : " + 'Not Available'; }
        else { pNumber.innerHTML = "Contect Number : " + profile.number }
        if (profile.dob === undefined) { pDob.innerHTML = "Date of Birth : " + 'Not Available'; }
        else { pDob.innerHTML = "Date of Birth : " + profile.dob }
        if (profile.address === undefined) { pAddress.innerHTML = "Address : " + 'Not Available'; }
        else { pAddress.innerHTML = "Address : " + profile.address }
        // pNumber.innerHTML = "Contect Number : " + profile.number
        // pDob.innerHTML = "Date of Birth : " + profile.dob
        // pAddress.innerHTML = "Address : " + profile.address
    })
}

function show(hide) {
    document.getElementById('disp').style.display = "none"
    document.getElementById('allUsers').style.display = "none"
    document.getElementById('myFrnds').style.display = "none"
    document.getElementById('frndRequests').style.display = "none"
    document.getElementById('pendingRequests').style.display = "none"
    document.getElementById('usrPro').style.display = "none"
    document.getElementById(hide).style.display = "block"
    if (hide === 'allUsers') {
        document.getElementById('allUsers').innerHTML = " "
        let reqKeys = [];
        let frndKeys = [];
        let pendingreq = [];

        firebase.database().ref('userProfiles').once('value', (data) => {
            let checkArry = [];
            let allUsers = data.val();
            for (var key in allUsers) {
                checkArry.push(key)
            }
            if (checkArry.length === 1) {
                document.getElementById('allUsers').innerHTML =
                    `<h2 align="center"> No Users </h2>`
            }
            else {

                firebase.database().ref(`sendedReq/${profile.uid}`).once('value', (e) => {
                    let sendedReq = e.val();
                    for (var key in sendedReq) {
                        reqKeys.push(key)
                    }
                    firebase.database().ref(`pendingReq/${profile.uid}`).once('value', (e) => {
                        let datapend = e.val();
                        if (datapend !== null) {
                            for (var key in datapend) {
                                pendingreq.push(key)
                            }
                        }
                        firebase.database().ref(`frnds/${profile.uid}`).once('value', (e) => {
                            let frnds = e.val();
                            for (var key3 in frnds) {
                                frndKeys.push(key3);
                            }
                            for (var key2 in allUsers) {
                                if (reqKeys.indexOf(key2) === -1 && key2 !== profile.uid && frndKeys.indexOf(key2) === -1 && pendingreq.indexOf(key2) === -1) {
                                    document.getElementById('allUsers').innerHTML +=
                                        `<ul class="list-group">
                                <li style="box-shadow: 0px 0px 20px black; border-radius: 50px; text-align: center;background-color: rgba(20, 20, 58, 0.562)" class="col-12 col-lg-6 offset-lg-3 list-group-item list-group-item-dark">
                                <img src="${allUsers[key2].profileImgUrl}" style=" float: left;height: 50px; width: 50px; border-radius: 50%;border: 1px solid white; box-shadow: 0px 0px 5px black;">
                                <div style="text-align: center;">
                                <h5>${allUsers[key2].name}</h5>
                                <button key="${key2}" onClick="frndReqSender(this)" style="height: 25px; width: 100px; border:none; border-radius: 50px; box-shadow: 0px 0px 5px rgb(0, 0, 78); color: black; background-color: rgb(34, 34, 116) ">add Frnd</button>
                                </div>
                                </li>
                                </ul>`
                                }
                            }
                        })
                    })
                })
            }
        })
    }
    else if (hide === 'frndRequests') {
        document.getElementById('frndRequests').innerHTML = " "
        let requestarry = [];
        firebase.database().ref(`pendingReq/${profile.uid}`).once('value', (e) => {
            let requests = e.val();
            if (requests === null) {
                document.getElementById('frndRequests').innerHTML =
                    `<h2 align="center"> No Frnd Requests </h2>`
            } else {
                for (var key in requests) {
                    requestarry.push(key);
                }
                firebase.database().ref(`userProfiles`).once('value', (e) => {
                    let users = e.val()
                    for (var key2 in users) {
                        if (requestarry.indexOf(key2) !== -1) {
                            document.getElementById('frndRequests').innerHTML +=
                                `<ul class="list-group">
                    <li style="box-shadow: 0px 0px 20px black; border-radius: 50px; text-align: center;background-color: rgba(20, 20, 58, 0.562)" class="col-12 col-lg-6 offset-lg-3 list-group-item list-group-item-dark">
                    <img src="${users[key2].profileImgUrl}" style=" float: left;height: 50px; width: 50px; border-radius: 50%;border: 1px solid white; box-shadow: 0px 0px 5px black;">
                    <div style="text-align: center;">
                    <h5>${users[key2].name}</h5>
                    <button key="${key2}" onClick="acceptReq(this)" style="height: 25px; width: 100px; border:none; border-radius: 50px; box-shadow: 0px 0px 5px rgb(0, 0, 78); color: black; background-color: rgb(34, 34, 116) ">Accept</button>
                        </div>
                        </li>
                </ul>`
                        }
                    }
                })
            }
        })
    }
    else if (hide === 'myFrnds') {
        document.getElementById('myFrnds').innerHTML = " ";
        let frndArry = [];
        firebase.database().ref(`frnds/${profile.uid}`).once('value', (e) => {
            let frn = e.val()
            if (frn === null) {
                document.getElementById('myFrnds').innerHTML =
                    `<h2 align="center"> No Friends </h2>`
            } else {

                for (var key in frn) {
                    frndArry.push(key)
                }
                firebase.database().ref(`userProfiles`).once('value', (e) => {
                    let usersData = e.val();
                    for (var key2 in usersData) {
                        if (frndArry.indexOf(key2) !== -1) {
                            document.getElementById('myFrnds').innerHTML +=
                                `<ul class="list-group">
                            <li style="box-shadow: 0px 0px 20px black; border-radius: 50px; text-align: center;background-color: rgba(20, 20, 58, 0.562)" class="col-12 col-lg-6 offset-lg-3 list-group-item list-group-item-dark">
                            <img src="${usersData[key2].profileImgUrl}" style=" float: left;height: 50px; width: 50px; border-radius: 50%;border: 1px solid white; box-shadow: 0px 0px 5px black;">
                            <div style="text-align: center;">
                            <h5>${usersData[key2].name}</h5>
                            <button key="${key2}" onClick="unfrnd(this)" style="height: 25px; width: 100px; border:none; border-radius: 50px; box-shadow: 0px 0px 5px rgb(0, 0, 78); color: black; background-color: rgb(34, 34, 116) ">Unfrnd</button>
                            <button key="${key2}" onClick="frndProfile(this)" style="height: 25px; width: 100px; border:none; border-radius: 50px; box-shadow: 0px 0px 5px rgb(0, 0, 78); color: black; background-color: rgb(34, 34, 116) ">Profile</button>
                                
                            </div>
                                </li>
                        </ul>`
                        }
                    }
                })
            }

        })
    }
    else if (hide === 'pendingRequests') {
        document.getElementById('pendingRequests').innerHTML = " ";
        let pendingreqarry = [];
        firebase.database().ref(`sendedReq/${profile.uid}`).once('value', (e) => {
            let pending = e.val();
            console.log(pending)
            if (pending === null) {
                document.getElementById('pendingRequests').innerHTML =
                    `<h2 align="center"> No Pending Requests </h2>`
            } else {

                for (var key in pending) {
                    pendingreqarry.push(key)
                }
                firebase.database().ref(`userProfiles`).once('value', (e) => {
                    let dta = e.val();
                    for (var key2 in dta) {
                        if (pendingreqarry.indexOf(key2) !== -1) {
                            document.getElementById('pendingRequests').innerHTML +=
                                `<ul class="list-group">
                            <li style="box-shadow: 0px 0px 20px black; border-radius: 50px; text-align: center;background-color: rgba(20, 20, 58, 0.562)" class="col-12 col-lg-6 offset-lg-3 list-group-item list-group-item-dark">
                            <img src="${dta[key2].profileImgUrl}" style=" float: left;height: 50px; width: 50px; border-radius: 50%;border: 1px solid white; box-shadow: 0px 0px 5px black;">
                            <div style="text-align: center;">
                            <h5>${dta[key2].name}</h5>
                            <button key="${key2}" onClick="cancleReq(this)" style="height: 25px; width: 100px; border:none; border-radius: 50px; box-shadow: 0px 0px 5px rgb(0, 0, 78); color: black; background-color: rgb(34, 34, 116) ">Cancel Req</button>
                            </div>
                            </li>
                            </ul>`
                        }
                    }
                })
            }
        })
    }
}

function frndReqSender(ths) {
    let key = ths.getAttribute('key')
    firebase.database().ref(`pendingReq/${key}/${profile.uid}`).set(profile.uid).then(() => {
        firebase.database().ref(`sendedReq/${profile.uid}/${key}`).set(key).then(() => {
            ths.innerHTML = "Sent"
        })
    }).catch((error) => {
        swal({
            title: "Fail to process",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

function acceptReq(ths) {
    let key = ths.getAttribute('key')
    firebase.database().ref(`pendingReq/${profile.uid}`).child(key).remove().then(() => {
        firebase.database().ref(`sendedReq/${key}`).child(profile.uid).remove().then(() => {
            firebase.database().ref(`frnds/${profile.uid}/${key}`).set(key).then(() => {
                firebase.database().ref(`frnds/${key}/${profile.uid}`).set(profile.uid).then(() => {
                    ths.innerHTML = "Accepted"
                })
            })
        })
    }).catch((error) => {
        swal({
            title: "Fail to process",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

function unfrnd(ths) {
    let key = ths.getAttribute('key');
    firebase.database().ref(`frnds/${key}/`).child(profile.uid).remove().then(() => {
        firebase.database().ref(`frnds/${profile.uid}`).child(key).remove().then(() => {
            swal({
                title: 'info',
                icon: 'info',
                text: 'Do you want to delet your all chat?',
                buttons: ["No", "yes"],
            }).then((e) => {
                console.log(e)
                if (e === true) {
                    firebase.database().ref(`chat/${profile.uid}`).child(key).remove().then(() => {
                        firebase.database().ref(`chat/${key}`).child(profile.uid).remove().then(() => {
                            ths.innerHTML = "Unfrnded"
                        })
                    })
                } else if (e === null) {
                    swal({
                        title: 'info',
                        icon: 'info',
                        text: 'when you will be frnd again your chat history will enable to you and your frnd',
                        button: "Ok",
                        closeOnClickOutside: false,
                        closeOnEsc: false,
                    }).then(() => {
                        ths.innerHTML = "Unfrnded"
                    })
                }
            })
        })
    }).catch((error) => {
        swal({
            title: "Fail to process",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

function cancleReq(ths) {
    let key = ths.getAttribute('key');
    firebase.database().ref(`pendingReq/${key}`).child(profile.uid).remove().then(() => {
        firebase.database().ref(`sendedReq/${profile.uid}`).child(key).remove().then(() => {
            ths.innerHTML = "Cancled"
        })
    }).catch((error) => {
        swal({
            title: "Fail to process",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

function frndProfile(ths) {
    show('usrPro')
    document.getElementById('usrPro').innerHTML = " "
    let key = ths.getAttribute('key');
    firebase.database().ref(`userProfiles`).once('value', (e) => {
        let frndPro = e.val();
        for (var key2 in frndPro) {
            if (key2 === key) {
                document.getElementById('usrPro').innerHTML = `
                <div style="margin-top: 70px;" class="col-12 col-lg-10 offset-lg-1">
                <div style=" text-align: center;">
                  <img src="${frndPro[key2].profileImgUrl}" style="background-color: white;width: 150px; height: 150px; border-radius: 50%; border: 5px solid white; box-shadow: 0px 0px 10px 5px gray;">
                </div>
                <h2 class="col-12 col-lg-8 offset-lg-2" style="text-shadow: 0px 0px 5px white; ;font-weight: bolder ;border-bottom: 1px dashed rgba(119, 119, 119, 0.726); text-align: center; padding-bottom: 3px;border-radius: 50%">
                  ${frndPro[key2].name}
                </h2>
                <div class="col-12 col-lg-8 offset-lg-2">
                  <div style="margin-top: 15px;padding: 10px;box-shadow: 0px 0px 10px gray;border-radius: 10px;">
                    <h3 style=" text-align: center;text-shadow: 0px 0px 5px white;">Info</h3>
                    <ul class="list-group">
                      <li class="list-group-item list-group-item-info text-center">Email : <span>${frndPro[key2].email}</span></li>
                      <br>
                      <li class="list-group-item list-group-item-info text-center">Contect Number : <span>${frndPro[key2].number}</span></li>
                      <br>
                      <li class="list-group-item list-group-item-info text-center">Date of Birth : <span>${frndPro[key2].dob}</span></li>
                      <br>
                      <li class="list-group-item list-group-item-info text-center">Address : <span>${frndPro[key2].address}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
                `
            }
        }
    }).catch((error) => {
        swal({
            title: "Fail to process",
            text: error.message,
            icon: "error",
            button: "Ok",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
    })
}

