import useStopwatch from "@/hooks/useStopwatch";

export interface Timer {
	minutes: number;
	seconds: number;
	isRunning: boolean;
	startAndStop: () => void;
	reset: () => void;
}

interface DarkboardTimerProps {
	timer: Timer;
}

const DarkboardTimer = (props: DarkboardTimerProps) => {
    return (
        <div className="stopwatch-container">
            <p className="stopwatch-time">
                {props.timer.minutes.toString().padStart(2, "0")}:
                {props.timer.seconds.toString().padStart(2, "0")}
            </p>
            <div className="stopwatch-buttons">
                <button className="stopwatch-button" onClick={props.timer.startAndStop}>
                    {props.timer.isRunning ? "Stop" : "Start"}
                </button>
                <button className="stopwatch-button" onClick={props.timer.reset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default DarkboardTimer;
