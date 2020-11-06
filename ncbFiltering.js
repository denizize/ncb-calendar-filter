function filterNcb(ncbCal, fullSync) {
  // get ncb calendar
  var ncbCal = CalendarApp.getCalendarById("<shared-ncb-calendar-ID>");
  // get custom ncb filtered cal
  var filteredCal = CalendarApp.getCalendarById("<your-filtered-new-calendar-ID>");
  
  // filter conditions (if you provide an array, you should create a for loop for that)
  var namesExclude = 'one-on-one meeting';
  var namesInclude = '<your-name>';
  var projectExclude = '<a-project>'; //like "vibration"
  
  var ncbEvents;
  var filteredCalEvents;
  var since = new Date();
  var until = new Date();
  var monthsLater = 4 // how many months in future to sync
  var monthsBefore = 0 // how many months in past to sync
  
  until.setMonth(since.getMonth()+monthsLater);
  since.setMonth(since.getMonth()-monthsBefore);
  
  // recruit events from both calendars
  ncbEvents = ncbCal.getEvents(since, until)
  filteredCalEvents = filteredCal.getEvents(since, until)
  
  var includedEventNumber = 0
  // if there are events recruited in ncb calendar; filter
  if (ncbEvents && ncbEvents.length > 0) {
    var add = false;
    for (var i = 0; i < ncbEvents.length; i++) {
      var event = ncbEvents[i];
      var title = event.getTitle();
      var start = event.getStartTime();
      var end = event.getEndTime();
      
      //find the last updated date for the ncb event (to see if the event is changed since the last sync)
      var updateToken = event.getLastUpdated().toString();
      
      //get the events that happen in the same date with same title in filteredCal to identify the same event
      //that was synced before (hence: oldEvent)
      var oldEvent = filteredCal.getEventsForDay(start, {search : title});
      
      Logger.log('%s, %s', oldEvent.length, oldEvent[0]);
      
      add = true
      //if one-on-one meeting but not with me; exclude
      if (title.includes(namesExclude) && !(title.includes(namesInclude))) {
        add = false;
      //if not my project; exclude
      } else if (title.includes(projectExclude)) {
        add = false;
      } 
      
      //To find how many events are included in ncbCal
      if (add) {
        includedEventNumber += 1
      }
      
      //if there is an already synced event; check description to see the last update
      if (oldEvent[0]) {
        var oldUpdateToken = oldEvent[0].getDescription();
        //if last update of the old event is the same with the found ncb event; do not add/duplicate
        //ncb event with different lastupdate will be added to filteredCal
        //IMPORTANT: This is only considering the changes in the title or time of the events and NOT DATE
        //The event with a changed date will be already added to the filteredCal and the old event is not
        //deleted in this case
        if (oldUpdateToken == updateToken) {
          add = false;
        //if last update is different delete the old event -- and later the new event will be synced bcs add=true
        } else {
          oldEvent.deleteEvent()
        }

      }
      
      //add event
      if (add) {
        console.log('Adding %s at %s', title, start);
        filteredCal.createEvent(title, start, end, {description : updateToken});
      }
    }
  
  } else {
    console.log('No events found.');
  }
  
      
  //If an event was synced before and a date change was done in ncb calendar, both will be synced to filteredCal
  //Deletion of the old event is needed.
  //get updated events of filteredCal
  var updatedEvents = filteredCal.getEvents(since, until)
  //if there are more events in filteredCal than in ncbCal; delete the remnants
  if (updatedEvents.length > includedEventNumber) {
    for (i=0; i<updatedEvents.length; i++) {
      var updatedStart = updatedEvents[i].getStartTime()
      var updatedEnd = updatedEvents[i].getEndTime()
      var updatedTitle = updatedEvents[i].getTitle()
      
      //find if the updated events are in ncbCal otherwise, delete
      var correspondingEvents = ncbCal.getEvents(updatedStart, updatedEnd, {'title':updatedTitle}) //returns array
      
      if (correspondingEvents.length == 0) {
        updatedEvents[i].deleteEvent()
        Logger.log('Deleted %s, %s', updatedTitle, updatedStart)
      }
    }
  }

}

function clearFilteredCal() {
  var filteredCal = CalendarApp.getCalendarById("<your-filtered-new-calendar-ID>")
  var startTime = new Date();
  var endTime = new Date();
  endTime.setMonth(startTime.getMonth()+4);
  Logger.log('%s',endTime)
  var events = filteredCal.getEvents(startTime, endTime);
  for (var i=0; i < events.length; i++) {
    filteredCal.getEventById(events[i].getId()).deleteEvent();
    Logger.log(events[i].getTitle())
  }
}

