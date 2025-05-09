'use client';

import { useMarkControl } from '@/hooks/useMarkControl';

export default function ExamplePage() {
    // This page has a lot of content, so we prefer the corner variant
    // You can use this hook in any page to control how the mark is displayed
    useMarkControl({ variant: 'corner' });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Example Page</h1>

            <p className="mb-4">
                This page demonstrates how to control the display of the squareyourcircles mark.
            </p>

            <p className="mb-4">
                On this page, we've specifically requested the corner variant using the useMarkControl hook.
            </p>

            {/* Rest of your page content */}
        </div>
    );
} 