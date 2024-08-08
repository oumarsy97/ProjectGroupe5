import Report from '../Model/Report.js';
import { User, validateUser, Tailor, validateTailor } from "../Model/User.js";

export default class ReportController {
    static reportAccount = async (req, res) => {
        const { reportedUserId, reportedTailorId, reason } = req.body;
        const reporterId = req.userId;

        try {
            const reporter = await User.findById(reporterId) || await Tailor.findById(reporterId);
            if (!reporter) {
                return res.status(404).json({ message: 'Reporter not found', status: false });
            }

            const newReport = new Report({
                reportedBy: reporterId,
                reportedUser: reportedUserId || undefined,
                reportedTailor: reportedTailorId || undefined,
                reason,
            });

            await newReport.save();

            res.status(201).json({ message: 'Report created successfully', data: newReport, status: true });
        } catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    }
}
