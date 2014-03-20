


describe("Text Controller Suite", function () {
	var textController,
	baseUrl,
	system,
	context,
	manifestExt,
	data = {},
	flag = false,
	streams,
	text,
	result,
	periodIndex,
	buffer,
	manifestObj,
	element,
	video;

	beforeEach(function () {
		baseUrl = testBaseUrl;
		periodIndex = 0;

		system = new dijon.System();
		system.mapValue("system", system);
		system.mapOutlet("system");
		context = new Dash.di.DashContext();
		system.injectInto(context);

		if (manifestRes == undefined) {
			GenerateManifestRes();
		}

		manifestExt = system.getObject("manifestExt");
		textController = system.getObject("textController");

	});

	it("Get Text Data", function () {
		waitsFor(function () {
			if (manifestRes != undefined)
				return true;
		}, "manifest", 200);

		runs(function () {
			manifestExt.getTextData(manifestRes, periodIndex).then(function (data) {
				expect(data).not.toBe(null);
			});
		});
	});

	it("Get Text Data Index", function () {
		waitsFor(function () {
			if (manifestRes != undefined)
				return true;
		}, "manifest", 200);

		runs(function () {
			manifestExt.getTextData(manifestRes, periodIndex).then(function (data) {
				manifestExt.getDataIndex(data, manifestRes, periodIndex).then(
					function (index) {
					expect(index).toEqual(2);
				});
			});
		});
	});

	it("Get Text Data Mime Type", function () {
		waitsFor(function () {
			if (manifestRes != undefined)
				return true;
		}, "manifest", 200);

		runs(function () {
			manifestExt.getTextData(manifestRes, periodIndex).then(function (data) {
				manifestExt.getMimeType(data).then(
					function (type) {
					expect(type).toContain("text");
				});
			});
		});
	});

	it("Create Source Buffer for Text Data", function () {
		var sourceBufferExt,
		mimeType = "application/mp4";
		sourceBufferExt = system.getObject("sourceBufferExt");

		var mediaSource = jasmine.createSpyObj('mediaSource', ['addSourceBuffer']),
		flag = false,
		success = function (result) {
			flag = true;
		},
		failure = function (error) {
			flag = true;
		};

		runs(function () {
			promise = sourceBufferExt.createSourceBuffer(mediaSource, mimeType);
			promise.then(success, failure);
		});
		waitsFor(function () {
			return flag;
		});

		runs(function () {
			expect(mediaSource.addSourceBuffer).toHaveBeenCalledWith(mimeType);
		});
	});

	if (window.location.href.indexOf("runner.html") > 0) {
		it("Attach Buffer for Text Data", function () {

			var sourceBufferExt,
			mediaSourceExt,
			mediaSource,
			codec = "stpp";
			sourceBufferExt = system.getObject("sourceBufferExt");
			mediaSourceExt = system.getObject("mediaSourceExt");

			mediaSourceExt.createMediaSource().then(
				function (mediaSourceResult) {

				mediaSource = mediaSourceResult;
				mediaSourceExt.attachMediaSource(mediaSource, video);
				sourceBufferExt.createSourceBuffer(mediaSource, codec).then(function (bufferResult) {

					buffer = bufferResult;
					expect(bufferResult.hasOwnProperty('initialize')).toBeTruthy();
				});
			});
		});
	}

	function initStreamData(manifestResult) {

		if (manifestResult.mpdUrl != undefined) {
			streams.setVideoModel(video);
			streams.load(manifestResult, periodIndex);
			return streams;
		}
		return streams;
	}

	function GenerateManifestRes() {
		var parser = system.getObject("parser");
		parser.parse(manifestData, testBaseUrl).then(
			function (manifest) {
			//
			manifest.mpdUrl = testUrl;

			//Contructs a Adaptation set with above segment url
			//Segment Url appends with base url and testVideoUrl is generated
			var objSubSegmentList = [],
			objSubSegmentUrl = [],
			objSegmentUrl = [],
			objSegmentList = [];
			objSubSegmentUrl.media = "mp4-main-multi-h264bl_low-1.m4s";
			objSegmentUrl.push(objSubSegmentUrl);

			objSubSegmentList.timescale = "1000";
			objSubSegmentList.duration = "10000";
			objSubSegmentList.SegmentURL = objSegmentUrl;
			objSegmentList.push(objSubSegmentList);

			var objRepresentation = [];
			var objSubRepresentation = [];
			objSubRepresentation.id = "3";
			objSubRepresentation.codec = "avc1.4d401f";
			objSubRepresentation.mimeType = "text/vtt";
			objSubRepresentation.width = "480";
			objSubRepresentation.height = "360";
			objSubRepresentation.startWithSAP = "1";
			objSubRepresentation.bandwidth = "178351";
			objSubRepresentation.SegmentList = objSegmentList;
			objSubRepresentation.SegmentList_asArray = objSegmentList;
			objRepresentation.push(objSubRepresentation);

			var objAdap = {};
			objAdap.segmentAlignment = "true";
			objAdap.maxWidth = "1920";
			objAdap.maxHeight = "1080";
			objAdap.maxFrameRate = "25";
			objAdap.par = "16:9";
			objAdap.Representation = objRepresentation;
			objAdap.Representation_asArray = objRepresentation;

			manifest.Period.AdaptationSet.push(objAdap);

			manifestRes = manifest;
		});
	}

});
