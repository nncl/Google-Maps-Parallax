;(function( window, document, $, undefined ) {
  'use strict';

  var home = (function() {

    var $private = {};
    var $public = {};

    $public.performMap = function() {
      var url = 'https://gist.githubusercontent.com/nncl/9c4a8113c98cf07d68eb/raw/894e63c976cc96ea5c35dda434027fc5f206bbf6/maps.md';

      $.get(url, function(data) {
        var bounds = new google.maps.LatLngBounds();

        var mapOptions = {
          center: new google.maps.LatLng(-23.53, -46.62),
          zoom: 15,
          zoomControl: true,
          scrollwheel: false,
          // PARALLAX
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scroll:{x:$(window).scrollLeft(),y:$(window).scrollTop()}
        };

        var map = new google.maps.Map(document.getElementById('ca-canvas'),
            mapOptions);

        // DESIGN STYLES
        map.set('styles', [
          {
            stylers: [
              { hue: "#f2f2f2" },
              { saturation: -200 }
            ]
          },{
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { lightness: 100 },
              { visibility: "simplified" }
            ]
          },{
            featureType: "road",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ]);

        var infowindow = new google.maps.InfoWindow();
        var marker, i;

        $(data).each(function(i,o){
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(o.lat, o.lng),
            map: map,
            icon : o.icon
          });

          bounds.extend(marker.position);

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(o.title);
              infowindow.open(map, marker);
            }
          })(marker, i));
        });

        // PARALLAX
        map.fitBounds(bounds);

        var listener = google.maps.event.addListener(window, 'load', function() {
          map.setZoom(3);
          google.maps.event.removeListener(listener);
        });

        var offset=$(map.getDiv()).offset();

        map.panBy(((mapOptions.scroll.x-offset.left)/3),((mapOptions.scroll.y-offset.top)/3));
        google.maps.event.addDomListener(window, 'scroll', function(){
          var scrollY=$(window).scrollTop(),
              scrollX=$(window).scrollLeft(),
              scroll=map.get('scroll');

          if(scroll){
            map.panBy(-((scroll.x-scrollX)/3),-((scroll.y-scrollY)/3));
          }

          map.set('scroll',{x:scrollX,y:scrollY})
        });

      }, 'json');
    }

    return $public;
  })();

  // Global
  window.home = home;
  home.performMap();

})( window, document, jQuery );

$(window).load(function() {
});
