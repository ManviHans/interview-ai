const pdfparse = require("pdf-parse")
const { PDFParse} = require("pdf-parse")
const {generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require( "../models/interviewReport.model")


async function generateInterviewReportController(req, res ){

  const { selfDescription, jobDescription} = req.body || {}
  let resumeText = ""

  if (!jobDescription?.trim()) {
    return res.status(400).json({
      message: "Please enter a job description"
    })
  }

  if (req.file) {
    const resumeContent = await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    resumeText = resumeContent.text
  }

  if (!resumeText && !selfDescription?.trim()) {
    return res.status(400).json({
      message: "Please upload a resume or enter a self-description"
    })
  }

  const interviewReportByAi = await generateInterviewReport({ 
    resume: resumeText,
    selfDescription, 
    jobDescription
})

    const technicalQuestions = (Array.isArray(interviewReportByAi.technicalQuestions)
      ? interviewReportByAi.technicalQuestions
      : []).map((item) => typeof item === "string"
        ? { question: item, intention: "This checks your understanding of the topic.", answer: "Explain the idea in your own words and give a simple example." }
        : item)

    const behavioralQuestions = (Array.isArray(interviewReportByAi.behavioralQuestions)
      ? interviewReportByAi.behavioralQuestions
      : []).map((item) => typeof item === "string"
        ? { question: item, intention: "This checks how you handle a real work situation.", answer: "Describe the situation, what you did, and what happened as a result." }
        : item)

    const skillGaps = (Array.isArray(interviewReportByAi.skillGaps)
      ? interviewReportByAi.skillGaps
      : []).map((item) => typeof item === "string"
        ? { skill: item, severity: "medium" }
        : item)

    const preparationPlan = (Array.isArray(interviewReportByAi.preparationPlan)
      ? interviewReportByAi.preparationPlan
      : []).map((day, index) => {
        if (typeof day === "string") {
          return { day: index + 1, focus: day, tasks: [] }
        }

        return {
          ...day,
          day: day.day || index + 1,
          focus: day.focus || day.intention || "",
          tasks: Array.isArray(day.tasks) ? day.tasks : day.tasks ? [day.tasks] : []
        }
      })

    const interviewReport = await interviewReportModel.create({
        ...interviewReportByAi,
        user : req.user.id,
        resumeText,
        selfDescription,
        jobDescription,
        title: interviewReportByAi.title || "Interview Preparation Plan",
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan
    })

    res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })
}


async function getInterviewReportByIdController(req, res ){

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })
    
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found "
        })
    }

    res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res ){

    const interviewReports = await interviewReportModel.find({ 
        user: req.user.id
    }).sort({createdAt : -1}).select({resumeText: 0,
  selfDescription: 0,
  jobDescription: 0,
  __v: 0,
  technicalQuestions: 0,
  behaviouralQuestions: 0,
  skillGaps: 0,})

    res.status(200).json({
        message:"Interview Reports fetched successfully",
        interviewReports
    })
}

async function generateResumePdfController(req, res){
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found "
        })
    }

    const { resumeText, selfDescription, jobDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume: resumeText, jobDescription,selfDescription})

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController
} 
