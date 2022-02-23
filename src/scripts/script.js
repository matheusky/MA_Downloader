const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');

var archive;
var titulo;


function dlq() {
    const typedl = document.getElementById('typedl').value;
    if (typedl == "vd") {
        videoDownload();
    }
    if (typedl == "ad") {
        audioDownload();
    }
}

async function videoDownload() {
    let url = document.getElementById('link').value;

    if (url == "") {
        alert("Por favor, insira um link válido!")
        return
    }

    document.getElementById('inputlink').display = "none";
    document.getElementById('loading').style.display = "block";

    let info = await ytdl.getInfo(url);

    details(info);

    titulo = info.videoDetails.title.replace(/[&/\#,+()$~%.|'":*?<>{}]/g, '');
    
    ytdl(url).pipe(fs.createWriteStream(path.join(__dirname, '../audio/' + titulo + '.mp4')));

    archive = path.join(__dirname, '../audio/' + titulo + '.mp4');

    document.getElementById('loading').style.display = "none";
    document.getElementById('filetypedl').innerHTML = "Video Download";
    document.getElementById('dl').style.display = "block";


    document.getElementById('down').href = archive;
    document.getElementById('down').download = titulo + ".mp4";
    document.getElementById('down').type = "video/mp4";
    document.getElementById('downloadGen').style.display = "block";
    createPopup("Download pronto!", "Clique no botão abaixo para baixar!", 3000);

};


async function audioDownload() {
    let url = document.getElementById('link').value;

    if (url == "") {
        createPopup("Erro", "Por favor, insira um link válido!", 3000);
        return
    }

    
    document.getElementById('inputlink').display = "none";
    document.getElementById('loading').style.display = "block";

    let info = await ytdl.getInfo(url);

    details(info);

    let titulo = info.videoDetails.title.replace(/[&/\#,+()$~%.|'":*?<>{}]/g, '');

    //download audio
    ytdl(url, {
        filter: 'audioonly'
    }).pipe(fs.createWriteStream(path.join(__dirname, '../audio/' + titulo + '.mp3')));

    archive = path.join(__dirname, '../audio/' + titulo + '.mp3');

    document.getElementById('loading').style.display = "none";
    document.getElementById('filetypedl').innerHTML = "Audio Download";
    document.getElementById('dl').style.display = "flex";


    document.getElementById('down').href = archive;
    document.getElementById('down').download = titulo + ".mp3";
    document.getElementById('down').type = "audio/mp3";
    document.getElementById('downloadGen').style.display = "block";
    createPopup("Download pronto!", "Clique no botão abaixo para baixar!", 3000);
};

function dl() {
    setTimeout(() => {
        if (fs.existsSync(archive)) {
            fs.unlinkSync(archive);
        };
        createPopup("Download", "Espere a página ser recarregada caso for necessário baixar mais arquivos!", 3000);
        location.reload();
    }, 15000);
};

function details(info) {
    document.getElementById('dlthumb').src = info.videoDetails.thumbnails[3].url;
    document.getElementById('dltitle').innerHTML = info.videoDetails.title;
    document.getElementById('dlchannel').innerHTML = info.videoDetails.author.name;
    document.getElementById('dltime').innerHTML = Math.floor(info.videoDetails.lengthSeconds / 60) + ":" + (info.videoDetails.lengthSeconds % 60);

}



//---create a css popup
function createPopup(title, text, time) {
    let popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = '<h2>' + title + '</h2>' + '<p>' + text + '</p>';
    document.body.appendChild(popup);
    setTimeout(function () {
        popup.remove();
    }, time);
};
//---------------------