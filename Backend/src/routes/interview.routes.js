const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router();

/**
 * @route POST/ api/interview
 * @description genreate new interview report on the bases of user self description, resume pdf and job description 
 * @access  private 
 */
interviewRouter.post("/",authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController )


/**
 * @route GET/ api/interview/report/:interviewId
 * @description generate new interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview/
 * @description gets all the reports for the user 
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser , interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/nterview/resume/pdf
 * @description generates resume pdf on the bases of selfdescription, jobdescription, resume
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController )
module.exports = interviewRouter
