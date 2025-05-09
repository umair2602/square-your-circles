import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function ProcessPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="Our Process"
                subtitle="How We Square Your Circles"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Process Steps */}
                        <div className="border-l-4 border-primary ml-6 pl-8 pb-8 space-y-16">
                            {/* Step 1 */}
                            <div className="relative">
                                <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary"></div>
                                <h3 className="text-3xl font-bold mb-4">1. Discovery</h3>
                                <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                                    <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                        <p className="text-gray-500 italic">Step description will appear here</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative">
                                <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary"></div>
                                <h3 className="text-3xl font-bold mb-4">2. Strategy</h3>
                                <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                                    <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                        <p className="text-gray-500 italic">Step description will appear here</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative">
                                <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary"></div>
                                <h3 className="text-3xl font-bold mb-4">3. Implementation</h3>
                                <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                                    <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                        <p className="text-gray-500 italic">Step description will appear here</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative">
                                <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary"></div>
                                <h3 className="text-3xl font-bold mb-4">4. Evaluation</h3>
                                <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                                    <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                                        <p className="text-gray-500 italic">Step description will appear here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 