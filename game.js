// Variables for Tycoon Game
let tycoonMoney = 1000;
let incomePerSecond = 0;
let tycoonInterval;
let upgradeCost = 100;
let progressBarMax = 100000000000; // 100 billion

// Variables for CrashX Game
let betAmount = 0;
let multiplier = 1.0;
let crashActive = false;
let intervalId;
let timerId;

// Load saved game data
function loadGameData() {
    const savedData = JSON.parse(localStorage.getItem('tycoonCrashXGameData'));

    if (savedData) {
        tycoonMoney = savedData.tycoonMoney || 1000;
        incomePerSecond = savedData.incomePerSecond || 0;
        upgradeCost = savedData.upgradeCost || 100;
    }
}

// Save game data
function saveGameData() {
    const gameData = {
        tycoonMoney,
        incomePerSecond,
        upgradeCost,
    };
    localStorage.setItem('tycoonCrashXGameData', JSON.stringify(gameData));
}

// Update Tycoon Information
function updateTycoonInfo() {
    document.getElementById('tycoon-money').textContent = tycoonMoney.toFixed(2);
    document.getElementById('income-per-second').textContent = incomePerSecond.toFixed(2);
    document.getElementById('upgrade-cost').textContent = upgradeCost.toFixed(2);

    const progressPercent = Math.min(100, (tycoonMoney / progressBarMax) * 100);
    document.getElementById('progress-bar-fill').style.width = `${progressPercent}%`;
    document.getElementById('top-money').textContent = tycoonMoney.toFixed(2);
    document.getElementById('reward-button').style.display = tycoonMoney >= progressBarMax ? 'block' : 'none';

    saveGameData(); // Save game data after updating
}

// Start Income Interval
function startIncome() {
    tycoonInterval = setInterval(() => {
        tycoonMoney += incomePerSecond;
        updateTycoonInfo();
    }, 1000);
}

// Upgrade Function
function upgrade() {
    if (tycoonMoney >= upgradeCost) {
        tycoonMoney -= upgradeCost;
        incomePerSecond += 10; // Increase income per second by $1
        upgradeCost *= 1.1; // Increase upgrade cost
        updateTycoonInfo();
    } else {
        alert('Not enough money to upgrade.');
    }
}

// Earn Money Function
function earnMoney() {
    tycoonMoney += 10; // Increase money directly for testing
    updateTycoonInfo();
}

// Show Success Popup
function showPopup(message) {
    document.getElementById('popup-message').textContent = message;
    document.getElementById('success-popup').style.display = 'block';
}

// Close Popup
function closePopup() {
    document.getElementById('success-popup').style.display = 'none';
}

// Claim Reward
function claimReward() {
    if (tycoonMoney >= progressBarMax) {
        tycoonMoney -= progressBarMax;
        incomePerSecond += 100000000; // Increase income per second by $100,000,000
        updateTycoonInfo();
        showPopup('Congratulations! Your income per second has been increased by $100,000,000.');
    } else {
        alert('Not enough money to claim the reward.');
    }
}

// Update CrashX Info
function updateCrashInfo() {
    document.getElementById('multiplier').textContent = `${multiplier.toFixed(1)}x`;
}

// Start CrashX Game
function startCrash() {
    const betInput = document.getElementById('bet-amount');
    betAmount = parseInt(betInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Invalid bet amount.');
        return;
    }
    if (betAmount > tycoonMoney) {
        alert('Insufficient balance for this bet.');
        return;
    }

    multiplier = 1.0;
    updateCrashInfo();
    tycoonMoney -= betAmount;
    document.getElementById('bet-result').textContent = '';

    crashActive = true;
    intervalId = setInterval(updateMultiplier, 100);
    const randomTime = Math.random() * 5000 + 5000;
    timerId = setTimeout(endCrash, randomTime);
}

// Update Multiplier
function updateMultiplier() {
    if (crashActive) {
        multiplier += 0.1;
        updateCrashInfo();
    }
}

// End CrashX Game
function endCrash() {
    clearInterval(intervalId);
    crashActive = false;
    const outcome = Math.random() < 0.5 ? 'win' : 'lose';
    const earnings = outcome === 'win' ? betAmount * multiplier : 0;

    tycoonMoney += earnings;
    document.getElementById('bet-result').textContent = `You ${outcome}! Your multiplier was ${multiplier.toFixed(1)}x.`;

    if (outcome === 'lose') {
        alert(`You lost your bet. The multiplier was ${multiplier.toFixed(1)}x.`);
    } else {
        alert(`You won $${earnings.toFixed(2)}!`);
    }

    document.getElementById('bet-amount').value = '';
}

// Cash Out Function
function cashOut() {
    if (crashActive) {
        clearInterval(intervalId);
        crashActive = false;
        const earnings = betAmount * multiplier;
        tycoonMoney += earnings;
        document.getElementById('bet-result').textContent = `You cashed out! Your multiplier was ${multiplier.toFixed(1)}x.`;

        alert(`You cashed out $${earnings.toFixed(2)}!`);
        document.getElementById('bet-amount').value = '';
    } else {
        alert('You cannot cash out right now.');
    }
}

// Initialize Game
loadGameData();
startIncome();
updateTycoonInfo();
