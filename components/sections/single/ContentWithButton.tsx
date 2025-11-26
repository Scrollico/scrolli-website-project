'use client';

import { useState, useEffect } from 'react';
import FollowButton from '@/components/ui/follow-button';

interface ContentWithButtonProps {
  content: string;
}

export default function ContentWithButton({ content }: ContentWithButtonProps) {
  const [splitContent, setSplitContent] = useState<{ firstHalf: string; secondHalf: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Handle empty or missing content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      setSplitContent({ firstHalf: '', secondHalf: '' });
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Find all paragraphs
    const paragraphs = Array.from(tempDiv.querySelectorAll('p')).filter(
      p => p.textContent && p.textContent.trim().length > 50
    );

    if (paragraphs.length < 2) {
      setSplitContent({ firstHalf: content, secondHalf: '' });
      setIsProcessing(false);
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
      setIsProcessing(false);
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
    setIsProcessing(false);
  }, [content]);

  // Show loading state only briefly during processing
  if (isProcessing) {
    return null; // Don't show loading text, just render nothing until ready
  }

  // Handle empty content - show a helpful message
  if (!content || content.trim().length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">İçerik henüz yüklenemedi.</p>
        <p className="text-sm">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  // If no split or no second half, render content directly
  if (!splitContent || !splitContent.secondHalf) {
    return <div className="entry-main-content dropcap article-content" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className="entry-main-content dropcap article-content">
      <div dangerouslySetInnerHTML={{ __html: splitContent.firstHalf }} />
      <div className="my-8 flex justify-center">
        <FollowButton topic="Alara AI" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: splitContent.secondHalf }} />
    </div>
  );
}

