const { app } = require('@azure/functions');
const { Client } = require('pg');

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        const client = new Client({
            user: 'dbuser',
            host: 'nestit-337',
            database: 'test',
            password: 'dbuser',
            port: 5432,
          });
        
          try {
            await client.connect();
            const result = await client.query('SELECT COUNT(*) FROM sst_work_order');
        
            // The 'res' object is used to send the HTTP response
            context.res = {
              status: 200,          // HTTP status code
              body: result.rows,    // Response body
            };
          } catch (err) {
            context.res = {
              status: 500,          // HTTP status code for error
              body: `Error: ${err.message}`,  // Error message in the response
            };
          } finally {
            await client.end();
          }
        }
});
