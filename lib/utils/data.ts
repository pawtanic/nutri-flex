export class DataUtils {
    /**
     * Utility function to convert plain text to rich text format
     *
     * @param text The plain text to convert
     * @returns The rich text object
     */
    public static convertToRichText(text: string) {
        return {
            root: {
                type: "root",
                children: [
                    {
                        type: "paragraph",
                        children: [{ text }],
                        version: 0,
                    }
                ],
                direction: null,
                format: "",
                indent: 0,
                version: 1,
            }
        };
    }
}