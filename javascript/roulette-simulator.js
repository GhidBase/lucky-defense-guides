/*
    Roulette Calculator
    Will calculate the efficiency of different goals for
    the roulette spin in Lucky Defense


    Relevant Artifacts:
     - Skull Stone: Has a 15% chance to refund
    the cost when roulette summon fails
     - Gamblers Wrist: Has 15% chance to gain
    lower tier guardian when roulette summon fails
     - Horn: Increases epic summon chance by 7.5%
    in the roulette summon
     - Golden Dice: Increases legendary summon
    chance by 4.2% in the roulette summon
     - Receipt: Gains +1 luck stone by 4.5%
    when selling a guardian

    Default Rates:
    Rare: 60%
    Epic: 20%
    Legendary: 10%

    Artifact Level 6 Rates:
    Rare: 60%
    Epic: 35%
    Legendary: 14.2%
    Get lower tier guardian: 15% on fail
    Refund on fail: 15% on fail
    Get +1 stone on sell: 4.5%
*/




const runSimButton = document.getElementById("sim-button");
const simSettingsForm = document.getElementById("roulette-form");
simSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runSim(
        simSettingsForm["luck-stones"].value,
        simSettingsForm.rarity.value,
        simSettingsForm["artifact-details"].checked,
        simSettingsForm["sell-or-merge"].value,
        simSettingsForm["show-every-roll"].checked
    );
});

const expandDetailsButton = document.getElementById("expand-details-button");
const detailsPanel = document.getElementById("details-panel");
expandDetailsButton.addEventListener("click", () => {
    detailsPanel.classList.toggle("hidden");
});

const rouletteLogButton = document.getElementById("roulette-log-button");
const rouletteLog = document.getElementById("roulette-log");
rouletteLogButton.addEventListener("click", () => {
    if (rouletteLog.innerHTML != "") {
        rouletteLog.classList.toggle("hidden");
    }
});

const showSummaryButton = document.getElementById("simulation-summary-button");
const summaryPanel = document.getElementById("summary-panel");
showSummaryButton.addEventListener("click", () => {
    summaryPanel.classList.toggle("hidden");
});












