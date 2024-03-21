import * as yaml from "yaml";

/**
 * Fetches project data from github
 *
 * This will look through each repository for a meta.yml file
 * If the project has this file, it will gather all project information
 * needed to populate the ProjectCard component
 *
 * Note: Github has a rate limit (at time of writing) of 60 requests per hour per ip address
 * for unauthenticated requests.  This means there's a chance that this page will not load properly
 * If the user is refreshing frequently.
 *
 * It may be useful to cache this data and only re-fetch on longer intervals if this becomes a frequent issue.
 * See https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
 *
 * @param  ghFullResponses, format here: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
 * @returns array of github api response & meta fields
 */
export const fetchGithubProjectData = async (ghFullResponses) => {
  const data = await Promise.all(ghFullResponses.map(fetchGithubSingleProject));

  // Filter projects without a meta file
  return data.filter((d) => d !== null);
};

/**
 * Fetches project data from github
 *
 * This will look for a meta.yml file in the project to populate data
 *
 * Note: Github has a rate limit (at time of writing) of 60 requests per hour per ip address
 * for unauthenticated requests.  This means there's a chance that this page will not load properly
 * If the user is refreshing frequently.
 *
 * It may be useful to cache this data and only re-fetch on longer intervals if this becomes a frequent issue.
 * See https://swr.vercel.app/docs/advanced/cache#localstorage-based-persistent-cache
 *
 * @param  ghResponse, format here: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
 * @returns github api response & meta fields
 */
export const fetchGithubSingleProject = async (ghResponse) => {
  const ghData = mapGhData(ghResponse);
  const meta = await fetchMetaFile(ghData.full_name);
  return meta
    ? {
        ...ghData,
        meta,
      }
    : null;
};

// Response format here: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28
const mapGhData = (ghResponse) => ({
  id: ghResponse.id,
  homepage: ghResponse.homepage,
  full_name: ghResponse.full_name,
  html_url: ghResponse.html_url,
  api_url: ghResponse.url,
  created_at: ghResponse.created_at,
  updated_at: ghResponse.updated_at,
});

const metaFile = "meta.yml";

/**
 * 
 * meta file example below:
 * 
title: OpenSac.org
project_type: website
project_status: active
description: The Open Sacramento website serves as a hub for technologists, developers, and civic-minded individuals to collaborate, access resources, and engage in projects aimed at enhancing civic innovation in the Sacramento area and beyond through technology
image_url: opensac.jpg
project_partner: Dan Fey
project_lead: Brianda Hernandez
technical_lead: Nate Bass
lead_designer: Help Needed
tags: html,css,javascript,react,github,figma
contributing:
  designer:
    difficulty: easy
    technologies: Figma
    ways_to_contribute: improve existing designs, design new pages
  developer:
    difficulty: easy
    frontend: html,css,javascript,react
    backend: n/a
    ways_to_contribute: Bug fixing, testing, maintenance; see issues on github
  project_manager:
    difficulty: easy
    technologies: github, slack
    ways_to_contribute: organize and create issues & milestones, work with team members to stay and track and remove roadblocks
roadmap:
  research:
    time_range: July 1, 2023 - August 31, 2023
    objective: Understand what we want from the new website
    outcome: Goals and direction for design and development
  design:
    time_range: September 1, 2023 - October 5, 2023
    objective: Create and iterate on figma designs for the website
    outcome: Completed figma desgins for all pages, enabling development to begin
  development:
    time_range: October 6, 2023 - April 1, 2023
    objective: Create react application reflecting figma designs
    outcome: Completed code for website reflecting the figma designs
  deployment:
    time_range: April 2, 2023 - April 9, 2023
    objective: Deploy react application to opensac.org
    outcome: Live hosted opensac.org website
  launch:
    time_range: April 10, 2023 - April 24, 2023
    objective: Raise awareness of new website and branding on social media
    outcome: People interested in Code for Sacramento are now aware of OpenSac.org
resources:
screenshots:
  - opensac.jpg
 * 
 * @param string ghFullName, in the form of "owner/repo"
 * @returns 
 */
const fetchMetaFile = async (ghFullName) => {
  const metaResponse = await fetch(
    `https://raw.githubusercontent.com/${ghFullName}/main/${metaFile}`
  );
  if (metaResponse.status === 404) {
    return null;
  } else if (!metaResponse.ok) {
    throw new Error(`Error fetching meta file: ${metaResponse.text()}`);
  }
  const textReponse = await metaResponse.text();

  return yaml.parse(textReponse);
};
