const server = {},
      client = {};

client.now = {
  characterlvl: 0,
  weaponlvl: 0,
  weaponRefinement: 0,
  normalAttacklvl: 0,
  elementalSkilllvl: 0,
  elementalBurstlvl: 0,
  energyRecharge: 1,
  crit: 0.5,
  enemylvl: 4,
  infusion: false,
  protectionDebuff: 0,
  blockContext: false
};
client.weapon = {
  name: document.getElementById('weapon-name'),
  lvl: document.getElementById('weapon-lvl'),
  icon: document.getElementById('weapon-icon'),
  ref: document.getElementById('weapon-refinement'),
  star: document.getElementById('weapon-stars').children
}
client.character = {
  name: document.getElementById('character-name'),
  lvl: document.getElementById('character-lvl'),
  icon: document.getElementById('character-icon'),
  star: document.getElementById('character-stars').children
}
client.normalAttack = {
  icon: document.getElementById('normal-attack-icon'),
  name: document.getElementById('normal-attack-name'),
  fields: document.getElementById('normal-attack-fields'),
  lvl: document.getElementById('first-talent-lvl')
}
client.elementalSkill = {
  icon: document.getElementById('elemental-skill-icon'),
  name: document.getElementById('elemental-skill-name'),
  fields: document.getElementById('elemental-skill-fields'),
  lvl: document.getElementById('second-talent-lvl')
}
client.elementalBurst = {
  icon: document.getElementById('elemental-burst-icon'),
  name: document.getElementById('elemental-burst-name'),
  fields: document.getElementById('elemental-burst-fields'),
  lvl: document.getElementById('third-talent-lvl')
}
client.enemy = {
  icon: document.getElementById('enemy-icon'),
  name: document.getElementById('enemy-name'),
  lvl: document.getElementById('enemy-lvl')
}
client.showContext = type => {
  if (client.now.blockContext) return;
  client.now.blockContext = true;
  if (type === 'weapon') {
    document.getElementById(`weapon-${client.now.ch.weapon}-context`).style.display = 'block';
  } else {
    document.getElementById(`${type}-context`).style.display = 'block';
  }
}
client.hideContext = type => {
  client.now.blockContext = false;
  document.getElementById(`${type}-context`).style.display = 'none';
}
client.changeEnemylvl = e => {
  if (e.value > 0 && e.value <= 100) {
    client.now.enemylvl = +e.value;
    client.recomputeAll();
  } else {
    client.enemy.lvl.value = client.now.enemylvl;
  }
}
client.changeWeaponAscension = v => {
  const weaponStat = client.now.w.stat;
  if (client.now.weaponlvl == v) v--;
  client.now[weaponStat.type] -= weaponStat.value[client.now.weaponlvl];
  client.now.weaponlvl = v;
  client.now[weaponStat.type] += weaponStat.value[v];
  client.weapon.lvl.textContent = `${client.getWeaponlvl()}/${client.getWeaponlvl()}`;
  for (let i = 0; i < 6; i++) client.weapon.star[i].src = 'img/emptystar.png';
  for (let i = 0; i < v; i++) client.weapon.star[i].src = 'img/filledstar.png';
  client.recomputeAll();
}
client.changeWeaponRefinement = e => {
  if (e.value > 0 && e.value < 6) {
    client.now.weaponRefinement = e.value - 1;
    client.recomputeAll();
  } else {
    e.value = client.now.weaponRefinement + 1;
  }
}
client.changeCharacterAscension = v => {
  if (client.now.characterlvl == v) v -= 2;
  const arrowState = client.now.characterlvl % 2;
  client.now[client.now.ch.ascensionBonus.type] -= client.parseAscensionBonus(client.now.ch.ascensionBonus.value);
  client.now.characterlvl = v + arrowState;
  client.now[client.now.ch.ascensionBonus.type] += client.parseAscensionBonus(client.now.ch.ascensionBonus.value);
  if (arrowState) {
    client.character.lvl.textContent = `${client.getCharacterlvl(-1)}/${client.getCharacterlvl(-1)}`;
  } else {
    client.character.lvl.textContent = `${client.getCharacterlvl()}/${client.getCharacterlvl(-1)}`;
  }
  for (let i = 0; i < 6; i++) client.character.star[i].src = 'img/emptystar.png';
  for (let i = 0; i < v / 2; i++) client.character.star[i].src = 'img/filledstar.png';
  client.recomputeAll();
}
client.recomputeFirstTalent = e => {
  if (e.value > 0 && e.value < 12) {
    client.now.normalAttacklvl = e.value - 1;
    client.recomputeAll();
  } else {
    e.value = client.now.normalAttacklvl + 1;
  }
}
client.recomputeSecondTalent = e => {
  if (e.value > 0 && e.value < 14) {
    client.now.elementalSkilllvl = e.value - 1;
    client.recomputeAll();
  } else {
    e.value = client.now.elementalSkilllvl + 1;
  }
}
client.recomputeThirdTalent = e => {
  if (e.value > 0 && e.value < 14) {
    client.now.elementalBurstlvl = e.value - 1;
    client.recomputeAll();
  } else {
    e.value = client.now.elementalBurstlvl + 1;
  }
}
client.arrow = e => {
  const state = e.dataset.arrow,
        lvl = client.now.characterlvl;
  if (state == 0) {
    if (lvl == 13) return;
    client.now.characterlvl++;
    e.dataset.arrow = 1;
    e.src = 'img/arrowup.png';
    client.character.lvl.textContent = `${client.getCharacterlvl()}/${client.getCharacterlvl()}`;
  } else {
    if (lvl == 0) return;
    client.character.lvl.textContent = `${client.getCharacterlvl(1)}/${client.getCharacterlvl()}`;
    client.now.characterlvl--;
    e.dataset.arrow = 0;
    e.src = 'img/arrowdown.png';
  }
  client.recomputeAll();
}
client.clearInput = e => {
  const past = e.value;
  e.value = '';
  e.addEventListener('blur', () => {
    if (e.value === '') e.value = past;
  }, { once: true });
}
client.getCharacterlvl = (low = 0) => {
  switch (client.now.characterlvl - low) {
    case 0: return 1;
    case 1: case 2: return 20;
    case 3: case 4: return 40;
    case 5: case 6: return 50;
    case 7: case 8: return 60;
    case 9: case 10: return 70;
    case 11: case 12: return 80;
    case 13: case 14: return 90;
  }
}
client.getWeaponlvl = () => {
  if (client.now.weaponlvl === 0) return 20;
  return client.now.weaponlvl * 10 + 30;
}
client.renderTalent = (data, result, lvl, nocrit, crit) => {
  if (result) {
    switch (data.type) {
      case 1:
        const computed = client.computeDMG(data.value[lvl], result[0], result[1], result[2], result[3], result[4]);
        nocrit.textContent = computed + (data.repeat ? `×${data.repeat}` : '');
        crit.textContent = Math.round(computed * (1 + client.now.crit)) + (data.repeat ? `×${data.repeat}` : '');
        break;
      case 2:
      case 4:
        const divider = data.type == 2 ? '+' : '/';
        nocrit.textContent = data.value.map(value => {
          return client.computeDMG(value[lvl], result[0], result[1], result[2]);
        }).join(divider);
        crit.textContent = data.value.map(value => {
          return Math.round(client.computeDMG(value[lvl], result[0], result[1], result[2]) * (1 + client.now.crit));
        }).join(divider);
        break;
    }
  } else {
    const container = document.createElement('div'),
          name = document.createElement('div'),
          nocrit = document.createElement('div'),
          crit = document.createElement('div');
    container.classList.add('field-of-talent');
    name.textContent = data[0];
    name.style.width = '200px';
    container.append(name);
    nocrit.style.width = '100px';
    crit.style.width = '100px';
    container.append(nocrit);
    container.append(crit);
    return container;
  }
}
client.computeDMG = (skill = 1, bonusDMG = 0, resist = 0.1, bonusATK = 0, reaction = 1, flatATK = 0) => {
  const baseATK = client.now.ch.baseATK[client.now.characterlvl] +
                  client.now.w.baseATK[client.now.weaponlvl],
        lvl = client.getCharacterlvl(),
        outATK = baseATK * (1 + bonusATK) + flatATK,
        res = (lvl+100)/((100+lvl)+(100+client.now.enemylvl)*(1-client.now.protectionDebuff))*(1-resist);
  return Math.round(outATK * (1 + bonusDMG) * skill * res);
}
client.recomputeAll = () => {
  const ch = client.now.ch,
        w = client.now.w,
        enemy = client.now.enemy;
  ch.normalAttack.fields.forEach((field, i) => {
    const elemental = field[1].elemental || client.now.infusion ? ch.element : false,
          hit = field[1].charged ? client.now.chargedDMG : field[1].plunging ? client.now.plungingDMG : client.now.normalhitDMG,
          reaction = 1;
    console.log(`Тип урона: ${elemental ? elemental : 'physical'}\nБонус урона "${field[0]}": ${hit + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG)}`);
    const result = [hit + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG),
                    enemy.res ? elemental ? enemy.res[elemental] : enemy.res.physical : 0.1,
                    client.now.allATK, reaction, client.now.allFlatATK];
    client.renderTalent(field[1], result, client.now.normalAttacklvl,
                        client.normalAttack.fields.children[i].children[1],
                        client.normalAttack.fields.children[i].children[2]);
  });
  ch.elementalSkill.fields.forEach((field, i) => {
    const elemental = field[1].elemental ? ch.element : false,
          reaction = 1;
    console.log(`Тип урона: ${elemental ? elemental : 'physical'}\nБонус урона "${field[0]}": ${client.now.elementalSkillDMG + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG)}`);
    const result = [client.now.elementalSkillDMG + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG),
                    enemy.res ? elemental ? enemy.res[elemental] : enemy.res.physical : 0.1,
                    client.now.allATK, reaction, client.now.allFlatATK];
    client.renderTalent(field[1], result, client.now.elementalSkilllvl,
                        client.elementalSkill.fields.children[i].children[1],
                        client.elementalSkill.fields.children[i].children[2]);
  });
  ch.elementalBurst.fields.forEach((field, i) => {
    const elemental = field[1].elemental ? ch.element : false,
          reaction = 1;
    console.log(`Тип урона: ${elemental ? elemental : 'physical'}\nБонус урона "${field[0]}": ${client.now.elementalBurstDMG + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG)}`);
    const result = [client.now.elementalBurstDMG + (elemental ? client.now.allElementalDMG : client.now.allPhysicalDMG),
                    enemy.res ? elemental ? enemy.res[elemental] : enemy.res.physical : 0.1,
                    client.now.allATK, reaction, client.now.allFlatATK];
    client.renderTalent(field[1], result, client.now.elementalBurstlvl,
                        client.elementalBurst.fields.children[i].children[1],
                        client.elementalBurst.fields.children[i].children[2]);
  });

}
client.initBuild = (character, weapon, firstInit) => {
  if (character) {
    if (!firstInit) {
      client.now[client.now.ch.ascensionBonus.type] -= client.parseAscensionBonus(client.now.ch.ascensionBonus.value);
    }
    const ch = server.characters.get(character);
    client.now.ch = ch;
    while (client.normalAttack.fields.children.length) client.normalAttack.fields.children[0].remove();
    while (client.elementalSkill.fields.children.length) client.elementalSkill.fields.children[0].remove();
    while (client.elementalBurst.fields.children.length) client.elementalBurst.fields.children[0].remove();
    client.character.icon.src = ch.icon;
    client.character.name.textContent = ch.name;
    client.normalAttack.icon.src = ch.normalAttack.icon;
    client.normalAttack.name.textContent = ch.normalAttack.name;
    client.normalAttack.lvl.value = client.now.normalAttacklvl + 1;
    for (const field of ch.normalAttack.fields) {
      client.normalAttack.fields.append(client.renderTalent(field));
    }
    client.elementalSkill.icon.src = ch.elementalSkill.icon;
    client.elementalSkill.name.textContent = ch.elementalSkill.name;
    client.elementalSkill.lvl.value = client.now.elementalSkilllvl + 1;
    for (const field of ch.elementalSkill.fields) {
      client.elementalSkill.fields.append(client.renderTalent(field))
    }
    client.elementalBurst.icon.src = ch.elementalBurst.icon;
    client.elementalBurst.name.textContent = ch.elementalBurst.name;
    client.elementalBurst.lvl.value = client.now.elementalBurstlvl + 1;
    for (const field of ch.elementalBurst.fields) {
      client.elementalBurst.fields.append(client.renderTalent(field))
    }
    client.now[client.now.ch.ascensionBonus.type] += client.parseAscensionBonus(client.now.ch.ascensionBonus.value);
  }

  if (weapon) {
    if (!firstInit) {
      client.now[w.stat.type] -= w.stat.value[client.now.weaponlvl];
      for (const buff of server.buffs) {
        client.now[buff] -=  client.now.w.buffs[buff] || 0;
      }
    }
    const w = server.weapons.get(weapon);
    client.now.w = w;
    client.weapon.icon.src = w.icon;
    client.weapon.name.textContent = w.name;
    client.weapon.ref.value = client.now.weaponRefinement + 1;
    client.now[w.stat.type] += w.stat.value[client.now.weaponlvl];
    for (const buff of server.buffs) {
      client.now[buff] +=  w.buffs[buff] || 0;
    }
  }

  client.recomputeAll();
}
client.initEnemy = (name, firstInit) => {
  const enemy = server.enemies.get(name);
  client.now.enemy = enemy;
  client.enemy.icon.src = enemy.icon;
  client.enemy.name.textContent = enemy.name;
  client.enemy.lvl.value = client.now.enemylvl;
  if (!firstInit) client.recomputeAll();
}
client.parseAscensionBonus = value => {
  switch (client.now.characterlvl) {
    case 0: case 1: case 2: case 3: return 0;
    case 4: case 5: return value[0];
    case 6: case 7: case 8: case 9: return value[1];
    case 10: case 11: return value[2];
    case 12: case 13: return value[3];
  }
}

