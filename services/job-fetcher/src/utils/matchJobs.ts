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
  workLocation: string[];
  includeKeywords: string[];
  excludeKeywords: string[];
  excludeCompanies: string[];
};

const weights = {
  titleMatch: 30,
  locationMatch: 20,
  includeKeyword: 10,
};

function normalize(str?: string): string {
  return str?.toLowerCase().trim() || '';
}

export function matchJobs(
  jobs: Job[],
  preferences: Preferences
): (Job & { matchScore: number })[] {
  return jobs
    .map((job) => {
      let score = 0;

      const title = normalize(job.title);
      const company = normalize(job.company);
      const location = normalize(job.location);
      const description = normalize(job.description);

      // ❌ Company Exclusion
      if (
        preferences.excludeCompanies.some((c) =>
          company.includes(c.toLowerCase())
        )
      ) {
        return null;
      }

      // ❌ Keyword Exclusion
      if (
        preferences.excludeKeywords.some((k) =>
          description.includes(k.toLowerCase())
        )
      ) {
        return null;
      }

      // ✅ Title Match
      if (
        preferences.jobTitles.some((t) => title.includes(t.toLowerCase()))
      ) {
        score += weights.titleMatch;
      }

      // ✅ Location Match
      if (
        preferences.workLocation.some((loc) =>
          location.includes(loc.toLowerCase())
        )
      ) {
        score += weights.locationMatch;
      }

      // ✅ Included Keywords
      const matchedKeywords = preferences.includeKeywords.filter((k) =>
        description.includes(k.toLowerCase())
      );
      score += matchedKeywords.length * weights.includeKeyword;

      return {
        ...job,
        matchScore: score,
      };
    })
    .filter((j): j is Job & { matchScore: number } => j !== null)
    .sort((a, b) => b.matchScore - a.matchScore);
}
