'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import Navbar from '@/components/common/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Background watermark */}
            <BrandWatermark opacity={0.05} size="100vh" blur={1.2} />

            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 tracking-tight">About Us</h1>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-600 mb-6">
                            Square Your Circles is a platform dedicated to tracking carbon emissions and encouraging
                            sustainable practices through innovative ideas and community engagement.
                        </p>

                        <p className="text-lg text-gray-600 mb-6">
                            Our mission is to make carbon tracking accessible and actionable for everyone. Through our
                            platform, users can contribute ideas, track their impact, and join a community of like-minded
                            individuals committed to creating a sustainable future.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Our Vision</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            We envision a world where every individual and organization has the tools and knowledge
                            to understand and minimize their carbon footprint. By making carbon data accessible and
                            engaging, we aim to inspire action at all levels of society.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Our Team</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Founded by a diverse group of experts in climate science, technology, and design,
                            Square Your Circles brings together different perspectives to tackle one of the most
                            pressing challenges of our time.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
} 