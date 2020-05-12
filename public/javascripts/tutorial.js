

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
        intro = introJs()
        intro.onchange(async (e) => {

            console.log(e)
            var classIdList = e.className.split(" ")
            classIdList.push(e.id)
            console.log("stage", stage)
            switch (stage) {
                case 2: // listen for when take test tube

                    // Disable all options except for test tube
                    await waitForAJAX()
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
                    await waitForAJAX()
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
                    await waitForAJAX()
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
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForAJAX(target) { 
        var targetNode = document.getElementsByClassName("ajs-content")[0]
        var config = {attributes: true, childList: true, subtree: true}
        var callback = function (mutationsList, observer) {
            observer.disconnect()
            
            return new Promise(resolve => true)
        }
        var observer = new MutationObserver(callback)
        observer.observe(targetNode, config)

    }

    function selectByHtml(value) {
        return $('.ss-option').filter(function () {
            return $.trim($(this).text()) == value;
        });
    }
})