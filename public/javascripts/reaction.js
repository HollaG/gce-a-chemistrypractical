
// i will give you: 
calculateProducts = async function (id, condition) {
    var testTube = objectsInUse[id]
    var testTubeContents = testTube.contains
    console.log("hello loading script")
    mappedById = {}

    arrayOfReagentsWithIons = []

    // we hv to log the old reagents, so that we know whether
    // for example, can carbonate react w/ Al(OH)3? 
    // if the old reagents don't contain OH- (or NaOH), then no, carbonate can not 
    var old_reagents = []
    for (var i = 0; i < testTubeContents.length; i++) {


        console.log(i)
        var item = testTubeContents[i]
        // {
        //     formula_id_f: "Cl⁻ (aq)",
        //     formula_text: "chloride_1m_aq",
        //     old_reagentL: undefined,
        //     old_reagentR: undefined,
        //     volume: "1.67",
        // }

        if (item.old_reagentL) {
            if (Array.isArray(item.old_reagentL)) {
                item.old_reagentL.forEach(r => old_reagents.push(r))
            } else { old_reagents.push(item.old_reagentL) }
        }
        if (item.old_reagentR) {
            if (Array.isArray(item.old_reagentR)) {
                item.old_reagentR.forEach(r => old_reagents.push(r))
            } else { old_reagents.push(item.old_reagentR) }
        }



        var getIonsIfHave = JSON.parse(await Promise.resolve(($.get('/inspect/getIons', { reagent: encodeURI(item.formula_id_f.split(" ").join("_")) }))))
        if (getIonsIfHave.error) {
            // is an error
        } else {

            mappedById[item.formula_id_f.split(" ").join("_")] = {
                volume: Number(item.volume),
                formula_text: getIonsIfHave.formula_text,
                color: getIonsIfHave.color,
                odor: getIonsIfHave.odor,
                state: getIonsIfHave.state,
                cation: getIonsIfHave.cation,
                anion: getIonsIfHave.anion,
                hex: getIonsIfHave.hex,
                old_reagentL: item.old_reagentL,
                old_reagentR: item.old_reagentR
            }


            if (getIonsIfHave.cation || getIonsIfHave.anion) {
                var a = [
                    getIonsIfHave.cation,
                    getIonsIfHave.anion,
                    getIonsIfHave.formula_id
                ]
                arrayOfReagentsWithIons.push(a)
            } else {
                arrayOfReagentsWithIons.push(item.formula_id_f.split(" ").join("_"))
            }

            



        }


    }




    // condition: heat
    var condition = condition ? "heat" : ""

    // remove duplicates from our previous reagents array
    old_reagents = [...new Set(old_reagents)]
    old_reagents.push("none")
    console.log(old_reagents, "old_reagents")

    // ["Ni²⁺_(aq)", "Al³⁺_(aq)", "Cl⁻_(aq)", "H₂O_(l)", Array(3), Array(3)], {Ni²⁺_(aq): {…}, Al³⁺_(aq): {…}, Cl⁻_(aq): {…}, H₂O_(l): {…}, NaOH_(aq): {…}, …}
    reactionObject = {}
    console.log("arrayOfReagentsWithIons: ", arrayOfReagentsWithIons)
    ionRelated = {}
    for (var i = 0; i < arrayOfReagentsWithIons.length; i++) {

        var initialReactant = arrayOfReagentsWithIons[i]

        // this reactant has ions
        // var reactantData = JSON.parse(await Promise.resolve(($.get('/reagentData', { formula_id: encodeURI(initialReactant) }))))
        // console.log("reactantData", reactantData)



        // this reactant has no ions
        var reactantData = JSON.parse(await Promise.resolve(($.get('/reagentData', { formula_id: encodeURI(initialReactant) }))))
        console.log('loop ', i, reactantData)

        // Check if this initialReactant reacts with anything in the arrayOfReagentsWithIons



        // we have 3 conditions to fufil
        // 1) reagentL formula is X
        // 2) reagentR formula is Y
        // 3) condition is as stated
        // 4) old_reagents must contain the required reagent, if any





        // Goal: key is a reactant, and value is an array of reactants that react w/ the key


        reactantData.forEach(reactionWithOtherThing => {
            var required_old_reagent = reactionWithOtherThing.requires ? reactionWithOtherThing.requires : "none"
            var required_condition = reactionWithOtherThing.condition_1 ? reactionWithOtherThing.condition_1 : ""
            if (required_condition == condition && old_reagents.includes(required_old_reagent)) {
                // conditions 1, 3, 4are satisfied for a possible reaction
                // but we don't know if condition 2 is here
                arrayOfReagentsWithIons.forEach(otherThing => {
                    if (Array.isArray(otherThing)) {
                        if (otherThing.includes(reactionWithOtherThing.reacts_with_indiv_1)) {
                            // yes, reaction
                            var left = initialReactant
                            if (Array.isArray(left)) {
                                ionRelated[left[2]] = left
                                left = left[2]
                            }

                            var right = otherThing // remember this is an array
                            if (Array.isArray(right)) {
                                ionRelated[right[2]] = right
                                right = right[2]
                            }
                            // check if the left reactant exists in reaction object
                            // also check if the right reactant exists in reaction object
                            // the goal is to prevent things where the same reactant is in both the key and the value

                            // prefer arrays on the right

                            if (!reactionObject[left]) {
                                // left reactant not in object yet
                                if (!reactionObject[right]) {
                                    // right reactant also not in object yet
                                    reactionObject[left] = [right] // right side should be an array

                                } else {
                                    // right reactant in object
                                    var a = reactionObject[right]


                                    a.push(left)

                                    // remove dupes
                                    var b = removeDuplicates(a)
                                    reactionObject[right] = b

                                }
                            } else {
                                // left reactant in object
                                var a = reactionObject[left]
                                a.push(right)
                                var b = removeDuplicates(a)
                                reactionObject[left] = b

                            }





                        }
                    } else {
                        if (otherThing == reactionWithOtherThing.reacts_with_indiv_1) {
                            // yes, reaction
                            var left = initialReactant
                            if (Array.isArray(left)) {
                                ionRelated[left[2]] = left
                                left = left[2]
                            }
                            var right = otherThing
                            if (Array.isArray(right)) {
                                ionRelated[right[2]] = right
                                right = right[2]
                            }
                            // check if the left reactant exists in reaction object
                            // also check if the right reactant exists in reaction object
                            // the goal is to prevent things where the same reactant is in both the key and the value

                            // prefer arrays on the right

                            if (!reactionObject[left]) {
                                // left reactant not in object yet
                                if (!reactionObject[right]) {
                                    // right reactant also not in object yet

                                    reactionObject[left] = [right] // the right side shld be an array

                                } else {
                                    // right reactant in object
                                    var a = reactionObject[right]
                                    a.push(left)
                                    var b = removeDuplicates(a)
                                    reactionObject[right] = b

                                }
                            } else {
                                // left reactant in object
                                var a = reactionObject[left]
                                a.push(right)
                                var b = removeDuplicates(a)
                                reactionObject[left] = b

                            }
                        }
                    }
                })
            }




        })



    }
    /*
    console.log(reactionObject) 
    {
        'Ni²⁺_(aq)': [ [ 'Na⁺_(aq)', 'OH⁻_(aq)', 'NaOH_(aq)' ] ],
        'Al³⁺_(aq)': [
          [ 'Na⁺_(aq)', 'OH⁻_(aq)', 'NaOH_(aq)' ],
          [ 'Na⁺_(aq)', 'CO₃²⁻_(aq)', 'Na₂CO₃_(aq)' ]
        ],
        'Na⁺_(aq),CO₃²⁻_(aq),Na₂CO₃_(aq)': [ 'H₂O_(l)' ]
      }
    */
    // Reaction OBJECT WILl never have an array in the right side, only elements that are present


    // Time to start the ratio calculation and stuff

    // we need to check how many times reagents appear and stuff
    

    

    // start the volume calc and stuff

    var volCol = $.extend(true, {}, mappedById)
    
    mappedByIdTemp = $.extend(true, {}, mappedById)
    mappedByIdJustChangedVolumes = $.extend({}, mappedById)
    
    if (!Object.keys(reactionObject).length) return false

    reactionObjectTemp = $.extend(true, {}, reactionObject)
    async function __ () {
        mappedById = $.extend(true, {}, mappedByIdJustChangedVolumes)
        reactionObject = $.extend(true, {}, reactionObjectTemp)
        timesAppeared = {}
        for (key of Object.keys(reactionObject)) {
            if (timesAppeared[key]) {
                timesAppeared[key] = timesAppeared[key] + 1
            } else {
                timesAppeared[key] = 1
            }
    
            reactionObject[key].forEach(reagentR => {
                if (timesAppeared[reagentR]) {
                    timesAppeared[reagentR] = timesAppeared[reagentR] + 1
                } else {
                    timesAppeared[reagentR] = 1
                }
            })
    
    
    
        }
        for (reagentL of Object.keys(reactionObject)) {
            // each one need to check if its a cmpd
            var reagentLFinalVolume = Number(mappedById[reagentL].volume)
            for (var i = 0; i < reactionObject[reagentL].length; i++) {
                var reagentR = reactionObject[reagentL][i]
                var reagentRFinalVolume = Number(mappedById[reagentR].volume)



                // First, check if this is an ion
                var left = reagentL
                var right = reagentR
                if (ionRelated[reagentR]) {
                    right = ionRelated[reagentR]
                }
                if (ionRelated[reagentL]) {
                    left = ionRelated[reagentL]
                }
                // change into the ions
                var data = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: left, right: right }))))

                console.log("result of reaction", data)
                console.log(reagentL, reagentR)

                // Now, because the data can be more than 1 product, we'll calculate per one



                var volumeOfLLeft = (Number(mappedById[reagentL].volume) / Number(timesAppeared[reagentL])) / reactionObject[reagentL].length
                var volumeOfRLeft = (Number(mappedById[reagentR].volume) / Number(timesAppeared[reagentR]))
                var volumeOfWaterProducedForThisReaction = 0
                var volumeOfProductProducedForThisReaction = 0
                function _() {
                    for (var j = 0; j < data.length; j++) {
                        var product = data[j]
                        // length of its value array + number of times appearing elsewhere
                        // number of times appearing elsewhere is timesAppeared-1

                        var volumeOfReagentLForThisReaction = (Number(mappedById[reagentL].volume) / Number(timesAppeared[reagentL])) / reactionObject[reagentL].length / data.length
                        var volumeOfReagentRForThisReaction = (Number(mappedById[reagentR].volume)) / Number(timesAppeared[reagentR]) / data.length
                        var ratio = product.ratio


                        var reagentLUsed;
                        var reagentRUsed;


                        if (volumeOfReagentLForThisReaction / Number(ratio) >= volumeOfReagentRForThisReaction) {
                            // excessL
                            // end: R gone, L excess
                            reagentLUsed = volumeOfReagentRForThisReaction * Number(ratio)
                            reagentRUsed = volumeOfReagentRForThisReaction
                            reagentLFinalVolume = reagentLFinalVolume - reagentLUsed
                            reagentRFinalVolume = reagentRFinalVolume - reagentRUsed
                            volumeOfLLeft = volumeOfLLeft - reagentLUsed
                            volumeOfRLeft = volumeOfRLeft - reagentRUsed
                            mappedByIdTemp[reagentL].volume = Number((mappedByIdTemp[reagentL].volume - reagentLUsed).toFixed(2))
                            mappedByIdTemp[reagentR].volume = Number((mappedByIdTemp[reagentR].volume - reagentRUsed).toFixed(2))
                            mappedByIdJustChangedVolumes[reagentL].volume = Number((mappedByIdJustChangedVolumes[reagentL].volume - reagentLUsed).toFixed(2))
                            mappedByIdJustChangedVolumes[reagentR].volume = Number((mappedByIdJustChangedVolumes[reagentR].volume - reagentRUsed).toFixed(2))

                        } else if (volumeOfReagentLForThisReaction / Number(ratio) < volumeOfReagentRForThisReaction) {
                            // excess R
                            reagentLUsed = volumeOfReagentLForThisReaction
                            reagentRUsed = volumeOfReagentLForThisReaction / Number(ratio)
                            reagentLFinalVolume = reagentLFinalVolume - reagentLUsed
                            reagentRFinalVolume = reagentRFinalVolume - reagentRUsed
                            volumeOfLLeft = volumeOfLLeft - reagentLUsed
                            volumeOfRLeft = volumeOfRLeft - reagentRUsed
                            mappedByIdTemp[reagentL].volume = Number((mappedByIdTemp[reagentL].volume - reagentLUsed).toFixed(2))
                            mappedByIdTemp[reagentR].volume = Number((mappedByIdTemp[reagentR].volume - reagentRUsed).toFixed(2))
                            mappedByIdJustChangedVolumes[reagentL].volume = Number((mappedByIdJustChangedVolumes[reagentL].volume - reagentLUsed).toFixed(2))
                            mappedByIdJustChangedVolumes[reagentR].volume = Number((mappedByIdJustChangedVolumes[reagentR].volume - reagentRUsed).toFixed(2))

                        }

                        // add the product
                        if (mappedByIdTemp[product.formula_id]) {
                            mappedByIdTemp[product.formula_id].volume = Number((mappedByIdTemp[product.formula_id].volume + reagentLUsed).toFixed(2))
                        } else {
                            mappedByIdTemp[product.formula_id] = {
                                volume: Number((reagentLUsed).toFixed(2)),
                                formula_text: product.formula_text,
                                color: product.color,
                                odor: product.odor,
                                state: product.state,
                                cation: product.cation,
                                anion: product.anion,
                                old_reagentL: reagentL,
                                old_reagentR: reagentR,
                                hex: product.hex
                            }
                            if (ionRelated[reagentL]) { 
                                mappedByIdTemp[product.formula_id].old_reagentL = ionRelated[reagentL]
                            }
                            if (ionRelated[reagentR]) { 
                                mappedByIdTemp[product.formula_id].old_reagentL = ionRelated[reagentR]
                            }

                        }



                    }
                    if ((volumeOfLLeft != 0 && volumeOfRLeft != 0)) {
                        // we defintely need at least one of them to be equal to zero, so if both arent 0, then fk it react again
                        _()
                    } else {

                    }

                    


                }
                _()
                // reagentR can be zero
                if (Number(reagentRFinalVolume.toFixed(2)) == 0) { 
                    var a = reactionObjectTemp[reagentL]
                    console.log(a, "aasjkdasijdfbsakldn askldsa")
                    a.splice(i, 1)
                    reactionObjectTemp[reagentL] = a
                }
                

                console.log("Finished reaction.")
                console.log(reagentL, "finished with", volumeOfLLeft, reagentR, "finished with", volumeOfRLeft)

                console.log("Final of", reagentR, "is", reagentRFinalVolume)
            }
            // reagentL can be zero
            if (Number(reagentLFinalVolume.toFixed(2)) == 0)
                delete reactionObjectTemp[reagentL]

            console.log("Final of ", reagentL, "is", reagentLFinalVolume)

        }

        console.log("mappedByIdTemp", mappedByIdTemp)
        console.log("---------")
        console.log("mappedByIdJustChangeVolume", mappedByIdJustChangedVolumes)

        if (Object.keys(reactionObjectTemp).length) { 
            var stillHasReactants = false
            for (key of Object.keys(reactionObjectTemp)) { 
                if (reactionObjectTemp[key].length) { 
                    stillHasReactants = true
                }
            }   
            if (stillHasReactants) { 
                await __()
            } else { 
                return 
            }
        } else { 
            return
        }

       
    }
    await __()
    
    var zero = []
    for (key of Object.keys(mappedByIdTemp)) { 
        if (mappedByIdTemp[key].volume == 0) zero.push(key)
    }
    zero.forEach(z => delete mappedByIdTemp[z])
    console.log("final product to return", mappedByIdTemp)

    return {
        volColTemp: mappedByIdTemp,
        volCol: volCol
    }

}   

function removeDuplicates(arr) {
    var t = []
    arr.forEach(e => {
        if (!JSON.stringify(t).includes(JSON.stringify(e)))
            t.push(e)
    })
    return t
}











