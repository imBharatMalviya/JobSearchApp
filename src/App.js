import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Job from './Job';
import moment from 'moment';

const PER_PAGE = 20
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      jobsData: [],
      data: [],
      locations: [],
      experiences: [],
      companies: [],
      skills: [],
      location: "",
      experience: "",
      skill: "",
      company: "",
      sortBy: "",
      currentPage:1,
      expired:"active"
    }
    var self = this;
    axios.get("https://nut-case.s3.amazonaws.com/jobs.json").then(response => {
      self.setState({
        data: response.data.data,
        companies: Array.from(new Set(response.data.data.map(x => x.companyname))),
      })
      var experiences = Array.from(new Set(self.state.data.map(x => x.experience)));
      var temp_exp = [];
      experiences.map((exp) => {
        exp = exp.replace(/ /g, "").trim().toLowerCase().replace("yrs", "").replace("to", "-").replace("yr", "");
        var min = exp.substr(0, exp.indexOf('-')).replace("-", "");
        var max = exp.substr(exp.indexOf('-'), exp.length).replace("-", "");
        if (!temp_exp.includes(min) && !isNaN(min)) {
          temp_exp.push(min);
        }
        if (!temp_exp.includes(max) && !isNaN(max)) {
          temp_exp.push(max);
        }
        return exp;
      });
      temp_exp.sort(function (a, b) {
        return a - b;
      });
      self.setState({
        experiences: temp_exp
      });
      var locations = Array.from(new Set(self.state.data.map(x => x.location)));
      var temp_loc = [];
      locations.map((loc) => {
        loc.split(',').map((t) => {
          if (!temp_loc.includes(t.trim())) {
            temp_loc.push(t.trim());
          }
          return t;
        });
        return loc;
      });
      self.setState({
        locations: temp_loc
      })

      var skills = Array.from(new Set(self.state.data.map(x => x.skills)));
      var temp = [];
      skills.map((skill) => {
        skill.split(',').map((t) => {
          if (!temp.includes(t.trim())) {
            temp.push(t.trim());
          }
          return t;
        });
        return skill;
      });
      self.setState({
        skills: temp
      })
    }).catch(function (error) {
      alert("Error While API Call" + error)
    });

    
  }
  search = (e) => {
    e.preventDefault();
    var jobsData = [];
    var self = this;
    this.state.data.map(function (job) {
      var skills = job.skills.replace(/ /g, "");
      var locations = job.location.replace(/ /g, "");
      var experience = job.experience.replace(/ /g, "").trim().toLowerCase().replace("yrs", "").replace("to", "-").replace("yr", "").substr(job.experience.indexOf("-"), job.experience.length);
      if (experience === null || experience === "" || experience.includes("Fresher") || experience.includes("fresher")) experience = 0;
      else experience = parseInt(experience);
      if ((self.state.location === "" || locations.split(",").includes(self.state.location.replace(/ /g, ""))) && (self.state.skill === "" || skills.split(",").includes(self.state.skill.replace(/ /g, ""))) && (self.state.experience==="" || self.state.experience <= experience) && (self.state.company === "" || job.companyname === self.state.company)) {
        if((self.state.expired==="expired") || (job.enddate === "" || moment(job.enddate, ["DD MMM YY", "YYYY-MM-DD"]).toDate().getTime() >= new Date().getTime())){
          jobsData.push(job)
        }
      }
      return job;
    });
    this.setState({
      jobsData: jobsData,
      jobs: jobsData.slice(0, PER_PAGE)
    }, () => {
      if (this.state.sortBy === "company") {
        this.sortByCompanyName();
      }
      if (this.state.sortBy === "experience") {
        this.sortByExperience();
      }
    })

  }
  sortBy =(e)=> {
    let sortBy = e.target.value;
    let { jobsData } = this.state
    if(sortBy==="company"){
      jobsData.sort(function (a, b) {
        if (a.companyname.toLowerCase() < b.companyname.toLowerCase()) {
          return -1;
        } else if (a.companyname.toLowerCase() > b.companyname.toLowerCase()) {
          return 1;
        } else {
          return 1;
        }
      });
      this.setState({
        sortBy: "company",
        jobs: jobsData.slice(0, PER_PAGE)
      })
    }else if(sortBy==="experience"){
      jobsData.sort((a, b) => {
        var eA = a.experience.replace(/ /g, "").trim().toLowerCase().replace("yrs", "").replace("to", "-").replace("yr", "").substr(a.experience.indexOf("-") - 1, a.length);
        var eB = b.experience.replace(/ /g, "").trim().toLowerCase().replace("yrs", "").replace("to", "-").replace("yr", "").substr(b.experience.indexOf("-") - 1, b.length);
        //console.log(eA +"with" + eB);
        if (eA < eB) {
          return 1;
        } else if (eA > eB) {
          return -1;
        } else {
          return 1;
        }
      });
      this.setState({
        sortBy: "experience",
        jobs: jobsData.slice(0, PER_PAGE)
      })
    }
    
  }


  changePage=(page)=> {
    this.setState({
      currentPage:page,
      jobs: this.state.jobsData.slice(page * PER_PAGE, (page * PER_PAGE) + PER_PAGE)
    })
  }
  handleInputChange =(event)=> {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    let renderPageNumbers, pageNumbers = [];
    for (let i = 1; i < Math.ceil(this.state.jobsData.length / PER_PAGE); i++) {
      pageNumbers.push(i);
    }
    renderPageNumbers = pageNumbers.map(number => {
      let classes = "page-item";
      if(this.state.currentPage===number){
        classes += " active";
      }
      return (
        <li className={classes} key={number}><button className='page-link' onClick={() => this.changePage(number)}>{number}</button></li>
      );
    });
    let selectStyle = {
      width:"inherit"
    };
    return (
      <div className="container">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand h1">Job Search App</span>
          <span><label className="label">Jobs Per Page: <b>{PER_PAGE}</b> Total Jobs found : {this.state.jobsData.length}</label>
          </span>
        </nav>
        <div className="row">
          <div className="col-md-12">
            <form className="form-inline">
              <div className="form-group col-md-2">
                <label htmlFor="location" className="label">Location</label>
                <select name="location" id="location" onChange={this.handleInputChange} style={selectStyle} className="form-control" >
                  <option value="">Select Location</option>
                  {this.state.locations.map(loc => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="experience" className="label">Experience</label>
                <select name="experience" id="experience" onChange={this.handleInputChange} style={selectStyle} className="form-control">
                  <option value="">Select Experience</option>
                  {this.state.experiences.map(exp => (
                    <option key={exp} value={exp} > {exp} Years</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="skill" className="label">skills</label>
                <select name="skill" id="skill" onChange={this.handleInputChange} style={selectStyle} className="form-control">
                  <option value="">Select Skills</option>
                  {this.state.skills.map(skill => (
                    <option key={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="company" className="label">Company</label>
                <select name="company" id="company" onChange={this.handleInputChange} style={selectStyle} className="form-control">
                  <option value="">Select Company</option>
                  {this.state.companies.map(company => (
                    <option key={company}>{company}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="expired" className="label">Show Jobs</label>
                <select name="expired" onChange={this.handleInputChange} style={selectStyle} className="form-control">
                  <option value="active">Only Active</option>
                  <option value="expired">With Expired</option>
                </select>
              </div>

              <div className="form-group col-md-1">
                <label htmlFor="search" className="label">&nbsp;</label>
                <button id="search" onClick={this.search} className="btn btn-primary form-control">Search</button>
              </div>
              <div className="form-group col-md-1">
                <label htmlFor="sort" className="label">Sort By</label>
                <select name="sort" onChange={this.sortBy} className="form-control">
                  <option>Sort Jobs</option>
                  <option value="company">Company</option>
                  <option value="experience">Experience</option>
                </select>
              </div>
              
            </form>
          </div>
        </div>
        <Job data={this.state.jobs} />
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="Page navigation example">
              <ul className="pagination pagination-sm justify-content-end">
                {renderPageNumbers}
              </ul>
            </nav>
          </div>
        </div>
      </div >
    );
  }
}

