// The copyright in this software is being made available under the BSD License, included below. This software may be subject to other third party and contributor rights, including patent rights, and no such rights are granted under this license.
//
// Copyright (c) 2013, Microsoft Open Technologies, Inc.
//
// All rights reserved.
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//     -             Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//     -             Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//     -             Neither the name of the Microsoft Open Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

//This file contains valid MPD strings


var testUrl, testBaseUrl, testVideoUrl, parser, manifestData, manifestRes, server, context, system, isActual = true;
var mock, fakeServer;
var invalidSource = "http://127.0.0.1:3000/test/js/utils/hostedFiles/Manifestg.mpd";
var segmentSource, source;
var unfakedUrl = "http://dash.edgesuite.net/dash264/TestCases/1a/netflix/exMPD_BIP_TC1.mpd";

testUrl = "http://sampleurl/test.mpd";
testBaseUrl = "http://sampleurl/";
testVideoUrl = "http://sampleurl/video1/Header.m4s";

setTimeout(initialize, 10);

function Isloaded() {
	if (isActual) {

		//This funciton makes actual call with live url once
		ActualRequest();
		isActual = false;

	}
}

//Function to get response from live url
//Assigns the live response to fake server with appropriate urls
function ActualRequest() {
	//Base url to get the manifest data
	source = "http://dash.edgesuite.net/envivio/dashpr/clear/Manifest.mpd";

	//Segment url from different mpd - will be changed later when we get a sample mpd with segment url and mpd size being small
	segmentSource = "http://dash.edgesuite.net/envivio/dashpr/clear/video5/24.m4s";

	var reqStatus,
	reqStatus = callRequest(source);

	if (reqStatus) {
		manifestData = reqStatus.responseText;
	}

}

//Method to make call to live server
function callRequest(url) {
	var xmlhr;

	if (window.XMLHttpRequest) {
		xmlhr = new XMLHttpRequest();
	} else {
		xmlhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (url === segmentSource) {
		xmlhr.open("GET", url, true);
		xmlhr.responseType = "arraybuffer";
		xmlhr.onload = function () {
			if (xmlhr.readyState === 4)
				return xmlhr;
		};
	} else {
		xmlhr.open("GET", url, false);
	}
	xmlhr.send();
	return xmlhr;
}

function initialize() {
	Isloaded();
}
