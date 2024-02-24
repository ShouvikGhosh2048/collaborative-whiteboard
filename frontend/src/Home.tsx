import { useState } from "react";
import { useLocation } from "wouter";

function randomID() {
    let id = "";
    for (let i = 0; i < 20; i++) {
        id += Math.floor(Math.random() * 10);
    }
    return id;
}

export default function Home() {
    const [, navigate] = useLocation();
    const [whiteboardID, setWhiteboardID] = useState("");

    return (
        <div className="h-100 d-flex justify-content-center">
            <div className="d-flex flex-column gap-3 align-items-center mt-5">
                <button className="btn btn-primary" onClick={() => {
                    navigate(`/whiteboard/${randomID()}`);
                }}>Create new whiteboard</button>
                <span>or</span>
                <form className="d-flex gap-3" onSubmit={(e) => {
                    e.preventDefault();
                    navigate(`/whiteboard/${whiteboardID}`);
                }}>
                    <input placeholder="Session ID" value={whiteboardID}
                        className="px-2"
                        onChange={(e) => { setWhiteboardID(e.target.value); }} required/>
                    <button className="btn btn-primary">Join session</button>
                </form>
            </div>
        </div>
    );
}