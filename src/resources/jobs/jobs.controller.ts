import { prisma } from "../../db/connect";
import { Request, Response } from "express";

export async function getJobs(req: Request, res: Response) {
    try {
        const jobs = await prisma.jobs.findMany();

        if (!jobs.length) return res.status(404).json({ error: "No jobs found." })

        res.status(200).json(jobs)

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function getJob(req: Request, res: Response) {
    try {
        const { jobsid } = req.params;

        const jobs = await prisma.jobs.findUnique({
            where: {
                id: parseInt(jobsid)
            }
        })

        if (!jobs) return res.status(404).json({ error: "Job not found." })

        res.status(200).json(jobs)

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function getJobsByUser(req: Request, res: Response) {
    try {
        const { userid } = req.params;

        const jobs = await prisma.user.findUnique({
            where: {
                id: parseInt(userid)
            },
            select: {
                jobs: true
            }
        })

        if (!jobs) return res.status(404).json({ error: "User not found" });

        res.status(200).json(jobs)
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function updateJob(req: Request, res: Response) {
    try {
        const { jobsid } = req.params;
        const { job_id } = req.body;

        const jobs = await prisma.jobs.update({
            where: {
                id: parseInt(jobsid)
            },
            data: {
                job_id: job_id
            },
        })

        if (!jobs) return res.status(404).json({ error: "Job not found." })

        res.status(200).json(jobs)

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}


export async function createJobByUser(req: Request, res: Response) {
    try {
        const { userid } = req.params;
        const { job_id } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userid)
            },
        })

        if (!user) return res.status(404).json({ error: "User not found" });

        const existingJob = await prisma.jobs.findFirst({
            where: {
                job_id: job_id,
                userid: parseInt(userid)
            },
        })

        if (existingJob) return res.status(404).json({ error: "Job already added" });

        const job = await prisma.jobs.create({
            data: {
                userid: parseInt(userid),
                job_id: job_id
            }
        })

        res.status(201).json({ id: job.id, message: "Job added for user" })

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

type Query = {
    email: string,
    jobsid: string
}

//TODO Gör en query här för email och jobsid som i getusers
export async function deleteJobByUser(req: Request<{}, {}, {}, Query>, res: Response) {
    try {

        const jobsid = req.query.jobsid || "";
        const email = req.query.email || "";

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                jobs: true
            }
        })

        if (!user) return res.status(404).json({ error: "User not found" });

        const jobs = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                jobs: {
                    delete: [{ id: parseInt(jobsid) }]
                },
            }
        })

        res.status(200).json({ id: jobs.id, message: "Job deleted" })

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}

export async function deleteJob(req: Request, res: Response) {
    try {
        const { jobsid } = req.params;

        const jobs = await prisma.jobs.delete({
            where: {
                id: parseInt(jobsid)
            },
        })

        if (!jobs) return res.status(404).json({ error: "Job not found." })

        res.status(200).json({ id: jobs.id, message: "Job deleted" })

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Database query failed!" });
    }
}