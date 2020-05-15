

$(document).ready(function () {
    var tutorialInProgress = false
    help = function () {
        // Prompt user to select what they need help with
        alertify.prompt("What do you need help with?", "-",
            function (evt, value) {
                if (value == "-") {
                    // alertify.error()
                    return false
                }
                switch (value) {
                    case "aa": aa(); break;
                    case "a": a(); break;
                    case "b": b(); break;
                    case "c": c(); break;
                    case "d": d(); break;
                    case "e": e(); break;
                }
                tutorialInProgress = true
                $(document).on("slimChange", async () => {
                    console.log("sadfjkabdsjkf")
                    if (tutorialInProgress) {
                        await timeout(100)
                        $(".ss-option").addClass("ss-disabled no-click")
                    }
                })

                helpSelect.destroy()
                $("#help").remove()
                $(".help").css("pointer-events", "none")
            },
            function () {
                helpSelect.destroy()
                $("#help").remove()
            }

        ).setHeader("FAQ")
        $(".ajs-ok").addClass("cust-disabled")
        $('.ajs-input').hide()
        var str = [
            `<option data-placeholder="true"></option>`,
            `<option value="aa"> Basic: Getting Started </option>`,
            `<option value="a"> ✓ Basic: Standard Test for Cation / Anion </option>`,
            `<option value="b"> ✓ Basic: Filtration </option>`,
            `<option value="c"> ✓ Advanced: Standard Test for Gas using Litmus Paper </option>`,
            `<option value="d"> ✓ Advanced: Standard Test for Gas using Delivery Tube </option>`,
            `<option value="e"> X Advanced: Using the Bunsen Burner </option>`

        ]
        $(".ajs-input").after(`<select id='help'> ${str.join(' ')} </select>`)
        var helpSelect = new SlimSelect({
            select: "#help",
            placeholder: "Select a guide...",
            onChange: (args) => {
                $('.ajs-input').val(args.value)
                $(".ajs-ok").removeClass("cust-disabled")
            }
        })


    }

    async function aa() {
        var stage = 1
        var listenRightClick_1 = false
        var listenRightClick_2 = false
        intro = introJs()

        intro.onchange(async (e) => {
            console.log("stage", stage)
            switch (stage) {
                case 2:
                    $(".introjs-nextbutton").hide()
                    $(".introjs-overlay").hide()
                    $(".rack").css("pointer-events", "auto")

                    $(".rack").on("click", async () => {

                        await timeout(100)

                        $(".rack").css("pointer-events", "")
                        $(".racks").off("click");
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 3: // listen for when take test tube

                    // Disable all options except for test tube



                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 4: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $(".introjs-helperLayer").css("opacity", "0")

                        $(".working-area").off("click").attr("style", "z-index: 5 !important")
                        $("body").css("pointer-events", "none")

                    });
                    break;
                case 5:
                    $(".introjs-nextbutton").show()
                    $(".introjs-helperLayer").css("opacity", "0")


                    break
                case 6:
                    await timeout(10)
                    $(".introjs-helperLayer").css("opacity", "0")
                    intro._introItems[6].element = document.querySelector('.test_tube');
                    intro._introItems[6].position = "top"
                    listenRightClick_1 = true
                    break
                case 7:
                    $(".introjs-nextbutton").hide()
                    $(".introjs-helperLayer").css("opacity", "0.8")
                    $(".working-area").off("click").attr("style", "z-index: auto")
                    $("#test_tube-0").on("contextmenu", async () => {
                        if (listenRightClick_1) {
                            $("#test_tube-0 > .popup > a").css("pointer-events", "none")

                            await timeout(100)
                            intro._introItems[7].element = document.querySelector(".test_tube > .popup")
                            intro._introItems[7].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick_1 = false

                    })
                    break;
                case 8: // listen for when click on bencgh    
                    
                    $(".introjs-nextbutton").show()                
                    $(".bench").css("pointer-events", "auto")
                    $(".bench").on("click", async () => { // Step 2

                        await timeout(100)
                        $("body").css("pointer-events", "auto")
                        $(".bench").css("pointer-events", "")
                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 9: // listen for when take reagent bottle
                    // Disable all options except for test tube                  
                    $("#test_tube-0 > .popup > a").css("pointer-events", "auto")
                    $(".introjs-nextbutton").hide() 
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[10].element = document.querySelector("#test_tube-0")
                        intro._introItems[10].position = "top"
                        $(".ajs-ok").off("click");
                        intro.nextStep()

                    })
                    break;
                case 10:
                    $("#test_tube-0").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $("#test_tube-0").off("click");
                        $(".introjs-helperLayer").hide()
                    })
                    break;

                case 11: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 12: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[13].element = document.querySelector('#test_tube-0');
                        intro._introItems[13].position = "top"
                        intro.nextStep()
                        listenRightClick_2 = true
                        $(".working-area").off("click");
                    })
                    break;
                case 13:
                    $("#test_tube-0").on("contextmenu", async () => {
                        if (listenRightClick_2) {
                            await timeout(100)
                            intro._introItems[14].element = document.querySelector(".test_tube > .popup")
                            intro._introItems[14].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick_2 = false

                    })
                    break;
                case 14: 
                    $(".test_tube > .popup > .duplicate").css("pointer-events", "none")
                    $(".test_tube > .popup > .inspect").on("click", async () => {
                        $(".test_tube > .popup > .duplicate").css("pointer-events", "")
                        await timeout(500)
                        
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;

            }

            stage = stage + 1



        })

        intro.onexit(() => {
            $(".help").css("pointer-events", "auto")
            $("body").css("pointer-events", "auto")
            tutorialInProgress = false
            $(document).off("slimChange")
        })
        intro.setOptions({
            exitOnEsc: true,
            steps: [
                {
                    intro: "This tutorial will show you the basics of how to use this website. <br /> <br />This tutorial, and others, can be played at any time by clicking the ? icon at the <b>bottom right</b>. <br /> <br />Quit the tutorial at any time by pressing <b>ESC</b> on your keyboard."

                },
                {
                    element: document.querySelector(".rack"),
                    intro: "Click on the objects on the table to take the apparatus. <br /> For example, click on this <b>Test Tube Rack </b> to take a Test Tube."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Items that are being moved can be placed on the <b>working area</b> (highlighted) by clicking on the working area."
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Items can be picked up from the working area at any time, but they can only be placed on the working area, nowhere else. <br /><br />Play around with it, and when you are ready, click <b>Next</b> to proceed."
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Go ahead and experiment with taking other items. <br /> Click <b>Next</b> once you are ready to proceed."
                },
                {
                    element: document.querySelector("#test_tube-0"),
                    intro: "Right clicking on objects will reveal more information about them. <br /> For example, right clicking on this Test Tube reveals information such as it's <b>contents</b>, and any functions that it has. <br /><br /><b>Right Click</b> on this Test Tube now."
                },
                {
                    element: document.querySelector("#test_tube-0 > .popup"),
                    intro: "Currently, this Test Tube contains nothing. <br /> Let's add something to it. <br /><br />Click <b>Next</b> to proceed."
                },
                {
                    element: document.querySelector(".bench"),
                    intro: "Click on the Chemical Bench to collect a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Choose any reagent.",
                    position: "top"
                },
                {
                    element: document.querySelector("#test_tube-0"),
                    intro: "To transfer solutions, <b>click</b> on the destination apparatus with the source. <br />For example, clicking on the Test Tube while holding the reagent bottle will transfer solution from the reagent bottle to the Test Tube. <br /><br />In some ways, the apparatus currently moving is in your \"hand\", and you are pouring its contents into the item being clicked on. <br /><br />Click on the Test Tube now."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "You can choose to transfer any amount (0 to 20 cm³) of solution. <br />Note that once added, solution cannot be removed! Enter a number, then press \"OK\".",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place down the bottle."
                },
                {
                    element: document.querySelector("#test_tube-0"),
                    intro: "Right click on the Test Tube."
                },
                {
                    element: document.querySelector("#test_tube-0 > .popup"),
                    intro: "Now, we can see that there is XX cm³ of X in the Test Tube. <br />Click on <b>Inspect</b> to observe the Test Tube."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "This page is where reactions can occur. In this simulation, reactions only occur if you click on <b>Shake</b>. <br /> Reactions occur one level at a time, meaning that in order to see Copper (II) forming a blue ppt and then dissolving to form a dark-blue solution, the <b>Shake</b> button must be clicked twice. <br /><br />This is the end of the Getting Started tutorial. To see more in-depth tutorials, please click on the <b>? icon</b>  at the bottom right of the page. Thank you!"
                }
            ]
        })
        intro.start()
        $(".introjs-nextbutton").show()
        await timeout(10)
        $(".introjs-overlay").show()
        $("body").css('pointer-events', "none")


    }


    function a() { // Standard Test for Cation / Anion
        var stage = 1
        var listenRightClick = false
        var intro = introJs()
        intro.onchange(async (e) => {

            console.log(e)
            var classIdList = e.className.split(" ")
            classIdList.push(e.id)
            console.log("stage", stage)
            switch (stage) {
                case 2: // listen for when take test tube

                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 3: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 4: // listen for when click on FAreagent
                    $("body").css("pointer-events", "none")
                    $(".reagents").css("pointer-events", "auto")
                    $(".reagents").on("click", async () => { // Step 2

                        await timeout(100)
                        $("body").css("pointer-events", "auto")
                        intro.nextStep()
                        $(".reagents").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 5: // listen for when take reagent bottle
                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Chromium (III) Cr³⁺ (aq)").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 6: // listen for when put down reagent bottle
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 7: // listen for when click on bench
                    $("body").css("pointer-events", "none")
                    $(".bench").css("pointer-events", "auto")
                    $(".bench").on("click", async () => { // Step 2
                        $("body").css("pointer-events", "auto")
                        $(".bench").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 8: // listen for when take bench bottle
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Sodium Hydroxide NaOH (aq)").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 9: // listen for when put down bench bottle




                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        // Add a step here: Because introJS doesn't know what elements are added dynamically
                        // THANK YOU GITHUB https://github.com/usablica/intro.js/issues/328#issuecomment-107231869
                        intro._introItems[9].element = document.querySelector('.chromium_3p_aq');
                        intro._introItems[9].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 10: // listen for when pick up reagent bottle
                    // Disable all interactions other than the working area
                    $("body").css("pointer-events", "none")
                    $(".working-area").css("pointer-events", "auto")
                    $(".chromium_3p_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[10].element = document.querySelector('.test_tube');
                        intro._introItems[10].position = "top"
                        intro.nextStep()
                        $(".chromium_3p_aq").off("click");
                    });
                    break;
                case 11: // listen for when click on test tube
                    $(".test_tube").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $(".test_tube").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 12: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 13: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[13].element = document.querySelector('.sodium_hydroxide_0_aq');
                        intro._introItems[13].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    })
                    break;
                case 14: // listen for when pick up reagent bottle
                    $(".sodium_hydroxide_0_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[14].element = document.querySelector('.test_tube');
                        intro._introItems[14].position = "top"
                        intro.nextStep()
                        $(".sodium_hydroxide_0_aq").off("click");
                    });
                    break;
                case 15: // listen for when click on test tube
                    $(".test_tube").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $(".test_tube").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 16: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 17: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[17].element = document.querySelector('.test_tube');
                        intro._introItems[17].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                        listenRightClick = true
                    })
                    break;
                case 18: // Listen for when right click on test tube
                    $(".test_tube").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[18].element = document.querySelector(".test_tube > .popup > a")
                            intro._introItems[18].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick = false

                    })
                    break;
                case 19: // Listen for when click on inspect

                    $(".test_tube > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[19].element = document.querySelector("#shake")
                        intro._introItems[19].position = "right"
                        intro.nextStep()
                        $(".test_tube > .popup > a").off("click"); // issue?
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 20: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        // Hide the tooltip
                        $(".introjs-tooltipReferenceLayer").hide(100)
                        await timeout(10000)
                        // Show the tooltip
                        $(".introjs-tooltipReferenceLayer").show(100)
                        intro._introItems[20].element = document.querySelector("#shake")
                        intro._introItems[20].position = "right"
                        $("#shake").off("click");
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 21: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        // Hide the tooltip
                        $(".introjs-tooltipReferenceLayer").hide(100)
                        await timeout(10000)
                        // Show the tooltip
                        $(".introjs-tooltipReferenceLayer").show(100)
                        intro._introItems[21].element = document.querySelector("#shake")
                        intro._introItems[21].position = "right"
                        $("#shake").off("click");
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 22: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        await timeout(1000)
                        intro._introItems[22].element = document.querySelector("#rxt-status")
                        intro._introItems[22].position = "top"
                        $("#shake").off("click");
                        intro.nextStep()



                    })
                    break;
                case 23:
                    // end of func
                    $(".help").css("pointer-events", "auto")






            }
            stage = stage + 1
        })
        intro.onexit(() => {

            tutorialInProgress = false
            $(document).off("slimChange")
            $(".help").css("pointer-events", "auto")
            $("body").css("pointer-events", "auto")
        })



        intro.setOptions({
            tooltipPosition: 'top',
            exitOnEsc: true,

            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a <b> Test Tube</b> by <b>clicking</b> on the <b>Test Tube Rack</b>.",
                    position: "bottom",
                    hideNext: false,


                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b>Test Tube</b> on the <b>Working Area</b> by <b>clicking<b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".reagents"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Chromium</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Chromium bottle</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".bench"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Sodium Hydroxide</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Sodium Hydroxide</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".chromium_3p_aq"), // dynamic
                    intro: "Click on the <b>Chromium bottle</b> to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },
                {
                    element: document.querySelector(".sodium_hydroxide_0_aq"), // dynamic
                    intro: "Click on the <b>Sodium Hydroxide bottle</b> to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "Click on the test tube while holding the bottle to transfer solution."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".test_tube > .popup > a"), // dynamic
                    intro: "Click on <b> Inspect</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> to start the reaction."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> again to check if there are any further reactions."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> again to check if there are any further reactions."
                },
                {
                    element: document.querySelector("#rxt-status"), //dynamic
                    intro: "No more reactions left. Further reactions may be carried out by adding different reagents to the test tube. End of tutorial, goodbye!"
                }



            ],

        })
        intro.start()
        $("body").css("pointer-events", "none")
        $(".rack").css("pointer-events", "auto")


        $(".rack").on("click", async () => { // Step 1
            $("body").css("pointer-events", "auto")
            $(".rack").css("pointer-events", "")

            await timeout(100)
            $(".ajs-body").attr("data-position", "top")

            intro.nextStep()
            $(".introjs-helperLayer").hide()
            $(".rack").off("click")
        })
    }

    function b() {
        var stage = 1
        var listenRightClick = false
        intro = introJs()
        intro.onchange(async (e) => {
            console.log("stage", stage)
            $("body").css("pointer-events", "none")
            switch (stage) {
                case 2: // listen for when take test tube

                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 3: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 4: // listen for when click on FAreagent
                    $("body").css("pointer-events", "none")
                    $(".reagents").css("pointer-events", "auto")
                    $(".reagents").on("click", async () => { // Step 2

                        await timeout(100)
                        $("body").css("pointer-events", "auto")
                        $(".reagents").css("pointer-events", "")
                        intro.nextStep()
                        $(".reagents").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 5: // listen for when take reagent bottle
                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Iron (II) Fe²⁺ (aq)").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 6: // listen for when put down reagent bottle
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 7: // listen for when click on bench
                    $("body").css("pointer-events", "none")
                    $(".bench").css("pointer-events", "auto")
                    $(".bench").on("click", async () => { // Step 2
                        $("body").css("pointer-events", "auto")
                        $(".bench").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 8: // listen for when take bench bottle
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Sodium Hydroxide NaOH (aq)").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 9: // listen for when put down bench bottle




                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        // Add a step here: Because introJS doesn't know what elements are added dynamically
                        // THANK YOU GITHUB https://github.com/usablica/intro.js/issues/328#issuecomment-107231869
                        intro._introItems[9].element = document.querySelector('.iron_2p_aq');
                        intro._introItems[9].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 10: // listen for when pick up reagent bottle
                    // Disable all interactions other than the working area
                    $("body").css("pointer-events", "none")
                    $(".working-area").css("pointer-events", "auto")
                    $(".iron_2p_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[10].element = document.querySelector('.test_tube');
                        intro._introItems[10].position = "top"
                        intro.nextStep()
                        $(".chromium_3p_aq").off("click");
                    });
                    break;
                case 11: // listen for when click on test tube
                    $(".test_tube").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $(".test_tube").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 12: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 13: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[13].element = document.querySelector('.sodium_hydroxide_0_aq');
                        intro._introItems[13].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    })
                    break;
                case 14: // listen for when pick up reagent bottle
                    $(".sodium_hydroxide_0_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[14].element = document.querySelector('.test_tube');
                        intro._introItems[14].position = "top"
                        intro.nextStep()
                        $(".sodium_hydroxide_0_aq").off("click");
                    });
                    break;
                case 15: // listen for when click on test tube
                    $(".test_tube").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".test_tube").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 16: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 17: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[17].element = document.querySelector('.test_tube');
                        intro._introItems[17].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                        listenRightClick = true
                    })
                    break;
                case 18: // Listen for when right click on test tube
                    $(".test_tube").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[18].element = document.querySelector(".test_tube > .popup > a")
                            intro._introItems[18].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick = false

                    })
                    break;
                case 19: // Listen for when click on inspect

                    $(".test_tube > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[19].element = document.querySelector("#shake")
                        intro._introItems[19].position = "right"
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 20: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        // Hide the tooltip
                        $(".introjs-tooltipReferenceLayer").hide(100)
                        await timeout(10000)
                        // Show the tooltip
                        $(".introjs-tooltipReferenceLayer").show(100)
                        $("#shake").off("click");
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 21: // Listen for when click on cancel
                    $(".ajs-cancel").on("click", async () => {
                        await timeout(100)
                        $(".ajs-cancel").off("click")

                        intro.nextStep()
                    })
                    break;
                case 22:
                    $("body").css("pointer-events", "none")
                    $(".rack").css("pointer-events", "auto")
                    $(".rack").on("click", async () => {
                        $(".rack").css("pointer-events", "")
                        await timeout(100)
                        $(".rack").off("click")
                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 23: // listen for when take test tube

                    // Disable all options except for test tube

                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 24: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 25:
                    $(".basket").css("pointer-events", "auto")
                    $(".basket").on("click", async () => {
                        $(".basket").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                        $(".basket").off("click")
                    })
                    break;
                case 26:

                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Filter Paper").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        $("ajs-ok").off('click')
                        intro.nextStep()
                    })
                    break;
                case 27: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    })
                    break;
                case 28: // Listen for click on basket    
                    $(".basket").css("pointer-events", "auto")
                    $(".basket").on("click", async () => {
                        $(".basket").css("pointer-events", "")
                        await timeout(100)
                        intro.nextStep()
                        $(".basket").off("click")
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 29:

                    await ajaxWait()

                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Funnel").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        $("ajs-ok").off('click')
                    })
                    break;
                case 30: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[30].element = document.querySelector(".filter")
                        intro._introItems[30].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                        listenRightClick = true
                    })
                    break;
                case 31: // listen for irght click on filter paper
                    $(".filter").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[31].element = document.querySelector(".filter > .popup > a")
                            intro._introItems[31].position = "right"
                            intro.nextStep()


                        }
                        listenRightClick = false

                    })
                    break;
                case 32: // listen for click on fold
                    $(".filter > .popup > a").on("click", async () => {
                        await timeout(100)
                        intro._introItems[32].element = document.querySelector(".folded_filter")
                        intro._introItems[32].position = "top"
                        $(".filter > .popup > a").off("click")
                        intro.nextStep()
                    })
                    break;
                case 33: // listen for pick up folded filter
                    $(".folded_filter").on("click", async () => {
                        await timeout(100)
                        intro._introItems[33].element = document.querySelector(".funnel")
                        intro._introItems[33].position = "top"
                        $(".folded_filter").off("click")
                        intro.nextStep()
                    })
                    break;
                case 34: // listen for when click on funnel


                    var parent = document.getElementsByClassName("movables")[0]

                    var t = 0
                    var observer = new MutationObserver(async function (mutations) {
                        t = t + 1
                        if (t == 1) {
                            await timeout(100)
                            intro._introItems[34].element = document.querySelector(".filter_funnel")
                            intro._introItems[34].position = "top"
                            intro.nextStep()

                        }



                        observer.disconnect()

                    });


                    var config = {
                        childList: true
                    };

                    observer.observe(parent, config);




                    break;
                case 35: // listen for when click on filter funnel
                    $('.filter_funnel').on("click", async () => {
                        await timeout(100)
                        intro._introItems[35].element = document.querySelector("#test_tube-1")
                        intro._introItems[35].position = "top"
                        $(".filter_funnel").off("click")
                        intro.nextStep()
                    })
                    break;








                case 36: // listen for when click on empty Test tube
                    $("#test_tube-1").on("click", async () => {
                        await timeout(100)
                        intro._introItems[36].element = document.querySelector("#test_tube-0")
                        intro._introItems[36].position = "top"
                        $("#test_tube-1").off("click")
                        intro.nextStep()
                    })
                    break;
                case 37: // listen for when pick up full test tube
                    $("#test_tube-0").on("click", async () => {
                        await timeout(100)
                        intro._introItems[37].element = document.querySelector("#test_tube-1")
                        intro._introItems[37].position = "top"
                        $("#test_tube-0").off("click")
                        intro.nextStep()
                    })
                    break;
                case 38: // listen for when click on test tube with filter
                    $("#test_tube-1").on("click", async () => {
                        await timeout(100)
                        $("#test_tube-1").off("click")
                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 39: // listen for when agree to transfer soln

                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        $(".ajs-ok").off("click")
                        // intro.nextStep() ????? WHY DOES THE CODE TRIGGER TWICE ??????????????
                    })
                    break;
                case 40: // listen for when put down test tube
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        $(".working-area").off("click")
                        intro._introItems[40].element = document.querySelector(".filter_funnel")
                        intro._introItems[40].position = "top"
                        intro.nextStep()
                        listenRightClick = true
                    })
                    break;
                case 41:
                    $(".filter_funnel").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[41].element = document.querySelector(".filter_funnel > .popup > a")
                            intro._introItems[41].position = "right"
                            intro.nextStep()
                            $(".introjs-helperLayer").hide()


                        }
                        listenRightClick = false

                    })
                    break;
                case 42:
                    $(".filter_funnel > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[42].element = document.querySelector("#reactAir")
                        intro._introItems[42].position = "top"
                        $(".filter_funnel > .popup > a").off("click")

                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 43:
                    $("#reactAir").on("click", async () => {
                        $(".introjs-tooltipReferenceLayer").hide(100)
                        await timeout(10000)
                        $(".introjs-tooltipReferenceLayer").show(100)
                        intro._introItems[43].element = document.querySelector("#reactAir")
                        intro._introItems[43].position = "top"
                        $("#reactAir").off("click")
                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 44:
                    $("#reactAir").on("click", async () => {
                        await timeout(100)
                        intro._introItems[44].element = document.querySelector("#rxt-status")
                        intro._introItems[44].position = "top"
                        $("#reactAir").off("click")
                        intro.nextStep()
                    })
                    break;

            }
            stage = stage + 1
        })
        intro.onexit(() => {
            $(".help").css("pointer-events", "auto")
            $("body").css("pointer-events", "auto")
            tutorialInProgress = false
            $(document).off("slimChange")
        })
        intro.setOptions({
            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a <b> Test Tube</b> by <b>clicking</b> on the <b>Test Tube Rack</b>.",
                    position: "bottom",
                    hideNext: false,


                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b>Test Tube</b> on the <b>Working Area</b> by <b>clicking<b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".reagents"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Iron (II)</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Iron (II) bottle</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".bench"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Sodium Hydroxide</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Sodium Hydroxide</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".iron_2p_aq"), // dynamic
                    intro: "<b>Click</b> on the <b>Iron (II) bottle</b> to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },
                {
                    element: document.querySelector(".sodium_hydroxide_0_aq"), // dynamic
                    intro: "Click on the <b>Sodium Hydroxide bottle</b> to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".test_tube > .popup > a"), // dynamic
                    intro: "Click on <b> Inspect</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> to start the reaction."
                },
                {
                    element: document.querySelector(".ajs-cancel"),
                    intro: "Close the Inspect screen."
                },
                {
                    element: document.querySelector(".rack"),
                    intro: "Take a <b>Test Tube</b>.",

                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b>Test Tube</b> on the working area."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Take the <b> Filter Paper</b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Filter Paper</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b> Filter Paper</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Take the <b>Funnel</b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Funnel</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place Funnel on the working area."
                },
                {
                    element: document.querySelector(".filter"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Filter Paper</b>."
                },
                {
                    element: document.querySelector(".filter > .popup > a"), // dynamic
                    intro: "Click on <b> Fold Filter Paper</b>."
                },
                {
                    element: document.querySelector(".folded_filter"), // dynamic
                    intro: "Click on the <b>Folded Filter</b> to pick it up."
                },
                {
                    element: document.querySelector(".funnel"), // dynamic
                    intro: "Click on the <b>Funnel</b> to place the <b>Folded Filter</b> on the <b>Funnel</b>."
                },
                {
                    element: document.querySelector(".filter_funnel"), //dynamic
                    intro: "Click on the <b> Filter Funnel</b> to pick it up."
                },
                {
                    element: document.querySelector("#test_tube-1"), // dynamic
                    intro: "Click on the <b>Test Tube</b> to place the filter funnel on the test tube."
                },
                {
                    element: document.querySelector("#test_tube-0"), // dynamic
                    intro: "Click on the <b>Test Tube</b> to pick it up."
                },
                {
                    element: document.querySelector("#test_tube-1"), // dynamic
                    intro: "Click on the <b> Test Tube</b> to pour the solution into the second test tube."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Yes</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".filter_funnel"), // dynamic
                    intro: "<b> Right Click </b> on the <b>Filter Funnel</b>."
                },
                {
                    element: document.querySelector(".filter_funnel > .popup > a"), // dynamic
                    intro: "<b> Click on <b> Inspect</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>React</b> to check if the precipitate can react with <b>air</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>React</b> to check if the precipitate can react with <b>air</b>."
                },
                {
                    element: document.querySelector("#rxt-status"), //dynamic
                    intro: "No more reactions left. End of tutorial, goodbye!"
                }

            ]
        })
        intro.start()
        $("body").css("pointer-events", "none")
        $(".rack").css("pointer-events", "auto")


        $(".rack").on("click", async () => { // Step 1
            $("body").css("pointer-events", "auto")
            $(".rack").css("pointer-events", "")

            await timeout(100)
            $(".ajs-body").attr("data-position", "top")

            intro.nextStep()
            $(".introjs-helperLayer").hide()
            $(".rack").off("click")
        })
    }

    function c() {
        var stage = 1
        var listenRightClick = false
        intro = introJs()
        intro.onchange(async (e) => {
            console.log("stage", stage)
            $("body").css("pointer-events", "none")
            switch (stage) {
                case 2: // listen for when take test tube

                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 3: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");

                    });
                    break;
                case 4: // listen for when click on basket
                    $(".basket").css("pointer-events", "auto")
                    $(".basket").on("click", async () => {
                        $(".basket").css("pointer-events", "none")
                        await timeout(100)

                        $(".basket").off("click")
                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 5:

                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Damp Red Litmus Paper").removeClass("ss-disabled no-click")
                    selectByHtml("Damp Blue Litmus Paper").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 6: // listen for when click on inventory
                    $(".slots").on("click", async () => {

                        $(".slots").off("click")
                        await timeout(100)
                        intro._introItems[6].element = document.querySelector(".test_tube")
                        intro._introItems[6].position = "top"
                        listenRightClick = true
                        intro.nextStep()

                    })

                    break;
                case 7: // listen for right click on test tube
                    $(".test_tube").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[7].element = document.querySelector(".test_tube > .popup > a")
                            intro._introItems[7].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick = false

                    })
                    break;
                case 8: // liten for when click on inspect
                    $(".test_tube > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[8].element = document.querySelector("#litmus")
                        intro._introItems[8].position = "top"
                        intro.nextStep()
                        $(".test_tube > .popup > a").off("click"); // issue?

                    })
                    break;
                case 9:
                    $("#litmus").on("click", async () => {
                        $("#litmus").off("click")
                        await timeout(100)
                        intro.nextStep()
                    })
            }
            stage = stage + 1
        })
        intro.onexit(() => {
            $(".help").css("pointer-events", "auto")
            $("body").css("pointer-events", "auto")
            tutorialInProgress = false
            $(document).off("slimChange")
        })

        intro.setOptions({
            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a <b>Test Tube</b>.",
                    position: "bottom",
                    hideNext: false,


                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "<b>Place Test Tube</b> on the <b>working area</b>."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Take the <b>Litmus Paper</b>.",
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select either red or blue <b>Litmus Paper</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".inventory-helper"),
                    intro: "<b> Click </b> on one of the Inventory Slots to place the <b>Litmus Paper</b> into the Inventory. <br /><b> Hover</b> over the Inventory to open it.",
                    scrollToElement: false,
                    position: "right"
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".test_tube > .popup > a"), // dynamic
                    intro: "<b>Click</b> on <b> Inspect</b>."
                },

                {
                    element: document.querySelector("#litmus"),
                    intro: "<b>Pick up </b> the <b>Litmus Paper</b>, and click here to place it down."
                }
            ]
        })
        intro.start()
        $("body").css("pointer-events", "none")
        $(".rack").css("pointer-events", "auto")


        $(".rack").on("click", async () => { // Step 1
            $("body").css("pointer-events", "auto")
            $(".rack").css("pointer-events", "")

            await timeout(100)
            $(".ajs-body").attr("data-position", "top")

            intro.nextStep()
            $(".introjs-helperLayer").hide()
            $(".rack").off("click")
        })

    }

    function d() {
        var stage = 1
        var listenRightClick = false
        intro = introJs()
        intro.onchange(async (e) => {
            console.log("stage", stage)
            $("body").css("pointer-events", "none")
            switch (stage) {
                case 2: // listen for when take test tube

                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")




                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 3: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 4: // listen for when click on rack
                    $(".rack").css("pointer-events", "auto")
                    $(".rack").on("click", async () => { // Step 1                        
                        $(".rack").css("pointer-events", "")
                        await timeout(100)
                        $(".ajs-body").attr("data-position", "top")

                        intro.nextStep()
                        $(".introjs-helperLayer").hide()
                        $(".rack").off("click")
                    })
                    break;
                case 5: // listen for when take test tube

                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Test Tube").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })

                    break;
                case 6: // listen for when put down test tube
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 7: // listen for when click on FAreagent                    
                    $(".reagents").css("pointer-events", "auto")
                    $(".reagents").on("click", async () => { // Step 2

                        await timeout(100)
                        $("body").css("pointer-events", "auto")
                        $(".reagents").css("pointer-events", "")
                        intro.nextStep()
                        $(".reagents").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 8: // listen for when take reagent bottle
                    // Disable all options except for test tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Carbonate CO₃²⁻ (aq)").removeClass("ss-disabled no-click")

                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 9: // listen for when put down reagent bottle
                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;




                case 10: // listen for when click on bench

                    $(".bench").css("pointer-events", "auto")
                    $(".bench").on("click", async () => { // Step 2

                        $(".bench").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 11: // listen for when take bench bottle
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Hydrochloric Acid HCl (aq)").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 12: // listen for when put down bench bottle

                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        // Add a step here: Because introJS doesn't know what elements are added dynamically
                        // THANK YOU GITHUB https://github.com/usablica/intro.js/issues/328#issuecomment-107231869
                        intro._introItems[9].element = document.querySelector('.iron_2p_aq');
                        intro._introItems[9].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;
                case 13: // listen for when click on bench

                    $(".bench").css("pointer-events", "auto")
                    $(".bench").on("click", async () => { // Step 2

                        $(".bench").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 14: // listen for when take bench bottle
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Calcium Hydroxide Ca(OH)₂ (aq)").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 15: // listen for when put down bench bottle

                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        // Add a step here: Because introJS doesn't know what elements are added dynamically
                        // THANK YOU GITHUB https://github.com/usablica/intro.js/issues/328#issuecomment-107231869

                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;

                case 16: // listen for when click on basket

                    $(".basket").css("pointer-events", "auto")
                    $(".basket").on("click", async () => { // Step 2

                        $(".basket").css("pointer-events", "")
                        await timeout(100)

                        intro.nextStep()
                        $(".bench").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 17: // listen for when take delivery tube
                    await ajaxWait()
                    $(".ss-option").addClass("ss-disabled no-click")
                    selectByHtml("Delivery Tube with Rubber Bung").removeClass("ss-disabled no-click")
                    $(".ajs-ok").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 18: // listen for when put down bench bottle

                    $(".working-area").on("click", async () => { // Step 2
                        await timeout(100)
                        // Add a step here: Because introJS doesn't know what elements are added dynamically
                        // THANK YOU GITHUB https://github.com/usablica/intro.js/issues/328#issuecomment-107231869
                        intro._introItems[18].element = document.querySelector('.carbonate_2m_aq');
                        intro._introItems[18].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    });
                    break;


                case 19: // listen for when pick up reagent bottle
                    // Disable all interactions other than the working area

                    $(".working-area").css("pointer-events", "auto")
                    $(".carbonate_2m_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[19].element = document.querySelector('#test_tube-0');
                        intro._introItems[19].position = "top"
                        intro.nextStep()
                        $(".carbonate_2m_aq").off("click");
                    });
                    break;
                case 20: // listen for when click on test tube
                    $("#test_tube-0").on("click", async () => { // Step 2
                        await timeout(100)

                        intro.nextStep()
                        $("#test_tube-0").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 21: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 22: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[22].element = document.querySelector('.hydrochloric_acid_0_aq');
                        intro._introItems[22].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                    })
                    break;
                case 23: // listen for when pick up reagent bottle
                    $(".hydrochloric_acid_0_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[23].element = document.querySelector('#test_tube-0');
                        intro._introItems[23].position = "top"
                        intro.nextStep()
                        $(".hydrochloric_acid_0_aq").off("click");
                    });
                    break;
                case 24: // listen for when click on test tube
                    $("#test_tube-0").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $("#test_tube-0").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 25: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 26: // listen for when click on main body
                    $(".working-area").css("pointer-events", "auto")
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[26].element = document.querySelector('.calcium_hydroxide_0_aq');
                        intro._introItems[26].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");

                    })
                    break;

                case 27: // listen for when pick up reagent bottle
                    $(".calcium_hydroxide_0_aq").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[27].element = document.querySelector('#test_tube-1');
                        intro._introItems[27].position = "top"
                        intro.nextStep()
                        $(".calcium_hydroxide_0_aq").off("click");
                    });
                    break;
                case 28: // listen for when click on test tube
                    $("#test_tube-1").on("click", async () => { // Step 2
                        await timeout(100)
                        intro.nextStep()
                        $("#test_tube-1").off("click");
                        $(".introjs-helperLayer").hide()
                    });
                    break;
                case 29: // listen for when press OK to transfer soln
                    $(".ajs-ok").on("click", async () => {
                        await timeout(100)
                        intro.nextStep()
                        $(".ajs-ok").off("click");
                    })
                    break;
                case 30: // listen for when click on main body
                    $(".working-area").on("click", async () => {
                        await timeout(100)
                        intro._introItems[30].element = document.querySelector('#test_tube-0');
                        intro._introItems[30].position = "top"
                        intro.nextStep()
                        $(".working-area").off("click");
                        listenRightClick = true
                    })
                    break;
                case 31: // listen for when pick up test tube
                    $("#test_tube-0").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[31].element = document.querySelector('.delivery_tube');
                        intro._introItems[31].position = "top"
                        intro.nextStep()
                        $("#test_tube-0").off("click");
                    });
                    break;
                case 32: // listen for when click on delivery tube
                    $(".delivery_tube").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[32].element = document.querySelector('#test_tube-1');
                        intro._introItems[32].position = "top"
                        intro.nextStep()
                        $(".delivery_tube").off("click");

                    });
                    break;
                case 33: // listen for when pick up test tube
                    $("#test_tube-1").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[33].element = document.querySelector('.delivery_tube');
                        intro._introItems[33].position = "top"
                        intro.nextStep()
                        $("#test_tube-1").off("click");
                    });
                    break;
                case 34: // listen for when click on delivery tube
                    $(".delivery_tube").on("click", async () => { // Step 2
                        await timeout(100)
                        intro._introItems[34].element = document.querySelector('#test_tube-0');
                        intro._introItems[34].position = "top"
                        listenRightClick = true
                        intro.nextStep()
                        $(".delivery_tube").off("click");

                    });
                    break;

                case 35: // Listen for when right click on test tube
                    $("#test_tube-0").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[35].element = document.querySelector("#test_tube-0 > .popup > a")
                            intro._introItems[35].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick = false

                    })
                    break;
                case 36: // Listen for when click on inspect

                    $("#test_tube-0 > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[36].element = document.querySelector("#shake")
                        intro._introItems[36].position = "right"
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 37: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        // Hide the tooltip
                        $(".introjs-tooltipReferenceLayer").hide(100)

                        // Show the tooltip
                        $(".introjs-tooltipReferenceLayer").show(100)
                        $("#shake").off("click");
                        await timeout(100)
                        intro._introItems[37].element = document.querySelector("#litmus")
                        intro._introItems[37].position = "right"
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 38:
                    await timeout(9900)
                    intro.nextStep()
                    $(".introjs-helperLayer").hide()



                case 39: // Listen for when click on cancel
                    $(".ajs-cancel").on("click", async () => {
                        intro._introItems[39].element = document.querySelector("#test_tube-1")
                        intro._introItems[39].position = "top"
                        await timeout(100)
                        $(".ajs-cancel").off("click")

                        listenRightClick = true
                        intro.nextStep()
                    })
                    break;

                case 40: // Listen for when right click on test tube
                    $("#test_tube-1").on("contextmenu", async () => {
                        if (listenRightClick) {
                            await timeout(100)
                            intro._introItems[40].element = document.querySelector("#test_tube-1 > .popup > a")
                            intro._introItems[40].position = "right"
                            intro.nextStep()

                        }
                        listenRightClick = false

                    })
                    break;
                case 41: // Listen for when click on inspect

                    $("#test_tube-1 > .popup > a").on("click", async () => {
                        await timeout(500)
                        intro._introItems[41].element = document.querySelector("#shake")
                        intro._introItems[41].position = "right"
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;
                case 42: // Listen for when click on shake button
                    $("#shake").on("click", async () => {
                        // Hide the tooltip                        
                        $("#shake").off("click");
                        await timeout(100)
                        intro._introItems[42].element = document.querySelector("#inspect")
                        intro._introItems[42].position = "bottom"
                        intro.nextStep()

                        $(".introjs-helperLayer").hide()
                    })
                    break;











            }
            stage = stage + 1
        })
        intro.onexit(() => {
            $(".help").css("pointer-events", "auto")
            $("body").css("pointer-events", "auto");
            tutorialInProgress = false
            $(document).off("slimChange")
        })
        intro.setOptions({
            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a <b> Test Tube</b> by <b>clicking</b> on the <b>Test Tube Rack</b>.",
                    position: "bottom",
                    hideNext: false,


                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b>Test Tube</b> on the <b>Working Area</b> by <b>clicking<b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".rack"),
                    intro: "Take another <b> Test Tube</b>.",
                    position: "bottom",


                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place <b>Test Tube</b> on the <b>Working Area</b>."
                },

                {
                    element: document.querySelector(".reagents"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Carbonate </b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Carbonate bottle</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".bench"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Hydrochloric Acid</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Hydrochloric Acid bottle</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".bench"),
                    intro: "Select a reagent."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Calcium Hydroxide</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Calcium Hydroxide bottle</b> on the <b>Working Area</b>."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Select an apparatus."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Delivery Tube with Rubber Bung</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place the <b> Delivery Tube with Rubber Bung</b> on the <b>Working Area</b>."
                },


                {
                    element: document.querySelector(".carbonate_2m_aq"), // dynamic
                    intro: "<b>Click</b> on the <b>Carbonate bottle</b> to pick it up."
                },
                {
                    element: document.querySelector("#test_tube-0"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },
                {
                    element: document.querySelector(".hydrochloric_acid_0_aq"), // dynamic
                    intro: "Click on the <b>Hydrochloric Acid bottle</b> to pick it up."
                },
                {
                    element: document.querySelector("#test_tube-0"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },

                {
                    element: document.querySelector(".calcium_hydroxide_0_aq"), // dynamic
                    intro: "<b>Click</b> on the <b>Calcium Hydroxide bottle</b> to pick it up."
                },
                {
                    element: document.querySelector("#test_tube-1"), // dynamic
                    intro: "<b>Click on the <b>Test Tube</b> while holding the bottle to <b>transfer solution<b>."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Enter the number <b>5</b> to transfer 5 cm³ of solution.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Put down the bottle."
                },

                {
                    element: document.querySelector("#test_tube-0"), // dynamic
                    intro: "<b> Click </b> on the <b>Test Tube</b> to pick it up."
                },
                {
                    element: document.querySelector(".delivery_tube"), // dynamic
                    intro: "<b> Click</b> on the <b>Delivery Tube</b> to attach the Delivery Tube to the Test Tube. <br />The <b>first</b> Test Tube attached will always be on the <b>right</b>."
                },
                {
                    element: document.querySelector("#test_tube-1"), // dynamic
                    intro: "<b> Click </b> on the <b>Test Tube</b> to pick it up."
                },
                {
                    element: document.querySelector(".delivery_tube"), // dynamic
                    intro: "<b> Click</b> on the <b>Delivery Tube</b> to attach the Delivery Tube to the Test Tube."
                },
                {
                    element: document.querySelector("#test_tube-0"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".test_tube > .popup > a"), // dynamic
                    intro: "Click on <b> Inspect</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> to start the reaction."
                },
                {
                    element: document.querySelector("#litmus"), //dynamic
                    intro: "Observe the <b>gas</b> exiting the Test Tube. This gas will appear in the other connected Test Tube."
                },
                {
                    element: document.querySelector(".ajs-cancel"),
                    intro: "Close the Inspect screen."
                },
                {
                    element: document.querySelector("#test_tube-1"), // dynamic
                    intro: "<b>Right Click</b> on the <b>Test Tube</b>."
                },
                {
                    element: document.querySelector(".test_tube > .popup > a"), // dynamic
                    intro: "Click on <b> Inspect</b>."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>Shake</b> to start the reaction. "
                },
                {
                    element: document.querySelector("#inspect"), // dynamic
                    intro: "White ppt of CaCO₃ will be formed due to the reaction between <b>Ca(OH)₂</b> (Limewater) and <b>CO₂</b>. <br />End of tutorial, press ESC to exit."
                }


            ]
        })
        intro.start()
        $("body").css("pointer-events", "none")
        $(".rack").css("pointer-events", "auto")


        $(".rack").on("click", async () => { // Step 1

            $(".rack").css("pointer-events", "")

            await timeout(100)
            $(".ajs-body").attr("data-position", "top")

            intro.nextStep()
            $(".introjs-helperLayer").hide()
            $(".rack").off("click")
        })
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function ajaxWait() {
        const b = new Promise((resolve, reject) => {
            var targetNode = document.getElementsByClassName("ajs-content")[0]
            var config = { attributes: true, childList: true, subtree: true }
            var callback = async function (mutationsList, observer) {
                observer.disconnect()

                resolve()
            }
            var observer = new MutationObserver(callback)
            observer.observe(targetNode, config)
        })
        await Promise.resolve(b)
        return new Promise(resolve => resolve())
    }



    function selectByHtml(value) {
        return $('.ss-option').filter(function () {
            return $.trim($(this).text()).includes(value);
        });
    }

})

