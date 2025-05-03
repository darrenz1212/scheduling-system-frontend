import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PropTypes from "prop-types";
import Swal from "sweetalert2";


const dayMapping = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
};
const convertToFixedTimetable = (events) => {
    const referenceMonday = new Date("2024-01-01");

    return events.map((event) => {
        const [day, time] = event.start.split("T");
        const dayNumber = dayMapping[day.toLowerCase()];

        if (dayNumber === undefined) {
            console.error(`Invalid day: ${day}`);
            return null;
        }

        const eventDate = new Date(referenceMonday);
        eventDate.setDate(referenceMonday.getDate() + (dayNumber - 1));
        const formattedDate = eventDate.toISOString().split("T")[0];

        const convertedEvent = {
            id: event.id,
            title: event.title,
            start: `${formattedDate}T${time}`,
            end: event.end ? `${formattedDate}T${event.end.split("T")[1]}` : undefined,
            color: event.color || "bg-gray-500",
            meta: event.meta
        };



        return convertedEvent;
    }).filter(event => event !== null);
};




const FullCalendarWrapper = ({ events, handleEventClick,editable = false,eventClassNames  }) => {
    const formattedEvents = convertToFixedTimetable(events);
    const fullCalendarProps = {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: "timeGridWeek",
        headerToolbar: false,
        allDaySlot: false,
        slotMinTime: "07:00:00",
        slotMaxTime: "22:00:00",
        nowIndicator: false,
        selectable: true,
        editable: editable,
        weekends: false,
        events: formattedEvents,
        height: 600,
        validRange: {
            start: "2024-01-01",
            end: "2024-01-06",
        },
        dayHeaderContent: (arg) =>
            arg.date.toLocaleDateString("en-US", { weekday: "long" }),
        initialDate: "2024-01-01",
        slotLabelFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        },
        eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        },
    };

    if (handleEventClick) {
        fullCalendarProps.eventClick = handleEventClick;
    }

    if (eventClassNames) {
        fullCalendarProps.eventClassNames = eventClassNames;
    }


    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <FullCalendar {...fullCalendarProps} />
        </div>
    );
};

FullCalendarWrapper.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string,
        })
    ).isRequired,
};

export default FullCalendarWrapper;
