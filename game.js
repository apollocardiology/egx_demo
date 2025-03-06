{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Get the canvas and context\
const canvas = document.getElementById('gameCanvas');\
const ctx = canvas.getContext('2d');\
\
// Set canvas size\
canvas.width = 800;\
canvas.height = 400;\
\
// Game variables\
let player = \{\
    x: 100,\
    y: canvas.height / 2,\
    radius: 10,\
    speed: 3,\
    health: 100,\
    buoyancy: 100\
\};\
\
let glycocalyx = \{\
    top: 50, // Top layer height\
    bottom: canvas.height - 50, // Bottom layer position\
    damage: 10\
\};\
\
let droplets = [];\
let score = 0;\
let gameOver = false;\
\
// Keyboard input\
let keys = \{\};\
document.addEventListener('keydown', (e) => keys[e.key] = true);\
document.addEventListener('keyup', (e) => keys[e.key] = false);\
\
// Spawn droplets periodically\
function spawnDroplet() \{\
    droplets.push(\{\
        x: canvas.width,\
        y: Math.random() * (glycocalyx.bottom - glycocalyx.top - 40) + glycocalyx.top + 20,\
        radius: 5\
    \});\
\}\
\
// Update game state\
function update() \{\
    if (gameOver) return;\
\
    // Player movement\
    if (keys['ArrowUp'] && player.y - player.radius > 0) player.y -= player.speed;\
    if (keys['ArrowDown'] && player.y + player.radius < canvas.height) player.y += player.speed;\
    if (keys['ArrowLeft'] && player.x - player.radius > 0) player.x -= player.speed;\
    if (keys['ArrowRight'] && player.x + player.radius < canvas.width) player.x += player.speed;\
\
    // Buoyancy depletion\
    player.buoyancy -= 0.1;\
    if (player.buoyancy <= 0) player.buoyancy = 0;\
\
    // Check collision with glycocalyx layers\
    if (player.y - player.radius < glycocalyx.top || player.y + player.radius > glycocalyx.bottom) \{\
        player.health -= glycocalyx.damage;\
        player.y = player.y - player.radius < glycocalyx.top ? glycocalyx.top + player.radius : glycocalyx.bottom - player.radius;\
        if (player.health <= 0) \{\
            player.health = 0;\
            gameOver = true;\
        \}\
    \}\
\
    // Update droplets\
    for (let i = droplets.length - 1; i >= 0; i--) \{\
        let droplet = droplets[i];\
        droplet.x -= 2; // Move left\
\
        // Check collision with player\
        let dx = player.x - droplet.x;\
        let dy = player.y - droplet.y;\
        let distance = Math.sqrt(dx * dx + dy * dy);\
        if (distance < player.radius + droplet.radius) \{\
            score += 50;\
            player.buoyancy = Math.min(player.buoyancy + 20, 100);\
            droplets.splice(i, 1);\
        \}\
\
        // Remove droplets that go off-screen\
        if (droplet.x < -droplet.radius) \{\
            droplets.splice(i, 1);\
        \}\
    \}\
\
    // Spawn new droplets\
    if (Math.random() < 0.02) spawnDroplet();\
\
    // Update UI\
    document.getElementById('score').textContent = `Score: $\{score\}`;\
    document.getElementById('health').textContent = `Health: $\{player.health\}`;\
\}\
\
// Render the game\
function render() \{\
    // Clear canvas\
    ctx.fillStyle = '#2a2a2a';\
    ctx.fillRect(0, 0, canvas.width, canvas.height);\
\
    // Draw glycocalyx layers\
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';\
    ctx.fillRect(0, 0, canvas.width, glycocalyx.top);\
    ctx.fillRect(0, glycocalyx.bottom, canvas.width, canvas.height - glycocalyx.bottom);\
\
    // Draw player\
    ctx.beginPath();\
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);\
    ctx.fillStyle = 'gold';\
    ctx.fill();\
    ctx.closePath();\
\
    // Draw droplets\
    droplets.forEach(droplet => \{\
        ctx.beginPath();\
        ctx.arc(droplet.x, droplet.y, droplet.radius, 0, Math.PI * 2);\
        ctx.fillStyle = 'white';\
        ctx.fill();\
        ctx.closePath();\
    \});\
\
    // Game over text\
    if (gameOver) \{\
        ctx.fillStyle = 'red';\
        ctx.font = '40px Arial';\
        ctx.textAlign = 'center';\
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);\
        ctx.font = '20px Arial';\
        ctx.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 40);\
    \}\
\}\
\
// Game loop\
function gameLoop() \{\
    update();\
    render();\
    score += 1; // Increment score over time\
    requestAnimationFrame(gameLoop);\
\}\
\
// Restart game\
document.addEventListener('keydown', (e) => \{\
    if (gameOver && e.key === 'Enter') \{\
        // Reset game state\
        player.health = 100;\
        player.buoyancy = 100;\
        player.x = 100;\
        player.y = canvas.height / 2;\
        score = 0;\
        droplets = [];\
        gameOver = false;\
    \}\
\});\
\
// Start the game\
gameLoop();}