function runSim(
    stones,
    rarity,
    artifactDetails = true,
    sellOrMergeLowRarity,
    showEachroll
) {
    console.clear();
    const resultsElement = document.getElementById("summary-panel");
    resultsElement.innerHTML = "";

    //#region main script
    let guardians = 0;
    let lowerTier = 0;
    let lowerTierSold = 0;
    let refunds = 0;
    let extraStonesFromReceipt = 0;

    // Build an array of results from this for loop
    //
    // START HERE
    let pullLog = [];
    for (let i = stones; i > 0; rarity == "legendary" ? (i -= 2) : i--) {
        let results = rouletteSpin(rarity);
        console.log(`luck stones left: ${i}`);
        pullLog.push(`luck stones left: ${i}`);
        let result = displayResults(
            results.newGuardian,
            results.refund,
            results.lowerTier,
            rarity,
            sellOrMergeLowRarity
        );

        if (results.refund) {
            i++;
            refunds++;
            if (rarity == "legendary") {
                i++;
            }
        }
        if (results.lowerTier) {
            lowerTier++;
            let extraStoneFromSell;
            if (sellOrMergeLowRarity == "sell") {
                switch (rarity) {
                    case "epic":
                        i++;
                        lowerTierSold++;
                        break;

                    case "legendary":
                        i++;
                        lowerTierSold++;
                        i++;
                        lowerTierSold++;
                        break;
                }

                extraStoneFromSell = fourAndHalfPercentRoll();
                if (extraStoneFromSell) {
                    i++;
                    extraStonesFromReceipt++;
                }
                if (extraStoneFromSell && showEachroll) {
                    console.log(`Got extra stone from receipt`);
                    pullLog.push(`Got extra stone from receipt`);
                }
            }
        }
        if (results.newGuardian) {
            guardians++;
        }
    }
    const rouletteLogContainer = document.getElementById("roulette-log");
    rouletteLogContainer.innerHTML = "";

    pullLog.forEach((element) => {
        const newP = document.createElement("p");
        if (element.includes("luck stones left")) {
            newP.innerHTML = `<b>${element}<b>`;
        } else {
            newP.innerHTML = ` - ${element}`;
        }
        rouletteLogContainer.appendChild(newP);
        // addElementToResults("p", element);
    });
    if (pullLog.length !== 0) {
        addElementToResults("br");
    }
    console.log(pullLog);

    function displayResults(
        newGuardian,
        refund,
        lowerTier,
        rarity,
        sellOrMerge
    ) {
        let result = "";
        if (newGuardian) {
            const gotGuardian = `Got an ${rarity} guardian`;
            console.log(gotGuardian);
            pullLog.push(gotGuardian);
        } else {
            const failedSpin = `Failed spin`;
            console.log(failedSpin);
            pullLog.push(failedSpin);
            if (refund) {
                const refundedRoll = "Refunded roll";
                console.log(refundedRoll);
                pullLog.push(refundedRoll);
            }
            if (lowerTier) {
                const gotLowerTierGuardian = `Got a lower rarity guardian from Gambler's Wrist${
                    sellOrMerge == "sell"
                        ? " (sold)"
                        : " (saving it for merging)"
                }`;
                console.log(gotLowerTierGuardian);
                pullLog.push(gotLowerTierGuardian);
            }
        }
    }

    // END HERE
    if (sellOrMergeLowRarity == "sell") {
        lowerTier = 0;
    }

    let costPerLegendary;
    let legendaryCount;
    let costPerEpic;
    let epicCount;
    let mergedRares;
    let mergedEpics;

    const lowerTierConverted = Math.floor(lowerTier / 3);
    const totalGuardians = guardians + lowerTierConverted;
    const averageCostPerGuardian =
        Math.trunc((stones / totalGuardians) * 10) / 10;

    if (rarity == "epic") {
        mergedEpics = totalGuardians - (totalGuardians % 3);
        legendaryCount = Math.trunc(totalGuardians / 3);
        costPerLegendary = Math.trunc((stones / legendaryCount) * 10) / 10;
    }

    if (rarity == "rare") {
        mergedRares = totalGuardians - (totalGuardians % 3);
        epicCount = Math.trunc(totalGuardians / 3);
        costPerEpic = Math.trunc((stones / epicCount) * 10) / 10;

        mergedEpics = epicCount - (epicCount % 3);
        legendaryCount = Math.trunc(epicCount / 3);
        costPerLegendary = Math.trunc((stones / legendaryCount) * 10) / 10;
    }

    //#endregion

    let extraMessage =
        sellOrMergeLowRarity == "sell"
            ? " (selling low rarities)"
            : " (merging low rarities)";

    //#region display results

    console.log("____________________________________________________");
    console.log(
        `${stones} stones ${rarity} roulette simulation${extraMessage}:`
    );
    console.log("____________________________________________________");

    console.log(`${rarity} count: ${totalGuardians}`);

    if (epicCount) {
        console.log(`epic count: ${epicCount} (merged ${mergedRares} rares)`);
    }
    if (legendaryCount) {
        console.log(
            `legendary count: ${legendaryCount} (merged ${mergedEpics} epics)`
        );
    }

    console.log("");
    console.log(`stones used: ${stones}`);
    console.log(
        `average cost per ${rarity}: ${averageCostPerGuardian} stones (${stones} stones / ${totalGuardians} ${rarity})`
    );
    if (epicCount) {
        console.log(
            `average cost per epic: ${costPerEpic} (${stones} stones / ${epicCount} epic)`
        );
    }
    if (legendaryCount) {
        console.log(
            `average cost per legendary ${costPerLegendary} (${stones} stones / ${legendaryCount} legendary)`
        );
    }

    if (artifactDetails) {
        console.log("\n");
        if (sellOrMergeLowRarity == "sell") {
            console.log(`stones from lower rarities sold: ${lowerTierSold}`);
            console.log(`stones from receipt: ${extraStonesFromReceipt}`);
        } else {
            console.log(`lower rarity guardian count: ${lowerTier}`);
            console.log(`lower rarity merges: ${Math.trunc(lowerTier / 3)}`);
            console.log(`total ${rarity} pulls: ${guardians}`);
            console.log(
                `total ${rarity} pulls: ${guardians} + ${lowerTierConverted} from gamblers wrist`
            );
        }
        console.log(`refunds: ${refunds}`);
    }

    console.log("\n\n\n");

    //#endregion

    //#region render results

    addElementToResults("h3", "Sim Settings");
    addElementToResults("p", `Starting stones: ${stones}`);
    addElementToResults(
        "p",
        `Rarity: ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`
    );
    addElementToResults(
        "p",
        `Gambler's Wrist summons: ${
            sellOrMergeLowRarity.charAt(0).toUpperCase() +
            sellOrMergeLowRarity.slice(1)
        }`
    );
    addElementToResults("br");

    addElementToResults("h3", "Main Results");
    addElementToResults(
        "p",
        `${
            rarity.charAt(0).toUpperCase() + rarity.slice(1)
        } count: ${totalGuardians}`
    );
    if (epicCount) {
        addElementToResults(
            "p",
            `Epic count: ${epicCount} (merged ${mergedRares} rares)`
        );
    }
    if (legendaryCount) {
        addElementToResults(
            "p",
            `Legendary count: ${legendaryCount} (merged ${mergedEpics} epics)`
        );
    }
    addElementToResults("br");

    addElementToResults("h3", "Average Costs");
    addElementToResults(
        "p",
        `Average cost per ${rarity}: ${averageCostPerGuardian} stones (${stones} stones/${totalGuardians} epics)`
    );
    if (epicCount) {
        addElementToResults(
            "p",
            `Average cost per epic: ${costPerEpic} (${stones} stones / ${epicCount} epic)`
        );
    }
    if (legendaryCount) {
        addElementToResults(
            "p",
            `Average cost per legendary ${costPerLegendary} (${stones} stones / ${legendaryCount} legendaries)`
        );
    }
    addElementToResults("br");

    if (artifactDetails) {
        addElementToResults("h3", `Gamblers Wrist (${sellOrMergeLowRarity})`);
        addElementToResults(
            "p",
            `Has 15% chance to gain lower tier guardian when roulette summon fails.`,
            true
        );

        if (sellOrMergeLowRarity == "sell") {
            addElementToResults(
                "p",
                `Stones from lower rarities sold: ${lowerTierSold}`
            );
            addElementToResults("h3", `Receipt (sell)`);
            addElementToResults(
                "p",
                `Receipt gains +1 luck stone by 4.5% when selling a guardian.`,
                true
            );
            addElementToResults(
                "p",
                `Stones from receipt: ${extraStonesFromReceipt}`
            );
        } else {
            addElementToResults(
                "p",
                `Lower rarity guardians gained: ${lowerTier}`
            );
            addElementToResults(
                "p",
                `Lower rarity merges: ${Math.trunc(lowerTier / 3)}`
            );
            addElementToResults(
                "p",
                `Total ${rarity} pulls: ${guardians} + ${lowerTierConverted} from gamblers wrist merging`
            );
        }
        addElementToResults("br");

        addElementToResults("h3", "Skull Stone");
        addElementToResults(
            "p",
            `Has a 15% chance to refund the cost when roulette summon fails.`,
            true
        );
        addElementToResults("p", `Refunds from skull stone: ${refunds}`);
    }

    function addElementToResults(type, textContent, bold) {
        const newElement = document.createElement(type);
        newElement.innerHTML = bold ? `<b>${textContent}</b>` : textContent;
        resultsElement.appendChild(newElement);
    }

    //#endregion

summaryPanel.classList.remove("hidden");

}

function rouletteSpin(rarity) {
    let newGuardian = rouletteGetGuardian(rarity);
    let refund = false;
    let lowerTier = false;
    if (!newGuardian) {
        refund = fifteenPercentRoll();
        lowerTier = fifteenPercentRoll();
    }

    return { newGuardian, refund, lowerTier };
}

function rouletteGetGuardian(rarity) {
    generatedChance = Math.random();
    let neededChance;
    // Choose a type of spin
    switch (rarity) {
        case "epic":
            neededChance = 0.35;
            break;

        case "rare":
            neededChance = 0.6;
            break;

        case "legendary":
            neededChance = 0.142;
    }

    return generatedChance < neededChance;
}

function fifteenPercentRoll() {
    generatedChance = Math.random();
    let neededChance = 0.15;

    return generatedChance < neededChance;
}

function fourAndHalfPercentRoll() {
    generatedChance = Math.random();
    let neededChance = 0.045;

    return generatedChance < neededChance;
}

