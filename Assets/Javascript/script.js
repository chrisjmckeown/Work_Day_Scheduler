// https://momentjs.com/

$(document).ready(function () {
    var log = console.log; // for short hand when debugging
    var dir = console.dir; // for short hand when debugging
    var calendarList = [];
    var timeblocks = ["09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM",];// will try allow for this to be altered if time permits
    var today = moment();

    loadPage();

    // load/render the page
    function loadPage() {
        $("#date").attr("value", today.format("YYYY-MM-DD"));
        //set the current day using moment
        $("#currentDay").text(moment().format('dddd MMMM Do YYYY'));
        // Get calendarList from local storage
        var storedCalendarList = JSON.parse(localStorage.getItem("calendarList"));
        // check contents, if not null set to variable to list else if null to empty
        if (storedCalendarList !== null) {
            calendarList = storedCalendarList;
        }

        // Get timeblocks from local storage
        var storedtimeblocks = JSON.parse(localStorage.getItem("timeblocks"));
        // check contents, if not null set to variable to list else if null to empty
        if (storedtimeblocks !== null) {
            timeblocks = storedtimeblocks;
        }

        // Set the work hour number inputs
        var startTime = moment(timeblocks[0], ["h A"]).format("HH");
        var finishTime = moment(timeblocks[timeblocks.length - 1], ["h A"]).format("HH");
        $("#start-time").val(Number(startTime));
        $("#finish-time").val(Number(finishTime));

        //call function to render the page
        renderCalendar();
    };

    // saving the edited data
    // The below worked until I was dynamically removing and adding information to the container
    // $(".saveBtn").on('click', function (event) {
    // Delegation. Event delegation refers to the process of using event propagation (bubbling) to handle events at a higher level in the DOM than the element on which the event originated. It allows us to attach a single event listener for elements that exist now or in the future.
    // The above is from https://learn.jquery.com/events/event-delegation/ I need too research more into this
    $(document.body).on('click', '.saveBtn', function (event) {
        // variables for the value (description) and hour the edit is occuring on
        var value = event.target.parentNode.childNodes[1].value;
        var selectedTime = event.target.parentNode.childNodes[0].textContent;

        // block from editing past events (personal preference)
        var selection = event.target.parentNode.childNodes[1].classList[1];
        if (selection === "past") {
            $("#feedback").html("Can not edit a past time block");
            return;
        }

        // convert timeblock time from 09 AM to 24 hour time only
        var hourTime = moment(selectedTime, ["h A"]).format("HH");
        // create a time for the hour edit is occuring on
        var timeStamp = today.set("hour", hourTime).format("DD MM YYYY HH");

        // create the object
        var timeblock = {
            datetime: timeStamp,
            hour: today.format("HH"),
            description: value,
        };

        // see if an existing entry exists
        var foundTimeblock = calendarList.find(x => x.datetime === timeblock.datetime);
        // if found then update the existing, else create an new
        if (foundTimeblock === undefined) {
            // Add new to the array, clear the input
            calendarList.push(timeblock);
        }
        else {
            // update existing item
            foundTimeblock.description = value;
        }
        $("#feedback").html("Edit complete. Description: " + value + " added to timeblock: " + today.set("hour", hourTime).format("DD MM YYYY hh A"));
        // store to local storage
        storeCalendar();
    });

    // saves the to localStorage
    function storeCalendar() {
        // Add code here to stringify the array and save it to the key in localStorage
        localStorage.setItem("calendarList", JSON.stringify(calendarList));
    }

    // load/render the calendar
    function renderCalendar() {
        $("#container").empty();
        // Get current hour
        var currentTime = moment().format('DD MM YYYY HH');
        // create new div to contain the rows and append it to the container
        var timeBlockDiv = $('<div class="time-block"></div>');
        $("#container").append(timeBlockDiv);
        // loop through each timeBlocks to render the page
        timeblocks.forEach(function (timeblock) {
            // convert timeblock time from 09 AM to 24 hour time only
            var tfTime = moment(timeblock, ["h A"]).format("HH");
            // create a time for current hour in the loop
            var timeStamp = today.set("hour", tfTime).format("DD MM YYYY HH");

            // create the div for row then add the hour, description and button to the row
            // new the row and description so decleared as variables
            var row = $('<div class="row"></div>');
            timeBlockDiv.append(row);
            row.append($('<div class="hour">' + timeblock + '</div>'));
            var description = $('<textarea class="description"></textarea>');
            row.append(description);
            row.append($('<div class="saveBtn">Edit</div>'));

            // if the calender list contains a recording on at this date and time set the desciption
            var foundTimeblock = calendarList.find(x => x.datetime === timeStamp);
            if (foundTimeblock !== undefined) {
                description.text(foundTimeblock.description);
            }

            // color the timeblock depending on where the time falls
            if (timeStamp < currentTime) {
                description.addClass('past');
            }
            else if (timeStamp === currentTime) {
                description.addClass('present');
            }
            else {
                description.addClass('future');
            }
        });
    };

    // Update the today variable to the selected date and load the page
    $("#date").on("change", function () {
        event.preventDefault();
        today = moment(event.target.value);
        renderCalendar();
    })

    // Update the today variable to the selected date and load the page
    $("#work-hours-btn").on("click", function () {
        event.preventDefault();
        var startTime = parseInt(event.target.parentNode[0].value);
        var finishTime = parseInt(event.target.parentNode[1].value);
        if (startTime >= finishTime) {
            alert("Start time must be before the finish time");
            return
        }
        timeblocks = [];
        for (var i = startTime; i < finishTime + 1; i++) {
            timeblocks.push(moment(i,["HH"]).format("hh A"));
        }
        storeTimeblocks();
        renderCalendar();
    })

    // saves the to localStorage
    function storeTimeblocks() {
        // Add code here to stringify the array and save it to the key in localStorage
        localStorage.setItem("timeblocks", JSON.stringify(timeblocks));
    }
});