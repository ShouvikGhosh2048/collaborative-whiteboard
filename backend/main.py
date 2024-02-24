import asyncio
import websockets
import json

class Whiteboard:
    def __init__(self):
        self.lines = []
        self.cursors = {} # Dictionary from user to cursor.

whiteboards = {}

async def handle_websocket(websocket):
    global whiteboards

    # Get the whiteboard id.
    try:
        id = await websocket.recv()
    except:
        return

    if id not in whiteboards:
        whiteboards[id] = Whiteboard()
    whiteboard = whiteboards[id]
    whiteboard.cursors[websocket] = [0, 0]

    # We will only send the other cursors.
    def other_cursors(socket):
        return list([whiteboard.cursors[s] for s in whiteboard.cursors.keys() if s != socket])

    try:
        # Send initial state.
        await websocket.send(
            json.dumps({
                "type": "initial",
                "lines": whiteboard.lines,
                "cursors": other_cursors(websocket)
            })
        )

        async for message in websocket:
            event = json.loads(message)
            # A socket either sends:
            # - A line event with a new line.
            # - A cursor event with a new cursor position.
            if event["type"] == "line":
                whiteboard.lines.append(event["line"])
                for socket in whiteboard.cursors.keys():
                    await socket.send(json.dumps(event))
            elif event["type"] == "cursor":
                whiteboard.cursors[websocket] = event["cursor"]
                for socket in whiteboard.cursors.keys():
                    await socket.send(
                        json.dumps({
                            "type": "cursor",
                            "cursors": other_cursors(socket),
                        })
                    )
    finally:
        # Remove user and delete whiteboard if no members are left.
        if id in whiteboards:
            del whiteboards[id].cursors[websocket]

            if len (whiteboards[id].cursors) == 0:
                del whiteboards[id]
            else:
                for socket in whiteboard.cursors.keys():
                    await socket.send(
                        json.dumps({
                            "type": "cursor",
                            "cursors": other_cursors(socket),
                        })
                    )


async def main():
    async with websockets.serve(handle_websocket, "localhost", 6789):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())