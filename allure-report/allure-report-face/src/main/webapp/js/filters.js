/*global angular*/
angular.module('allure.filters', [])
    .filter('interpolate', ['version', function (version) {
        'use strict';
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .constant('d3', window.d3)
    .filter('d3time', function(d3) {
        function getTotalHours(time) {
            return Math.floor(time.valueOf()/(3600*1000));
        }
        var formats =[
            [function(date) {return getTotalHours(date)+'h';}, getTotalHours],
            [d3.time.format.utc("%-Mm"), function(d) { return d.getUTCMinutes(); }],
            [d3.time.format.utc("%-Ss"), function(d) { return d.getUTCSeconds(); }],
            [d3.time.format.utc("%-Lms"), function(d) { return d.getUTCMilliseconds(); }]
        ];
        return function(time) {
            if(time.valueOf() === 0) {
                return "0";
            }
            var i = formats.length - 1,
                format = formats[i];
            while (!format[1](time)) {
                i--;
                format = formats[i];
            }
            return format[0](time);
        }
    })
    .filter('time', function() {
        'use strict';
        function getTotalHours(time) {
            return Math.floor(time.valueOf()/(3600*1000));
        }
        return function(timeInt) {
            if(!timeInt) {
                return '0';
            }
            var time = new Date(timeInt),
                val = {
                    hours: getTotalHours(time),
                    minutes: time.getUTCMinutes(),
                    seconds: time.getUTCSeconds(),
                    milliseconds: time.getUTCMilliseconds()
                },
                result = [];
            if(val.hours > 0) {
                result.push(val.hours + 'h');
            }
            if(val.hours > 0 || val.minutes > 0) {
                result.push(val.minutes + 'm');
            }
            if(result.length < 2 && (val.minutes > 0 || val.seconds > 0)) {
                result.push(val.seconds + 's');
            }
            if(result.length < 2 && val.milliseconds > 0) {
                result.push(val.milliseconds + 'ms');
            }
            return result.join(' ');
        };
    });
