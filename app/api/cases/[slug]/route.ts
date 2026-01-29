import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cache for generated cases (in production, use Redis or database)
const caseCache = new Map<string, any>();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Check cache first
    if (caseCache.has(slug)) {
      return NextResponse.json(caseCache.get(slug));
    }

    // Convert slug to case name (e.g., "r-v-oakes-1986" -> "R. v. Oakes, 1986")
    const caseName = slugToCaseName(slug);

    // Generate SEO-optimized case content using OpenAI
    const caseData = await generateCaseContent(caseName);

    // Cache the result
    caseCache.set(slug, caseData);

    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Error generating case content:', error);
    return NextResponse.json(
      { error: 'Failed to load case information' },
      { status: 500 }
    );
  }
}

function slugToCaseName(slug: string): string {
  // Convert "r-v-oakes-1986" to "R. v. Oakes"
  const parts = slug.split('-');

  // Handle "r-v-" prefix
  if (parts[0] === 'r' && parts[1] === 'v') {
    const year = parts[parts.length - 1];
    const name = parts.slice(2, -1)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `R. v. ${name}`;
  }

  // Handle "reference-re-" prefix
  if (parts[0] === 'reference' && parts[1] === 're') {
    const year = parts[parts.length - 1];
    const topic = parts.slice(2, -1)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `Reference re ${topic}`;
  }

  // Default: capitalize all words
  return parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function generateCaseContent(caseName: string) {
  const prompt = `You are a legal research expert. Generate comprehensive SEO-optimized content for the Supreme Court of Canada case: ${caseName}

Provide the following in JSON format:
{
  "name": "Full case name",
  "citation": "Neutral citation (e.g., [1986] 1 SCR 103)",
  "year": year as number,
  "court": "Supreme Court of Canada",
  "judges": ["List of judges who heard the case"],
  "summary": "One paragraph (100-150 words) clear summary of the case and its significance",
  "facts": "2-3 paragraphs describing the factual background",
  "issues": ["Array of key legal issues raised"],
  "holding": "2 paragraphs on what the court decided",
  "ratio": "2-3 paragraphs explaining the ratio decidendi (binding legal principle)",
  "impact": "2 paragraphs on the case's legal impact and subsequent application",
  "relatedCases": ["Array of 5-7 related case names"],
  "topics": ["Array of legal topics/areas, e.g., 'Charter Rights', 'Criminal Law', 'Constitutional Law'"]
}

Make the content:
- Accurate and authoritative
- Clear and accessible to lawyers
- SEO-optimized with natural keyword usage
- Comprehensive but readable
- Focused on practical legal application`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert legal researcher specializing in Canadian Supreme Court cases.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content generated');
  }

  return JSON.parse(content);
}
