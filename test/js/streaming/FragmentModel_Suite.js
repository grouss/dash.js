describe("FragmentModel_Suite",function(){
	var system,
		context,
		requests={},
		fragmentModel,
		currentDate;
		
	beforeEach(function(){
		debugger;
		var firstByteDate,endDate;
		system = new dijon.System();
		system.mapValue("system", system);
		system.mapOutlet("system");
		context = new Dash.di.DashContext();
		system.injectInto(context);
		currentDate = new Date();
		fragmentModel = system.getObject('fragmentModel');
		
		requests.action="download";
		requests.quality = 1;
		requests.streamType="video";
		requests.type="Initialization Segment";
		requests.url = "http://dash.edgesuite.net/envivio/dashpr/clear/video4/Header.m4s";
		requests.startTime=currentDate.getTime();		
		firstByteDate=currentDate.setMinutes(currentDate.getMinutes() + 10);
		requests.firstByteDate=firstByteDate;
		currentDate = new Date();
		endDate = currentDate.setMinutes(currentDate.getMinutes() + 20);
		requests.requestEndDate=endDate;
		currentDate = new Date();
		requests.duration=currentDate.setMinutes(currentDate.getMinutes() + 15);
		currentDate = new Date();
	});
	
	it("Check if Fragment is loaded",function(){
		debugger;
		fragmentModel.addRequest(requests);		
		var res = fragmentModel.isFragmentLoadedOrPending(requests);
		expect(res).toBeTruthy();		
	});
	
	it("Pending Requests",function(){
		fragmentModel.addRequest(requests);		
		var res = fragmentModel.getPendingRequests();
		expect(res[0] === requests).toBeTruthy();		
	});
	
	it("Loadings Requests",function(){
		var onLoadingStart = function(){return true};
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);		
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.getLoadingRequests();	
		expect(res[0] === requests).toBeTruthy();
	});
	
	it("Load the request and check the status",function(){
		var onLoadingStart = function(){return true};
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);		
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.isFragmentLoadedOrPending(requests);
		expect(res).toBeTruthy();	
	});
	
	it("Different Request Action",function(){
		requests.action = "";
		fragmentModel.addRequest(requests);		
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.isFragmentLoadedOrPending(requests);
		expect(res).not.toBeTruthy();		
	});
	
	it("Get Loading Time for the request",function(){
		var onLoadingStart = function(){return true};		
		var currentDate = new Date();
		
		requests.action="complete";		
		requests.firstByteDate=currentDate;
		
		var endDate =new Date();
		requests.requestEndDate=(endDate.setMinutes(endDate.getMinutes() + 10)) ? endDate : null;
	
		
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.getLoadingTime();
		expect(res).not.toEqual(0);		
	});
	
	it("Get Executed Request based on time",function(){
		var onLoadingStart = function(){return true},executeReqTime=currentDate.setMinutes(currentDate.getMinutes() + 10);
		requests.action="complete";
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.getExecutedRequestForTime(executeReqTime);
		expect(res === requests).toBeTruthy();		
	});
	
	it("Check Fragment Model Status",function(){
		var bufferController = system.getObject('bufferController');
		fragmentModel.setContext(bufferController);
		var res = fragmentModel.isReady();
		expect(res).toBeFalsy();		
	});
	
	it("Check if request is loaded or not",function(){
		debugger;
		var onLoadingStart = function(){return true},executeReqTime=currentDate.setMinutes(currentDate.getMinutes() + 10);
		requests.action="complete";
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);
		fragmentModel.executeCurrentRequest();
		var res = fragmentModel.isFragmentLoadedOrPending(requests);
		expect(res).toBeTruthy();		
	});	
	 	
	it("Remove Executed Requests",function(){
		debugger;
		var onLoadingStart = function(){return true};
		
		fragmentModel.addRequest(requests);		
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);
		fragmentModel.executeCurrentRequest();
		fragmentModel.removeExecutedRequest(requests);
		var res = fragmentModel.getLoadingTime();
		expect(res).toEqual(0);		
	}); 
	
	it("Remove Executed Requests for the given time",function(){
		var onLoadingStart = function(){return true},executeReqTime=currentDate.setMinutes(currentDate.getMinutes() + 10);;
		requests.action="complete";
		fragmentModel.addRequest(requests);		
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);
		fragmentModel.executeCurrentRequest();
		fragmentModel.removeExecutedRequestsBeforeTime(executeReqTime);
		var res = fragmentModel.getLoadingTime();
		expect(res).toEqual(0);		
	}); 
	
	it("Cancel pending requests",function(){
		debugger;
		fragmentModel.addRequest(requests);	
		fragmentModel.cancelPendingRequests();
		var res = fragmentModel.getPendingRequests();
		expect(res.length === 0).toBeTruthy();
	});
	
	it("Abort existing requests",function(){
		debugger;
		var onLoadingStart = function(){return true};
		
		fragmentModel.addRequest(requests);	
		fragmentModel.setCallbacks(onLoadingStart,onLoadingStart,onLoadingStart,onLoadingStart);		
		fragmentModel.executeCurrentRequest();
		fragmentModel.abortRequests();
		var res = fragmentModel.getLoadingRequests();
		expect(res.length === 0).toBeTruthy();
	});
});