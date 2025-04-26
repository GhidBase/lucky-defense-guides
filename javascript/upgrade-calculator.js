const upgradeCosts = {
  mythic: {
    1: {
      stones: 0,
      gold: 0,
    },
    2: {
      stones: 5,
      gold: 1000,
    },
    3: {
      stones: 10,
      gold: 2000,
    },
    4: {
      stones: 20,
      gold: 4000,
    },
    5: {
      stones: 30,
      gold: 6000,
    },
    6: {
      stones: 50,
      gold: 10000,
    },
    7: {
      stones: 70,
      gold: 14000,
    },
    8: {
      stones: 100,
      gold: 20000,
    },
    9: {
      stones: 130,
      gold: 26000,
    },
    10: {
      stones: 170,
      gold: 34000,
    },
    11: {
      stones: 210,
      gold: 42000,
    },
    12: {
      stones: 260,
      gold: 52000,
    },
    13: {
      stones: 310,
      gold: 62000,
    },
    14: {
      stones: 360,
      gold: 72000,
    },
    15: {
      stones: 430,
      gold: 86000,
    },
  },
  legendary: {
    1: {
      duplicates: 0,
      gold: 0,
    },
    2: {
      duplicates: 2,
      gold: 1000,
    },
    3: {
      duplicates: 3,
      gold: 2000,
    },
    4: {
      duplicates: 4,
      gold: 4000,
    },
    5: {
      duplicates: 10,
      gold: 6000,
    },
    6: {
      duplicates: 15,
      gold: 10000,
    },
    7: {
      duplicates: 20,
      gold: 14000,
    },
    8: {
      duplicates: 30,
      gold: 20000,
    },
    9: {
      duplicates: 40,
      gold: 26000,
    },
    10: {
      duplicates: 50,
      gold: 34000,
    },
    11: {
      duplicates: 65,
      gold: 42000,
    },
    12: {
      duplicates: 80,
      gold: 52000,
    },
    13: {
      duplicates: 95,
      gold: 62000,
    },
    14: {
      duplicates: 110,
      gold: 72000,
    },
    15: {
      duplicates: 130,
      gold: 86000,
    },
  },
  epic: {
    1: {
      duplicates: 0,
      gold: 0,
    },
    2: {
      duplicates: 3,
      gold: 1000,
    },
    3: {
      duplicates: 4,
      gold: 2000,
    },
    4: {
      duplicates: 8,
      gold: 4000,
    },
    5: {
      duplicates: 12,
      gold: 6000,
    },
    6: {
      duplicates: 20,
      gold: 10000,
    },
    7: {
      duplicates: 30,
      gold: 14000,
    },
    8: {
      duplicates: 40,
      gold: 20000,
    },
    9: {
      duplicates: 50,
      gold: 26000,
    },
    10: {
      duplicates: 70,
      gold: 34000,
    },
    11: {
      duplicates: 85,
      gold: 42000,
    },
    12: {
      duplicates: 105,
      gold: 52000,
    },
    13: {
      duplicates: 125,
      gold: 62000,
    },
    14: {
      duplicates: 145,
      gold: 72000,
    },
    15: {
      duplicates: 170,
      gold: 86000,
    },
  },
  rare: {
    1: {
      duplicates: 0,
      gold: 0,
    },
    2: {
      duplicates: 3,
      gold: 1000,
    },
    3: {
      duplicates: 6,
      gold: 2000,
    },
    4: {
      duplicates: 10,
      gold: 3000,
    },
    5: {
      duplicates: 20,
      gold: 5000,
    },
    6: {
      duplicates: 30,
      gold: 8000,
    },
    7: {
      duplicates: 40,
      gold: 12000,
    },
    8: {
      duplicates: 60,
      gold: 17000,
    },
    9: {
      duplicates: 80,
      gold: 22000,
    },
    10: {
      duplicates: 100,
      gold: 28000,
    },
    11: {
      duplicates: 130,
      gold: 35000,
    },
    12: {
      duplicates: 160,
      gold: 43000,
    },
    13: {
      duplicates: 190,
      gold: 52000,
    },
    14: {
      duplicates: 220,
      gold: 60000,
    },
    15: {
      duplicates: 260,
      gold: 72000,
    },
  },
  common: {
    1: {
      duplicates: 0,
      gold: 0,
    },
    2: {
      duplicates: 5,
      gold: 500,
    },
    3: {
      duplicates: 10,
      gold: 1000,
    },
    4: {
      duplicates: 20,
      gold: 2000,
    },
    5: {
      duplicates: 30,
      gold: 3000,
    },
    6: {
      duplicates: 50,
      gold: 5000,
    },
    7: {
      duplicates: 70,
      gold: 7000,
    },
    8: {
      duplicates: 100,
      gold: 10000,
    },
    9: {
      duplicates: 130,
      gold: 13000,
    },
    10: {
      duplicates: 170,
      gold: 17000,
    },
    11: {
      duplicates: 210,
      gold: 21000,
    },
    12: {
      duplicates: 260,
      gold: 26000,
    },
    13: {
      duplicates: 310,
      gold: 31000,
    },
    14: {
      duplicates: 360,
      gold: 36000,
    },
    15: {
      duplicates: 430,
      gold: 43000,
    },
  },
};



function calculateUpgradeCosts() {
  const currentLevel = document.getElementById("from-level").value;
  const targetLevel = document.getElementById("to-level").value;
  const rarity = document.getElementById("rarity-selector").value;
  const output = document.getElementById("output");

  let totalGold = 0;
  let totalDuplicates = 0;
  let totalStones = 0;

  if (Number(currentLevel) >= Number(targetLevel)) {
    alert("Desired level must be greater than current level");
    let errortext = `Desired level ${targetLevel} must be greater than current level ${currentLevel}`;
    console.log(errortext);
    return;
  }

  if (rarity === "mythic") {
    for (let i = Number(currentLevel) + 1; i <= Number(targetLevel); i++) {
      totalStones += upgradeCosts.mythic[i].stones;
      totalGold += upgradeCosts.mythic[i].gold;
    }
    if (totalGold > 1000) {
      totalGold = totalGold / 1000 + "k";
    }
    const resultText = `Total Stones: ${totalStones}<br>Total Gold: ${totalGold}`;
    output.innerHTML = resultText;
  } else {
    for (let i = Number(currentLevel) + 1; i <= Number(targetLevel); i++) {
      totalDuplicates += upgradeCosts[rarity][i].duplicates;
      totalGold += upgradeCosts[rarity][i].gold;
    }
    if (totalGold > 1000) {
      totalGold = totalGold / 1000 + "k";
    }
    const resultText = `Total Duplicates: ${totalDuplicates}<br>Total Gold: ${totalGold}`;
    output.innerHTML = resultText;
  }
}

document
  .getElementById("from-level")
  .addEventListener("change", calculateUpgradeCosts);

document
  .getElementById("to-level")
  .addEventListener("change", calculateUpgradeCosts);

