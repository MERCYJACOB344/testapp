const { Client } = require('pg');



module.exports = async function (context, req) {
    const { method, url } = req;

    if (method === 'GET' && url.includes('/getUsersInfo')) {
        await getUsersInfo(context, req);
    } else if (method === 'POST' && url.includes('/function2')) {
        await function2(context, req);
    } else {
        context.res = {
            status: 404,
            body: "Not Found",
        };
    }
};

async function getUsersInfo(context, req) {
    const client = new Client({
        user: 'dbuser',
        host: 'nestit-337',
        database: 'test',
        password: 'dbuser',
        port: 5432,
    });

    try {
        await client.connect();
        const formData =  req.body;
        const { email, password } = formData;
        console.log('formmm',formData);

       
        // const insertQuery = `
        //     INSERT INTO sst_usersInfo (
        //         email,
        //         password,
             
        //     ) VALUES ($1, $2)
        //     RETURNING *
        // `;
        // const result = await client.query(insertQuery, [
        //     email,
        //     password,
           
        // ]);

    
    } catch (err) {
        context.res = {
            status: 500,
            body: `Error: ${err.message}`,
        };
    } finally {
        await client.end();
    }
};
    context.res = {
        status: 200,
        body: "Hello from Function 1",
    };


async function function2(context, req) {
    const formData = req.body;
    context.res = {
        status: 200,
        body: `Hello from Function 2, you sent: ${JSON.stringify(formData)}`,
    };
}


  
