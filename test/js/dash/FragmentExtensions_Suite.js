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


describe("Fragment Extensions Test Suite", function () {
	var baseUrl,
	system,
	fragmentExtn,
	response;
	response = GetResponse();

	beforeEach(function () {

		// Set up DI.
		system = new dijon.System();
		system.mapValue("system", system);
		system.mapOutlet("system");

		context = new Dash.di.DashContext();
		system.injectInto(context);

		fragmentExtn = system.getObject("fragmentExt");
		//fakeServer.restore();

	});

	it("has method parseTFDT", function () {

		var result = (typeof fragmentExtn.parseTFDT);
		expect(result).toEqual('function');
	});

	it("has method parseSIDX", function () {

		var result = (typeof fragmentExtn.parseSIDX);
		expect(result).toEqual('function');
	});

	it("has method loadFragment", function () {
		var result = (typeof fragmentExtn.loadFragment);
		expect(result).toEqual('function');
	});

	/**
	it("loading fragments to check version",function(){
	fragmentExtn.loadFragment(segmentSource).then(function(result){
	expect(result.version).toEqual(1);
	});
	});

	it("loading fragments to check media decode time",function(){
	fragmentExtn.loadFragment(segmentSource).then(function(result){
	expect(isNaN(result.base_media_decode_time)).not.toBeTruthy();
	});
	});



	it("parsing data to check version",function(){
	waitsFor(function(){
	if (response != undefined) return true;
	},"waits for response data",500);

	if (response != undefined){
	runs(function(){
	var promise,flag = false,res,
	success = function(result) {
	res = result;
	flag = true;
	},
	failure = function(error) {
	res = error;
	flag = true;
	};
	runs(function(){

	console.info("runs" + response);
	promise = fragmentExtn.parseTFDT(response);
	promise.then(success,failure);
	});

	waitsFor(function(){
	return flag;
	},"waits for flag",100);

	runs(function(){

	expect(res.version).toEqual(1);
	});
	});
	}
	}); **/

	it("parsing data to check media decode time", function () {

		if (response != undefined) {
			var promise,
			flag = false,
			res,
			success = function (result) {
				res = result;
				flag = true;
			},
			failure = function (error) {

				res = error;
				flag = true;
			};
			runs(function () {

				promise = fragmentExtn.parseTFDT(response);
				promise.then(success, failure);
			});

			waitsFor(function () {
				return flag;
			});

			runs(function () {

				expect(isNaN(res.base_media_decode_time)).not.toBeTruthy();
			});
		}
	});

	it("parsing sidx to check earliest_presentation_time", function () {

		if (response != undefined) {
			try {
				fragmentExtn.parseSIDX(response).then(function (result) {

					expect(isNaN(result.earliest_presentation_time)).not.toBeTruthy();
				});
			} catch (e) {
				exception = e;
			}

			if (exception) {
				expect(exception).toBeDefined();
			}
		}
	});

	it("parsing sidx to check timescale", function () {

		if (response != undefined) {
			try {
				fragmentExtn.parseSIDX(response).then(function (result) {

					expect(isNaN(result.timescale)).not.toBeTruthy();
				});
			} catch (e) {
				exception = e;
			}

			if (exception) {
				expect(exception).toBeDefined();
			}
		}
	});

	function GetResponse() {
		var xmlhr = new XMLHttpRequest();
		xmlhr.open("GET", segmentSource, true);
		xmlhr.responseType = "arraybuffer";
		xmlhr.onload = function () {
			if (xmlhr.readyState === 4) {
				response = xmlhr.response;
			}
		};
		xmlhr.send();
		return response;
	}

	if (window.location.href.indexOf("runner.html") == 0) {
		describe("Fragment Extension Negative Test Suite", function () {
			it("loadFragment", function () {
				var promise = null,
				success,
				successResult,
				failure;

				flag = false;
				success = function (result) {
					successResult = result;
					flag = true;
				},
				failure = function (error) {
					flag = false;
				};
				runs(function () {
					promise = fragmentExtn.loadFragment(source);
					promise.then(success, failure);
				});

				waitsFor(function () {
					return flag;
				});

				runs(function () {
					expect(successResult).toEqual(null);
				});

			});

			it("parseSIDX", function () {
				var buffer = new ArrayBuffer(0);
				var promise = null,
				success,
				successResult,
				failure;

				flag = false;
				success = function (result) {
					successResult = result;
					flag = true;
				},
				failure = function (error) {
					flag = false;
				};
				runs(function () {
					promise = fragmentExtn.parseSIDX(buffer);
					promise.then(success, failure);
				});

				waitsFor(function () {
					return flag;
				});

				runs(function () {
					expect(successResult).toEqual(null);
				});

			});
		});
	}
});
