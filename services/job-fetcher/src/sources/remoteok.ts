import axios from 'axios';

export async function fetchRemoteOkJobs() {
  try {
    const response = await axios.get('https://remoteok.com/api');

    // Remove the first item — RemoteOK includes meta/info in the first element
    const jobs = response.data.slice(1);

    return jobs.map((job: any) => ({
      id: String(job.id),
      title: job.position || job.title,
      company: job.company,
      location: job.location || 'Remote',
      url: job.url,
      description: job.description || '',
      source: 'RemoteOK'
    }));
  } catch (err: any) {
    console.error('[RemoteOK] fetch failed:', err.message);
    return [];
  }
}
