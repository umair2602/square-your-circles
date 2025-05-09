import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function CaseStudiesPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="Case Studies"
                subtitle="Real-World Solutions and Results"
            >
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Case Study 1 */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                            <p className="text-gray-500">Case Study Image</p>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Tech Startup Rebrand</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Category: Brand Identity</p>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Case study summary will appear here</p>
                        </div>
                    </div>

                    {/* Case Study 2 */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                            <p className="text-gray-500">Case Study Image</p>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">E-commerce Platform</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Category: Web Development</p>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Case study summary will appear here</p>
                        </div>
                    </div>

                    {/* Case Study 3 */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                            <p className="text-gray-500">Case Study Image</p>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Healthcare App</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Category: Mobile Development</p>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Case study summary will appear here</p>
                        </div>
                    </div>

                    {/* Case Study 4 */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                            <p className="text-gray-500">Case Study Image</p>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Financial Dashboard</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Category: Data Visualization</p>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Case study summary will appear here</p>
                        </div>
                    </div>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 