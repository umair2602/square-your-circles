import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function AboutPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="About Us"
                subtitle="Our Mission and Vision"
            >
                <div className="max-w-4xl mx-auto space-y-12">
                    <section className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
                        <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Content about company history will appear here</p>
                        </div>
                    </section>

                    <section className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Our Team</h3>
                        <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Team member profiles will appear here</p>
                        </div>
                    </section>

                    <section className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
                        <div className="h-16 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Company values will appear here</p>
                        </div>
                    </section>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 