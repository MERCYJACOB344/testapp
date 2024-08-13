const { Client } = require('pg');

module.exports = async function (context, req) {
    const client = new Client({
        user: 'dbuser',
        host: 'nestit-337',
        database: 'test',
        password: 'dbuser',
        port: 5432, // default PostgreSQL port
    });

    try {
        await client.connect();
       const res = await client.query('SELECT * FROM sst_work_order');
        context.res = {
            status: 200,
            body: res
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`
        };
    } finally {
        await client.end();
    }
};
