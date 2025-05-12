'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import Navbar from '@/components/common/Navbar';

export default function CaseStudiesPage() {
    const caseStudies = [
        {
            id: 1,
            title: 'Carbon Reduction in Urban Areas',
            subtitle: 'How city planning can reduce emissions',
            description: 'An exploration of innovative urban planning techniques that led to a 30% reduction in carbon emissions.',
        },
        {
            id: 2,
            title: 'Sustainable Manufacturing',
            subtitle: 'Transforming production processes',
            description: 'A detailed analysis of how manufacturing companies implemented sustainable practices while improving efficiency.',
        },
        {
            id: 3,
            title: 'Community-Led Climate Initiatives',
            subtitle: 'Grassroots approaches to climate action',
            description: 'Examining successful community programs that mobilized local resources to combat climate change.',
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
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Case Studies</h1>
                    <p className="text-lg text-gray-600 mb-10">
                        Explore real-world examples of carbon reduction strategies and their measurable impacts.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                        {caseStudies.map((study) => (
                            <div key={study.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">Case Study Image</span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{study.subtitle}</p>
                                    <p className="text-gray-600">{study.description}</p>
                                    <button className="mt-4 inline-flex items-center text-gray-700 font-medium hover:text-gray-900">
                                        Read more
                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
} 