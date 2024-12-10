import cron from 'node-cron';
import { checkCouponExpiry } from './index.js';
import { CRON_OPTIONS } from '../constants/common.js';

const scheduleJob = (cronExpression, jobFunction) => {
  cron.schedule(cronExpression, jobFunction, {
    scheduled: true,
    timezone: CRON_OPTIONS.TIMEZONE,
  });
};

scheduleJob('0 0 * * *', checkCouponExpiry);
