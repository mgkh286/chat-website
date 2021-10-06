let local = window.localStorage.getItem('userAuth');
let profile = JSON.parse(local);

firebase.database().ref(`frnds/${profile.uid}`).on('value', (e) => {
    let frndsKeys = [];
    let frnds = e.val();
    if(frnds !== null){
    for (var key in frnds) {
        frndsKeys.push(key)
    }
    firebase.database().ref(`userProfiles`).once('value', (e) => {
        document.getElementById('contact').innerHTML = " ";
        document.getElementById('mbContact').innerHTML = " ";
        let all = e.val();
        for (var key in all) {
            if (frndsKeys.indexOf(key) !== -1 && key !== profile.uid) {
                document.getElementById('contact').innerHTML += `
                <li key="${key}" onClick="chat(this)" style="cursor: pointer;">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${all[key].profileImgUrl}"
                            class="rounded-circle user_img">
                       <!-- <span class="online_icon"></span> -->
                    </div>
                    <div class="user_info">
                        <span>${all[key].name}</span>
                        <!-- <p>Maryam is online</p> -->
                    </div>
                </div>
            </li>
                `
        document.getElementById('mbContact').innerHTML += 
        `
                <li key="${key}" onClick="chat(this)" style="cursor: pointer;">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${all[key].profileImgUrl}"
                            class="rounded-circle user_img">
                            <!-- <span class="online_icon"></span> -->                       
                    </div>
                    <div class="user_info">
                        <span>${all[key].name}</span>
                        <!-- <p>Maryam is online</p> -->
                    </div>
                </div>
            </li>
                `
            }
        }
    })
}
})

function chat(ths) {
    document.getElementById('chatBody').innerHTML = " ";
    document.getElementById('mbChatBody').innerHTML = " ";
    document.getElementById('chatHeader').innerHTML = " ";
    document.getElementById('mbChatBody').innerHTML = " ";
    document.getElementById('mbChatHeader').innerHTML = " ";
     document.getElementById('mbUsers').style.display = "none";
     document.getElementById('mbChat').style.display = 'block';
        var key = ths.getAttribute('key');
        var nodes = ths.parentNode.getElementsByTagName('li');
        for (var i = 0; i < nodes.length; i++) { nodes[i].removeAttribute('class') }
        ths.setAttribute('class', 'active');
        firebase.database().ref(`userProfiles/${key}`).once('value', (e) => {
            let head = e.val();
            document.getElementById('chatHeader').innerHTML += 
            `
            <div class="img_cont">
            <img src="${head.profileImgUrl}" class="rounded-circle user_img">
            <!-- <span class="online_icon"></span> -->
            </div>
            <div class="user_info">
            <span>${head.name}</span>
            </div>
            `;
    document.getElementById('mbChatHeader').innerHTML +=
    `
    <div class="img_cont">
    <img src="${head.profileImgUrl}" class="rounded-circle user_img">
    <span class="online_icon"></span>
    </div>
    <div class="user_info">
    <span>${head.name}</span>
    </div>
    `;

            document.getElementById('textBar').innerHTML = 
            `
            <div class="input-group">
            <textarea id="messege" class="form-control type_msg" placeholder="Type your message..."></textarea>
            <div key="${head.uid}" id="pc" onClick="sendMessege(this)" class="input-group-append">
            <span class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
            </div>
            </div>
            `;
            document.getElementById('mbTextBar').innerHTML = 
            `
            <div class="input-group">
            <textarea id="mbMessege" class="form-control type_msg" placeholder="Type your message..."></textarea>
            <div key="${head.uid}" id="cl"  onClick="sendMessege(this)" class="input-group-append">
            <span class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
            </div>
            </div>
            `;
        })
        showMessege(key)
    }
    
function sendMessege(ths) {
        if(ths.getAttribute('id') === 'cl'){
            var message = document.getElementById('mbMessege');
        }else if(ths.getAttribute('id') === 'pc'){
            var message = document.getElementById('messege');
        }
        let key = ths.getAttribute('key')
    let timeStamp = firebase.database.ServerValue.TIMESTAMP;
    let messegeText = message.value;
    let obj = {
        messegeText,
        timeStamp
    }
    if (key !== null) {
        if (messegeText !== "" && messegeText !== undefined && messegeText !== null) {
            firebase.database().ref(`chat/${key}/${profile.uid}`).push(obj).then(() => {
                showMessege(key)
            document.getElementById('messege').value = "";
            document.getElementById('mbMessege').value = "";
            })
        }
    }

}

