'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface BentoCardProps {
  icon?: React.ElementType;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleAccessory?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
}

const BASE_CARD_CLASSES = 'rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 w-full h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-card/90';
const DEFAULT_PADDING = 'p-8';

export function BentoCard({
  icon: Icon,
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  titleAccessory,
  isLoading,
  onClick,
}: BentoCardProps) {
  return (
    <div
      className={cn(BASE_CARD_CLASSES, DEFAULT_PADDING, 'flex flex-col', className)}
      onClick={onClick}
    >
      <div className={cn('flex justify-between items-start mb-4', headerClassName)}>
        <div className="space-y-1.5">
          <h2 className="font-semibold text-foreground/90 flex items-center gap-2">
            {title}
            {titleAccessory}
          </h2>
          {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon size={18} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className={cn('grow', contentClassName)}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-2 border-primary/20"></div>
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
