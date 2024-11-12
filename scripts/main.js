class Game {
    constructor() {
        this.player = null;
        this.bgMusic = document.getElementById('bgMusic');
        this.effectSound = document.getElementById('effectSound');
        this.currentScene = 'start';
        this.initializeEventListeners();
        this.loadPlayerData();
        this.showInitialBackground();
    }

    initializeEventListeners() {
        document.getElementById('newPlayer').addEventListener('click', () => this.createNewPlayer());
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('toggleMusic').addEventListener('click', () => this.toggleMusic());
    }

    toggleMusic() {
        if (this.bgMusic.paused) {
            this.bgMusic.play();
            document.querySelector('.music-off').style.display = 'none';
            document.querySelector('.music-on').style.display = 'inline';
        } else {
            this.bgMusic.pause();
            document.querySelector('.music-off').style.display = 'inline';
            document.querySelector('.music-on').style.display = 'none';
        }
    }

    async showScene(text, imageName) {
        const storyText = document.getElementById('story-text');
        storyText.innerHTML = `
            <img src="images/${imageName}.jpg" alt="场景" class="scene-image fade-in">
            <p class="fade-in">${text}</p>
        `;
        
        this.effectSound.play();
    }

    loadPlayerData() {
        const savedPlayer = localStorage.getItem('player');
        if (savedPlayer) {
            this.player = JSON.parse(savedPlayer);
            this.updatePlayerDisplay();
        }
    }

    createNewPlayer() {
        const nickname = prompt('请输入你的昵称：');
        if (nickname) {
            this.player = {
                id: Date.now(),
                nickname: nickname,
                history: []
            };
            localStorage.setItem('player', JSON.stringify(this.player));
            this.updatePlayerDisplay();
        }
    }

    updatePlayerDisplay() {
        const playerDetails = document.getElementById('playerDetails');
        playerDetails.innerHTML = `
            <p>ID: ${this.player.id}</p>
            <p>昵称: ${this.player.nickname}</p>
        `;
        this.updateHistory();
    }

    updateHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = this.player.history.map(record => `
            <div class="history-item">
                <p>日期: ${new Date(record.date).toLocaleString()}</p>
                <p>结果: ${record.result}</p>
            </div>
        `).join('');
    }

    async startGame() {
        if (!this.player) {
            alert('请先创建玩家信息！');
            return;
        }

        const startButton = document.getElementById('startGame');
        startButton.style.display = 'none';
        
        this.bgMusic.play();
        const storyText = document.getElementById('story-text');
        storyText.innerHTML = '';
        
        try {
            // 获取初始线索
            const initialClue = await TreasureMap.getInitialClue();
            await this.showScene(initialClue, 'library');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 解码线索
            const location = await TreasureMap.decodeAncientScript(initialClue);
            await this.showScene(location, 'temple');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 随机选择路径
            const path = Math.random();
            if (path < 0.3) {
                // 30% 概率进入洞窟
                await this.showScene("你发现了一个神秘的洞窟...", 'dongku');
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (path < 0.6) {
                // 30% 概率遇到传送门
                await this.showScene("你遇到了一个神秘的传送门...", 'door');
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            // 搜索神庙
            const boxResult = await TreasureMap.searchTemple(location);
            
            // 随机结果
            const outcome = Math.random();
            if (outcome < 0.4) {
                // 40% 概率遇到守卫
                throw "遇到了神庙守卫！";
            } else if (outcome < 0.7) {
                // 30% 概率掉入陷阱
                throw "不小心触发了古老的机关陷阱！";
            }
            
            await this.showScene(boxResult, 'final');
            const treasure = await TreasureMap.openTreasureBox();
            await this.showScene(treasure, 'final');

            this.saveGameResult('成功找到宝藏！');
        } catch (error) {
            if (error.includes('守卫')) {
                await this.showScene(`任务失败: ${error}`, 'guard');
            } else {
                await this.showScene(`任务失败: ${error}`, 'failed');
            }
            this.saveGameResult('寻宝失败');
        }
        
        startButton.textContent = '重新寻宝';
        startButton.style.display = 'block';
    }

    saveGameResult(result) {
        this.player.history.push({
            date: Date.now(),
            result: result
        });
        localStorage.setItem('player', JSON.stringify(this.player));
        this.updateHistory();
    }

    showInitialBackground() {
        const storyText = document.getElementById('story-text');
        storyText.innerHTML = `
            <img src="images/background.jpg" alt="背景" class="scene-image fade-in">
            <p class="fade-in">欢迎来到神秘的寻宝之旅！</p>
        `;
        const startButton = document.getElementById('startGame');
        startButton.textContent = '开始寻宝';
    }
}

const game = new Game();