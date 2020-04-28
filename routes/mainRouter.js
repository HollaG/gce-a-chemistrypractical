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
        var anionID = 653353890;
        var gasesID = 1781349377;
        var basketItemsID = 1284028318;
        var itemsID = 1305630101

        var ionSheet = await (doc.sheetsById[ionID]).getRows()
        var apparatusSheet = await (doc.sheetsById[apparatusID]).getRows()
        var referenceSheet = await (doc.sheetsById[referenceID]).getRows()
        var anionSheet = doc.sheetsById[anionID]
        var gasesSheet = doc.sheetsById[gasesID]
        var basketItemsSheet = doc.sheetsById[basketItemsID]
        var itemsSheet = doc.sheetsById[itemsID]


        var connection = await mysql.createConnection(config.db_config)

        await connection.execute(`DELETE FROM ions`)
        ionSheet.forEach(async row => {
            var arr = [
                row["formula_id"],
                row["reacts_with_class_1"] || "",
                row['reacts_with_indiv_1'] || "",
                row["does_not_react_indiv_1"] || "",
                row["condition_1"] || "",
                row["produces_1"] || "",
                row["reacts_with_class_2"] || "",
                row["reacts_with_indiv_2"] || "",
                row["does_not_react_indiv_2"] || "",
                row["condition_2"] || "",
                row["produces_2"] || ""
            ]


            await connection.execute(`INSERT INTO ions (formula_id, reacts_with_class_1, reacts_with_indiv_1, does_not_react_indiv_1, condition_1, produces_1, reacts_with_class_2, reacts_with_indiv_2, does_not_react_indiv_2, condition_2, produces_2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, arr)

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
                row["type"] || "",
                row["attribute"] || ""
            ]
            await connection.execute(`INSERT INTO apparatus (apparatus_id, item_name, interact_with, capacity, location, image_url, type, attribute) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, arr)




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
                row['state'] || ""
            ]
            await connection.execute(`INSERT INTO reference (formula_id, formula_text, name, class, hex, color, odor, cation, anion, location, special_name, type, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, arr)
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
                var t = await connection.query(`SELECT * FROM reference WHERE location = "FAbasket"`); console.log(t[0])

                result = t[0].reduce((r, a) => {
                    r[a.formula_text] = [...r[a.formula_text] || [], a];
                    return r
                }, {})
                break;
            case "bench":
                var t = await connection.query(`SELECT * FROM reference WHERE location = "bench" ORDER BY name ASC`);

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

router.get('/reagentData', async (req, res, next) => {
    try {
        var connection = await mysql.createConnection(config.db_config)
        var formula_id = decodeURI(req.query.formula_id)
        var result = await connection.query(`SELECT * FROM ions WHERE formula_id = ?`, formula_id)
        //    console.log("--------------------")
        //    console.log(result[0])
        // might return more than 1 row
        res.send(JSON.stringify(result[0]))
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
            var result = await connection.query(`SELECT reference.formula_id FROM reference INNER JOIN ions ON reference.cation = ions.formula_id WHERE reference.cation = ? AND ions.reacts_with_indiv_1 = ? AND ions.produces_1 = ?`,[reagent, ion, product])
        } else { 
            var result = await connection.query(`SELECT reference.formula_id FROM reference INNER JOIN ions ON reference.anion = ions.formula_id WHERE reference.cation = ? AND ions.reacts_with_indiv_1 = ? AND ions.produces_1 = ?`,[reagent, ion, product])
        }
        res.send(JSON.stringify(result[0][0])) // only first result is returned ah remember
    } catch (e) { 

    } finally { 

    }



})
module.exports = router


