

$(document).ready(function () {

    // Static objects
    var apparatusImageLink = {
        'dropper': "url(/images/apparatus/dropper.png)",
        "ten-mc": "url(/images/apparatus/graduated-cylinder.png)",
        "fifty-mc": "url(/images/apparatus/graduated-cylinder.png)"
    }


    console.log("hey")
    // var $ = require('jquery')
    // var alertify = require('alertifyjs')
    // var SlimSelect = require('slim-select')
    // alertify.alert('hey')


    var isMoving = false // used to check if you click on another div when youre holding a div
    var preventMove = false // used to check when youre clicking on a link in the popup
    var heldItem = ""
    var objectsUsed = {

    }
    var currentlyMovingElem;
    var mostRecentApparatus;
    var mostRecentChemical;

    var tubes = {}
    var bench = {}
    var reagents = {}

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


    // Compound - cation-anion relationship
    clickedBasket = async function () {
        // AJAX to server to retrieve apparatus in the basket
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "basket" }))))


        // Prompt user: which to select?
        alertify.prompt('Select apparatus', "dropper",
            async function (evt, value) {
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

                // Make div follow cursor
                $(document).on('mousemove', function (e) {
                    console.log(isMoving)
                    if (isMoving) {
                        $(`#${currentlyMovingElem}`).css({
                            left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                            top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",

                            "pointer-events": "none", // allow click-through
                            'background-image': data[value][0].image_url // set background image

                        });



                    }

                });

                // Prevent clicking on the body
                $('body').css({ 'pointer-events': 'none' })
                // except the working-area
                $('.working-area').css({ 'pointer-events': 'auto' })

                mostRecentApparatus = data[value][0]


                var objNo = `${mostRecentApparatus.apparatus_id}-${Number(objectsUsed[mostRecentApparatus.apparatus_id]) - 1}`
                var item = new Apparatus(mostRecentApparatus, currentlyMovingElem)
                objectsInUse[objNo] = item






                console.log("^^^^^^^^^^^^^^^^^")
                console.log(objectsInUse)
                $(`#${currentlyMovingElem}`).contextmenu(function (e) {
                    // triggers on child divs too, so prevent that
                    console.log(this, "thisthisthishtishtishits")
                    if (this != e.target) {
                        console.log("FALSE FALSE FALSE FALSE")
                        isMoving = false
                        return
                    }; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
                    // Prevent default right-click
                    e.preventDefault()
                    // get rid of all elements below
                    if ($(`#${e.target.id}`).children().length == 0) {
                        // no children aka first time
                        var elementIdToReference = e.target.id

                        // var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].item_name} </p></div>`
                        var popupHTMLArr = [`<div class="popup">`, `<p> ${objectsInUse[elementIdToReference].item_name} </p>`]
                        if (item.attribute == "foldable") {
                            popupHTMLArr.push(`<a onclick='fold("${this.id}")'> Fold filter paper </a>`)

                        }
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

            }, function () {
                alertify.error('cancel')
                // Remove the slimSelect
                basketSelect.destroy()
                $('#basket-prompt').remove()

            })


        // select the prompt and hide the default input box
        $('.ajs-input').hide()

        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = []
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
            onChange: (args) => {
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })


    }

    clickedRack = async function () {
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "rack" }))))
        alertify.prompt('Select apparatus', 'boiling_tube',
            async function (evt, value) {
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                currentlyMovingElem = `${value}-${timesUsed}`

                $('.movables').append(`<div class='interactive ${value} apparatus moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)


                alertify.success('Ok:' + value)
                rackSelect.destroy()
                $('#rack-prompt').remove();
                heldItem = value
                isMoving = true
                var vH = $('html').height();
                var vW = $('html').width();
                $(document).on('mousemove', function (e) {
                    if (isMoving) {
                        $(`#${currentlyMovingElem}`).css({
                            left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                            top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",

                            "pointer-events": "none",
                            'background-image': data[value][0].image_url

                        });



                    }

                });


                $('body').css({ 'pointer-events': 'none' })
                $('.working-area').css({ 'pointer-events': 'auto' })

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





                $(`#${currentlyMovingElem}`).contextmenu(function (e) {
                    // triggers on child divs too, so prevent that
                    if (this != e.target) return; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
                    // Prevent default right-click
                    e.preventDefault()
                    // get rid of all elements below

                    if ($(`#${e.target.id}`).children().length == 0) {
                        // no children aka first time
                        var elementIdToReference = e.target.id

                        var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].item_name} </p></div>`

                        $(e.target).append(popupHTML)
                    }
                    // $(e.target).empty()

                    console.log("prevented handler for", e.target)

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

                    })
                    // add popup
                    $(e.target).children('.popup').show()
                })


            }, function () {
                alertify.error('cancel')
                rackSelect.destroy()
                $('#rack-prompt').remove()

            })

        // select the prompt and hide the input
        $('.ajs-input').hide()

        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = []
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].apparatus_id}'> ${data[key][0].item_name} </option>`
            )
        }


        $('.ajs-input').after(`<select id="rack-prompt"> ${str.join(" ")} </select> `)
        var rackSelect = new SlimSelect({
            select: "#rack-prompt",
            onChange: (args) => {
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })


    }

    clickedBench = async function () {

        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "bench" }))))

        alertify.prompt('Select chemical', 'ammonia_0_aq',
            async function (evt, value) {
                var timesUsed = objectsUsed[value] || 0
                objectsUsed[value] = timesUsed + 1
                currentlyMovingElem = `${value}-${timesUsed}`

                $('.movables').append(`<div class='interactive ${value} bench-bottle moving' id='${currentlyMovingElem}' onclick="makeMovable('${currentlyMovingElem}')"> </div>`)


                alertify.success('Ok:' + value)
                benchSelect.destroy()
                $('#bench-prompt').remove();
                heldItem = value
                isMoving = true
                var vH = $('html').height();
                var vW = $('html').width();
                $(document).on('mousemove', function (e) {
                    if (isMoving) {
                        $(`#${currentlyMovingElem}`).css({
                            left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                            top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",
                            "pointer-events": "none",
                            'background-image': 'url(/images/apparatus/bottle.png)'
                        });

                    }


                });


                $('body').css({ 'pointer-events': 'none' })
                $('.working-area').css({ 'pointer-events': 'auto' })
                console.log('------------------------------', data, value)
                mostRecentChemical = data[value][0]

                // -----

                var chemNumber = `${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                // var chemNumber = `bench-${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                objectsInUse[chemNumber] = new BenchReagent(mostRecentChemical, currentlyMovingElem)

                $(`#${currentlyMovingElem}`).contextmenu(function (e) {
                    // triggers on child divs too, so prevent that
                    if (this != e.target) return; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
                    // Prevent default right-click
                    e.preventDefault()
                    // get rid of all elements below
                    if ($(`#${e.target.id}`).children().length == 0) {
                        // no children aka first time
                        var elementIdToReference = e.target.id

                        var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].name} </p> <p> ${formatChemForm(objectsInUse[elementIdToReference].formula_id)} </p> </div>`

                        $(e.target).append(popupHTML)
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


            }, function () {
                alertify.error('cancel')
                benchSelect.destroy()
                $('#bench-prompt').remove()

            })
        // select the prompt and hide the input
        $('.ajs-input').hide()

        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = []
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].formula_text}'> ${data[key][0].name} </option>`
            )
        }


        $('.ajs-input').after(`<select id="bench-prompt"> ${str.join(" ")} </select> `)
        var benchSelect = new SlimSelect({
            select: "#bench-prompt",
            onChange: (args) => {
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })

    }

    clickedReagents = async function () {
        console.log('clicked')
        var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: "reagents" }))))

        // console.log(JSON.stringify(data))
        alertify.prompt('Select chemical', 'aluminium_3p_aq',
            async function (evt, value) {
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
                $(document).on('mousemove', function (e) {
                    if (isMoving) {
                        $(`#${currentlyMovingElem}`).css({
                            left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                            top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",
                            "pointer-events": "none",
                            'background-image': 'url(/images/apparatus/bottle.png)'
                        });

                    }


                });


                $('body').css({ 'pointer-events': 'none' })
                $('.working-area').css({ 'pointer-events': 'auto' })

                mostRecentChemical = data[value][0]

                // -------------
                var chemNumber = `${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`
                // var chemNumber = `FAbasket-${mostRecentChemical.formula_text}-${Number(objectsUsed[mostRecentChemical.formula_text]) - 1}`


                var reactionData = JSON.parse(await Promise.resolve(($.get('/reagentData', { formula_id: encodeURI(mostRecentChemical.formula_id) }))))
                // var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: mostRecentChemical.formula_id }))))
                objectsInUse[currentlyMovingElem] = new FAReagent(mostRecentChemical, reactionData, currentlyMovingElem)



                $(`#${currentlyMovingElem}`).contextmenu(function (e) {
                    // triggers on child divs too, so prevent that
                    if (this != e.target) return; // https://stackoverflow.com/questions/34113635/click-event-on-child-div-trigger-action-despite-click-handler-was-set-on-parent
                    // Prevent default right-click
                    e.preventDefault()
                    // get rid of all elements below
                    if ($(`#${e.target.id}`).children().length == 0) {
                        // no children aka first time
                        var elementIdToReference = e.target.id

                        var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].name} </p> <p> ${formatChemForm(objectsInUse[elementIdToReference].formula_id)} </p> </div>`

                        $(e.target).append(popupHTML)
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

            }, function () {
                alertify.error('cancel')
                reagentSelect.destroy()
                $('#reagent-prompt').remove()

            })
        // select the prompt and hide the input
        $('.ajs-input').hide()

        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)
        var str = []
        for (key of Object.keys(data)) {

            str.push(
                `<option value='${data[key][0].formula_text}'> ${data[key][0].name} ${formatChemForm(data[key][0].formula_id)} </option>`
            )
        }


        $('.ajs-input').after(`<select id="reagent-prompt"> ${str.join(" ")} </select> `)
        var reagentSelect = new SlimSelect({
            select: "#reagent-prompt",
            onChange: (args) => {
                console.log('onchange')
                console.log(args)
                $('.ajs-input').val(args.value)

            }
        })
    }

    putDownItemInWorkingArea = async function () {
        console.log('putdown')
        if (isMoving) {
            isMoving = false;
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
            alertify.error("Destination test tube does not have enough capacity!")

            return

        }
        
        // // 1) Popup asking how much volume for them to transfer
        // alertify.prompt(`Enter volume of solution to transfer. ${startTubeVolume} cm³ available`, " ", (evt, value) => {
        //     // yes ppts
        //     $(".ajs-ok").html("Ok")
        //     $(".ajs-cancel").html("Cancel")
        //     common(value, true)



        // },
        //     () => {
        //         // no ppt
        //         // common(value, false)


        //         $(".ajs-ok").html("Ok")
        //         $(".ajs-cancel").html("Cancel")

        //     })

        // First we need to check if the total volume of everything (not including water and ppt) is less than the available volume
        






        alertify.prompt(`Filter out precipitate as well?`, "yes", (evt, value) => {
            transferSoln(value)
            pptSelect.destroy()
            $("#ppt-prompt").remove()

        }, () => {
            pptSelect.destroy()
            $("#ppt-prompt").remove()

        })

        // Hide input
        $(".ajs-input").hide()

        var pptHtml = `<select id="ppt-prompt"> <option value="yes"> Yes </option> <option value="no> No </option> </select>`
        $('.ajs-input').after(pptHtml)
        var pptSelect = new SlimSelect({
            select: "#ppt-prompt",
            onChange: (args) => {
                $('.ajs.input').val(args.value)
            }
        })




        function transferSoln(ppt) {
            // transfer all liquids; 
            var tubeContents = $.extend([], objectsInUse[start].contains)
            var changingTubeContents = []
            var newTubeContents = $.extend([], objectsInUse[end].contains)

            var thingsToAddToNewTube = {}
            var newPopupHtmlForOldTube = [`<p> ${objectsInUse[start].item_name} </p> <a onclick="inspect('${start}')"> Inspect </a>`]
            var volumeToAdd; 
            for (var i = 0; i < tubeContents.length; i++) {
                var reagent = tubeContents[i]
                if (ppt == "yes") {
                    // Transfer ppt as well
                } else {
                    newPopupHtmlForOldTube.push(`<p> ${reagent.volume} cm³ ${(reagent.formula_id_f)} </p>`)
                }
                if (reagent.formula_id_f != "H₂O (l)") {
                    // not a ppt and not water, i.e. aqueous

                    if (reagent.formula_id_f.split(" ")[1] == "(s)") {
                        if (ppt == "yes") {
                            // if ppt is no don't do anything
                        } else {
                            changingTubeContents.push(reagent)
                        }

                        // ADD TO THE FILTER NOT TO THE TEST TUBE
                        // thingsToAddToNewTube[reagent.formula_id_f] = {
                        //     formula_text: reagent.formula_text,
                        //     volume: reagent.volume,
                        //     old_reagentL: reagent.old_reagentL,
                        //     old_reagentR: reagent.old_regeantR
                        // }
                    } else {
                        thingsToAddToNewTube[reagent.formula_id_f] = {
                            formula_text: reagent.formula_text,
                            volume: reagent.volume,
                            old_reagentL: reagent.old_reagentL,
                            old_reagentR: reagent.old_regeantR
                        }
                        delete changingTubeContents

                    }

                } else {
                    // changingTubeContents.push(water) 
                    // Add HTML
                    newPopupHtmlForOldTube.push(`<p> ${reagent.volume} cm³ ${(reagent.formula_id_f)} </p>`)

                }
            }


            // delete the old contains
            objectsInUse[start].contains = [
                {
                    formula_text: "water",
                    formula_id_f: "H₂O (l)",
                    volume: 10
                }
            ]

            var newPopupHtmlForNewTube = [`<p> ${objectsInUse[end].item_name} </p> <a onclick="inspect('${end}')"> Inspect </a>`]
            for (var i = 0; i < newTubeContents.length; i++) {
                var newReagent = newTubeContents[i]
                if (Object.keys(thingsToAddToNewTube).includes(newReagent.formula_id_f)) {
                    // It's in the new one, just change the volume
                    objectsInUse[end].contains[i].volume = (Number(objectsInUse[end].contains[i].volume) + Number(newReagent.volume)).toFixed(2)
                    newPopupHtmlForNewTube.push(`<p> ${objectsInUse[end].contains[i].volume} cm³ ${newReagent.formula_id_f} </p>`)
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
                newPopupHtmlForNewTube.push(`<p> ${thingsToAddToNewTube[key].volume} cm³ ${key} </p>`)
            }

            // Update the new test tube html
            if (!$(`#${end} > .popup`).length) {
                $(`#${end}`).append("<div class='popup'></div>")
            }
            $(`#${end} > .popup`).html(newPopupHtmlForNewTube.join(" "))

            // Update the old test tube html 
            // What's left: water, possible ppt


            // update the new test tube space



            // Update HTML


        }





        // // Temporarily change the OK and Cancel buttons, change them back after the fact
        // $(".ajs-ok").html("Transfer w/ ppt")
        // $(".ajs-cancel").html("Transfer w/out ppt")


















        // function common(amt, ppt) {
        //     var tubeContents = objectsInUse[start].contains
        //     var newTubeContents = objectsInUse[end].contains
        //     // calculate amount to subtract 

        //     // HTML popup
        //     var oldHtmlArr = [`<p> ${objectsInUse[start].item_name} </p>`, `<a onclick='inspect("${start}")'> Inspect </a>`]
        //     var newHtmlArr = [`<p> ${objectsInUse[end].item_name} </p>`, `<a onclick='inspect("${end}")'> Inspect </a>`]
        //     var newHtmlArrThingsToAdd = []
        //     for (var i = 0; i < tubeContents.length; i++) {
        //         var reagent = tubeContents[i]
        //         if (reagent.formula_id_f.split(" ")[1] != "(s)") {
        //             if (reagent.formula_id_f != "H₂O (l)") {
        //                 // is not ppt and is not water
        //                 // i.e. we ignore the water
        //                 var volumeToSubtractPerReagent = (((amt) / (startTubeVolume)) * (reagent.volume)).toFixed(2)
        //                 var oldTubeFinalVolumePerReagent = (Number(reagent.volume) - volumeToSubtractPerReagent).toFixed(2) // for each reagent

        //                 // Let's deal with the old tube first. 
        //                 // First we need to a) delete the reagent in contains if it doesn't exist anymore, 
        //                 // or b) we need to set its volume.

        //                 // Then, we need to deal with the HTML array. 
        //                 // Since we are already looping over the whole array, we will just set the push the new volumes
        //                 // of each reagent, NOT INCLUDING WATER
        //                 // We don't push if volume == 0

        //                 if (Number(oldTubeFinalVolumePerReagent) == 0) {
        //                     // nothing left
        //                     objectsInUse[start].contains.splice(i, 1)

        //                 } else {
        //                     objectsInUse[start].contains[i].volume = oldTubeFinalVolumePerReagent;
        //                     oldHtmlArr.push(`<p> ${oldTubeFinalVolumePerReagent} cm³ ${reagent.formula_id_f} </p>`)
        //                 }



        //                 // Now we need to deal with the new tube.
        //                 // First we need to check if this reagent exists.
        //                 // If it exists, we just change its volume, if it doesn't then we need to add it.
        //                 var existsInNew = false
        //                 for (var j = 0; j < objectsInUse[end].contains.length; j++) {
        //                     var newTubeReagent = objectsInUse[end].contains[j]
        //                     if (newTubeReagent.formula_id_f == reagent.formula_id_f) { 
        //                         // It does exist!
        //                         // Modify its volume
        //                         objectsInUse[end].contains[j].volume = (Number(objectsInUse[end].contains[j].volume) + Number(volumeToSubtractPerReagent)).toFixed(2)
        //                         // Push to html Array
        //                         newHtmlArr.push(`<p> ${objectsInUse[end].contains[j].volume} cm³ ${reagent.formula_id_f} </p>`)
        //                         existsInNew = true
        //                         break
        //                     }
        //                 }
        //                 if (!existsInNew) { 
        //                     objectsInUse[end].contains.push({
        //                         formula_id_f: reagent.formula_id_f,
        //                         formula_text: reagent.formula_text,
        //                         volume: volumeToSubtractPerReagent,
        //                         old_reagentL: reagent.old_reagentL,
        //                         old_regeantR: reagent.old_reagentR
        //                     })
        //                     // Push to html array
        //                     newHtmlArr.push(`<p> ${volumeToSubtractPerReagent} cm³ ${reagent.formula_id_f} </p>`)

        //                 } 







        //             }





        //         } else if (ppt && reagent.formula_id_f.split(" ")[1] == "(s)") {
        //             // Transferring the ppt to the filter funnel
        //             // check if it exists
        //             var exists = false
        //             for (var j = 0; j < objectsInUse[filterFunnelId].contains.length; j++) {
        //                 var r = objectsInUse[filterFunnelId].contains[j]
        //                 if (r.formula_id_f == reagent.formula_id_f) {
        //                     // exists
        //                     exists = true
        //                     objectsInUse[filterFunnelId].contains[j].volume = Number(objectsInUse[filterFunnelId].contains[j].volume) + Number(reagent.volume)
        //                     newHtmlArr.push(`<p> ${objectsInUse[filterFunnelId].contains[j].volume} cm³ ${reagent.formula_id_f} </p>`)
        //                     break
        //                 }
        //             }
        //             if (!exists) {
        //                 objectsInUse[filterFunnelId].contains.push({
        //                     formula_id_f: reagent.formula_id_f,
        //                     formula_text: reagent.formula_text,
        //                     volume: reagent.volume,
        //                     old_reagentL: reagent.old_reagentL,
        //                     old_regeantR: reagent.old_reagentR
        //                 })
        //                 newHtmlArr.push(`<p> ${volumeToSubtractPerReagent} cm³ ${reagent.formula_id_f} </p>`)
        //             }

        //             // Remove old reagent


        //         }
        //     }
        //     // Update the old tube contains volume
        //     objectsInUse[start].spaceUsed = Number(objectsInUse[start].spaceUsed) - Number(amt)
        //     objectsInUse[end].spaceUsed = Number(objectsInUse[end].spaceUsed) + Number(amt)


        //     // Set the HTML popups
        //     // old
        //     $(`#${start} > .popup`).html(oldHtmlArr.join(" "))
        //     // new
        //     if ($(`#${end} > .popup`).length) {
        //         $(`#${end} > .popup`).html(newHtmlArr.join(" "))
        //     } else {
        //         $(`#${end}`).append("<div class='popup'></div>")
        //         $(`#${end} > .popup`).html(newHtmlArr.join(" ")).hide()
        //     }




        // }



        // 3) Go check out containsTemp, for each of the chemical's volumes, divide that by x
        // where x is equal to [user input]/[total volume not including water]*volume of that reagent

        // Subtract the amount from "start"'s containsTemp

        // Add the amount to "end"'s containsTemp

        // if PPt is selected, remove all ppl from start's contains and put it in the filter funnel

        // if ppt is not selected, don't touch it
        // remember to update the spaceUsed properties too

    }

    makeMovable = async function (id) {
        if (preventMove) return
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
                            alertify.error('Number out of range!')
                            return false
                        } else {
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
                                    // if (item.formula_text == heldItem.formula_text) { 
                                    //     obj.push({ 
                                    //         formula_text: heldItem.formula_text,
                                    //         formula_id_f: formatChemForm(heldItem.formula_id),
                                    //         volume: Number(item.volume) + Number(value)
                                    //     })
                                    //     console.log('same')
                                    // } else { 
                                    //     obj.push({ // add new item
                                    //         formula_text: heldItem.formula_text,
                                    //         formula_id_f: formatChemForm(heldItem.formula_id),
                                    //         volume: Number(value)
                                    //     })

                                    //     obj.push(item) // keep old item
                                    //     console.log('different')
                                    // }

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

                            if (itemClicked.attribute == "inspectable") {
                                updatedHTMLArr.push(`<a onclick='inspect("${itemClicked.div_id}")'> Inspect </a>`)

                                // only if theres thing in the test tube
                            }

                            itemClicked.contains.forEach(item => {
                                updatedHTMLArr.push(`<p> ${item.volume} cm³ ${item.formula_id_f} </p>`)
                            })
                            updatedHTMLArr.push("</div>")
                            console.log("RUNNING")
                            console.log(updatedHTMLArr.join(""))

                            $(`#${id}`).empty().append(updatedHTMLArr.join("")).children('.popup').hide()



                            alertify.success(`Added ${value} cm³ of ${heldItem.name} to the ${itemClicked.item_name}. <br />${itemClicked.remainingSpace} cm³ remaining.`)

                            // $(`#${itemClicked.div_id}`).contextMenu(d)
                        }
                        console.log(itemClicked, "ITEM CLICKED AFTER ADDING")
                    })


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
                    "background-image": `${app.image_url}`
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
                    var left = ((((Number($(`#${tube_id}`).css("left").replace(/\D/g, ''))) / document.body.clientWidth) * 100) + 0.5817) + "vw"  // returns PX values
                    var top = ((((Number($(`#${tube_id}`).css("top").replace(/\D/g, ''))) / document.body.clientWidth) * 100) - 1) + "vw"  // returns PX values


                    // Disable pointer-events
                    $(`#${currentlyMovingElem}`).css({
                        "pointer-events": 'none',
                        "left": left,
                        "top": top
                    })
                    // Set it down at a certain position
                    putDownItemInWorkingArea()

                    // Teleport the item to the correct place




                    // Change the background picture of the test tube
                    // $(`#${tube_id}`).css({
                    //     "background-image": `url('/images/mini/test-tube-funnel-paper.png')`
                    // }).addClass("test_tube_funnel_filter")


                    isMoving = false


                }

            } else if (heldItem.apparatus_id == "test_tube" && itemClicked.interact_with.split(",").includes("filter_funnel")) {
                var testTubeId = currentlyMovingElem;
                var testTubeWithFilterId = id

                // pouring shit from one to another
                // button to transfer ppt? 
                // call external function
                // ONly run THI FUNCTION IF THERE IS A FILTER ON TOP OF IT 

                filter(testTubeId, testTubeWithFilterId)
                //




            }


            // else if ((heldItem.apparatus_type == "container" || heldItem.type == "bottle") && itemClicked.interact_with.split(",").includes("filter_funnel"))


            return
        }
        isMoving = true
        $(document).on('mousemove', function (e) {

            $(`#${id}`).css({
                left: ((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100 + "vw",
                top: ((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100 + "vw",
                "pointer-events": "none", // allow click through this element
            })
            if (objectsInUse[id]) {
                if (objectsInUse[id].linked_to) {
                    // it's linked to something
                    if (objectsInUse[id].linked_to.split("-")[0] == "filter_funnel") {
                        $(`#${objectsInUse[id].linked_to}`).css({
                            left: ((((e.pageX - $(`#${currentlyMovingElem}`).width() / 2) / document.body.clientWidth) * 100) + 0.5817) + "vw",
                            top: ((((e.pageY - $(`#${currentlyMovingElem}`).height() / 2) / document.body.clientWidth) * 100) - 1) + "vw",
                            "pointer-events": "none", // allow click through this element

                        })
                        $(`#${objectsInUse[id].linked_to}`).toggleClass('moving').toggleClass('on-working-area')

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
            "background-image": `${app.image_url}`
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
        // Draw the big screen
        console.log("INSPECTINGGGGGGGGGGGGGGGGGGGGGGGGG")
        preventMove = true
        alertify.prompt("inspecting shit", "",
            function (evt, value) {
                $('#inspect').remove()
                $('#info').remove()
                $("#rxt-status").remove()
                $("#shake").remove()
                preventMove = false
            },
            function () {
                $('#inspect').remove()
                $('#info').remove()
                $("#rxt-status").remove()
                $("#shake").remove()
                preventMove = false
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

        var tube = objectsInUse[id]


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
                HTMLarr.push(`<p> ${volCol[reagent].volume} cm³ ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`)
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
            $('#info').html(`<p> ${volCol[t.formula_id].volume} cm³ ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)

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
                var rgbcol = chroma(colorPptArray[i - 1][0]).rgb()
                var color = new Color(rgbcol[0], rgbcol[1], rgbcol[2])
                var solver = new Solver(color)
                var result = solver.solve()
                var filteredCss = result.filter // returns the filtered string                
                console.log(filteredCss)
                $(`#ppt-${i}`).css({
                    "filter": `${filteredCss}`,
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
                HTMLarr.push(`<p> ${volCol[reagent].volume} cm³ ${formatChemForm(reagent)}, ${volCol[reagent].color} ${volCol[reagent].state}, ${volCol[reagent].odor} </p>`)
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
            $('#info').html(`<p> ${volCol[t.formula_id].volume} cm³ ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)

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
                console.log(filteredCss)
                // $(`#ppt-${i}`).css({
                //     "filter": `${filteredCss}`,
                //     "opacity": "1"
                // })
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



                    console.log(reactionData)

                    // Sometimes, if the reagentR is NaOH (etc), it'll be in the form of an array. The third element of this array will always be the base element. Hence,
                    if (Array.isArray(reagentR)) {
                        // We will just set the reagentR to NaOH, makes it easier
                        reagentR = reagentR[2]
                    }
                    var reagentRVolumeAfterReaction = volCol[reagentR].volume

                    var reagentRVolume = Number(tempReagentRObj[reagentR][1]) / Number(tempReagentRObj[reagentR][0])
                    // var reagentRVolume = Number(volCol[reagentR].volume)/Number(tempReagentRObj[reagentR]) // Divide the volume allocated for tihs reaction by the number of times this reactant is used


                    // Calculate how much reagentL was used in THIS reaction.
                    var reagentLUsed = 0
                    // Find which reagent, L or R, is in excess.
                    if (reagentLVolumePerReaction / 5 < reagentRVolume) {
                        // ReagentR is in excess
                        // ReagentL will have 0 volume for this reaction
                        reagentLVolumeAfterReaction = reagentLVolumeAfterReaction - reagentLVolumePerReaction
                        reagentLUsed = reagentLVolumePerReaction // used Everything
                        reagentRVolumeAfterReaction = reagentRVolumeAfterReaction - Number(reagentLVolumePerReaction / 5)


                    } else if (reagentLVolumePerReaction / 5 >= reagentRVolume) {
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
                    if (volColTemp[reactionData.formula_id]) {
                        // already exists, just change the volume
                        volColTemp[reactionData['formula_id']].volume = volColTemp[reactionData['formula_id']].volume + reagentNVolume

                    } else {
                        // doesn't exist, create new
                        volColTemp[reactionData['formula_id']] = {
                            color: reactionData['color'],
                            odor: reactionData['odor'],
                            volume: reagentNVolume,
                            state: reactionData['state'],
                            hex: reactionData['hex'],
                            cation: reactionData['cation'],
                            anion: reactionData['anion'],
                            formula_text: reactionData['formula_text'],
                            old_reagentL: reagentL,
                            old_reagentR: reagentR
                        }
                    }

                    // The volume of water is equal to the volume of reagentR used, which is equal to 1/5 the volume of reagentLUsed
                    var waterVolume = Number(reagentLUsed / 5)

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
            var popupHtmlArr = [`<p> ${tube.item_name} </p>`, `<a onclick="inspect('${tube.div_id}')"> Inspect </a>`]
            // and the tube Apparatus class
            var containsTemp = []
            for (reagent of Object.keys(volColTemp)) {
                var hex = volColTemp[reagent].hex
                var color = volColTemp[reagent].color
                var volume = (volColTemp[reagent].volume).toFixed(2)
                var state = volColTemp[reagent].state
                var odor = volColTemp[reagent].odor
                updatedHtmlArr.push(`<p> ${volume} cm³ ${formatChemForm(reagent)}, ${color} ${state}, ${odor}`)
                popupHtmlArr.push(`<p> ${volume} cm³ </p> <p> ${formatChemForm(reagent)}`)
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
                }

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
                var rgbcol = chroma(colorPptArray[i - 1][0]).rgb()
                var color = new Color(rgbcol[0], rgbcol[1], rgbcol[2])
                var solver = new Solver(color)
                var result = solver.solve()
                var filteredCss = result.filter // returns the filtered string
                // $("#tube-image-div").append(`<div id='ppt-${i}' class="ppt"></div>`)
                console.log(filteredCss)
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
                        var div_id = `ppt-${pptsDrawn[oldReagentL]}`
                        // Now, change the color of THIS div only.
                        // blah blah change color code

                        // Remove availableColorDivs for this one
                        availableColorDivs[pptsDrawn[oldReagentL]] = false
                    } else if (volCol[oldReagentR].state == "precipitate") {
                        // This means that the the old reagentR was a ppt,
                        // hence we need to change that ppt's color INSTEAD of drawing a new ppt
                        // first find the div id for that
                        var div_id = `ppt-${pptsDrawn[oldReagentR]}`
                        // Now, change the color of THIS div only.
                        // blah blah change color code

                        // Remove availableColorDivs for this one
                        availableColorDivs[pptSDrawn[oldReagentR]] = false
                    } else {
                        // PPT is NEW, just draw a new div
                        for (divs of Object.keys(availableColorDivs)) {
                            if (availableColorDivs[divs]) {
                                // If available = true
                                // blah blah draw the color
                                console.log(divs)
                                $(`#ppt-${divs}`).css('filter', `${filteredCss}`)
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

                // This thing is a gas
                // Does the gas react with air to produdce another thing?? Find out here: 
                var gasReaction = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: reagent[1], right: "air" }))))

                var secondaryColor = ""
                if (!gasReaction.error) {
                    // got secondary reaction
                    if (gasReaction.color != "colorless") {
                        if (gasReaction.hex) {
                            secondaryColor = chroma(gasReaction.hex)

                        } else {
                            secondaryColor = chroma(gasReaction.color)

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

    // module.exports = { 
    //     clickedBasket: clickedBasket
    // }

    function formatChemForm(str) {
        return str.split("_").join(" ")
    }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

})
