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
        <div className="text-xl">
            <p className="stopwatch-time">
                {props.timer.minutes.toString().padStart(2, "0")}:
                {props.timer.seconds.toString().padStart(2, "0")}
            </p>
        </div>
    );
};

export default DarkboardTimer;
