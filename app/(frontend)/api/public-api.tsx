class ApiClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async get<T>(path: string): Promise<{ data: T }> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = (await response.json()) as T;
    return { data };
  }
}

export default ApiClient;
const NINJAS_API_BASE_URL = 'https://api.api-ninjas.com/v1';
const ninjasApiClient = new ApiClient(NINJAS_API_BASE_URL, {
  'X-Api-Key': process.env.NEXT_PUBLIC_NINJAS_API_KEY || '',
});

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export const exerciseKeys = {
  all: ['exercises'] as const,
  byMuscle: (muscle: string) => [...exerciseKeys.all, muscle] as const,
};

export const exerciseApi = {
  getByMuscle: async (muscle: string): Promise<Exercise[]> => {
    const response = await ninjasApiClient.get<Exercise[]>(`/exercises?muscle=${muscle}`);
    return response.data;
  },
};
