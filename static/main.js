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
if ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    function getPic() {
        // Grab elements, create settings, etc.
        var video = document.getElementById('video')

        // Get access to the camera!
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream)
                video.play()
                window.mystream = stream
            })
        }
        else if(navigator.getUserMedia) { // Standard
            navigator.getUserMedia({ video: true }, function(stream) {
                video.src = stream
                video.play()
                window.mystream = stream
            }, errBack)
        } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
            navigator.webkitGetUserMedia({ video: true }, function(stream){
                video.src = window.webkitURL.createObjectURL(stream)
                video.play()
                window.mystream = stream
            }, errBack)
        } else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
            navigator.mozGetUserMedia({ video: true }, function(stream){
                video.src = window.URL.createObjectURL(stream)
                video.play()
                window.mystream = stream
            }, errBack)
        } else {
            // Remove elements if not supported
            document.getElementById('foto1').innerHTML = ''
        }
    }
    var els = '<button id="getpic">Ligar câmera</button> <video id="video" width="300" height="300" autoplay></video> <button id="snap">Tirar foto</button> <canvas id="canvas" width="300" height="300"></canvas>'
    document.getElementById('pic1').innerHTML = els
    document.getElementById("getpic").addEventListener("click", getPic)
} else {
    document.getElementById('pic1').innerHTML = 'não suportado'
}

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
    var video = document.getElementById('video')
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, 300, 300)
})


function turnoffPic1 () {
    var video = document.getElementById('video')
    if (video) {
        video.pause()
        video.src = ''
        window.mystream.getTracks()[0].stop()
    }
}
document.getElementById("pic2").addEventListener("click", turnoffPic1)

function loadPic() {
    var reader = new FileReader();
    reader.onload = (function(aImg) {
        window.i = aImg.target.result
        alert('Imagem carregada')
    })
    reader.readAsDataURL(document.getElementById('pic2').files[0])
}
// document.getElementById("loadpic").addEventListener("click", loadPic)
document.getElementById("pic2").addEventListener("change", loadPic)


function saveData() {
    var canvas = document.getElementById('canvas')
    var img1
    if (canvas) {
        img1 = canvas.toDataURL()
    } else {
        img1 = ''
    }

    var register = {
        userAgent: navigator.userAgent,
        location: document.getElementById('location').innerHTML,
        img1: img1,
        img2: window.i,
    }
    // is localStorage available?
    if (typeof window.localStorage != "undefined") {
        var stored = localStorage.getItem('registers')
        if (!stored) stored = []
        else stored = JSON.parse(stored)
        stored.push(register)
        alert('Salvo! - Total: ' + stored.length + ' itens')
        localStorage.setItem('registers', JSON.stringify(stored))
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
    }).fail(function () {
        alert('Erro!')
    })
}
document.getElementById("senddata").addEventListener("click", sendData)
