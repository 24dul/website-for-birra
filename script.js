// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Music Control
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let isPlaying = false;
    
    // Create romantic melody using Web Audio API
    let audioContext = null;
    let currentOscillator = null;
    let gainNode = null;
    let melodyInterval = null;
    
    function initAudioContext() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return true;
        } catch (error) {
            console.log('Web Audio API not supported');
            return false;
        }
    }
    
    function createRomanticMelody() {
        if (!audioContext && !initAudioContext()) {
            return false;
        }
        
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Romantic melody notes (C major scale with romantic progression)
        const melody = [
            { freq: 523.25, duration: 800 }, // C5
            { freq: 587.33, duration: 800 }, // D5
            { freq: 659.25, duration: 800 }, // E5
            { freq: 698.46, duration: 800 }, // F5
            { freq: 783.99, duration: 800 }, // G5
            { freq: 659.25, duration: 800 }, // E5
            { freq: 587.33, duration: 800 }, // D5
            { freq: 523.25, duration: 1200 } // C5 (longer)
        ];
        
        let noteIndex = 0;
        
        function playNextNote() {
            if (!isPlaying || !audioContext) return;
            
            // Stop previous oscillator
            if (currentOscillator) {
                currentOscillator.stop();
            }
            
            // Create new oscillator for this note
            currentOscillator = audioContext.createOscillator();
            gainNode = audioContext.createGain();
            
            currentOscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Set note properties
            const note = melody[noteIndex];
            currentOscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
            currentOscillator.type = 'sine';
            
            // Set volume envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration / 1000);
            
            // Start the note
            currentOscillator.start(audioContext.currentTime);
            currentOscillator.stop(audioContext.currentTime + note.duration / 1000);
            
            // Move to next note
            noteIndex = (noteIndex + 1) % melody.length;
            
            // Schedule next note
            melodyInterval = setTimeout(playNextNote, note.duration);
        }
        
        playNextNote();
        return true;
    }
    
    function stopRomanticMelody() {
        if (currentOscillator) {
            currentOscillator.stop();
            currentOscillator = null;
        }
        if (melodyInterval) {
            clearTimeout(melodyInterval);
            melodyInterval = null;
        }
    }
    
    musicToggle.addEventListener('click', function() {
        if (!isPlaying) {
            isPlaying = true;
            // Always use Web Audio API melody (more reliable)
            if (createRomanticMelody()) {
                musicToggle.classList.add('playing');
                musicIcon.textContent = '🎶';
                showSpecialMessage("Melodi cinta romantis untuk Birra tersayang! 🎵💕");
            } else {
                isPlaying = false;
                showSpecialMessage("Maaf, musik tidak dapat diputar di browser ini 😔");
            }
        } else {
            // Stop music
            isPlaying = false;
            stopRomanticMelody();
            musicToggle.classList.remove('playing');
            musicIcon.textContent = '🎵';
        }
    });
    
    // Auto-play music immediately when page loads
    function attemptAutoPlay() {
        if (!isPlaying) {
            isPlaying = true;
            if (createRomanticMelody()) {
                musicToggle.classList.add('playing');
                musicIcon.textContent = '🎶';
            } else {
                isPlaying = false;
            }
        }
    }
    
    // Try auto-play immediately
    attemptAutoPlay();
    
    // Also try after user interaction
    document.addEventListener('click', function() {
        if (!isPlaying) {
            attemptAutoPlay();
        }
    }, { once: true });
    
    // Surprise turtle functionality
    const surpriseTurtle = document.getElementById('surpriseTurtle');
    const surpriseMessage = document.getElementById('surpriseMessage');
    let surpriseShown = false;
    
    surpriseTurtle.addEventListener('click', function() {
        if (!surpriseShown) {
            surpriseMessage.classList.add('show');
            surpriseShown = true;
            
            // Add extra animation to turtle
            surpriseTurtle.style.animation = 'gentlePulse 0.5s ease-in-out 3';
            
            // Create heart explosion effect
            createHeartExplosion(surpriseTurtle);
            
            showSpecialMessage("Birra, kamu adalah cinta sejati dalam hidupku! 💕✨");
        }
    });
    
    // Heart Catching Game
    const startCatchGameBtn = document.getElementById('startCatchGame');
    const turtleCatcher = document.getElementById('turtleCatcher');
    const catchScoreDisplay = document.getElementById('catchScore');
    const gameArea = document.getElementById('heartCatchGame');
    let catchScore = 0;
    let gameRunning = false;
    let gameInterval;
    
    startCatchGameBtn.addEventListener('click', function() {
        if (!gameRunning) {
            startHeartCatchGame();
        }
    });
    
    // Move turtle catcher with mouse
    gameArea.addEventListener('mousemove', function(e) {
        if (gameRunning) {
            const rect = gameArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const maxX = gameArea.offsetWidth - 70; // turtle width
            const clampedX = Math.max(35, Math.min(x, maxX));
            turtleCatcher.style.left = clampedX + 'px';
        }
    });
    
    function startHeartCatchGame() {
        gameRunning = true;
        catchScore = 0;
        catchScoreDisplay.textContent = catchScore;
        startCatchGameBtn.textContent = 'Sedang Menangkap Cinta...';
        startCatchGameBtn.disabled = true;
        
        gameInterval = setInterval(createFallingHeart, 1200);
        
        // End game after 30 seconds
        setTimeout(() => {
            endHeartCatchGame();
        }, 30000);
    }
    
    function createFallingHeart() {
        if (!gameRunning) return;
        
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = ['💖', '💕', '💗', '💝', '❤️'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        
        gameArea.appendChild(heart);
        
        // Check for collision
        const checkCollision = setInterval(() => {
            const heartRect = heart.getBoundingClientRect();
            const turtleRect = turtleCatcher.getBoundingClientRect();
            
            if (heartRect.bottom >= turtleRect.top &&
                heartRect.left < turtleRect.right &&
                heartRect.right > turtleRect.left) {
                // Collision detected!
                catchScore++;
                catchScoreDisplay.textContent = catchScore;
                heart.remove();
                clearInterval(checkCollision);
                
                // Create catch effect
                createCatchEffect(turtleCatcher);
            }
        }, 50);
        
        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
                clearInterval(checkCollision);
            }
        }, 4000);
    }
    
    function endHeartCatchGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        startCatchGameBtn.textContent = 'Mulai Menangkap Cinta!';
        startCatchGameBtn.disabled = false;
        
        // Remove all falling hearts
        const fallingHearts = gameArea.querySelectorAll('.falling-heart');
        fallingHearts.forEach(heart => heart.remove());
        
        let message = '';
        if (catchScore >= 15) {
            message = `Luar biasa! Birra menangkap ${catchScore} cinta! Hebat sekali sayang! 💖🎉`;
        } else if (catchScore >= 10) {
            message = `Bagus sekali! ${catchScore} cinta tertangkap! Birra memang jago! 💕✨`;
        } else {
            message = `${catchScore} cinta tertangkap! Cinta kita tetap sempurna! 💗🐢`;
        }
        
        showSpecialMessage(message);
    }
    
    function createCatchEffect(element) {
        const effect = document.createElement('div');
        effect.innerHTML = '✨💖✨';
        effect.style.position = 'absolute';
        effect.style.fontSize = '1.5rem';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'sparkle 1s ease-out forwards';
        
        const rect = element.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        effect.style.left = (rect.left - gameRect.left + 30) + 'px';
        effect.style.top = (rect.top - gameRect.top) + 'px';
        
        gameArea.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    // Memory Game
    const memoryCards = document.querySelectorAll('.memory-card');
    const resetMemoryBtn = document.getElementById('resetMemoryGame');
    const memoryMovesDisplay = document.getElementById('memoryMoves');
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    
    memoryCards.forEach(card => {
        card.addEventListener('click', flipCard);
    });
    
    resetMemoryBtn.addEventListener('click', resetMemoryGame);
    
    function flipCard() {
        if (this.classList.contains('flipped') || flippedCards.length === 2) return;
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            memoryMovesDisplay.textContent = moves;
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.card === card2.dataset.card;
        
        setTimeout(() => {
            if (match) {
                matchedPairs++;
                if (matchedPairs === 4) {
                    let message = '';
                    if (moves <= 10) {
                        message = `Sempurna! Memory game selesai dalam ${moves} langkah! Birra memang pintar! 🧠💖`;
                    } else {
                        message = `Selamat! Game selesai dalam ${moves} langkah! Kenangan cinta kita memang tak terlupakan! 💕✨`;
                    }
                    showSpecialMessage(message);
                }
            } else {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            flippedCards = [];
        }, 1000);
    }
    
    function resetMemoryGame() {
        memoryCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        memoryMovesDisplay.textContent = moves;
        
        // Shuffle cards
        const gameContainer = document.getElementById('memoryGame');
        const cards = Array.from(memoryCards);
        cards.sort(() => Math.random() - 0.5);
        cards.forEach(card => gameContainer.appendChild(card));
    }
    
    // Love Quiz Game
    const startQuizBtn = document.getElementById('startQuiz');
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const quizScoreDisplay = document.getElementById('quizScore');
    
    const loveQuestions = [
        {
            question: "Apa yang paling aku suka dari Birra?",
            options: ["Senyumnya yang manis", "Cara dia merajut", "Semuanya tentang dia", "Kelembutan hatinya"],
            correct: 2
        },
        {
            question: "Kapan aku pertama kali merasa jatuh cinta pada Birra?",
            options: ["Sejak pertama bertemu", "Saat melihat dia tersenyum", "Setiap hari semakin dalam", "Dari awal hingga selamanya"],
            correct: 3
        },
        {
            question: "Apa yang membuat Birra spesial?",
            options: ["Dia unik dan tak tergantikan", "Hatinya yang tulus", "Cara dia mencintai", "Semua jawaban benar"],
            correct: 3
        },
        {
            question: "Bagaimana perasaanku tentang masa depan bersama Birra?",
            options: ["Penuh harapan dan cinta", "Ingin selalu bersamanya", "Bahagia selamanya", "Semua di atas benar"],
            correct: 3
        },
        {
            question: "Apa yang ingin aku katakan pada Birra hari ini?",
            options: ["Aku mencintaimu", "Kamu adalah segalanya", "Terima kasih sudah ada", "Semuanya dari hati"],
            correct: 3
        }
    ];
    
    let currentQuestion = 0;
    let quizScore = 0;
    let quizActive = false;
    
    startQuizBtn.addEventListener('click', function() {
        if (!quizActive) {
            startLoveQuiz();
        }
    });
    
    function startLoveQuiz() {
        quizActive = true;
        currentQuestion = 0;
        quizScore = 0;
        quizScoreDisplay.textContent = `${quizScore}/5`;
        startQuizBtn.textContent = 'Kuis Sedang Berlangsung...';
        startQuizBtn.disabled = true;
        
        showQuestion();
    }
    
    function showQuestion() {
        if (currentQuestion < loveQuestions.length) {
            const question = loveQuestions[currentQuestion];
            questionText.textContent = question.question;
            
            quizOptions.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.addEventListener('click', () => selectAnswer(index));
                quizOptions.appendChild(optionDiv);
            });
        } else {
            endLoveQuiz();
        }
    }
    
    function selectAnswer(selectedIndex) {
        const question = loveQuestions[currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach(option => option.style.pointerEvents = 'none');
        
        if (selectedIndex === question.correct) {
            quizScore++;
            options[selectedIndex].style.background = 'rgba(72, 187, 120, 0.3)';
            options[selectedIndex].style.borderColor = '#48bb78';
        } else {
            options[selectedIndex].style.background = 'rgba(245, 101, 101, 0.3)';
            options[selectedIndex].style.borderColor = '#f56565';
            options[question.correct].style.background = 'rgba(72, 187, 120, 0.3)';
            options[question.correct].style.borderColor = '#48bb78';
        }
        
        quizScoreDisplay.textContent = `${quizScore}/5`;
        
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 2000);
    }
    
    function endLoveQuiz() {
        quizActive = false;
        startQuizBtn.textContent = 'Mulai Kuis Cinta';
        startQuizBtn.disabled = false;
        
        let message = '';
        if (quizScore === 5) {
            message = "Perfect! Birra tahu semua jawaban tentang cinta kita! Aku terharu sayang! 💖👑";
            questionText.textContent = "Birra adalah pacar terbaik di dunia! 💕";
        } else if (quizScore >= 3) {
            message = `Bagus sekali! Skor ${quizScore}/5! Birra memang mengerti hatiku! 💕✨`;
            questionText.textContent = "Cinta kita memang istimewa! 💖";
        } else {
            message = `Skor ${quizScore}/5! Yang penting cinta kita tulus dan nyata! 💗🐢`;
            questionText.textContent = "Cinta sejati tak perlu kuis untuk membuktikannya! 💕";
        }
        
        quizOptions.innerHTML = '';
        showSpecialMessage(message);
    }
    
    // Turtle Racing Game
    const startRaceBtn = document.getElementById('startRace');
    const raceResult = document.getElementById('raceResult');
    const racers = [
        document.getElementById('turtle1'),
        document.getElementById('turtle2'),
        document.getElementById('turtle3')
    ];
    
    startRaceBtn.addEventListener('click', startTurtleRace);
    
    function startTurtleRace() {
        startRaceBtn.disabled = true;
        startRaceBtn.textContent = 'Balapan Berlangsung...';
        raceResult.textContent = '';
        
        // Reset positions
        racers.forEach(turtle => {
            turtle.style.left = '130px';
        });
        
        const raceInterval = setInterval(() => {
            racers.forEach((turtle, index) => {
                const currentLeft = parseInt(turtle.style.left) || 130;
                const speed = Math.random() * 4 + 2;
                turtle.style.left = (currentLeft + speed) + 'px';
                
                // Check for winner
                if (currentLeft > 400) {
                    clearInterval(raceInterval);
                    const turtleNames = ['Turtle Sayang', 'Turtle Cinta', 'Turtle Bahagia'];
                    const messages = [
                        '🏆 Turtle Sayang menang! Cinta kita yang terdalam! 💕',
                        '🏆 Turtle Cinta menang! Perasaan murni kita! 💖',
                        '🏆 Turtle Bahagia menang! Kegembiraan bersama! ✨'
                    ];
                    raceResult.textContent = messages[index];
                    startRaceBtn.disabled = false;
                    startRaceBtn.textContent = 'Mulai Balapan!';
                    
                    // Celebration effect
                    createCelebrationEffect();
                }
            });
        }, 100);
    }
    
    function createCelebrationEffect() {
        const celebrations = ['🎉', '💖', '✨', '🏆', '💕', '🎊', '💗'];
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const celebration = document.createElement('div');
                celebration.innerHTML = celebrations[Math.floor(Math.random() * celebrations.length)];
                celebration.style.position = 'fixed';
                celebration.style.left = Math.random() * 100 + '%';
                celebration.style.top = Math.random() * 100 + '%';
                celebration.style.fontSize = '2rem';
                celebration.style.pointerEvents = 'none';
                celebration.style.zIndex = '1000';
                celebration.style.animation = 'sparkle 3s ease-out forwards';
                
                document.body.appendChild(celebration);
                
                setTimeout(() => {
                    celebration.remove();
                }, 3000);
            }, i * 120);
        }
    }
    
    // Create heart explosion effect
    function createHeartExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
            heart.style.position = 'fixed';
            heart.style.left = centerX + 'px';
            heart.style.top = centerY + 'px';
            heart.style.fontSize = '25px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            
            document.body.appendChild(heart);
            
            // Random direction and distance
            const angle = (i / 15) * 2 * Math.PI;
            const distance = 120 + Math.random() * 80;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            // Animate the heart
            heart.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).onfinish = () => {
                heart.remove();
            };
        }
    }
    
    // Show special message
    function showSpecialMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.background = 'linear-gradient(135deg, #ff9a9e, #fecfef)';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '25px 35px';
        messageDiv.style.borderRadius = '25px';
        messageDiv.style.fontSize = '1.3rem';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.zIndex = '1001';
        messageDiv.style.boxShadow = '0 15px 40px rgba(255, 105, 180, 0.4)';
        messageDiv.style.maxWidth = '85%';
        messageDiv.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        messageDiv.innerHTML = message;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        messageDiv.animate([
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' },
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
        ], {
            duration: 400,
            easing: 'ease-out'
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            messageDiv.animate([
                { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' }
            ], {
                duration: 400,
                easing: 'ease-in'
            }).onfinish = () => {
                messageDiv.remove();
            };
        }, 4000);
    }
    
    // Add scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.reason-card, .love-declaration, .love-reasons, .games-section, .surprise-section, .promise-section');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize scroll animations
    const scrollElements = document.querySelectorAll('.reason-card, .love-declaration, .love-reasons, .games-section, .surprise-section, .promise-section');
    scrollElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Add typing effect to main title
    const mainTitle = document.querySelector('.main-title');
    const originalText = mainTitle.textContent;
    mainTitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            mainTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 120);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 800);
    
    // Add sparkle effect on page load
    function createSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.position = 'fixed';
        sparkleContainer.style.top = '0';
        sparkleContainer.style.left = '0';
        sparkleContainer.style.width = '100%';
        sparkleContainer.style.height = '100%';
        sparkleContainer.style.pointerEvents = 'none';
        sparkleContainer.style.zIndex = '999';
        
        document.body.appendChild(sparkleContainer);
        
        for (let i = 0; i < 35; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = ['✨', '💖', '💕', '🌟'][Math.floor(Math.random() * 4)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.fontSize = '22px';
                sparkle.style.animation = 'sparkle 4s ease-in-out forwards';
                
                sparkleContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 4000);
            }, i * 150);
        }
        
        // Remove container after all sparkles are done
        setTimeout(() => {
            sparkleContainer.remove();
        }, 8000);
    }
    
    // Add sparkle animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 0;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: scale(1) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create sparkles on page load
    setTimeout(createSparkles, 1500);
    
    // Initialize memory game shuffle
    resetMemoryGame();
    
    console.log('💖 Website penuh cinta untuk Birra tersayang sudah siap! 🐢✨');
});
