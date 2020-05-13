

$(document).ready(function () {

    var isMoving = false // used to check if you click on another div when youre holding a div
    var preventMove = false // used to check when youre clicking on a link in the popup
    var heldItem = ""
    objectsUsed = {

    }
    var currentlyMovingElem = ''
    var mostRecentApparatus;
    var mostRecentChemical;

    var tubes = {}
    var bench = {}
    var reagents = {}

    var hasLitmus = ""
    var placedLitmus;

    objectsInUse = {

    }

    var popupInfo = {

    }

    var toAddExcess = ["NaOH_(aq)",
        "NH₃_(aq)",
        "HCl_(aq)",
        "HNO₃_(aq)",
        "H₂SO₄_(aq)",
        "AgNO₃_(aq)",
        "BaNO₃_(aq)",
        "Ca(OH)₂_(aq)",
        "KMnO₄_(aq)",
        "KI_(aq)"]

    inventoryContents = {

    }

    var inventoryContentsOpp = {

    }

    preventInventory = false

    var bunsenOn = false
    var bunsenLit = false
    var heatShieldInPlace = false
    var gogglesWorn = false

    var listenToMouseMove = true
    light = function () {
        console.log('try light')
        if (bunsenOn && currentlyMovingElem.split("-")[0] == "lighter" && !bunsenLit) {
            bunsenLit = true
            $('.light').addClass("lit")
            var warnings = []
            if (!heatShieldInPlace) {
                warnings.push("WARNING: <b>Heat Shield</b> not in proper position. (Click on it)")
            }
            if (!gogglesWorn) {
                warnings.push("WARNING: <b>Safety Goggles</b> not worn. (Put in inventory)")
            }
            if (warnings.length) {
                alertify.prompt(warnings.join("<br />"), (evt, value) => $('.ajs-cancel').show(), () => $('.ajs-cancel').show()).setHeader(`Warnings (${warnings.length})`)
                $('.ajs-input').hide()
                $('.ajs-cancel').hide()
            }
        }


    }

    toggleBunsen = function () {
        if (bunsenOn && heatShieldInPlace) {
            // bunsen burner ON, heatshield in place   
            $('.light').removeClass("lit")
            bunsenOn = false
            bunsenLit = false
            $('body').css({
                'background-image': "url(/images/background-heat-shield.jpg)"
            })
        } else if (!bunsenOn && heatShieldInPlace) {
            // bunsen burner OFF, heatshield in place
            bunsenOn = true

            $('body').css({
                'background-image': "url(/images/background-tap-on-heat-shield.jpg)"
            })
        } else if (bunsenOn && !heatShieldInPlace) {
            // bunsen burner ON, heatshield not in place
            bunsenOn = false
            bunsenLit = false
            $('.light').removeClass("lit")
            $('body').css({
                'background-image': "url(/images/background.jpg)"
            })
        } else if (!bunsenOn && !heatShieldInPlace) {
            // bunsen burner off, heatshield not in place
            bunsenOn = true
            $('body').css({
                'background-image': "url(/images/background-tap-on.jpg)"
            })

        }

    }

    toggleHeatShield = function () {
        if (bunsenOn && heatShieldInPlace) {
            // bunsen burner ON, heatshield in place   
            heatShieldInPlace = false
            $('body').css({
                'background-image': "url(/images/background-tap-on.jpg)"
            })
            $('.heat-shield-1').toggleClass("new-1")
            $('.heat-shield-2').toggleClass("new-2")
            $('.heat-shield-3').toggleClass("new-3")
        } else if (!bunsenOn && heatShieldInPlace) {
            // bunsen burner OFF, heatshield in place
            heatShieldInPlace = false
            $('body').css({
                'background-image': "url(/images/background.jpg)"
            })
            $('.heat-shield-1').toggleClass("new-1")
            $('.heat-shield-2').toggleClass("new-2")
            $('.heat-shield-3').toggleClass("new-3")
        } else if (bunsenOn && !heatShieldInPlace) {
            // bunsen burner ON, heatshield not in place
            heatShieldInPlace = true

            $('body').css({
                'background-image': "url(/images/background-tap-on-heat-shield.jpg)"
            })
            $('.heat-shield-1').toggleClass("new-1")
            $('.heat-shield-2').toggleClass("new-2")
            $('.heat-shield-3').toggleClass("new-3")
        } else if (!bunsenOn && !heatShieldInPlace) {
            // bunsen burner off, heatshield not in place
            heatShieldInPlace = true

            $('body').css({
                'background-image': "url(/images/background-heat-shield.jpg)"
            })
            $('.heat-shield-1').toggleClass("new-1")
            $('.heat-shield-2').toggleClass("new-2")
            $('.heat-shield-3').toggleClass("new-3")

        }
    }

    inventory = function (slot) {
        // Case 1: picking up something from the slot

        console.log('inventory triggered')
        if (inventoryContents[slot] && !currentlyMovingElem) {
            // Clicked on slot and nothing is moving
            // Set z-index



            preventMove = false

            currentlyMovingElem = inventoryContents[slot]



            var ele = inventoryContents[slot]
            var heldItemDiv = $(`#${ele}`)
            $(".movables").append(heldItemDiv)

            var left = 

            $(`#${inventoryContents[slot]}`).css({

                "position": "absolute",
                "width": "",
                "height": "",
                
                
            })
            

            if (objectsInUse[ele].apparatus_id == "safety_goggles") {
                gogglesWorn = false
            }

            delete inventoryContents[slot]
            delete inventoryContentsOpp[ele]

            

            makeMovable(ele)

            return
        } else if (isMoving && !preventInventory) {
            // Case 2: putting down something in the slot
            if (!inventoryContents[slot]) {
                // If there's nothing in this slot
                var ele = currentlyMovingElem
                var heldItemDiv = $(`#${ele}`)
                // Add this to the slot
                $(`#slot-${slot}`).append(heldItemDiv)
                // Add this to the inven
                inventoryContents[slot] = ele
                inventoryContentsOpp[ele] = slot
                // Set isMoving = false

                // Toggle classes
                putDownItemInWorkingArea()
                console.log(ele)
                // Set position
                $(`#${ele}`).css({
                    "left": "",
                    "top": "",
                    "position": "relative",
                    "width": "100%",
                    "height": "100%",



                })
                if (objectsInUse[ele].apparatus_id == "safety_goggles") {
                    gogglesWorn = true
                }

            }

        }


    }



    var inFlame = false
    $(".light").mouseenter(async () => {
        if (bunsenLit && currentlyMovingElem.split("-")[0] == "splint") {
            inFlame = true
            await timeout(1000)
            console.log('timed out')
            console.log(inFlame)
            if (inFlame) {
                // update
                var oldId = currentlyMovingElem
                var oldIdNumber = oldId.split("-")[1]

                // Get current left and top pos
                var left = $(`#${currentlyMovingElem}`).css('left')
                var top = $(`#${currentlyMovingElem}`).css("top")

                var newId = `lit_splint-${oldIdNumber}`
                currentlyMovingElem = newId



                var data = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: "lit_splint" }))))
                delete objectsInUse[oldId]
                $(`#${oldId}`).remove()
                var app = new Apparatus(data)
                $('.movables').append(`<div class='interactive ${app.apparatus_id} apparatus moving' id='${newId}' onclick="makeMovable('${newId}')"> </div>`)
                $(`#${newId}`).css({
                    left: left,
                    top: top,
                    "background-image": app.image_url
                })
                objectsInUse[newId] = app
                // Delete old splint from objectsInUse


                isMoving = true

                popupHtml()

            }
        }
    })
    $(".light").mouseleave(() => inFlame = false)








    // Compound - cation-anion relationship
    clickedBasket = async function () {



        // Prompt user: which to select?
        alertify.prompt('Select apparatus', "-",
            function (evt, value) {
                
                if (value == "-") {
                    // alertify.error()
                    return false
                }
                listenToMouseMove = true
                // User clicks OK --> Increment the number of times this apparatus has been used by 1
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                // Set the currently moving object to the apparatus_ID-apparatus_number
                currentlyMovingElem = `${value}-${timesUsed}`

                // Create a div for the apparatus
                $('.movables').append(`<div class='interactive ${value} apparatus moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)

                // temporary success notification
                alertify.success('Ok:' + value)

                // Remove the SlimSelect
                basketSelect.destroy()
                $('#basket-prompt').remove();

                // dk
                heldItem = value

                // Set global variable to tell that an item is moving
                isMoving = true

                mostRecentApparatus = data[value][0]


                var objNo = `${mostRecentApparatus.apparatus_id}-${Number(objectsUsed[mostRecentApparatus.apparatus_id]) - 1}`
                var item = new Apparatus(mostRecentApparatus, currentlyMovingElem)
                objectsInUse[objNo] = item



                // Make div follow cursor
                popupHtml()

            }, function () {
                listenToMouseMove = true
                // alertify.error('cancel')
                // Remove the slimSelect
                basketSelect.destroy()
                $('#basket-prompt').remove()

            }).setHeader("Chemical Basket").set({ closableByDimmer: false })


        listenToMouseMove = false
        // select the prompt and hide the default input box
        $('.ajs-input').hide()
        $(".ajs-ok").addClass("cust-disabled")

        // AJAX to server to retrieve apparatus in the basket
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "basket" }))))


        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = [`<option data-placeholder="true"></option>`]
        for (key of Object.keys(data)) {
            console.log(key)
            str.push(
                `<option value='${data[key][0].apparatus_id}'> ${data[key][0].item_name} </option>`
            )
        }

        // Insert it
        $('.ajs-input').after(`<select id="basket-prompt"> ${str.join(" ")} </select> `)
        // Create custom select element
        var basketSelect = new SlimSelect({

            select: "#basket-prompt",
            placeholder: "Select an apparatus...",
            onChange: (args) => {
                $(".ajs-ok").removeClass("cust-disabled")
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })


    }

    clickedRack = async function (id) {

        alertify.prompt('Select apparatus', '-',
            function (evt, value) {
                if (value == "-") {
                    // alertify.error()
                    return false
                }
                listenToMouseMove = true
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                currentlyMovingElem = `${value}-${timesUsed}`

                $('.movables').append(`<div class='interactive ${value} apparatus moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)


                alertify.success('Ok:' + value)
                rackSelect.destroy()
                $('#rack-prompt').remove();
                heldItem = value
                isMoving = true

                mostRecentApparatus = data[value][0]


                // var testTubeNo = `testTube-${Number(objectsUsed[mostRecentApparatus.apparatus_id]) - 1}`
                objectsInUse[currentlyMovingElem] = new Apparatus(mostRecentApparatus, currentlyMovingElem)
                // If it's test tube or boiling tube, add water to it
                if (value == "test_tube") {
                    objectsInUse[currentlyMovingElem].contains.push({
                        formula_id_f: "H₂O (l)",
                        formula_text: 'water',
                        volume: 10
                    })
                }

                popupHtml()



            }, function () {
                listenToMouseMove = true
                // alertify.error('cancel')
                rackSelect.destroy()
                $('#rack-prompt').remove()

            }).setHeader("Test Tube Rack").set({ closableByDimmer: false })
        listenToMouseMove = false
        // select the prompt and hide the input
        $('.ajs-input').hide()
        $(".ajs-ok").addClass("cust-disabled")
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "rack" }))))
        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = [`<option data-placeholder="true"></option>`]
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].apparatus_id}'> ${data[key][0].item_name} </option>`
            )
        }


        $('.ajs-input').after(`<select id="rack-prompt"> ${str.join(" ")} </select> `)
        var rackSelect = new SlimSelect({
            select: "#rack-prompt",
            placeholder: "Select an apparatus...",
            onChange: (args) => {
                $(".ajs-ok").removeClass("cust-disabled")
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })


    }

    clickedBench = async function () {


        alertify.prompt('Select chemical', '-',
            function (evt, value) {
                if (value == "-") {
                    // alertify.error()
                    return false
                }
                listenToMouseMove = true
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                currentlyMovingElem = `${value}-${timesUsed}`

                $('.movables').append(`<div class='interactive ${value} bench-bottle moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)


                alertify.success('Ok:' + value)
                benchSelect.destroy()
                $('#bench-prompt').remove();
                heldItem = value
                isMoving = true

                mostRecentChemical = data[value][0]

                // -----

                var chemNumber = `${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                // var chemNumber = `bench-${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                objectsInUse[chemNumber] = new BenchReagent(mostRecentChemical, currentlyMovingElem)


                popupHtml()


            }, function () {
                listenToMouseMove = true
                // alertify.error('cancel')
                benchSelect.destroy()
                $('#bench-prompt').remove()

            }).setHeader("Bench Reagents").set({ closableByDimmer: false })
            listenToMouseMove = false
        // select the prompt and hide the input
        $('.ajs-input').hide()
        $(".ajs-ok").addClass("cust-disabled")

        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "bench" }))))

        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = [`<option data-placeholder="true"></option>`]
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].formula_text}'> ${data[key][0].name} ${formatChemForm(data[key][0].formula_id)}</option>`
            )
        }


        $('.ajs-input').after(`<select id="bench-prompt"> ${str.join(" ")} </select> `)
        var benchSelect = new SlimSelect({
            select: "#bench-prompt",
            placeholder: "Select a reagent...",
            onChange: (args) => {
                console.log('onchange')
                $(".ajs-ok").removeClass("cust-disabled")
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })

    }

    clickedReagents = async function () {
        console.log('clicked')

        // console.log(JSON.stringify(data))
        alertify.prompt('Select chemical', '-',
            function (evt, value) {
                if (value == "-") {
                    // alertify.error()
                    return false
                }
                listenToMouseMove = true
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                currentlyMovingElem = `${value}-${timesUsed}`

                $('.movables').append(`<div class='interactive ${value} reagent-bottle moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)


                alertify.success('Ok:' + value)
                reagentSelect.destroy()
                $('#reagent-prompt').remove();
                heldItem = value
                isMoving = true
                var vH = $('html').height();
                var vW = $('html').width();
                mostRecentChemical = data[value][0]

                // -------------
                var chemNumber = `${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                // var chemNumber = `FAbasket-${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`


                // var reactionData = JSON.parse(await Promise.resolve(($.get('/reagentData', { formula_id: encodeURI(mostRecentChemical.formula_id) }))))
                var reactionData = data[value][0]
                // var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: mostRecentChemical.formula_id }))))
                objectsInUse[currentlyMovingElem] = new FAReagent(mostRecentChemical, reactionData, currentlyMovingElem)


                popupHtml()

            }, function () {
                listenToMouseMove = true
                // alertify.error('cancel')
                reagentSelect.destroy()
                $('#reagent-prompt').remove()

            }).setHeader("Reagents").set({ closableByDimmer: false })
        listenToMouseMove = false
        // select the prompt and hide the input
        $('.ajs-input').hide()
        $(".ajs-ok").addClass("cust-disabled")
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "reagents" }))))


        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = [`<option data-placeholder="true"></option>`]
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].formula_text}'> ${data[key][0].name} ${formatChemForm(data[key][0].formula_id)} </option>`
            )
        }


        $('.ajs-input').after(`<select id="reagent-prompt"> ${str.join(" ")} </select> `)
        var reagentSelect = new SlimSelect({
            placeholder: "Select a reagent...",
            select: "#reagent-prompt",
            onChange: (args) => {
                console.log('onchange')
                $(".ajs-ok").removeClass("cust-disabled")
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })
    }

    putDownItemInWorkingArea = async function (goggles) {


        console.log('putdown')
        if (!isMoving) return
        if (goggles) {
            if (objectsInUse[currentlyMovingElem].apparatus_id != "safety_goggles") {
                return
            }

        }

        if (isMoving) {
            preventMove = false
            isMoving = false;
            preventInventory = false
            console.log('putdownla')
            console.log(currentlyMovingElem)

            // reset pointer-events back to normal
            $(`#${currentlyMovingElem}`).toggleClass('moving').toggleClass('on-working-area').css({
                "pointer-events": "auto"
            })

            if (objectsInUse[currentlyMovingElem].linked_to) {
                // it's linked to something
                $(`#${objectsInUse[currentlyMovingElem].linked_to}`).toggleClass('moving').toggleClass('on-working-area').css({
                    "pointer-events": "auto"
                })
                $('.slot').css({
                    'cursor': "auto"
                })


            }

            $('.movables > .interactive').css({ 'pointer-events': 'auto' })
            $('body').css({ 'pointer-events': 'auto' })
            // tippy(`#${currentlyMovingElem}`, {
            //     content: "test",
            //     trigger: "manual"
            // })





            currentlyMovingElem = ""
            mostRecentApparatus = ""
            mostRecentChemical = ""
            $(document).unbind("mousemove") // stop tracking mousemovement

        }

    }

    filter = async function (start, end) {
        // Get the info about filter_funnel
        var filterFunnelId = objectsInUse[end].linked_to

        // Find how much volume is inside the start test tube
        var startTubeVolume = objectsInUse[start].spaceUsed
        var endTubeInitialVolume = objectsInUse[end].spaceUsed

        var startTubeChemVol = objectsInUse[start].chemVols
        var endTubeChemVol = objectsInUse[end].chemVols

        if ((Number(startTubeChemVol) + Number(endTubeChemVol)) > Number(objectsInUse[end].capacity)) {
            // too much, cannot transfer
            // alertify.error("Destination test tube does not have enough capacity!")

            return

        }


        alertify.prompt(`Filter out precipitate as well?`, "yes", (evt, value) => {
            listenToMouseMove = true
            transferSoln(value)
            pptSelect.destroy()
            $("#ppt-prompt").remove()

        }, () => {
            listenToMouseMove = true
            pptSelect.destroy()
            $("#ppt-prompt").remove()

        }).setHeader("Solution Transfer")
        listenToMouseMove = false
        // Hide input
        $(".ajs-input").hide()

        var pptHtml = `<select id="ppt-prompt"> <option value="yes"> Yes </option> <option value="no"> No </option> </select>`
        $('.ajs-input').after(pptHtml)
        var pptSelect = new SlimSelect({
            select: "#ppt-prompt",
            onChange: (args) => {
                $('.ajs-input').val(args.value)
            }
        })




        function transferSoln(ppt) {
            // transfer all liquids; 
            var tubeContents = $.extend([], objectsInUse[start].contains)
            var changingTubeContents = []
            var newTubeContents = $.extend([], objectsInUse[end].contains)

            var thingsToAddToNewTube = {}
            var newPopupHtmlForOldTube = [`<p> ${objectsInUse[start].item_name} </p> <a onclick="inspect('${start}')"> Inspect </a>`]
            var pptVolume = 0
            var volToTransfer = 0
            var oldTubeContents = []

            var filterFunnel = objectsInUse[filterFunnelId]
            var filterItems = $.extend([], filterFunnel.contains)

            var filterObj = {}
            filterItems.forEach(e => {

                filterObj[e.formula_id_f] = {
                    formula_text: e.formula_text,
                    volume: e.volume,
                    old_reagentL: e.old_reagentL,
                    old_reagentR: e.old_reagentR
                }
            })

            var funnelHtmlArr = [`<p> ${filterFunnel.item_name} </p> <a onclick='inspectFilter("${filterFunnelId}")'> Inspect </a> <a onclick='detach("${filterFunnelId}")'> Detach </a>`]
            for (var i = 0; i < tubeContents.length; i++) {
                var reagent = tubeContents[i]
                if (reagent.formula_id_f != "H₂O (l)") {

                    if (reagent.formula_id_f.split(" ")[1] == "(s)") {
                        pptVolume = pptVolume + Number(reagent.volume)
                        if (ppt == "yes") {
                            // if ppt is no don't do anything
                            // Check if this item exists already; if it does, add the volume to it
                            if (filterObj[reagent.formula_id_f]) {
                                // is already inside
                                filterObj[reagent.formula_id_f].volume = Number(filterObj[reagent.formula_id_f].volume) + Number(reagent.volume)
                            } else {
                                filterObj[reagent.formula_id_f] = {
                                    formula_text: reagent.formula_text,
                                    volume: reagent.volume,
                                    old_reagentL: reagent.old_reagentL,
                                    old_reagentR: reagent.old_reagentR
                                }
                            }
                            // Regenerate the HTML associated with the filter
                            funnelHtmlArr.push(`<p> ${filterObj[reagent.formula_id_f].volume} cm³ ${reagent.formula_id_f} </p>`)

                        } else {
                            // changingTubeContents.push(reagent)
                            newPopupHtmlForOldTube.push(`<p> ${reagent.volume} cm³ ${(reagent.formula_id_f)} </p>`)
                            oldTubeContents.push(reagent)
                        }

                        // ADD TO THE FILTER NOT TO THE TEST TUBE
                        // thingsToAddToNewTube[reagent.formula_id_f] = {
                        //     formula_text: reagent.formula_text,
                        //     volume: reagent.volume,
                        //     old_reagentL: reagent.old_reagentL,
                        //     old_reagentR: reagent.old_regeantR
                        // }
                    } else {
                        // not a ppt and not water, i.e. aqueous
                        // add new tube
                        thingsToAddToNewTube[reagent.formula_id_f] = {
                            formula_text: reagent.formula_text,
                            volume: reagent.volume,
                            old_reagentL: reagent.old_reagentL,
                            old_reagentR: reagent.old_regeantR
                        }
                        volToTransfer = Number(volToTransfer) + Number(reagent.volume)

                    }

                } else {
                    // It's water, don't transfer it
                    newPopupHtmlForOldTube.push(`<p> ${reagent.formula_id_f} </p>`) // ID1
                    oldTubeContents.push(reagent)

                }
            }




            var newPopupHtmlForNewTube = [`<p> ${objectsInUse[end].item_name} </p> <a onclick="inspect('${end}')"> Inspect </a>`]
            for (var i = 0; i < newTubeContents.length; i++) {
                var newReagent = newTubeContents[i]
                if (Object.keys(thingsToAddToNewTube).includes(newReagent.formula_id_f)) {
                    // It's in the new one, just change the volume
                    objectsInUse[end].contains[i].volume = (Number(objectsInUse[end].contains[i].volume) + Number(thingsToAddToNewTube[newReagent.formula_id_f].volume)).toFixed(2)
                    if (newReagent.formula_id_f == "H₂O (l)") {
                        newPopupHtmlForNewTube.push(`<p> ${newReagent.formula_id_f} </p>`) // ID1
                    } else {
                        newPopupHtmlForNewTube.push(`<p> ${objectsInUse[end].contains[i].volume} cm³ ${newReagent.formula_id_f} </p>`)
                    }

                    delete thingsToAddToNewTube[newReagent.formula_id_f]
                }
            }

            // Left things that aren't in the new tube already
            for (key of Object.keys(thingsToAddToNewTube)) {
                objectsInUse[end].contains.push({
                    formula_id_f: key,
                    formula_text: thingsToAddToNewTube[key].formula_text,
                    volume: thingsToAddToNewTube[key].volume,
                    old_reagentL: thingsToAddToNewTube[key].old_reagentL,
                    old_reagentR: thingsToAddToNewTube[key].old_reagentR
                })

                if (key == "H₂O (l)") {
                    newPopupHtmlForNewTube.push(`<p> ${key} </p>`) // ID1
                } else {
                    newPopupHtmlForNewTube.push(`<p> ${thingsToAddToNewTube[key].volume} cm³ ${key} </p>`)
                }

            }

            // delete the old contains
            objectsInUse[start].contains = oldTubeContents
            objectsInUse[start].contains.push()

            // Update the filter
            var filterArr = []
            for (key of Object.keys(filterObj)) {
                filterArr.push({
                    formula_id_f: key,
                    formula_text: filterObj[key].formula_text,
                    volume: filterObj[key].volume,
                    old_reagentL: filterObj[key].old_reagentL,
                    old_reagentR: filterObj[key].old_reagentR
                })


            }
            objectsInUse[filterFunnelId].contains = filterArr
            objectsInUse[filterFunnelId].spaceUsed = objectsInUse[filterFunnelId].spaceUsed + pptVolume

            // Update the new test tube html
            var newHtml = [`<p> ${objectsInUse[end].item_name} </p> <a onclick='inspect("${end}")'> Inspect </a>`]
            objectsInUse[end].contains.forEach(r => {
                if (r.formula_id_f == "H₂O (l)") {
                    newHtml.push(`<p> ${r.formula_id_f} </p>`)
                } else {
                    newHtml.push(`<p> ${r.volume} cm³ ${r.formula_id_f} </p>`)
                }
            })
            if (!$(`#${end} > .popup`).length) {
                $(`#${end}`).append("<div class='popup'></div>")
            }
            $(`#${end} > .popup`).html(newHtml.join(" ")).hide()


            // Update the old test tube html
            var oldHtml = [`<p> ${objectsInUse[start].item_name} </p> <a onclick='inspect("${start}")'> Inspect </a>`]
            objectsInUse[start].contains.forEach(r => {
                if (r.formula_id_f == "H₂O (l)") {
                    oldHtml.push(`<p> ${r.formula_id_f} </p>`)
                } else {
                    oldHtml.push(`<p> ${r.volume} cm³ ${r.formula_id_f} </p>`)
                }
            })
            if (!$(`#${start} > .popup`).length) {
                $(`#${start}`).append("<div class='popup'></div>")
            }

            $(`#${start} > .popup`).html(oldHtml.join(" ")).hide()



            // Update the filter funnel html
            var filterHtml = [`<p> ${filterFunnel.item_name} </p> <a onclick='inspectFilter("${filterFunnelId}")'> Inspect </a> <a onclick='detach("${filterFunnelId}")'> Detach </a>`]

            objectsInUse[filterFunnelId].contains.forEach(r => {
                if (r.formula_id_f == "H₂O (l)") {
                    filterHtml.push(`<p> ${r.formula_id_f} </p>`)
                } else {
                    filterHtml.push(`<p> ${r.volume} cm³ ${r.formula_id_f} </p>`)
                }
            })
            if (!$(`#${filterFunnelId} > .popup`).length) {
                $(`#${filterFunnelId}`).append("<div class='popup'></div>")
            }
            // for (key of Object.keys(filterObj)) { 
            //     filterHtml.push(`<p> ${filterObj[key].volume} cm³ ${key} <p>`)
            // }
            $(`#${filterFunnelId} > .popup`).html(filterHtml.join(" ")).hide()


            // What's left: water, possible ppt
            if (ppt == "yes") {
                // Old test tube contains nothing lol
                objectsInUse[start].spaceUsed = 0

            } else {
                objectsInUse[start].spaceUsed = pptVolume


            }



            // update the new test tube space
            objectsInUse[end].spaceUsed = objectsInUse[end].spaceUsed + volToTransfer


            // Update HTML


        }





        // // Temporarily change the OK and Cancel buttons, change them back after the fact
        // $(".ajs-ok").html("Transfer w/ ppt")
        // $(".ajs-cancel").html("Transfer w/out ppt")




















    }

    makeMovable = async function (id) {
        console.log("make")
        if (preventMove) return
        if (inventoryContentsOpp[id]) return
        // If clickedd on a filter which is attached to a test tube, return also
        if (!isMoving) {
            if (objectsInUse[id].linked_to) {
                // Prevent them from putting it in inventory
                preventInventory = true
                $('.slot').css({
                    'cursor': "not-allowed"
                })

                var linkedTo = objectsInUse[id].linked_to.split(",")
                if (linkedTo.length == 1) {
                    if (linkedTo[0].split("-")[0] == "test_tube" && objectsInUse[id].apparatus_id == "filter_funnel") { // Clicked on something that is linked to a test tube AND is a filter funnel
                        // Ensure that both of them are linked to each other
                        if (objectsInUse[linkedTo[0]].linked_to == id) {
                            makeMovable(linkedTo[0])
                            return
                        }




                    } else if (linkedTo[0].split("-")[0] == "delivery_tube" && objectsInUse[linkedTo[0]].apparatus_id == "delivery_tube") { // clicked on a test tube that is linked to the apparatus with an id of delivery tube
                        makeMovable(linkedTo[0])
                        return
                    }
                } else if (linkedTo.length == 2) {
                    if ((linkedTo[0] == linkedTo[1]) && linkedTo[0].split("-")[0] == "delivery_tube") {
                        // Both are linked to the delivery tube
                        makeMovable(linkedTo[0])
                        return
                    }
                }



                // if it's linked to a certain delivery tube, make that delivery tube moveable
                // move all the things linked to the deliverty tube
                // els if () { 

                // }e


            } else {

            }
        }



        if (isMoving) { // ignore if something is already moving
            // HELD ITEM (currentlyMovingElem): check if can interact with the item (variable ID) being clicked 

            // console.log('-------------- objectsInUse -------------')
            // console.log(objectsInUse)
            // console.log('-------------- currentlyMovingElem, id -------------')
            // console.log(currentlyMovingElem, id)

            var heldItem = objectsInUse[currentlyMovingElem];
            var itemClicked = objectsInUse[id]
            if (heldItem.type == "bottle" && itemClicked.interact_with.split(",").includes("bottle")) {
                /* -------------- ADDING CHEMICAL TO CONTAINER ----------------- */
                // the held item will ALWAYS be a bottled reagent; ie sheet name Reference and is infinite in supply
                // the clicked item will be a container. APPARATUS sheet Finite capacity
                // User is POURING something INTO SOMETHING


                console.log(itemClicked, "----------------------^^^^^^^^^^^^^^^")
                // Display the input box coz we need it
                $('.ajs-input').show()
                alertify.prompt(`How much of ${heldItem.name} would you like to add? Maximum ${itemClicked.remainingSpace} cm³`, "",
                    function (evt, value) {
                        if (isNaN(value) || Number(value) > itemClicked.remainingSpace || Number(value) == 0) {
                            // alertify.error('Number out of range!')
                            return false
                        } else {
                            listenToMouseMove = true
                            itemClicked.spaceUsed = Number(itemClicked.spaceUsed) + Number(value)

                            var itemsAlreadyContained = itemClicked.contains

                            var obj = []
                            if (itemsAlreadyContained.length) {
                                // check for duplicate items
                                var containsDuplicate = false
                                itemsAlreadyContained.forEach(item => {
                                    if (item.formula_text == heldItem.formula_text) {
                                        containsDuplicate = true
                                        obj.push({
                                            formula_text: heldItem.formula_text,
                                            formula_id_f: formatChemForm(heldItem.formula_id),
                                            volume: Number(item.volume) + Number(value)
                                        })
                                    } else if (item.formula_text != heldItem.formula_text) {
                                        obj.push(item)
                                    }




                                    console.log(item, "-------%---------", heldItem)

                                })

                                if (!containsDuplicate) {
                                    obj.push({
                                        formula_text: heldItem.formula_text,
                                        formula_id_f: formatChemForm(heldItem.formula_id),
                                        volume: Number(value)
                                    })
                                }


                            } else {
                                obj.push({
                                    formula_text: heldItem.formula_text,
                                    formula_id_f: formatChemForm(heldItem.formula_id),
                                    volume: Number(value)
                                })
                            }


                            console.log(obj)

                            itemClicked.contains = obj



                            console.log(itemClicked)
                            var updatedHTMLArr = [`<div class="popup"> <p> ${itemClicked.item_name} </p>`]
                            // ITEM ATTRIBUTES                             

                            if (itemClicked.attribute.split(",").includes("inspectable")) {
                                updatedHTMLArr.push(`<a onclick='inspect("${itemClicked.div_id}")'> Inspect </a>`)

                                // only if theres thing in the test tube
                            }
                            if (itemClicked.attribute.split(",").includes("duplicate")) {
                                updatedHTMLArr.push(`<a onclick='duplicate("${itemClicked.div_id}")'> Duplicate </a>`)

                                // only if theres thing in the test tube
                            }

                            itemClicked.contains.forEach(item => {
                                if (item.formula_id_f == "H₂O (l)") {
                                    updatedHTMLArr.push(`<p> ${item.formula_id_f} </p>`) // ID1
                                } else {
                                    updatedHTMLArr.push(`<p> ${item.volume} cm³ ${item.formula_id_f} </p>`)
                                }

                            })
                            updatedHTMLArr.push("</div>")
                            console.log("RUNNING")
                            console.log(updatedHTMLArr.join(""))

                            $(`#${id}`).empty().append(updatedHTMLArr.join("")).children('.popup').hide()



                            alertify.success(`Added ${value} cm³ of ${heldItem.name} to the ${itemClicked.item_name}. <br />${itemClicked.remainingSpace} cm³ remaining.`)

                            // $(`#${itemClicked.div_id}`).contextMenu(d)
                        }
                        console.log(itemClicked, "ITEM CLICKED AFTER ADDING")
                    }, () => { 
                        listenToMouseMove = true
                    }).setHeader("Solution Transfer")

                listenToMouseMove = false
            } else if (heldItem.apparatus_id == "folded_filter" && itemClicked.interact_with.split(",").includes("folded_filter")) {
                // Putting filter paper on funnel
                // Get details of the old funnel
                // posx and posy
                var left = $(`#${id}`).css('left')
                var top = $(`#${id}`).css('top')
                // id
                var funnelNumber = id.split("-")[1]



                // Remove the old folded filter paper
                $(`#${currentlyMovingElem}`).remove()

                // Remove the old funnel
                $(`#${id}`).remove()

                // place in a new funnel
                // first fetch info about the funnel
                var newApparatusData = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: "filter_funnel" }))))
                var app = new Apparatus(newApparatusData)

                var new_id = `${app.apparatus_id}-${funnelNumber}`

                $('.movables').append(`<div class='interactive ${app.apparatus_id} apparatus on-working-area' id='${new_id}' onclick="makeMovable('${new_id}')"> </div>`)

                // Set css
                $(`#${new_id}`).css({
                    "left": left,
                    "top": top,
                    "pointer-events": "auto",
                    "background-image": `${app.image_url}`,
                })

                // add right click
                $(`#${new_id}`).contextmenu(function (e) {
                    // triggers on child divs too, so prevent that
                    // console.log(this, "thisthisthishtishtishits")
                    // if (this != e.target) {
                    //     console.log("FALSE FALSE FALSE FALSE")
                    //     isMoving = false
                    //     return
                    // }; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
                    // Prevent default right-click
                    e.preventDefault()
                    // get rid of all elements below
                    if ($(`#${e.target.id}`).children().length == 0) {
                        // no children aka first time
                        var elementIdToReference = e.target.id

                        // var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].item_name} </p></div>`
                        var popupHTMLArr = [`<div class="popup">`, `<p> ${app.item_name} </p>`]

                        popupHTMLArr.push(`</div>`)

                        $(e.target).append(popupHTMLArr.join(" "))
                    }

                    console.log("prevented handler for", e.target)
                    var elementIdToReference = e.target.id




                    // Listener for click, so as to remove the popup
                    $('body').click(function (evt) {
                        // https://stackoverflow.com/questions/12661797/jquery-click-anywhere-in-the-page-except-on-1-div
                        if (evt.target.classList.contains('popup'))
                            return;
                        //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                        if ($(evt.target).closest('.popup').length)
                            return;

                        //Do processing of click event here for every element except with id menu_content
                        $(e.target).children('.popup').hide()

                    })
                    $(e.target).children('.popup').show()
                })



                // Add to objectsInUse
                objectsInUse[new_id] = app



                // Remove the old filter paper from objectsInUse
                delete objectsInUse[currentlyMovingElem]

                // Remove the old filter from objectsInUse
                delete objectsInUse[id]
                isMoving = false
                $('body').css("pointer-events", "auto")
            } else if (heldItem.apparatus_id == "filter_funnel" && itemClicked.interact_with.split(",").includes("filter_funnel")) {
                // check if it already has a filter funnel on it
                var tube_id = id
                var funnel_id = currentlyMovingElem
                if (!itemClicked.linked_to) {
                    // if not linked to anything




                    // place filter funnel onto test tube
                    // How to link these 2? We need to add a new "link" property in objectsInUse
                    // Delete the old filter funnel div but not the property in objectsInuse




                    // Add reference to each other in objectsInUse
                    itemClicked.linked_to = funnel_id; // item clicked is test tube
                    heldItem.linked_to = tube_id // heldItem is funnel

                    // delete the old funnel 
                    // $(`#${funnel_id}`).remove()

                    // Get the position of the clicked test tube
                    var left = ((((Number($(`#${tube_id}`).css("left").replace(/[^0-9.]/g, "", ''))) / Number(document.body.clientWidth)) * 100) + 0.5817) + "vw"  // returns PX values
                    var top = ((((Number($(`#${tube_id}`).css("top").replace(/[^0-9.]/g, "", ''))) / Number(document.body.clientWidth)) * 100) - 1) + "vw"  // returns PX values


                    // Disable pointer-events
                    $(`#${currentlyMovingElem}`).css({
                        "pointer-events": 'none',
                        "left": left,
                        "top": top
                    })

                    // Teleport the item to the correct place

                    // Generate HTML popup
                    // Add html popup
                    var filterHtml = [`<p> ${objectsInUse[currentlyMovingElem].item_name} <p> <a onclick='inspectFilter("${currentlyMovingElem}")'> Inspect </a> <a onclick='detach("${currentlyMovingElem}")'> Detach </a>`]
                    objectsInUse[currentlyMovingElem].contains.forEach(e => {
                        filterHtml.push(`<p> ${e.volume} cm³ ${e.formula_id_f}`)
                    })

                    if (!$(`#${currentlyMovingElem} > .popup`).length) {
                        $(`#${currentlyMovingElem}`).append(`<div class="popup"></div>`)
                    }
                    $(`#${currentlyMovingElem} > .popup`).html(filterHtml.join(" ")).hide()


                    // Set it down at a certain position
                    putDownItemInWorkingArea()

                    // Change the background picture of the test tube
                    // $(`#${tube_id}`).css({
                    //     "background-image": `url('/images/mini/test-tube-funnel-paper.png')`
                    // }).addClass("test_tube_funnel_filter")


                    isMoving = false


                }

            } else if ((heldItem.apparatus_id == "test_tube" && itemClicked.interact_with.split(",").includes("filter_funnel"))) {
                var testTubeId = currentlyMovingElem;
                var testTubeWithFilterId = id

                // pouring shit from one to another
                // button to transfer ppt? 
                // call external function
                // ONly run THI FUNCTION IF THERE IS A FILTER ON TOP OF IT 

                filter(testTubeId, testTubeWithFilterId)
                //




            } else if ((heldItem.apparatus_id == "test_tube" && itemClicked.apparatus_id == "filter_funnel" && itemClicked.linked_to.split("-")[0] == "test_tube")) {
                var testTubeId = currentlyMovingElem;
                var testTubeWithFilterId = objectsInUse[id].linked_to

                // pouring shit from one to another
                // button to transfer ppt? 
                // call external function
                // ONly run THI FUNCTION IF THERE IS A FILTER ON TOP OF IT 

                filter(testTubeId, testTubeWithFilterId)
            } else if (heldItem.apparatus_id == "test_tube" && itemClicked.interact_with.split(",").includes("test_tube")) {
                // holding test tube and clicking on the delivery tube


                var linkedTo;
                if (!(objectsInUse[id].linked_to)) {
                    linkedTo = []
                } else {
                    linkedTo = objectsInUse[id].linked_to.split(",")
                }

                var tube_id = currentlyMovingElem
                var left = $(`#${id}`).css('left')
                var top = $(`#${id}`).css('top')

                if (linkedTo.length == 0) {
                    // Not linked to anything
                    // First test tube to attach should go on the rubber bung


                    // Set position

                    var newLeft = ((((Number($(`#${id}`).css("left").replace(/[^0-9.]/g, "", ''))) / document.body.clientWidth) * 100) + 6.3) + "vw"  // returns PX values
                    var newTop = ((((Number($(`#${id}`).css("top").replace(/[^0-9.]/g, "", ''))) / document.body.clientWidth) * 100) + 2.7) + "vw"  // returns PX values

                    // Set down the first test tube at this position
                    $(`#${currentlyMovingElem}`).css({
                        "left": newLeft,
                        "top": newTop
                    })
                    putDownItemInWorkingArea()
                    linkedTo.push(tube_id)
                    objectsInUse[tube_id].linked_to = id
                    $(`#${id} > .popup`).html(`<p> ${objectsInUse[id].item_name} </p> <a onclick='detach("${id}")'> Detach </a>`)
                } else if (linkedTo.length == 1 && linkedTo) {
                    // Linked to test tube with the rubber bung


                    // Set position

                    var newLeft = ((((Number($(`#${id}`).css("left").replace(/[^0-9.]/g, "", ''))) / document.body.clientWidth) * 100) - 1.3) + "vw"  // returns PX values
                    var newTop = ((((Number($(`#${id}`).css("top").replace(/[^0-9.]/g, "", ''))) / document.body.clientWidth) * 100) + 2.7) + "vw"  // returns PX values

                    // Set down the first test tube at this position
                    $(`#${currentlyMovingElem}`).css({
                        "left": newLeft,
                        "top": newTop
                    })
                    putDownItemInWorkingArea()
                    linkedTo.push(tube_id)
                    objectsInUse[tube_id].linked_to = id
                    $(`#${id} > .popup`).html(`<p> ${objectsInUse[id].item_name} </p> <a onclick='detach("${id}")'> Detach </a>`)


                } else {
                    // linked to 2 test tubes
                }
                objectsInUse[id].linked_to = linkedTo.join(",")



            }


            // else if ((heldItem.apparatus_type == "container" || heldItem.type == "bottle") && itemClicked.interact_with.split(",").includes("filter_funnel"))


            return
        }
        isMoving = true

        $('body').css("pointer-events", "none")


        $(document).on('mousemove', function (e) {
            if (listenToMouseMove) {


                $(`#${id}`).css({
                    left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                    top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",
                    "pointer-events": "none", // allow click through this element
                })
                if (objectsInUse[id]) {

                    if (objectsInUse[id].linked_to) {
                        var linkedTo = objectsInUse[id].linked_to.split(",")
                        // it's linked to something
                        if (linkedTo.length == 1) {
                            // only 1 thing
                            if (linkedTo[0].split("-")[0] == "filter_funnel") {
                                $(`#${linkedTo[0]}`).css({
                                    left: ((((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100) + 0.5817) + "vw",
                                    top: ((((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100) - 1) + "vw",
                                    "pointer-events": "none", // allow click through this element

                                })
                                $(`#${linkedTo[0]}`).toggleClass('moving').toggleClass('on-working-area')
                            } else if (linkedTo[0].split("-")[0] == "test_tube" && objectsInUse[id].apparatus_id == "delivery_tube") {
                                // Move the test tube
                                $(`#${linkedTo[0]}`).css({
                                    left: ((((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100) + 6.3) + "vw",
                                    top: ((((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100) + 2.7) + "vw",
                                    "pointer-events": "none", // allow click through this element

                                })
                                $(`#${linkedTo[0]}`).toggleClass('moving').toggleClass('on-working-area')
                            }

                        } else if (linkedTo.length == 2) {
                            // 2 things connected to it
                            $(`#${linkedTo[0]}`).css({
                                left: ((((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100) + 6.3) + "vw",
                                top: ((((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100) + 2.7) + "vw",
                                "pointer-events": "none", // allow click through this element

                            })
                            $(`#${linkedTo[0]}`).toggleClass('moving').toggleClass('on-working-area')

                            $(`#${linkedTo[1]}`).css({
                                left: ((((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100) - 1.3) + "vw",
                                top: ((((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100) + 2.7) + "vw",
                                "pointer-events": "none", // allow click through this element

                            })
                            $(`#${linkedTo[1]}`).toggleClass('moving').toggleClass('on-working-area')

                        }

                        if (objectsInUse[id].linked_to.split("-")[0] == "filter_funnel") {


                        } else if (objectsInUse[id].linked_to.split(",")) {

                        }


                    }
                }
            }


        })
        $('body').css({ 'pointer-events': 'none !important' }) // prevent clicking anywhere else 
        $('.working-area').css({ 'pointer-events': 'auto' }) // other than the working-area
        // $('.movables > .interactive').css({ 'pointer-events': 'none' }) // and prevent clicking on the other movables as well
        currentlyMovingElem = id
        $(`#${currentlyMovingElem}`).toggleClass('moving').toggleClass('on-working-area')

    }

    fold = async function (id) {
        // stop the thing from moving;
        preventMove = true;
        // get the position of the old element;
        var left = $(`#${id}`).css('left')
        var top = $(`#${id}`).css('top')
        var idArray = id.split("-")
        var number = idArray[1]
        var apparatus = idArray[0]
        var newApparatus;

        // remove the old objectInUse:
        delete objectsInUse[id]
        var app;
        if (apparatus == "filter") {
            newApparatus = "folded_filter"
            var newApparatusData = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: newApparatus }))))
            app = new Apparatus(newApparatusData)
            objectsInUse[`${newApparatus}-${number}`] = app
        }
        $(`#${id}`).remove()
        $('.movables').append(`<div class='interactive ${newApparatus} apparatus moving' id='${newApparatus}-${number}' onclick="makeMovable('${newApparatus}-${number}')"> </div>`)
        $(`#${newApparatus}-${number}`).css({
            "left": left,
            "top": top,
            "pointer-events": "auto",
            "background-image": `${app.image_url}`,
            "cursor": 'pointer'
        })

        // Create context menu
        $(`#${newApparatus}-${number}`).contextmenu(function (e) {
            // triggers on child divs too, so prevent that
            // console.log(this, "thisthisthishtishtishits")
            // if (this != e.target) {
            //     console.log("FALSE FALSE FALSE FALSE")
            //     isMoving = false
            //     return
            // }; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
            // Prevent default right-click
            e.preventDefault()
            // get rid of all elements below
            if ($(`#${e.target.id}`).children().length == 0) {
                // no children aka first time
                var elementIdToReference = e.target.id

                // var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].item_name} </p></div>`
                var popupHTMLArr = [`<div class="popup">`, `<p> ${objectsInUse[elementIdToReference].item_name} </p>`]
                popupHTMLArr.push(`</div>`)

                $(e.target).append(popupHTMLArr.join(" "))
            }

            console.log("prevented handler for", e.target)
            var elementIdToReference = e.target.id




            // Listener for click, so as to remove the popup
            $('body').click(function (evt) {
                // https://stackoverflow.com/questions/12661797/jquery-click-anywhere-in-the-page-except-on-1-div
                if (evt.target.classList.contains('popup'))
                    return;
                //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                if ($(evt.target).closest('.popup').length)
                    return;

                //Do processing of click event here for every element except with id menu_content
                $(e.target).children('.popup').hide()

            })
            $(e.target).children('.popup').show()
        })

        preventMove = false



    }

    inspect = async function (id) {
        // Set placed litmus to false
        placedLitmus = false

        // Set hotbar to top
        $(`.inventory`).css({
            "z-index": "2000"
        })



        // Draw the big screen
        console.log("INSPECTINGGGGGGGGGGGGGGGGGGGGGGGGG")
        preventMove = true
        var tube = objectsInUse[id]
        alertify.prompt(`Observing ${tube.item_name} #${Number(id.split('-')[1]) + 1}`, "",
            function (evt, value) {
                $('#inspect').remove()
                $('#info').remove()
                $("#rxt-status").remove()
                $("#shake").remove()
                $("#litmus").remove()
                preventMove = false
                $(`.inventory`).css({
                    "z-index": ""
                })
                $("#litmus").remove()
                $(".ajs-ok").show()
                $(".ajs-cancel").html("Cancel")
            },
            function () {
                $('#inspect').remove()
                $('#info').remove()
                $("#rxt-status").remove()
                $("#shake").remove()
                $("#litmus").remove()
                preventMove = false
                $(`.inventory`).css({
                    "z-index": ""
                })
                $(".ajs-ok").show()
                $(".ajs-cancel").html("Cancel")

            }).setHeader(`${tube.item_name} Inspection`)

        $('.ajs-content').append('<div id="litmus" onclick="litmus()"></div>')
        $('#litmus').css({
            "height": "4vw",
            "width": "100%",
            "pointer-events": "auto"
        })

        // Hide input box and expand the box
        $('.ajs-input').hide()
        // expand the area   
        $('.ajs-content').append('<div id="inspect"></div>').append(`<button id="shake" onclick="shake('${id}')"> Shake test tube </button>`).append("<p id='rxt-status'> Shake test tube to begin reaction. </p>").append('<div id="info"></div>')
        $('#inspect').append('<div id="tube-image-div"></div>')
        $('#tube-image-div').append('<div id="background-image"></div>')
        // Add the color divs
        $('#background-image').append('<div id="color-max" class="color"></div>').append('<div id="background-image-volume"></div>')
        // Add the ppt div
        $("#tube-image-div").append(`<div id='ppt-1' class="ppt"></div>`).append(`<div id='ppt-2' class="ppt"></div>`).append(`<div id='ppt-3' class="ppt"></div>`)
        // Add the buttons to shake test tube

        // Replace the buttons
        $(".ajs-ok").hide()
        $(".ajs-cancel").html("Close")



        /* -------------- PART 1: WHAT'S INSIDE THE TUBE AND WHAT DOES IT REACT WITH --------------*/





        // Color
        var colorArray = []
        var colorPptArray = [] // no color-weight for this one, if there are > 1 ppt we will draw that
        var colorGasArray = []
        var colorWeight = []
        var pptSDrawn = {

        }


        console.log('executed -------------------------------')
        /* Calculate the query for database */

        // If there's nothing in the test tube other than solid, add AIR to the available reaction list but if theres already air then dont
        if (Number(tube.chemVols) == 0) {
            tube.contains.push({
                formula_id_f: 'air',
                formula_text: "air",
                volume: 20
            })
        } else {
            // remove air if exists
            var a = $.extend([], tube.contains)
            for (var i = 0; i < a.length; i++) {
                if (a[i].formula_id_f == "air") {
                    tube.contains.splice(i, 1)
                }
            }


        }








        var reagentsToQuery = []
        var reagents = []
        console.log("ONE: TUBE", tube)
        tube.contains.forEach(reagent => {
            reagentsToQuery.push(reagent.formula_id_f.split(" ").join("_")) // prepare database query                

        })

        // First we query and check for cations / anions. 




        console.log("TWO: REAGENTS TO QUERY", reagentsToQuery)
        var data = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: reagentsToQuery }))))


        /* Because some are compounds, we need to change it into cation and anion. */
        /* Intended outcome: [Al3+, [Na+, OH-, NaOH]...] */
        var tempArr = []
        data.forEach(row => {
            if (row.cation || row.anion) {

                tempArr.push([row.cation, row.anion, row.formula_id])
            } else {
                tempArr.push(row.formula_id)
            }
        })

        tempArr = [...new Set(tempArr)]
        reagentsToQuery = tempArr

        // var ionReagents = []
        // reagentsToQuery.forEach(r => {
        //     if (Array.isArray(r)) { 
        //         // Change compounds into ions
        //         ionReagents.push(r[0], r[1])

        //     } else { 
        //         ionReagents.push(r)
        //     }

        // })

        // var data = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: ionReagents }))))

        var allReactingReagents = {}
        var volCol = {}
        if (tube.contains.length > 1) {
            // test tube contains AT LEAST 2 items







            // console.log('recieved data back')

            var allReactingReagentsSimple = []
            var volCol = {} // object relating the colors and stuff

            var volumeObj = {} // Holds the info about volume
            tube.contains.forEach(reagentInTube => {
                var b = reagentInTube.formula_id_f.split(" ").join("_")
                volumeObj[b] = Number(reagentInTube.volume)
            });
            async function temp() {
                for (var i = 0; i < data.length; i++) {

                    var row = data[i]
                    var t = new Reactant(row)
                    var reacting = await t.checkIfReactable(reagentsToQuery) // check if any reacting reagent can react with others
                    console.log('reacting with', t.formula_id, reacting)
                    if (reacting.length) { // if the thing is reacting 
                        console.log("REACTINGGGGGGGGGGGGGGGGGG")
                        if (allReactingReagents[t.formula_id]) {
                            var temp = allReactingReagents[t.formula_id]
                            temp.push(reacting[0][t.formula_id])
                            allReactingReagents[t.formula_id] = temp
                        } else {
                            allReactingReagents[t.formula_id] = [reacting[0][t.formula_id]]
                        }
                    }

                    volCol[t['formula_id']] = {
                        color: t['color'],
                        odor: t['odor'],
                        volume: volumeObj[t['formula_id']],
                        state: t['state'],
                        hex: t['hex'],
                        cation: t['cation'],
                        anion: t['anion'],
                        formula_text: t['formula_text']
                    }

                    if (i == data.length - 1) {
                        return 'done'
                    }
                }
            }

            var t = await temp()
            // data.forEach(async row => {

            // })

            var HTMLarr = []
            for (reagent of Object.keys(volCol)) {
                if (reagent == "H₂O_(l)") {
                    HTMLarr.push(`<p> ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`) // ID1         
                } else {
                    HTMLarr.push(`<p> ${volCol[reagent].volume} cm³ ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`)
                }


                if (volCol[reagent].color !== "colorless") {

                    // If it's solid, add it to the ppt array instead
                    // if it's gas, add it to the gas array.
                    switch (volCol[reagent].state) {
                        case "solution":
                            if (volCol[reagent].hex) {
                                colorArray.push(volCol[reagent].hex)

                            } else {
                                colorArray.push(volCol[reagent].color)
                            }
                            colorWeight.push(volCol[reagent].volume)
                            break;
                        case "precipitate":
                            if (volCol[reagent].hex) {
                                colorPptArray.push([volCol[reagent].hex, reagent])

                            } else {
                                colorPptArray.push([volCol[reagent].color, reagent])
                            }

                            break;


                    }




                    // colorWeight.push("1")

                }

            }
            $('#info').html(HTMLarr.join(" "))



            /*
            // get rid of duplications
            allReactingReagentsSimple = [...new Set(allReactingReagentsSimple)]
            console.log(allReactingReagents, "--------------------", JSON.stringify(allReactingReagents), volCol)
 
            // allReactingReagents {"Ca²⁺_(conc)":["NaOH_(aq)"],"Al³⁺_(aq)":["NaOH_(aq)","NH₃_(aq)"]}
            // volCol {}
 
            // Generate a string to input as the info. Should include color and volume data and state data
            
            for (key of Object.keys(volCol)) {
                HTMLarr.push(`<p> ${volCol[key].volume} cm³ ${formatChemForm(key)}, ${volCol[key].color} ${volCol[key].state}, ${volCol[key].odor} </p>`)
                if (volCol[key].color !== "colorless") {
                    if (volCol[key].hex) {
                        colorArray.push(volCol[key].hex)
                    } else {
                        colorArray.push(volCol[key].color)
                    }
                    colorWeight.push("1")
 
                }
 
            }
 
            $('#info').html(HTMLarr.join(" "))
 
            */













        } else if (tube.contains.length == 1) {


            var t = new Reactant(data[0])

            volCol[t.formula_id] = {
                color: t['color'],
                odor: t['odor'],
                volume: Number(tube.contains[0].volume),
                state: t['state'],
                hex: t['hex'],
                cation: t['cation'],
                anion: t['anion'],
                formula_text: t['formula_text']
            }
            console.log(volCol, "volcol")
            if (volCol[t.formula_id].color !== "colorless") {
                switch (volCol[t.formula_id].state) {
                    case "solution":
                        if (volCol[t.formula_id].hex) {
                            colorArray.push(volCol[t.formula_id].hex)

                        } else {
                            colorArray.push(volCol[t.formula_id].color)
                        }
                        colorWeight.push(volCol[t.formula_id].volume)
                        break;
                    case "precipitate":
                        if (volCol[t.formula_id].hex) {
                            colorPptArray.push([volCol[t.formula_id].hex, t.formula_id])

                        } else {
                            colorPptArray.push([volCol[t.formula_id].color, t.formula_id])
                        }

                        break;
                    // case "gas":
                    //     if (volCol[t.formula_id].hex) {
                    //         colorGasArray.push([volCol[t.formula_id].hex, t.formula_id])

                    //     } else {
                    //         colorGasArray.push([volCol[t.formula_id].color, t.formula_id])
                    //     }

                    //     break;

                }






            }

            /* Control HTML */
            if (t.formula_id == "H₂O_(l)") {
                $('#info').html(`<p> ${formatChemForm(t.formula_id)}  </p>`)
                // ID1
            } else if (t.formula_id == "air") {
                $('#info').html(`<p> Air </p>`)

            } else {
                $('#info').html(`<p> ${volCol[t.formula_id].volume} cm³ ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)

            }

        }


        /* -------------- PART 2: DRAWING THE INITIAL CHEMICALS INSIDE THE TEST TUBE --------------*/




        // Calculate ppt 
        // $('#inspect').append


        /* COLORING LOGGING */
        console.log("colorArray: ", colorArray)
        console.log("colorWeight: ", colorWeight);
        console.log("Mixed color: ", color)



        // Calculate which height to draw
        var maxVolume = tube.capacity
        var currentVolume = tube.spaceUsed
        var percentageFull = Number(currentVolume) / Number(maxVolume)
        var percentToSet = ((1 - percentageFull) * 87 + 42)
        console.log(percentageFull, "percentageFull", currentVolume, maxVolume)

        // Calculate color
        // Calculate color
        // We need to IGNORE the color if it's a PPT or GAS. 

        var color = ""
        if (colorArray.length) {
            color = chroma.average(colorArray, 'rgb', colorWeight).hex()
        } else {
            // color = 'rgba(255,255,255, 0.3)' // we set the initial color of the soln to colorless
        }


        $('#color-max').css({
            // "-webkit-backdrop-filter": "blur(10px)",
            // "backdrop-filter": "blur(10px)",
            "background-color": `${color}`,
            // We should probably only set the transition property after the first drawing, before the next transition

        })
        $('#background-image-volume').css({
            height: `${percentToSet}%`
        })







        if (colorPptArray.length) {
            // [hex, formula_id]
            // there is at least one ppt
            var ppts = [
                `url('/images/ppt1.png')`,
                `url('/images/ppt2.png')`,
                `url('/images/ppt3.png')`
            ]


            for (var i = 1; i < colorPptArray.length + 1; i++) {
                var rgbcol = chroma(colorPptArray[i - 1][0])


                $(`#ppt-${i}`).css({
                    "background-color": rgbcol,
                    "opacity": "1"
                })
                pptSDrawn[colorPptArray[i - 1][1]] = i
                // { 
                //     Ca(OH)2_(s): 1
                // }
            }
        }





        // START LOGIC TO CALCULATE REACTIONS





        /* -------------- PART 4: START TIMER TO DELAY UNTIL THE NEXT FUNCTION EXECUTION --------------*/















    }

    shake = async function (id) {

        $("#shake").prop('disabled', true);
        var tube = objectsInUse[id]


        // If there's nothing in the test tube other than solid, add AIR to the available reaction list but if theres already air then dont
        if (Number(tube.chemVols) == 0) {
            tube.contains.push({
                formula_id_f: 'air',
                formula_text: "air",
                volume: 20
            })
        } else {
            // remove air if exists
            var a = $.extend([], tube.contains)
            for (var i = 0; i < a.length; a++) {
                if (a.formula_id_f == "air") {
                    tube.contains.splice(i, 1)
                }
            }


        }

        /* -------------- PART 1: WHAT'S INSIDE THE TUBE AND WHAT DOES IT REACT WITH --------------*/


        console.log(tube, '---------------0-------------------')


        // Color
        var colorArray = []
        var colorPptArray = [] // no color-weight for this one, if there are > 1 ppt we will draw that
        var colorGasArray = []
        var colorWeight = []
        var pptSDrawn = {

        }


        console.log('executed -------------------------------')
        /* Calculate the query for database */
        var reagentsToQuery = []
        var reagents = []
        console.log("ONE: TUBE", tube)

        tube.contains.forEach(reagent => {
            reagentsToQuery.push(reagent.formula_id_f.split(" ").join("_")) // prepare database query                

        })

        // First we query and check for cations / anions. 




        console.log("TWO: REAGENTS TO QUERY", reagentsToQuery)
        var data = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: reagentsToQuery }))))


        /* Because some are compounds, we need to change it into cation and anion. */
        /* Intended outcome: [Al3+, [Na+, OH-, NaOH]...] */
        var tempArr = []
        data.forEach(row => {
            if (row.cation || row.anion) {

                tempArr.push([row.cation, row.anion, row.formula_id])
            } else {
                tempArr.push(row.formula_id)
            }
        })

        tempArr = [...new Set(tempArr)]
        reagentsToQuery = tempArr

        // var ionReagents = []
        // reagentsToQuery.forEach(r => {
        //     if (Array.isArray(r)) { 
        //         // Change compounds into ions
        //         ionReagents.push(r[0], r[1])

        //     } else { 
        //         ionReagents.push(r)
        //     }

        // })

        // var data = JSON.parse(await Promise.resolve(($.get('/inspect', { arr: ionReagents }))))

        var allReactingReagents = {}
        var volCol = {}
        if (tube.contains.length > 1) {
            // test tube contains AT LEAST 2 items







            // console.log('recieved data back')

            var allReactingReagentsSimple = []
            var volCol = {} // object relating the colors and stuff

            var volumeObj = {} // Holds the info about volume
            var pastReagents = {} // Holds the info about previous reactants
            tube.contains.forEach(reagentInTube => {
                var b = reagentInTube.formula_id_f.split(" ").join("_")
                volumeObj[b] = Number(reagentInTube.volume)
                pastReagents[b] = [reagentInTube.old_reagentL, reagentInTube.old_reagentR]
            });
            async function temp() {
                for (var i = 0; i < data.length; i++) {

                    var row = data[i]
                    var t = new Reactant(row)
                    var reacting = await t.checkIfReactable(reagentsToQuery) // check if any reacting reagent can react with others
                    console.log('reacting with', t.formula_id, reacting)
                    if (reacting.length) { // if the thing is reacting 
                        console.log("REACTINGGGGGGGGGGGGGGGGGG")
                        if (allReactingReagents[t.formula_id]) {
                            var temp = allReactingReagents[t.formula_id]
                            temp.push(reacting[0][t.formula_id])
                            allReactingReagents[t.formula_id] = temp
                        } else {
                            allReactingReagents[t.formula_id] = [reacting[0][t.formula_id]]
                        }
                    }

                    volCol[t['formula_id']] = {
                        color: t['color'],
                        odor: t['odor'],
                        volume: volumeObj[t['formula_id']],
                        state: t['state'],
                        hex: t['hex'],
                        cation: t['cation'],
                        anion: t['anion'],
                        formula_text: t['formula_text'],
                        old_reagentL: pastReagents[t['formula_id']][0],
                        old_reagentR: pastReagents[t['formula_id']][1]
                    }

                    if (i == data.length - 1) {
                        return 'done'
                    }
                }
            }

            var t = await temp()
            // data.forEach(async row => {

            // })

            var HTMLarr = []
            for (reagent of Object.keys(volCol)) {
                if (reagent == "H₂O_(l)") {
                    HTMLarr.push(`<p> ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`) // ID1         
                } else {
                    HTMLarr.push(`<p> ${volCol[reagent].volume} cm³ ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`)
                }

                if (volCol[reagent].color !== "colorless") {

                    // If it's solid, add it to the ppt array instead
                    // if it's gas, add it to the gas array.
                    switch (volCol[reagent].state) {
                        case "solution":
                            if (volCol[reagent].hex) {
                                colorArray.push(volCol[reagent].hex)

                            } else {
                                colorArray.push(volCol[reagent].color)
                            }
                            colorWeight.push(volCol[reagent].volume)
                            break;
                        case "precipitate":
                            if (volCol[reagent].hex) {
                                colorPptArray.push([volCol[reagent].hex, reagent])

                            } else {
                                colorPptArray.push([volCol[reagent].color, reagent])
                            }

                            break;


                    }




                    // colorWeight.push("1")

                }

            }
            // $('#info').html(HTMLarr.join(" "))

















        } else if (tube.contains.length == 1) {


            var t = new Reactant(data[0])

            volCol[t.formula_id] = {
                color: t['color'],
                odor: t['odor'],
                volume: Number(tube.contains[0].volume),
                state: t['state'],
                hex: t['hex'],
                cation: t['cation'],
                anion: t['anion'],
                formula_text: t['formula_text'],
                old_reagentL: tube.contains[0].old_reagentL,
                old_reagentR: tube.contains[0].old_reagentR
            }
            console.log(volCol, "volcol")
            if (volCol[t.formula_id].color !== "colorless") {
                switch (volCol[t.formula_id].state) {
                    case "solution":
                        if (volCol[t.formula_id].hex) {
                            colorArray.push(volCol[t.formula_id].hex)

                        } else {
                            colorArray.push(volCol[t.formula_id].color)
                        }
                        colorWeight.push(volCol[t.formula_id].volume)
                        break;
                    case "precipitate":
                        if (volCol[t.formula_id].hex) {
                            colorPptArray.push([volCol[t.formula_id].hex, t.formula_id])

                        } else {
                            colorPptArray.push([volCol[t.formula_id].color, t.formula_id])
                        }

                        break;
                    // case "gas":
                    //     if (volCol[t.formula_id].hex) {
                    //         colorGasArray.push([volCol[t.formula_id].hex, t.formula_id])

                    //     } else {
                    //         colorGasArray.push([volCol[t.formula_id].color, t.formula_id])
                    //     }

                    //     break;

                }






            }
            // if (t.formula_id == "H₂O_(l)") { 
            //     $('#info').html(`<p> ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)
            //     // ID1
            // } else { 
            //     $('#info').html(`<p> ${volCol[t.formula_id].volume} cm³ ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)

            // }
        }


        /* -------------- PART 2: DRAWING THE INITIAL CHEMICALS INSIDE THE TEST TUBE --------------*/




        // Calculate ppt 
        // $('#inspect').append


        /* COLORING LOGGING */
        console.log("colorArray: ", colorArray)
        console.log("colorWeight: ", colorWeight);
        console.log("Mixed color: ", color)



        // Calculate which height to draw
        var maxVolume = tube.capacity
        var currentVolume = tube.spaceUsed
        var percentageFull = Number(currentVolume) / Number(maxVolume)
        var percentToSet = ((1 - percentageFull) * 87 + 42)
        console.log(percentageFull, "percentageFull", currentVolume, maxVolume)

        // Calculate color
        // Calculate color
        // We need to IGNORE the color if it's a PPT or GAS. 

        var color = ""
        if (colorArray.length) {
            color = chroma.average(colorArray, 'rgb', colorWeight).hex()
        } else {
            // color = 'rgba(255,255,255, 0.3)' // we set the initial color of the soln to colorless
        }

        if (percentageFull) {
            $('#color-max').css({
                // "-webkit-backdrop-filter": "blur(10px)",
                // "backdrop-filter": "blur(10px)",
                "background-color": `${color}`,
                // We should probably only set the transition property after the first drawing, before the next transition

            })
            $('#background-image-volume').css({
                height: `${percentToSet}%`
            })

        }





        if (colorPptArray.length) {
            // [hex, formula_id]
            // there is at least one ppt



            for (var i = 1; i < colorPptArray.length + 1; i++) {
                var rgbcol = chroma(colorPptArray[i - 1][0]).rgb()
                var color = new Color(rgbcol[0], rgbcol[1], rgbcol[2])
                var solver = new Solver(color)
                var result = solver.solve()
                var filteredCss = result.filter // returns the filtered string                


                pptSDrawn[colorPptArray[i - 1][1]] = i
                // { 
                //     Ca(OH)2_(s): 1
                // }
            }
        }



        /* -------------- PART 3: START REACTION CALCULATION --------------*/

        // volCol & allReactingReagents
        // var allReactingReagentsTemp = {...allReactingReagents}


        var volColTemp = jQuery.extend({}, volCol)

        /* 
            Note to self, this creates a SHALLOW COPY, meaing that nested arrays and stuff are NOT unlinked from the original array.
            I chose to leave it as is because I want the properties that I'm updating (volume) to change, but NOT the new properties that i'm adding in.
            See: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        */

        // only bother executing the logic if there are more than 2 things inside
        if (Object.keys(allReactingReagents).length) {

            $('#rxt-status').html("Reaction in progress...")
            // In the case whereby both Ca2+ and Al3+ react with NaOH, and Ca2+ reacts away with ALL the NaOH, we must
            // divide NaOH into 2 parts.
            var tempReagentRObj = {

            }

            for (reagentL of Object.keys(allReactingReagents)) {

                allReactingReagents[reagentL].forEach(reactant => {
                    if (Array.isArray(reactant)) {
                        // something like [Na+, OH-, NaOH]
                        // Just set reactant to be the third item in this array
                        reactant = reactant[2]
                    }

                    // Check if that reactant is already in the tempReagentRObj
                    if (tempReagentRObj[reactant]) {
                        // It's already inside, we just add 1 to that property
                        tempReagentRObj[reactant] = [tempReagentRObj[reactant][0] + 1, tempReagentRObj[reactant][1]] // WILL THIS CHANGE DUE TO REFERENCE STRUCTURE?
                    } else {
                        // It's not inside, we need to create the property and set it to 1 times
                        tempReagentRObj[reactant] = [1, volCol[reactant].volume]
                        // Ca2+: [numberOfTimesUsed, totalVolume]
                    }

                })
            }

            console.log(tempReagentRObj)


            for (reagentL of Object.keys(allReactingReagents)) {
                // var reagentLIons = JSON.parse(await Promise.resolve(($.get('/inspect/getIons', { reagentL: encodeURI(reagentL)}))))

                if (volCol[reagentL].cation || volCol[reagentL].anion) {
                    // ReagentL is a compound, and the reaction might occur with its ions instead

                }

                // First, we need to find out how much reagentL will react for each reagent on the right.
                // For example, if 10cm3 of Ca2+ reacts with 2 different things, then 5cm3 of Ca2+ will react with each thing.
                var numberOfReactions = allReactingReagents[reagentL].length
                var reagentLVolume = volCol[reagentL].volume
                var reagentLVolumePerReaction = reagentLVolume / numberOfReactions

                // Now, we need to loop through each item on the right and compare it with reagentL. For example, if Ca2+: [Nh3, NaOH], then we need to
                // compare the volumes of Ca2+ and NH3 for each reaction. Now, we need to loop through the array.
                // Use a FOR loop because async doesn't work in a forEach().

                // Declare a variable for the volume of reagentL after the reaction
                var reagentLVolumeAfterReaction = reagentLVolume
                for (var i = 0; i < numberOfReactions; i++) {
                    // Comparing Ca2+ and NH3 for example.
                    // We will use a ratio of 5 parts Ca2+ to 1 part NH3;
                    // so, 6cm3 Ca2+ and 1cm3 NH3 --> Ca2+ excess, 
                    // 4cm3 Ca2+ and 1cm3 NH3 --> NH3 excess
                    // In this case, NH3 is allReactingReagents[reagentL][i]

                    // There should also be an equivalent amount of water produced  (?)
                    var reagentR = allReactingReagents[reagentL][i]
                    // Calculating the product of each reaction
                    var reagentLTemp = [reagentL]
                    if (volCol[reagentL].cation || volCol[reagentL].anion) {
                        reagentLTemp = [volCol[reagentL].cation, volCol[reagentL].anion, reagentL]
                    }
                    var reactionData = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: encodeURI(reagentLTemp), right: encodeURI([reagentR]) }))))
                    // array


                    console.log(reactionData)

                    // Sometimes, if the reagentR is NaOH (etc), it'll be in the form of an array. The third element of this array will always be the base element. Hence,
                    if (Array.isArray(reagentR)) {
                        // We will just set the reagentR to NaOH, makes it easier
                        reagentR = reagentR[2]
                    }
                    var reagentRVolumeAfterReaction = volCol[reagentR].volume

                    var reagentRVolume = Number(tempReagentRObj[reagentR][1]) / Number(tempReagentRObj[reagentR][0])
                    // var reagentRVolume = Number(volCol[reagentR].volume)/Number(tempReagentRObj[reagentR]) // Divide the volume allocated for tihs reaction by the number of times this reactant is used

                    // // Get the ratio
                    // var ratio = JSON.parse(await Promise.resolve(($.get('/inspect/getRatio', { left: encodeURI(reagentLTemp), right: encodeURI([reagentR]) }))))


                    // Calculate how much reagentL was used in THIS reaction.
                    var reagentLUsed = 0
                    // Find which reagent, L or R, is in excess.
                    if (reagentLVolumePerReaction / 5 < reagentRVolume) { // Variable ID3
                        // ReagentR is in excess
                        // ReagentL will have 0 volume for this reaction
                        reagentLVolumeAfterReaction = reagentLVolumeAfterReaction - reagentLVolumePerReaction
                        reagentLUsed = reagentLVolumePerReaction // used Everything
                        reagentRVolumeAfterReaction = reagentRVolumeAfterReaction - Number(reagentLVolumePerReaction / 5)


                    } else if (reagentLVolumePerReaction / 5 >= reagentRVolume) { // Variable ID3
                        // ReagentL is in excess or they have the same ratio
                        reagentLVolumeAfterReaction = reagentLVolumeAfterReaction - reagentRVolume * 5
                        reagentLUsed = reagentRVolume * 5
                        reagentRVolumeAfterReaction = reagentRVolumeAfterReaction - reagentRVolume //Total volume minus the total volume used for this reaction, which is all of it
                    }

                    // Now, we need to create a update the old volCol object. We will use volColTemp as we don't want to chance affecting the loop. 
                    // First step is to update the volume of the reagentR. 
                    // Volume of reagentL is updated outside of the for loop.
                    // But, if volume of reagentR is 0, we delete the key instead.
                    if (reagentRVolumeAfterReaction == 0) {
                        delete volColTemp[reagentR]
                    } else {
                        volColTemp[reagentR].volume = reagentRVolumeAfterReaction
                    }

                    // We also need to add the new product to volCol.
                    // We need to check if that object already exists as well.
                    // The volume of the new reactant is equal to the volume of reagentL used to create this reactant.
                    var reagentNVolume = reagentLUsed

                    for (var j = 0; j < reactionData.length; j++) {
                        var numberOfProducts = reactionData.length
                        var prod = reactionData[i]
                        if (volColTemp[prod.formula_id]) {
                            // already exists, just change the volume
                            volColTemp[prod['formula_id']].volume = volColTemp[prod['formula_id']].volume + Number(reagentNVolume / numberOfProducts)

                        } else {
                            // doesn't exist, create new
                            volColTemp[prod['formula_id']] = {
                                color: prod['color'],
                                odor: prod['odor'],
                                volume: Number(reagentNVolume / numberOfProducts),
                                state: prod['state'],
                                hex: prod['hex'],
                                cation: prod['cation'],
                                anion: prod['anion'],
                                formula_text: prod['formula_text'],
                                old_reagentL: reagentL,
                                old_reagentR: reagentR
                            }
                        }
                    }







                    // The volume of water is equal to the volume of reagentR used, which is equal to 1/5 the volume of reagentLUsed
                    var waterVolume = Number(reagentLUsed / 5) // Variable ID3

                    if (volColTemp['H₂O_(l)']) {
                        // already exists, just change the volume
                        volColTemp['H₂O_(l)'].volume = volColTemp['H₂O_(l)'].volume + waterVolume

                    } else {
                        // doesn't exist, create new
                        volColTemp['H₂O_(l)'] = {
                            color: 'colorless',
                            odor: 'odorless',
                            volume: waterVolume,
                            state: 'liquid',
                            hex: '',
                            cation: '',
                            anion: '',
                            formula_text: 'water',
                        }
                    }

                }

                // outside the for loop, we need to update volCol for reagentL. 
                // Similarly, we delete it if there isn't any more.
                if (reagentLVolumeAfterReaction == 0) {
                    delete volColTemp[reagentL]
                } else {
                    volColTemp[reagentL].volume = reagentLVolumeAfterReaction
                }

                // Update the test tube

            }
            console.log(volColTemp, "-----------------------")

            // Reset the colors
            colorArray = []
            colorWeight = []
            colorPptArray = []
            colorGasArray = []

            // Update the HTML text            
            var updatedHtmlArr = []
            // and the context menu
            var popupHtmlArr = [`<p> ${tube.item_name} </p>`, `<a onclick="inspect('${tube.div_id}')"> Inspect </a> <a onclick='duplicate("${tube.div_id}")'> Duplicate </a>`] // ID2
            // and the tube Apparatus class
            var containsTemp = []

            // CHECK FOR ATTACHED TUBE VIA DELIVERY TUBE, IF HAVE, SET TO TRUE
            var transferGas = false
            var newTube;
            if (tube.linked_to) {
                if (tube.linked_to.split("-")[0] == "delivery_tube") {
                    if (objectsInUse[tube.linked_to].linked_to) {
                        var deliveryTubeLinkedTo = objectsInUse[tube.linked_to].linked_to.split(",")
                        var firstTubeIndex = deliveryTubeLinkedTo.indexOf(id)
                        var secondTubeIndex = 1 - firstTubeIndex


                        if (objectsInUse[tube.linked_to].linked_to.split("-")[0] == "test_tube") {
                            // If 1) tube is linked to something,
                            // 2) that something is a delivery tube, 
                            // 3) that delivery tube is linked to something, 
                            // 4) that something is a test tube
                            transferGas = true
                            newTube = objectsInUse[objectsInUse[tube.linked_to].linked_to.split(",")[secondTubeIndex]]
                        }
                    }
                }
            }

            for (reagent of Object.keys(volColTemp)) {
                var hex = volColTemp[reagent].hex
                var color = volColTemp[reagent].color
                var volume = (volColTemp[reagent].volume).toFixed(2)
                var state = volColTemp[reagent].state
                var odor = volColTemp[reagent].odor

                /* Control HTML */
                if (reagent == "H₂O_(l)") {
                    updatedHtmlArr.push(`<p> ${formatChemForm(reagent)} </p>`) // ID1
                    popupHtmlArr.push(`<p> ${formatChemForm(reagent)} </p>`)
                } else if (reagent == "air") {
                    updatedHtmlArr.push(`<p> Air </p>`) // ID1
                    popupHtmlArr.push(`<p> Air </p>`)
                } else {
                    updatedHtmlArr.push(`<p> ${volume} cm³ ${formatChemForm(reagent)}, ${color} ${state}, ${odor}`)
                    if (state != "gas") {
                        popupHtmlArr.push(`<p> ${volume} cm³ </p> <p> ${formatChemForm(reagent)}`)
                    }


                }


                containsTemp.push({
                    formula_id_f: formatChemForm(reagent),
                    formula_text: volColTemp[reagent].formula_text,
                    volume: volume,
                    old_reagentL: volColTemp[reagent].old_reagentL,
                    old_reagentR: volColTemp[reagent].old_reagentR
                })

                // Update the 3 arrays needed for drawing colors, colorArray, colorWeight, colorPptArray, colorGasArray

                if (color != "colorless") {
                    switch (state) {
                        case "solution":
                            if (hex) {
                                colorArray.push(hex)
                            } else {
                                colorArray.push(color)
                            }
                            colorWeight.push(Number(volume));
                            break
                        case "precipitate":
                            if (hex) {
                                colorPptArray.push([hex, reagent])
                            } else {
                                colorPptArray.push([color, reagent])
                            }
                            break
                    }



                }
                if (state == "gas") {
                    if (hex) {
                        colorGasArray.push([hex, reagent])
                    } else {
                        colorGasArray.push([color, reagent])
                    }
                    // Transfer the gas
                    if (transferGas) {
                        // if gas
                        newTube.contains.push({
                            formula_id_f: formatChemForm(reagent),
                            formula_text: volColTemp[reagent].formula_text,
                            volume: volume,
                            old_reagentL: volColTemp[reagent].old_reagentL,
                            old_reagentR: volColTemp[reagent].old_reagentR
                        })
                    }
                }







            }
            if (transferGas) {
                // Update the new Tube html 
                var htmlArrNewTube = [`<p> ${newTube.item_name} </p> <a onclick='inspect("${newTube.div_id}")'> Inspect </a> <a onclick='duplicate("${newTube.div_id}")'> Duplicate </a>`]
                newTube.contains.forEach(e => {
                    if (e.formula_id_f == "H₂O (l)") {
                        htmlArrNewTube.push(`<p> ${e.formula_id_f} </p>`)
                    } else {
                        htmlArrNewTube.push(`<p> ${e.volume} cm³ ${e.formula_id_f} </p>`)
                    }
                })
                $(`#${newTube.div_id} > .popup`).html(htmlArrNewTube)

            }



            // We should probably only set the transition property before the second drawing
            $('#color-max').css({
                "transition": "background-color 7.5s linear"
            })

            // Liquid color
            var color = ""
            if (colorArray.length) {
                color = chroma.average(colorArray, 'rgb', colorWeight).hex()
                // I move this here, as we want to IGNORE setting it to colorless
                // IRL, even if a test tube has ppt + NaOH the color is NOT colorless
                // Ignore the above comments, ran into some issues
            } else {
                color = 'rgba(255,255,255, 0.3)' // We keep the old color ???
                // need to transition to colorless
            }

            $('#color-max').css({
                "background-color": `${color}`

            })



            // PPT 
            var availableColorDivs = {
                1: true,
                2: true,
                3: true
            }
            // First, we need to check if any of the existing ppts have dissolved / whatever, then we can animate that 
            // i.e. is in the volCol object but not in the new volColTemp object

            // Also need to check that 
            for (reagent of Object.keys(volCol)) {
                // PPT
                if (volCol[reagent].state == "precipitate") {
                    // Find out if this reagent exists in the new object
                    if (volColTemp[reagent]) {



                        // yes, still exists
                        // Don't do anything to it, set its div to FALSE
                        availableColorDivs[pptSDrawn[reagent]] = false

                    } else {
                        // no, no longer exists
                        // animate it's disapperance
                        // CODE HERE
                        console.log(pptSDrawn[reagent], "this is the PPT DIV ID")



                        $(`#ppt-${pptSDrawn[reagent]}`).fadeTo(7500, 0, () => {
                            $(this).css('filter', '')
                        })





                    }


                }




            }





            for (var i = 1; i < colorPptArray.length + 1; i++) {
                var rgbcol = chroma(colorPptArray[i - 1][0])

                // Check if 
                console.log(colorPptArray)

                var currentPpt = (colorPptArray[i - 1])[1]
                console.log(currentPpt)
                var oldReagentL = volColTemp[currentPpt].old_reagentL
                var oldReagentR = volColTemp[currentPpt].old_reagentR
                // Issue: If the PPT doesn't change, then we cannot call the previous item to find the original reagents as volCol only stores
                // the previous reaction. 
                // Either we ignore it if the ppt doesn't change (makes sense) or we do another DB query.
                if (volCol[oldReagentL] && volCol[oldReagentR]) {
                    if (volCol[oldReagentL].state == "precipitate" || volCol[oldReagentR].state == "precipitate") {
                        // This means that the the old reagentL was a ppt,
                        // hence we need to change that ppt's color INSTEAD of drawing a new ppt
                        // first find the div id for that
                        var div_id = `ppt-${pptSDrawn[oldReagentL]}`
                        // Now, change the color of THIS div only.
                        // blah blah change color code
                        $(`#${div_id}`).css({
                            "background-color": rgbcol,
                            "transition": "background-color 10s linear",
                            "opacity": "1"
                        })
                        $(`#${div_id}`).stop(true)
                        $(`#${div_id}`).fadeTo(1000, 1, () => {

                        })


                        // Remove availableColorDivs for this one
                        availableColorDivs[pptSDrawn[oldReagentL]] = false
                    } else if (volCol[oldReagentR].state == "precipitate") {
                        // This means that the the old reagentR was a ppt,
                        // hence we need to change that ppt's color INSTEAD of drawing a new ppt
                        // first find the div id for that
                        var div_id = `ppt-${pptSDrawn[oldReagentR]}`
                        // Now, change the color of THIS div only.
                        // blah blah change color code
                        $(`#${div_id}`).css({
                            "background-color": rgbcol,
                            "transition": "background-color 10s linear",
                            "opacity": "1"
                        })
                        $(`#${div_id}`).stop(true)
                        $(`#${div_id}`).fadeTo(1000, 1, () => {

                        })

                        // Remove availableColorDivs for this one
                        availableColorDivs[pptSDrawn[oldReagentR]] = false
                    } else {
                        // PPT is NEW, just draw a new div
                        for (divs of Object.keys(availableColorDivs)) {
                            if (availableColorDivs[divs]) {
                                // If available = true
                                // blah blah draw the color
                                console.log(divs)
                                $(`#ppt-${divs}`).css('background-color', `${rgbcol}`)
                                $(`#ppt-${divs}`).fadeTo(7500, 1, () => {

                                    console.log('done')
                                })


                                // Remove availableColorDivs

                                availableColorDivs[divs] = false
                                break

                            }
                        }

                    }
                } else {
                    // This means that the ppt didn't change, hence we shouldn't do anything to it
                    availableColorDivs[pptSDrawn[currentPpt]] = false
                }



                // $(`#ppt-${i}`).css({
                //     "filter": `${filteredCss}`,

                // })
            }

            // GAS calculation
            console.log(colorGasArray)
            var baseHeight = -315 // subtract 4% from this everytime
            $('.gas').remove()
            colorGasArray.forEach(async reagent => {
                // Includes colorless

                // This thing is a gas
                // Does the gas react with air to produdce another thing?? Find out here: 
                var gasReaction = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: reagent[1], right: "air" }))))

                var secondaryColor = ""
                var litmusGas;
                if (!gasReaction.error) {
                    // got secondary reaction
                    if (gasReaction.color != "colorless") {
                        if (gasReaction.hex) {
                            secondaryColor = chroma(gasReaction.hex)

                        } else {
                            secondaryColor = chroma(gasReaction.color)

                        }
                    }

                    litmusGas = gasReaction.produces_1

                } else {
                    // Check for litmus reaction
                    litmusGas = reagent[1]
                }

                // Check for litmus reaction
                // rememmeber to disable it after one reaction
                // !!
                if (hasLitmus) {
                    var litmusReaction = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: litmusGas, right: hasLitmus }))))
                    if (litmusReaction[0]) {
                        // Change the color 
                        if (litmusReaction[0].produces_1 == "damp_blue_litmus") {
                            // draw blue
                            $(`#paper-after`).css({
                                "background-image": "linear-gradient(#f4bbc5, #aab6dd)",
                                "opacity": "1"
                            })
                        } else if (litmusReaction[0].produces_1 == "damp_red_litmus") {
                            // draw red
                            $(`#paper-after`).css({
                                "background-image": "linear-gradient(#aab6dd, #f4bbc5)",
                                "opacity": "1"
                            })
                        } else if (litmusReaction[0].produces_1 == "bleached_red_litmus" || litmusReaction[0].produces_1 == "bleached_blue_litmus") {
                            // draw white
                            if (hasLitmus == "damp_red_litmus") {
                                $(`#paper-after`).css({
                                    "background-image": "linear-gradient(#f4bbc5, white)",
                                    "opacity": "1"
                                })
                            } else {
                                $(`#paper-after`).css({
                                    "background-image": "linear-gradient(#aab6dd, white)",
                                    "opacity": "1"
                                })
                            }

                        } else if (litmusReaction[0].produces_1 == "popped_lit_splint") {
                            $('#splint-after').hide(1000, () => $('#splint-after').show(2500))
                        } else if (litmusReaction[0].produces_1 == "relighted_glowing_splint") {

                            $('#splint-after').hide(1000, () => $('#splint-after').show(2500))
                        }

                    }
                }


                for (let i = 1; i < 30; i++) {
                    var timeoutLength = 100 + i * 10
                    await timeout(timeoutLength)

                    // Do this twice, once for the left side, once for the right side
                    // left
                    // randomize position
                    var lposx = `${getRandomArbitrary(30, 47.5)}%`
                    var lposy = `${baseHeight}%`
                    // create a div
                    $("#tube-image-div").append(`<div id='eff-${colorGasArray.indexOf(reagent)}-${i}-left' class="gas"></div>`)

                    // setTimeout(() => {
                    $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).css({
                        "left": lposx,
                        "top": lposy,
                        "opacity": 1,


                    })
                    // }, 0)
                    if (secondaryColor) {
                        setTimeout(() => {
                            $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).css('background-color', secondaryColor)
                        }, 0)


                    }


                    // animate it going up
                    var finalHeight = baseHeight - 150
                    var lfposy = `${finalHeight}%`
                    $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).animate({ 'top': lfposy }, 1500, () => {
                        console.log('done')
                        // $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).remove()
                    })

                    // Lower baseheight
                    baseHeight = baseHeight - 4.8
                    // set color
                    if (reagent[0] != "colorless") {
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).css('background-color', reagent[0])
                    }



                    // right
                    // randomize position
                    var rposx = `${getRandomArbitrary(47.5, 60)}%`
                    var rposy = `${baseHeight}%`
                    // create a div
                    $("#tube-image-div").append(`<div id='eff-${colorGasArray.indexOf(reagent)}-${i}-right' class="gas"></div>`)

                    $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).css({
                        "left": rposx,
                        "top": rposy,
                        "opacity": 1,

                    })

                    if (secondaryColor) {

                        setTimeout(() => {
                            $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).css('background-color', secondaryColor)
                        }, 0)
                    }
                    // animate it going up
                    var finalHeight = baseHeight - 150
                    var rfposy = `${finalHeight}%`
                    $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).animate({ 'top': rfposy }, 1500, () => {
                        console.log('done')
                        // $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).remove()
                    })

                    // Lower baseheight
                    baseHeight = baseHeight - 4.8
                    // set color

                    if (reagent[0] != "colorless") {
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).css('background-color', reagent[0])
                    }







                }



                // should perhaps delete this?






            })

            $('#info').html(updatedHtmlArr.join(" "))

            // Update the context-menu info            
            $(`#${id} > .popup`).html(popupHtmlArr.join(" "))

            // REMOVE the GASES from volColTemp and containsTemp and replace with water, since the gas has escaped
            var waterVolumeToAdd = 0
            var gasesToRemove = []
            for (reagent of Object.keys(volColTemp)) {
                if (volColTemp[reagent].state == "gas") {
                    gasesToRemove.push(reagent)
                    waterVolumeToAdd = waterVolumeToAdd + volColTemp[reagent].volume
                    delete volColTemp[reagent]
                }
            }

            // Add the water
            if (volColTemp['H₂O_(l)']) {
                volColTemp['H₂O_(l)'].volume = volColTemp['H₂O_(l)'].volume + waterVolumeToAdd
            } else {
                volColTemp['H₂O_(l)'] = {
                    anion: "",
                    cation: "",
                    color: "colorless",
                    formula_text: "water",
                    hex: "",
                    odor: "",
                    state: "liquid",
                    volume: waterVolumeToAdd,
                }
            }


            var noGasesContainsTemp = []
            var hasWater = false
            containsTemp.forEach(x => {
                if (!(gasesToRemove.includes(x.formula_id_f.split(" ").join("_")))) {

                    if (x.formula_text == "water") {
                        noGasesContainsTemp.push({
                            formula_id_f: x.formula_id_f,
                            formula_text: x.formula_text,
                            volume: Number(x.volume) + waterVolumeToAdd,
                        })
                        hasWater = true
                    } else {
                        noGasesContainsTemp.push(x)
                    }

                }
            })
            if (!hasWater) {
                noGasesContainsTemp.push({
                    formula_id_f: "'H₂O (l)",
                    formula_text: "water",
                    volume: waterVolumeToAdd,

                })
            }


            // Update the test-tube object with what it contains            
            tube.contains = noGasesContainsTemp




            // Reset the original volColTemp array:
            volCol = {};
            volCol = jQuery.extend({}, volColTemp)
            console.log(volCol)

            await timeout(10000)
            $('#rxt-status').html("Reaction finished.")
            $("#shake").prop('disabled', false);
            // shake()

        } else {
            console.log('AM DONE BIJ')
            $('#rxt-status').html("No further reaction possible.")
            $("#shake").prop('disabled', true);
        }





    }

    inspectFilter = async function (id) {
        $(`.filter-ppt`).css({
            "transition": ""
        })
        preventMove = true
        alertify.prompt("Inspecting filter", "",
            function (evt, value) {
                $("#filter-inspect").remove()
                $("#filter-info").remove()
                $("#reactAir").remove()
                preventMove = false
                // Replace the buttons
                $(".ajs-ok").show()
                $(".ajs-cancel").html("Cancel")
            }, function () {
                $("#filter-inspect").remove()
                $("#filter-info").remove()
                $("#reactAir").remove()
                preventMove = false
                $(".ajs-ok").show()
                $(".ajs-cancel").html("Cancel")
            }).setHeader("Filter Inspection")
        // Hide input box
        $('.ajs-input').hide()

        // Insert container for image
        $('.ajs-content').append('<div id="filter-inspect"></div>').append(`<button id="reactAir" onclick="reactAir('${id}')"> React with air </button>`).append('<div id="filter-info"></div>')
        $('#filter-inspect').append('<div id="filter-image-div"></div>')
        $('#filter-image-div').append('<div id="filter-background-image"></div>')
        $("#filter-image-div").append('<div id="filter-ppt-1" class="filter-ppt"></div>').append('<div id="filter-ppt-2" class="filter-ppt"></div>').append('<div id="filter-ppt-3" class="filter-ppt"></div>')
        // Replace the buttons
        $(".ajs-ok").hide()
        $(".ajs-cancel").html("Close")
        var funnel = objectsInUse[id]
        var pptSDrawn = {

        }
        var reagentsToQuery = []
        var pptVolume = {}
        funnel.contains.forEach(ppt => {
            reagentsToQuery.push(ppt.formula_id_f.split(" ").join("_"))
            pptVolume[ppt.formula_id_f] = ppt.volume
        })
        var data = JSON.parse(await Promise.resolve(($.get('/inspect/getPpt', { arr: reagentsToQuery }))))

        var infoHtml = []
        infoHtml.push(`<p id="rxt-status"> Click the button to begin reaction. </p>`)
        var volCol = {}
        for (var i = 1; i < data.length + 1; i++) {
            var ppt = data[i - 1]
            if (!pptSDrawn[i - 1]) {
                // pptSDrawn[i] = ppt.formula_id
                pptSDrawn[ppt.formula_id] = i
            }


            // Generate new color
            var color;
            if (ppt.hex) {
                color = chroma(ppt.hex)
            } else {
                color = chroma(ppt.color)
            }

            $(`#filter-ppt-${i}`).css({
                "background-color": color,
                "opacity": "1"
            })

            infoHtml.push(`<p> ${pptVolume[formatChemForm(ppt.formula_id)]} cm³ ${formatChemForm(ppt.formula_id)}, ${ppt.color} ${ppt.state} <p>`)
            volCol[ppt.formula_id] = {
                volume: pptVolume[formatChemForm(ppt.formula_id)],
                color: ppt.color,
                state: ppt.state
            }

        }


        $("#filter-info").html(infoHtml.join(" "))

        // await timeout(5000)

        reactAir = async function () {
            var reagentsToQuery = []

            funnel.contains.forEach(ppt => {
                reagentsToQuery.push(ppt.formula_id_f.split(" ").join("_"))

            })
            $('#reactAir').prop('disabled', true);

            $(`.filter-ppt`).css({
                "transition": "background-color 7.5s linear"
            })
            // Query database for possible reactions with air
            var data = JSON.parse(await Promise.resolve(($.get('/inspect/getAirReaction', { arr: reagentsToQuery }))))
            if (data.length) {
                $("#rxt-status").html("Reaction in progress...")
                // There's a reaction

                var oldPptItems = funnel.contains
                var newPptItems = []
                for (var i = 0; i < data.length; i++) {

                    var newPpt = data[i]
                    var oldDivNumber = pptSDrawn[newPpt.formula_id]
                    if (volCol[newPpt.produces_1]) {
                        // the new ppt already exists in volCol, thus it already existed, thus no change 
                        // Just change its volume and delete the old ppt
                        volCol[newPpt.produces_1].volume = Number(volCol[newPpt.produces_1].volume) + Number(volCol[newPpt.formula_id].volume)
                        var oldDivNumber = pptSDrawn[newPpt.formula_id]
                        $(`#filter-ppt-${oldDivNumber}`).css({
                            "background-color": "",
                            "opacity": "0"
                        })

                    } else {
                        // volCol[newPpt.formula_id] is the OLD ppt
                        volCol[newPpt.produces_1] = {
                            volume: volCol[newPpt.formula_id].volume, // same volume
                            color: newPpt.color,
                            state: newPpt.state,
                            formula_text: newPpt.formula_text
                        }
                        // Transition the color
                        var rgbcol;
                        if (newPpt.hex) {
                            rgbcol = chroma(newPpt.hex)
                        } else {
                            rgbcol = chroma(newPpt.color)
                        }


                        $(`#filter-ppt-${oldDivNumber}`).css({
                            "background-color": `${rgbcol}`,

                        })

                        // Delete the old key, set the new key
                        delete pptSDrawn[newPpt.formula_id]
                        pptSDrawn[newPpt.produces_1] = oldDivNumber





                    }


                    delete volCol[newPpt.formula_id]


                }


                await timeout(10000)

                // Reset the html array
                var newHtml = []
                newHtml.push(`<p id="rxt-status"> Reaction complete. </p>`)
                var newContains = []
                for (key of Object.keys(volCol)) {
                    newHtml.push(`<p> ${volCol[key].volume} cm³ ${formatChemForm(key)}, ${volCol[key].color} ${volCol[key].state}`)
                    newContains.push({
                        formula_id_f: formatChemForm(key),
                        formula_text: volCol[key].formula_text,
                        volume: volCol[key].volume
                    })
                }
                $("#filter-info").html(newHtml.join(" "))

                // Reset what the tube contains
                objectsInUse[id].contains = newContains

                // Transition the color







                $('#reactAir').prop('disabled', false);

            } else {
                $("#rxt-status").html("No further reaction possible.")
                $('#reactAir').prop('disabled', true);
            }



        }



    }

    detach = function (id) {
        var linkedTo;
        if (objectsInUse[id].linked_to) {
            linkedTo = objectsInUse[id].linked_to.split(",")
            linkedTo.forEach(e => {
                objectsInUse[e].linked_to = ""
            })
            objectsInUse[id].linked_to = ""
            $(`#${id} > .popup`).hide()
            makeMovable(id)
        }
    }

    duplicate = function (id) {
        try {
            // check number of objects used
            var objectToDuplicate = objectsInUse[id]
            var objectToDuplicateNumber = objectsUsed[objectToDuplicate.apparatus_id] // only allow duplicate apparatus
            // Update times used
            objectsUsed[objectToDuplicate.apparatus_id] = Number(objectToDuplicateNumber) + 1
            // Create new object
            currentlyMovingElem = `${objectToDuplicate.apparatus_id}-${Number(objectToDuplicateNumber)}`
            $('.movables').append(`<div class='interactive ${objectToDuplicate.apparatus_id} apparatus moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)

            isMoving = true
            preventMove = true
            var newObj = $.extend(true, Object.create(Object.getPrototypeOf(objectsInUse[id])), objectsInUse[id]);
            newObj.div_id = currentlyMovingElem
            objectsInUse[currentlyMovingElem] = newObj

            popupHtml()


        } catch (e) {

        } finally {

        }
    }

    extinguish = async function (id) {
        var oldId = id
        var oldIdNumber = oldId.split("-")[1]

        // prevent move
        preventMove = true

        var data = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: "glowing_splint" }))))
        var app = new Apparatus(data)
        var newId = `glowing_splint-${oldIdNumber}`
        objectsInUse[newId] = app

        // Get current left and top pos
        var left = $(`#${oldId}`).css('left')
        var top = $(`#${oldId}`).css("top")
        delete objectsInUse[oldId]
        $(`#${oldId}`).remove()


        $('.movables').append(`<div class='interactive ${app.apparatus_id} apparatus moving' id='${newId}' onclick="makeMovable('${newId}')"> </div>`)
        $(`#${newId}`).css({
            left: left,
            top: top,
            "background-image": app.image_url,

        })

        currentlyMovingElem = newId
        isMoving = true
        popupHtml()
        putDownItemInWorkingArea()
        preventMove = false
    }

    litmus = function () { // actually litmus is catchall term now
        if (currentlyMovingElem && !placedLitmus) {

            if (objectsInUse[currentlyMovingElem].apparatus_id == "damp_red_litmus" || objectsInUse[currentlyMovingElem].apparatus_id == "damp_blue_litmus") {
                placedLitmus = true
                $(document).unbind("mousemove")
                // run code
                $("#litmus").append("<div id='paper-before'></div>")
                if (objectsInUse[currentlyMovingElem].apparatus_id == "damp_red_litmus") {
                    $("#paper-before").css({
                        "background-color": "#f4bbc5"
                    })
                    hasLitmus = "damp_red_litmus"
                } else {
                    $("#paper-before").css({
                        "background-color": "#aab6dd"
                    })
                    hasLitmus = "damp_blue_litmus"
                }

                $("#litmus").append("<div id='paper-after'></div>")
                // Remove (or delete) the litmus paper? 
                // $(`#${currentlyMovingElem}`).css({
                //     'opacity': '0'
                // })
                $(`#${currentlyMovingElem}`).remove()
                delete objectsInUse[currentlyMovingElem]
                isMoving = false
                currentlyMovingElem = ""
                $('.movables > .interactive').css({ 'pointer-events': 'auto' })
                $('body').css({ 'pointer-events': 'auto' })

            } else if (objectsInUse[currentlyMovingElem].apparatus_id == "lit_splint") {
                placedLitmus = true
                $(document).unbind('mousemove')
                hasLitmus = "lit"
                $('#litmus').append("<div id='splint-before'> </div>").append('<div id="splint-after"></div>')
                $('#splint-after').css("background-image", "url(/images/mini/lit-splint.png)")





                $(`#${currentlyMovingElem}`).remove()
                delete objectsInUse[currentlyMovingElem]
                isMoving = false
                currentlyMovingElem = ""
                $('.movables > .interactive').css({ 'pointer-events': 'auto' })
                $('body').css({ 'pointer-events': 'auto' })
            } else if (objectsInUse[currentlyMovingElem].apparatus_id == "glowing_splint") {
                placedLitmus = true
                $(document).unbind('mousemove')
                hasLitmus = "glowing_splint"
                $('#litmus').append("<div id='splint-before'> </div>").append('<div id="splint-after"></div>')
                $('#splint-after').css("background-image", "url(/images/mini/glowing-splint.png)")





                $(`#${currentlyMovingElem}`).remove()
                delete objectsInUse[currentlyMovingElem]
                isMoving = false
                currentlyMovingElem = ""
                $('.movables > .interactive').css({ 'pointer-events': 'auto' })
                $('body').css({ 'pointer-events': 'auto' })
            }
        }



    }


    function popupHtml() {
        // Before calling this function, set 
        // isMoving to true;
        // preventMove (choose);
        // currentMovingElem;
        // objectsInUse[currentlyMovingElem] MUST exist

        var backgroundImageUrl = ''
        if (objectsInUse[currentlyMovingElem].image_url) {
            backgroundImageUrl = objectsInUse[currentlyMovingElem].image_url
        } else if (objectsInUse[currentlyMovingElem].location == "FAbasket") {
            backgroundImageUrl = 'url(/images/mini/fa-bottle.png)'
        } else if (objectsInUse[currentlyMovingElem].location == "bench") {
            backgroundImageUrl = 'url(/images/mini/reagent-bottle.png)'
        }
        $(`#${currentlyMovingElem}`).css({
            'background-image': backgroundImageUrl
        })

        $(document).on('mousemove', function (e) {
            if (isMoving) {
                if (listenToMouseMove) {
                    $(`#${currentlyMovingElem}`).css({
                        left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                        top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",

                        "pointer-events": "none",


                    });
                }




            }

        });
        $('body').css({ 'pointer-events': 'none' })
        $('.working-area').css({ 'pointer-events': 'auto' })

        // add popup html

        var elementIdToReference = currentlyMovingElem

        var popupHTML = [`<div class="popup">`]


        var className = objectsInUse[elementIdToReference].constructor.name
        if (className == "Apparatus") {
            var attributes = objectsInUse[elementIdToReference].attribute.split(",")
            popupHTML.push(`<p> ${objectsInUse[elementIdToReference].item_name} </p>`)
            if (attributes.includes("inspectable")) {
                popupHTML.push(`<a onclick="inspect('${elementIdToReference}')"> Inspect </a>`)
            }
            if (attributes.includes("foldable")) {
                popupHTML.push(`<a onclick='fold("${elementIdToReference}")'> Fold filter paper </a>`)
            }
            if (attributes.includes("duplicate")) {
                popupHTML.push(`<a onclick="duplicate('${elementIdToReference}')"> Duplicate </a>`)
            }
            if (attributes.includes("extinguish")) {
                popupHTML.push(`<a onclick="extinguish('${elementIdToReference}')"> Extinguish </a>`)
            }
            objectsInUse[currentlyMovingElem].contains.forEach(ele => {
                if (ele.formula_id_f == "H₂O (l)") {
                    popupHTML.push(`<p> ${ele.formula_id_f} </p>`)
                } else {
                    popupHTML.push(`<p> ${ele.volume} cm³ ${ele.formula_id_f} </p>`)
                }

            })
        } else if (className == "FAReagent" || className == "BenchReagent") {
            popupHTML.push(`<p> ${objectsInUse[elementIdToReference].name} </p>`)
        }



        popupHTML.push(`</div>`)


        $(`#${currentlyMovingElem}`).append(popupHTML.join(" "))
        $(`#${currentlyMovingElem} > .popup`).hide()






        $(`#${currentlyMovingElem}`).contextmenu(function (e) {
            $(`#${e.target.id}`).css({
                "z-index": "100"
            })


            // triggers on child divs too, so prevent that
            if (this != e.target) return; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
            // Prevent default right-click
            e.preventDefault()
            // get rid of all elements below           



            // Listener for click, so as to remove the popup
            $('body').click(function (evt) {
                // https://stackoverflow.com/questions/12661797/jquery-click-anywhere-in-the-page-except-on-1-div
                if (evt.target.classList.contains('popup'))
                    return;
                //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
                if ($(evt.target).closest('.popup').length)
                    return;

                //Do processing of click event here for every element except with id menu_content
                $(e.target).children('.popup').hide()
                console.log("bodyclick")
                $(`#${e.target.id}`).css({
                    "z-index": ""
                })

            })
            // add popup
            $(e.target).children('.popup').show()
        })
    }





    function formatChemForm(str) {
        return str.split("_").join(" ")
    }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function preloadImages(array) {
        if (!preloadImages.list) {
            preloadImages.list = [];
        }
        var list = preloadImages.list;
        for (var i = 0; i < array.length; i++) {
            var img = new Image();
            img.onload = function () {
                var index = list.indexOf(this);
                if (index !== -1) {
                    // remove image from the array once it's loaded
                    // for memory consumption reasons
                    list.splice(index, 1);
                }
            }
            list.push(img);
            img.src = array[i];
        }
    }

    preloadImages(["/images/mini/fa-bottle.png", "/images/mini/reagent-bottle.png", "/images/mini/test-tube.png", "/images/filter-paper-unfolded.png", "/images/filter-paper-folded.png", "/images/funnel.png", "/images/filter-funnel.png", "/images/mini/delivery-tube.png", "/images/background-heat-shield.jpg", "/images/background-tap-on-heat-shield.jpg", "/images/background-tap-on.jpg"]);

    // Create goggles
    ; (async () => {
        var data = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: "safety_goggles" }))))
        var app = new Apparatus(data)
        objectsUsed[app.apparatus_id] = 1
        var newId = `${app.apparatus_id}-0`
        objectsInUse[newId] = app
        $(".movables").append(`<div class='interactive ${app.apparatus_id} apparatus moving' id='${newId}' onclick="makeMovable('${newId}')"> </div>`)
        isMoving = true
        currentlyMovingElem = newId
        popupHtml()
        putDownItemInWorkingArea(true)
        $(`#${newId}`).css({
            left: "87.5vw",
            top: "22vw"
        })
    })();

})
