const API_URL = 'http://localhost:5000/media';
const mediasElement = document.querySelector('#medias');
const loadingElement = document.querySelector('#loading');
const mediaUpload = document.querySelector('#mediaUpload');
const input = document.querySelector('#mediaFile');
const refreshBtn = document.querySelector('#refreshBtn');

function Enum() {
    this.self = arguments[0];
}

Enum.prototype = {
    keys : function() {
    return Object.keys(this.self);
    },
    values : function() {
    var me = this;
    return this.keys(this.self).map(function(key) {
        return me.self[key];
    });
    },
    getValueByName : function(key) {
    return this.self[this.keys(this.self).filter(function(k) {
        return key === k;
    }).pop() || ''];
    },
    getNameByValue : function(value) {
    var me = this;
    return this.keys(this.self).filter(function(k) {
        return me.self[k] === value;
    }).pop() || null;
    }
};

const EntryStatus =  new Enum({
    ERROR_IMPORTING: '-2',
    ERROR_CONVERTING: '-1',
    IMPORT: '0',
    INFECTED:'virusScan.Infected',
    SCAN_FAILURE: 'virusScan.ScanFailure',
    PRECONVERT:'1',
    READY: '2',
    DELETED: '3',
    PENDING: '4',
    MODERATE:'5',
    BLOCKED:'6',
    NO_CONTENT: '7',
});

function getEnumKeys(enumType) {
    return Object.keys(enumType);
  }

function getNameByValue(enumType, value) {
    return enumType[getEnumKeys(enumType).filter(function(k) {
      return key === k;
    }).pop() || ''];
}

const upload = () => {
    let file = input.files[0];
    const formData  = new FormData();
    formData.append("file", file);
    
    fetch(API_URL + "/upload", { 
      method: 'POST',
      headers: {
      },
      body: formData
    }).then(
      response => {
          response.json()
          input.value = "";
      }
    ).then(
      success => {
          console.log(success)
          getAllMedia();
      }
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  };

mediaUpload.addEventListener('submit', upload);

let allMedias = localStorage.medias ? JSON.parse(localStorage.medias) : [];
let mediaElementsById = {};

const getAllMedia = () => fetch(API_URL)
    .then(response => response.json())
    .then(showMedias);

refreshBtn.addEventListener('click', getAllMedia);

getAllMedia();

function showMedias(response) {
    let medias = response.result;

    localStorage.medias = JSON.stringify(medias);
    allMedias = medias;
    loadingElement.style.display = 'none';
    
    mediasElement.innerHTML = '';
    medias.forEach((media) => {
        const mediaElement = createmediaElement(media);
        mediasElement.appendChild(mediaElement);
    });
}


function createmediaElement(media) {
    console.log("createmediaElement", media)
    const colDiv = document.createElement('div');
    colDiv.className = 'col-xs-1 col-sm-6 col-md-4 video';
    mediaElementsById[media.id] = colDiv;
  
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.href = media.cdnUrl;
  
    const mediaElement = document.createElement('div');
    mediaElement.className = 'card ma-1';
  
    const img = document.createElement('img');

    img.src = media.thumbnailUrl ? media.thumbnailUrl : "loading.jpg",
    img.className = 'card-img-top';
  
    mediaElement.appendChild(img);
  
    const mediaBody = document.createElement('div');
    mediaBody.className = 'card-body';

    mediaElement.appendChild(mediaBody);

    const mediaStatus = document.createElement('span');
    mediaStatus.className = 'video-status';
    mediaStatus.textContent = EntryStatus.getNameByValue(media.status);

    mediaElement.appendChild(mediaStatus);
  
    const h5 = document.createElement('h5');
    h5.className = 'card-title';
    h5.textContent = media.name;
    mediaBody.appendChild(h5);
  
    link.appendChild(mediaElement);
    colDiv.appendChild(link);
    
    return colDiv; 
}