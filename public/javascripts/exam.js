$(document).ready(async () => {




    var examID;
    FAs = '';
    formattedFA = {}
    var exams = {}

    var startTime;
    var endTime;
    alertify.prompt(`Select QA Paper`, "-", (evt, value) => {
        if (value == "-") return false
        examID = value;
        (async () => {

            FAs = exams[value].reactants
            // window.open(`/exam/${value}`)
            var reactants = JSON.parse(await Promise.resolve(($.get('/exam/fetch/FA', { id: examID }))))
            // if you're looking at this code, are you trying to cheat?
            for (var i = 1; i < reactants.length + 1; i++) {
                var reactant = reactants[i - 1]
                formattedFA[reactant.FA] = {
                    reactants: reactant.reactants.split(","),
                    cations_present: reactant.cations_present,
                    anions_present: reactant.anions_present
                }

            }
            $(".header > .name").html(`Exam Paper: ${exams[value].exam_name}`)
            $(".header").append(` <i class="fas fa-thumbtack" onclick="pin()"></i>`)
            renderExam(examID)

            startTime = new Date().getTime()

        })();

        examSelect.destroy()
        $("#exam-prompt").remove()
        $(".ajs-cancel").show()
        $(".ajs-close").show()

    }, () => {
        return false
    })

    $(".ajs-cancel").hide()
    $(".ajs-close").hide()
    $(".ajs-input").hide()
    var str = [`<option data-placeholder="true"></option>`]

    var data = JSON.parse(await Promise.resolve(($.get('/exam/fetch'))))
    data.forEach(exam => {
        str.push(`<option value='${exam.exam_id}'> ${exam.exam_name} </option>`)
        exams[exam.exam_id] = {
            exam_name: exam.exam_name,
            // reactants: exam.reactants,
            exam_details: exam.exam_details,
            // cations_present: exam.cations_present,
            // anions_present: exam.anions_present

        }
    })
    $('.ajs-input').after(`<select id="exam-prompt"> ${str.join(" ")} </select> `)
    var examSelect = new SlimSelect({

        select: "#exam-prompt",
        placeholder: "Select an exam...",
        onChange: (args) => {
            $(".ajs-ok").removeClass("cust-disabled")
            $('.ajs-input').val(args.value)





        }
    })


    clickedFA = async () => {
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



                reagentSelect.destroy()
                $('#reagent-prompt').remove();
                heldItem = value
                isMoving = true
                var vH = $('html').height();
                var vW = $('html').width();
                data.item_name = value


                // var data = JSON.parse(await Promise.resolve(($.get('/fetch', { clicked: mostRecentChemical.formula_id }))))
                objectsInUse[currentlyMovingElem] = new Apparatus(data, currentlyMovingElem)
                formattedFA[value].reactants.forEach(async reactant => {
                    var reactantData = JSON.parse(await Promise.resolve(($.get('/exam/fetch/specific', { formula_id: reactant }))))
                    objectsInUse[currentlyMovingElem].contains.push({
                        volume: 100,
                        formula_id_f: formatChemForm(reactant),
                        formula_text: reactantData.formula_text
                    })
                })


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


        // var reactants = FAs.split("||")
        var str = [`<option data-placeholder="true"></option>`]
        for (FA of Object.keys(formattedFA)) {
            str.push(`<option value='${FA}'> ${FA}</option`)
        }




        // insert custom select element
        // var str = data.map(row => `<option value='${row.apparatus_id}'> ${row.item_name} </option>`)        


        $('.ajs-input').after(`<select id="reagent-prompt"> ${str.join(" ")} </select> `)
        var reagentSelect = new SlimSelect({
            placeholder: "Select a reagent...",
            select: "#reagent-prompt",
            onChange: (args) => {
                console.log('onchange')
                $(".ajs-ok").removeClass("cust-disabled")
                console.log(args)
                $('.ajs-input').val(args.value)
                $.event.trigger({
                    type: "slimChange"
                })
            }
        })
        var data = JSON.parse(await Promise.resolve(($.get('/fetch/specific', { apparatus: "FAexam" }))))



    }


    async function renderExam(id) {
        console.log("ran")
        var data = JSON.parse(await Promise.resolve(($.get('/exam/fetch/steps', { id: id }))))

        // get list of all cation and anion data
        var ionData = JSON.parse(await Promise.resolve(($.get('/exam/fetch/possibleIons'))))



        var html = [`
            <p id="details"> ${exams[id].exam_details} </p>
            <form id="answer" method="post" action="/exam/${id}">
                <table class="exam-paper">
                    <thead>
                        <tr>
                            <th class="step"> Step </th>
                            <th class="test"> Test </th>
                            <th class="obs"> Observations </th>
                        </tr>
                    </thead>
                    <tbody>
        `]
        data.forEach(row => {
            html.push(`
                <tr id='step-${row.step}'>
                    <td> ${row.step} </td>
                    <td> ${row.test} </td>
                    <td class="input-box"> <textarea id=${row.step} class="input" name="${row.step}"></textarea> </td>
                </tr>
            `)
        })
        html.push(`
                    </tbody>
                </table>
                <div class="exam-paper">   
                            
                        
                        

                
            
        `)

        for (FA of Object.keys(formattedFA)) {
            // cation
            html.push(`
                <div class="answer-row answer-${FA}-cation"> 
                    <div class="left"> <p> The cations present in ${FA} are ${formattedFA[FA].cations_present ? formattedFA[FA].cations_present + " and :" : ":"} </p> </div> 
                    <div class="right"> <select id='${FA}-cation' multiple> <option data-placeholder="true"></option>
                       
                    
                
            `)

            ionData.cation.forEach(ion => {

                html.push(`<option value='${ion.formula_id}'> ${ion.formula_id.split("_")[0]} </option>`)

            })
            html.push(`</select>  <input id='${FA}-cation-input' name='${FA}-cation' style="display:none"></input></div></div>`)






            // anions
            html.push(`
                <div class="answer-row answer-${FA}-anion"> 
                    <div class="left"> <p> The anions present in ${FA} are ${formattedFA[FA].anions_present ? formattedFA[FA].anions_present + " and" : ":"} </p> </div> 
                    <div class="right"> <select id='${FA}-anion' multiple> <option data-placeholder="true"></option>
                        
                
            `)

            ionData.anion.forEach(ion => {

                html.push(`<option value='${ion.formula_id}'> ${ion.formula_id.split("_")[0]} </option>`)

            })
            html.push(`</select> <input id='${FA}-anion-input' name='${FA}-anion' style="display:none"></input> </div></div>`)


        }


        // if (exam[id].cations_present.split(",").length) { 

        // }


        // ionData.cation.forEach(cation => { 
        //     html.push()

        // })




        html.push(`
                    </div>
                <button type="submit" id="submit-button">Submit</button>
                
            </form>`)
        $(".contents").append(html.join(""))

        for (FA of Object.keys(formattedFA)) {
            new SlimSelect({
                select: `#${FA}-cation`,
                closeOnSelect: false,
                onChange: (info) => {
                    var ions = info.map(x => x.value)
                    $(`#${FA}-cation-input`).val(ions.join(","))
                }
            })
            new SlimSelect({
                select: `#${FA}-anion`,
                closeOnSelect: false,
                onChange: (info) => {
                    var ions = info.map(x => x.value)
                    $(`#${FA}-anion-input`).val(ions.join(","))
                }
            })
        }

        $("form").on("submit", async function (e) {
            e.preventDefault()
            endTime = new Date().getTime()

            var minutesTaken = (((endTime - startTime)) / 1000 / 60).toFixed(0)

            $("#submit-button").remove()
            var form = $(this)

            var url = form.attr("action")

            var data = form.serialize()

            var result = JSON.parse(await Promise.resolve(($.post(url, data))))

            // update the html stuff
            var numberOfSteps = result.steps
            console.log(result)
            for (var step = 1; step < numberOfSteps + 1; step++) {
                var textToPutIn = [
                    `<span class="underline"><b>Your Answer (${result.scorePerBox[step - 1]}% correct, ${result.matchedPerBox[step - 1]}/${result.keywordsPerBox[step - 1]} marks)</b></span><br />`,
                    result.submitted[step - 1].replace(/\n/g, "<br />"),
                    `<br /> <br />`,
                    `<span class="answer">`,
                    `<span class="underline">Model Answer</span><br />`,
                    result.model[step - 1].replace(/\n/g, "<br />"),
                    `</span>`
                ]

                $(`#${step}`).hide().val("")
                $(`#step-${step} > .input-box`).html(textToPutIn.join(" "))


            }
            $(".exam-container > .contents").prepend(`<p id='score'>Your score: <b>${result.score}%</b>, <b>${result.marksScored}/${result.totalMarks}</b> (Took ${minutesTaken} minutes)</p>`)

            // update the FA stuff
            for (FA of Object.keys(result.FAresult)) {
                $(`.answer-${FA}-cation > .right`).empty()

                var cationPercentage = Number((result.FAresult[FA].cationScore / result.FAresult[FA].cation_total).toPrecision(2)) * 100


                var html = [
                    `<p>`,
                    `<span class="underline"><b>Your Answer (${cationPercentage}% correct, ${result.FAresult[FA].cationScore}/${result.FAresult[FA].cation_total} marks)</b></span><br />`,
                    result.FAresult[FA].yourCationsAnswer.join(", "),
                    `<br /> <br />`,
                    `<span class="answer">`,
                    `<span class="underline">Model Answer</span><br />`,
                    result.FAresult[FA].cations.join(", "),
                    `</span>`,
                    `</p>`
                ]
                $(`.answer-${FA}-cation > .right`).append(html.join(""))

                $(`.answer-${FA}-anion > .right`).empty()
                var anionPercentage = Number((result.FAresult[FA].anionScore / result.FAresult[FA].anion_total).toPrecision(2)) * 100
                var html = [
                    `<p>`,
                    `<span class="underline"><b>Your Answer (${anionPercentage}% correct, ${result.FAresult[FA].anionScore}/${result.FAresult[FA].anion_total} marks)</b></span><br />`,
                    result.FAresult[FA].yourAnionsAnswer.join(", "),
                    `<br /> <br />`,
                    `<span class="answer">`,
                    `<span class="underline">Model Answer</span><br />`,
                    result.FAresult[FA].anions.join(", "),
                    `</span>`,
                    `</p>`
                ]
                $(`.answer-${FA}-anion > .right`).append(html.join(""))
            }


        })
    }


    $(".exam-container").mouseenter(() => viewingExamPaper = true)
    $(".exam-container").mouseleave(() => viewingExamPaper = false)

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    pin = function () {
        $(".exam-container").toggleClass("pinned")
        $(".fa-thumbtack").toggleClass("pressed")
        pinnedExamPaper = pinnedExamPaper ? false : true

    }
    function formatChemForm(str) {
        return str.split("_").join(" ")
    }

    $(".exam-container").on("keydown", async function (e) {
        // Number 13 is the "Enter" key on the keyboard
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode
            preventClose = true
            await timeout(100)
            preventClose = false
        }
       
    });
    // $(".exam-container").on("keyup", function (e) {
    //     // Number 13 is the "Enter" key on the keyboard
    //     var code = (e.keyCode ? e.keyCode : e.which);
    //     if (code == 13) { //Enter keycode
    //         preventClose = false
    //     }
       
    // });

})