server.characters = new Map([
  ['Kaeya', {
    element: 'cryo',
    weapon: 'sword',
    icon: 'img/kaeya.png',
    name: 'Кэйа',
    baseATK: [19, 48, 62, 93, 103, 118, 131, 147, 157, 172, 182, 198, 208, 223],
    ascensionBonus: {
      type: 'er',
      value: [0.067, 0.133, 0.22, 0.267]
    },
    normalAttack: {
      name: 'Ритуальное фехтование',
      icon: 'img/ceremonial_bladework.png',
      fields: [
        ['Урон атаки 1', {
          type: 1,
          value: [0.538, 0.581, 0.625, 0.688, 0.731, 0.781, 0.85, 0.919, 0.988, 1.06, 1.15]
        }],
        ['Урон атаки 2', {
          type: 1,
          value: [0.517, 0.559, 0.601, 0.661, 0.703, 0.751, 0.817, 0.883, 0.95, 1.02, 1.1]
        }],
        ['Урон атаки 3', {
          type: 1,
          value: [0.653, 0.706, 0.759, 0.835, 0.888, 0.95, 1.03, 1.12, 1.2, 1.29, 1.39]
        }],
        ['Урон атаки 4', {
          type: 1,
          value: [0.709, 0.766, 0.824, 0.906, 0.964, 1.03, 1.12, 1.21, 1.3, 1.4, 1.51]
        }],
        ['Урон атаки 5', {
          type: 1,
          value: [0.882, 0.954, 1.03, 1.13, 1.2, 1.28, 1.4, 1.51, 1.62, 1.74, 1.89]
        }],
        ['Урон заряженной атаки', {
          type: 2,
          charged: true,
          value: [
            [0.55, 0.595, 0.64, 0.704, 0.749, 0.8, 0.87, 0.941, 1.01, 1.09, 1.18],
            [0.731, 0.791, 0.85, 0.935, 0.995, 1.06, 1.16, 1.25, 1.34, 1.45, 1.56]
          ]
        }],
        ['Урон в падении', {
          type: 1,
          plunging: true,
          value: [0.639, 0.691, 0.743, 0.818, 0.87, 0.93, 1.01, 1.09, 1.175, 1.264, 1.35]
        }],
        ['Урон низкого/высокого удара', {
          type: 4,
          plunging: true,
          value: [
            [1.28, 1.38, 1.49, 1.64, 1.74, 1.86, 2.02, 2.19, 2.35, 2.53, 2.71],
            [1.6, 1.73, 1.86, 2.04, 2.17, 2.32, 2.53, 2.73, 2.93, 3.16, 3.38]
          ]
        }],
      ]
    },
    elementalSkill: {
      name: 'Выпад холода',
      icon: 'img/frostgnaw.png',
      fields: [
        ['Урон навыка', {
          type: 1,
          elemental: true,
          value: [1.91, 2.06, 2.2, 2.39, 2.53, 2.68, 2.87, 3.06, 3.25, 3.44, 3.63, 3.82, 4.06]
        }]
      ]
    },
    elementalBurst: {
      name: 'Ледниковый вальс',
      icon: 'img/glacial_waltz.png',
      fields: [
        ['Урон навыка', {
          type: 1,
          elemental: true,
          value: [0.776, 0.834, 0.892, 0.97, 1.03, 1.09, 1.16, 1.24, 1.32, 1.4, 1.47, 1.55, 1.65, 1.75]
        }]
      ]
    }
  }],
  ['Kamisato Ayaka', {
    element: 'cryo',
    weapon: 'sword',
    icon: 'img/kamisato_ayaka.png',
    name: 'Аяка',
    baseATK: [27, 79, 92, 138, 154, 177, 198, 222, 238, 262, 278, 302, 318, 342],
    ascensionBonus: {
      type: 'energyRecharge',
      value: [0.067, 0.133, 0.22, 0.267]
    },
    normalAttack: {
      name: 'Искусство Камисато: Нанамэ',
      icon: 'img/ceremonial_bladework.png',
      fields: [
        ['Урон атаки 1', {
          type: 1,
          value: [0.457, 0.4945, 0.5317, 0.5849, 0.6221, 0.6646, 0.7231, 0.7816, 0.8401, 0.9039, 0.9677]
        }],
        ['Урон атаки 2', {
          type: 1,
          value: [0.487, 0.5265, 0.5661, 0.6227, 0.6623, 0.7076, 0.7699, 0.8322, 0.8944, 0.9624, 1.0303]
        }],
        ['Урон атаки 3', {
          type: 1,
          value: [0.626, 0.6772, 0.7282, 0.801, 0.8519, 0.9102, 0.9903, 1.0704, 1.1505, 1.2379, 1.3253]
        }],
        ['Урон атаки 4', {
          type: 1,
          repeat: 3,
          value: [0.226, 0.2449, 0.2633, 0.2897, 0.3081, 0.3292, 0.3581, 0.3871, 0.4161, 0.4477, 0.4793]
        }],
        ['Урон атаки 5', {
          type: 1,
          value: [0.782, 0.8455, 0.9091, 1, 1.0636, 1.1364, 1.2364, 1.3364, 1.4364, 1.5455, 1.6545]
        }],
        ['Урон заряженной атаки', {
          type: 1,
          repeat: 3,
          charged: true,
          value: [0.551, 0.5961, 0.641, 0.7051, 0.75, 0.8013, 0.8718, 0.9423, 1.0128, 1.0897, 1.1666]
        }],
        ['Урон в падении', {
          type: 1,
          plunging: true,
          value: [0.64, 0.6914, 0.7434, 0.8177, 0.8698, 0.9292, 1.011, 1.0928, 1.1746, 1.2638, 1.353]
        }],
        ['Урон низкого/высокого удара', {
          type: 4,
          plunging: true,
          value: [
            [1.28, 1.3824, 1.4865, 1.6351, 1.7392, 1.8581, 2.0216, 2.1851, 2.3486, 2.527, 2.7054],
            [1.6, 1.7267, 1.8567, 2.0424, 2.1723, 2.3209, 2.5251, 2.7293, 2.9336, 3.1564, 3.3792]
          ]
        }],
      ]
    },
    elementalSkill: {
      name: 'Искусство Камисато: Хёка',
      icon: 'img/kamisato_art_hyouka.png',
      fields: [
        ['Урон навыка', {
          type: 1,
          elemental: true,
          value: [2.39, 2.5714, 2.7508, 2.99, 3.1694, 3.3488, 3.588, 3.8272, 4.0664, 4.3056, 4.5448, 4.784, 5.083]
        }]
      ]
    },
    elementalBurst: {
      name: 'Искусство Камисато: Сомэцу',
      icon: 'img/kamisato_art_soumetsu.png',
      fields: [
        ['Cutting DMG% (x19)', {
          type: 1,
          elemental: true,
          value: [1.12, 1.2072, 1.2915, 1.4038, 1.488, 1.5722, 1.6845, 1.7968, 1.9091, 2.0214, 2.1337, 2.246, 2.3864]
        }],
        ['Bloom DMG%', {
          type: 1,
          elemental: true,
          value: [1.68, 1.8108, 1.9372, 2.1056, 2.232, 2.3583, 2.5267, 2.6952, 2.8637, 3.0321, 3.2005, 3.369, 3.5796]
        }]
      ]
    }
  }]
]);

