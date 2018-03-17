import Controller from '@ember/controller';
import { cloneDeep } from 'lodash';
import turf, { featureReduce } from "@turf/turf";

export default Controller.extend({

    markers: {
        type: 'FeatureCollection',
        features: []
    },

    arcs: {
        type: 'FeatureCollection',
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [-122.414, 37.776],
                        [-77.032, 38.913]
                    ]
                }
            }
        ]
    },

    actions: {
        mapClicked({ target: map, point }) {
            // append a new point on map
            this._appendPoint(map.unproject(point));
            // and connect the previous point with an arc
            if (this.get('markers.features').length > 0) {
                this._appendArc(this._getPreviousCoord(), point);
            }
        }
    },

    /**
     * Helper functions
     */
    _appendPoint(point) {
        let markers = cloneDeep(this.get('markers'));
        markers.features.pushObject({
            type: 'Feature',
            geometry: { 
                type: 'Point', 
                coordinates: [ point.lng, point.lat ] 
            }
        });
        this.set('markers', markers);
    },

    _getPreviousCoord() {
        let features = this.get('markers.features');
        let coords = {
            lng: features[features.length - 1][0],
            lat: features[features.length - 1][1]
        };
        return coords;
    },

    _appendArc(origin, destination) {
        let arcs = cloneDeep(this.get('arcs'));
        let coordinates = this._calculateArcSegments(orgin, destination);
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
        var lineDistance = turf.lineDistance(this.arcs.features[0], 'kilometers');
        // construct line segments
        for (var i = 0; i < lineDistance; i++) {
            var segment = turf.along(route.features[0], i / 1000 * lineDistance, 'kilometers');
            arcCoords.push(segment.geometry.coordinates);
        }
        // save to feature
        return arcCoords;
    }
});
