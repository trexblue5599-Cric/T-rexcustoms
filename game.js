const W = 960;
const H = 540;

let gold = 350;
let playerHP = 100;
let enemyHP = 100;

let playerUnits = [];
let enemyUnits = [];

let command = "defend";
let gameOver = false;

class Battle extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0xc8d8b0);
    this.add.rectangle(480, 430, 960, 220, 0x91a96c);

    this.add.rectangle(70, 360, 70, 150, 0x2563eb);
    this.add.rectangle(890, 360, 70, 150, 0xdc2626);

    this.add.text(25, 250, "BLUE KINGDOM");
    this.add.text(790, 250, "RED KINGDOM");

    this.status = this.add.text(
      380, 30, "Prepare your army!",
      { fontSize: "24px", color: "#ffffff" }
    );

    this.physics.world.setBounds(0, 0, W, H);
  }

  update(time, delta) {
    if (gameOver) return;

    this.updateUnits(delta / 1000);
    this.enemyAI();
    this.checkVictory();
  }

  spawnUnit(team, type) {
    const isPlayer = team === "player";

    const x = isPlayer ? 130 : 830;
    const y = 370;

    const color = isPlayer ? 0x2563eb : 0xdc2626;

    const body = this.add.container(x, y);

    const shadow = this.add.ellipse(0, 20, 28, 8, 0x333333);
    const torso = this.add.rectangle(0, 0, 18, 30, color);
    const head = this.add.circle(0, -22, 10, 0xf1c27d);

    body.add([shadow, torso, head]);

    const unit = {
      team,
      type,
      body,
      hp: 40,
      maxHp: 40,
      speed: type === "miner" ? 0 : 55,
      attack: type === "archer" ? 7 : 12,
      range: type === "archer" ? 170 : 30,
      cooldown: 0
    };

    if (isPlayer) {
      playerUnits.push(unit);
    } else {
      enemyUnits.push(unit);
    }
  }

  updateUnits(dt) {
    const all = [...playerUnits, ...enemyUnits];

    all.forEach(unit => {
      if (!unit.body.active) return;

      if (unit.type === "miner") return;

      const enemies =
        unit.team === "player" ? enemyUnits : playerUnits;

      const target = enemies.find(e => e.body.active);

      if (!target) return;

      const distance = Math.abs(
        target.body.x - unit.body.x
      );

      const direction = Math.sign(
        target.body.x - unit.body.x
      );

      const canMove =
        unit.team === "enemy" || command === "attack";

      if (distance > unit.range && canMove) {
        unit.body.x += direction * unit.speed * dt;
      }

      if (
        distance <= unit.range + 10
      ) {
        unit.cooldown -= dt;

        if (unit.cooldown <= 0) {
          target.hp -= unit.attack;
          unit.cooldown = 0.8;

          if (target.hp <= 0) {
            target.body.destroy();

            if (target.team === "player") {
              playerUnits =
                playerUnits.filter(u => u !== target);
            } else {
              enemyUnits =
                enemyUnits.filter(u => u !== target);
            }
          }
        }
      }

      if (unit.team === "player" && command === "retreat") {
        unit.body.x += (130 - unit.body.x) * dt * 2;
      }

      if (unit.team === "player" && command === "defend") {
        unit.body.x +=
          (Math.min(unit.body.x, 280) - unit.body.x) * dt * 2;
      }
    });
  }

  enemyAI() {
    if (!this.lastEnemy) this.lastEnemy = 0;

    if (this.time.now - this.lastEnemy > 4000) {
      this.lastEnemy = this.time.now;

      this.spawnUnit(
        "enemy",
        Math.random() > 0.5 ? "sword" : "archer"
      );
    }
  }

  checkVictory() {
    if (enemyHP <= 0 || playerHP <= 0) {
      gameOver = true;

      this.status.setText(
        enemyHP <= 0 ? "VICTORY!" : "DEFEAT!"
      );
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: "game",
  backgroundColor: "#c8d8b0",
  physics: {
    default: "arcade"
  },
  scene: [Battle]
};

const game = new Phaser.Game(config);

function recruit(type) {
  const costs = {
    miner: 75,
    sword: 100,
    archer: 150
  };

  const cost = costs[type];

  if (gold < cost || gameOver) return;

  gold -= cost;

  game.scene.scenes[0].spawnUnit(
    "player",
    type
  );

  document.getElementById("gold").textContent = gold;
}

function commandArmy(type) {
  command = type;
}