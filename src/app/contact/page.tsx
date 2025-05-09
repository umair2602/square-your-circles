import ScaffoldNavigation from '@/components/layouts/ScaffoldNavigation';
import ScaffoldPageLayout from '@/components/layouts/ScaffoldPageLayout';

export default function ContactPage() {
    return (
        <>
            <ScaffoldPageLayout
                title="Contact Us"
                subtitle="Get in Touch with Our Team"
            >
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                        <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                        <div className="h-72 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
                            <p className="text-gray-500 italic">Contact form will appear here</p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-semibold mb-4">Our Location</h3>
                            <div className="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-md mb-4">
                                <p className="text-gray-500 italic">Map will appear here</p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                123 Business Street<br />
                                London, UK<br />
                                SW1A 1AA
                            </p>
                        </div>

                        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-sm">
                            <h3 className="text-2xl font-semibold mb-4">Contact Details</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                        📞
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">+44 (0) 123 456 7890</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                        ✉️
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">info@squareyourcircles.com</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                        🕒
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">Mon-Fri: 9am - 5pm</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </ScaffoldPageLayout>
            <ScaffoldNavigation />
        </>
    );
} 