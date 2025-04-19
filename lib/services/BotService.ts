import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';

/**
 * Interface for the AI request parameters
 */
interface AIRequestParams<T> {
    query: string;
    instruction?: string;
    context?: Record<string, any>;
    responseFormat: T;
    formattingInstructions: string;
}

class BotService {
    private readonly genAI: GoogleGenAI;
    private readonly model: string;
    private readonly config: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }

        this.genAI = new GoogleGenAI({ apiKey });
        this.model = process.env.GEMINI_MODEL || "gemini-pro";
        this.config = {
            topK: 64,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        };
    }

    /**
     * Generates an AI response using the Gemini API
     *
     * @param params The request parameters
     * @returns The AI-generated response
     */
    public async generateResponse<T>({
        query,
        instruction,
        context = {},
        formattingInstructions
    }: AIRequestParams<T>): Promise<T> {
        try {
            console.log('Generating AI response with:', { query, instruction, context });
            const prompt = this.constructPrompt(instruction ?? "", query, context, formattingInstructions);
            
            const result = await this.genAI.models.generateContent({
                model: this.model,
                config: this.config,
                contents: prompt,
            });

            const response = result.text;

            return this.parseResponse<T>(response!);
        } catch (error) {
            this.handleError(error);
        }
    }

    private constructPrompt(
        instruction: string,
        query: string,
        context: Record<string, any>,
        formattingInstructions: string
    ): string {
        let prompt = `${instruction}\n\n`;
        prompt += `User query: ${query}\n\n`;

        if (Object.keys(context).length > 0) {
            prompt += "Additional context:\n";
            for (const [key, value] of Object.entries(context)) {
                prompt += `${key}: ${JSON.stringify(value)}\n`;
            }
            prompt += "\n";
        }

        prompt += `Please provide a response in the following JSON format:\n${formattingInstructions}\n`;
        prompt += `Ensure the response is valid JSON and follows the exact structure provided.`;

        return prompt;
    }

    private parseResponse<T>(text: string): T {
        try {
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
                text.match(/```\n([\s\S]*?)\n```/) ||
                text.match(/({[\s\S]*})/);

            const jsonString = jsonMatch ? jsonMatch[1] : text;
            return JSON.parse(jsonString.trim()) as T;
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            console.log('Raw response:', text);
            throw new Error('Failed to parse AI response as JSON');
        }
    }

    private handleError(error: any): never {
        console.error('Error generating AI response:', error);

        const errorMessage = error?.message || "Unknown error";
        if (errorMessage.includes('models/') && errorMessage.includes('not found')) {
            console.error(`Invalid model specified: ${this.model}. Falling back to gemini-pro failed.`);
            throw new Error(`Failed to generate AI response: Invalid model specified. Please check your GEMINI_MODEL environment variable.`);
        }

        throw new Error(`Failed to generate AI response: ${errorMessage}`);
    }
}
const botService = new BotService();
export default botService;