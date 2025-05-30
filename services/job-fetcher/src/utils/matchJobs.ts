type Job = {
    id: string;
    title?: string;
    company?: string;
    location?: string;
    url?: string;
    description?: string;
    source: string;
  };
  
  type Preferences = {
    jobTitles: string[];
    jobTypes: string[];
    workLocation: string;
    includeKeywords: string[];
    excludeKeywords: string[];
    excludeCompanies: string[];
  };
  
  export function matchJobs(jobs: Job[], preferences: Preferences): (Job & { matchScore: number })[] {
    return jobs
      .map(job => {
        let score = 0;
  
        const title = job.title?.toLowerCase() || '';
        const company = job.company?.toLowerCase() || '';
        const location = job.location?.toLowerCase() || '';
        const description = job.description?.toLowerCase() || '';
  
        const titleMatch = preferences.jobTitles.some(pref =>
          title.includes(pref.toLowerCase())
        );
        if (titleMatch) score += 30;
  
        const locationMatch = location.includes(preferences.workLocation.toLowerCase());
        if (locationMatch) score += 20;
  
        const companyExcluded = preferences.excludeCompanies.some(c =>
          company.includes(c.toLowerCase())
        );
        if (companyExcluded) score = -1;
  
        const hasExcludedKeywords = preferences.excludeKeywords.some(keyword =>
          description.includes(keyword.toLowerCase())
        );
        if (hasExcludedKeywords) score = -1;
  
        const includedKeywordCount = preferences.includeKeywords.filter(keyword =>
          description.includes(keyword.toLowerCase())
        ).length;
        score += includedKeywordCount * 10;
  
        return {
          ...job,
          matchScore: score,
        };
      })
      .filter(job => job.matchScore >= 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
  