/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

module.exports = {
    id: 'browser',
    cordovaVersion: '4.2.0', // cordova-js

    bootstrap: function() {
        
        var cache = navigator.serviceWorker.register;
        var cacheCalled = false;
        navigator.serviceWorker.register = function() {
            cacheCalled = true;
            navigator.serviceWorker.register = cache;
            return cache.apply(navigator.serviceWorker,arguments);
        }

        document.addEventListener('deviceready',function(){
            if(!cacheCalled) {
                navigator.serviceWorker.register('/cordova-sw.js').then(function(registration) {
                    // Registration was successful
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, function(err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                });
            }
        });

        var modulemapper = require('cordova/modulemapper');
        var channel = require('cordova/channel');

        modulemapper.clobbers('cordova/exec/proxy', 'cordova.commandProxy');

        channel.onNativeReady.fire();

        document.addEventListener("visibilitychange", function(){
            if(document.hidden) {
                channel.onPause.fire();
            }
            else {
                channel.onResume.fire();
            }
        });

    // End of bootstrap
    }
};
