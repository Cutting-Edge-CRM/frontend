import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';


function Clock(props: any) {
    const [date, setDate] = useState('');

    useEffect(() => {
        setInterval(
          () => tick(),
          1000
        );
      })

    const tick = () => {
        if (!props.lastClock) {
            return;
        }
        let today = dayjs();
        let seconds = today.diff(dayjs(props.lastClock), 'second') % 60;
        let minutes = today.diff(dayjs(props.lastClock), 'minute') % 60;
        let hours = Math.floor(today.diff(dayjs(props.lastClock), 'hour'));
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return;
        }
        let secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`
        let minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
        let hoursString = hours < 10 ? `0${hours}` : `${hours}`
        let timeString = `- ${hoursString}:${minutesString}:${secondsString}`;
        setDate(timeString);
      }
  
      return (<>{date}</>);
  }

export default Clock;