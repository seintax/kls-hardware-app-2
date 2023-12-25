const my = require('./mysql')

const modificyCache = async (stmt, id, user = undefined, details = undefined) => {
    let arr = stmt?.trim().split(" ")
    let act = arr[0].toUpperCase()
    let tbl = arr[2]
    let det = details
    let usr = user || 0
    if (arr[0].toUpperCase() === "UPDATE") tbl = arr[1]
    let whr = stmt?.trim().toUpperCase().split(" WHERE ")
    let occ = whr[1].split("_ID").length - 1
    let pkr = whr[1].split(" ").filter(f => f.includes("_ID")).map(f => f?.trim()?.replace('=', "")?.replace('?', "")?.toLowerCase())
    let pki = pkr[0]
    if (occ > 1) {
        let pka = pkr.filter(f => {
            let chr = f.replace("_id", "")
            let mch = 0
            for (const c of chr) {
                if (tbl.includes(c)) mch++
            }
            if (chr.length === mch) return f
        })
        pki = pka[0]
    }
    let sql = `SELECT * FROM ${tbl} WHERE ${pki}=?`
    my.query(sql, [id], async (err, ans) => {
        if (err) return false
        let qry = JSON.stringify(ans[0])
        let sql = `INSERT INTO sys_stash (stsh_table,stsh_query,stsh_pk) VALUES (?,?,?)`
        await my.query(sql, [tbl, qry, pki], async (err, ans) => {
            if (err) return false
            let cid = ans['insertId']
            let dct = { insert: "Added", update: "Modified", delete: "Removed" }
            if (!details) det = `${dct[act.toLowerCase()]} ${tbl.split("_").slice(1).join(' ').toUpperCase()} with ID: ${id}`
            let sql = `INSERT INTO sys_trace (trce_ref,trce_details,trce_method,trce_stash,trce_user) VALUES (?,?,?,?,?)`
            await my.query(sql, [id, det, act, cid, usr], async (err, ans) => {
                if (err) return false
                return true
            })
        })
    })
}

const creationCache = async (stmt, id, user = undefined, details = undefined) => {
    let arr = stmt?.trim().split(" ")
    let act = arr[0].toUpperCase()
    let tbl = arr[2]
    let det = details
    let usr = user || 0
    let dct = { insert: "Added", update: "Modified", delete: "Removed" }
    if (!details) det = `${dct[act.toLowerCase()]} ${tbl.split("_").slice(1).join(' ').toUpperCase()} with ID: ${id}`
    let sql = `INSERT INTO sys_trace (trce_ref,trce_details,trce_method,trce_user) VALUES (?,?,?,?)`
    my.query(sql, [id, det, act, usr], async (err, ans) => {
        if (err) return false
        return true
    })
}

const reversalCache = async (id) => {
    let sql = `SELECT * FROM sys_stash, sys_trace WHERE trce_stash=stsh_id AND stsh_id=?`
    my.query(sql, [id], (err, ans) => {
        if (err) return { success: false, error: err }
        if (ans.length === 1) {
            let jsonval = JSON.parse(ans[0]['stsh_query'])
            let table = ans[0]['stsh_table']
            let primary = ans[0]['stsh_pk']
            let method = ans[0]['trce_method']
            let condition = ""
            let fld = []
            let val = []
            for (const prop in ans[0]) {
                if (prop === primary) {
                    if (method === "DELETE") {
                        fld.push(prop)
                        val.push(jsonval[prop])
                    }
                    else condition = `${prop}='${jsonval[prop]}'`
                }
                else {
                    fld.push(prop)
                    val.push(jsonval[prop])
                }
            }
            let stmt = `UPDATE ${table} SET ${fld.map((f, i) => { return `${f}='${val[i]}'` }).join(",")} WHERE ${condition}`
            if (method === "DELETE") stmt = `INSERT INTO ${table} (${fld.join(",")}) VALUES (${val.map(v => { return `'${v}'` })})`
            return { success: true, stmt: stmt }
        }
        return { success: false, error: "No valid record." }
    })
}

module.exports = {
    modificyCache,
    creationCache,
    reversalCache
}