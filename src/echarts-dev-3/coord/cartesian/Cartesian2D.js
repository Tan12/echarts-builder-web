define(function(require) {

    'use strict';

    var zrUtil = require('zrender/core/util');
    var Cartesian = require('./Cartesian');

    function Cartesian2D(name) {

        Cartesian.call(this, name);

        /**
         * @param {Array.<string>}
         * @readOnly
         */
        this.dimensions = ['x', 'y'];
    }

    Cartesian2D.prototype = {

        constructor: Cartesian2D,

        type: 'cartesian2d',

        /**
         * Base axis will be used on stacking.
         *
         * @return {module:echarts/coord/cartesian/Axis2D}
         */
        getBaseAxis: function () {
            return this.getAxesByScale('ordinal')[0]
                || this.getAxesByScale('time')[0]
                || this.getAxis('x');
        },

        /**
         * If contain point
         * @param {Array.<number>} point
         * @return {boolean}
         */
        containPoint: function (point) {
            return this.getAxis('x').contain(point[0])
                && this.getAxis('y').contain(point[1]);
        },

        /**
         * If contain data
         * @param {Array.<number>} data
         * @return {boolean}
         */
        containData: function (data) {
            return this.getAxis('x').containData(data[0])
                && this.getAxis('y').containData(data[1]);
        },

        /**
         * Convert series data to an array of points
         * @param {module:echarts/data/List} data
         * @param {boolean} stack
         * @return {Array}
         *  Return array of points. For example:
         *  `[[10, 10], [20, 20], [30, 30]]`
         */
        dataToPoints: function (data, stack) {
            return data.mapArray(['x', 'y'], function (x, y) {
                return this.dataToPoint([x, y]);
            }, stack, this);
        },

        /**
         * @param {Array.<number>} data
         * @param {boolean} [clamp=false]
         * @return {Array.<number>}
         */
        dataToPoint: function (data, clamp) {
            return [
                this.getAxis('x').dataToCoord(data[0], clamp),
                this.getAxis('y').dataToCoord(data[1], clamp)
            ];
        },

        /**
         * @param {Array.<number>} point
         * @param {boolean} [clamp=false]
         * @return {Array.<number>}
         */
        pointToData: function (point, clamp) {
            return [
                this.getAxis('x').coordToData(point[0], clamp),
                this.getAxis('y').coordToData(point[1], clamp)
            ];
        },

        /**
         * Get other axis
         * @param {module:echarts/coord/cartesian/Axis2D} axis
         */
        getOtherAxis: function (axis) {
            return this.getAxis(axis.dim === 'x' ? 'y' : 'x');
        }
    };

    zrUtil.inherits(Cartesian2D, Cartesian);

    return Cartesian2D;
});