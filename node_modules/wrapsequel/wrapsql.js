const mysql = require('mysql')

class Wrapsql {

    /**
     * Constructor accepts either pre-built mySql connection or config object. 
     * @param {object} sql Pre-built mySql connection or config object.
     * @param {bool} debug Toggle debug mode which prints all queries to console. 
     */
	constructor(sql,debug=false){

        this.debug = debug

        if ( sql.hasOwnProperty('config') ){
            this.sql = sql
        } else {
            this.sql = mysql.createConnection({
                host: sql.host,
                port: sql.port,
                user: sql.user,
                password: sql.password,
                database: sql.database
            })
        }
    }

    /**
     * Returns details about db connection. Useful for determining if the conneciton was successful before running queries. 
     */
    connect(){
        return new Promise( ( resolve, reject ) => {
            this.sql.connect( ( err, suc ) => {
                if ( err )
                return reject( err )
                resolve( suc )
            } )
        } )
    }
    
    /**
     * Select all results from table. 
     * @param {string} table Name of table 
     */
    async selectAll(table){

        return this.runQuery(`SELECT * FROM ${table}`)

    }

    /**
     * Select data from a table. 
     * @param {string} table Table to select from.
     * @param {array or string(*)} columns Accepts either an array of columns to return or '*' to return all columns. 
     * @param {object} where Object of where conditions.
     * @param {string} orderBy Column you would like to order by. 
     * @param {string} order Order of results ('ASC','DESC'). 
     * @param {int} limit Number of results to return.
     * @param {int} offset Number of rows to offset before return results. 
     */
    async select(table,columns,where,orderBy=false,order='ASC',limit=false,offset=false){

        let query = `SELECT `

        if ( Array.isArray(columns) ){
            columns.forEach(column => {
                query += `${column},`
            })
            query = query.substring(0, query.length - 1)
        } else {
            query += ` * FROM ${table} `
        }

        query += this.addOptions(where,orderBy,order,limit,offset)

        return this.runQuery(query)

    }

    /**
     * Insert data into a table.
     * @param {string} table Table name.
     * @param {object} insert Insert values.
     */
    async insert(table,insert){

        let query = `INSERT INTO ${table} (`
        
        for (let property in insert) {
            query += `${property}, `
        }
        query = query.substring(0, query.length - 2)
        query += `) VALUES (`
        for (let property in insert) {
            query += `${this.formatString(insert[property])}, `
        }
        query = query.substring(0, query.length - 2)
        query += `) `

        return this.runQuery(query)

    }
    
    /**
     * Update values in table.
     * @param {string} table Table Name.
     * @param {object} update Update values.  
     * @param {object} where Object of where conditions.
     */
    async update(table,update,where=false){

        let query = `UPDATE ${table} SET `

        for (let property in update) {
            query += `${property} = ${this.formatString(update[property])}, `
        }
        query = query.substring(0, query.length - 2)
        query += this.addOptions(where)

        return this.runQuery(query)

    }

    /**
     * Delete records from table.   
     * @param {string} table Table name.
     * @param {object} where Values conditions to determine which rows to delete.
     */
    async delete(table,where){

        let query = `DELETE FROM ${table} ` + this.addOptions(where)
        return this.runQuery(query)

    }

    /**
     * 
     * @param {string} table Table name.
     * @param {object} where Values conditions to determine which rows to delete.
     * @param {string} as Label for the result
     */
    async count(table,where=false,as='count'){

        let query = `SELECT COUNT(*) AS ${as} FROM ${table} ` + this.addOptions(where)
        return this.runQuery(query)

    }

    /**
     * Run a SQL query.
     * @param {string} query SQL Query
     */
    async query(query){

        return this.runQuery(query)

    }

    /**
     * Pass through to run SQL queries directly. 
     * @param {string} query MySQL query string. 
     */
    async runQuery(query){
        
        if (this.debug) console.log(query)

        return new Promise( ( resolve, reject ) => {
            this.sql.query(query, [], ( err, rows ) => {
                if ( err ) return reject( err )
                resolve( rows )
            } )
        } )
    }

    /**
     * Execute an array of SQL queries where if there is an error or exception all are rolled back. 
     * @param {array} queryArray Array of sql query strings. 
     */
    async transaction(queryArray){

        return new Promise(async (resolve,reject) => {
            
            try {

                let queryResults = []
                this.sql.beginTransaction((transactionError) => {
                    
                    if (transactionError !== null) {
                        reject(transactionError);
                    }

                    for (const query of queryArray) {

                        if (this.debug) console.log(query)

                        this.sql.query(query, [], ( queryErr, rows ) => {
                      
                            if (queryErr !== null) {
 
                                try {
                                    this.sql.rollback((err) => {
                                        reject(err);
                                    });
                                } catch (rollbackError) {
                                    reject(rollbackError);
                                }
                            }
                            queryResults.push(rows)
                        })
                    }
    
                    this.sql.commit((commitError) => {
                        if (commitError !== null) {
                            reject(commitError);
                        }
                        resolve(queryResults);
                    })

                })
            } catch (error) {
                reject(error);
            }

        })

    }


    /**
     * Adds options to end of SQL string.
     * @param {string} where Object of where conditions.
     * @param {string} orderBy Column you would like to order by. 
     * @param {string} order Order of results ('ASC','DESC'). 
     * @param {int} limit Number of results to return.
     * @param {int} offset Number of rows to offset before return results. 
     */
    addOptions(where=false,orderBy=false,order='DESC',limit=false,offset=false){

        let query = ""

        if ( where ) {

            query += ` WHERE `

            Number.isInteger(123) 
            for (let property in where) {
                query += `${property} = ${this.formatString(where[property])} AND `
            }

            query = query.substring(0, query.length - 4)

       }

        query += (orderBy) ? ` ORDER BY ${orderBy} ${order}` : ''
        query += (limit) ? ` LIMIT ${limit}` : ''
        query += (offset) ? ` OFFSET ${offset}` : ''

        return query

    }

    formatString(property){
        return (Number.isInteger(property))?property:("'"+property+"'")
    }

}

module.exports = Wrapsql