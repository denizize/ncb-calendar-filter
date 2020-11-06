## Filtering Google Script for ncb Calendar
This script gathers events from a shared calendar (for me it is ncb calendar), filters them and copies them into a private calendar.
**Steps for decluttering the events in the shared google calendar:**
 - Create a calendar of your own in google calendars into which you will fetch events from shared ncb calendar
 - Get the id of your own calendar and place it in the field `<your-filtered-new-calendar-ID>` in both functions
 - Get the id of the shared ncb calendar and place it in the field `<shared-ncb-calendar-ID>` in both functions
 - Change the placer `<your-name>` with your name (it is the `namesInclude` variable
 - Go to https://www.google.com/script/start/ and login
 - Copy the script you have and run the `filterNcb` function, voilà!

###What more...

You can select the period you want to get the events by `monthsBefore` and `monthsLater` which is the number of months before and after the current date.

The variable `namesExclude` is set to 'one-on-one meeting' since we had many events with this common word ensemble plus the name of the participant. What happens there is, the script filters out all the events with this common wordkey `namesExclude` but not the ones which also includes `<your-name>`. As a result, the new calendar will have 'one-on-one meeting <your-name>'.

You can also exclude the events for different projects with the variable `projectExclude`.

There is also a function called `clearFilteredCal`, in case you want to clear all events in the filtered calendar for a fresh start during tinkering with the code.
