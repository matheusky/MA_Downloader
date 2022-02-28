const fs = require("fs");
const ytdl = require("ytdl-core");
const path = require("path");

var info;
let starttime;

// Get info from url
async function getVDinf() {
  let url = document.getElementById("link").value;

  if (url == "") {
    createPopup("Erro", "Por favor, insira um link válido!", 3000);
    return;
  }

  document.getElementById("inputlink").display = "none";
  document.getElementById("loading").style.display = "block";

  info = await ytdl.getInfo(url);

  document.getElementById("dlthumb").src = info.videoDetails.thumbnails[3].url;
  document.getElementById("dltitle").innerHTML = info.videoDetails.title;
  document.getElementById("dlchannel").innerHTML =
    info.videoDetails.author.name;
  document.getElementById("dltime").innerHTML =
    Math.floor(info.videoDetails.lengthSeconds / 60) +
    ":" +
    (info.videoDetails.lengthSeconds % 60);

  document.getElementById("loading").style.display = "none";
  document.getElementById("dldt").style.display = "block";

  // populate select with quality options for video download
  var select = document.getElementById("quality");
  var option = document.createElement("option");

  for (let i = 0; i < info.formats.length; i++) {
    if (
      info.formats[i].hasAudio == true &&
      info.formats[i].hasVideo == true &&
      info.formats[i].container == "mp4"
    ) {
      option.text = info.formats[i].qualityLabel;
      option.value = info.formats[i].itag;
      select.add(option);
    }
  }
  window.scrollTo(0, document.body.scrollHeight);
} // end get info

async function configDL() {
  // hide download options
  document.getElementById("DLprogress").style.display = "block";

  // difine audio or video/quality
  var typedl = document.getElementById("typedl").value;

  if (typedl == "vd") {
    // video download

    var quality = document.getElementById("quality").value;

    var video = ytdl(info.videoDetails.video_url, { quality: quality });

    video.pipe(
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "../audio/",
          info.videoDetails.title.replace(/[&/\#,+()$~%.|'":*?<>{}]/g, "") +
            ".mp4"
        )
      )
    );

    window.scrollTo(0, document.body.scrollHeight);

    download(video);
  } // end video download

  if (typedl == "ad") {
    var audio = ytdl(info.videoDetails.video_url, {
      filter: "audioonly",
      quality: "highestaudio",
      format: "mp3",
    });

    audio.pipe(
      fs.createWriteStream(
        path.resolve(
          __dirname,
          "../audio/",
          info.videoDetails.title.replace(/[&/\#,+()$~%.|'":*?<>{}]/g, "") +
            ".mp3"
        )
      )
    );

    window.scrollTo(0, document.body.scrollHeight);

    download(audio);
  } // end audio download
}

// download function (for video and audio)
function download(data) {
  data.once("response", () => {
    starttime = Date.now();
  });

  data.on("progress", (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    const estimatedDownloadTime =
      downloadedMinutes / percent - downloadedMinutes;

    // barra de progresso
    document.getElementById("progressnum").innerText = `${(
      percent * 100
    ).toFixed(0)}% `;
    document.getElementById("progress-bar-fill").style.width = `${(
      percent * 100
    ).toFixed(0)}% `;

    document.getElementById("dltotal").innerHTML = `Baixado: ${(
      downloaded /
      1024 /
      1024
    ).toFixed(2)}MB de ${(total / 1024 / 1024).toFixed(2)}MB`;
    document.getElementById(
      "dltimeleft"
    ).innerHTML = `Tempo restante: ${estimatedDownloadTime.toFixed(2)}min`;
  });

  data.on("end", () => {
    createPopup("Sucesso", "Download concluído!", 3000);
  });
}

// show quality options
function quality() {
  if (document.getElementById("typedl").value == "vd") {
    document.getElementById("quality").style.display = "";
  }
  if (document.getElementById("typedl").value == "ad") {
    document.getElementById("quality").style.display = "none";
  }
}

// create a css popup
function createPopup(title, text, time) {
  let popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = "<h2>" + title + "</h2>" + "<p>" + text + "</p>";
  document.body.appendChild(popup);
  setTimeout(function () {
    popup.remove();
  }, time);
}

// open folder with audio files in explorer
function openFolder() {
  var folder = path.resolve(__dirname, "../audio/");
  require("child_process").exec(`start "" ${folder}`);
}

// reload page
function reload() {
  location.reload();
}