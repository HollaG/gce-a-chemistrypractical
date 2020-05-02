class Apparatus {
    constructor(obj, div_id) {
        this.apparatus_id = obj.apparatus_id;
        this.item_name = obj.item_name;
        this.interact_with = obj.interact_with;
        this.capacity = obj.capacity;
        this.location = obj.location;
        this.image_url = obj.image_url;
        this.div_id = div_id
        this.spaceUsed = 0
        this.type = obj.type;
        this.attribute = obj.attribute
        this.contains = []
    }

    get chemVols() { 
        var a = 0
        this.contains.forEach(e => { 
            if (e.formula_id_f.split(" ")[1] == "(aq)") { 
                a = a + e.volume
            }
        })
        return a

    }

    get remainingSpace() {
        return this.capacity - this.spaceUsed
    }

}

class Chemical {
    constructor(obj) {
        this.formula_id = obj.formula_id;
        this.formula_text = obj.formula_text;
        this.name = obj.name;
        this.class = obj.class;
        this.odor = obj.odor;
        this.cation = obj.cation;
        this.anion = obj.anion;
        this.location = obj.location;
        this.special_name = obj.special_name;
        this.type = obj.type;
        this.color = obj.color;
        this.state = obj.state;
        this.hex = obj.hex

    }
}

class BenchReagent extends Chemical {
    constructor(obj1, div_id) {
        super(obj1);
        this.div_id = div_id

    }
}

class FAReagent extends Chemical {
    constructor(obj, reactionData, div_id) {
        super(obj);
        this.div_id = div_id

        this.reactions = reactionData

    }
    get reactsWith() {
        var arr = []
        this.reactions.forEach(reaction => {
            if (reaction.reacts_with_class_1) {
                arr.push(reaction.reacts_with_class_1)
            } else if (reaction.reacts_with_indiv_1) {
                arr.push(reaction.reacts_with_indiv_1)
            }
        })
        return arr

    }
    get doesNotReactWith() {
        var arr = []
        this.reactions.forEach(reaction => {
            if (reaction.does_not_react_indiv_1) {
                arr.push(reaction.does_not_react_indiv_1)
            }
        })
    }

}

class Reactant extends Chemical {
    constructor(obj) {
        super(obj);
        this.reacts_with_class_1 = obj.reacts_with_class_1;
        this.reacts_with_indiv_1 = obj.reacts_with_indiv_1;
        this.does_not_react_indiv_1 = obj.does_not_react_indiv_1;
        this.condition_1 = obj.condition_1;
        this.produces_1 = obj.produces_1;
        this.reacts_with_class_2 = obj.reacts_with_class_2;
        this.reacts_with_indiv_2 = obj.reacts_with_indiv_2;
        this.does_not_react_indiv_2 = obj.does_not_react_indiv_2;
        this.condition_2 = obj.condition_2;
        this.produces_2 = obj.produces_2;


    }

    async checkIfReactable(otherReagents) { // take in a bunch of reagents and checks if this reagent reacts. Will return either a) empty array --> no reaction, b) array of other reagents that it reacts with
        var otherReagents = otherReagents
        // if (!Array.isArray(otherReagents)) { 
        //     otherReagents = otherReagents.split()
        // }
        var reactsWith = []
        if (this.cation || this.anion) {
            // means that this is a compound. We gotta check if it can react too
            var cationData = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: [this.cation] }))))
            var possibleCationReactions = cationData.map(row => row.reacts_with_indiv_1)
            var anionData = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: [this.anion] }))))
            var possibleAnionReactions = anionData.map(row => row.reacts_with_indiv_1)
            console.log(cationData, possibleCationReactions, anionData, possibleAnionReactions, "------------------")
            // if the cation reacts with one of the reagents, we need to add it to reactsWith in the form
            // [{this.formula_id: reagent}]
            otherReagents.forEach(reagent => {
                if (Array.isArray(reagent)) {
                    // compound, first element is cation. second is anion. third is compound'
                    var isReactable = false
                    reagent.forEach(ion => {
                        if (possibleCationReactions.includes(ion) || possibleAnionReactions.includes(ion)) {
                            isReactable = true
                        }
                    })
                    if (isReactable) {
                        var temp = {}
                        temp[this.formula_id] = reagent
                        reactsWith.push(temp)
                    }
                }

            })


        } else {
            
            otherReagents.forEach(reagent => { // for every reagent
                if (Array.isArray(reagent)) {
                    // compound, first element is cation. second is anion. third is compound'
                    var isReactable = false
                    reagent.forEach(ion => {
                        if (ion == this.reacts_with_indiv_1) {
                            isReactable = true
                        }
                    })
                    if (isReactable) {
                        var temp = {}
                        temp[this.formula_id] = reagent
                        reactsWith.push(temp)
                    }

                } else if (reagent == this.reacts_with_indiv_1) {
                    var temp = {}
                    temp[this.formula_id] = reagent
                    reactsWith.push(temp)
                }


            })
        }




        return reactsWith

    }

    get reactsWith() {
        var arr = []
        this.reactions.forEach(reaction => {
            if (reaction.reacts_with_class_1) {
                arr.push(reaction.reacts_with_class_1)
            } else if (reaction.reacts_with_indiv_1) {
                arr.push(reaction.reacts_with_indiv_1)
            }
        })
        return arr

    }
    get doesNotReactWith() {
        var arr = []
        this.reactions.forEach(reaction => {
            if (reaction.does_not_react_indiv_1) {
                arr.push(reaction.does_not_react_indiv_1)
            }
        })
    }
}