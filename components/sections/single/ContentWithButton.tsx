'use client';

import { useState, useEffect } from 'react';
import FollowButton from '@/components/ui/follow-button';

interface ContentWithButtonProps {
  content: string;
}

export default function ContentWithButton({ content }: ContentWithButtonProps) {
  const [splitContent, setSplitContent] = useState<{ firstHalf: string; secondHalf: string } | null>(null);

  useEffect(() => {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find all paragraphs
    const paragraphs = Array.from(tempDiv.querySelectorAll('p')).filter(
      p => p.textContent && p.textContent.trim().length > 50
    );

    if (paragraphs.length < 2) {
      setSplitContent({ firstHalf: content, secondHalf: '' });
      return;
    }

    // Calculate middle paragraph index
    const middleIndex = Math.floor(paragraphs.length / 2);
    const middleParagraph = paragraphs[middleIndex];

    // Find the middle paragraph in the original structure
    const allParagraphs = Array.from(tempDiv.querySelectorAll('p'));
    const middleIndexInAll = allParagraphs.findIndex(p => p === middleParagraph);

    if (middleIndexInAll < 0) {
      setSplitContent({ firstHalf: content, secondHalf: '' });
      return;
    }

    // Split content at the middle paragraph
    const firstHalfDiv = tempDiv.cloneNode(true) as HTMLElement;
    const firstHalfParagraphs = Array.from(firstHalfDiv.querySelectorAll('p'));
    firstHalfParagraphs.slice(middleIndexInAll + 1).forEach(p => p.remove());

    const secondHalfDiv = tempDiv.cloneNode(true) as HTMLElement;
    const secondHalfParagraphs = Array.from(secondHalfDiv.querySelectorAll('p'));
    secondHalfParagraphs.slice(0, middleIndexInAll + 1).forEach(p => p.remove());

    setSplitContent({
      firstHalf: firstHalfDiv.innerHTML,
      secondHalf: secondHalfDiv.innerHTML,
    });
  }, [content]);

  if (!splitContent || !splitContent.secondHalf) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: splitContent.firstHalf }} />
      <div className="my-8 flex justify-center">
        <FollowButton topic="Alara AI" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: splitContent.secondHalf }} />
    </>
  );
}

