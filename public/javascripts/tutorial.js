

$(document).ready(function () {
    help = function () {
        // Prompt user to select what they need help with
        alertify.prompt("What do you need help with?", "a",
            function (evt, value) {
                switch (value) {
                    case "a": a(); break;
                    case "b": b(); break;
                    case "c": c(); break;
                    case "d": d(); break;
                    case "e": e(); break;
                }
                helpSelect.destroy()
                $("#help").remove()
                $(".help").css("pointer-events", "none")
            },
            function () {
                helpSelect.destroy()
                $("#help").remove()
            }

        ).setHeader("FAQ")
        $('.ajs-input').hide()
        var str = [
            `<option value="a"> Standard Test for Cation / Anion </option>`,
            `<option value="b"> Standard Test for Gas using Delivery Tube </option>`,
            `<option value="c"> Standard Test for Gas using Litmus Paper </option>`,
            `<option value="d"> Filtration </option>`,
            `<option value="e"> Using the Bunsen Burner </option>`

        ]
        $(".ajs-input").after(`<select id='help'> ${str.join(' ')} </select>`)
        var helpSelect = new SlimSelect({
            select: "#help",
            onChange: (args) => {
                $('.ajs-input').val(args.value)
            }
        })


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
            alert("finish!!!!!!!!!")

            // Allow clicks everywhere again
            $("body").css("pointer-events", "auto")
        })



        intro.setOptions({
            tooltipPosition: 'top',
            exitOnEsc: true,

            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a test tube.",
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
                    intro: "Place test tube on the working area."
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
                    intro: "Place bottle on the working area."
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
                    intro: "Place bottle on the working area."
                },
                {
                    element: document.querySelector(".chromium_3p_aq"), // dynamic
                    intro: "Click on the Chromium bottle to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "Click on the test tube while holding the bottle to transfer solution."
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
                    intro: "Click on the Sodium Hydroxide bottle to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "Click on the test tube while holding the bottle to transfer solution."
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





        // $("body").append("<div id='help-text'> </div>").show(200)
        // // Step one: Selecting test tube

        // $("#help-text").append("<p> First, take a <b> Test Tube </b> from the <b> Test Tube Rack</b>.</p>")

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
            $("body").css("pointer-events", "auto")
        })
        intro.setOptions({
            steps: [
                {
                    element: document.querySelector(".rack"),
                    intro: "First, take a test tube.",
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
                    intro: "Place test tube on the working area."
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
                    intro: "Place bottle on the working area."
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
                    intro: "Place bottle on the working area."
                },
                {
                    element: document.querySelector(".iron_2p_aq"), // dynamic
                    intro: "Click on the Iron (II) bottle to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "Click on the test tube while holding the bottle to transfer solution."
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
                    intro: "Click on the Sodium Hydroxide bottle to pick it up."
                },
                {
                    element: document.querySelector(".test_tube"), // dynamic
                    intro: "Click on the test tube while holding the bottle to transfer solution."
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
                    intro: "Take a test tube.",

                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Test Tube</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place test tube on the working area."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Take the filter paper."
                },
                {
                    element: document.querySelector(".ajs-body"),
                    intro: "Select <b> Filter Paper</b>.",
                    position: "top"
                },
                {
                    element: document.querySelector(".working-area"),
                    intro: "Place filter paper on the working area."
                },
                {
                    element: document.querySelector(".basket"),
                    intro: "Take the funnel."
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
                    intro: "Click on the folded filter to pick it up."
                },
                {
                    element: document.querySelector(".funnel"), // dynamic
                    intro: "Click on the <b>Funnel</b> to place the filter on the funnel."
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
                    intro: "Put down the Test Tube."
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
                    intro: "Click on <b>React</b> to check if the precipitate can react with air."
                },
                {
                    element: document.querySelector("#shake"), // dynamic
                    intro: "Click on <b>React</b> to check if the precipitate can react with air."
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
            return $.trim($(this).text()) == value;
        });
    }
})

