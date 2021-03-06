(function () {
    function SongPlayer($rootScope, Fixtures) {
        
        /**
        * @desc returns this object, making it's properties and methods public to teh rest of the app
        * @type {Object}
        */
        var SongPlayer = {};
        
        /**
        * @desc pulls and sets current album data
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
         
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
 
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
 
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function stopSong
        * @desc stops current currentBuzzObject
        * @param {Object} song
        */ 
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };
         
        /**
        * @function playSong
        * @desc Plays selected currentBuzzObject and sets song.playing to true
        * @param {Object} song
        */ 
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @function getSongIndex
        * @desc 
        * @param {Object} song
        * @returns {Number}
        */ 
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        SongPlayer.currentSong = null;
         
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        SongPlayer.volume = null; 

        /**
        * @function SongPlayer.play
        * @desc plays a song
        * @param {Object} song
        */ 
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            } 

        };
        
        /**
        * @function SongPlayer.pause
        * @desc pauses a song
        * @param {Object} song
        */ 
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.previous
        * @desc moves back one song in the index to the previous song
        */ 
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
             if (currentSongIndex < 0) {
                stopSong();
             } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
         
        /**
        * @function SongPlayer.next
        * @desc moves forward one song in the index to the next song
        */ 
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
             if (currentSongIndex > currentSongIndex.length) {
                stopSong();
             } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }  
            SongPlayer.volume = volume
        };

                     
    return SongPlayer;
}
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();