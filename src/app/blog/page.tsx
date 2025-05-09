import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function BlogPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="Our Blog"
                subtitle="Insights and Updates"
            >
                <div className="max-w-4xl mx-auto">
                    {/* Featured Post */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm mb-12">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2">
                                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                                    <p className="text-gray-500">Featured Post Image</p>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <span className="text-sm text-primary font-medium mb-2 block">Featured</span>
                                <h3 className="text-3xl font-bold mb-3">The Art of Squaring Circles</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">August 25, 2023</p>
                                <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md mb-4">
                                    <p className="text-gray-500 italic">Post excerpt will appear here</p>
                                </div>
                                <button className="bg-primary text-white px-4 py-2 rounded-md">Read More</button>
                            </div>
                        </div>
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Post 1 */}
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                <p className="text-gray-500">Post Image</p>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Design Principles for Modern Websites</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">July 15, 2023</p>
                            <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                <p className="text-gray-500 italic">Post excerpt will appear here</p>
                            </div>
                        </div>

                        {/* Post 2 */}
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                <p className="text-gray-500">Post Image</p>
                            </div>
                            <h3 className="text-xl font-bold mb-2">The Future of Digital Experiences</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">June 28, 2023</p>
                            <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                <p className="text-gray-500 italic">Post excerpt will appear here</p>
                            </div>
                        </div>

                        {/* Post 3 */}
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                <p className="text-gray-500">Post Image</p>
                            </div>
                            <h3 className="text-xl font-bold mb-2">User Experience: Beyond the Basics</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">May 12, 2023</p>
                            <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                <p className="text-gray-500 italic">Post excerpt will appear here</p>
                            </div>
                        </div>

                        {/* Post 4 */}
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                            <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                                <p className="text-gray-500">Post Image</p>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Emerging Tech Trends for 2023</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">April 3, 2023</p>
                            <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                <p className="text-gray-500 italic">Post excerpt will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 