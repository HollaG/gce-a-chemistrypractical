

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
        $('#inspect').append('<div id="background-image"></div>')
        // Add the color divs
        $('#background-image').append('<div id="color-bottom" class="color"></div>').append('<div id="color-middle-bottom" class="color"></div>').append('<div id="color-middle-top" class="color"></div>').append('<div id="color-top" class="color"></div>').append('<div id="color-max" class="color"></div>').append('<div id="color-volume-blocker" class="color"></div>').append('<div id="background-image-volume"></div>')

        // Add the ppt div

        // Add the effevescene div

        // Color
        var colorArray = []
        var colorPptArray = [] // no color-weight for this one, if there are > 1 ppt we will draw that
        var colorGasArray = []
        var colorWeight = []
        // var colorPptWeight = []
        // var colorGasWeight = []


        // START LOGIC TO CALCULATE REACTIONS
        var tube = objectsInUse[id]
        // console.log('---------------------------------------------')
        // console.log(tube)



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




        // var tempArr = []
        // data.forEach(row => {
        //     if (row.cation || row.anion) {
        //         if (row.cation) {
        //             tempArr.push(row.cation)
        //         }
        //         if (row.anion) {
        //             tempArr.push(row.anion)
        //         }
        //     } else {
        //         tempArr.push(row.formula_id)
        //     }

        // })
        tempArr = [...new Set(tempArr)]
        reagentsToQuery = tempArr
        console.log("reagents To query I should see K+ and MnO4-", reagentsToQuery)


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

                /*
                reacting.forEach(reaction => {
                    console.log('------------', reaction, '---------------')
                    // If the object AllReactingReagents already has a key which is the same as the "formula_id" value; we need to add the reagent to its property
                    var reagentL = reaction[Object.keys(reaction)[0]] // L for limited, E for excess
                    var reagentE = Object.keys(reaction)[0]
                    // reagent L should be the key; reagent E should be the value

                    if (allReactingReagents[reagentL]) {
                        var a = allReactingReagents[reagentL] // an array
                        a.push(reagentE)
                        allReactingReagents[reagentL] = a


                    } else {
                        allReactingReagents[reagentL] = [reagentE]
                    }


                    // allReactingReagents.push(reaction)
                    allReactingReagentsSimple.push(reagentL, reagentE) // push just the reagents, no fancy objects;


                })


                
                */
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
                                colorPptArray.push(volCol[reagent].hex)

                            } else {
                                colorPptArray.push(volCol[reagent].color)
                            }
                            colorPptWeight.push(volCol[reagent].volume)
                            break;
                        case "gas":
                            if (volCol[reagent].hex) {
                                colorGasArray.push(volCol[reagent].hex)

                            } else {
                                colorGasArray.push(volCol[reagent].color)
                            }
                            colorGasWeight.push(volCol[reagent].volume)
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
                            colorPptArray.push(volCol[t.formula_id].hex)

                        } else {
                            colorPptArray.push(volCol[t.formula_id].color)
                        }
                        colorPptWeight.push(volCol[t.formula_id].volume)
                        break;
                    case "gas":
                        if (volCol[t.formula_id].hex) {
                            colorGasArray.push(volCol[t.formula_id].hex)

                        } else {
                            colorGasArray.push(volCol[t.formula_id].color)
                        }
                        colorGasWeight.push(volCol[t.formula_id].volume)
                        break;

                }





                // if (volCol[t.formula_id].hex) {
                //     colorArray.push(volCol[t.formula_id].hex)
                // } else {
                //     colorArray.push(volCol[t.formula_id].color)
                // }
                // colorWeight.push("1")
            }
            $('#info').html(`<p> ${volCol[t.formula_id].volume} cm³ ${formatChemForm(t.formula_id)}, ${volCol[t.formula_id].color} ${volCol[t.formula_id].state}, ${volCol[t.formula_id].odor} </p>`)

        }

        // Calculate color
        // We need to IGNORE the color if it's a PPT. 

        var color = ""
        if (colorArray.length) {
            color = chroma.average(colorArray, 'rgb', colorWeight).hex()
        } else {
            color = 'rgba(255,255,255, 0.3)'
        }


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
        console.log(percentageFull, "percentageFull", currentVolume, maxVolume)
        if (percentageFull > 0) {
            // 1/5 full, draw bottommost line
            $('#color-bottom').css({
                "-webkit-backdrop-filter": "blur(10px)",
                "backdrop-filter": "blur(10px)",
                "background-color": `${color}`
            })
        }
        if (percentageFull > 0.2) {
            $('#color-middle-bottom').css({
                "-webkit-backdrop-filter": "blur(10px)",
                "backdrop-filter": "blur(10px)",
                "background-color": `${color}`
            })
        }
        if (percentageFull > 0.4) {
            $('#color-middle-top').css({
                "-webkit-backdrop-filter": "blur(10px)",
                "backdrop-filter": "blur(10px)",
                "background-color": `${color}`
            })
        }
        if (percentageFull > 0.6) {
            $('#color-top').css({
                "-webkit-backdrop-filter": "blur(10px)",
                "backdrop-filter": "blur(10px)",
                "background-color": `${color}`
            })
        }
        if (percentageFull > 0.8) {
            $('#color-max').css({
                "-webkit-backdrop-filter": "blur(10px)",
                "backdrop-filter": "blur(10px)",
                "background-color": `${color}`
            })
        }

        // volCol & allReactingReagents
        var allReactingReagentsTemp = { ...allReactingReagents };


        var volColTemp = { ...volCol }

        /* 
            Note to self, this creates a SHALLOW COPY, meaing that nested arrays and stuff are NOT unlinked from the original array.
            I chose to leave it as is because I want the properties that I'm updating (volume) to change, but NOT the new properties that i'm adding in.
            See: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        */

        console.log('------------------------------')
        console.log("allReactingReagents", allReactingReagents, JSON.stringify(allReactingReagents))
        console.log("volCol", volCol, JSON.stringify(volCol))
        console.log('----------------------------')










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
                            formula_text: reactionData['formula_text']
                        }
                    }

                    // We also need to update the test tube, with 1) what it contains and b) what its total volume is now


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

            // Reset the original volColTemp array:
            volCol = {};
            volCol = jQuery.extend({}, volColTemp)
            console.log(volCol)

            // Update the HTML text            
            var updatedHtmlArr = []
            // and the context menu
            var popupHtmlArr = [`<p> ${tube.item_name} </p>`, `<a onclick="inspect('${tube.div_id}')"> Inspect </a>`]
            // and the tube Apparatus class
            var containsTemp = []
            for (reagent of Object.keys(volColTemp)) {
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

            }
            $('#info').html(updatedHtmlArr.join(" "))

            // Update the context-menu info            
            $("#test_tube-0 > .popup").html(popupHtmlArr.join(" "))

            // Update the test-tube object with what it contains            
            tube.contains = containsTemp

        }











        /*
        if (Object.keys(allReactingReagents).length) {
            // Reaction is going to occur
            // allReactingReagents: "{"Al³⁺_(aq)":["NH₃_(aq), NaOH_(aq)"]}",
            // volCol: 
            // Al³⁺_(aq): {color: "colorless", odor: "odorless", volume: 7, state: "solution", hex: ""},
            // Ca²⁺_(conc): {color: "colorless", odor: "", volume: 5, state: "solution", hex: ""},
            // NH₃_(aq): {color: "colorless", odor: "", volume: 8, state: "solution", hex: ""}

            // assume ratio is 5:1
            for (reagentL of Object.keys(allReactingReagents)) {
                // edit the volume
                var numberOfReactionsForThisReagentL = allReactingReagents[reagentL].length
                var reagentLVolume = volCol[reagentL].volume
                // if (numberOfReactionsForThisReagentL) {
                var reagentLVolumePerReaction = Number(reagentLVolume) / Number(numberOfReactionsForThisReagentL)
                var newReagentLVolumeLeft = 0
                for (var i = 0; i < numberOfReactionsForThisReagentL; i++) {
                    // REACTION OCCURING (confirm one)
                    var reagentR = allReactingReagents[reagentL][i]
                    var reactionData = JSON.parse(await Promise.resolve(($.get('/inspect/getProduct', { left: reagentL, right: reagentR, requires: " " }))))
                    // what is the product? 
                    var product = new Chemical(reactionData)

                    var reagentRVolume;
                    if (!volCol[reagentR]) {
                        // this is a cation
                        // BIG BIG PROBLEM HERE: IF WE ARE ONLY GIVEN OH-, IT CAN BE NAOH, KOH, ANY OF THE GROUP 1 METALS
                        // check if cation or anion
                        var type = (reagentR.split("_")[0].split('')[reagentR.split("_")[0].split('').length - 1]) == "⁺" ? "cation" : "anion"
                        var possibleCompounds = JSON.parse(await Promise.resolve(($.get('/inspect/getPossibleCompounds', { reagent: reagentL, ion: reagentR, type: type, product: product.formula_id }))))
                        reagentRVolume = volCol[possibleCompounds.formula_id].volume
                    } else {
                        reagentRVolume = volCol[reagentR].volume
                    }





                    var newReagentRVolume;
                    // Volume of the new product should be equal to the volume for the old product
                    if (reagentLVolumePerReaction / 5 < reagentRVolume) {
                        // reagentL is limiting, all reagentL should be gone
                        newReagentLVolumeLeft = newReagentLVolumeLeft + 0;
                        newReagentRVolume = reagentRVolume - (reagentLVolumePerReaction / 5)


                    } else {
                        // reagentL is in excess, all reagentRvolume should be gone
                        newReagentLVolumeLeft = newReagentLVolumeLeft + (reagentLVolume - (reagentRVolume * 5))
                        newReagentRVolume = 0;

                    }
                    // each reactant set back the volume
                    volCol[reagentR].volume = newReagentRVolume

                    console.log(product, "product!")
                    // add the new product for each loop
                    if (volColTemp[product.formula_id]) {
                        // product is already in the test tube beforehand
                        volColTemp[product.formula_id] = { // update the temp object so that we can push it back into the main object, while ensuring we don't check the reactants
                            color: product.color,
                            odor: product.odor,
                            volume: Number(volColTemp[product.formula_id].volume) + Number(reagentLVolumePerReaction - newReagentLVolumeLeft),
                            state: product.state,
                            hex: product.hex
                        }

                    } else {
                        // product is not in the test tube
                        volColTemp[product.formula_id] = { // update the temp object so that we can push it back into the main object, while ensuring we don't check the reactants
                            color: product.color,
                            odor: product.odor,
                            volume: reagentLVolumePerReaction - newReagentLVolumeLeft,
                            state: product.state,
                            hex: product.hex
                        }
                    }

                    // change the volumes of the existing ones
                    volColTemp[reagentR].volume = newReagentRVolume

                }
                volCol[reagentL].volume = newReagentLVolumeLeft; // update the main object so we know that its changing and won't double count                    





                // } else {
                //     // REACTION OCCURING
                //     // only reacts with 1 other thing
                //     var reagentR = numberOfReactionsForThisReagent[i]


                // }
            }

            console.log("volCol", volCol)
            console.log("volColTemp", volColTemp)
        }
        */





    }


    // module.exports = { 
    //     clickedBasket: clickedBasket
    // }

    function formatChemForm(str) {
        return str.split("_").join(" ")
    }


})
