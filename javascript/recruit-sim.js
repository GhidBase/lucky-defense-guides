let inputField = document.querySelector("#scroll-input");
let useScrollsButton = document.querySelector("#use-scrolls-button");
useScrollsButton.addEventListener("click",calculatePulls);
let singlePullList = document.querySelector("#singleList");
let tenPullList = document.querySelector("#tenList");
let recruitPulls = {};

const guardians = {
    commons: [ "Archer", "Thrower", "Barbarian", "Water Elemental", "Bandit" ],
    rares: [ "Ranger", "Shock Robot", "Paladin", "Sandman", "Demon Soldier"],
    epics: [ "Electro Robot", "Tree", "Hunter", "Eagle General", "Wolf Warrior"],
    legendaries: [ "War Machine", "Tiger Master", "Storm Giant", "Sheriff"],
    mythics: [
        "Rocket Chu", "Graviton", "Kitty Mage", "Lancelot", "Frog Prince", "Vayne",
        "Ninja", "Orc Shaman", "Pulse Generator", "Bomba", "Coldy", "Iron Meow", "Blob",
        "Dragon", "Monopoly Man", "Bat Man", "Indy", "Tar", "Lazy Taoist", "Mama", "Watt"
    ]
}

const pullTypes = [
    { name: "Common", chance: 30.8642, acquireChance: 50, possibleGuardians: guardians.commons },
    { name: "Rare", chance: 18.5185, acquireChance: 50, possibleGuardians: guardians.rares },
    { name: "Epic", chance: 12.3457, acquireChance: 50, possibleGuardians: guardians.epics },
    { name: "Legendary", chance: 9.2593, acquireChance: 50, possibleGuardians: guardians.legendaries },
    { name: "Mythic", chance: 1.8519, acquireChance: 5, possibleGuardians: guardians.mythics },
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
    // console.clear();
    let singlePulls = Math.trunc(inputField.value / 30);
    let tenPulls = Math.trunc(inputField.value / 300);
    let pull;
    let rerolls = 0;
    let reroll = false;
    let acquiresToReroll = 6;
    let acquires = 0;
    let pullsPerBatch = 10

    do {
        
        for (i = 0; i < pullsPerBatch; i++) {
            let pull = getRandomPull();
            if (addPullToList(pull)) {
                acquires += 1;
            }
        }
        if (acquires >= acquiresToReroll && pullsPerBatch != 14) {
            reroll = true;
            // console.log("Reroll " + acquires + "/" + acquiresToReroll);
            acquires = 0;
            acquiresToReroll += 1;
            pullsPerBatch += 1;
        }
        else {
            reroll = false;
            // console.log(acquires + "/" + acquiresToReroll);
            acquires = 0;
            acquiresToReroll = 6;
        }
    } while (reroll);

    console.table(recruitPulls)
    console.log(pull)

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
            let acquisition = pull.acquireChance > randomChance2 ? true : false;
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

function addPullToList(pull) {
    if (pull.acquisition) {
        if (!recruitPulls[pull.name]) {
            recruitPulls[pull.name] = pull;
            recruitPulls[pull.name].collected = 0;
        }
        recruitPulls[pull.name].collected += 1;
        return true;
    }
    else {
        return false;
    }
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
