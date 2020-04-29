

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

    var objectsInUse = {

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
                            left: e.pageX - $(`#${currentlyMovingElem}`).width() / 2,
                            top: e.pageY - $(`#${currentlyMovingElem}`).height() / 2,

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
                objectsInUse[objNo] = new Apparatus(mostRecentApparatus, currentlyMovingElem)






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

                        var popupHTML = `<div class="popup"> <p> ${objectsInUse[elementIdToReference].item_name} </p></div>`

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
                            left: e.pageX - $(`#${currentlyMovingElem}`).width() / 2,
                            top: e.pageY - $(`#${currentlyMovingElem}`).height() / 2,

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
                            left: e.pageX - $(`#${currentlyMovingElem}`).width() / 2,
                            top: e.pageY - $(`#${currentlyMovingElem}`).height() / 2,
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
                            left: e.pageX - $(`#${currentlyMovingElem}`).width() / 2,
                            top: e.pageY - $(`#${currentlyMovingElem}`).height() / 2,
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

    makeMovable = function (id) {
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
                            if (itemClicked.attribute == "inspectable") {
                                updatedHTMLArr.push(`<a onclick='inspect("${itemClicked.div_id}")'> Inspect </a>`)
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


            }


            return
        }
        isMoving = true
        $(document).on('mousemove', function (e) {

            $(`#${id}`).css({
                left: e.pageX - $(`#${currentlyMovingElem}`).width() / 2,
                top: e.pageY - $(`#${currentlyMovingElem}`).height() / 2,
                "pointer-events": "none", // allow click through this element
            })
        })
        $('body').css({ 'pointer-events': 'none !important' }) // prevent clicking anywhere else 
        $('.working-area').css({ 'pointer-events': 'auto' }) // other than the working-area
        // $('.movables > .interactive').css({ 'pointer-events': 'none' }) // and prevent clicking on the other movables as well
        currentlyMovingElem = id
        $(`#${currentlyMovingElem}`).toggleClass('moving').toggleClass('on-working-area')

    }

    inspect = async function (id) {
        // Draw the big screen
        console.log("INSPECTINGGGGGGGGGGGGGGGGGGGGGGGGG")
        preventMove = true
        alertify.prompt("inspecting shit", "",
            function (evt, value) {
                $('#inspect').remove()
                $('#info').remove()
                preventMove = false
            },
            function () {
                $('#inspect').remove()
                $('#info').remove()
                preventMove = false
            })

        // Hide input box and expand the box
        $('.ajs-input').hide()
        // expand the area   
        $('.ajs-content').append('<div id="inspect"></div>').append('<div id="info"></div>')
        $('#inspect').append('<div id="tube-image-div"></div>')
        $('#tube-image-div').append('<div id="background-image"></div>')
        // Add the color divs
        $('#background-image').append('<div id="color-max" class="color"></div>').append('<div id="background-image-volume"></div>')
        // Add the ppt div
        $("#tube-image-div").append(`<div id='ppt-1' class="ppt"></div>`).append(`<div id='ppt-2' class="ppt"></div>`).append(`<div id='ppt-3' class="ppt"></div>`)
        // Add the effevescene div





        // START LOGIC TO CALCULATE REACTIONS



        var tube = objectsInUse[id]

        /* -------------- PART 1: WHAT'S INSIDE THE TUBE AND WHAT DOES IT REACT WITH --------------*/
        react()
        async function react() {

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
                })

                data.forEach(row => {
                    var t = new Reactant(row)
                    var reacting = t.checkIfReactable(reagentsToQuery) // check if any reacting reagent can react with others
                    console.log('reacting with', t.formula_id, reacting)
                    if (reacting.length) { // if the thing is reacting 
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
                })

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



            /* -------------- PART 3: START REACTION CALCULATION --------------*/

            // volCol & allReactingReagents
            var allReactingReagentsTemp = { ...allReactingReagents };


            var volColTemp = { ...volCol }

            /* 
                Note to self, this creates a SHALLOW COPY, meaing that nested arrays and stuff are NOT unlinked from the original array.
                I chose to leave it as is because I want the properties that I'm updating (volume) to change, but NOT the new properties that i'm adding in.
                See: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
            */

            // only bother executing the logic if there are more than 2 things inside
            if (Object.keys(allReactingReagents).length) {
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
                        var reactionData = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: encodeURI(reagentL), right: encodeURI(reagentR) }))))

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
                        volume: volume
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
                    var oldReagentL = volColTemp[colorPptArray[i - 1][1]].old_reagentL
                    var oldReagentR = volColTemp[colorPptArray[i - 1][1]].old_reagentR
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
                        availableColorDivs[pptsDrawn[oldReagentR]] = false
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


                    // $(`#ppt-${i}`).css({
                    //     "filter": `${filteredCss}`,

                    // })
                }

                // GAS calculation
                console.log(colorGasArray)
                var baseHeight = -315 // subtract 4% from this everytime
                colorGasArray.forEach(async reagent => {

                    // This thing is a gas
                    
                    for (var i = 1; i < 30; i++) {
                        var timeoutLength = 100 + i*10
                        await timeout(timeoutLength)

                        // Do this twice, once for the left side, once for the right side
                        // left
                        // randomize position
                        var lposx = `${getRandomArbitrary(30, 47.5)}%`
                        var lposy = `${baseHeight}%`
                        // create a div
                        $("#tube-image-div").append(`<div id='eff-${colorGasArray.indexOf(reagent)}-${i}-left' class="gas"></div>`)
                        
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).css({
                            "left": lposx,
                            "top": lposy,
                            "opacity": 1
                        })
                        // animate it going up
                        var finalHeight = baseHeight - 150
                        var lfposy = `${finalHeight}%`
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).animate({'top': lfposy}, 1500, () => {
                            console.log('done')
                            $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-left`).remove()
                        })                        

                        // Lower baseheight
                        baseHeight = baseHeight - 4.8
                        // set color
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}`)                      
                        

                        // right
                        // randomize position
                        var rposx = `${getRandomArbitrary(47.5, 60)}%`
                        var rposy = `${baseHeight}%`
                        // create a div
                        $("#tube-image-div").append(`<div id='eff-${colorGasArray.indexOf(reagent)}-${i}-right' class="gas"></div>`)
                        
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).css({
                            "left": rposx,
                            "top": rposy,
                            "opacity": 1
                        })
                        // animate it going up
                        var finalHeight = baseHeight - 150
                        var rfposy = `${finalHeight}%`
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).animate({'top': rfposy}, 1500, () => {
                            console.log('done')
                            $(`#eff-${colorGasArray.indexOf(reagent)}-${i}-right`).remove()
                        })                        

                        // Lower baseheight
                        baseHeight = baseHeight - 4.8
                        // set color
                        $(`#eff-${colorGasArray.indexOf(reagent)}-${i}`)   




             


                    }



                    // should perhaps delete this?






                })




























                /*
    
                // PPT 
                for (var i = 1; i < colorPptArray.length + 1; i++) {
                    var rgbcol = chroma(colorPptArray[i - 1][0]).rgb()
                    var color = new Color(rgbcol[0], rgbcol[1], rgbcol[2])
                    var solver = new Solver(color)
                    var result = solver.solve()
                    var filteredCss = result.filter // returns the filtered string
                    $("#tube-image-div").append(`<div id='ppt-${i}' class="ppt"></div>`)
                    console.log(filteredCss)
                    // Check if 
    
    
    
                    $(`#ppt-${i}`).css({
                        "filter": `${filteredCss}`,
    
                    })
                }
                // Gas
                */

                $('#info').html(updatedHtmlArr.join(" "))

                // Update the context-menu info            
                $("#test_tube-0 > .popup").html(popupHtmlArr.join(" "))

                // Update the test-tube object with what it contains            
                tube.contains = containsTemp

                // Reset the original volColTemp array:
                volCol = {};
                volCol = jQuery.extend({}, volColTemp)
                console.log(volCol)

                await timeout(8000)
                react()

            } else {
                console.log('AM DONE BIJ')
            }


        }

        /* -------------- PART 4: START TIMER TO DELAY UNTIL THE NEXT FUNCTION EXECUTION --------------*/















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
