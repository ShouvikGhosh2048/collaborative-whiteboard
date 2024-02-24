import { useEffect, useRef } from "react";

export interface Line {
    endpoints: [[number, number], [number, number]];
    color: string,
    size: number,
}

interface CanvasProps {
    brushSize: number;
    brushColor: string;
    lines: Line[];
    socket: WebSocket;
    cursors: [number, number][];
}

export default function Canvas({ brushSize, brushColor, lines, socket, cursors }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;

        const draw = () => {
            // Get canvas and perform scaling to prevent blurriness.
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
            const ctx = canvas.getContext('2d')!;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;
            const midpointX = width/2;
            const midpointY = height/2;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);

            lines.forEach(({ endpoints, color, size }) => {
                ctx.lineWidth = size;
                ctx.strokeStyle = color;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(midpointX + endpoints[0][0], midpointY + endpoints[0][1]);
                ctx.lineTo(midpointX + endpoints[1][0], midpointY + endpoints[1][1]);
                ctx.stroke();
            });

            cursors.forEach(([x, y]) => {
                ctx.fillStyle = "#f97316";
                ctx.beginPath();
                ctx.arc(midpointX + x, midpointY + y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        };

        const resize = () => {
            const navbar = document.querySelector('nav')!;
            const { height: navbarHeight } = navbar.getBoundingClientRect();
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight - navbarHeight}px`;
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = (window.innerHeight - navbarHeight) * window.devicePixelRatio;
            draw();
        };

        resize();
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [lines, cursors]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        let lastDragPosition: null | [number, number] = null;

        const mouseDown = (e: MouseEvent) => {
            const canvasBoundingBox = canvas.getBoundingClientRect();
            lastDragPosition = [
                e.clientX - canvasBoundingBox.x - canvasBoundingBox.width/2,
                e.clientY - canvasBoundingBox.y - canvasBoundingBox.height/2,
            ];
        };

        const mouseMove = (e: MouseEvent) => {
            const canvasBoundingBox = canvas.getBoundingClientRect();
            const newPosition: [number, number] = [
                e.clientX - canvasBoundingBox.x - canvasBoundingBox.width/2,
                e.clientY - canvasBoundingBox.y - canvasBoundingBox.height/2,
            ];
            socket.send(JSON.stringify({
                type: "cursor",
                cursor: newPosition,
            }));

            if (!lastDragPosition) {
                return;
            }
            const endpoints: [[number, number], [number, number]] = [lastDragPosition, newPosition];
            socket.send(JSON.stringify({
                type: "line",
                line: {
                    endpoints,
                    color: brushColor,
                    size: brushSize,
                },
            }));
            lastDragPosition = newPosition;
        };

        const mouseUp = () => {
            lastDragPosition = null;
        };

        canvas.addEventListener('mousedown', mouseDown);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        return () => {
            canvas.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, [brushSize, brushColor, socket]);

    return (
        <canvas ref={canvasRef} className="w-100 h-100"/>
    );
}