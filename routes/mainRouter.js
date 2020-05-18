var express = require('express');
var router = express.Router();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1ea-COAxPUZSTvtNITNfiQjCiIP6o0XcOIyCGDxCsFhw');
const config = require('../config.json')

const mysql = require('mysql2/promise')

router.get('/', async (req, res) => {

    // await doc.useApiKey(config.apiKey)
    // await doc.loadInfo()

    // var sheet5 = doc.sheetsByIndex[4]
    // var rows5 = await sheet5.getRows()

    // var obj5 = []
    // rows5.forEach(row => { 
    //     obj5.push({ 
    //         item_name: row["item_name"],
    //         id: row['id'],
    //         interact_with: row['interact_with']
    //     })
    // })









    console.log(obj5)
    var obj5 = [
        {
            item_name: 'Dropper',
            id: 'dropper',
            interact_with: 'FA,dropper,10-mc,50-mc'
        },
        {
            item_name: '10cm³ Measuring Cylinder',
            id: 'ten-mc',
            interact_with: undefined
        },
        {
            item_name: '50cm³ Measuring Cylinder',
            id: 'fifty-mc',
            interact_with: undefined
        }
    ]
    res.render('main.pug', {
        stringify: require('js-stringify'),
        obj5: obj5
    })
})

router.get('/load', async (req, res, next) => {
    try {
        await doc.useApiKey(config.apiKey)
        await doc.loadInfo()

        var ionID = 860291441;
        var apparatusID = 287680680
        var referenceID = 1305630101
        var examStepsID = 1930560132
        var examReactantsID = 669419563

        var ionSheet = await (doc.sheetsById[ionID]).getRows()
        var apparatusSheet = await (doc.sheetsById[apparatusID]).getRows()
        var referenceSheet = await (doc.sheetsById[referenceID]).getRows()
        var examStepsSheet = await (doc.sheetsById[examStepsID]).getRows()
        var examReactantsSheet = await (doc.sheetsById[examReactantsID]).getRows()



        var connection = await mysql.createConnection(config.db_config)

        await connection.execute(`DELETE FROM ions`)
        ionSheet.forEach(async row => {
            var arr = [
                row["formula_id"],
                row["ratio"] || 5,
                row["reacts_with_class_1"] || "",
                row['reacts_with_indiv_1'] || "",
                row["does_not_react_indiv_1"] || "",
                row["condition_1"] || "",
                row["produces_1"] || "",
                row["reacts_with_class_2"] || "",
                row["reacts_with_indiv_2"] || "",
                row["does_not_react_indiv_2"] || "",
                row["condition_2"] || "",
                row["produces_2"] || "",
                row["requires"] || ""
            ]


            await connection.execute(`INSERT INTO ions (formula_id, ratio, reacts_with_class_1, reacts_with_indiv_1, does_not_react_indiv_1, condition_1, produces_1, reacts_with_class_2, reacts_with_indiv_2, does_not_react_indiv_2, condition_2, produces_2, requires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, arr)

        })

        await connection.execute(`DELETE FROM apparatus`)
        apparatusSheet.forEach(async row => {
            var arr = [
                row["apparatus_id"],
                row["item_name"],
                row["interact_with"] || "",
                row["capacity"] || "",
                row["location"] || "",
                row["image_url"] || "",
                row["apparatus_type"] || "",
                row["attribute"] || "",
                row["quantity"] || ""
            ]
            await connection.execute(`INSERT INTO apparatus (apparatus_id, item_name, interact_with, capacity, location, image_url, apparatus_type, attribute, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, arr)




        })

        await connection.execute(`DELETE FROM reference`)
        referenceSheet.forEach(async row => {
            var arr = [
                row['formula_id'],
                row['formula_text'] || "",
                row['name'] || "",
                row['class'] || "",
                row['hex'] || "",
                row['color'] || "",
                row['odor'] || "",
                row['cation'] || "",
                row['anion'] || "",
                row['location'] || "",
                row['special_name'] || "",
                row['type'] || "",
                row['state'] || "",
                row["pH"] || ""
            ]
            await connection.execute(`INSERT INTO reference (formula_id, formula_text, name, class, hex, color, odor, cation, anion, location, special_name, type, state, pH) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, arr)
        })

        await connection.execute(`DELETE FROM examsteps`)
        examStepsSheet.forEach(async row => {
            var arr = [
                row['step'],
                row['test'],
                row['observation'],
                row['exam_id']
            ]
            await connection.execute(`INSERT INTO examsteps (step, test, observation, exam_id) VALUES (?, ?, ?, ?)`, arr)
        })

        await connection.execute(`DELETE FROM examreactants`)
        examReactantsSheet.forEach(async row => {
            var arr = [
                row['exam_id'],
                row['exam_name'],
                row['reactants']
            ]
            await connection.execute(`INSERT INTO examreactants (exam_id, exam_name, reactants) VALUES (?, ?, ?)`, arr)
        })

        // var connection = await mysql.createConnection(config.db_config)
        // await connection.execute(`INSERT INTO ions SET (formula_id, reacts_with_class_1, reacts_with_indiv_1, does_not_react_indiv_1, condition_1, produces_1, reacts_with_class_2, reacts_with_indiv_2, does_not_react_indiv_2, condition_2, produces_2) SET `, [ionArr])

        res.send('loaded')
    } catch (e) {

    } finally {
        connection.end()

    }






})

router.get('/fetch', async (req, res, next) => {
    try {
        console.log("fetched")

        var connection = await mysql.createConnection(config.db_config)
        // get the type of data to be pulled
        var type = req.query.clicked
        console.log(type)
        var result = []
        switch (type) {
            case "basket":
                var t = await connection.query(`SELECT * FROM apparatus WHERE location = "basket"`)
                result = t[0].reduce((r, a) => {
                    r[a.apparatus_id] = [...r[a.apparatus_id] || [], a];
                    return r;
                }, {});
                break;
            case "rack":
                var t = await connection.query(`SELECT * FROM apparatus WHERE location = "test-tube-rack"`)
                result = t[0].reduce((r, a) => {
                    r[a.apparatus_id] = [...r[a.apparatus_id] || [], a];
                    return r;
                }, {});

                break;
            case "reagents":
                var t = await connection.query(`SELECT * FROM reference WHERE location = "FAbasket" ORDER BY class DESC, name ASC`); console.log(t[0])

                result = t[0].reduce((r, a) => {
                    r[a.formula_text] = [...r[a.formula_text] || [], a];
                    return r
                }, {})
                break;
            case "bench":
                var t = await connection.query(`SELECT * FROM reference WHERE location = "bench" ORDER BY pH+0 ASC`); console.log(t[0])

                result = t[0].reduce((r, a) => {
                    r[a.formula_text] = [...r[a.formula_text] || [], a];
                    return r
                }, {})
                break;


        }
        console.log(result)

        res.send(JSON.stringify(result))

    } catch (e) {

    } finally {
        connection.end()
    }


})

router.get('/fetch/specific', async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var apparatus = decodeURI(req.query.apparatus)
        var data = await connection.query(`SELECT * FROM apparatus WHERE apparatus_id = ?`, [apparatus])
        if (data[0].length) {
            res.send(JSON.stringify(data[0][0]))
            return


        } else {
            res.send({ error: true })
        }
    } catch (e) {

    } finally {

    }

})
router.get('/reagentData', async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var formula_id = decodeURI(req.query.formula_id).split(",")
        var result = []
        console.log("test")

        for (var i = 0; i < formula_id.length; i++) {
            console.log(formula_id)
            r = await connection.query(`SELECT * FROM ions WHERE formula_id = ?`, formula_id[i])
            console.log(r[0], 'sdf')
            if (r[0].length) {
                r[0].forEach(a => result.push(a))
            }




        }

        //    console.log("--------------------")
        //    console.log(result[0])
        // might return more than 1 row
        console.log(result, 'dasfas')
        res.send(JSON.stringify(result))
    } catch (e) {

    } finally {

    }
})

router.get('/inspect', async (req, res, next) => {
    try {
        console.log('starting')
        var connection = await mysql.createConnection(config.db_config)
        console.log('after-connection')
        var query = decodeURI(req.query.arr).split(",")
        console.log(query)
        var result = []
        for (var i = 0; i < query.length; i++) {
            var r = await connection.query(`SELECT * FROM ions RIGHT JOIN reference ON ions.formula_id = reference.formula_id WHERE reference.formula_id = ?`, query[i]);
            console.log(r[0], i)
            console.log('-----------------------')
            console.log(r[0].length)



            if (r[0].length) {
                r[0].forEach(element => {
                    result.push(element)
                })
            }



        }


        // console.log('done!')
        res.send(JSON.stringify(result))
        console.log("^^^^^^^^^^^^^^^^")
        console.log(result)
    } catch (e) {

    } finally {

    }

})

router.get('/inspect/getProduct', async (req, res, next) => {
    try {
        console.log('starting')
        var connection = await mysql.createConnection(config.db_config)
        console.log('after-conenct')
        var reagentL = decodeURI(req.query.left)
        var reagentR = decodeURI(req.query.right)

        // If reagentL is NOT an array, it doesn't have ions. 
        // if reagentL is an array, it has ions
        // We first have to check if reagentL has IONS.

        // Either reagentL OR reagentR can be an array, or both.
        // In the case that both are arrays, what we know:
        // ONE item from reagentL can react with ONE item from reagentR

        // Let us use the example of [H+, SO42-, H2SO4] for reagentL and [Na+, OH-, NaOH] for reagentR
        // Hence, we can see that H+ reacts with OH-. 
        // How to figure out?
        // We loop through reagentL
        // Then we loop through reagentR to find the match
        console.log(reagentL, reagentR, '----------------linelinelineline')
        // H⁺_(aq),SO₄²⁻_(aq),H₂SO₄_(aq) Na⁺_(aq),OH⁻_(aq),NaOH_(aq) ----------------linelinelineline
        reagentL = reagentL.split(",")
        reagentR = reagentR.split(",")

        for (var i = 0; i < reagentL.length; i++) {
            for (var j = 0; j < reagentR.length; j++) {
                console.log(i, j, reagentL[i], reagentR[j])

                var result = await connection.query(`SELECT ions.formula_id AS reagentL, ions.reacts_with_indiv_1 AS reagentR, ions.produces_1, ions.ratio, reference.* FROM ions LEFT JOIN reference ON ions.produces_1 = reference.formula_id WHERE ions.formula_id = ? AND ions.reacts_with_indiv_1 = ?`, [reagentL[i], reagentR[j]])
                console.log(result[0])
                // What if there's more than one?????????
                if (result[0].length) {
                    // product found!
                    res.send(JSON.stringify(result[0]))
                    console.log('found:', result[0])
                    return
                }
            }
        }
        for (var i = 0; i < reagentL.length; i++) {
            for (var j = 0; j < reagentR.length; j++) {
                console.log(i, j, reagentL[i], reagentR[j])

                var result = await connection.query(`SELECT ions.formula_id AS reagentR, ions.reacts_with_indiv_1 AS reagentL, ions.produces_1, ions.ratio, reference.* FROM ions LEFT JOIN reference ON ions.produces_1 = reference.formula_id WHERE ions.formula_id = ? AND ions.reacts_with_indiv_1 = ?`, [reagentR[j], reagentL[i]])
                console.log(result[0])
                // What if there's more than one?????????
                if (result[0].length) {
                    // product found!
                    res.send(JSON.stringify(result[0]))
                    console.log('found:', result[0])
                    return
                }
            }
        }
        // loop twice bc they can b swap arnd
        console.log("nothing")
        res.send(JSON.stringify({ error: true }))



        return













        console.log(reagentL, reagentR)
        var result;
        console.log((reagentR.split(",").join("")).length, 'ndfjkabdjkfbahjsbfadjksbfj')
        if (!((reagentR.split(",")).length == 1)) { // ReagentR can be a string like this "Na⁺_(aq),OH⁻_(aq),NaOH_(aq)". So we split the string and check if its length is > 1.
            // Sometimes, can have [Na+, OH-, NaOH]
            // This case, we need to check which of the 2 ions can react.
            var reagentR = reagentR.split(",")
            console.log("here")
            for (var i = 0; i < reagentR.length; i++) {
                var temp = await connection.query(`SELECT ions.produces_1, reference.* FROM ions INNER JOIN reference ON ions.produces_1 = reference.formula_id WHERE ions.formula_id = ? AND ions.reacts_with_indiv_1 = ?`, [reagentL, reagentR[i]])
                console.log(temp[0], "------------------------------")
                if (temp[0].length) {
                    res.send(JSON.stringify(temp[0][0]))

                    return
                }
            }
            res.send(JSON.stringify("error"))

        } else {
            result = await connection.query(`SELECT ions.produces_1, reference.* FROM ions INNER JOIN reference ON ions.produces_1 = reference.formula_id WHERE ions.formula_id = ? AND ions.reacts_with_indiv_1 = ?`, [reagentL, reagentR])
            console.log("result", result[0][0])
            if (result[0].length) {
                res.send(JSON.stringify(result[0][0]))
            } else {
                res.send(JSON.stringify("error"))
            }
        }



    } catch (e) {

    } finally {
        connection.end()
    }




})
router.get('/inspect/getPossibleCompounds', async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var ion = decodeURL(req.query.ion)
        var reagent = decodeURI(req.query.reagent)
        var type = decodeURI(req.query.type);
        var product = decodeURI(req.query.product)
        var result;
        if (type == 'cation') {
            result = await connection.query(`SELECT reference.formula_id FROM reference INNER JOIN ions ON reference.cation = ions.formula_id WHERE reference.cation = ? AND ions.reacts_with_indiv_1 = ? AND ions.produces_1 = ?`, [reagent, ion, product])
        } else {
            result = await connection.query(`SELECT reference.formula_id FROM reference INNER JOIN ions ON reference.anion = ions.formula_id WHERE reference.cation = ? AND ions.reacts_with_indiv_1 = ? AND ions.produces_1 = ?`, [reagent, ion, product])
        }
        res.send(JSON.stringify(result[0][0])) // only first result is returned ah remember
    } catch (e) {

    } finally {

    }



})
router.get('/inspect/getIons', async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)

        var reagent = decodeURI(req.query.reagent)
        console.log(reagent, "getIons")


        var result = await connection.query(`SELECT * FROM reference WHERE formula_id = ?`, [reagent])
        if (result[0].length) {
            res.send(JSON.stringify(result[0][0]))
        } else {
            res.send(JSON.stringify({ error: true }))
        }
        console.log(result[0])
        // only first result is returned ah remember

    } catch (e) {

    } finally {

    }



})

router.get('/inspect/getPpt', async (req, res, next) => {
    try {
        console.log('starting')
        var connection = await mysql.createConnection(config.db_config)
        console.log('after-connection')
        var query = decodeURI(req.query.arr).split(",")
        console.log(query)
        var result = []
        for (var i = 0; i < query.length; i++) {
            var r = await connection.query(`SELECT * FROM reference WHERE formula_id = ?`, query[i]);
            console.log(r[0], i)
            console.log('-----------------------')
            console.log(r[0].length)



            if (r[0].length) {
                r[0].forEach(element => {
                    result.push(element)
                })
            }



        }


        // console.log('done!')
        res.send(JSON.stringify(result))
        console.log("^^^^^^^^^^^^^^^^")
        console.log(result)
    } catch (e) {

    } finally {

    }


})

router.get('/inspect/getAirReaction', async (req, res, next) => {
    try {

        var connection = await mysql.createConnection(config.db_config)
        console.log('after-connection')
        var query = decodeURI(req.query.arr).split(",")
        console.log(query)
        var result = []
        for (var i = 0; i < query.length; i++) {
            r = await connection.query(`SELECT ions.formula_id, ions.produces_1, reference.color, reference.state, reference.formula_text, reference.hex FROM ions INNER JOIN reference ON ions.produces_1 = reference.formula_id WHERE ions.formula_id = ? AND ions.reacts_with_indiv_1 = "air"`, [query[i]])
            if (r[0].length) {
                r[0].forEach(element => {
                    result.push(element)
                })
            }
        }
        console.log(result, "-------------------------")
        res.send(JSON.stringify(result))
    } catch (e) {


    } finally {

    }







})
router.get("/inspect/getRatio", async (req, res, next) => {
    try {
        console.log("bsdfjkabdshjkfbadjksfbjkadsbfjdasbfjks")
        var connection = await mysql.createConnection(config.db_config)
        var reagentL = decodeURI(req.query.left).split(",")

        var reagentR = decodeURI(req.query.right).split(",")
        var product = decodeURI(req.query.product)
        reagentL.forEach(RL => {
            reagentR.forEach(async RR => {
                var result = await connection.query(`SELECT ratio FROM ions WHERE formula_id = ? AND reacts_with_indiv_1 = ? AND produces_1 = ?`, [RL, RR, product])
                if (result[0].length) {
                    console.log(result[0][0])
                    res.send(JSON.stringify(result[0][0].ratio))
                    console.log(RL, RR, product)
                    return
                }

            })
        })





    } catch (e) {

    } finally {

    }


})

router.get("/inspect/get")


router.get("/exam", (req, res, next) => {
    res.render("exam.pug", {
        exam: true,
        stringify: require('js-stringify'),
    })
})



router.get("/exam/fetch", async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var result = await connection.query(`SELECT * FROM examreactants`)
        console.log(result[0])
        res.send(JSON.stringify(result[0]))
    } catch (e) {

    } finally {

    }
})

router.get("/exam/fetch/steps", async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var id = decodeURI(req.query.id)
        console.log("id", id)
        var result = await connection.query(`SELECT * FROM examsteps WHERE exam_id = ? ORDER BY step+0 ASC`, id)


        res.send(JSON.stringify(result[0]))
    } catch (e) {

    } finally {

    }
})

router.get("/exam/fetch/specific", async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var formula_id = decodeURI(req.query.formula_id)
        var result = await connection.query(`SELECT formula_text FROM reference WHERE formula_id = ? `, formula_id)


        res.send(JSON.stringify(result[0][0]))
    } catch (e) {

    } finally {

    }
})
router.get("/exam/:id", (req, res, next) => {
    res.send(req.params.id)

})

var t = { "Ni²⁺_(aq)": [["Na⁺_(aq)", "OH⁻_(aq)", "NaOH_(aq)"]], "Al³⁺_(aq)": [["Na⁺_(aq)", "OH⁻_(aq)", "NaOH_(aq)"], ["Na⁺_(aq)", "CO₃²⁻_(aq)", "Na₂CO₃_(aq)"]], "Na⁺_(aq),CO₃²⁻_(aq),Na₂CO₃_(aq)": ["H₂O_(l)"] }
console.log(Object.keys(t))
module.exports = router