server.weapons = new Map([
  ['Prototype Rancour', {
    type: 'sword',
    icon: 'img/prototype_rancour.png',
    name: 'Прототип: Злоба',
    baseATK: [119, 226, 293, 361, 429, 497, 565],
    stat: {
      type: 'allPhysicalDMG',
      value: [0.133, 0.193, 0.224, 0.254, 0.284, 0.315, 0.345]
    },
    buffs: {}
  }],
  ['Aquila Favonia', {
    type: 'sword',
    icon: 'img/aquila_favonia.png',
    name: 'Меч Сокола',
    baseATK: [133, 261, 341, 423, 506, 590, 674],
    stat: {
      type: 'allPhysicalDMG',
      value: [0.159, 0.232, 0.268, 0.304, 0.341, 0.377, 0.413]
    },
    buffs: {
      allATK: 0.2
    }
  }],
  ['Amos\' Bow', {
    type: 'bow',
    icon: 'img/amos.png',
    name: 'Лук Амоса',
    baseATK: [122, 135, 308, 382, 457, 532, 608],
    stat: {
      type: 'allATK',
      value: [0.191, 0.278, 0.322, 0.365, 0.409, 0.453, 0.496]
    },
    buffs: {
      allATK: 0.2
    }
  }],
  ['Favonius Codex', {
    type: 'catalyst',
    icon: 'img/favonius_codex.png',
    name: 'Кодекс Фавония',
    baseATK: [109, 205, 266, 327, 388, 449, 510],
    stat: {
      type: 'energyRecharge',
      value: [0.177, 0.258, 0.298, 0.338, 0.379, 0.419, 0.459]
    },
    buffs: {}
  }]
]);

server.enemies = new Map([
  ['Hilichurl', {
    icon: 'img/hilichurl.png',
    name: 'Хиличурл'
  }],
  ['Treasure Hoarders', {
    icon: 'img/treasure_hoarder.png',
    name: 'Похититель сокровищ',
    res: {
      physical: -0.1
    }
  }]
])

server.buffs = ['normalhitDMG', 'chargedDMG', 'plungingDMG', 'elementalSkillDMG',
                'elementalBurstDMG', 'allElementalDMG', 'allPhysicalDMG', 'allFlatATK',
                'allATK']
for (const buff of server.buffs) {
  client.now[buff] = 0;
}

client.initEnemy('Hilichurl', true);
client.initBuild('Kaeya', 'Prototype Rancour', true);
