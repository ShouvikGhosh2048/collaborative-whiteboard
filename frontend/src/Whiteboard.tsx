import { useEffect, useState } from "react";
import Canvas, { Line } from "./components/Canvas";
import SaveButton from "./components/SaveButton";
import BrushColor from "./components/BrushColor";
import BrushSize from "./components/BrushSize";

interface WhiteboardProps {
    id: string;
}

type Message = {
    type: "initial",
    lines: Line[],
    cursors: [number, number][],
} | {
    type: "line",
    line: Line,
} | {
    type: "cursor",
    cursors: [number, number][],
};

export default function Whiteboard({ id }: WhiteboardProps) {
    const [lines, setLines] = useState<Line[]>([]);
    const [cursors, setCursors] = useState<[number, number][]>([]);
    const [brushColor, setBrushColor] = useState("black");
    const [brushSize, setBrushSize] = useState(10);
    const [socket, setSocket] = useState<null | WebSocket>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:6789");

        const open = () => {
            socket.send(id);
            setSocket(socket);
        };

        const message = (e: MessageEvent) => {
            const message = JSON.parse(e.data) as Message;

            if (message.type === "initial") {
                setLines(message.lines);
                setCursors(message.cursors);
            } else if (message.type === "line") {
                setLines(lines => [...lines, message.line]);
            } else if (message.type === "cursor") {
                setCursors(message.cursors);
            }
        };

        socket.addEventListener("open", open);
        socket.addEventListener("message", message);

        return () => {
            socket.close();
            setSocket(null);
        };
    }, [id]);

    if (!socket) {
        return <div></div>;
    }

    return (
        <div className="h-100 overflow-hidden position-relative">
            <div className="position-absolute px-3 w-100 top-0 start-0 bg-white">
                <div className="d-flex justify-content-between mb-2">
                    <span>ID: {id}</span>
                    <SaveButton/>
                </div>
                <div className="d-flex justify-content-between">
                    <BrushColor colors={["black", "#dc2626", "#16a34a", "#3b82f6", "white"]}
                                brushColor={brushColor} setBrushColor={setBrushColor}/>
                    <BrushSize sizes={[10, 15, 20]} brushSize={brushSize} setBrushSize={setBrushSize}/>
                </div>
            </div>
            <Canvas lines={lines} cursors={cursors} socket={socket} brushColor={brushColor} brushSize={brushSize}/>
        </div>
    );
}