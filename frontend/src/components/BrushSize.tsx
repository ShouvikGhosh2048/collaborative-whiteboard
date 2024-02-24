import { Dispatch, SetStateAction } from "react";

interface BrushSizeProps {
    brushSize: number;
    setBrushSize: Dispatch<SetStateAction<number>>;
    sizes: number[];
}

export default function BrushSize({ brushSize, setBrushSize, sizes }: BrushSizeProps) {
    return (
        <span className="d-flex gap-2">
            {sizes.map((size, i) => (
                <svg width="20" height="20" viewBox="0 0 20 20"
                    key={i} onClick={() => {setBrushSize(size);}}
                    style={{ cursor: "pointer" }}>
                    <circle cx="10" cy="10" r={size/2}
                            fill={brushSize === size ? "black" : "gray"}/>
                </svg>
            ))}
        </span>
    );
}