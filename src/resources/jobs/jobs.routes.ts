import express from "express";

import { auth } from "../../middleware/auth";
import { getJobs, getJob, getJobsByUser, createJobByUser, deleteJobByUser, updateJob, deleteJob } from "./jobs.controller";

const router = express.Router();

router.use(auth);

//GET /jobs: Get a list of jobs
//GET /jobs/:jobsId : Get a specific job by ID 
//GET /jobs/users/:userId : Get a list of jobs by a specific user
//PUT /jobs/:jobsId : Update a specific job
//POST /jobs/userid : Create a new job for a specific user.
//DELETE /jobs/:jobsId : Delete a specific job by Id. 
//DELETE /jobs/users/:jobsId : Delete a job by a specific user. 

router.get("/jobs", getJobs);
router.get("/jobs/:jobsid", getJob);
router.get("/jobs/users/:userid", getJobsByUser);
router.put("/jobs/:jobsid", updateJob);
router.post("/jobs/:userid", createJobByUser);
router.delete("/jobs/users/:jobsid", deleteJobByUser);
router.delete("/jobs/:jobsid", deleteJob);

export default router