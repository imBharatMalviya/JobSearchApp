import React from 'react';
const Job = ({ data }) => {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Skills</th>
                    <th>Experience</th>
                    <th>End Date</th>
                    <th>Source</th>
                </tr>
            </thead>
            <tbody>
                {data.map((job) => (
                    <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.companyname}</td>
                        <td>{job.location}</td>
                        <td>{job.skills}</td>
                        <td>{job.experience}</td>
                        <td>{job.enddate}</td>
                        <td>{job.source}</td>
                    </tr>

                ))}
            </tbody>
        </table>
    )
}
export default Job;