import express from 'express';
import ReportController from '../Controller/ReportController.js';
import Middleware from '../middlewares/Middleware.js';

const ReportRoute = express.Router();

ReportRoute.post('/report', Middleware.auth, ReportController.reportAccount);

export default ReportRoute;
