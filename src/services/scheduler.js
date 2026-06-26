const cron = require('node-cron');
const orderService = require('./orderService');

class Scheduler{
    async start(){
        cron.schedule('0 * * * *', async () => {
            console.log('Updating order statuses...', new Date().toISOString());
            try{
                const result = await orderService.updateAllOrderStatuses();
                console.log(`Updated ${result.updatedCount}/${result.total} orders`);
            }
            catch(error){
                console.error(error);
            }
        });

        const result = await orderService.updateAllOrderStatuses();
        console.log(`Updated ${result.updatedCount}/${result.total} orders`);
        console.log('Scheduler started');
    }
}

module.exports = new Scheduler();