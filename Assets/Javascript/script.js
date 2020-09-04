// https://momentjs.com/

$(document).ready(function () {
    var log = console.log; // for short hand when debugging
    var dir = console.dir; // for short hand when debugging
    var calendarList = [];
    var timeblocks = ["09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM",];// will try allow for this to be altered if time permits
    const today = moment();
    loadPage();

    // load/render the page
    function loadPage() {
        //sett the current day using moment
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
        //call function to render the page
        renderCalendar();
    };

    // load/render the calendar
    function renderCalendar() {
        // Get current hour
        var time = today.format('HH');
        // create new div to contain the rows and append it to the container
        var timeBlockDiv = $('<div class="time-block"></div>');
        $(".container").append(timeBlockDiv);
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
            if (tfTime < time) {
                description.addClass('past');
            }
            else if (tfTime === time) {
                description.addClass('present');
            }
            else {
                description.addClass('future');
            }
        });

        $(".saveBtn").on("click", function (event) {
            // variables for the value (description) and hour the edit is occuring on
            var value = event.target.parentNode.childNodes[1].value;
            var selectedTime = event.target.parentNode.childNodes[0].textContent;

            // block from editing past events (personal preference)
            var selection = event.target.parentNode.childNodes[1].classList[1];
            if (selection === "past") {
                alert("Can not edit a past time block");
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

            // store to local storage
            storeCalendar();
        });

        // saves the to localStorage
        function storeCalendar() {
            // Add code here to stringify the array and save it to the key in localStorage
            localStorage.setItem("calendarList", JSON.stringify(calendarList));
        }
    };

    //$('#clock').fitText(1.3);

    // function update() {
    //     $('#clock').html(moment().format('D. MMMM YYYY H:mm:ss'));
    // }

    // setInterval(update, 1000);
});