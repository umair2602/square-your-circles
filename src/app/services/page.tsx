import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function ServicesPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="Our Services"
                subtitle="How We Can Help Your Business"
            >
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Strategic Planning</h3>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Service details will appear here</p>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Product Development</h3>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Service details will appear here</p>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Growth Marketing</h3>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Service details will appear here</p>
                        </div>
                    </div>

                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Digital Transformation</h3>
                        <div className="h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Service details will appear here</p>
                        </div>
                    </div>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 