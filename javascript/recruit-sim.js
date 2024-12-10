let inputField = document.querySelector("#scroll-input");
let useScrollsButton = document.querySelector("#use-scrolls-button");
useScrollsButton.addEventListener("click",calculatePulls);
let singlePullList = document.querySelector("#singleList");
let tenPullList = document.querySelector("#tenList");


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

const sortOrder = [
    "Common", "Rare", "Epic", "Legendary", "Mythic", "Gold +200",
    "Gold +400", "Gold +600", "Diamond +10", "Diamond +20", "Diamond +30",
    "Mythic Stone +1", "Mythic Stone +2"
];

function calculatePulls() {
    // console.clear();
    let timesToDoOneX = Math.trunc(inputField.value / 30);
    let oneXPulls = simulateBatchOfRecruiting(timesToDoOneX);
    oneXPulls.sort((a, b) => {
        return sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type);
    });

    let timesToDoTenX = Math.trunc(inputField.value / 300);
    let tenXPulls = simulateBatchOfRecruiting(timesToDoTenX, 10);
    tenXPulls.sort((a, b) => {
        return sortOrder.indexOf(a.type) - sortOrder.indexOf(b.type);
    });
    

    oneXPulls = sumResources(oneXPulls);
    displayListOnScreen(singlePullList, oneXPulls);

    tenXPulls = sumResources(tenXPulls);
    displayListOnScreen(tenPullList, tenXPulls);

}

function displayListOnScreen(list, pulls) {
    list.replaceChildren();
    for(item of pulls) {
        addItemToList(list, item.name + " " + item.collected);
    }
}

function simulateBatchOfRecruiting(numberOfPulls, pullIncrement = 1) {
    let pullType = numberOfPulls;
    let pull;
    let rerolls = 0;
    let reroll = false;
    let acquiresToReroll = 6;
    let acquires = 0;
    let pullsPerBatch = 10
    let recruitPulls = {};

    for (y = 0; y < numberOfPulls; y++) {
        do {
        
            for (i = 0; i < pullsPerBatch; i++) {
                let pull = getRandomPull();
                if (addPullToList(pull, recruitPulls, pullIncrement)) {
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
    }

    return Object.entries(recruitPulls).map(([index, item]) => ({
        name: item.name,
        collected: item.collected,
        type: item.pullType
    }))
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

function addPullToList(pull, recruitPulls, pullIncrement) {
    if (pull.acquisition) {
        if (!recruitPulls[pull.name]) {
            recruitPulls[pull.name] = pull;
            recruitPulls[pull.name].collected = 0;
        }
        recruitPulls[pull.name].collected += pullIncrement;
        return true;
    }
    else {
        return false;
    }
}

function addItemToList(listChoice, text) {
    let listItem = document.createElement("li");
    listItem.textContent = text;
    listChoice.appendChild(listItem);
}

function sumGoldValues(list) {
    goldless = list.filter((item) => {
        return (!item.name.includes("Gold +200") && !item.name.includes("Gold +400") && !item.name.includes("Gold +600"))
    });

    goldOnly = list.filter((item) => {
        return (item.name.includes("Gold +200") || item.name.includes("Gold +400") || item.name.includes("Gold +600"))
    });

    let totalGold = goldOnly.reduce((total, item) => {
        return total += item.name.split(" ")[1] * item.collected
    },0)

    if (totalGold > 0) {
        goldless.push({
            name: "Gold",
            collected: totalGold,
            type: "Gold",
        })
    }


    return goldless
}

function sumMythicStonesValues(list) {
    stoneless = list.filter((item) => {
        return (!item.name.includes("Stone"))
    });

    stonesOnly = list.filter((item) => {
        return (item.name.includes("Mythic Stone +1") || item.name.includes("Mythic Stone +2"))
    });

    let totalStones = stonesOnly.reduce((total, item) => {
        return total += item.name.split(" ")[2] * item.collected
    },0)

    if (totalStones > 0) {stoneless.push({
        name: "Mythic Stones",
        collected: totalStones,
        type: "Mythic Stones",
        })
    }

    

    return stoneless
}

function sumDiamondValues(list) {
    diamondless = list.filter((item) => {
        return (!item.name.includes("Diamond"))
    });

    diamondOnly = list.filter((item) => {
        return (item.name.includes("Diamond +10") || item.name.includes("Diamond +20") || item.name.includes("Diamond +30"))
    });

    let totalDiamond = diamondOnly.reduce((total, item) => {
        return total += item.name.split(" ")[1] * item.collected
    },0)

    if (totalDiamond > 0) {diamondless.push({
        name: "Diamond",
        collected: totalDiamond,
        type: "Diamond",
        })
    }

    

    return diamondless
}

function sumResources(pulls) {
    let summedResources = sumGoldValues(pulls);
    summedResources = sumDiamondValues(summedResources);
    summedResources = sumMythicStonesValues(summedResources);
    return summedResources;
}
/*
    GOALS
    - sum gold/diamonds/mythic stones
    - sum common/rare/epic/legendary/mythic pulls
    - color coding
    - show the number of double/triple pulls
    - pull until you get a mythic

    PLAN FOR SUM GOLD
    Filter gold values and Filter non gold values
    Reduce gold values
    Push the new gold value to non gold value list

*/

