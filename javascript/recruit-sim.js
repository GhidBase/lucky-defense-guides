let inputField = document.querySelector("#scroll-input");
let useScrollsButton = document.querySelector("#use-scrolls-button");
useScrollsButton.addEventListener("click",calculatePulls);
let singlePullList = document.querySelector("#singleList");
let tenPullList = document.querySelector("#tenList");
let recruitPulls = {};


const commons = [ "Archer", "Thrower", "Barbarian", "Water Elemental", "Bandit" ];

const pullTypes = [
    { name: "Common", chance: 30.8642, acquireChance: 50, possibleGuardians: commons},
    { name: "Rare", chance: 18.51585, acquireChance: 50 },
    { name: "Epic", chance: 12.3457, acquireChance: 50 },
    { name: "Legendary", chance: 9.2593, acquireChance: 50 },
    { name: "Mythic", chance: 1.8519, acquireChance: 5 },
    { name: "Gold +200", chance: 6.1728, acquireChance: 50 },
    { name: "Gold +400", chance: 3.0864, acquireChance: 40 },
    { name: "Gold +600", chance: 1.8519, acquireChance: 30 },
    { name: "Mythic Stone +1", chance: 3.0864, acquireChance: 20 },
    { name: "Mythic Stone +2", chance: 1.8519, acquireChance: 10 },
    { name: "Diamond +10", chance: 6.1728, acquireChance: 30 },
    { name: "Diamond +20", chance: 3.0864, acquireChance: 20 },
    { name: "Diamond +30", chance: 1.8519, acquireChance: 30 },
];

function calculatePulls() {
    let singlePulls = Math.trunc(inputField.value / 30);
    let tenPulls = Math.trunc(inputField.value / 300);

    let pull = getRandomPull();
    // using the pull type property will return "common" instead of "bandit"
    if (pull.acquisition) {
        recruitPulls[pull.name] ? recruitPulls[pull.name] += 1 : recruitPulls[pull.name] = 1;
    }
    console.clear();
    console.table(recruitPulls)
    console.log(pull)
    inputField.value = pull.name + " " + pull.acquisition;

}

function getRandomPull() {
    const randomChance = Math.random() * 100;
    const randomChance2 = Math.random() * 100;

    let cumulativeChance = 0;
    for (const pull of pullTypes) {
        cumulativeChance += pull.chance;

        if (randomChance <= cumulativeChance) {
            let randomChance3 = null;
            let guardian = pull.name;
            let acquisition = pull.acquireChance < randomChance2 ? true : false;
            let pullType = pull.name;

            if (pull.possibleGuardians) {
                randomChance3 = Math.trunc(Math.random() * pull.possibleGuardians.length);
                guardian = pull.possibleGuardians[randomChance3];
            }

            return {pullType: pullType, acquisition: acquisition, name: guardian}
        }

    }

    // Covers possible edge cases where rounding errors might occur
    throw new Error("Probabilities do not sum to 100.");
}




/*
    PLAN FOR CALCULATION
    Calculate the number of pulls
    Perform pulls
    Store each pull in a dictionary
    After pulls are calculated, display them


    HOW DO PULLS WORK
    First pull is 10 random units
    If you pull 5, pull again but another unit
    if 6, pull again, another unit
    up to 8

    Like so
    Pulls   ReRollGoal
    10      5
    11      6
    12      7
    13      8
    14
*/
