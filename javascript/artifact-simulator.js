const itemNames = [
  "Power Potion",
  "Fairy Bow",
  "Punching Glove",
  "Greatsword",
  "Arcane Tome",
  "Snail",

  "Candied Fruit",
  "Bat",
  "Wizard's Hat",
  "Wallet",
  "Castle Wall",
  "King's Pigeon",

  "Bomb",
  "Horn",
  "Receipt",
  "Golden Pickaxe",
  "Old Book",
  "Shiny Lever",
  "Horseshoe",

  "Bomba Doll",
  "Lamp",
  "Luck Stone",
  "Golden Dice",
  "Sage's Yogurt",
  "Magic Gauntlet",

  "Golden Hammer",
  "Safe Box",
  "Money Gun",
  "Gambler's Wrist",
  "Meat",
  "Skull Stone",
];

let itemCounts = {};

let totalRolls = 0;

function roll() {
  event.preventDefault();
  const rollInput = document.getElementById("rollCount");

  const rollsToDo = parseInt(rollInput.value);

  if (isNaN(rollsToDo) || rollsToDo < 1) {
    alert("Please enter a valid number of rolls.");

    return;
  }

  // Reset for new session

  itemCounts = {};

  itemNames.forEach((name) => (itemCounts[name] = 0));

  totalRolls = 0;

  // Simulate rolls

  for (let i = 0; i < rollsToDo; i++) {
    const randomIndex = Math.floor(Math.random() * itemNames.length);

    const rolledItem = itemNames[randomIndex];

    itemCounts[rolledItem]++;

    totalRolls++;
  }

  document.getElementById("total").textContent = totalRolls;

  displayResults();
}

function displayResults() {
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "";

  itemNames.forEach((name) => {
    const count = itemCounts[name];

    if (count === 0) return;

    const line = `${name}: ${count} times`;

    const div = document.createElement("div");

    div.className = "key-result";

    div.textContent = line;

    resultsDiv.appendChild(div);
  });
}
