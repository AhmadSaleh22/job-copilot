import axios from 'axios';

export async function fetchUserPreferences(userId: string, token: string) {
  try {
    const response = await axios.get(`http://localhost:4001/preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (err: any) {
    console.error('Error fetching preferences:', err.message);
    return null;
  }
}
