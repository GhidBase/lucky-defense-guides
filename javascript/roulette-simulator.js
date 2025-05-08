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

function runSim(
    stones,
    rarity,
    reportType = "normal",
    sellOrMergeLowRarity,
    showEachroll
) {
    //#region main script
    let guardians = 0;
    let lowerTier = 0;
    let lowerTierSold = 0;
    let refunds = 0;
    let extraStonesFromReceipt = 0;

    for (let i = stones; i > 0; rarity == "legendary" ? (i -= 2) : i--) {
        let results = rouletteSpin(rarity);
        if (showEachroll) {
            console.log(`luck stones left: ${i}`);
            displayResults(
                results.newGuardian,
                results.refund,
                results.lowerTier,
                rarity,
                sellOrMergeLowRarity
            );
        }
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
                }
            }
        }
        if (results.newGuardian) {
            guardians++;
        }
    }
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

    //#region display results
    let extraMessage =
        sellOrMergeLowRarity == "sell"
            ? " (selling low rarities)"
            : " (merging low rarities)";
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

    if (reportType == "normal") {
        console.log("\n");
        if (sellOrMergeLowRarity == "sell") {
            console.log(`stones from lower rarities sold: ${lowerTierSold}`);
            console.log(`stones from receipt: ${extraStonesFromReceipt}`);
            console.log(
                `total ${rarity} pulls: ${guardians} + ${lowerTierConverted} from skull stone`
            );
        } else {
            console.log(`lower rarity guardian count: ${lowerTier}`);
            console.log(`lower rarity merges: ${Math.trunc(lowerTier / 3)}`);
            console.log(`total ${rarity} pulls: ${guardians}`);
        }
        console.log(`refunds: ${refunds}`);
    }

    console.log("\n\n\n");
    //#endregion
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

function displayResults(newGuardian, refund, lowerTier, rarity, sellOrMerge) {
    if (newGuardian) {
        console.log(`Got an ${rarity} guardian`);
    } else {
        console.log(`Failed spin`);
        if (refund) {
            console.log(`Refunded roll`);
        }
        if (lowerTier) {
            console.log(
                `Got a lower rarity guardian${
                    sellOrMerge == "sell" ? " (sold)" : ""
                }`
            );
        }
    }
}

// runSim(100, "rare", "short");

// runSim(100, "epic", "short");

// runSim(100000, "rare");
// runSim(100000, "epic", "simple", "sell");
// runSim(stones, rarity, sell or merge, extra info at bottom)
runSim(100, "epic", "normal", "sell", false);

// runSim(100000, "legendary", "simple", "sell");
// runSim(100000, "legendary", "simple");
