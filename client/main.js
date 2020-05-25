const API_URL = 'http://localhost:5000/media';
const mediasElement = document.querySelector('#medias');
const loadingElement = document.querySelector('#loading');

// const EntryStatus =  Object.freeze({
//     ERROR_IMPORTING = '-2',
//     ERROR_CONVERTING = '-1',
//     IMPORT ='0',
//     INFECTED ='virusScan.Infected',
//     SCAN_FAILURE ='virusScan.ScanFailure',
//     PRECONVERT ='1',
//     READY ='2',
//     DELETED ='3',
//     PENDING ='4',
//     MODERATE ='5',
//     BLOCKED ='6',
//     NO_CONTENT ='7',
//   };

let allMedias = localStorage.medias ? JSON.parse(localStorage.medias) : [];
let mediaElementsById = {};

fetch(API_URL)
    .then(response => response.json())
    .then(showMedias);

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
    colDiv.className = 'col-xs-1 col-sm-6 col-md-4 media';
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
  
    const h5 = document.createElement('h5');
    h5.className = 'card-title';
    h5.textContent = media.name;
    mediaBody.appendChild(h5);
  
    link.appendChild(mediaElement);
    colDiv.appendChild(link);
    
    return colDiv; 
}