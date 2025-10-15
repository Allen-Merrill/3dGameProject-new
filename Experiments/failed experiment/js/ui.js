// --- UI Elements ---
export function setupUI({ startGame, togglePause, resetGame }) {
    const startBtn = document.getElementById('start-game-btn');
    const resumeBtn = document.getElementById('resume-game-btn');
    const restartBtn = document.getElementById('restart-game-btn');

    startBtn.addEventListener('click', startGame);
    resumeBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', resetGame);
}

export function updateScoreDisplay(score) {
    const scoreEl = document.getElementById('score-display');
    scoreEl.textContent = `Score: ${score}`;
}

// Show or hide a message overlay
export function showOverlay(overlayEl, show, message = '', title = '') {
    if (show) {
        if (title && overlayEl.querySelector('h2')) overlayEl.querySelector('h2').textContent = title;
        if (message && overlayEl.querySelector('p')) overlayEl.querySelector('p').textContent = message;
        overlayEl.style.display = 'block';
        document.getElementById('ui-overlay').style.pointerEvents = 'auto';
    } else {
        overlayEl.style.display = 'none';
        document.getElementById('ui-overlay').style.pointerEvents = 'none';
    }
}

export function hideAllOverlays() {
    const overlays = [
        document.getElementById('instructions-overlay'),
        document.getElementById('pause-overlay'),
        document.getElementById('game-over-overlay')
    ];
    overlays.forEach(el => el.style.display = 'none');
    document.getElementById('ui-overlay').style.pointerEvents = 'none';
}
