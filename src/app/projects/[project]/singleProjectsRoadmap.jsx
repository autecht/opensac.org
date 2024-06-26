export default function SingleProjectsRoadmap({ sectionType, data }) {
  return (
    <>
      <section id="roadmap" className={``}>
        <h2 className="project-heading project-heading-underline">Roadmap</h2>
        <p className="project-section-paragraph">
          Know the current progress, scope, and stage of project
        </p>
        <div className="project-info-container-alt">
          <div>
            <p className="project-info-label">Research</p>
            <p className = "project-info-alt">{
            (()=> {if(data.meta.roadmap.research)
                    return data.meta.roadmap.research.time_range;
                  else
                    return null;})()}</p>
            <p className="project-info-label">Design</p>
            <p className = "project-info-alt">{(()=> {if(data.meta.roadmap.design)
                    return data.meta.roadmap.design.time_range;
                  else
                    return null;})()}</p>
            <p className="project-info-label">Development</p>
            <p className = "project-info-alt">{(()=> {if(data.meta.roadmap.development)
                    return data.meta.roadmap.development.time_range;
                  else
                    return null;})()}</p>
            <p className="project-info-label">Deployment</p>
            <p className = "project-info-alt">{(()=> {if(data.meta.roadmap.deployment)
                    return data.meta.roadmap.deployment.time_range;
                  else
                    return null;})()}</p>
            <p className="project-info-label">Launch</p>
            <p className = "project-info-alt">{(()=> {if(data.meta.roadmap.launch)
                    return data.meta.roadmap.launch.time_range;
                  else
                    return null;})()}</p>
          </div>
          <div>
            <h4 className="project-info-label">Objective</h4>
            <p className="project-paragraph project-info-line-top">
              {data.meta.roadmap.objective}
            </p>

            <h4 className="project-info-label">Comments</h4>
            <p className="project-paragraph project-info-line-top">
              {data.meta.roadmap.comments}
            </p>

            <h4 className="project-info-label">Outcome</h4>
            <p className="project-paragraph project-info-line-top">
              {data.meta.roadmap.outcome}
            </p>
            <div></div>
          </div>
        </div>
      </section>
    </>
  );
}
