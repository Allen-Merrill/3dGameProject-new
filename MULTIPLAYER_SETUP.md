# Multiplayer Tower Defense - Setup Guide

## 🎮 What We Built

Your tower defense game is now fully multiplayer! Players can join together to defend the castle cooperatively with:
- **Shared gold pool** - All players spend from the same gold
- **Ready-up system** - Vote to start each wave
- **Real-time sync** - See other players move, place towers together
- **Shared castle** - Everyone wins or loses together

---

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
cd 3dGameProject
npm install
```

### 2. **Start the Server**
```bash
node server.js
```

You should see:
```
Server running on http://localhost:3000
Players can connect to start playing!
```

### 3. **Open the Game**
- Open your browser to `http://localhost:3000`
- Click **"Join Multiplayer Game"**
- Click **"Connect"** (default: `http://localhost:3000`)

### 4. **Test with Multiple Players**
- Open multiple browser tabs or windows
- Each tab is a different player
- All players will see each other as colored capsules
- Everyone shares gold and must ready up to start waves

---

## 🎯 How to Play Multiplayer

### **Starting a Wave:**
1. All players click the **"Ready"** button
2. Button shows: `Ready (2/3)` = 2 out of 3 players ready
3. When ALL players ready → wave auto-starts
4. Ready resets after each wave

### **Placing Towers:**
- Any player can place towers anywhere
- Gold is deducted from shared pool
- All players see the tower appear instantly

### **Moving Around:**
- Your position syncs every 50ms
- Other players see you as colored capsules
- Labels show player IDs above capsules

### **Winning/Losing:**
- If castle health reaches 0 → everyone loses
- Complete wave 20 (or endless mode) → everyone wins

---

## 📁 Files We Created/Modified

### **New Files:**
- `package.json` - Node.js dependencies
- `server.js` - Multiplayer server with Socket.io
- `server/gameState.js` - Server-side game state manager
- `game/multiplayerClient.js` - Client-side multiplayer manager
- `.gitignore` - Excludes node_modules from git
- `MULTIPLAYER_INTEGRATION.md` - Technical details

### **Modified Files:**
- `index.html` - Added Socket.io CDN, multiplayer menu, connection status
- `style.css` - Added multiplayer UI styles
- `main.js` - Integrated multiplayer client, menu buttons, callbacks

---

## 🔧 Server Configuration

### **Change Server Port:**
Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your port
```

### **Connect to Remote Server:**
In the game menu, enter the server URL:
```
http://your-server-ip:3000
```

Or edit default in `index.html`:
```html
<input ... value="http://localhost:3000">
```

---

## 🐛 Troubleshooting

### **"Failed to connect to multiplayer server"**
**Cause:** Server not running or wrong URL  
**Fix:**
1. Check server is running: `node server.js`
2. Verify port 3000 is available
3. Check firewall settings
4. Try `http://localhost:3000` in browser - should load game

### **"Can't see other players"**
**Cause:** Client not receiving player updates  
**Fix:**
1. Check browser console for errors (F12)
2. Verify Socket.io loaded: look for socket.io.js in Network tab
3. Check server logs for "Player connected: [id]"

### **"Tower placement not working"**
**Cause:** Server validation failing or connection issue  
**Fix:**
1. Check if you have enough gold
2. Verify placement position is valid (not on path)
3. Check server console for "Tower placed" messages
4. Ensure connected (check status indicator)

### **"Gold not syncing"**
**Cause:** Event handlers not working  
**Fix:**
1. Check browser console for JavaScript errors
2. Verify `onGoldUpdate` callback is set
3. Server should broadcast `goldUpdate` events
4. All clients should update simultaneously

---

## 🎨 Customization

### **Add More Player Colors:**
Edit `server/gameState.js`:
```javascript
this.availableColors = [
  0xff0000, // Red
  0x0000ff, // Blue
  0x00ff00, // Green
  0xffff00, // Yellow
  0xff00ff, // Magenta
  0x00ffff, // Cyan
  0xffa500, // Orange
  0x800080, // Purple
  0x00ff7f, // Add more colors here!
];
```

### **Change Starting Gold:**
Edit `server/gameState.js`:
```javascript
this.gold = 100; // Change to any amount
```

### **Adjust Position Update Rate:**
Edit `main.js`:
```javascript
const POSITION_UPDATE_INTERVAL = 50; // ms (lower = more frequent)
```

---

## 🌐 Deploying to Production

### **Option 1: Local Network (LAN Party)**
1. Start server: `node server.js`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Share URL: `http://YOUR-LOCAL-IP:3000`
4. Friends on same network can connect

### **Option 2: Cloud Hosting (Heroku, Render, etc.)**
1. Push code to GitHub
2. Connect to hosting service
3. Set environment variable: `PORT`
4. Deploy!
5. Share public URL to friends

**Example Heroku Deployment:**
```bash
heroku create your-game-name
git push heroku main
heroku open
```

---

## 📊 Server Events Reference

### **Client → Server Events:**
- `playerMove` - Player moved
- `placeTower` - Request to place tower
- `toggleReady` - Toggle ready status
- `enemySpawned` - Enemy spawned (for sync)
- `enemyDied` - Enemy killed
- `castleDamaged` - Castle took damage

### **Server → Client Events:**
- `init` - Initial game state on connect
- `playerJoined` - New player connected
- `playerLeft` - Player disconnected
- `playerMoved` - Other player moved
- `towerPlaced` - Tower successfully placed
- `goldUpdate` - Gold amount changed
- `castleHealthUpdate` - Castle health changed
- `roundStarted` - All players ready, wave starting
- `readyStatusChanged` - Player ready status updated
- `gameOver` - Castle destroyed

---

## 🎓 Next Steps / Enhancements

Want to add more features? Here are ideas:

### **Easy:**
- [ ] Add chat system (already has `chatMessage` events!)
- [ ] Show player names instead of IDs
- [ ] Add sound effects for multiplayer events
- [ ] Player count display

### **Medium:**
- [ ] Enemy synchronization (host spawns, others see)
- [ ] Tower upgrade sync
- [ ] Player respawn system
- [ ] Spectator mode for dead players

### **Advanced:**
- [ ] Room system (multiple games on one server)
- [ ] Player authentication
- [ ] Leaderboards and stats
- [ ] Replay system

---

## 📝 Testing Checklist

Before sharing with friends, test:

- [ ] Server starts without errors
- [ ] Can connect from browser
- [ ] Multiple tabs can join simultaneously
- [ ] Players see each other (colored capsules)
- [ ] Shared gold updates correctly
- [ ] Tower placement works for all players
- [ ] Ready system requires all players
- [ ] Wave starts when all ready
- [ ] Castle health syncs
- [ ] Game over triggers for all players
- [ ] Disconnection handled gracefully

---

## 💡 Tips for Playing

1. **Communicate:** Use voice chat (Discord) for coordination
2. **Specialize:** One player focuses on economy, others on combat
3. **Ready Timing:** Don't ready up until everyone is prepared
4. **Tower Placement:** Coordinate who builds where
5. **Watch Gold:** Don't overspend - everyone shares the pool!

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check server terminal for error messages
3. Read `MULTIPLAYER_INTEGRATION.md` for technical details
4. Verify all files were created/modified correctly

---

## 🎉 Have Fun!

Enjoy defending the castle with your friends! The cooperative gameplay adds a whole new dimension to the tower defense experience.

**Pro Tip:** Try endless mode with a full team - how many waves can you survive together?
