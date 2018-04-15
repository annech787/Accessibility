
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
let pass = null;
let prevPass = null;
let searchNext = "";

function getDataFromApi(searchTerm, callback, searchPrevious) {
    console.log(searchTerm);
    let query = {
        part: 'snippet',
        key: 'AIzaSyBZKv-m2R8L3pCRncRMzixXmnVE0FZVaDA',
        q: `${searchTerm} in:name`,
        maxResults: 5,
    };
    let currentPass = pass;
    if(searchPrevious === true){
        currentPass = prevPass;
    }
    if(currentPass){
        query.pageToken = currentPass;
    }
    
    $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(item) {
    return `
    <a  href="#${item.id.videoId}">
        <h1>${item.snippet.title}</h1>
        <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.thumbnails.title}">
    </a>
    
    <!-- lightbox container hidden with CSS  -->
    <a href="#_" class="lightbox" id="${item.id.videoId}">
        <div id="videoModal" class="modal hide fade in" tabindex="-1" role="dialog" aria-labelledby="videoModalLabel" aria-hidden="true" style="display: block;">
            <div class="modal-header">
            <button type="button" class="close full-height" data-dismiss="modal" aria-hidden="true"> 
                X
            </button>
            <h3>${item.snippet.title}</h3>
            </div>
            <div class="modal-body">
                <iframe width="870" height="489"
                    src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen
                </iframe>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </a>
    <a href="#_" class="lightbox" id="img2">
        <div id="videoModal" class="modal hide fade in" tabindex="-1" role="dialog" aria-labelledby="videoModalLabel" aria-hidden="true" style="display: block;">
            <div class="modal-header">
            <button type="button" class="close full-height" data-dismiss="modal" aria-hidden="true"> 
                X
            </button>
            <h3>${item.snippet.title}</h3>
            </div>
            <div class="modal-body">
                <iframe width="870" height="489"
                    src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen
                </iframe>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </a>
   <a href = "https://www.youtube.com/channel/${item.snippet.channelId}" class ="more">More videos from this channel</a>
    `;
}


$('.next').click(event =>{
    event.preventDefault();
    getDataFromApi(searchNext, displayYouTubeSearchData, false);

} );
  
$('.previous').click(event =>{
    event.preventDefault();
    getDataFromApi(searchNext, displayYouTubeSearchData, true);
});
  


function displayYouTubeSearchData(data) {
    console.log(data);
    pass = data.nextPageToken;
    console.log(pass);
    prevPass = data.prevPageToken;
    const results = data.items.map((item, index) => renderResult(item));
    const total = data.pageInfo.totalResults;
    const together = results.join('');
    const final = total+" "+'result'+together;
    $('.js-search-results').html(results);
  
}


function watchSubmit() {
    $('.js-search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        searchNext = query;
    // clear out the input
        queryTarget.val("");
        getDataFromApi(query, displayYouTubeSearchData);
    });
}

$(watchSubmit);