function showMessege(k) {
    var key = k;
    var keyImgUrl;
    firebase.database().ref(`userProfiles/${key}`).once('value', (e) => {
        let d = e.val();
        return keyImgUrl = d.profileImgUrl;
    })
    firebase.database().ref(`chat/${profile.uid}`).on('value', (a) => {

        var messegeObj = {
            recieveMessege: [],
            sendMessege: [],
        }
        var recieveMessegeKeyChecker = [];
        var sendMessageKeyCheker = [];
        firebase.database().ref(`chat/${profile.uid}/${key}`).once('value', (l) => {
            firebase.database().ref(`chat/${key}/${profile.uid}`).once('value', (e) => {
                let dta = l.val()
                for (var key in dta) {
                    if (recieveMessegeKeyChecker.indexOf(key) === -1) {
                        recieveMessegeKeyChecker.push(key)
                        messegeObj.recieveMessege.push(dta[key])
                    }
                }
                let data = e.val()
                for (var key in data) {
                    if (sendMessageKeyCheker.indexOf(key) === -1) {
                        sendMessageKeyCheker.push(key)
                        messegeObj.sendMessege.push(data[key])
                    }
                }
            }).then(() => {
                var mainArray = [];
                for (var key in messegeObj) {
                    for (var key2 in messegeObj[key]) {
                        if (key === 'recieveMessege') {
                            messegeObj[key][key2].recieve = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                        else if (key === 'sendMessege') {
                            messegeObj[key][key2].send = 'done'
                            mainArray.push(messegeObj[key][key2])
                        }
                    }
                }
                return mainArray;
            }).then((mainArray) => {
                document.getElementById('chatBody').innerHTML = " "
                document.getElementById('mbChatBody').innerHTML = " "
                mainArray.sort(function (a, b) {
                    return a.timeStamp - b.timeStamp;
                });
                for (var key in mainArray) {
                    for (var key2 in mainArray[key]) {
                        if (key2 === 'recieve') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById('chatBody').innerHTML +=
                                `
                            <div class="d-flex justify-content-end mb-4">
                            <div style="min-width: 100px;" class="msg_cotainer_send">
                            ${mainArray[key].messegeText}
                            <span class="msg_time_send">${time}</span>
                            </div>
                            <div class="img_cont_msg">
                            <img src="${keyImgUrl}" class="rounded-circle user_img_msg">
                            </div>
                            </div>
                            `;
                            document.getElementById('mbChatBody').innerHTML +=
                            `
                            <div class="d-flex justify-content-end mb-4">
                            <div style="min-width: 100px;" class="msg_cotainer_send">
                            ${mainArray[key].messegeText}
                            <span class="msg_time_send">${time}</span>
                            </div>
                            <div class="img_cont_msg">
                            <img src="${keyImgUrl}" class="rounded-circle user_img_msg">
                            </div>
                            </div>
                            `;
                        } else if (key2 === 'send') {
                            let time = getTime(mainArray[key].timeStamp)
                            document.getElementById('chatBody').innerHTML +=
                                `
                            <div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                            <img src="${profile.profileImgUrl}"
                            class="rounded-circle user_img_msg">
                            </div>
                            <div style="min-width: 100px;" class="msg_cotainer">
                            ${mainArray[key].messegeText}
                            <span class="msg_time">${time}</span>
                            </div>
                            </div>
                            `;
                            document.getElementById('mbChatBody').innerHTML +=
                            `
                            <div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                            <img src="${profile.profileImgUrl}"
                            class="rounded-circle user_img_msg">
                            </div>
                            <div style="min-width: 100px;" class="msg_cotainer">
                            ${mainArray[key].messegeText}
                            <span class="msg_time">${time}</span>
                            </div>
                            </div>
                            `;
                        }

                    }

                }
            }).then(()=>{
                var elem = document.getElementById('chatBody');
                elem.scrollTop = elem.scrollHeight;
                var eleme = document.getElementById('mbChatBody');
                eleme.scrollTop = eleme.scrollHeight;
            })
        })
    })
}

function getTime(t) {
    if (t !== undefined) {
        var myDate = new Date(t);
    } else if (t === undefined) {
        var myDate = new Date();
    }
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var date = myDate.getDate();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    return time = `${date}-${month}-${year} ${hours}:${minutes}`
}

function goBack(){
    document.getElementById('mbUsers').style.display = "block";
    document.getElementById('mbChat').style.display = 'none';
}