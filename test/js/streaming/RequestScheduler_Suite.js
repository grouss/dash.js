 describe("Request Scheduler Suite", function () {
	var context,
		obj,
		element,
		video,
		source,
		stream,
		requestScheduler,
		streamController,
		system;
		
		beforeEach(function(){
			debugger;
			system = new dijon.System();
			system.mapValue("system", system); 
			system.mapOutlet("system");
			context = new Dash.di.DashContext();
			system.injectInto(context);
			
			bufferController = system.getObject('bufferController');
			requestScheduler = system.getObject('requestScheduler');
			bufferController.setScheduler(requestScheduler);
		});
		
		it("Scheduled Status",function(){
			var onexecuteFunction = function(){return true;};
			requestScheduler.startScheduling(bufferController,onexecuteFunction);
			var result = requestScheduler.isScheduled(bufferController);
			expect(result).toBeTruthy();
		});
		
		it("Get the Execute Interval",function(){
			debugger;
			var manifestModel = system.getObject("manifestModel");	
			var onexecuteFunction = function(){return true;};			
			manifestModel.setValue(manifestRes);
			bufferController.initialize("video",0,manifestRes.Period.AdaptationSet[0],null,null,null,null,null);
			
			waitsFor(function(){
				if (bufferController.getMinBufferTime() != undefined) return true;
			},"bufferController is not initialized",100);
			runs(function(){
				debugger;
				requestScheduler.startScheduling(bufferController,onexecuteFunction);
				requestScheduler.adjustExecuteInterval();
				var result = requestScheduler.getExecuteInterval(); 
				expect(isNaN(result)).not.toBeTruthy();
			});
		});
		
		it("Stop Request Scheduling",function(){
			debugger;
			var onexecuteFunction = function(){return true;};
			requestScheduler.startScheduling(bufferController,onexecuteFunction);
			requestScheduler.stopScheduling(bufferController);
			var result = requestScheduler.getExecuteInterval(); 
			expect(isNaN(result)).toBeTruthy();
		});
		
		
});