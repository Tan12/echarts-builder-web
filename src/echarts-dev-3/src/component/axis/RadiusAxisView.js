define(function (require) {

    'use strict';

    var zrUtil = require('zrender/core/util');
    var vector = require('zrender/core/vector');
    var graphic = require('../../util/graphic');
    var Model = require('../../model/Model');

    var elementList = ['splitLine', 'splitArea', 'axisLine', 'axisTick', 'axisLabel'];

    require('../../echarts').extendComponentView({

        type: 'radiusAxis',

        render: function (radiusAxisModel, ecModel) {
            this.group.removeAll();
            if (!radiusAxisModel.get('show')) {
                return;
            }
            var polarModel = ecModel.getComponent('polar', radiusAxisModel.get('polarIndex'));
            var angleAxis = polarModel.coordinateSystem.getAngleAxis();
            var radiusAxis = radiusAxisModel.axis;
            var polar = polarModel.coordinateSystem;
            var ticksCoords = radiusAxis.getTicksCoords();
            var axisAngle = angleAxis.getExtent()[0];
            var radiusExtent = radiusAxis.getExtent();
            zrUtil.each(elementList, function (name) {
                if (radiusAxisModel.get(name +'.show')) {
                    this['_' + name](radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords);
                }
            }, this);
        },

        /**
         * @private
         */
        _axisLine: function (radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords) {
            var p1 = polar.coordToPoint([radiusExtent[0], axisAngle]);
            var p2 = polar.coordToPoint([radiusExtent[1], axisAngle]);
            var arc = new graphic.Line({
                shape: {
                    x1: p1[0],
                    y1: p1[1],
                    x2: p2[0],
                    y2: p2[1]
                },
                style: radiusAxisModel.getModel('axisLine.lineStyle').getLineStyle(),
                z2: 1
            });

            this.group.add(arc);
        },

        /**
         * @private
         */
        _axisTick: function (radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords) {
            var tickModel = radiusAxisModel.getModel('axisTick');

            var start = polar.coordToPoint([radiusExtent[0], axisAngle]);
            var end = polar.coordToPoint([radiusExtent[1], axisAngle]);

            var len = vector.dist(end, start);
            var direction = [
                end[1] - start[1],
                start[0] - end[0]
            ];
            vector.normalize(direction, direction);

            var p1 = [];
            var p2 = [];
            var tickLen = tickModel.get('length');
            var lines = zrUtil.map(ticksCoords, function (tickPosition) {
                // Get point on axis
                vector.lerp(p1, start, end, tickPosition / len);
                vector.scaleAndAdd(p2, p1, direction, tickLen);
                return new graphic.Line({
                    shape: {
                        x1: p1[0],
                        y1: p1[1],
                        x2: p2[0],
                        y2: p2[1]
                    }
                });
            });
            this.group.add(graphic.mergePath(
                lines, {
                    style: tickModel.getModel('lineStyle').getLineStyle(),
                    silent: true
                }
            ));
        },

        /**
         * @private
         */
        _axisLabel: function (radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords) {

            var categoryData = radiusAxisModel.get('data');

            var axis = radiusAxisModel.axis;
            var labelModel = radiusAxisModel.getModel('axisLabel');
            var axisTextStyleModel = labelModel.getModel('textStyle');
            var tickModel = radiusAxisModel.getModel('axisTick');

            var labels = radiusAxisModel.getFormattedLabels();

            var start = polar.coordToPoint([radiusExtent[0], axisAngle]);
            var end = polar.coordToPoint([radiusExtent[1], axisAngle]);

            var len = vector.dist(end, start);
            var dir = [
                end[1] - start[1],
                start[0] - end[0]
            ];
            vector.normalize(dir, dir);

            var p = [];
            var tickLen = tickModel.get('length');
            var labelMargin = labelModel.get('margin');
            var labelsPositions = axis.getLabelsCoords();
            var labelRotate = labelModel.get('rotate');

            var labelTextAlign = 'center';
            if (labelRotate) {
                labelTextAlign = labelRotate > 0 ? 'left' : 'right';
            }
            // Point to top
            if (dir[0] < -0.6) {
                labelTextAlign = 'right';
            }
            else if (dir[0] > 0.6) {
                labelTextAlign = 'left';
            }

            // FIXME Text align and text baseline when axis angle is 90 degree
            for (var i = 0; i < labelsPositions.length; i++) {
                // Get point on axis
                vector.lerp(p, start, end, labelsPositions[i] / len);
                vector.scaleAndAdd(p, p, dir, labelMargin + tickLen);

                var textStyleModel = axisTextStyleModel;
                if (categoryData && categoryData[i] && categoryData[i].textStyle) {
                    textStyleModel = new Model(
                        categoryData[i].textStyle, axisTextStyleModel
                    );
                }
                this.group.add(new graphic.Text({
                    style: {
                        x: p[0],
                        y: p[1],
                        fill: textStyleModel.get('color'),
                        text: labels[i],
                        textAlign: labelTextAlign,
                        textBaseline: dir[1] > 0.4 ? 'bottom' : (dir[1] < -0.4 ? 'top' : 'middle'),
                        textFont: textStyleModel.getFont()
                    },
                    rotation: labelRotate * Math.PI / 180,
                    origin: p.slice(),
                    silent: true
                }));
            }
        },

        /**
         * @private
         */
        _splitLine: function (radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords) {
            var splitLineModel = radiusAxisModel.getModel('splitLine');
            var lineStyleModel = splitLineModel.getModel('lineStyle');
            var lineColors = lineStyleModel.get('color');
            var lineCount = 0;

            lineColors = lineColors instanceof Array ? lineColors : [lineColors];

            var splitLines = [];

            for (var i = 0; i < ticksCoords.length; i++) {
                var colorIndex = (lineCount++) % lineColors.length;
                splitLines[colorIndex] = splitLines[colorIndex] || [];
                splitLines[colorIndex].push(new graphic.Circle({
                    shape: {
                        cx: polar.cx,
                        cy: polar.cy,
                        r: ticksCoords[i]
                    },
                    silent: true
                }));
            }

            // Simple optimization
            // Batching the lines if color are the same
            for (var i = 0; i < splitLines.length; i++) {
                this.group.add(graphic.mergePath(splitLines[i], {
                    style: zrUtil.defaults({
                        stroke: lineColors[i % lineColors.length],
                        fill: null
                    }, lineStyleModel.getLineStyle()),
                    silent: true
                }));
            }
        },

        /**
         * @private
         */
        _splitArea: function (radiusAxisModel, polar, axisAngle, radiusExtent, ticksCoords) {

            var splitAreaModel = radiusAxisModel.getModel('splitArea');
            var areaStyleModel = splitAreaModel.getModel('areaStyle');
            var areaColors = areaStyleModel.get('color');
            var lineCount = 0;

            areaColors = areaColors instanceof Array ? areaColors : [areaColors];

            var splitAreas = [];

            var prevRadius = ticksCoords[0];
            for (var i = 1; i < ticksCoords.length; i++) {
                var colorIndex = (lineCount++) % areaColors.length;
                splitAreas[colorIndex] = splitAreas[colorIndex] || [];
                splitAreas[colorIndex].push(new graphic.Sector({
                    shape: {
                        cx: polar.cx,
                        cy: polar.cy,
                        r0: prevRadius,
                        r: ticksCoords[i],
                        startAngle: 0,
                        endAngle: Math.PI * 2
                    },
                    silent: true
                }));
                prevRadius = ticksCoords[i];
            }

            // Simple optimization
            // Batching the lines if color are the same
            for (var i = 0; i < splitAreas.length; i++) {
                this.group.add(graphic.mergePath(splitAreas[i], {
                    style: zrUtil.defaults({
                        fill: areaColors[i % areaColors.length]
                    }, areaStyleModel.getAreaStyle()),
                    silent: true
                }));
            }
        }
    });
});