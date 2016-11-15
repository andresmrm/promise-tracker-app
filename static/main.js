function getLoc() {
    // check for Geolocation support
    if (navigator && navigator.geolocation) {
        /* alert('Geolocation is supported!')*/
        navigator.geolocation.getCurrentPosition(function(position) {
            alert('Geolocation worked!')
            document.getElementById('location').innerHTML = position.coords.latitude + ',' + position.coords.longitude
        }, function(error) {
            alert('Geolocation Error occurred. Error code: ' + error.code)
            // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from locaton provider)
            //   3: timed out
        })
    }
    else {
        alert('Geolocation is not supported for this Browser/OS version yet.')
    }
}
document.getElementById("getloc").addEventListener("click", getLoc)

// Foto1
// if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
//     function getPic() {
//         // Grab elements, create settings, etc.
//         var video = document.getElementById('video')

//         alert('qual?')
//         // Get access to the camera!
//         if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             alert('mediaDevices!')
//             // Not adding `{ audio: true }` since we only want video now
//             navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//                 video.src = window.URL.createObjectURL(stream)
//                 video.play()
//                 window.mystream = stream
//             })
//         }
//         else if(navigator.getUserMedia) { // Standard
//             alert('userMedia!')
//             navigator.getUserMedia({ video: true }, function(stream) {
//                 video.src = stream
//                 video.play()
//                 window.mystream = stream
//             }, errBack)
//         } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
//             alert('webkitUserMedia!')
//             navigator.webkitGetUserMedia({ video: true }, function(stream){
//                 video.src = window.webkitURL.createObjectURL(stream)
//                 video.play()
//                 window.mystream = stream
//             }, errBack)
//         } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
//             alert('mozUserMedia!')
//             navigator.mozGetUserMedia({ video: true }, function(stream){
//                 video.src = window.URL.createObjectURL(stream)
//                 video.play()
//                 window.mystream = stream
//             }, errBack)
//         }
//     }
//     var els = '<button id="getpic">Ligar câmera</button> <video id="video" width="300" height="300" autoplay></video> <button id="snap">Tirar foto</button> <canvas id="canvas" width="300" height="300"></canvas>'
//     document.getElementById('pic1').innerHTML = els
//     document.getElementById("getpic").addEventListener("click", getPic)

//     // Trigger photo take
//     document.getElementById("snap").addEventListener("click", function() {
//         var video = document.getElementById('video')
//         var canvas = document.getElementById('canvas')
//         var context = canvas.getContext('2d')
//         context.drawImage(video, 0, 0, 300, 300)
//     })
// } else {
//     document.getElementById('pic1').innerHTML = 'não suportado'
// }


function turnoffPic1() {
    var video = document.getElementById('video')
    if (video) {
        video.pause()
        video.src = ''
        window.mystream.getTracks()[0].stop()
    }
    Webcam.reset()
}
document.getElementById("pic2").addEventListener("click", turnoffPic1)

function loadPic() {
    var reader = new FileReader();
    reader.onload = (function(aImg) {
        document.getElementById('pic2img').src = aImg.target.result
        // alert('Imagem carregada')
    })
    reader.readAsDataURL(document.getElementById('pic2').files[0])
}
// document.getElementById("loadpic").addEventListener("click", loadPic)
document.getElementById("pic2").addEventListener("change", loadPic)


function saveData() {
    // var canvas = document.getElementById('canvas')
    var img1
    // if (canvas) {
    //     img1 = canvas.toDataURL()
    // } else {
    //     img1 = ''
    // }
    img1 = document.getElementById('webcampic')
    if (img1) img1 = img1.src
    else img1 = ''

    var register = {
        userAgent: navigator.userAgent,
        location: document.getElementById('location').innerHTML,
        img1: img1,
        img2: document.getElementById('pic2img').src,
    }
    // is localStorage available?
    if (typeof window.localStorage != "undefined") {
        var stored = localStorage.getItem('registers')
        if (!stored) stored = []
        else stored = JSON.parse(stored)
        stored.push(register)
        alert('Salvo! - Total: ' + stored.length + ' itens')
        localStorage.setItem('registers', JSON.stringify(stored))
        updateNumReg()
    } else {
        alert('Sem localStorage!')
    }
}
document.getElementById("savedata").addEventListener("click", saveData)


function sendData() {
    $.ajax({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: 'post',
        contentType: 'application/json',
        // json object to sent to the authentication url
        data: localStorage.getItem('registers'),
    }).done(function () {
        alert("Enviado!")
	      localStorage.removeItem('registers')
        updateNumReg()
    }).fail(function () {
        alert('Erro!')
    })
}
document.getElementById("senddata").addEventListener("click", sendData)

function clearData() {
	  localStorage.removeItem('registers')
    updateNumReg()
}
document.getElementById("cleardata").addEventListener("click", clearData)

function updateNumReg() {
    var stored = localStorage.getItem('registers')
    var num = 0
    if (stored) num = JSON.parse(stored).length
    document.getElementById("numReg").innerHTML = num
}

updateNumReg()
