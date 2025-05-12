'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import Navbar from '@/components/common/Navbar';

export default function BlogPage() {
    const blogPosts = [
        {
            id: 1,
            title: 'Understanding Carbon Footprints',
            date: 'July 15, 2023',
            author: 'Alex Johnson',
            excerpt: 'A comprehensive guide to understanding how personal choices impact carbon emissions and what steps individuals can take to reduce their footprint.',
            category: 'Education'
        },
        {
            id: 2,
            title: 'Latest Developments in Climate Technology',
            date: 'August 2, 2023',
            author: 'Maria Rodriguez',
            excerpt: 'Exploring cutting-edge technologies that are revolutionizing how we track and reduce carbon emissions across various industries.',
            category: 'Technology'
        },
        {
            id: 3,
            title: 'Policy Changes Impacting Carbon Markets',
            date: 'August 28, 2023',
            author: 'David Chen',
            excerpt: 'An analysis of recent global policy changes and their implications for carbon markets and sustainability initiatives worldwide.',
            category: 'Policy'
        },
        {
            id: 4,
            title: 'Community Success Stories',
            date: 'September 10, 2023',
            author: 'Sarah Williams',
            excerpt: 'Highlighting remarkable achievements from communities that have implemented successful carbon reduction strategies.',
            category: 'Community'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Background watermark */}
            <BrandWatermark opacity={0.05} size="100vh" blur={1.2} />

            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Our Blog</h1>
                    <p className="text-lg text-gray-600 mb-10">
                        Insights, updates, and educational content about carbon tracking and sustainability.
                    </p>

                    <div className="grid gap-10">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="border-b border-gray-200 pb-8 mb-2">
                                <div className="mb-4">
                                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <span>{post.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>By {post.author}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <a href="#" className="text-gray-700 font-medium hover:text-gray-900 inline-flex items-center">
                                    Read more
                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
} 