$(document).ready(async () => { 




    var examID;
    FAs = '';
    var formattedFA = {}
    var exams = {}

    alertify.prompt(`Select QA Paper`, "-", (evt, value) => {
        if (value == "-") return false
        examID = value;
        (async () => {
            FAs = exams[value].reactants
            // window.open(`/exam/${value}`)
            $(".header > .name").html(`Exam Paper: ${exams[value].exam_name}`)
            renderExam(examID)
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
            reactants: exam.reactants,
            
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
                formattedFA[value].forEach(async reactant => { 
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
        var reactants = FAs.split("||")
        var str = [`<option data-placeholder="true"></option>`]
        for (var i = 1; i < reactants.length+1; i++) { 
            var reactant = reactants[i-1]
            formattedFA[`FA${i}`] = reactant.split(",")
            str.push(`<option value='FA${i}'> FA${i} </option>`)
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
        var data = JSON.parse(await Promise.resolve(($.get('/exam/fetch/steps', {id: id}))))
        var html = [`
            <form action="/" method="post">
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
                    <td class="input-box"> <textarea id=${row.step} class="input"> </textarea> </td>
                </tr>
            `)
        })
        html.push(`
                    </tbody>
                </table>
            </form>
        `)
        $(".contents").append(html.join(""))
    }
    function formatChemForm(str) {
        return str.split("_").join(" ")
    }
}) 
    


    
