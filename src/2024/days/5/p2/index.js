const fs = require("node:fs/promises");

async function day5() {
    try {
        // const data = await fs.readFile("./sample.txt", { encoding: "utf8" });
        const data = await fs.readFile("./input.txt", { encoding: "utf8" });
        const problemParts = data.split("\r\n");
        const rulesAndPagesSeparator = problemParts.findIndex(p => p === "");
        // ['x|y']
        const rules = problemParts.slice(0, rulesAndPagesSeparator)
        // ['a,b,c', 'x,y,z']
        const updates = problemParts.slice(rulesAndPagesSeparator + 1, problemParts.length)
        const usableRuleMap = createUsableRuleGraph(rules)
        // Answer
        console.log(findMiddleOfUnorderedThenReorderedUpdates(updates, usableRuleMap))
    } catch (err) {
        console.log(err);
    }
}

const findMiddleOfUnorderedThenReorderedUpdates = (updates, ruleMap) => {
    let middlePageNumberSum = 0;
    updates.forEach(update => {
        const parsedUpdate = parseUpdate(update)
        const isRightOrder = isUpdateInRightOrder(parsedUpdate, ruleMap)
        if (!isRightOrder) {
            // can we assume updates are always odd lengths & greater than 1?
            const orderedUpdate = orderUnorderedUpdate(parsedUpdate, ruleMap)
            const middlePageNumber = orderedUpdate[(orderedUpdate.length - 1) / 2]
            middlePageNumberSum += middlePageNumber
        }
    })

    return middlePageNumberSum
}

// We can know the ideal order based off the cardinality of the set from our map
const orderUnorderedUpdate = (unorderedUpdate, ruleMap) =>
    [...unorderedUpdate].sort((a, b) => {
        const aContainsB = ruleMap.get(a)?.has(b) ?? false
        const bContainsA = ruleMap.get(b)?.has(a) ?? false
        return aContainsB ? -1 : bContainsA ? 1 : 0
    })


const isUpdateInRightOrder = (update, ruleMap) => {
    return update.every((pageNumber, index) => {
        // if we didn't already short circuit, the last page is always fine
        const onLastPage = index === update.length - 1
        if (onLastPage) {
            return true
        }

        const aftersForPageNumber = ruleMap.get(pageNumber)
        const nextPageNumber = update[index + 1]

        if (!aftersForPageNumber || !aftersForPageNumber.has(nextPageNumber)) {
            return false
        }

        return true;
    })
}

// Map<string, Set<num>>
// 47 -> (53, 29, 13, 61)
const createUsableRuleGraph = (rules) => {
    const ruleMap = new Map();

    rules.forEach(rule => {
        const [before, after] = parseRule(rule)
        if (!ruleMap.has(before)) {
            ruleMap.set(before, new Set([after]))
            return
        }
        const currentRuleSet = ruleMap.get(before)
        currentRuleSet.add(after)
    })

    return ruleMap
}


//Utils

// 'X|Y' => [X,Y]
const parseRule = (rawRule) => rawRule.split("|").map(numString => Number(numString))
// 'A,B,C' => [A,B,C]
const parseUpdate = (rawUpdate) => rawUpdate.split(",").map(numString => Number(numString))

day5();