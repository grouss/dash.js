describe("Text VTT Source Buffer Suite", function () {
	var textVTTSourceBuffer,
	context,
	system,
	bufferController,
	videoModel,
	element,
	video,
	result,
	bufferController,
	ManifestLoader,
	manifestObj;

	beforeEach(function () {

		system = new dijon.System();
		system.mapValue("system", system);
		system.mapOutlet("system");
		context = new Dash.di.DashContext();
		system.injectInto(context);

		ManifestLoader = system.getObject('manifestLoader');
		textVTTSourceBuffer = system.getObject('textVTTSourceBuffer');
		bufferController = system.getObject('bufferController');

		element = document.createElement('video');
		$(element).autoplay = true;
		video = system.getObject("videoModel");
		video.setElement($(element)[0]);
		bufferController.setVideoModel(video);

	});

	it("Check Parser type with default mime type", function () {
		//bufferController.setData(manifestRes.Period.AdaptationSet[0]);
		textVTTSourceBuffer.initialize("text/vtt", bufferController);
		result = textVTTSourceBuffer.getParser();
		expect(result).not.toBe(null);
	});

	it("Check Parser type with different mime type", function () {
		//bufferController.setData(manifestRes.Period.AdaptationSet[0]);
		textVTTSourceBuffer.initialize("text", bufferController);
		result = textVTTSourceBuffer.getParser();
		expect(result).not.toBeDefined();
	});

	it("Check Parser type", function () {
		//bufferController.setData(manifestRes.Period.AdaptationSet[0]);
		textVTTSourceBuffer.initialize("text/vtt", bufferController);
		result = textVTTSourceBuffer.getParser();
		expect(result).toEqual(system.getObject('vttParser'));
	});

	it("Check TextTrackExtensions Object Value", function () {

		var textVTTSourceBuffer = system.getObject('textVTTSourceBuffer');
		var result = textVTTSourceBuffer.getTextTrackExtensions();
		expect(result).toBeDefined();
		expect(result).toEqual(system.getObject("textTrackExtensions"));
	});
});
