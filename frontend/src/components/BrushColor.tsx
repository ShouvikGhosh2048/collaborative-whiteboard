import { Dispatch, SetStateAction } from "react";

interface BrushColorProps {
    brushColor: string;
    setBrushColor: Dispatch<SetStateAction<string>>;
    colors: string[],
}

export default function BrushColor({ brushColor, setBrushColor, colors }: BrushColorProps) {
    return (
        <span className="d-flex gap-2">
            {colors.map((color, i) => (
                <svg width="25" height="25" viewBox="0 0 25 25"
                    key={i} onClick={() => {setBrushColor(color);}}
                    style={{ cursor: "pointer" }}>
                    <circle cx="12.5" cy="12.5" r={ brushColor === color ? "12.5" : "10"} fill="rgb(200,200,200)"/>
                    <circle cx="12.5" cy="12.5" r={ brushColor === color ? "11.5" : "9"} fill={color}/>
                </svg>
            ))}
        </span>
    );
}