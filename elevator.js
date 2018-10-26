class Elevator {
    constructor() {
        // 需要停靠的楼层
        this.actionLevel = []
        // 下行停靠的楼层
        this.downLevels = [];
        // 上行停靠的楼层
        this.upLevels = [];
        // 当前停靠的楼层数
        this.currentLevel = 0;
        // 电梯运行方向 "up" 上行 "down" 下行
        this.direction = "up";
        // 电梯运行状态 "runing" 电梯正在运行 “stop” 电梯停止运行
        this.status = "runing";
        // 定时器
        this.timer = null;
        this.splitLevel();
    }
    // 当有人按压楼梯按键的时候
    whenPress(level) {
        this.actionLevel.push(level);
        this.splitLevel();
        if (this.status === "stop") {
            this.start(this.currentLevel, this.direction);
            this.status === "runing";
        }
    }
    // 区分为上下电梯
    splitLevel() {
        this.upLevels = this.actionLevel.filter(level => level >= this.currentLevel).sort();
        this.downLevels = this.actionLevel.filter(level => level <= this.currentLevel).sort().reverse();
        if (this.downLevels.length === 0 && this.upLevels.length === 0) {
            this.actionLevel = [];
        }
    }
    // 电梯上行
    upLink() {
        this.direction = "up";
        this.splitLevel();
        let hasLevel = this.upLevels.length > 0;
        const levelNow = this.upLevels[0];
        if (this.currentLevel === levelNow) {
            this.upLevels.shift();
            this.actionLevel.splice(this.actionLevel.indexOf(levelNow), 1);
            hasLevel = this.upLevels.length > 0;
        };
        if (hasLevel) {
            this.currentLevel++;
        } else if (this.upLevels.length === 0 && this.downLevels.length) {
            this.downLink();
        }
    }
    // 电梯下行
    downLink() {
        this.direction = "down";
        this.splitLevel();
        let hasLevel = this.downLevels.length > 0;
        const levelNow = this.downLevels[0];
        if (this.currentLevel === levelNow) {
            this.downLevels.shift();
            this.actionLevel.splice(this.actionLevel.indexOf(levelNow), 1);
            hasLevel = this.downLevels.length > 0;
        };
        if (hasLevel) {
            this.currentLevel--;
        } else if (this.downLevels.length === 0 && this.upLevels.length) {
            this.upLink();
        }
    }
    // 没有其他人按键的时候， 电梯处于暂停状态
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.status = "stop";
    }
    // 电梯开始运行
    start(curLevel, direct = "up") {
        this.direction = direct;
        this.currentLevel = curLevel;
        this.timer = setInterval(() => {
            if (this.actionLevel.length > 0) {
                if (this.direction === "up") {
                    this.upLink();
                } else {
                    this.downLink();
                }
            } else {
                this.stop();
            }
        }, 500);
    }
};