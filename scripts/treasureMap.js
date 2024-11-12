class TreasureMap {
    static async getInitialClue() {
        const response = await fetch('data/library.txt');
        const text = await response.text();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(text);
            }, 1000);
        });
    }

    static async decodeAncientScript(clue) {
        const response = await fetch('data/temple.txt');
        const text = await response.text();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve(text);
            }, 1500);
        });
    }

    static async searchTemple(location) {
        const response = await fetch('data/guard.txt');
        const guardInfo = await response.text();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random < 0.3) {
                    reject(guardInfo);
                }
                resolve("找到了一个神秘的箱子...");
            }, 2000);
        });
    }

    static async openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }
} 