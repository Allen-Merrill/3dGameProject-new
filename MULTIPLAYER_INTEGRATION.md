# Multiplayer Integration Guide

## What We Just Did

We integrated Socket.io multiplayer into your tower defense game! Here's a breakdown of all the changes:

### Files Created:
1. **`package.json`** - Node.js dependencies (Express, Socket.io)
2. **`server.js`** - Multiplayer server with Socket.io event handlers
3. **`server/gameState.js`** - Server-side game state manager
4. **`game/multiplayerClient.js`** - Client-side multiplayer manager
5. **`.gitignore`** - Excludes node_modules from git

### Files Modified:
1. **`main.js`** - Added multiplayer integration

---

## Key Changes in main.js

### 1. **Import Statement** (Line 8-11)
```javascript
import { MultiplayerClient } from './game/multiplayerClient.js';

let multiplayerClient = null;
let isMultiplayer = false;
let otherPlayerMeshes = new Map();
```
- Imports the multiplayer client
- Creates global variables to track multiplayer state

### 2. **buildTower() Function** (Lines ~1471-1535)
```javascript
if (isMultiplayer && multiplayerClient) {
  // Send tower placement request to server
  multiplayerClient.sendPlaceTower(typeCap, { x: worldX, y: 0.5, z: worldZ });
  return; // Server handles validation
}
```
- In multiplayer mode, sends tower placement to server instead of placing directly
- Server validates (checks gold, position) and broadcasts to all players

### 3. **createTowerFromServer()** - New function
- Creates towers when server broadcasts placement
- Used when ANY player places a tower (including you)

### 4. **initMultiplayer()** - New async function
- Connects to the server at `http://localhost:3000`
- Sets up all event callbacks (player joined, tower placed, gold update, etc.)
- Creates visual meshes for other players
- Changes "Start Round" button to "Ready" button

### 5. **Multiplayer Callbacks**
All the `multiplayerClient.on...` callbacks handle:
- **onPlayerJoined** - Creates a colored capsule mesh for new player
- **onPlayerMoved** - Updates other players' positions
- **onTowerPlaced** - Creates tower visuals when anyone builds
- **onGoldUpdate** - Syncs shared gold pool
- **onReadyStatusChanged** - Updates ready counter (e.g., "Ready 2/3")
- **onRoundStarted** - Starts wave when all players ready

### 6. **updateMultiplayerPosition()**
- Sends your position to server every 50ms
- Called in the `animate()` loop
- Other players see you move in real-time

---

## How It Works

### **Connection Flow:**
1. Player opens game → calls `initMultiplayer()`
2. Connects to server at `localhost:3000`
3. Server assigns unique ID and color
4. Server sends current game state (gold, towers, players)
5. Client creates meshes for other players

### **Tower Placement Flow:**
1. Player clicks to place tower
2. `buildTower()` checks if multiplayer mode
3. Sends `placeTower` event to server with position
4. Server validates:
   - Checks if enough gold in shared pool
   - Checks if position is valid
5. If valid:
   - Server deducts gold
   - Broadcasts `towerPlaced` to ALL players
6. All clients receive event and create tower visually

### **Ready System Flow:**
1. Player clicks "Ready" button
2. Sends `toggleReady` to server
3. Server tracks ready count
4. Broadcasts ready status: "Ready (2/3)"
5. When all players ready → server auto-starts round
6. Server broadcasts `roundStarted` to all clients

### **Shared Gold:**
- Server maintains single gold value
- Any player action (tower, kill enemy) updates server gold
- Server broadcasts new gold to all players
- Everyone's UI updates simultaneously

---

## Next Steps

You still need to:

### **1. Update `index.html`**
Add Socket.io client library before your script tags:
```html
<script src="/socket.io/socket.io.js"></script>
```

### **2. Start the Server**
```bash
node server.js
```

### **3. Enable Multiplayer in main.js**
At the very end of main.js, uncomment this line:
```javascript
initMultiplayer().catch(err => console.log('Multiplayer not available'));
```

Or add a button in HTML to let players choose single/multiplayer.

### **4. Test with Multiple Browsers**
- Start server: `node server.js`
- Open `http://localhost:3000` in 2+ browser tabs
- See other players as colored capsules
- Place towers together with shared gold!

---

## Multiplayer Features

✅ **Shared Gold Pool** - All players spend from same gold  
✅ **Tower Placement** - Anyone can place towers anywhere  
✅ **Ready System** - Vote-based round starting  
✅ **Castle Health** - Shared, if 0 = everyone loses  
✅ **Player Visualization** - See other players as colored capsules  
✅ **Real-time Position Sync** - See players move  
✅ **Toast Notifications** - "Player joined", "Tower placed", etc.

---

## How to Switch Between Single/Multiplayer

**Single-player mode (default):**
- Just don't call `initMultiplayer()`
- Game works exactly as before

**Multiplayer mode:**
- Call `initMultiplayer()` at the end of main.js
- Or add a "Join Multiplayer" button that calls it

**Example button approach:**
```html
<button id="joinMultiplayer">Join Multiplayer</button>
```

```javascript
document.getElementById('joinMultiplayer').addEventListener('click', () => {
  initMultiplayer();
});
```

---

## Troubleshooting

**"Failed to connect to multiplayer server"**
- Make sure server is running: `node server.js`
- Check console for port 3000 availability
- Try `http://localhost:3000` in browser to test

**"Tower placement not working"**
- Check browser console for errors
- Verify Socket.io CDN loaded: check `<script>` tag in HTML
- Server should log: "Tower placed by server: ..."

**"Can't see other players"**
- Check if `createOtherPlayerMesh()` is called
- Look in scene for colored capsule meshes
- Console should show: "Player joined: [id]"

**"Gold not syncing"**
- Check server logs for `goldUpdate` events
- Verify `onGoldUpdate` callback is set
- All clients should receive same gold value
