// This service now calls our secure backend endpoint instead of the Google API directly.
// This prevents exposing the API Key in the frontend code.

// When deployed, replace this empty string with your actual Cloud Run URL
// e.g., "https://nyc-doc-backend-xyz.a.run.app"
const API_BASE_URL = '';

export const refineMessageWithAI = async (currentText: string, category: string, role: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: currentText,
        category: category,
        role: role
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }

    return data.refinedText;

  } catch (error) {
    console.error("Error calling AI Refinement Endpoint:", error);
    // Fallback: return the original text if the server fails
    return currentText;
  }
};