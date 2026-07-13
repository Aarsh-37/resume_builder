import { NextResponse } from 'next/server';
import HTMLToDOCX from 'html-to-docx';
import { marked } from 'marked';

export async function POST(req: Request) {
  try {
    const { markdown } = await req.json();
    
    if (!markdown) {
      return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
    }

    // Convert markdown to HTML
    const htmlString = marked.parse(markdown) as string;
    
    // Add some basic styling wrapper to the HTML for better Word formatting
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; }
          h1, h2, h3 { color: #111111; margin-top: 12pt; margin-bottom: 6pt; border-bottom: 1px solid #cccccc; }
          p { margin-bottom: 8pt; }
          ul, ol { margin-left: 20pt; margin-bottom: 8pt; }
        </style>
      </head>
      <body>
        ${htmlString}
      </body>
      </html>
    `;

    // Convert HTML to DOCX buffer
    const fileBuffer = await HTMLToDOCX(styledHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    
    // Return as a downloadable file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="resume.docx"'
      }
    });
  } catch (error: any) {
    console.error('Word export error:', error);
    return NextResponse.json({ error: error.message || 'Failed to export Word document' }, { status: 500 });
  }
}
