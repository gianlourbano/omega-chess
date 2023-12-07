import { useEffect, useState } from "react";

const useStopwatch = (
    startTime: number,
    opts?: {
        backward?: boolean;
        startImmediately?: boolean;
    }
) => {
    // state to store time
    const START_TIME = startTime;

    const [time, setTime] = useState(START_TIME);

    // state to check stopwatch running or not
    const [isRunning, setIsRunning] = useState(false);
    
    useEffect(() => {
        let intervalId: any;
        if (isRunning) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTime(time - 1), 1000);
        }
        return () => clearInterval(intervalId);
    }, [isRunning, time]);

    // Minutes calculation
    const minutes = Math.floor((time) / 60);

    // Seconds calculation
    const seconds = Math.floor((time % 60));

    // Milliseconds calculation
    const milliseconds = time % 100;

    // Method to start and stop timer
    const startAndStop = () => {
        setIsRunning(!isRunning);
    };

    const start = () => {
        setIsRunning(true);
    }

    const stop = () => {
        setIsRunning(false);
    }

    // Method to reset timer back to 0
    const reset = () => {
        setTime(START_TIME);
    };
    
    const setTimer = (time: number) => {
        setTime(time);
    };

    return { minutes, seconds, milliseconds, start, stop, reset, isRunning, setTimer };
};

export default useStopwatch;
