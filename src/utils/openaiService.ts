import * as pdfjsLib from 'pdfjs-dist';
import { MenuAnalysis } from '@/types/menuAnalysis';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// File conversion utilities
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log('File converted to base64 successfully');
      resolve(reader.result as string);
    };
    reader.onerror = error => {
      console.error('Error converting file to base64:', error);
      reject(error);
    };
  });
};

// PDF text extraction
const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Prompt building
const buildAnalysisPrompt = (
  dietaryPrefs: string[],
  allergies: string[],
  safetyMode: boolean,
  selectedMeal: string
): string => {
  const hasAllergens = allergies.length > 0;
  
  return `You are NutriSnap, an AI nutritionist specializing in menu analysis for people with dietary restrictions. Analyze this ${selectedMeal} menu and provide personalized recommendations.

User Profile:
- Meal Type: ${selectedMeal}
- Dietary Preferences: ${dietaryPrefs.length > 0 ? dietaryPrefs.join(', ') : 'None specified'}
- Known Allergies: ${hasAllergens ? allergies.join(', ') : 'None specified'}
- Safety Mode: ${safetyMode ? 'ENABLED - Extra cautious analysis' : 'DISABLED'}

For ${selectedMeal}, prioritize main dishes and entrees. Only recommend side dishes if they can serve as a complete meal or if main options are very limited.

CRITICAL INSTRUCTIONS FOR FLAGGED ITEMS:
${hasAllergens ? `
- Flag items containing: ${allergies.join(', ')}
- Include cross-contamination warnings for shared preparation areas
- Mark items as "AVOID" if they contain user's allergens
` : `
- Since no allergies were specified, focus on flagging extremely unhealthy items instead of allergen concerns
- Flag items that are excessively high in calories, sodium, sugar, or unhealthy fats
- Flag heavily processed foods, items with excessive additives, or anything that poses general health risks
- Items should only be flagged if they are genuinely problematic from a health perspective
`}

Your response must be a valid JSON object with this exact structure:
{
  "recommendations": [
    {
      "dish": "Exact dish name from menu",
      "reason": "Why this is a good choice for ${selectedMeal} considering user's needs",
      "modification": "Optional suggestion to make it safer/healthier",
      "nutrition": {
        "calories": "estimated range",
        "protein": "estimated amount",
        "fiber": "estimated amount",
        "key_nutrients": "main vitamins/minerals"
      },
      "rank": number from 1-10 (10 being perfect match)
    }
  ],
  "flaggedItems": [
    {
      "dish": "Exact dish name",
      "warning": "${hasAllergens ? 'Specific allergen or cross-contamination warning' : 'Specific health concern (high sodium, excessive calories, etc.)'}",
      "allergens": ["list of relevant allergens if any"],
      "reason": "Detailed explanation of why to avoid"
    }
  ],
  "generalNotes": "Brief safety advice and dining tips"
}

${safetyMode ? `
SAFETY MODE ACTIVATED: Be extra cautious. When in doubt, err on the side of caution and recommend asking restaurant staff about ingredients and preparation methods.
` : ''}

DISCLAIMER: Add this note to generalNotes: "This analysis is for informational purposes only. Always verify ingredients with restaurant staff if you have severe allergies or medical conditions. We are not responsible for any adverse reactions."

Provide 3-7 recommendations ranked by safety and nutritional value for ${selectedMeal}. Focus on dishes that align with the user's dietary needs and meal timing.`;
};

// OpenAI API call
const callOpenAIAPI = async (
  prompt: string,
  imageData: string,
  apiKey: string
): Promise<MenuAnalysis> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 2048,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API Error:', errorText);
    
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
    } else if (response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a moment.');
    } else if (response.status === 413) {
      throw new Error('Image is too large. Please try a smaller image.');
    } else {
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response from OpenAI API');
  }

  const content = data.choices[0].message.content?.trim() ?? '';
const cleanedContent = content
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/\s*```$/, '')
  .trim();
  
  try {
    const analysis = JSON.parse(cleanedContent) as MenuAnalysis;
    
    // Validate the response structure
    if (!analysis.recommendations || !Array.isArray(analysis.recommendations)) {
      throw new Error('Invalid analysis format: missing or invalid recommendations');
    }
    
    if (!analysis.flaggedItems || !Array.isArray(analysis.flaggedItems)) {
      analysis.flaggedItems = [];
    }
    
    return analysis;
  } catch (parseError) {
    console.error('⚠️ Failed to parse OpenAI JSON:', parseError);
    console.error('Raw response:', cleanedContent);
    throw new Error('Menu analysis failed due to invalid JSON format.');
  }
};

// Main analysis function
export const analyzeMenu = async (
  imageFile: File,
  apiKey: string,
  dietaryPrefs: string[],
  allergies: string[],
  safetyMode: boolean,
  selectedMeal: string
): Promise<MenuAnalysis> => {
  try {
    console.log('Starting menu analysis...');
    
    let analysisData: string;
    
    if (imageFile.type === 'application/pdf') {
      console.log('Processing PDF file...');
      const extractedText = await extractTextFromPdf(imageFile);
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Could not extract text from PDF. Please ensure the PDF contains readable text.');
      }
      
      // For PDF, we'll use text analysis instead of image analysis
      const prompt = buildAnalysisPrompt(dietaryPrefs, allergies, safetyMode, selectedMeal);
      const textPrompt = `${prompt}\n\nMenu Text:\n${extractedText}`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: textPrompt
            }
          ],
          max_tokens: 2048,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API Error:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a moment.');
        } else {
          throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }
  
      // Clean markdown code blocks and parse JSON safely
      const content = data.choices[0].message.content?.trim() ?? '';

const cleanedContent = content
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/\s*```$/, '')
  .trim();

      
      try {
        const analysis = JSON.parse(cleanedContent) as MenuAnalysis;
        
        // Validate the response structure
        if (!analysis.recommendations || !Array.isArray(analysis.recommendations)) {
          throw new Error('Invalid analysis format: missing or invalid recommendations');
        }
        
        if (!analysis.flaggedItems || !Array.isArray(analysis.flaggedItems)) {
          analysis.flaggedItems = [];
        }
        
        return analysis;
      } catch (parseError) {
        console.error('⚠️ Failed to parse OpenAI JSON:', parseError);
        console.error('Raw response:', cleanedContent);
        throw new Error('Menu analysis failed due to invalid JSON format.');
      }
    } else {
      console.log('Processing image file...');
      analysisData = await fileToBase64(imageFile);
      const prompt = buildAnalysisPrompt(dietaryPrefs, allergies, safetyMode, selectedMeal);
      return await callOpenAIAPI(prompt, analysisData, apiKey);
    }
  } catch (error) {
    console.error('Menu analysis error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during analysis');
    }
  }
};

// Re-export types for backward compatibility
export type { MenuAnalysis } from '@/types/menuAnalysis';
