$(document).ready(function() {
    var $radios = $('input:radio[name=tvradio]');
    if($radios.is(':checked') === false) {
        $radios.filter('[value=all]').prop('checked', true);
    }
    getStreamers();
    $radios.on('click', function() {
        selectStreamers($('input:radio[name=tvradio]:checked').val());
    });
});

const setURL = function(type, channel) {
    return 'https://wind-bow.gomix.me/twitch-api/' + type + '/' + channel + '?callback=?';
};

const getStreamStatus = function(channel, callback) {
    $.getJSON(setURL('streams', channel), function(data){
        var game, status;
        if (data.stream === null) {
            game = "Offline";
            status = "offline";
        }
        else {
            game = data.stream.game;
            status = "online";
        };
        callback({
            'game': game,
            'status': status
        });
    });
};

const getChannelInfo = function(channel, status, callback) {
    $.getJSON(setURL('channels', channel), function(data) {
        var logo = data.logo != null ? data.logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=no-logo";
        var name = data.display_name != null ? data.display_name : channel;
        var description = status === "online" ? ': ' + data.status : "";
        callback({
            'logo': logo,
            'name': name,
            'url': data.url,
            'description': description
        });
    });
};

const addStreamer = function(status, logo, name, url, game, description) {
    var html = '<div class="tv-streamer tv-paragraph '+status+'"><div class="row"><div class="col-xs-2 col-md-1"><img src="'+logo+'" alt="Image" class="img-circle" width="50" height="50" /></div><div class="col-xs-10 col-md-3"><a href="'+url+'" title="'+name+'" class="tv-title" target="_blank">'+name+'</a></div><div class="col-xs-12 col-md-8"><p class="tv-game">'+game+description+'</p></div></div></div>';
    $('.tv-streamers').append(html);
};

const getStreamers = function() {
    var arrChannel = ['ESL_SC2', 'OgamingSC2', 'freecodecamp', 'RobotCaleb', 'noobs2ninjas', 'brunofin', 'comster404'];

    arrChannel.forEach(function(channel) {
        var streamer, info;
        getStreamStatus(channel, function(data) {
            streamer = data;

            getChannelInfo(channel, streamer.status, function(data) {
                info = data;

                if (info.url === undefined) {
                    info.description = ': Account Closed';
                    info.url = 'javascript:void(0)';
                }

                addStreamer(streamer.status, info.logo, info.name, info.url, streamer.game, info.description);
            });
        });
    });
};

const removeHidden = function(elements) {
    for(var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('hidden');
    }
};

const addHidden = function(elements) {
    for(var i = 0; i < elements.length; i++) {
        elements[i].classList.add('hidden');
    }
};

const selectStreamers = function(value) {
    var elOnlines = document.getElementsByClassName('tv-streamer online');
    var elOfflines = document.getElementsByClassName('tv-streamer offline');
    switch(value){
        case 'all':
            removeHidden(elOnlines);
            removeHidden(elOfflines);
            break;
        case 'online':
            removeHidden(elOnlines);
            addHidden(elOfflines);
            break;
        case 'offline':
            addHidden(elOnlines);
            removeHidden(elOfflines);
            break;
    }
};