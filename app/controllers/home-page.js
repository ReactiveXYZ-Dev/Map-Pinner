import Controller from '@ember/controller';
import { cloneDeep } from 'lodash';
import turf from "npm:@turf/turf";
import $ from "npm:jquery";

export default Controller.extend({

    /**
     * UI data
     */
    selectedCoords: {
        lat: null,
        lng: null
    },

    allowMouseEnter: true,

    textTranslate: [0,2],

    /**
     * Map layer data
     */
    markers: {
        type: 'FeatureCollection',
        features: []
    },

    arcs: {
        type: 'FeatureCollection',
        features: []
    },

    /**
     * View actions
     */
    actions: {
        mapClicked({ target: map, point }) {
            // request for user input
            let label = prompt("Please enter a label");


            // parse coordinates
            let coordsPair = map.unproject(point);
            // connect the previous point with an arc
            if (this.get('markers.features').length > 0) {
                this._appendArc(this._getPreviousCoord(), coordsPair);
            }
            // append a new point on map
            this._appendPoint(coordsPair, label);
            // disable mouseenter event for a brief time
            this.set('allowMouseEnter', false);
            setTimeout(() => {
                this.set('allowMouseEnter', true);
            }, 650);
        },

        mouseHovering({ target: map, features, point }) {
            if (!this.get('allowMouseEnter')) return;
            map.getCanvas().style.cursor = 'pointer';
            // update current coords
            this.set('selectedCoords', {
                lng: features[0].geometry.coordinates[0],
                lat: features[0].geometry.coordinates[1]
            });
            // show popup
            let $popup = $('#info-popup');
            // register listener
            $popup.mouseleave(() => {
                // hide over mouseleave
                $('#info-popup').fadeOut();
            });
            // change style
            $popup.css({
                top: (point.y - 170) + "px",
                left: (point.x - 150) + "px"
            });
            $popup.fadeIn();
        },

        mouseLeaving({ target: map }) {
            map.getCanvas().style.cursor = '';
        },
        
        hidePopup() {
            $('#info-popup').fadeOut();
        }
    },

    /**
     * Helper functions
     */
    _appendPoint(point, label) {
        let markers = cloneDeep(this.get('markers'));
        markers.features.pushObject({
            type: 'Feature',
            geometry: { 
                type: 'Point', 
                coordinates: [ point.lng, point.lat ] 
            },
            properties: {
                label: label
            }
        });
        this.set('markers', markers);
    },

    _getPreviousCoord() {
        let features = this.get('markers.features');
        let lastFeature = features[features.length - 1];
        let coords = {
            lng: lastFeature.geometry.coordinates[0],
            lat: lastFeature.geometry.coordinates[1]
        };
        return coords;
    },

    _appendArc(origin, destination) {
        let arcs = cloneDeep(this.get('arcs'));
        let coordinates = this._calcaulteArcSegments(origin, destination);;
        arcs.features.pushObject({
            type: 'Feature',
            geometry: {
                type: "LineString",
                coordinates: coordinates
            }
        });
        this.set('arcs', arcs);
    },

    _calcaulteArcSegments(origin, destination) {
        var arcCoords = [];
        // get line distance
        let geojson = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [origin.lng, origin.lat],
                    [destination.lng, destination.lat]
                ]
            }
        };
        var lineDistance = window.turf.lineDistance(geojson, 'kilometers');
        // construct line segments
        for (var i = 0; i < Math.ceil(lineDistance); i++) {
            var segment = window.turf.along(geojson, i/200 * lineDistance, 'kilometers');
            arcCoords.push(segment.geometry.coordinates);
            // TODO: this might not appear like an arc for closer distance
        }
        // save to feature
        return arcCoords;
    }
});
